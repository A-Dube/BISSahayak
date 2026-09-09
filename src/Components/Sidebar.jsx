import { useState, useEffect, useRef } from "react";
import {
  Home,
  MessageSquare,
  FileText,
  CheckCircle2,
  FlaskConical,
  Award,
  User,
  HelpCircle,
  LogOut,
  Plus,
  MoreVertical,
  Share2,
  Pin,
  Pencil,
  Trash2,
} from "lucide-react";
import bisLogo from "../assets/BIS logo.png";
import { useLanguage } from "../context/LanguageContext";

export default function Sidebar({
  active = "home",
  onNavigate,
  onStartCertification,
  onLogout,
  recentChats = [],
  activeChatId,
  onSelectChat,
  onNewChat,
  onShareChat,
  onPinChat,
  onRenameChat,
  onDeleteChat,
}) {
  const { t } = useLanguage();
  const [menuOpenChatId, setMenuOpenChatId] = useState(null);
  const menuRef = useRef(null);

  const NAV_ITEMS = [
    { key: "home", label: t("home"), icon: Home },
    { key: "assistant", label: t("assistant"), icon: MessageSquare },
    { key: "certification", label: t("certification"), icon: CheckCircle2 },
    { key: "labs", label: t("labs"), icon: FlaskConical },
    { key: "hallmarking", label: t("hallmarking"), icon: Award },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpenChatId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAction = (e, actionFn, chatId) => {
    e.stopPropagation();
    setMenuOpenChatId(null);
    actionFn?.(chatId);
  };

  const activeChats = recentChats.filter((chat) => {
    const title = chat.title || chat.name || "";
    const hasValidTitle =
      title.trim() !== "" &&
      title.toLowerCase() !== "new conversation" &&
      title.toLowerCase() !== "untitled chat";
    const hasMessages = Array.isArray(chat.messages) && chat.messages.length > 0;
    return hasValidTitle || hasMessages;
  });

  return (
    <aside className="w-64 shrink-0 bg-[#FBFBFB] border-r border-neutral-200/80 flex flex-col h-screen sticky top-0 font-sans select-none z-20">
      <div className="flex items-center gap-3 px-5 py-5">
        <img src={bisLogo} alt="BIS Sahayak" className="w-10 h-10 object-contain" />
        <div>
          <p className="text-sm font-bold text-neutral-900 leading-tight">
            BIS Sahayak
          </p>
          <p className="text-[11px] font-medium text-neutral-400 tracking-wider leading-tight mt-0.5">
            {t("officialAssistant")}
          </p>
        </div>
      </div>

      <div className="px-4 mb-3">
        <button
          type="button"
          onClick={onStartCertification}
          className="w-full flex items-center justify-center gap-1.5 bg-[#0d234f] hover:bg-[#091837] text-white text-xs font-semibold rounded-full py-2.5 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          {t("startCertification")}
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
          const isActive = key === active;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onNavigate?.(key)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                isActive
                  ? "bg-[#059669] text-white shadow-xs"
                  : "text-neutral-600 hover:bg-neutral-100/80 hover:text-neutral-900"
              }`}
            >
              <Icon className="w-4.5 h-4.5" strokeWidth={1.8} />
              {label}
            </button>
          );
        })}

        {active === "assistant" && (
          <div className="pt-4 pb-2">
            <button
              type="button"
              onClick={onNewChat}
              className="w-full flex items-center gap-2 px-3 py-2 mb-3 rounded-lg text-xs font-semibold text-neutral-700 bg-neutral-100/80 hover:bg-neutral-200/70 hover:text-neutral-900 transition-colors cursor-pointer border border-neutral-200/60"
            >
              <Plus className="w-3.5 h-3.5 text-neutral-500 stroke-[2.5]" />
              {t("newChat")}
            </button>

            {activeChats.length > 0 && (
              <>
                <p className="px-3 text-[10px] font-bold text-neutral-400 tracking-wider uppercase mb-2">
                  {t("recentChats")}
                </p>

                <div className="space-y-1 pr-1">
                  {activeChats.map((chat) => {
                    const chatId = chat.id || chat._id;
                    const isActiveChat = chatId === activeChatId;
                    const isMenuOpen = menuOpenChatId === chatId;
                    const displayTitle = chat.title || chat.name || t("chat");

                    return (
                      <div
                        key={chatId}
                        className={`group relative flex items-center justify-between rounded-lg text-xs transition-colors ${
                          isActiveChat
                            ? "bg-neutral-200/80 text-neutral-900 font-semibold"
                            : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
                        } ${isMenuOpen ? "z-30" : "z-0"}`}
                      >
                        <button
                          type="button"
                          onClick={() => onSelectChat?.(chatId)}
                          title={displayTitle}
                          className="flex-1 text-left truncate px-3 py-2 cursor-pointer"
                        >
                          {displayTitle}
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpenChatId(isMenuOpen ? null : chatId);
                          }}
                          className={`p-1.5 mr-1 rounded-md transition-opacity cursor-pointer ${
                            isMenuOpen
                              ? "opacity-100 bg-neutral-300/60 text-neutral-800"
                              : "opacity-0 group-hover:opacity-100 hover:bg-neutral-200 text-neutral-400 hover:text-neutral-700"
                          }`}
                          aria-label={t("chatOptions")}
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>

                        {isMenuOpen && (
                          <div
                            ref={menuRef}
                            className="absolute right-1 top-full mt-1 w-44 bg-white border border-neutral-200 rounded-xl shadow-xl p-1 z-50 text-neutral-700"
                          >
                            <button
                              type="button"
                              onClick={(e) => handleAction(e, onShareChat, chatId)}
                              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-neutral-50 hover:text-neutral-900 text-xs font-normal transition-colors cursor-pointer"
                            >
                              <Share2 className="w-3.5 h-3.5 text-neutral-400" />
                              {t("shareConversation")}
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleAction(e, onPinChat, chatId)}
                              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-neutral-50 hover:text-neutral-900 text-xs font-normal transition-colors cursor-pointer"
                            >
                              <Pin className="w-3.5 h-3.5 text-neutral-400" />
                              {t("pin")}
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleAction(e, onRenameChat, chatId)}
                              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-neutral-50 hover:text-neutral-900 text-xs font-normal transition-colors cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5 text-neutral-400" />
                              {t("rename")}
                            </button>
                            <div className="h-px bg-neutral-100 my-1" />
                            <button
                              type="button"
                              onClick={(e) => handleAction(e, onDeleteChat, chatId)}
                              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-red-50 text-red-600 text-xs font-normal transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-500" />
                              {t("delete")}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </nav>

      <div className="px-3 py-4 border-t border-neutral-200/60 space-y-0.5">
        <button
          type="button"
          onClick={() => onNavigate?.("profile")}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 transition-colors cursor-pointer"
        >
          <User className="w-4 h-4" />
          {t("profile")}
        </button>
        {/* <button
          type="button"
          onClick={() => onNavigate?.("help")}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 transition-colors cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
          {t("help")}
        </button> */}
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          {t("logout")}
        </button>
      </div>
    </aside>
  );
}