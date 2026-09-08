import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
Send,
  CheckCircle2,
  HelpCircle,
  ChevronRight,
  Clock,
  MessageCircle,
  FileText,
  LucideGrid2X2,
} from "lucide-react";

import Sidebar from "../Components/Sidebar";
import LoadingScreen from "../Components/LoadingScreen";
import { useAuth } from "../context/AuthContext";
import { useSidebarNav } from "../Utils/Navigation";
import { useLanguage } from "../context/LanguageContext";
import api from "../services/authService";

const ACTIVITY_ICON = {
  standard: Clock,
  chat: MessageCircle,
  document: FileText,
};

export default function Home() {
  const navigate = useNavigate();
  const onNavigate = useSidebarNav();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const [query, setQuery] = useState("");
  const [news, setNews] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      api.get("/news"),
      api.get("/activity/recent"),
    ])
      .then(([newsRes, activityRes]) => {
        if (cancelled) return;

        if (
          Array.isArray(newsRes?.data) &&
          newsRes.data.length > 0
        ) {
          setNews(newsRes.data);
        }

        if (
          Array.isArray(activityRes?.data) &&
          activityRes.data.length > 0
        ) {
          setActivity(activityRes.data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const displayedNews =
    news.length > 0
      ? news
      : [
          {
            id: "news-1",
            tag: t("alert"),
            date: "Oct 24, 2023",
            title: t("defaultNews1Title"),
            summary: t("defaultNews1Summary"),
          },
          {
            id: "news-2",
            tag: t("update"),
            date: "Oct 20, 2023",
            title: t("defaultNews2Title"),
            summary: t("defaultNews2Summary"),
          },
        ];

  const displayedActivity =
    activity.length > 0
      ? activity
      : [
          {
            id: "act-1",
            type: "standard",
            title: t("defaultAct1Title"),
            description: t("defaultAct1Desc"),
            timestamp: t("defaultAct1Time"),
          },
          {
            id: "act-2",
            type: "chat",
            title: t("defaultAct2Title"),
            description: t("defaultAct2Desc"),
            timestamp: t("defaultAct2Time"),
          },
          {
            id: "act-3",
            type: "document",
            title: t("defaultAct3Title"),
            description: t("defaultAct3Desc"),
            timestamp: t("defaultAct3Time"),
          },
        ];

  const quickServices = [
    {
      key: "verify-huid",
      icon: LucideGrid2X2,
      title: t("verifyHuidTitle"),
      desc: t("verifyHuidDesc"),
      path: "/hallmarking/verify",
    },
    {
      key: "check-is-mark",
      icon: CheckCircle2,
      title: t("checkIsMarkTitle"),
      desc: t("checkIsMarkDesc"),
      path: "/certification/verify",
    },
    {
      key: "product-finder",
      icon: Search,
      title: t("productFinderTitle"),
      desc: t("productFinderDesc"),
      path: "/standards",
    },
    {
      key: "cert-help",
      icon: HelpCircle,
      title: t("certHelpTitle"),
      desc: t("certHelpDesc"),
      path: "/certification",
    },
  ];

  const getUserName = () => {
    return (
      user?.name ||
      user?.username ||
      user?.fullName ||
      user?.firstName ||
      "there"
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    sessionStorage.setItem(
      "initialQuestion",
      query.trim()
    );

    navigate("/assistant");
  };

  if (loading) {
    return (
      <LoadingScreen message={t("loadingDashboard")} />
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/50 flex font-sans">

      {/* ================= SIDEBAR ================= */}
      <Sidebar
        active="home"
        onNavigate={onNavigate}
        onStartCertification={() =>
          navigate("/certification")
        }
        onLogout={logout}
      />

      {/* ================= MAIN ================= */}
      <main className="flex-1 min-w-0 p-6 lg:p-10 xl:p-12 overflow-y-auto">

        {/* ================= HERO ================= */}
        <section className="max-w-5xl mx-auto mb-12">

          <div className="text-center pt-3">

            <p className="text-sm font-medium text-emerald-600 mb-2">
              Welcome back
            </p>

            <h1 className="text-3xl lg:text-4xl font-extrabold text-neutral-900 tracking-tight">
              Hi, {getUserName()} 👋
            </h1>

            <p className="text-lg text-neutral-500 mt-2">
              How can I help you today?
            </p>

            {/* SEARCH */}
            <form
              onSubmit={handleSearch}
              className="mt-7 max-w-2xl mx-auto flex items-center gap-3 bg-white border border-neutral-200 rounded-2xl px-5 py-3 shadow-sm hover:border-neutral-300 focus-within:ring-2 focus-within:ring-emerald-600/10 focus-within:border-emerald-600 transition-all"
            >
              <Search className="w-5 h-5 text-neutral-400 shrink-0" />

              <input
                type="text"
                value={query}
                onChange={(e) =>
                  setQuery(e.target.value)
                }
                placeholder={t("searchPlaceholder")}
                className="flex-1 bg-transparent text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
              />

              <button
  type="submit"
  disabled={!query.trim()}
  className="w-9 h-9 shrink-0 flex items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-neutral-200 disabled:text-neutral-400 text-white transition-colors cursor-pointer disabled:cursor-not-allowed"
  aria-label="Send"
>
  <Send className="w-4 h-4" />
</button>
            </form>
          </div>
        </section>

        {/* ================= CONTENT ================= */}
        <div className="max-w-6xl mx-auto space-y-10">

          {/* ================= QUICK SERVICES ================= */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  {t("quickServices")}
                </h2>

                <p className="text-xs text-neutral-500 mt-1">
                  Quick access to BIS services
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              {quickServices.map(
                ({
                  key,
                  icon: Icon,
                  title,
                  desc,
                  path,
                }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => navigate(path)}
                    className="group text-left bg-white border border-neutral-200 rounded-2xl p-5 hover:border-emerald-400 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>

                    <p className="font-semibold text-neutral-900 text-sm">
                      {title}
                    </p>

                    <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                      {desc}
                    </p>

                    <div className="flex items-center gap-1 mt-4 text-xs font-semibold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                )
              )}

            </div>
          </section>

          {/* ================= LOWER CONTENT ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* ================= NEWS ================= */}
            <section className="lg:col-span-2">

              <div className="flex items-center justify-between mb-5">

                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">
                    {t("newsAmendments")}
                  </h2>

                  <p className="text-xs text-neutral-500 mt-1">
                    Latest updates and amendments
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onNavigate?.("standards")
                  }
                  className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                >
                  {t("viewAll")}
                </button>
              </div>

              <div className="space-y-3">

                {displayedNews.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      onNavigate?.("standards")
                    }
                    className="w-full text-left flex items-center justify-between gap-5 bg-white border border-neutral-200 rounded-2xl p-5 hover:border-neutral-300 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className="min-w-0 flex-1">

                      <div className="flex items-center gap-2 mb-2">

                        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />

                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider rounded px-1.5 py-0.5 ${
                            item.tag === "ALERT" ||
                            item.tag === t("alert")
                              ? "bg-red-50 text-red-600"
                              : "bg-emerald-50 text-emerald-600"
                          }`}
                        >
                          {item.tag}
                        </span>

                        <span className="text-xs text-neutral-400">
                          {item.date}
                        </span>

                      </div>

                      <p className="font-semibold text-neutral-900 text-sm">
                        {item.title}
                      </p>

                      <p className="text-xs text-neutral-500 mt-1.5 line-clamp-2 leading-relaxed">
                        {item.summary}
                      </p>

                    </div>

                    <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />
                  </button>
                ))}

              </div>
            </section>

            {/* ================= RECENT ACTIVITY ================= */}
            <aside className="lg:col-span-1">

              <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">

                <div className="flex items-center justify-between mb-6">

                  <div>
                    <h3 className="font-semibold text-neutral-900">
                      {t("recentActivity")}
                    </h3>

                    <p className="text-xs text-neutral-500 mt-1">
                      Your latest activity
                    </p>
                  </div>

                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>

                </div>

                <div className="space-y-5">

                  {displayedActivity.map((item) => {

                    const Icon =
                      ACTIVITY_ICON[item.type] ||
                      Clock;

                    return (
                      <div
                        key={item.id}
                        className="flex gap-3 items-start"
                      >

                        <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-600 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>

                        <div className="min-w-0">

                          <p className="text-sm font-semibold text-neutral-900 leading-snug">
                            {item.title}
                          </p>

                          <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                            {item.description}
                          </p>

                          <p className="text-[11px] text-neutral-400 mt-1.5 font-medium">
                            {item.timestamp}
                          </p>

                        </div>

                      </div>
                    );
                  })}

                </div>

                <button
                  type="button"
                  onClick={() =>
                    onNavigate?.("assistant")
                  }
                  className="w-full mt-6 border border-neutral-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-neutral-700 hover:text-emerald-700 text-xs font-semibold rounded-xl py-2.5 transition-colors cursor-pointer"
                >
                  {t("viewAllHistory")}
                </button>

              </div>

            </aside>

          </div>

        </div>
      </main>
    </div>
  );
}