import { Check, Plus } from "lucide-react";

const FILTERS = [
  { key: "mandatory", label: "Mandatory" },
  { key: "voluntary", label: "Voluntary" },
  { key: "draft", label: "Draft" },
];

export default function FilterBar({ active = ["mandatory"], onToggle, onMoreFilters }) {
  return (
    <div className="flex items-center gap-2.5 px-8">
      <span className="text-xs font-semibold text-neutral-400 tracking-wide mr-1">
        FILTERS:
      </span>
      {FILTERS.map(({ key, label }) => {
        const isActive = active.includes(key);
        return (
          <button
            key={key}
            type="button"
            onClick={() => onToggle?.(key)}
            className={`inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-3.5 py-1.5 border transition-colors ${
              isActive
                ? "bg-[#0d234f] border-[#0d234f] text-white"
                : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            {isActive && <Check className="w-3 h-3" strokeWidth={3} />}
            {label}
          </button>
        );
      })}
      <button
        type="button"
        onClick={onMoreFilters}
        className="inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-3.5 py-1.5 border border-dashed border-neutral-300 text-neutral-500 hover:bg-neutral-50"
      >
        <Plus className="w-3 h-3" strokeWidth={3} />
        More Filters
      </button>
    </div>
  );
}