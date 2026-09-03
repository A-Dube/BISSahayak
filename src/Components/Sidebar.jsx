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
} from "lucide-react";
import bisLogo from "../assets/BIS logo.png";

const NAV_ITEMS = [
  { key: "home", label: "Home", icon: Home },
  { key: "assistant", label: "AI Assistant", icon: MessageSquare },
  { key: "standards", label: "Standards", icon: FileText },
  { key: "certification", label: "Certification", icon: CheckCircle2 },
  { key: "labs", label: "Testing Labs", icon: FlaskConical },
  { key: "hallmarking", label: "Hallmarking", icon: Award },
];

export default function Sidebar({ active = "home", onNavigate, onStartCertification, onLogout }) {
  return (
    <aside className="w-64 shrink-0 bg-neutral-50 border-r border-neutral-200 flex flex-col h-screen sticky top-0">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <img src={bisLogo} alt="BIS Sahayak" className="w-12 h-12 object-contain" />
        <div>
          <p className="text-md font-bold text-neutral-900 leading-tight">
            BIS Sahayak
          </p>
          <p className="text-[13px] font-medium text-neutral-400 tracking-wide leading-tight">
            OFFICIAL AI ASSISTANT
          </p>
        </div>
      </div>

      <nav className="flex-1 px-3 mt-2 space-y-1">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
          const isActive = key === active;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onNavigate?.(key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-emerald-600 text-white"
                  : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
              }`}
            >
              <Icon className="w-4.5 h-4.5" strokeWidth={2} />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="px-3 pb-5 space-y-3">
        <button
          type="button"
          onClick={onStartCertification}
          className="w-full flex items-center justify-center bg-neutral-900 hover:bg-black text-white text-sm font-semibold rounded-full py-2.5 transition-colors"
        >
          Start Certification
        </button>

        <div className="pt-1 space-y-1">
          <button
            type="button"
            onClick={() => onNavigate?.("profile")}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
          >
            <User className="w-4.5 h-4.5" />
            Profile
          </button>
          <button
            type="button"
            onClick={() => onNavigate?.("help")}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
          >
            <HelpCircle className="w-4.5 h-4.5" />
            Help
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
          >
            <LogOut className="w-4.5 h-4.5" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}