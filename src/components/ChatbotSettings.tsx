import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  useChatbot,
  useUpdateChatbot,
  useDeleteChatbot,
} from "../hooks/useChatbots";
import { useRAGSettings, useUpdateRAGSettings } from "../hooks/useRAGSettings";
import {
  Bot,
  ArrowLeft,
  Copy,
  Check,
  Trash2,
  Loader2,
  AlertCircle,
  Bookmark,
  Maximize2,
  Sliders,
  Minus,
  Type,
  Save,
  Globe,
  Settings,
  CheckCircle,
  Power,
} from "lucide-react";
import { ActionModal } from "./ActionModal";
import { motion } from "framer-motion";

export function ChatbotSettings() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: chatbot, isLoading } = useChatbot(id || "");
  const { data: ragSettings } = useRAGSettings(id || "");
  const updateChatbot = useUpdateChatbot();
  const updateRagSettings = useUpdateRAGSettings();
  const deleteChatbot = useDeleteChatbot();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    welcome_message: "",
    placeholder: "",
  });

  const [ragData, setRagData] = useState({
    temperature: 0.7,
    max_tokens: 500,
    similarity_threshold: 0.7,
    max_retrieved_chunks: 3,
    enable_citations: false,
    chunk_char_limit: 200,
    min_word_count: 5,
    stopwords: "hi,hello,ok,hmm,yes,no",
  });

  const [copied, setCopied] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [statusChangeStatus, setStatusChangeStatus] = useState<
    "idle" | "loading" | "error"
  >("idle");

  useEffect(() => {
    if (chatbot) {
      setFormData({
        name: chatbot.name || "",
        description: chatbot.description || "",
        welcome_message: chatbot.welcome_message || "",
        placeholder: chatbot.placeholder || "",
      });
    }
    if (ragSettings) {
      setRagData({
        temperature: ragSettings.temperature ?? 0.7,
        max_tokens: ragSettings.max_tokens ?? 500,
        similarity_threshold: ragSettings.similarity_threshold ?? 0.7,
        max_retrieved_chunks: ragSettings.max_retrieved_chunks ?? 3,
        enable_citations: ragSettings.enable_citations ?? false,
        chunk_char_limit: ragSettings.chunk_char_limit ?? 200,
        min_word_count: ragSettings.min_word_count ?? 5,
        stopwords: ragSettings.stopwords?.join(",") ?? "hi,hello,ok,hmm,yes,no",
      });
    }
  }, [chatbot, ragSettings]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRAGChange = (field: string, value: string | number | boolean) => {
    setRagData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!id) return;
    setSaveStatus("loading");
    try {
      await updateChatbot.mutateAsync({ id, updates: formData });
      await updateRagSettings.mutateAsync({
        chatbot_id: id,
        updates: {
          ...ragData,
          stopwords: ragData.stopwords
            .split(",")
            .map((w) => w.trim().toLowerCase())
            .filter(Boolean),
        },
      });
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch {
      setSaveStatus("error");
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteChatbot.mutateAsync(id);
      navigate("/chatbots");
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const toggleBotStatus = async () => {
    if (!chatbot || !id) return;
    setStatusChangeStatus("loading");
    try {
      await updateChatbot.mutateAsync({
        id,
        updates: {
          status: chatbot.status === "inactive" ? "ready" : "inactive",
        },
      });
      setStatusChangeStatus("idle");
    } catch {
      setStatusChangeStatus("error");
    }
  };

  const copyUrl = () => {
    const url = `${window.location.origin}/chat/${id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading || !chatbot) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600 dark:text-primary-400" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto px-4 py-8 space-y-8"
    >
      <ActionModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        action={{
          title: "Delete Chatbot",
          description:
            "This will permanently delete this bot and all related data.",
          affectedItems: [
            "Chatbot configuration and settings",
            "All chat history and messages",
            "Knowledge base content and embeddings",
            "User interactions and analytics data",
          ],
          onConfirm: handleDelete,
          actionLabel: "Delete Chatbot",
          actionColor: "red",
          actionIcon: <Trash2 className="h-4 w-4 mr-2" />,
          confirmationWord: "DELETE",
          note: "This action cannot be undone. All data will be permanently deleted from our servers.",
        }}
      />

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to={`/chatbots/${id}`}
          className="p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex items-center">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-full mr-3">
            <Bot className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {chatbot.name} Settings
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Configure your chatbot's behavior and appearance
            </p>
          </div>
        </div>
      </div>

      {/* General Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-6 space-y-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <Settings className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            General Info
          </h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Chatbot Name
            </label>
            <input
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter chatbot name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe what your chatbot does"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Welcome Message
            </label>
            <input
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              value={formData.welcome_message}
              onChange={(e) => handleChange("welcome_message", e.target.value)}
              placeholder="Hello! How can I help you today?"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              This message will be shown when a user starts a new conversation
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Input Placeholder
            </label>
            <input
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              value={formData.placeholder}
              onChange={(e) => handleChange("placeholder", e.target.value)}
              placeholder="Type your message..."
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Text shown in the input field before the user types
            </p>
          </div>
        </div>
      </motion.div>

      {/* Visibility & Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-6 space-y-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <Globe className="h-5 w-5 text-green-600 dark:text-green-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Visibility & Actions
          </h2>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Chatbot Status
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {chatbot.status === "inactive"
                    ? "Your chatbot is currently inactive and not accessible to users"
                    : "Your chatbot is active and accessible to users"}
                </p>
              </div>
              <button
                onClick={toggleBotStatus}
                disabled={statusChangeStatus === "loading"}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  chatbot.status === "inactive"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-gray-600 hover:bg-gray-700 text-white"
                }`}
              >
                {statusChangeStatus === "loading" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Power className="h-4 w-4" />
                )}
                {chatbot.status === "inactive"
                  ? "Activate Bot"
                  : "Deactivate Bot"}
              </button>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Public Chat URL
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  readOnly
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg text-sm text-gray-900 dark:text-gray-100"
                  value={`${window.location.origin}/chat/${id}`}
                />
              </div>
              <button
                onClick={copyUrl}
                className="px-4 py-2 rounded-lg border text-sm font-medium border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Share this URL to allow users to chat with your bot directly
            </p>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl p-4">
            <h3 className="text-sm font-medium text-red-900 dark:text-red-300 mb-2 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              Danger Zone
            </h3>
            <p className="text-xs text-red-700 dark:text-red-400 mb-3">
              Permanently delete this chatbot and all associated data
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 transition-colors flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Chatbot
            </button>
          </div>
        </div>
      </motion.div>

      {/* Advanced RAG Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-6 space-y-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <Sliders className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Advanced RAG Settings
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1 */}
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Maximize2 className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Retrieval Settings
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                    Max Retrieved Chunks
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={ragData.max_retrieved_chunks}
                    onChange={(e) =>
                      handleRAGChange(
                        "max_retrieved_chunks",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Number of knowledge chunks to retrieve per query
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                    Similarity Threshold
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    max="1"
                    value={ragData.similarity_threshold}
                    onChange={(e) =>
                      handleRAGChange(
                        "similarity_threshold",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Minimum similarity score (0-1) for retrieved content
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Minus className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Text Processing
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                    Chunk Character Limit
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="2000"
                    value={ragData.chunk_char_limit}
                    onChange={(e) =>
                      handleRAGChange(
                        "chunk_char_limit",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                    Min Word Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={ragData.min_word_count}
                    onChange={(e) =>
                      handleRAGChange(
                        "min_word_count",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Type className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Generation Settings
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                    Temperature
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={ragData.temperature}
                    onChange={(e) =>
                      handleRAGChange("temperature", parseFloat(e.target.value))
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Controls randomness: lower values are more deterministic
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                    Max Tokens
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="4000"
                    value={ragData.max_tokens}
                    onChange={(e) =>
                      handleRAGChange("max_tokens", parseInt(e.target.value))
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Maximum length of generated responses
                  </p>
                </div>
                <div className="flex items-center pt-2">
                  <input
                    type="checkbox"
                    id="citations-toggle"
                    checked={ragData.enable_citations}
                    onChange={(e) =>
                      handleRAGChange("enable_citations", e.target.checked)
                    }
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900"
                  />
                  <label
                    htmlFor="citations-toggle"
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300 flex items-center"
                  >
                    <Bookmark className="h-4 w-4 mr-1 text-primary-600 dark:text-primary-400" />
                    Enable Citations
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Minus className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Stopwords
                </h3>
              </div>
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Comma-separated list
                </label>
                <textarea
                  value={ragData.stopwords}
                  onChange={(e) => handleRAGChange("stopwords", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  placeholder="hi,hello,ok,hmm,yes,no"
                  rows={4}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Words to ignore during text processing and retrieval
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="flex justify-between items-center pt-4"
      >
        <div className="flex items-center gap-2">
          {saveStatus === "success" && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg"
            >
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Changes saved!</span>
            </motion.div>
          )}
          {saveStatus === "error" && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg"
            >
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Save failed. Try again.
              </span>
            </motion.div>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={saveStatus === "loading"}
          className="px-5 py-2.5 text-sm font-medium bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center gap-2 shadow-sm hover:shadow"
        >
          {saveStatus === "loading" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </button>
      </motion.div>
    </motion.div>
  );
}
