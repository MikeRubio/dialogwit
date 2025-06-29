import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Send,
  Bot,
  User,
  Loader,
  MessageCircle,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { useChatbot } from "../hooks/useChatbots";
import { useSendMessage } from "../hooks/useChatMessages";
import { useAuth } from "../hooks/useAuth";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  isLoading?: boolean;
}

export const PublicChat = () => {
  const { chatbotId } = useParams<{ chatbotId: string }>();
  const { data: chatbot, isLoading: chatbotLoading } = useChatbot(
    chatbotId || ""
  );
  const sendMessage = useSendMessage();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (chatbot) {
      setMessages([
        {
          id: "1",
          text: `Hello! I'm ${chatbot.name}. ${chatbot.description} How can I help you today?`,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    }
  }, [chatbot]);

  const handleSend = async () => {
    if (!inputValue.trim() || !chatbotId || sendMessage.isPending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: "",
      sender: "bot",
      timestamp: new Date(),
      isLoading: true,
    };
    setMessages((prev) => [...prev, loadingMessage]);

    // try {
    //   const response = await sendMessage.mutateAsync({
    //     chatbotId: chatbotId,
    //     message: inputValue,
    //     userId: user?.id || "NO_USER",
    //   });
    //   setMessages((prev) =>
    //     prev.map((msg) =>
    //       msg.id === loadingMessage.id
    //         ? { ...msg, text: response.response, isLoading: false }
    //         : msg
    //     )
    //   );
    // } catch {
    //   setMessages((prev) =>
    //     prev.map((msg) =>
    //       msg.id === loadingMessage.id
    //         ? {
    //             ...msg,
    //             text: "Sorry, I encountered an error. Please try again.",
    //             isLoading: false,
    //           }
    //         : msg
    //     )
    //   );
    // }
    try {
      let finalText = "";

      await sendMessage.mutateAsync({
        chatbotId: chatbotId,
        message: inputValue,
        userId: user?.id || "NO_USER",
        onChunk: (chunk) => {
          finalText += chunk;

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === loadingMessage.id
                ? { ...msg, text: finalText, isLoading: true }
                : msg
            )
          );
        },
      });

      // Once stream ends, mark message as done
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessage.id
            ? { ...msg, text: finalText, isLoading: false }
            : msg
        )
      );
    } catch {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessage.id
            ? {
                ...msg,
                text: "Sorry, I encountered an error. Please try again.",
                isLoading: false,
              }
            : msg
        )
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (chatbotLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading chatbot...</p>
        </div>
      </div>
    );
  }

  if (!chatbot) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Bot className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Chatbot Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The chatbot you're looking for doesn't exist or isn't available.
          </p>
        </div>
      </div>
    );
  }

  if (chatbot.status !== "ready") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Bot className="h-16 w-16 text-yellow-500 dark:text-yellow-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Chatbot Not Ready
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            This chatbot is still being processed. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-12">
      {/* Header */}
      <div className="bg-white/90 dark:bg-gray-900/90 shadow-sm border-b border-gray-200 dark:border-gray-800 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-primary-600 dark:bg-primary-700 rounded-full flex items-center justify-center mr-4">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 font-display tracking-tight">
                  {chatbot.name}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {chatbot.description}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Online
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div
          className={`bg-white/95 dark:bg-gray-800/95 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 ${
            isMinimized ? "h-16" : "h-[600px]"
          }`}
        >
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MessageCircle className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Chat with {chatbot.name}
                </h3>
              </div>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors duration-200"
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 h-[480px]">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl shadow-subtle transition-all duration-200 ${
                        message.sender === "user"
                          ? "bg-primary-600 text-white"
                          : "bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      <div className="flex items-start">
                        {message.sender === "bot" && (
                          <Bot className="h-4 w-4 mr-2 mt-0.5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          {message.isLoading ? (
                            <div className="flex items-center space-x-2">
                              <Loader className="h-4 w-4 animate-spin" />
                              <span className="text-sm">Thinking...</span>
                            </div>
                          ) : (
                            <p className="text-sm whitespace-pre-wrap">
                              {message.text}
                            </p>
                          )}
                          <span
                            className={`text-xs opacity-75 mt-2 block ${
                              message.sender === "user"
                                ? "text-white/80"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        {message.sender === "user" && (
                          <User className="h-4 w-4 ml-2 mt-0.5 text-white/80 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-b-2xl">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-600 focus:border-primary-400 dark:focus:border-primary-600 transition bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    disabled={sendMessage.isPending}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || sendMessage.isPending}
                    className="px-5 py-2 bg-primary-600 dark:bg-primary-700 text-white rounded-xl hover:bg-primary-700 dark:hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {sendMessage.isPending ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                  Powered by {chatbot.name} • Press Enter to send
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          This chatbot is powered by AI and trained on custom Bot Knowledge
        </p>
      </div>
    </div>
  );
};
