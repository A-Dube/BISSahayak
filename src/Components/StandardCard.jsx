import { Sparkles, Download, BookOpen, History } from "lucide-react";

export default function StandardCard({
  code = "IS 0000",
  status = "Active",
  category,
  title = "Standard Specification",
  description = "",
  aiInsight,
  relevanceMatch,
  onDownloadPdf,
  onViewReference,
  onRevisionHistory,
}) {
  return (
    <div className="relative bg-white border border-neutral-200 rounded-xl pl-6 pr-6 py-5 overflow-hidden">
      <span className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />

      <div className="flex items-start justify-between gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold font-mono bg-neutral-100 text-neutral-700 rounded px-2 py-1">
              {code}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {status}
            </span>
            {category && (
              <span className="text-xs font-semibold bg-[#0d234f]/10 text-[#0d234f] rounded px-2 py-1">
                {category}
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-neutral-900 mb-2">{title}</h3>
          {description && (
            <p className="text-sm text-neutral-500 leading-relaxed max-w-2xl">
              {description}
            </p>
          )}
        </div>

        {typeof relevanceMatch === "number" && (
          <div className="shrink-0 text-right">
            <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600">
              {relevanceMatch}%
              <svg viewBox="0 0 20 20" className="w-4 h-4" fill="currentColor">
                <path d="M10 1a9 9 0 100 18 9 9 0 000-18zm4.28 6.7-5 5a1 1 0 01-1.42 0l-2.5-2.5a1 1 0 111.42-1.4L8.5 10.6l4.36-4.3a1 1 0 011.42 1.4z" />
              </svg>
            </span>
            <p className="text-[11px] text-neutral-400 mb-1">Relevance Match</p>
            <div className="w-20 h-1 rounded-full bg-neutral-100 ml-auto overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${Math.min(100, Math.max(0, relevanceMatch))}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {aiInsight && (
        <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-4 mt-4">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-[#0d234f] mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            AI INSIGHTS
          </p>
          <p className="text-sm text-neutral-600 leading-relaxed">{aiInsight}</p>
        </div>
      )}

      <div className="flex items-center justify-between mt-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onDownloadPdf}
            className="inline-flex items-center gap-2 bg-[#0d234f] hover:bg-[#0a1c40] text-white text-sm font-semibold rounded-lg px-4 py-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
          <button
            type="button"
            onClick={onViewReference}
            className="inline-flex items-center gap-2 border border-neutral-300 text-neutral-700 text-sm font-semibold rounded-lg px-4 py-2 hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            View Reference
          </button>
        </div>
        <button
          type="button"
          onClick={onRevisionHistory}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-neutral-600 cursor-pointer"
        >
          <History className="w-3.5 h-3.5" />
          Revision History
        </button>
      </div>
    </div>
  );
}