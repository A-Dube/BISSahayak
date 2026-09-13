import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ChevronDown,
  SearchX,
  FileText,
  Search,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import Sidebar from "../Components/Sidebar";
import TopBar from "../Components/TopBar";
import FilterBar from "../Components/FilterBar";

import { useSidebarNav } from "../Utils/Navigation";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

import { searchStandards } from "../services/standardsService";

export default function StandardsPage() {
  const navigate = useNavigate();
  const onNavigate = useSidebarNav();

  const { logout } = useAuth();
  const { t } = useLanguage();

  const [searchParams, setSearchParams] = useSearchParams();

  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [hasSearched, setHasSearched] = useState(
    Boolean(initialQuery.trim())
  );

  const [activeFilters, setActiveFilters] = useState([]);

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const runSearch = async (searchQuery) => {
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) {
      setResults([]);
      setHasSearched(false);
      setError("");
      return;
    }

    setLoading(true);
    setError("");
    setHasSearched(true);

    try {
      const data = await searchStandards({
        query: trimmedQuery,
      });

      const standardResults = Array.isArray(data?.results)
        ? data.results
        : [];

      setResults(standardResults);
    } catch (err) {
      console.error("Standards search error:", err);

      setResults([]);
      setError(
        "Unable to fetch standards right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // INITIAL SEARCH FROM URL
  // --------------------------------------------------

  useEffect(() => {
    if (initialQuery.trim()) {
      runSearch(initialQuery);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --------------------------------------------------
  // SEARCH HANDLER
  // --------------------------------------------------

  const handleSearch = (searchQuery) => {
    const trimmedQuery = searchQuery.trim();

    setQuery(searchQuery);

    if (!trimmedQuery) {
      setSearchParams({});
      setResults([]);
      setHasSearched(false);
      setError("");
      return;
    }

    setSearchParams({
      q: trimmedQuery,
    });

    runSearch(trimmedQuery);
  };

  // --------------------------------------------------
  // FILTER UI
  // --------------------------------------------------

  const toggleFilter = (key) => {
    setActiveFilters((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key]
    );
  };

  // --------------------------------------------------
  // POPULAR SEARCH
  // --------------------------------------------------

  const handlePopularSearch = (value) => {
    setQuery(value);
    handleSearch(value);
  };

  // --------------------------------------------------
  // ASK SAHAYAK
  // --------------------------------------------------

  const handleAskSahayak = (standard) => {
    const prompt = `Tell me about ${standard.standard_number}: ${standard.title}`;

    navigate(`/assistant?prompt=${encodeURIComponent(prompt)}`);
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-neutral-50 flex font-sans text-neutral-900">
      {/* ================= SIDEBAR ================= */}

      <Sidebar
        active="standards"
        onNavigate={onNavigate}
        onStartCertification={() => navigate("/certification")}
        onLogout={logout}
      />

      {/* ================= MAIN AREA ================= */}

      <div className="flex-1 min-w-0">
        {/* TOP BAR */}

        <TopBar
          query={query}
          onQueryChange={setQuery}
          onSearch={handleSearch}
        />

        {/* FILTER BAR */}

        <FilterBar
          active={activeFilters}
          onToggle={toggleFilter}
        />

        {/* ================= CONTENT ================= */}

        <main className="px-8 py-7">
          {/* =====================================================
              EMPTY / INITIAL STATE
          ====================================================== */}

          {!hasSearched && !loading && (
            <section className="max-w-4xl mx-auto pt-10 md:pt-16">
              <div className="text-center">
                {/* ICON */}

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100">
                  <FileText className="h-8 w-8 text-emerald-600" />
                </div>

                {/* HEADING */}

                <h1 className="mt-6 text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">
                  Explore Indian Standards
                </h1>

                {/* DESCRIPTION */}

                <p className="mt-3 max-w-2xl mx-auto text-base leading-7 text-neutral-500">
                  Find the right BIS standard for your product,
                  industry, or requirement.
                </p>

                {/* SEARCH EXAMPLES */}

                <div className="mt-10">
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    <Sparkles className="w-4 h-4" />
                    Popular searches
                  </div>

                  <div className="mt-4 flex flex-wrap justify-center gap-3">
                    {[
                      "Helmet",
                      "Water Purifier",
                      "Gold",
                      "Cement",
                    ].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handlePopularSearch(item)}
                        className="
                          group
                          inline-flex
                          items-center
                          gap-2
                          rounded-full
                          border
                          border-neutral-200
                          bg-white
                          px-5
                          py-2.5
                          text-sm
                          font-medium
                          text-neutral-600
                          shadow-sm
                          transition
                          hover:border-emerald-300
                          hover:bg-emerald-50
                          hover:text-emerald-700
                        "
                      >
                        <Search className="w-4 h-4" />

                        {item}

                        <ArrowRight
                          className="
                            w-3.5
                            h-3.5
                            opacity-0
                            -translate-x-1
                            transition
                            group-hover:opacity-100
                            group-hover:translate-x-0
                          "
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* HELP TEXT */}

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                  <InfoCard
                    title="Search by product"
                    description="Example: helmets, cement, water purifier"
                  />

                  <InfoCard
                    title="Search by standard"
                    description="Example: IS 4151:2015"
                  />

                  <InfoCard
                    title="Search by requirement"
                    description="Example: safety standards for helmets"
                  />
                </div>
              </div>
            </section>
          )}

          {/* =====================================================
              LOADING STATE
          ====================================================== */}

          {loading && (
            <section className="max-w-5xl mx-auto">
              {/* Loading heading */}

              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-48 animate-pulse rounded-lg bg-neutral-200" />

                  <div className="h-6 w-20 animate-pulse rounded-full bg-neutral-100" />
                </div>

                <div className="mt-2 h-4 w-80 animate-pulse rounded bg-neutral-100" />
              </div>

              {/* Skeleton cards */}

              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="
                      rounded-2xl
                      border
                      border-neutral-200
                      bg-white
                      p-6
                      shadow-sm
                    "
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="h-5 w-32 animate-pulse rounded bg-neutral-200" />

                        <div className="mt-4 h-6 w-3/4 animate-pulse rounded bg-neutral-200" />

                        <div className="mt-4 h-4 w-full animate-pulse rounded bg-neutral-100" />

                        <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-neutral-100" />

                        <div className="mt-5 h-6 w-48 animate-pulse rounded-full bg-neutral-100" />
                      </div>

                      <div className="h-8 w-24 animate-pulse rounded-full bg-neutral-100" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Small loading message */}

              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-neutral-400">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  Searching BIS standards for "{query.trim()}"...
                </span>
              </div>
            </section>
          )}

          {/* =====================================================
              SEARCHED STATE
          ====================================================== */}

          {!loading && hasSearched && (
            <section className="max-w-5xl mx-auto">
              {/* ================= HEADER ================= */}

              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-tight">
                      Search Results
                    </h1>

                    {results.length > 0 && (
                      <span className="rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {results.length} found
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-neutral-500">
                    {results.length > 0
                      ? `Standards matching "${query.trim()}"`
                      : `No standards found for "${query.trim()}"`}
                  </p>
                </div>

                {/* SORT */}

                {results.length > 0 && (
                  <button
                    type="button"
                    className="
                      inline-flex
                      items-center
                      gap-2
                      self-start
                      md:self-auto
                      rounded-lg
                      border
                      border-neutral-200
                      bg-white
                      px-4
                      py-2
                      text-sm
                      text-neutral-600
                      shadow-sm
                      hover:bg-neutral-50
                    "
                  >
                    <span>Sort by:</span>

                    <span className="font-semibold text-neutral-800">
                      Relevance
                    </span>

                    <ChevronDown className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* ================= ERROR ================= */}

              {error && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <SearchX className="h-5 w-5 text-amber-600" />
                    </div>

                    <div>
                      <p className="font-semibold text-amber-800">
                        Search temporarily unavailable
                      </p>

                      <p className="mt-1 text-sm text-amber-700">
                        {error}
                      </p>

                      <button
                        type="button"
                        onClick={() => runSearch(query)}
                        className="
                          mt-3
                          rounded-lg
                          bg-amber-600
                          px-4
                          py-2
                          text-sm
                          font-medium
                          text-white
                          hover:bg-amber-700
                        "
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= NO RESULTS ================= */}

              {!error && results.length === 0 && (
                <div
                  className="
                    rounded-2xl
                    border
                    border-neutral-200
                    bg-white
                    px-6
                    py-16
                    text-center
                    shadow-sm
                  "
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
                    <SearchX className="h-7 w-7 text-neutral-400" />
                  </div>

                  <h2 className="mt-5 text-lg font-semibold text-neutral-800">
                    No standards found
                  </h2>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
                    We couldn't find a matching BIS standard.
                    Try searching with a product name, standard
                    number, or a different keyword.
                  </p>

                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {["Helmet", "Gold", "Cement", "Water Purifier"].map(
                      (item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => handlePopularSearch(item)}
                          className="
                            rounded-full
                            border
                            border-neutral-200
                            bg-white
                            px-4
                            py-2
                            text-sm
                            text-neutral-600
                            hover:border-emerald-300
                            hover:bg-emerald-50
                            hover:text-emerald-700
                          "
                        >
                          {item}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* ================= RESULTS ================= */}

              {!error && results.length > 0 && (
                <div className="space-y-4">
                  {results.map((standard, index) => (
                    <StandardResultCard
                      key={
                        standard.standard_number ||
                        standard.code ||
                        index
                      }
                      standard={standard}
                      onAskSahayak={handleAskSahayak}
                    />
                  ))}
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

/* ============================================================
   INFO CARD
============================================================ */

function InfoCard({ title, description }) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-neutral-200
        bg-white
        p-5
        shadow-sm
      "
    >
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-emerald-500" />

        <h3 className="text-sm font-semibold text-neutral-800">
          {title}
        </h3>
      </div>

      <p className="mt-2 text-sm leading-5 text-neutral-500">
        {description}
      </p>
    </div>
  );
}

/* ============================================================
   STANDARD RESULT CARD
============================================================ */

function StandardResultCard({ standard, onAskSahayak }) {
  const standardNumber =
    standard.standard_number || standard.code || "BIS Standard";

  const title =
    standard.title || "Indian Standard";

  const category =
    standard.category || "BIS Standard";

  const description =
    standard.description ||
    "No description available for this standard.";

  const relevance =
    standard.relevance || "";

  return (
    <article
      className="
        group
        rounded-2xl
        border
        border-neutral-200
        bg-white
        p-6
        shadow-sm
        transition
        duration-200
        hover:-translate-y-0.5
        hover:border-emerald-200
        hover:shadow-md
      "
    >
      {/* TOP ROW */}

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        {/* LEFT */}

        <div className="min-w-0">
          {/* STANDARD NUMBER */}

          <div className="flex flex-wrap items-center gap-2">
            <span
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-lg
                bg-neutral-100
                px-3
                py-1.5
                text-sm
                font-bold
                text-neutral-800
              "
            >
              <FileText className="h-4 w-4 text-emerald-600" />

              {standardNumber}
            </span>

            {/* CATEGORY */}

            <span
              className="
                rounded-full
                border
                border-neutral-200
                bg-white
                px-3
                py-1
                text-xs
                font-medium
                text-neutral-500
              "
            >
              {category}
            </span>
          </div>

          {/* TITLE */}

          <h2
            className="
              mt-4
              text-xl
              font-bold
              leading-7
              text-neutral-900
              group-hover:text-emerald-700
              transition
            "
          >
            {title}
          </h2>

          {/* DESCRIPTION */}

          <p className="mt-3 text-sm leading-6 text-neutral-600">
            {description}
          </p>
        </div>

        {/* STATUS */}

        <div
          className="
            inline-flex
            shrink-0
            items-center
            gap-1.5
            rounded-full
            bg-emerald-50
            px-3
            py-1.5
            text-xs
            font-semibold
            text-emerald-700
          "
        >
          <CheckCircle2 className="h-3.5 w-3.5" />

          Relevant
        </div>
      </div>

      {/* RELEVANCE */}

      {relevance && (
        <div
          className="
            mt-5
            rounded-xl
            border
            border-emerald-100
            bg-emerald-50/60
            px-4
            py-3
          "
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Why this standard matters
          </p>

          <p className="mt-1.5 text-sm leading-5 text-emerald-900">
            {relevance}
          </p>
        </div>
      )}

      {/* BOTTOM */}

      <div
        className="
          mt-6
          flex
          flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-3
          border-t
          border-neutral-100
          pt-5
        "
      >
        <p className="text-xs text-neutral-400">
          BIS Indian Standard
        </p>

        <button
          type="button"
          onClick={() => onAskSahayak(standard)}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[#102A56]
            px-5
            py-2.5
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-[#0b2145]
            active:scale-[0.98]
          "
        >
          Ask Sahayak

          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}