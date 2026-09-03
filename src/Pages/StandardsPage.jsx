import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Sidebar from "../Components/Sidebar";
import TopBar from "../Components/TopBar";
import FilterBar from "../Components/FilterBar";
import StandardCard from "../Components/StandardCard";

const MOCK_RESULTS = [
  {
    code: "IS 10500:2012",
    status: "Active",
    category: "Mandatory",
    title: "Drinking Water — Specification (Second Revision)",
    description:
      "This standard prescribes the requirements and the methods of sampling and test for drinking water. It covers physical, chemical, and bacteriological parameters essential for ensuring water safety for human consumption.",
    aiInsight:
      "This is the primary baseline standard for all water purification systems in India. If you are manufacturing RO or UV purifiers, your product's output must adhere strictly to the acceptable limits defined in Table 1 (Physical Parameters) and Table 2 (General Parameters Concerning Substances Undesirable in Excessive Amounts) of this document.",
    relevanceMatch: 95,
  },
];

export default function StandardsPage() {
  const [query, setQuery] = useState("Water Purifiers");
  const [activeFilters, setActiveFilters] = useState(["mandatory"]);
  const [results, setResults] = useState(MOCK_RESULTS);

  const toggleFilter = (key) => {
    setActiveFilters((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
  };

  const handleSearch = async (searchQuery) => {
    console.log("search:", searchQuery, "filters:", activeFilters);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <Sidebar active="standards" />

      <div className="flex-1 min-w-0">
        <TopBar query={query} onQueryChange={setQuery} onSearch={handleSearch} />
        <FilterBar active={activeFilters} onToggle={toggleFilter} />

        <main className="px-8 py-6">
          <div className="flex items-end justify-between mb-5">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">
                Search Results
              </h1>
              <p className="text-sm text-neutral-500 mt-1">
                Found {results.length * 43 || 43} standards related to '{query}'
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

          <div className="space-y-4">
            {results.map((result) => (
              <StandardCard key={result.code} {...result} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}