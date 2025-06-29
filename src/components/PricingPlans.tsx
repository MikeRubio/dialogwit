import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useBilling } from "../hooks/useBilling";
import { useStripe } from "../hooks/useStripe";
import { stripeConfig } from "../stripe-config";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Zap,
  Crown,
  Building2,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

// ScrollToTop component (for auto-scroll to top on navigation)
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// GoBackButton component
const GoBackButton = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors mb-8 dark:bg-primary-700 dark:hover:bg-primary-800"
    >
      <ArrowLeft className="h-4 w-4 mr-2 inline" />
      Go Back
    </button>
  );
};

// FAQ Accordion Item
const FaqItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left font-semibold text-gray-900 dark:text-white"
      >
        <span>{question}</span>
        <span>{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && (
        <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
          {answer}
        </p>
      )}
    </div>
  );
};

// State for FAQ
import { useState } from "react";

const PricingPlans: React.FC = () => {
  const { user } = useAuth();
  const { subscription, isLoading: billingLoading } = useBilling();
  const { createCheckoutSession, isLoading: stripeLoading } = useStripe();
  const navigate = useNavigate();

  const handleSubscribe = async (priceId: string) => {
    try {
      await createCheckoutSession(priceId);
    } catch (error) {
      console.error("Failed to create checkout session:", error);
    }
  };

  const getPlanIcon = (planName: string) => {
    switch (planName) {
      case "Chatterwise Free":
        return (
          <Sparkles className="w-8 h-8 text-gray-500 dark:text-gray-400" />
        );
      case "Chatterwise Starter":
        return <Zap className="w-8 h-8 text-blue-500 dark:text-blue-400" />;
      case "Chatterwise Growth":
        return (
          <Crown className="w-8 h-8 text-purple-500 dark:text-purple-400" />
        );
      case "Chatterwise Business":
        return (
          <Building2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
        );
      default:
        return (
          <Sparkles className="w-8 h-8 text-gray-500 dark:text-gray-400" />
        );
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Subtle background accents (optional) */}
      <div className="absolute inset-0 opacity-20 dark:opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary-400/10 dark:bg-primary-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent-400/10 dark:bg-accent-400/5 rounded-full blur-3xl"></div>
      </div>

      <ScrollToTop />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12">
        <GoBackButton />
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Start building AI-powered chatbots today. Upgrade or downgrade at
            any time.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {stripeConfig.products.map((plan, idx) => {
            const isCurrentPlan = user
              ? plan.name
                  .toLowerCase()
                  .includes(subscription?.plan_name || "") ||
                plan.price ===
                  (subscription?.subscription_plans?.price_monthly || 0)
              : false;
            const isFreePlan = user ? plan.price === 0 : false;

            return (
              <motion.div
                key={plan.priceId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl flex flex-col h-full ${
                  plan.popular
                    ? "border-primary-500 dark:border-primary-400 ring-2 ring-primary-200 dark:ring-primary-900/30"
                    : "border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-400"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="p-8 flex flex-col flex-grow">
                  {/* Plan Header */}
                  <div className="text-center mb-6">
                    <div className="flex justify-center mb-4">
                      {getPlanIcon(plan.name)}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {plan.name.replace("Chatterwise ", "")}
                    </h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-gray-9 dark:text-white">
                        ${plan.price}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 ml-1">
                        /{plan.interval}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {plan.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8 flex-grow">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 dark:text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-7 dark:text-gray-300 text-sm">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Usage Limits */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">
                      Usage Limits
                    </h4>
                    <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex justify-between">
                        <span>Tokens/month:</span>
                        <span className="font-medium">
                          {formatNumber(plan.limits.tokens_per_month)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Documents:</span>
                        <span className="font-medium">
                          {plan.limits.max_documents}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Chatbots:</span>
                        <span className="font-medium">
                          {plan.limits.max_chatbots}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>API calls/min:</span>
                        <span className="font-medium">
                          {plan.limits.api_requests_per_minute}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => {
                      if (!user) {
                        navigate("/auth");
                      } else if (!isCurrentPlan && !isFreePlan) {
                        handleSubscribe(plan.priceId);
                      }
                    }}
                    disabled={
                      billingLoading ||
                      stripeLoading ||
                      (user &&
                        (isCurrentPlan ||
                          (isFreePlan && subscription?.plan_name)))
                    }
                    className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                      plan.popular
                        ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:from-primary-600 hover:to-accent-600 shadow-lg"
                        : isCurrentPlan
                        ? "bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        : "bg-gray-900 dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600"
                    } ${
                      billingLoading || stripeLoading
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {billingLoading || stripeLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </div>
                    ) : isCurrentPlan ? (
                      "Current Plan"
                    ) : !user ? (
                      "Sign Up / Login"
                    ) : (
                      `Get Started - $${plan.price}/${plan.interval}`
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-16"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            <FaqItem
              question="Can I change plans anytime?"
              answer="Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate the billing."
            />
            <FaqItem
              question="What happens if I exceed my limits?"
              answer="We'll notify you when you're approaching your limits. You can purchase add-ons or upgrade your plan to continue using the service."
            />
            <FaqItem
              question="Do you offer refunds?"
              answer="We offer a 30-day money-back guarantee for all paid plans. Contact support if you're not satisfied."
            />
            <FaqItem
              question="Is there a free trial?"
              answer="Yes! All new users start with our Free plan. You can upgrade anytime to access more features and higher limits."
            />
          </div>
        </motion.div>
      </div>

      {/* Global CTA */}
      <div className="w-full bg-gradient-to-r from-primary-600 to-accent-500 dark:from-primary-700 dark:to-accent-600 py-8 sticky bottom-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <button
            onClick={() =>
              !user
                ? navigate("/auth")
                : handleSubscribe(stripeConfig.products[0].priceId)
            }
            className="bg-white text-primary-600 px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:bg-white/90 transition-all"
          >
            {!user ? "Sign Up / Login" : "Get Started Free"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
