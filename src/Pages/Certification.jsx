import { useEffect, useRef, useState } from "react";
import {
  Paperclip,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import StandardCard from "../Components/StandardCard";
import LoadingScreen from "../Components/LoadingScreen";
import { useAuth } from "../context/AuthContext";
import { useSidebarNav } from "../Utils/Navigation";
import {
  getConversations,
  getMessages,
  createConversation,
  sendMessagePlaceholder,
} from "../services/conversationService";

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
  const [sendError, setSendError] = useState("");
  const bottomRef = useRef(null);

  const starterQuestions = [
    "What are the main activities of BIS?",
    "What is the ISI Mark?",
    "How can I verify a BIS licence?",
  ];

  useEffect(() => {
    let cancelled = false;
    getConversations()
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data)
          ? data
          : data?.conversations || data?.chats || data?.data || [];
        setChats(list);
      })
      .catch(() => {
        if (!cancelled) setChats([]);
      })
      .finally(() => {
        if (!cancelled) setPageLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const openConversation = async (conversationId) => {
    setActiveConversationId(conversationId);
    try {
      const history = await getMessages(conversationId);
      const msgList = Array.isArray(history)
        ? history
        : history?.messages || history?.data || [];
      setMessages(msgList);
    } catch {
      setMessages([]);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || sending) return;

    const userMsg = { id: Date.now(), role: "user", text };

    setMessages((prev) => [...(Array.isArray(prev) ? prev : []), userMsg]);
    setInput("");
    setSending(true);
    setSendError("");

    try {
      let conversationId = activeConversationId;
      if (!conversationId) {
        const conversation = await createConversation();
        conversationId = conversation?.id || conversation?._id;
        setActiveConversationId(conversationId);

        if (conversation) {
          setChats((prev) => [
            conversation,
            ...(Array.isArray(prev) ? prev : []),
          ]);
        }
      }

      const response = await sendMessagePlaceholder(text);
      if (response) {
        setMessages((prev) => [
          ...(Array.isArray(prev) ? prev : []),
          { id: Date.now() + 1, role: "assistant", ...response },
        ]);
      }
    } catch (err) {
      const errorText =
        err?.response?.data?.message ||
        err?.message ||
        "Chat isn't live yet — waiting on the backend's ML-integrated endpoint.";

      setMessages((prev) => [
        ...(Array.isArray(prev) ? prev : []),
        {
          id: Date.now() + 1,
          role: "assistant",
          error: errorText,
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  if (pageLoading) {
    return <LoadingScreen message="Preparing your secure conversation..." />;
  }

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex font-sans">
      <Sidebar
        active="assistant"
        recentChats={Array.isArray(chats) ? chats : []}
        activeChatId={activeConversationId}
        onSelectChat={openConversation}
        onNavigate={onNavigate}
        onStartCertification={() => navigate("/certification")}
        onLogout={logout}
      />

      <div className="flex-1 min-w-0 flex flex-col h-screen">
        <div className="flex-1 overflow-y-auto px-10 py-8 flex flex-col justify-between">
          {!Array.isArray(messages) || messages.length === 0 ? (
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
            <div className="space-y-6">
              {messages.map((msg) =>
                msg.role === "user" ? (
                  <div key={msg.id} className="flex justify-end">
                    <div className="bg-neutral-900 text-white text-base leading-relaxed rounded-2xl rounded-tr-sm px-6 py-3.5 max-w-xl break-words">
                      {typeof msg.text === "string"
                        ? msg.text
                        : JSON.stringify(msg.text)}
                    </div>
                  </div>
                ) : (
                  <div key={msg.id} className="flex justify-start w-full">
                    {msg.standard ? (
                      <div className="w-full max-w-3xl">
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
                            msg.standard.pdfUrl
                              ? window.open(msg.standard.pdfUrl, "_blank")
                              : console.log("Download PDF")
                          }
                          onViewReference={() =>
                            console.log("View reference clicked")
                          }
                          onRevisionHistory={() =>
                            console.log("Revision history clicked")
                          }
                        />
                      </div>
                    ) : msg.error ? (
                      <div className="bg-red-50 border border-red-200 text-red-600 text-base rounded-2xl px-6 py-3.5 max-w-xl">
                        {typeof msg.error === "string"
                          ? msg.error
                          : "Failed to process chat response."}
                      </div>
                    ) : (
                      <div className="bg-white border border-neutral-200 text-neutral-800 text-base leading-relaxed rounded-2xl rounded-tl-sm px-6 py-3.5 max-w-2xl shadow-xs">
                        {typeof msg.text === "string"
                          ? msg.text
                          : "Response received."}
                      </div>
                    )}
                  </div>
                )
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {sendError && (
          <div className="mx-10 mb-3 bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-xl px-4 py-2.5">
            {sendError}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-3 bg-white border border-neutral-200 rounded-full mx-10 mb-8 pl-5 pr-2 py-2.5 shadow-xs"
        >
          <Paperclip className="w-5 h-5 text-neutral-400 shrink-0 cursor-pointer hover:text-neutral-600" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about standards, certification processes, or upload documents for review..."
            className="flex-1 bg-transparent text-base text-neutral-800 placeholder:text-neutral-400 focus:outline-none py-1.5"
          />
          <button
            type="submit"
            disabled={sending}
            className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white transition-colors cursor-pointer"
            aria-label="Send"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}