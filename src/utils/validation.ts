/**
 * Input validation and sanitization utilities
 * Helps prevent XSS and injection attacks
 */

/**
 * Sanitize a string to prevent XSS attacks
 * Removes potentially dangerous HTML/script tags
 */
export function sanitizeString(input: string): string {
  if (!input) return "";

  return input
    .replace(/[<>]/g, "") // Remove < and > to prevent HTML injection
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers like onclick=
    .trim();
}

/**
 * Validate and sanitize search query
 * Ensures search terms are safe and within reasonable length
 */
export function validateSearchQuery(query: string | null): string {
  if (!query) return "";

  // Limit length to prevent DoS
  const maxLength = 200;
  const truncated = query.slice(0, maxLength);

  return sanitizeString(truncated);
}

/**
 * Validate pagination parameters
 * Ensures page and limit are positive integers within acceptable ranges
 */
export function validatePagination(params: {
  page?: string | null;
  limit?: string | null;
}): { page: number; limit: number } {
  const page = parseInt(params.page || "1");
  const limit = parseInt(params.limit || "10");

  return {
    page: Math.max(1, Math.min(page, 10000)), // Max 10000 pages
    limit: Math.max(1, Math.min(limit, 100)), // Max 100 items per page
  };
}

/**
 * Validate filter values to prevent injection
 */
export function validateFilter(value: string | null): string {
  if (!value) return "";
  return sanitizeString(value);
}

/**
 * Validate degree filter
 */
export function validateDegree(degree: string | null): "MD" | "PhD" | "MSW" | "" {
  if (!degree) return "";
  const upper = degree.toUpperCase();
  if (upper === "MD" || upper === "PHD" || upper === "MSW") {
    return upper as "MD" | "PhD" | "MSW";
  }
  return "";
}

/**
 * Validate years of experience range
 */
export function validateYearsRange(value: string | null): number | null {
  if (!value) return null;
  const num = parseInt(value);
  if (isNaN(num)) return null;
  return Math.max(0, Math.min(num, 100)); // 0-100 years
}

/**
 * Validate and parse comma-separated array of values
 */
export function validateArray(value: string | null, maxItems = 50): string[] {
  if (!value) return [];

  const items = value.split(",").map((item) => sanitizeString(item)).filter(Boolean);
  return items.slice(0, maxItems); // Limit number of items
}

/**
 * Validate sort field
 */
export function validateSortField(
  field: string | null
): "firstName" | "lastName" | "city" | "degree" | "yearsOfExperience" {
  const validFields = ["firstName", "lastName", "city", "degree", "yearsOfExperience"];
  if (field && validFields.includes(field)) {
    return field as "firstName" | "lastName" | "city" | "degree" | "yearsOfExperience";
  }
  return "firstName"; // Default
}

/**
 * Validate sort direction
 */
export function validateSortDirection(direction: string | null): "asc" | "desc" {
  if (direction === "desc") return "desc";
  return "asc"; // Default
}
