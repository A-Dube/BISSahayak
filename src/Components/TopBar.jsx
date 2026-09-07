import { Search, ArrowRight, Bell, Settings } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function TopBar({ query, onQueryChange, onSearch }) {
  const { t } = useLanguage();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <div className="flex items-center gap-4 px-8 lg:px-12 py-5 max-w-8xl">
      <form
        onSubmit={handleSubmit}
        className="flex-1 flex items-center gap-3 bg-neutral-100 rounded-xl pl-4 pr-1.5 py-1.5 focus-within:ring-2 focus-within:ring-[#0d234f]/10"
      >
        <Search className="w-4 h-4 text-neutral-400 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange?.(e.target.value)}
          placeholder={t("searchStandardsPlaceholder")}
          className="flex-1 bg-transparent text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none py-1.5"
        />
        <button
          type="submit"
          className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg bg-[#0d234f] text-white hover:bg-[#0a1c40] transition-colors cursor-pointer"
          aria-label="Search"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <button
        type="button"
        className="w-9 h-9 flex items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 transition-colors cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="w-4.5 h-4.5" />
      </button>
      <button
        type="button"
        className="w-9 h-9 flex items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 transition-colors cursor-pointer"
        aria-label="Settings"
      >
        <Settings className="w-4.5 h-4.5" />
      </button>
    </div>
  );
}