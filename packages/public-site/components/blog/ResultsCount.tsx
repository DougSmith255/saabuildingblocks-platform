/**
 * ResultsCount Component
 * Displays the number of filtered posts with active filters
 * Phase 11.2 - Filtering & Sorting Implementation
 */

'use client';

import type { CategorySlug } from './types/filters';
import { CATEGORY_DISPLAY_NAMES } from './types/filters';

interface ResultsCountProps {
  total: number;
  filtered: number;
  categories: CategorySlug[];
  query?: string;
}

export function ResultsCount({ total, filtered, categories, query }: ResultsCountProps) {
  // Build results message
  const getMessage = () => {
    if (query && categories.length > 0) {
      const categoryNames = categories.map(slug => CATEGORY_DISPLAY_NAMES[slug]).join(', ');
      return `Found ${filtered} ${filtered === 1 ? 'post' : 'posts'} for "${query}" in ${categoryNames}`;
    }

    if (query) {
      return `Found ${filtered} ${filtered === 1 ? 'post' : 'posts'} for "${query}"`;
    }

    if (categories.length > 0) {
      const categoryNames = categories.map(slug => CATEGORY_DISPLAY_NAMES[slug]).join(', ');
      return `Showing ${filtered} ${filtered === 1 ? 'post' : 'posts'} in ${categoryNames}`;
    }

    return `Showing ${filtered} ${filtered === 1 ? 'post' : 'posts'}`;
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="mb-6 text-[#dcdbd5] font-[var(--font-amulya)] text-sm md:text-base"
    >
      {getMessage()}
    </div>
  );
}
