import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { Database } from "../lib/databaseTypes";

type ChatMessage = Database["public"]["Tables"]["chat_messages"]["Row"];

export const useChatMessages = (chatbotId: string) => {
  return useQuery({
    queryKey: ["chat_messages", chatbotId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("chatbot_id", chatbotId)
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as ChatMessage[];
    },
    enabled: !!chatbotId,
    refetchOnMount: "always"
  });
};

// export const useSendMessage = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({
//       chatbotId,
//       message,
//       userId,
//     }: {
//       chatbotId: string;
//       message: string;
//       userId: string;
//     }) => {
//       // Call the chat edge function
//       const response = await fetch(
//         `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
//           },
//           body: JSON.stringify({
//             chatbot_id: chatbotId,
//             message,
//             user_ip: userId,
//           }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to send message");
//       }

//       const data = await response.json();
//       return data;
//     },
//     onSuccess: (_, variables) => {
//       // Invalidate chat messages to refetch
//       queryClient.invalidateQueries({
//         queryKey: ["chat_messages", variables.chatbotId],
//       });
//     },
//   });
// };

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      chatbotId,
      message,
      userId,
      onChunk,
    }: {
      chatbotId: string;
      message: string;
      userId: string;
      onChunk: (chunk: string) => void;
    }) => {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            chatbot_id: chatbotId,
            message,
            user_ip: userId,
            stream: true,
          }),
        }
      );

      if (!response.ok || !response.body) {
        throw new Error("Failed to send message or stream not available");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let fullMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullMessage += chunk;
        onChunk(chunk);
      }

      return fullMessage;
    },
onSuccess: (_, { chatbotId }) => {
  // Invalidate the query for this chatbot's messages
  queryClient.invalidateQueries({
    queryKey: ["chat_messages", chatbotId || ""],
    exact: true,
  });
  // Manually refetch if you want to be extra sure
  queryClient.refetchQueries({
    queryKey: ["chat_messages", chatbotId || ""],
    exact: true,
  });
},
  });
};

export const useChatAnalytics = (chatbotId: string) => {
  return useQuery({
    queryKey: ["chat_analytics", chatbotId],
    enabled: !!chatbotId,
    queryFn: async () => {
      const baseQuery = supabase
        .from("chat_messages")
        .select("created_at, message, response");

      // If chatbotId is not "all", filter by it
      if (chatbotId !== "all") {
        baseQuery.eq("chatbot_id", chatbotId);
      }

      const { data, error } = await baseQuery;

      if (error) throw error;

      // Calculate analytics
      const totalMessages = data.length;
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);

      const todayMessages = data.filter(
        (msg) => new Date(msg.created_at) >= yesterday
      ).length;

      const weeklyMessages = data.filter(
        (msg) => new Date(msg.created_at) >= lastWeek
      ).length;

      // Group by day for chart data
      const dailyData = data.reduce((acc, msg) => {
        const date = new Date(msg.created_at).toDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const chartData = Object.entries(dailyData)
        .slice(-7)
        .map(([date, count]) => ({
          date: new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          messages: count,
        }));

      return {
        totalMessages,
        todayMessages,
        weeklyMessages,
        avgResponseLength:
          data.length > 0
            ? Math.round(
                data.reduce((sum, msg) => sum + msg.response.length, 0) /
                  data.length
              )
            : 0,
        chartData,
      };
    },
  });
};
