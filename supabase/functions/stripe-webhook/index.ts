import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';
const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'), {
  apiVersion: '2024-04-10',
  appInfo: {
    name: 'Bolt Integration',
    version: '1.1.3'
  }
});
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': '*'
};
Deno.serve(async (req)=>{
  if (req.method === 'OPTIONS') return new Response('ok', {
    headers: corsHeaders
  });
  // Event handling
  const signature = req.headers.get('stripe-signature');
  const body = await req.text();
  let event;
  try {
    event = signature ? await stripe.webhooks.constructEventAsync(body, signature, Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '') : JSON.parse(body);
    if (!signature) console.log('⚠️ No signature — assuming test mode. Event type:', event.type);
  } catch (err) {
    console.error('❌ Webhook error:', err.message);
    return new Response(`Webhook Error: ${err.message}`, {
      status: 400,
      headers: corsHeaders
    });
  }
  // Only process subscription events
  const validEvents = [
    'customer.subscription.created',
    'customer.subscription.updated'
  ];
  if (!validEvents.includes(event.type)) {
    console.log(`ℹ️ Ignored event type: ${event.type}`);
    return new Response(JSON.stringify({
      received: true
    }), {
      headers: corsHeaders
    });
  }
  // Extract subscription info
  const subscription = event.data.object;
  const customerId = subscription.customer;
  const priceId = subscription.items?.data?.[0]?.price?.id;
  const currentPeriodStart = subscription.items?.data?.[0]?.current_period_start ? new Date(subscription.items.data[0].current_period_start * 1000) : null;
  const currentPeriodEnd = subscription.items?.data?.[0]?.current_period_end ? new Date(subscription.items.data[0].current_period_end * 1000) : null;
  if (!subscription || !customerId || !priceId || !currentPeriodStart || !currentPeriodEnd) {
    console.error('❌ Missing critical subscription info.');
    return new Response(JSON.stringify({
      received: true
    }), {
      headers: corsHeaders
    });
  }
  // Resolve user
  let { data: stripeCustomer } = await supabase.from('stripe_customers').select('user_id').eq('customer_id', customerId).single();
  if (!stripeCustomer?.user_id && subscription.metadata?.user_id) {
    await supabase.from('stripe_customers').insert({
      customer_id: customerId,
      user_id: subscription.metadata.user_id,
      created_at: new Date().toISOString()
    });
    stripeCustomer = {
      user_id: subscription.metadata.user_id
    };
  }
  const userId = stripeCustomer?.user_id;
  if (!userId) {
    console.error('❌ Could not resolve user_id from customer.');
    return new Response(JSON.stringify({
      received: true
    }), {
      headers: corsHeaders
    });
  }
  // Get plan details
  const { data: plan } = await supabase.from('subscription_plans').select('id, limits').eq('stripe_price_id_monthly', priceId).single();
  if (!plan) {
    console.error('❌ No plan found for price ID:', priceId);
    return new Response(JSON.stringify({
      received: true
    }), {
      headers: corsHeaders
    });
  }
  const planId = plan.id;
  // Update user subscription (without token_rollover)
  const { error: upsertError } = await supabase.from('user_subscriptions').upsert({
    user_id: userId,
    stripe_subscription_id: subscription.id,
    plan_id: planId,
    status: subscription.status,
    current_period_start: currentPeriodStart.toISOString(),
    current_period_end: currentPeriodEnd.toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end,
    updated_at: new Date().toISOString()
  }, {
    onConflict: 'user_id'
  });
  if (upsertError) {
    console.error('❌ Failed to update user_subscriptions:', upsertError.message);
  }
  // Get local subscription ID
  const { data: userSubRecord } = await supabase.from('user_subscriptions').select('id').eq('user_id', userId).eq('stripe_subscription_id', subscription.id).maybeSingle();
  const userSubscriptionId = userSubRecord?.id;
  // Update Stripe subscriptions table
  await supabase.from('stripe_subscriptions').upsert({
    customer_id: customerId,
    subscription_id: subscription.id,
    price_id: priceId,
    current_period_start: subscription.current_period_start,
    current_period_end: subscription.current_period_end,
    cancel_at_period_end: subscription.cancel_at_period_end,
    payment_method_brand: subscription.default_payment_method?.card?.brand ?? null,
    payment_method_last4: subscription.default_payment_method?.card?.last4 ?? null,
    status: subscription.status
  });
  // Prepare for rollover calculation
  const rolloverStart = new Date(currentPeriodStart);
  rolloverStart.setMonth(rolloverStart.getMonth() - 1);
  // Check if rollover for this period already exists
  const { data: existingRollover } = await supabase.from('token_rollovers').select('id, tokens_rolled_over').eq('user_id', userId).eq('subscription_id', userSubscriptionId).eq('from_period_start', currentPeriodStart.toISOString()).maybeSingle();
  if (!existingRollover) {
    // Calculate tokens used in previous period
    const { data: usage } = await supabase.from('usage_tracking').select('metric_value').eq('user_id', userId).eq('subscription_id', userSubscriptionId).eq('metric_name', 'chat_tokens_per_month').gte('period_start', rolloverStart.toISOString()).lt('period_end', currentPeriodStart.toISOString()).maybeSingle();
    const used = usage?.metric_value || 0;
    // Get previous plan's token limit
    const { data: prevSub } = await supabase.from('user_subscriptions').select('plan_id').eq('user_id', userId).lt('current_period_start', currentPeriodStart.toISOString()).order('current_period_start', {
      ascending: false
    }).limit(1).maybeSingle();
    let rolloverLimit = 0;
    if (prevSub?.plan_id) {
      const { data: prevPlan } = await supabase.from('subscription_plans').select('limits').eq('id', prevSub.plan_id).maybeSingle();
      rolloverLimit = prevPlan?.limits?.tokens_per_month || 0;
    } else {
      rolloverLimit = plan?.limits?.tokens_per_month || 0;
    }
    // Calculate unused tokens for this period (do NOT add previous rollovers)
    const rollover = Math.max(0, rolloverLimit - used);
    console.log('📊 Usage:', used);
    console.log('🎯 Previous plan limit:', rolloverLimit);
    console.log('📥 New rollover tokens:', rollover);
    if (rollover > 0 && userSubscriptionId) {
      const { error: insertError } = await supabase.from('token_rollovers').insert({
        user_id: userId,
        subscription_id: userSubscriptionId,
        tokens_rolled_over: rollover,
        from_period_start: currentPeriodStart.toISOString(),
        from_period_end: currentPeriodEnd.toISOString()
      });
      if (insertError) {
        console.error('❌ Failed to insert rollover data', insertError.message);
      }
    }
  } else {
    console.log('ℹ️ Rollover already exists for this period');
  }
  return new Response(JSON.stringify({
    received: true
  }), {
    headers: corsHeaders
  });
});
