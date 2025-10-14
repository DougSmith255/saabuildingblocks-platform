/**
 * FilterBar Component
 * Main filter panel with category chips, sort control, and clear filters
 * Phase 11.2 - Filtering & Sorting Implementation
 *
 * NOTE: No Suspense wrapper here - parent BlogContent provides Suspense boundary
 * Nested Suspense with useSearchParams causes hydration failure in Next.js 15
 */

'use client';

import { CategoryChips } from './CategoryChips';
import { SortControl } from './SortControl';
import { SecondaryButton } from '@/components/saa';
import { useFilters } from '../hooks/useFilters';
import type { CategoryInfo } from '../types/filters';

interface FilterBarProps {
  categories: CategoryInfo[];
}

export function FilterBar({ categories }: FilterBarProps) {
  const {
    categories: selected,
    sort,
    query,
    toggleCategory,
    changeSort,
    clearAll,
    hasActiveFilters,
  } = useFilters();

  return (
    <div className="
      max-w-7xl mx-auto mb-8 p-6
      bg-[#404040]/30 backdrop-blur-sm
      border border-[#808080]/30
      rounded-lg
    ">
      {/* Category Filters */}
      <div className="mb-4">
        <h3 className="
          text-sm font-[var(--font-taskor)] text-[#dcdbd5]
          mb-3 uppercase tracking-wider
        ">
          Filter by Category:
        </h3>
        <CategoryChips
          categories={categories}
          selected={selected}
          onChange={toggleCategory}
        />
      </div>

      {/* Sort & Clear */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SortControl
          value={sort}
          onChange={changeSort}
          showRelevance={!!query} // Only show when search active
        />

        {hasActiveFilters && (
          <SecondaryButton
            href="#"
            onClick={(e) => {
              e.preventDefault();
              clearAll();
            }}
          >
            Clear Filters
          </SecondaryButton>
        )}
      </div>
    </div>
  );
}
