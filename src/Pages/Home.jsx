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
import { useSidebarNav } from "../utils/Navigation";
import api from "../services/authService";

const QUICK_SERVICES = [
  {
    key: "verify-huid",
    icon: LucideGrid2X2,
    title: "Verify HUID",
    desc: "Check authenticity of hallmarked jewellery.",
    path: "/hallmarking/verify",
  },
  {
    key: "check-is-mark",
    icon: CheckCircle2,
    title: "Check IS Mark",
    desc: "Verify licenses and IS mark validity.",
    path: "/certification/verify",
  },
  {
    key: "product-finder",
    icon: Search,
    title: "Product Finder",
    desc: "Search standards by product category.",
    path: "/standards",
  },
  {
    key: "cert-help",
    icon: HelpCircle,
    title: "Cert Help",
    desc: "Guide for certification process.",
    path: "/certification",
  },
];

const ACTIVITY_ICON = {
  standard: Clock,
  chat: MessageCircle,
  document: FileText,
};

export default function Home() {
  const navigate = useNavigate();
  const onNavigate = useSidebarNav();
  const { user, logout } = useAuth();
  const [query, setQuery] = useState("");
  const [news, setNews] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Promise.all([api.get("/news"), api.get("/activity/recent")])
      .then(([newsRes, activityRes]) => {
        if (cancelled) return;
        setNews(Array.isArray(newsRes.data) ? newsRes.data : []);
        setActivity(Array.isArray(activityRes.data) ? activityRes.data : []);
      })
      .catch(() => {
        if (cancelled) return;
        setNews([]);
        setActivity([]);
      })
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/standards?q=${encodeURIComponent(query.trim())}`);
  };

  if (loading) {
    return <LoadingScreen message="Loading dashboard & updates..." />;
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <Sidebar
        active="home"
        onNavigate={onNavigate}
        onStartCertification={() => navigate("/certification")}
        onLogout={logout}
      />

      <div className="flex-1 min-w-0 px-0 py-10 max-w-7xl mx-auto w-full">
        <div className="flex gap-8 items-center">
          <div className="flex-1 min-w-0">
            <div className="text-center mb-10">
              <h1 className="text-5xl font-bold text-neutral-900 mt-20">
                How can I help you today?
              </h1>
              <p className="text-neutral-500 mt-2">
                Ask about ISI Mark, HUID, or search standards.
              </p>
            </div>

            <form
              onSubmit={handleSearch}
              className="flex items-center gap-3 bg-white border border-neutral-200 rounded-2xl pl-5 pr-2 py-2 max-w-5xl shadow-xs mb-10"
            >
              <Search className="w-4 h-4 text-neutral-400 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., How to apply for ISI mark for cement?"
                className="flex-1 bg-transparent text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none py-2"
              />
              <button
                type="submit"
                className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
                aria-label="Search"
              >
                <Mic className="w-4 h-4" />
              </button>
            </form>

            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Quick Services
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-10">
              {QUICK_SERVICES.map(({ key, icon: Icon, title, desc, path }) => (
                <button
                  key={key}
                  onClick={() => navigate(path)}
                  className="text-left text-md bg-white border border-neutral-200 rounded-xl p-5 hover:shadow-md hover:border-neutral-300 transition-all cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <p className="font-semibold text-neutral-900 text-md">{title}</p>
                  <p className="text-sm text-neutral-500 mt-1">{desc}</p>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-neutral-900">
                News &amp; Amendments
              </h2>
              <button
                onClick={() => navigate("/news")}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {news.length === 0 && (
                <p className="text-sm text-neutral-400">No recent updates.</p>
              )}
              {news.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(`/news/${item.id}`)}
                  className="w-full text-left flex items-start justify-between gap-4 bg-white border border-neutral-200 rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wide rounded px-2 py-0.5 ${
                          item.tag === "ALERT"
                            ? "bg-red-100 text-red-600"
                            : "bg-emerald-100 text-emerald-600"
                        }`}
                      >
                        {item.tag}
                      </span>
                      <span className="text-xs text-neutral-400">{item.date}</span>
                    </div>
                    <p className="font-semibold text-neutral-900">{item.title}</p>
                    <p className="text-sm text-neutral-500 mt-1">{item.summary}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-300 shrink-0 mt-1" />
                </button>
              ))}
            </div>
          </div>

          <aside className="w-72 shrink-0 self-end">
            <div className="bg-neutral-900 rounded-2xl p-5 sticky top-10">
              <p className="text-white font-semibold text-md mb-4">
                Recent Activity
              </p>
              <div className="space-y-4">
                {activity.map((item) => {
                  const Icon = ACTIVITY_ICON[item.type] || Clock;
                  return (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium leading-snug">
                          {item.title}
                        </p>
                        <p className="text-neutral-400 text-xs mt-1">
                          {item.description}
                        </p>
                        <p className="text-neutral-500 text-[11px] mt-1">
                          {item.timestamp}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {activity.length === 0 && (
                  <p className="text-neutral-400 text-sm">No recent activity yet.</p>
                )}
              </div>
              <button
                onClick={() => navigate("/activity")}
                className="w-full mt-5 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg py-2.5 transition-colors cursor-pointer"
              >
                View All History
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}