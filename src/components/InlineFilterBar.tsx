import { memo } from "react";
import { RangeSlider } from "./ui/RangeSlider";

export interface FilterState {
  selectedCities: string[];
  selectedDegrees: string[];
  selectedSpecialties: string[];
  experienceRange: [number, number];
  sortField: string;
  sortDirection: "asc" | "desc";
  itemsPerPage: number;
}

interface InlineFilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onClearFilters: () => void;
  onExport: () => void;
  totalResults: number;
  cities: string[];
  specialties: string[];
}

const DEGREES = ["MD", "PhD", "MSW"];
const SORT_FIELDS = [
  { value: "firstName", label: "First Name" },
  { value: "lastName", label: "Last Name" },
  { value: "city", label: "City" },
  { value: "yearsOfExperience", label: "Experience" },
];
const ITEMS_PER_PAGE_OPTIONS = [5, 10, 15, 30, 60];

function InlineFilterBarComponent({
  filters,
  onFilterChange,
  onClearFilters,
  onExport,
  totalResults,
  cities,
  specialties,
}: InlineFilterBarProps) {
  const hasActiveFilters =
    filters.selectedCities.length > 0 ||
    filters.selectedDegrees.length > 0 ||
    filters.selectedSpecialties.length > 0 ||
    filters.experienceRange[0] !== 0 ||
    filters.experienceRange[1] !== 20;

  const handleMultiSelect = (
    field: "selectedCities" | "selectedDegrees" | "selectedSpecialties",
    value: string
  ) => {
    const current = filters[field];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFilterChange({ [field]: updated });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Filters & Options</h2>
        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          )}
          <button
            onClick={onExport}
            disabled={totalResults === 0}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export CSV ({totalResults})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* City Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City {filters.selectedCities.length > 0 && `(${filters.selectedCities.length})`}
          </label>
          <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2 space-y-1">
            {cities.map((city) => (
              <label
                key={city}
                className="flex items-center px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.selectedCities.includes(city)}
                  onChange={() => handleMultiSelect("selectedCities", city)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{city}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Degree Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Degree {filters.selectedDegrees.length > 0 && `(${filters.selectedDegrees.length})`}
          </label>
          <div className="space-y-2 border border-gray-300 rounded-lg p-3">
            {DEGREES.map((degree) => (
              <label
                key={degree}
                className="flex items-center px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.selectedDegrees.includes(degree)}
                  onChange={() => handleMultiSelect("selectedDegrees", degree)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{degree}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Specialty Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Specialties {filters.selectedSpecialties.length > 0 && `(${filters.selectedSpecialties.length})`}
          </label>
          <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2 space-y-1">
            {specialties.map((specialty) => (
              <label
                key={specialty}
                className="flex items-center px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.selectedSpecialties.includes(specialty)}
                  onChange={() => handleMultiSelect("selectedSpecialties", specialty)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{specialty}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Experience Range */}
        <div>
          <RangeSlider
            min={0}
            max={20}
            value={filters.experienceRange}
            onChange={(range) => onFilterChange({ experienceRange: range })}
            label="Years of Experience"
            formatValue={(v) => (v === 20 ? "20+" : v.toString())}
          />
        </div>
      </div>

      {/* Sort and Display Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
        {/* Sort Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={filters.sortField}
            onChange={(e) => onFilterChange({ sortField: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {SORT_FIELDS.map((field) => (
              <option key={field.value} value={field.value}>
                {field.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Direction */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort Order
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => onFilterChange({ sortDirection: "asc" })}
              className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                filters.sortDirection === "asc"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              ↑ Asc
            </button>
            <button
              onClick={() => onFilterChange({ sortDirection: "desc" })}
              className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                filters.sortDirection === "desc"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              ↓ Desc
            </button>
          </div>
        </div>

        {/* Items Per Page */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Items Per Page
          </label>
          <select
            value={filters.itemsPerPage}
            onChange={(e) => onFilterChange({ itemsPerPage: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {ITEMS_PER_PAGE_OPTIONS.map((count) => (
              <option key={count} value={count}>
                {count} per page
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export const InlineFilterBar = memo(InlineFilterBarComponent);
