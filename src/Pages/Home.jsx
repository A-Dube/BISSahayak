import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Mic,
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

    Promise.all([api.get("/news"), api.get("/activity/recent")])
      .then(([newsRes, activityRes]) => {
        if (cancelled) return;
        if (Array.isArray(newsRes?.data) && newsRes.data.length > 0) {
          setNews(newsRes.data);
        }
        if (Array.isArray(activityRes?.data) && activityRes.data.length > 0) {
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    sessionStorage.setItem("initialQuestion", query.trim());
    navigate("/assistant");
  };

  if (loading) {
    return <LoadingScreen message={t("loadingDashboard")} />;
  }

  return (
    <div className="min-h-screen bg-neutral-50/50 flex font-sans">
      <Sidebar
        active="home"
        onNavigate={onNavigate}
        onStartCertification={() => navigate("/certification")}
        onLogout={logout}
      />

      <main className="flex-1 min-w-0 p-8 lg:p-12 overflow-y-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 pt-4">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-neutral-900 tracking-tight">
            {t("heroTitle")}
          </h1>
          <p className="text-sm text-neutral-500 mt-2">
            {t("heroSubtitle")}
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-6 flex items-center gap-3 bg-white border border-neutral-200 rounded-full px-5 py-2.5 shadow-sm hover:border-neutral-300 focus-within:ring-2 focus-within:ring-emerald-600/10 focus-within:border-emerald-600 transition-all"
          >
            <Search className="w-4 h-4 text-neutral-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="flex-1 bg-transparent text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
            />
            <button
              type="submit"
              className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
              aria-label="Search"
            >
              <Mic className="w-4 h-4" />
            </button>
          </form>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                {t("quickServices")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickServices.map(({ key, icon: Icon, title, desc, path }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => navigate(path)}
                    className="text-left bg-white border border-neutral-200 rounded-2xl p-5 hover:border-emerald-500 hover:shadow-sm transition-all group cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="font-semibold text-neutral-900 text-sm">{title}</p>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      {desc}
                    </p>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-neutral-900">
                  {t("newsAmendments")}
                </h2>
                <button
                  type="button"
                  onClick={() => onNavigate?.("standards")}
                  className="text-md font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                >
                  {t("viewAll")}
                </button>
              </div>

              <div className="space-y-3">
                {displayedNews.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate?.("standards")}
                    className="w-full text-left flex items-center justify-between gap-4 bg-white border border-neutral-200 rounded-2xl p-5 hover:border-neutral-300 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider rounded px-1.5 py-0.5 ${
                            item.tag === "ALERT" || item.tag === t("alert")
                              ? "bg-red-50 text-red-600"
                              : "bg-emerald-50 text-emerald-600"
                          }`}
                        >
                          {item.tag}
                        </span>
                        <span className="text-xs text-neutral-400">{item.date}</span>
                      </div>
                      <p className="font-semibold text-neutral-900 text-md">
                        {item.title}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                        {item.summary}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />
                  </button>
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-neutral-950 rounded-2xl p-6 text-white sticky top-8 shadow-sm min-h-28">
              <h3 className="font-semibold text-lg mb-6 text-neutral-100">
                {t("recentActivity")}
              </h3>

              <div className="space-y-6">
                {displayedActivity.map((item) => {
                  const Icon = ACTIVITY_ICON[item.type] || Clock;
                  return (
                    <div key={item.id} className="flex gap-3.5 items-start">
                      <div className="w-7 h-7 rounded-lg bg-white/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-md font-semibold text-white leading-snug">
                          {item.title}
                        </p>
                        <p className="text-[13px] text-neutral-400 mt-1 leading-normal">
                          {item.description}
                        </p>
                        <p className="text-[12px] text-neutral-500 mt-1 font-medium">
                          {item.timestamp}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => onNavigate?.("assistant")}
                className="w-full mt-8 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-xl py-2.5 transition-colors cursor-pointer"
              >
                {t("viewAllHistory")}
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}