'use client';

import { SecondaryButton } from '@saa/shared/components/saa';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  category?: string;
}

/**
 * Parse hash parameters from URL
 */
function getHashParams(): URLSearchParams {
  if (typeof window === 'undefined') return new URLSearchParams();
  const hash = window.location.hash.slice(1); // Remove '#'
  return new URLSearchParams(hash);
}

/**
 * Update hash in URL without auto-scrolling
 * Note: We handle scroll position manually after this function
 */
function setHashParams(params: URLSearchParams) {
  const hashString = params.toString();

  // Update hash using replaceState to avoid browser auto-scroll
  if (hashString) {
    history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${hashString}`);
  } else {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }

  // Do NOT restore scroll here - let goToPage handle it
}

/**
 * Pagination Controls Component
 *
 * Features:
 * - Previous/Next navigation using SecondaryButton from master controller
 * - Page indicator (e.g., "Page 2 of 5")
 * - Disabled states for first/last pages
 * - Maintains category filters in URL hash (static export compatible)
 * - Centered layout with responsive design
 */
export default function PaginationControls({
  currentPage,
  totalPages,
  category,
}: PaginationControlsProps) {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  /**
   * Navigate to a specific page using URL hash
   * Scrolls to top of blog posts section
   */
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;

    // Build URL with hash params
    const params = getHashParams();
    params.set('page', page.toString());

    if (category) {
      params.set('category', category);
    }

    setHashParams(params);

    // Scroll to the blog posts section - FORCE immediate scroll that overrides any animations
    // Use instant scroll to stop any ongoing scroll animations (footer icons, etc.)
    const postsHeading = document.getElementById('posts-heading');
    if (postsHeading) {
      const headerHeight = 90; // Fixed header height
      const spacing = 15; // Additional spacing from header
      const elementPosition = postsHeading.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerHeight - spacing;

      // IMMEDIATELY stop any ongoing scroll with instant behavior
      window.scrollTo({
        top: offsetPosition,
        behavior: 'instant'
      });
    }
  };

  return (
    <div className="mt-12 flex flex-col items-center gap-8">
      {/* Navigation Buttons */}
      <div className="flex items-center gap-6">
        {/* Previous Button */}
        <SecondaryButton
            as="button"
            onClick={() => goToPage(currentPage - 1)}
            className={`min-w-[180px] ${isFirstPage ? 'opacity-40 pointer-events-none' : ''}`}
          >
            Previous
          </SecondaryButton>

        {/* Page Numbers (optional - show current and nearby pages) */}
        <div className="hidden md:flex items-center gap-2">
          {/* Show first page if not nearby */}
          {currentPage > 3 && (
            <>
              <button
                onClick={() => goToPage(1)}
                className="
                  w-10 h-10
                  flex items-center justify-center
                  rounded-lg
                  border border-[#e5e4dd]/20
                  text-[#dcdbd5]
                  hover:border-[#00ff88]/50
                  hover:text-[#00ff88]
                  transition-all duration-300
                  font-[var(--font-taskor)]
                "
              >
                1
              </button>
              <span className="text-[#dcdbd5]/40">...</span>
            </>
          )}

          {/* Show nearby pages */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => {
              // Show current page and 1 page on each side
              return Math.abs(page - currentPage) <= 1;
            })
            .map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`
                  w-10 h-10
                  flex items-center justify-center
                  rounded-lg
                  border
                  font-[var(--font-taskor)]
                  transition-all duration-300
                  ${
                    page === currentPage
                      ? 'border-[#00ff88] bg-[#00ff88]/10 text-[#00ff88]'
                      : 'border-[#e5e4dd]/20 text-[#dcdbd5] hover:border-[#00ff88]/50 hover:text-[#00ff88]'
                  }
                `}
              >
                {page}
              </button>
            ))}

          {/* Show last page if not nearby */}
          {currentPage < totalPages - 2 && (
            <>
              <span className="text-[#dcdbd5]/40">...</span>
              <button
                onClick={() => goToPage(totalPages)}
                className="
                  w-10 h-10
                  flex items-center justify-center
                  rounded-lg
                  border border-[#e5e4dd]/20
                  text-[#dcdbd5]
                  hover:border-[#00ff88]/50
                  hover:text-[#00ff88]
                  transition-all duration-300
                  font-[var(--font-taskor)]
                "
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        {/* Next Button */}
        <SecondaryButton
            as="button"
            onClick={() => goToPage(currentPage + 1)}
            className={`min-w-[180px] ${isLastPage ? 'opacity-40 pointer-events-none' : ''}`}
          >
            Next
          </SecondaryButton>
      </div>

      {/* Mobile-only page jumper */}
      <div className="md:hidden flex items-center gap-4">
        <label htmlFor="page-select" className="text-[#dcdbd5] text-sm">
          Jump to:
        </label>
        <select
          id="page-select"
          value={currentPage}
          onChange={(e) => goToPage(Number(e.target.value))}
          className="
            px-4 py-2
            rounded-lg
            bg-[#1a1a1a]
            border border-[#e5e4dd]/20
            text-[#dcdbd5]
            font-[var(--font-taskor)]
            focus:border-[#00ff88]/50
            focus:outline-none
            transition-colors
          "
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <option key={page} value={page}>
              Page {page}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
