/**
 * Skip navigation links for screen readers
 * Allows keyboard users to bypass repeated content
 */
export function SkipNav() {
  return (
    <nav aria-label="Skip navigation">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:shadow-lg transition-all"
      >
        Skip to main content
      </a>
      <a
        href="#search-bar"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:shadow-lg transition-all"
      >
        Skip to search
      </a>
      <a
        href="#filter-bar"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:shadow-lg transition-all"
      >
        Skip to filters
      </a>
    </nav>
  );
}
