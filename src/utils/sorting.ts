/**
 * Centralized sorting utilities for advocates
 * Prevents code duplication and ensures consistent sorting behavior
 */

import { Advocate } from "@/types/advocate";

export type SortField = keyof Advocate;
export type SortDirection = "asc" | "desc";

/**
 * Generic sorting function for advocates
 * Handles both string and number comparisons
 */
export function sortAdvocates(
  advocates: Advocate[],
  sortField: SortField,
  sortDirection: SortDirection
): Advocate[] {
  return [...advocates].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    // Handle string comparison
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    // Handle number comparison
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    // Handle array comparison (for specialties)
    if (Array.isArray(aValue) && Array.isArray(bValue)) {
      const aLength = aValue.length;
      const bLength = bValue.length;
      return sortDirection === "asc" ? aLength - bLength : bLength - aLength;
    }

    return 0;
  });
}

/**
 * Toggle sort direction
 */
export function toggleSortDirection(currentDirection: SortDirection): SortDirection {
  return currentDirection === "asc" ? "desc" : "asc";
}
