'use client';

import { SecondaryButton } from '@saa/shared/components/saa';
import { useRouter, useSearchParams } from 'next/navigation';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

/**
 * Pagination Component
 *
 * Features:
 * - Previous/Next buttons using SecondaryButton from master controller
 * - Gold glow on left/right sides (matches SecondaryButton design)
 * - Disabled states (grayed out when on first/last page)
 * - Page indicator showing "Page X of Y"
 * - URL-based navigation using Next.js router
 *
 * Design System:
 * - Uses SecondaryButton component for consistent styling
 * - Disabled buttons have reduced opacity and no pointer events
 * - Page indicator uses body text color from design system
 *
 * @example
 * <Pagination currentPage={2} totalPages={5} />
 */
export function Pagination({
  currentPage,
  totalPages,
  basePath = '/real-estate-agent-job'
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;

    // Build new URL with page parameter
    const params = new URLSearchParams(searchParams.toString());

    if (newPage === 1) {
      // Remove page param for first page (cleaner URLs)
      params.delete('page');
    } else {
      params.set('page', newPage.toString());
    }

    const queryString = params.toString();
    const newPath = queryString ? `${basePath}?${queryString}` : basePath;

    router.push(newPath);

    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  // Don't render pagination if there's only one page
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-16"
      aria-label="Blog pagination"
    >
      {/* Previous Button */}
      <div className={`px-[10px] ${isFirstPage ? 'opacity-40 pointer-events-none' : ''}`}>
        <SecondaryButton
          as="button"
          onClick={() => handlePageChange(currentPage - 1)}
          className={isFirstPage ? 'cursor-not-allowed' : ''}
        >
          Previous
        </SecondaryButton>
      </div>

      {/* Page Indicator */}
      <div
        className="px-6 py-3 font-[var(--font-amulya)] text-body"
        style={{
          color: 'var(--color-bodyText, #dcdbd5)',
        }}
        aria-live="polite"
        aria-atomic="true"
      >
        Page <span className="font-semibold">{currentPage}</span> of{' '}
        <span className="font-semibold">{totalPages}</span>
      </div>

      {/* Next Button */}
      <div className={`px-[10px] ${isLastPage ? 'opacity-40 pointer-events-none' : ''}`}>
        <SecondaryButton
          as="button"
          onClick={() => handlePageChange(currentPage + 1)}
          className={isLastPage ? 'cursor-not-allowed' : ''}
        >
          Next
        </SecondaryButton>
      </div>
    </nav>
  );
}
