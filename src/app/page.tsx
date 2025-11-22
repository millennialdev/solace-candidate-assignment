"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Advocate, PaginationInfo } from "@/types/advocate";
import { useDebounce } from "@/hooks/useDebounce";
import { useAdvocates } from "@/hooks/useAdvocates";
import { exportToCSV } from "@/utils/export";
import { SearchBar } from "@/components/SearchBar";
import { AdvocateTable } from "@/components/AdvocateTable";
import { AdvocateCard } from "@/components/AdvocateCard";
import { SkeletonCard, SkeletonTable } from "@/components/ui/SkeletonLoader";
import { Pagination } from "@/components/Pagination";
import { InlineFilterBar, FilterState } from "@/components/InlineFilterBar";

export default function Home() {
  const { advocates, loading, error } = useAdvocates();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

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

  // Extract unique cities and specialties from advocates
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

  const filteredAdvocates = useMemo(() => {
    let filtered = advocates;

    // Apply search filter
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter((advocate) => {
        return (
          advocate.firstName.toLowerCase().includes(searchLower) ||
          advocate.lastName.toLowerCase().includes(searchLower) ||
          advocate.city.toLowerCase().includes(searchLower) ||
          advocate.degree.toLowerCase().includes(searchLower) ||
          advocate.specialties.some((specialty) =>
            specialty.toLowerCase().includes(searchLower)
          ) ||
          advocate.yearsOfExperience.toString().includes(searchLower)
        );
      });
    }

    // Apply city filter
    if (filters.selectedCities.length > 0) {
      filtered = filtered.filter((advocate) =>
        filters.selectedCities.includes(advocate.city)
      );
    }

    // Apply degree filter
    if (filters.selectedDegrees.length > 0) {
      filtered = filtered.filter((advocate) =>
        filters.selectedDegrees.includes(advocate.degree)
      );
    }

    // Apply specialty filter
    if (filters.selectedSpecialties.length > 0) {
      filtered = filtered.filter((advocate) =>
        advocate.specialties.some((specialty) =>
          filters.selectedSpecialties.includes(specialty)
        )
      );
    }

    // Apply experience range filter
    filtered = filtered.filter(
      (advocate) =>
        advocate.yearsOfExperience >= filters.experienceRange[0] &&
        advocate.yearsOfExperience <= filters.experienceRange[1]
    );

    return filtered;
  }, [advocates, debouncedSearchTerm, filters]);

  // Apply sorting
  const sortedAdvocates = useMemo(() => {
    return [...filteredAdvocates].sort((a, b) => {
      const aValue = a[filters.sortField as keyof Advocate];
      const bValue = b[filters.sortField as keyof Advocate];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return filters.sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return filters.sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [filteredAdvocates, filters.sortField, filters.sortDirection]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, filters]);

  // Client-side pagination
  const paginationInfo: PaginationInfo = useMemo(() => {
    return {
      page: currentPage,
      limit: filters.itemsPerPage,
      total: sortedAdvocates.length,
      totalPages: Math.ceil(sortedAdvocates.length / filters.itemsPerPage),
    };
  }, [currentPage, sortedAdvocates.length, filters.itemsPerPage]);

  const paginatedAdvocates = useMemo(() => {
    const startIndex = (currentPage - 1) * filters.itemsPerPage;
    const endIndex = startIndex + filters.itemsPerPage;
    return sortedAdvocates.slice(startIndex, endIndex);
  }, [sortedAdvocates, currentPage, filters.itemsPerPage]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleReset = useCallback(() => {
    setSearchTerm("");
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

  const handleExport = useCallback(() => {
    exportToCSV(sortedAdvocates);
  }, [sortedAdvocates]);

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
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Solace Advocates
          </h1>
          <p className="text-gray-600">
            Find mental health professionals that match your needs
          </p>
        </div>

        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onReset={handleReset}
          resultCount={filteredAdvocates.length}
          totalCount={advocates.length}
        />

        <InlineFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          onExport={handleExport}
          totalResults={sortedAdvocates.length}
          cities={cities}
          specialties={specialties}
        />

        {sortedAdvocates.length === 0 ? (
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
              {paginatedAdvocates.map((advocate, index) => (
                <AdvocateCard key={index} advocate={advocate} />
              ))}
            </div>

            {/* Desktop: Table view */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
              <AdvocateTable advocates={paginatedAdvocates} />
            </div>

            {/* Pagination */}
            <Pagination
              pagination={paginationInfo}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </main>
  );
}
