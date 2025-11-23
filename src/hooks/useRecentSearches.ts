import { useState, useEffect, useCallback } from "react";

const MAX_RECENT_SEARCHES = 5;
const STORAGE_KEY = "solace-recent-searches";

/**
 * Hook to manage recent searches with localStorage persistence
 */
export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          setRecentSearches(JSON.parse(saved));
        }
      } catch (error) {
        // Ignore localStorage errors
      }
    }
  }, []);

  // Add a search to recent searches
  const addSearch = useCallback((query: string) => {
    if (!query.trim()) return;

    setRecentSearches((prev) => {
      // Remove duplicates and add to front
      const filtered = prev.filter((s) => s.toLowerCase() !== query.toLowerCase());
      const updated = [query, ...filtered].slice(0, MAX_RECENT_SEARCHES);

      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        // Ignore localStorage errors
      }

      return updated;
    });
  }, []);

  // Clear all recent searches
  const clearSearches = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      // Ignore localStorage errors
    }
  }, []);

  return { recentSearches, addSearch, clearSearches };
}
