/**
 * PaginationControls Component
 * Previous/Next buttons and page indicator for blog pagination
 * Phase 11.3 - Pagination Implementation
 */

'use client';

import { SecondaryButton } from '@saa/shared/components/saa';
import type { PaginationState } from './types/filters';

interface PaginationControlsProps {
  pagination: PaginationState;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export function PaginationControls({
  pagination,
  onPrevPage,
  onNextPage,
}: PaginationControlsProps) {
  const {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage,
    hasPrevPage,
  } = pagination;

  // Calculate showing range
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Don't render if only 1 page
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="
      flex flex-col sm:flex-row
      items-center justify-between gap-6
      max-w-7xl mx-auto mt-12 px-4
      pb-8
    ">
      {/* Previous Button */}
      <div className="w-full sm:w-auto">
        {hasPrevPage ? (
          <SecondaryButton
            as="button"
            onClick={(e) => {
              e.preventDefault();
              onPrevPage();
            }}
            className="w-full sm:w-auto"
          >
            ← Previous
          </SecondaryButton>
        ) : (
          <div className="
            px-6 py-3
            text-[#808080]/50
            font-[var(--font-taskor)]
            text-center sm:text-left
          ">
            ← Previous
          </div>
        )}
      </div>

      {/* Page Indicator */}
      <div className="text-center">
        <div className="
          text-[#e5e4dd]
          font-[var(--font-taskor)]
          text-base
          mb-1
        ">
          Page {currentPage} of {totalPages}
        </div>
        <div className="
          text-[#dcdbd5]
          font-[var(--font-amulya)]
          text-sm
        ">
          Showing {startItem}-{endItem} of {totalItems} articles
        </div>
      </div>

      {/* Next Button */}
      <div className="w-full sm:w-auto">
        {hasNextPage ? (
          <SecondaryButton
            as="button"
            onClick={(e) => {
              e.preventDefault();
              onNextPage();
            }}
            className="w-full sm:w-auto"
          >
            Next →
          </SecondaryButton>
        ) : (
          <div className="
            px-6 py-3
            text-[#808080]/50
            font-[var(--font-taskor)]
            text-center sm:text-right
          ">
            Next →
          </div>
        )}
      </div>
    </div>
  );
}
