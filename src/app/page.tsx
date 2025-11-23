"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { Advocate, PaginationInfo } from "@/types/advocate";
import { useDebounce } from "@/hooks/useDebounce";
import { useAdvocates } from "@/hooks/useAdvocates";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { exportToCSV } from "@/utils/export";
import { SearchBar } from "@/components/SearchBar";
import { AdvocateTable } from "@/components/AdvocateTable";
import { AdvocateCard } from "@/components/AdvocateCard";
import { SkeletonCard, SkeletonTable } from "@/components/ui/SkeletonLoader";
import { Pagination } from "@/components/Pagination";
import { InlineFilterBar, FilterState } from "@/components/InlineFilterBar";
import { SkipNav } from "@/components/SkipNav";

export default function Home() {
  const { recentSearches, addSearch, clearSearches } = useRecentSearches();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Keyboard shortcut: Press "/" to focus search
  useKeyboardShortcut("/", () => {
    const searchInput = document.getElementById("search-input");
    searchInput?.focus();
  });

  const [filters, setFilters] = useState<FilterState>({
    selectedCities: [],
    selectedDegrees: [],
    selectedSpecialties: [],
    experienceRange: [0, 20],
    sortField: "firstName",
    sortDirection: "asc",
    itemsPerPage: 10,
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch advocates with server-side filtering, sorting, and pagination
  const { advocates, pagination, loading, error } = useAdvocates({
    page: currentPage,
    limit: filters.itemsPerPage,
    search: debouncedSearchTerm,
    cities: filters.selectedCities,
    degrees: filters.selectedDegrees,
    specialties: filters.selectedSpecialties,
    minExperience: filters.experienceRange[0],
    maxExperience: filters.experienceRange[1],
    sortField: filters.sortField,
    sortDirection: filters.sortDirection,
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, filters]);

  // For filter dropdowns, we still need unique cities and specialties
  // We'll fetch these from the current page's data for now
  // In a real app, these might come from a separate endpoint
  const { cities, specialties } = useMemo(() => {
    const citiesSet = new Set<string>();
    const specialtiesSet = new Set<string>();

    advocates.forEach((advocate) => {
      citiesSet.add(advocate.city);
      advocate.specialties.forEach((specialty) => specialtiesSet.add(specialty));
    });

    return {
      cities: Array.from(citiesSet).sort(),
      specialties: Array.from(specialtiesSet).sort(),
    };
  }, [advocates]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    // Add to recent searches when user submits a search
    if (value.trim().length >= 3) {
      addSearch(value.trim());
    }
  }, [addSearch]);

  const handleReset = useCallback(() => {
    setSearchTerm("");
  }, []);

  const handleSelectRecentSearch = useCallback((search: string) => {
    setSearchTerm(search);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleFilterChange = useCallback((newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      selectedCities: [],
      selectedDegrees: [],
      selectedSpecialties: [],
      experienceRange: [0, 20],
      sortField: "firstName",
      sortDirection: "asc",
      itemsPerPage: 10,
    });
  }, []);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    try {
      // Fetch all advocates with current filters (no pagination limit)
      const queryParams = new URLSearchParams();
      queryParams.append("limit", "100000"); // Get all results
      if (debouncedSearchTerm) queryParams.append("search", debouncedSearchTerm);
      if (filters.selectedCities.length > 0) {
        queryParams.append("cities", filters.selectedCities.join(","));
      }
      if (filters.selectedDegrees.length > 0) {
        queryParams.append("degrees", filters.selectedDegrees.join(","));
      }
      if (filters.selectedSpecialties.length > 0) {
        queryParams.append("specialties", filters.selectedSpecialties.join(","));
      }
      queryParams.append("minExperience", filters.experienceRange[0].toString());
      queryParams.append("maxExperience", filters.experienceRange[1].toString());
      queryParams.append("sortField", filters.sortField);
      queryParams.append("sortDirection", filters.sortDirection);

      const response = await fetch(`/api/advocates?${queryParams.toString()}`);
      const data = await response.json();
      exportToCSV(data.data);
    } finally {
      setIsExporting(false);
    }
  }, [debouncedSearchTerm, filters]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-900">
            Solace Advocates
          </h1>
          <div className="mb-6 h-32 bg-gray-200 rounded-lg animate-pulse"></div>

          {/* Mobile skeleton */}
          <div className="block md:hidden space-y-4">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>

          {/* Desktop skeleton */}
          <div className="hidden md:block">
            <SkeletonTable />
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-900">
            Solace Advocates
          </h1>
          <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg">
            <p className="font-semibold text-lg mb-1">Error loading advocates</p>
            <p className="text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <SkipNav />
      <main id="main-content" className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Solace Advocates
            </h1>
            <p className="text-gray-600">
              Find mental health professionals that match your needs
            </p>
          </header>

          <SearchBar
            id="search-bar"
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onReset={handleReset}
            resultCount={pagination?.total ?? 0}
            totalCount={pagination?.total ?? 0}
            recentSearches={recentSearches}
            onSelectRecentSearch={handleSelectRecentSearch}
            onClearRecentSearches={clearSearches}
          />

        <section id="filter-bar" aria-label="Filter advocates">
          <InlineFilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            onExport={handleExport}
            totalResults={pagination?.total ?? 0}
            cities={cities}
            specialties={specialties}
            isExporting={isExporting}
          />
        </section>

        {advocates.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No advocates found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm
                ? `No advocates match your search for "${searchTerm}"`
                : "No advocates match your current filters"}
            </p>
            <button
              onClick={() => {
                handleReset();
                handleClearFilters();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            {/* Mobile: Card view */}
            <div className="block md:hidden space-y-4">
              {advocates.map((advocate, index) => (
                <AdvocateCard key={index} advocate={advocate} />
              ))}
            </div>

            {/* Desktop: Table view */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
              <AdvocateTable advocates={advocates} />
            </div>

            {/* Pagination */}
            {pagination && (
              <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
        </div>
      </main>
    </>
  );
}
