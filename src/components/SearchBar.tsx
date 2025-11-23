"use client";

import { memo, useState, useRef, useEffect } from "react";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onReset: () => void;
  resultCount?: number;
  totalCount?: number;
  id?: string;
  recentSearches?: string[];
  onSelectRecentSearch?: (search: string) => void;
  onClearRecentSearches?: () => void;
}

function SearchBarComponent({
  searchTerm,
  onSearchChange,
  onReset,
  resultCount,
  totalCount,
  id = "search-bar",
  recentSearches = [],
  onSelectRecentSearch,
  onClearRecentSearches,
}: SearchBarProps) {
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [inputValue, setInputValue] = useState(searchTerm);
  const searchRef = useRef<HTMLDivElement>(null);

  // Sync input value with prop when it changes externally (e.g., from recent searches or reset)
  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowRecentSearches(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    const trimmedValue = inputValue.trim();
    onSearchChange(trimmedValue);
    setShowRecentSearches(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleResetOrSearch = () => {
    if (searchTerm) {
      // If there's an active search, reset it
      onReset();
      setInputValue("");
    } else if (inputValue.trim()) {
      // If there's input but no active search, perform search
      handleSearch();
    }
  };

  // Determine if there's a pending search (input differs from active search)
  const hasPendingSearch = inputValue.trim() !== searchTerm && inputValue.trim().length > 0;

  return (
    <section
      id={id}
      className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100"
      aria-label="Search advocates"
    >
      <label htmlFor="search-input" className="block text-sm font-semibold text-gray-800 mb-2">
        Search Advocates
      </label>

      <div className="flex flex-col sm:flex-row gap-3">
        <div ref={searchRef} className="flex-1 relative">
          <input
            id="search-input"
            type="search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => recentSearches.length > 0 && setShowRecentSearches(true)}
            placeholder="Search by name, city, degree, specialty, or experience..."
            className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            aria-label="Search advocates by name, city, degree, specialty, or experience"
            aria-describedby={resultCount !== undefined ? "search-results-count" : undefined}
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

          {/* Recent Searches Dropdown */}
          {showRecentSearches && recentSearches.length > 0 && (
            <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
              <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
                <span className="text-xs font-semibold text-gray-600 uppercase">Recent Searches</span>
                {onClearRecentSearches && (
                  <button
                    onClick={() => {
                      onClearRecentSearches();
                      setShowRecentSearches(false);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-700"
                    aria-label="Clear recent searches"
                  >
                    Clear
                  </button>
                )}
              </div>
              <ul className="py-1">
                {recentSearches.map((search, index) => (
                  <li key={index}>
                    <button
                      onClick={() => {
                        onSelectRecentSearch?.(search);
                        setShowRecentSearches(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm text-gray-700">{search}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
          onClick={handleResetOrSearch}
          disabled={!searchTerm && !inputValue.trim()}
          className={`px-6 py-2.5 border rounded-lg font-medium transition-colors shadow-sm ${
            searchTerm
              ? "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              : hasPendingSearch
                ? "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
                : "bg-white border-gray-300 text-gray-700"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label={searchTerm ? "Reset search" : "Search"}
        >
          {searchTerm ? "Reset" : "Search"}
        </button>
      </div>

      {resultCount !== undefined && totalCount !== undefined && (
        <div className="mt-3 flex items-center justify-between text-sm" role="status" aria-live="polite">
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
          <p id="search-results-count" className="text-gray-600 font-medium">
            {resultCount} of {totalCount} advocates
          </p>
        </div>
      )}
    </section>
  );
}

export const SearchBar = memo(SearchBarComponent);
