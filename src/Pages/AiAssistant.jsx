import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Paperclip,
  ArrowRight,
  MessageSquare,
  Mic,
  Square,
  File as FileIcon,
  Trash2,
  Copy,
  Check,
  ChevronDown,
  Search as SearchIcon,
} from "lucide-react";

import Sidebar from "../Components/Sidebar";
import StandardCard from "../Components/StandardCard";
import LoadingScreen from "../Components/LoadingScreen";
import { useAuth } from "../context/AuthContext";
import { useSidebarNav } from "../Utils/Navigation";
import api from "../services/api.service";

export default function AiAssistant() {
  const navigate = useNavigate();
  const onNavigate = useSidebarNav();
  const { user, logout } = useAuth();

  const [chats, setChats] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [openSources, setOpenSources] = useState({});

  // Attachments & Speech
  const [selectedFile, setSelectedFile] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  const starterQuestions = [
    "What are the main activities of BIS?",
    "What is the ISI Mark?",
    "Show me standards for plugs and sockets",
  ];

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  // Load chats & initialize conversation
  useEffect(() => {
    let cancelled = false;

    const initChat = async () => {
      try {
        setPageLoading(true);
        setError("");

        const res = await api.get("/conversations");
        const list = res.data?.conversations || [];
        if (cancelled) return;
        setChats(list);

        let activeId = null;
        if (list.length > 0) {
          activeId = list[0]._id;
        } else {
          const newConvRes = await api.post("/conversations", {});
          const newConv = newConvRes.data?.conversation;
          activeId = newConv?._id;
          if (newConv) setChats([newConv]);
        }

        if (activeId) {
          setActiveConversationId(activeId);
          await loadMessages(activeId);
        }

        // Check for search query passed from Home page
        const storedQuestion = sessionStorage.getItem("initialQuestion");
        if (storedQuestion && activeId) {
          sessionStorage.removeItem("initialQuestion");
          handleSendMessage(storedQuestion, activeId);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message || "Failed to initialize conversation."
          );
        }
      } finally {
        if (!cancelled) setPageLoading(false);
      }
    };

    initChat();

    return () => {
      cancelled = true;
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [user?.id]);

  const loadMessages = async (conversationId) => {
    if (!conversationId) return;
    try {
      const res = await api.get(`/conversations/${conversationId}/messages`);
      const backendMessages =
        res.data?.messages ||
        res.data?.conversation?.messages ||
        res.data?.data?.messages ||
        [];

      const formatted = backendMessages.map((msg, index) => ({
        id: msg._id || msg.id || `${msg.role}-${index}-${Date.now()}`,
        role: msg.role || "assistant",
        text: msg.content || msg.message || msg.text || "",
        sources: msg.sources || [],
        standard: msg.standard || null,
      }));

      setMessages(formatted);
      setOpenSources({});
    } catch {
      setMessages([]);
    }
  };

  const handleSelectChat = async (convId) => {
    if (sending || activeConversationId === convId) return;
    setActiveConversationId(convId);
    setMessages([]);
    setError("");
    setSelectedFile(null);
    await loadMessages(convId);
  };

  const handleStartNewChat = async () => {
    if (sending) return;
    try {
      setError("");
      const res = await api.post("/conversations", {});
      const newConv = res.data?.conversation;
      const newId = newConv?._id;

      if (!newId) return;

      setActiveConversationId(newId);
      setMessages([]);
      setInput("");
      setSelectedFile(null);
      setOpenSources({});
      setChats((prev) => [newConv, ...prev.filter((c) => c._id !== newId)]);
    } catch {
      setError("Unable to create a new conversation.");
    }
  };

  const handleSendMessage = async (textToSend, targetConvId) => {
    const text = (textToSend || input).trim();
    if (!text || sending) return;

    let convId = targetConvId || activeConversationId;
    if (!convId) {
      try {
        const newConvRes = await api.post("/conversations", {});
        convId = newConvRes.data?.conversation?._id;
        setActiveConversationId(convId);
      } catch {
        setError("Conversation session is not ready.");
        return;
      }
    }

    const userMsg = { id: Date.now(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);
    setError("");

    try {
      // Backend expects 'question' and 'conversationId'
      const res = await api.post("/chat", {
        conversationId: convId,
        question: text,
      });

      const data = res.data;
      const assistantMsg = {
        id: Date.now() + 1,
        role: "assistant",
        text: data?.answer || "No response received.",
        sources: data?.sources || [],
        standard: data?.standard || null,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Refresh recent conversations
      const convsRes = await api.get("/conversations");
      if (convsRes.data?.conversations) {
        setChats(convsRes.data.conversations);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to process ML response."
      );
    } finally {
      setSending(false);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Copy helper
  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Speech Recognition
  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Voice recognition is only supported in Chrome/Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setError("");
    };

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim();
      if (transcript) {
        setInput((prev) => (prev.trim() ? `${prev.trim()} ${transcript}` : transcript));
      }
    };

    recognition.onerror = () => {
      setError("Voice input error. Check microphone permissions.");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  // File Upload Handlers
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be under 10 MB.");
      e.target.value = "";
      return;
    }
    setError("");
    setSelectedFile(file);
  };

  if (pageLoading) {
    return <LoadingScreen message="Preparing your secure conversation..." />;
  }

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex font-sans">
      <Sidebar
        active="assistant"
        recentChats={chats}
        activeChatId={activeConversationId}
        onSelectChat={handleSelectChat}
        onNewChat={handleStartNewChat}
        onNavigate={onNavigate}
        onStartCertification={() => navigate("/certification")}
        onLogout={logout}
      />

      <div className="flex-1 min-w-0 flex flex-col h-screen">
        <div className="flex-1 overflow-y-auto px-8 lg:px-12 py-8 flex flex-col justify-between">
          {messages.length === 0 ? (
            <div className="my-auto flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                <MessageSquare className="w-6 h-6 stroke-[2.2]" />
              </div>

              <h1 className="text-4xl font-semibold text-neutral-800 tracking-tight mb-3">
                How can I help you today?
              </h1>

              <p className="text-neutral-500 text-sm max-w-lg mb-8 leading-relaxed">
                Ask about Indian Standards, certification, ISI Mark, HUID,
                testing requirements, or BIS services.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {starterQuestions.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleSendMessage(q)}
                    className="text-xs text-neutral-600 bg-white border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-colors px-4 py-2 rounded-full shadow-xs cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-w-4xl mx-auto w-full">
              {messages.map((msg) =>
                msg.role === "user" ? (
                  <div key={msg.id} className="flex justify-end">
                    <div className="bg-neutral-900 text-white text-sm leading-relaxed rounded-2xl rounded-tr-sm px-6 py-3.5 max-w-xl break-words shadow-xs">
                      {msg.text}
                    </div>
                  </div>
                ) : (
                  <div key={msg.id} className="flex flex-col gap-3 items-start w-full">
                    {msg.text && (
                      <div className="bg-white border border-neutral-200 text-neutral-800 text-sm leading-relaxed rounded-2xl rounded-tl-sm px-6 py-4 max-w-2xl shadow-xs relative group">
                        <div className="whitespace-pre-wrap">{msg.text}</div>

                        {/* Copy button */}
                        <button
                          onClick={() => handleCopy(msg.text, msg.id)}
                          className="absolute top-3 right-3 text-neutral-400 hover:text-emerald-600 transition-colors cursor-pointer"
                          title="Copy message"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    )}

                    {/* Collapsible Sources */}
                    {msg.sources?.length > 0 && (
                      <div className="w-full max-w-2xl bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs">
                        <button
                          onClick={() =>
                            setOpenSources((prev) => ({
                              ...prev,
                              [msg.id]: !prev[msg.id],
                            }))
                          }
                          className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-neutral-700 bg-neutral-50/70 hover:bg-neutral-100 transition-colors"
                        >
                          <span>Sources ({msg.sources.length})</span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              openSources[msg.id] ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {openSources[msg.id] && (
                          <div className="p-3 space-y-2 border-t border-neutral-100">
                            {msg.sources.map((src, i) => {
                              const name = typeof src === "string" ? src : src.name || `Source ${i + 1}`;
                              const url = typeof src === "object" ? src.url : null;
                              return (
                                <div
                                  key={i}
                                  className="flex items-center justify-between text-xs bg-neutral-50 p-2.5 rounded-lg border border-neutral-200/60"
                                >
                                  <div className="flex items-center gap-2 truncate mr-2">
                                    <FileIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <span className="truncate font-medium text-neutral-800">
                                      {name}
                                    </span>
                                  </div>
                                  {url && (
                                    <a
                                      href={url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-emerald-600 hover:underline shrink-0 flex items-center gap-1 font-semibold"
                                    >
                                      <SearchIcon className="w-3 h-3" />
                                      View
                                    </a>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Standard Card if attached */}
                    {msg.standard && (
                      <div className="w-full max-w-3xl mt-2">
                        <StandardCard
                          code={msg.standard.code || "IS 0000:0000"}
                          status={msg.standard.status || "Active"}
                          category={msg.standard.category}
                          title={msg.standard.title || "Standard Result"}
                          description={msg.standard.description}
                          aiInsight={msg.standard.aiInsight}
                          relevanceMatch={
                            typeof msg.standard.relevanceMatch === "number"
                              ? msg.standard.relevanceMatch
                              : msg.standard.confidence
                          }
                          onDownloadPdf={() =>
                            msg.standard.pdfUrl && window.open(msg.standard.pdfUrl, "_blank")
                          }
                        />
                      </div>
                    )}
                  </div>
                )
              )}

              {sending && (
                <div className="flex justify-start">
                  <div className="bg-white border border-neutral-200 text-neutral-500 text-xs rounded-2xl px-5 py-3 shadow-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    BIS Sahayak is querying standards registry...
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {error && (
          <div className="max-w-4xl mx-auto w-full px-8 mb-3">
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-4 py-2.5">
              {error}
            </div>
          </div>
        )}

        {/* Selected file preview */}
        {selectedFile && (
          <div className="max-w-4xl mx-auto w-full px-8 mb-2">
            <div className="flex items-center justify-between bg-white border border-neutral-200 rounded-xl px-4 py-2 text-xs shadow-xs">
              <div className="flex items-center gap-2 truncate">
                <FileIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium text-neutral-800 truncate">{selectedFile.name}</span>
                <span className="text-neutral-400">({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="text-neutral-400 hover:text-red-500 cursor-pointer p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Query Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-3 bg-white border border-neutral-200 rounded-full max-w-4xl mx-auto w-full mb-8 pl-4 pr-2 py-1.5 shadow-xs"
        >
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 text-neutral-400 hover:text-neutral-600 cursor-pointer"
            title="Attach document"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.png,.jpg,.jpeg"
            onChange={handleFileChange}
          />

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              selectedFile
                ? "Ask something about the selected document..."
                : "Ask about standards, certification processes, or upload documents for review..."
            }
            className="flex-1 bg-transparent text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none py-1.5"
          />

          <button
            type="button"
            onClick={startVoiceInput}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              isListening ? "bg-red-50 text-red-500" : "text-neutral-400 hover:text-neutral-600"
            }`}
            title={isListening ? "Stop listening" : "Voice input"}
          >
            {isListening ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <button
            type="submit"
            disabled={sending || (!input.trim() && !selectedFile)}
            className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white transition-colors cursor-pointer"
            aria-label="Send"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}