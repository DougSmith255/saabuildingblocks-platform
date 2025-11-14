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
 * Update hash in URL without triggering page reload or scroll
 */
function setHashParams(params: URLSearchParams) {
  const hashString = params.toString();

  // Save current scroll position
  const scrollY = window.scrollY;

  // Update hash (this may cause scroll)
  if (hashString) {
    window.location.hash = `#${hashString}`;
  } else {
    // Use replaceState to clear hash without scrolling
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }

  // Restore scroll position
  window.scrollTo(0, scrollY);
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

    // Scroll to the blog posts section (not filter, not top of page)
    // Account for fixed header height + 15px spacing
    setTimeout(() => {
      const postsHeading = document.getElementById('posts-heading');
      if (postsHeading) {
        const headerHeight = 90; // Fixed header height
        const spacing = 15; // Additional spacing from header
        const elementPosition = postsHeading.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerHeight - spacing;

        // Flag to track if user interrupts the scroll
        let scrollCancelled = false;

        // Cancel smooth scroll if user tries to scroll manually
        const cancelScroll = () => {
          scrollCancelled = true;
        };

        // Listen for user scroll attempts (wheel, touch, or keyboard)
        window.addEventListener('wheel', cancelScroll, { once: true, passive: true });
        window.addEventListener('touchstart', cancelScroll, { once: true, passive: true });
        window.addEventListener('keydown', cancelScroll, { once: true, passive: true });

        // Perform the scroll
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Clean up listeners after scroll animation completes (~500ms for smooth scroll)
        setTimeout(() => {
          window.removeEventListener('wheel', cancelScroll);
          window.removeEventListener('touchstart', cancelScroll);
          window.removeEventListener('keydown', cancelScroll);
        }, 600);
      }
    }, 100);
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
