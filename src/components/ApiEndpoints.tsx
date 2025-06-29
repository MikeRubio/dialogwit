import { useState } from "react";
import {
  Copy,
  Check,
  Key,
  Shield,
  Zap,
  Book,
  ExternalLink,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface ApiExample {
  title: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  endpoint: string;
  description: string;
  code: string;
  response: string;
}

export const ApiEndpoints = () => {
  const { user } = useAuth();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [selectedExample, setSelectedExample] =
    useState<string>("list-chatbots");

  // Mock API key - in production this would come from user settings
  const apiKey = "sk-1234567890abcdef1234567890abcdef";
  const baseUrl = import.meta.env.VITE_SUPABASE_URL
    ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`
    : "https://your-project.supabase.co/functions/v1";

  const apiExamples: ApiExample[] = [
    {
      title: "List Chatbots",
      method: "GET",
      endpoint: "/api/chatbots",
      description: "Retrieve all chatbots for the authenticated user",
      code: `curl -X GET "${baseUrl}/api/chatbots" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json"`,
      response: `{
  "success": true,
  "data": [
    {
      "id": "chatbot-123",
      "name": "Customer Support Bot",
      "description": "Handles customer inquiries",
      "status": "ready",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}`,
    },
    {
      title: "Send Message",
      method: "POST",
      endpoint: "/chat",
      description: "Send a message to a specific chatbot",
      code: `curl -X POST "${baseUrl}/chat" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "botId": "chatbot-123",
    "message": "Hello, how can you help me?",
    "userIp": "192.168.1.1"
  }'`,
      response: `{
  "success": true,
  "data": {
    "response": "Hello! I'm here to help you with any questions you have. What can I assist you with today?",
    "messageId": "msg-456",
    "timestamp": "2024-01-15T10:35:00Z"
  }
}`,
    },
    {
      title: "Get Chatbot Details",
      method: "GET",
      endpoint: "/api/chatbots/{id}",
      description: "Get detailed information about a specific chatbot",
      code: `curl -X GET "${baseUrl}/api/chatbots/chatbot-123" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json"`,
      response: `{
  "success": true,
  "data": {
    "id": "chatbot-123",
    "name": "Customer Support Bot",
    "description": "Handles customer inquiries",
    "status": "ready",
    "knowledge_base_processed": true,
    "total_messages": 1247,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-20T14:22:00Z"
  }
}`,
    },
    {
      title: "Add Bot Knowledge Content",
      method: "POST",
      endpoint: "/api/knowledge-base",
      description: "Add new content to a chatbot's Knowledge base",
      code: `curl -X POST "${baseUrl}/api/knowledge-base" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "chatbot_id": "chatbot-123",
    "content": "Our support hours are Monday to Friday, 9 AM to 5 PM EST.",
    "content_type": "text",
    "filename": "support-hours.txt"
  }'`,
      response: `{
  "success": true,
  "data": {
    "id": "kb-789",
    "chatbot_id": "chatbot-123",
    "content": "Our support hours are Monday to Friday, 9 AM to 5 PM EST.",
    "content_type": "text",
    "processed": false,
    "created_at": "2024-01-15T10:40:00Z"
  }
}`,
    },
    {
      title: "Get Chat Analytics",
      method: "GET",
      endpoint: "/api/analytics/{chatbotId}",
      description: "Retrieve analytics data for a specific chatbot",
      code: `curl -X GET "${baseUrl}/api/analytics/chatbot-123?period=30d" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json"`,
      response: `{
  "success": true,
  "data": {
    "total_messages": 1247,
    "unique_users": 342,
    "avg_response_time": 850,
    "satisfaction_rate": 87,
    "period": "30d",
    "daily_stats": [
      {
        "date": "2024-01-15",
        "messages": 45,
        "users": 23
      }
    ]
  }
}`,
    },
  ];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const selectedExampleData =
    apiExamples.find(
      (ex) => ex.title.toLowerCase().replace(/\s+/g, "-") === selectedExample
    ) || apiExamples[0];

  return (
    <div className="space-y-8 dark:bg-gray-900 min-h-screen p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-display tracking-tight mb-1">
          API Documentation
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Programmatic access to your chatbots and analytics data.
        </p>
      </div>

      {/* API Key Section */}
      <div className="bg-white/95 dark:bg-gray-800/95 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Key className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              API Authentication
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">
              Secure
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Use your API key to authenticate requests. Include it in the
            Authorization header as a Bearer token.
          </p>

          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your API Key
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 font-mono text-sm text-gray-900 dark:text-gray-100"
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-600 dark:text-gray-300"
                >
                  {showApiKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => copyToClipboard(apiKey, "api-key")}
                  className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-600 dark:text-gray-300"
                >
                  {copiedCode === "api-key" ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200">
                  Security Best Practices
                </h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 mt-1 space-y-1">
                  <li>
                    • Keep your API key secure and never expose it in
                    client-side code
                  </li>
                  <li>• Use environment variables to store your API key</li>
                  <li>
                    • Regenerate your API key if you suspect it has been
                    compromised
                  </li>
                  <li>• Monitor your API usage for unusual activity</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* API Examples */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Example Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white/95 dark:bg-gray-800/95 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              API Endpoints
            </h3>
            <nav className="space-y-2">
              {apiExamples.map((example) => (
                <button
                  key={example.title.toLowerCase().replace(/\s+/g, "-")}
                  onClick={() =>
                    setSelectedExample(
                      example.title.toLowerCase().replace(/\s+/g, "-")
                    )
                  }
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedExample ===
                    example.title.toLowerCase().replace(/\s+/g, "-")
                      ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-primary-800"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{example.title}</span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        example.method === "GET"
                          ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400"
                          : example.method === "POST"
                          ? "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400"
                          : example.method === "PUT"
                          ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400"
                          : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400"
                      }`}
                    >
                      {example.method}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {example.endpoint}
                  </p>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Example Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/95 dark:bg-gray-800/95 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {selectedExampleData.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedExampleData.description}
                </p>
              </div>
              <span
                className={`px-3 py-1 text-sm font-medium rounded-lg ${
                  selectedExampleData.method === "GET"
                    ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400"
                    : selectedExampleData.method === "POST"
                    ? "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400"
                    : selectedExampleData.method === "PUT"
                    ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400"
                    : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400"
                }`}
              >
                {selectedExampleData.method}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Request
                  </h4>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        selectedExampleData.code,
                        selectedExampleData.title
                      )
                    }
                    className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 px-2 py-1 rounded"
                  >
                    {copiedCode === selectedExampleData.title ? (
                      <Check className="h-4 w-4 mr-1" />
                    ) : (
                      <Copy className="h-4 w-4 mr-1" />
                    )}
                    {copiedCode === selectedExampleData.title
                      ? "Copied!"
                      : "Copy"}
                  </button>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 text-sm text-gray-100 font-mono overflow-x-auto">
                  <pre>{selectedExampleData.code}</pre>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Response
                </h4>
                <div className="bg-gray-900 rounded-lg p-4 text-sm text-gray-100 font-mono overflow-x-auto">
                  <pre>{selectedExampleData.response}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rate Limits & Usage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/95 dark:bg-gray-800/95 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center mb-4">
            <Zap className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Rate Limits
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Requests per minute
              </span>
              <span className="text-sm font-medium">100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Requests per hour
              </span>
              <span className="text-sm font-medium">1,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Requests per day
              </span>
              <span className="text-sm font-medium">10,000</span>
            </div>
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Rate limits are enforced per API key. Contact support for higher
                limits.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/95 dark:bg-gray-800/95 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center mb-4">
            <Book className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Resources
            </h3>
          </div>
          <div className="space-y-3">
            <a
              href="#"
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                API Reference
              </span>
              <ExternalLink className="h-4 w-4 text-gray-400 dark:text-gray-300" />
            </a>
            <a
              href="#"
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                SDK Documentation
              </span>
              <ExternalLink className="h-4 w-4 text-gray-400 dark:text-gray-300" />
            </a>
            <a
              href="#"
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Code Examples
              </span>
              <ExternalLink className="h-4 w-4 text-gray-400 dark:text-gray-300" />
            </a>
          </div>
        </div>
      </div>

      {/* Error Codes */}
      <div className="bg-white/95 dark:bg-gray-800/95 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Common Error Codes
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Solution
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600 dark:text-red-400">
                  401
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  Unauthorized
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  Check your API key and ensure it's included in the
                  Authorization header
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600 dark:text-red-400">
                  403
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  Forbidden
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  You don't have permission to access this resource
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600 dark:text-red-400">
                  404
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  Not Found
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  The requested resource doesn't exist
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600 dark:text-red-400">
                  429
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  Rate Limited
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  You've exceeded the rate limit. Wait before making more
                  requests
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600 dark:text-red-400">
                  500
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  Internal Server Error
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  Something went wrong on our end. Try again later
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
