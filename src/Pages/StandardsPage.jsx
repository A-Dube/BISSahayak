import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronDown, SearchX } from "lucide-react";
import Sidebar from "../Components/Sidebar";
import TopBar from "../Components/TopBar";
import FilterBar from "../Components/FilterBar";
import StandardCard from "../Components/StandardCard";
import LoadingScreen from "../Components/LoadingScreen";
import { useSidebarNav } from "../utils/navigation";
import { useAuth } from "../context/authContext";
import { searchStandards } from "../services/standardsService";

export default function StandardsPage() {
  const navigate = useNavigate();
  const onNavigate = useSidebarNav();
  const { logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [activeFilters, setActiveFilters] = useState(["mandatory"]);

  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const runSearch = async (searchQuery, filters) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError("");
    setHasSearched(true);

    try {
      const data = await searchStandards({ query: searchQuery, filters });
      setResults(Array.isArray(data?.results) ? data.results : []);
      setTotal(data?.total ?? (data?.results || []).length);
    } catch (err) {
      setError(
        "Standards search isn't live yet — waiting on the backend endpoint."
      );
      setResults([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query.trim()) {
      runSearch(query, activeFilters);
    }
  }, []);

  const toggleFilter = (key) => {
    const next = activeFilters.includes(key)
      ? activeFilters.filter((f) => f !== key)
      : [...activeFilters, key];
    setActiveFilters(next);
    if (hasSearched) runSearch(query, next);
  };

  const handleSearch = (searchQuery) => {
    setSearchParams(searchQuery ? { q: searchQuery } : {});
    runSearch(searchQuery, activeFilters);
  };

  if (loading && !hasSearched) {
    return <LoadingScreen message="Searching standards database..." />;
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {loading && <LoadingScreen message="Fetching latest standards..." />}

      <Sidebar
        active="standards"
        onNavigate={onNavigate}
        onStartCertification={() => navigate("/certification")}
        onLogout={logout}
      />

      <div className="flex-1 min-w-0">
        <TopBar query={query} onQueryChange={setQuery} onSearch={handleSearch} />
        <FilterBar active={activeFilters} onToggle={toggleFilter} />

        <main className="px-8 py-6">
          <div className="flex items-end justify-between mb-5">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">
                Search Results
              </h1>
              <p className="text-sm text-neutral-500 mt-1">
                {hasSearched
                  ? `Found ${total} standard${total === 1 ? "" : "s"} related to '${query}'`
                  : "Search above to find applicable standards."}
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-sm text-neutral-700"
            >
              Sort by: <span className="font-semibold">Relevance</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {!loading && error && (
            <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-xl p-5">
              {error}
            </div>
          )}

          {!loading && !error && hasSearched && results.length === 0 && (
            <div className="flex flex-col items-center text-center py-20 text-neutral-400">
              <SearchX className="w-8 h-8 mb-3" />
              <p className="font-medium text-neutral-600">No standards found</p>
              <p className="text-sm mt-1">
                Try a different search term or adjust your filters.
              </p>
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-4">
              {results.map((result) => (
                <StandardCard key={result.code} {...result} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}