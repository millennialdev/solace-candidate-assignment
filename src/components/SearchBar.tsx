import { memo } from "react";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onReset: () => void;
  resultCount?: number;
  totalCount?: number;
}

function SearchBarComponent({
  searchTerm,
  onSearchChange,
  onReset,
  resultCount,
  totalCount,
}: SearchBarProps) {
  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
      <label htmlFor="search" className="block text-sm font-semibold text-gray-800 mb-2">
        Search Advocates
      </label>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, city, degree, specialty, or experience..."
            className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
          <svg
            className="absolute left-3 top-3 h-5 w-5 text-gray-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>

        <button
          onClick={onReset}
          disabled={!searchTerm}
          className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          Reset
        </button>
      </div>

      {resultCount !== undefined && totalCount !== undefined && (
        <div className="mt-3 flex items-center justify-between text-sm">
          <p className="text-gray-700">
            {searchTerm ? (
              <>
                Searching for:{" "}
                <span className="font-semibold text-blue-700">&quot;{searchTerm}&quot;</span>
              </>
            ) : (
              <span className="text-gray-600">Showing all advocates</span>
            )}
          </p>
          <p className="text-gray-600 font-medium">
            {resultCount} of {totalCount} advocates
          </p>
        </div>
      )}
    </div>
  );
}

export const SearchBar = memo(SearchBarComponent);
