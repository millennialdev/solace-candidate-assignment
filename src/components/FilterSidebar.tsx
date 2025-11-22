import { useState, memo } from "react";

interface FilterSidebarProps {
  selectedDegrees: string[];
  onDegreeChange: (degrees: string[]) => void;
  experienceRange: [number, number];
  onExperienceChange: (range: [number, number]) => void;
  onExport: () => void;
  totalResults: number;
}

const degrees = ["MD", "PhD", "MSW"];

function FilterSidebarComponent({
  selectedDegrees,
  onDegreeChange,
  experienceRange,
  onExperienceChange,
  onExport,
  totalResults,
}: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDegreeToggle = (degree: string) => {
    if (selectedDegrees.includes(degree)) {
      onDegreeChange(selectedDegrees.filter((d) => d !== degree));
    } else {
      onDegreeChange([...selectedDegrees, degree]);
    }
  };

  const handleClearFilters = () => {
    onDegreeChange([]);
    onExperienceChange([0, 20]);
  };

  const hasActiveFilters =
    selectedDegrees.length > 0 ||
    experienceRange[0] !== 0 ||
    experienceRange[1] !== 20;

  return (
    <div className="mb-6">
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full md:hidden flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg mb-4"
      >
        <span className="font-medium text-gray-700">
          Filters {hasActiveFilters && `(${selectedDegrees.length + (experienceRange[0] !== 0 || experienceRange[1] !== 20 ? 1 : 0)})`}
        </span>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Filter content */}
      <div className={`${isOpen ? "block" : "hidden"} md:block bg-white border border-gray-200 rounded-lg p-4 space-y-6`}>
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Degree filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Degree
            </label>
            <div className="space-y-2">
              {degrees.map((degree) => (
                <label key={degree} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedDegrees.includes(degree)}
                    onChange={() => handleDegreeToggle(degree)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{degree}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Experience range filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Years of Experience: {experienceRange[0]} - {experienceRange[1]}+
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="20"
                value={experienceRange[0]}
                onChange={(e) =>
                  onExperienceChange([
                    parseInt(e.target.value),
                    experienceRange[1],
                  ])
                }
                className="w-full"
              />
              <input
                type="range"
                min="0"
                max="20"
                value={experienceRange[1]}
                onChange={(e) =>
                  onExperienceChange([
                    experienceRange[0],
                    parseInt(e.target.value),
                  ])
                }
                className="w-full"
              />
            </div>
          </div>

          {/* Export button */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={onExport}
              disabled={totalResults === 0}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
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
              Export to CSV ({totalResults})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const FilterSidebar = memo(FilterSidebarComponent);
