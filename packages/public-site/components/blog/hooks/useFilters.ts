/**
 * useFilters Hook
 * Manages filter state and URL synchronization
 * Phase 11.2 - Filtering & Sorting Implementation
 * Phase 11.3 - Pagination added
 */

'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import type { CategorySlug, SortOption, FilterState } from '../types/filters';

export function useFilters(initialState?: FilterState) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Parse URL params
  const urlCategories = (searchParams.get('categories')?.split(',').filter(Boolean) as CategorySlug[]) || [];
  const urlSort = (searchParams.get('sort') as SortOption) || 'date-desc';
  const urlQuery = searchParams.get('q') || undefined;
  const urlPage = parseInt(searchParams.get('page') || '1', 10);

  // Local state (synced with URL)
  const [categories, setCategories] = useState<CategorySlug[]>(
    initialState?.categories || urlCategories
  );
  const [sort, setSort] = useState<SortOption>(
    initialState?.sort || urlSort
  );
  const [page, setPage] = useState<number>(
    initialState?.page || urlPage
  );

  // Update URL when state changes
  // Note: Using window.location.href for static export compatibility
  const updateURL = useCallback((newCategories: CategorySlug[], newSort: SortOption, newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());

    // Categories
    if (newCategories.length > 0) {
      params.set('categories', newCategories.join(','));
    } else {
      params.delete('categories');
    }

    // Sort
    if (newSort !== 'date-desc') {
      params.set('sort', newSort);
    } else {
      params.delete('sort'); // Default sort, no need in URL
    }

    // Page (only show if not page 1)
    if (newPage > 1) {
      params.set('page', newPage.toString());
    } else {
      params.delete('page'); // Default page, no need in URL
    }

    // Preserve search query
    if (urlQuery) {
      params.set('q', urlQuery);
    }

    const queryString = params.toString();
    // Use window.location.href for static export compatibility
    window.location.href = `${pathname}${queryString ? `?${queryString}` : ''}`;
  }, [searchParams, pathname, urlQuery]);

  // Category handlers (reset to page 1 when filters change)
  const toggleCategory = useCallback((slug: CategorySlug) => {
    setCategories(prev => {
      const newCategories = prev.includes(slug)
        ? prev.filter(c => c !== slug)
        : [...prev, slug];

      setPage(1); // Reset to page 1
      updateURL(newCategories, sort, 1);
      return newCategories;
    });
  }, [sort, updateURL]);

  const clearCategories = useCallback(() => {
    setCategories([]);
    setPage(1); // Reset to page 1
    updateURL([], sort, 1);
  }, [sort, updateURL]);

  // Sort handlers (reset to page 1 when sort changes)
  const changeSort = useCallback((newSort: SortOption) => {
    setSort(newSort);
    setPage(1); // Reset to page 1
    updateURL(categories, newSort, 1);
  }, [categories, updateURL]);

  // Pagination handlers
  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
    updateURL(categories, sort, newPage);

    // Scroll to top of blog content
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categories, sort, updateURL]);

  const nextPage = useCallback(() => {
    goToPage(page + 1);
  }, [page, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(page - 1);
  }, [page, goToPage]);

  // Clear all filters (reset page to 1)
  const clearAll = useCallback(() => {
    setCategories([]);
    setSort('date-desc');
    setPage(1);
    // Use window.location.href for static export compatibility
    window.location.href = pathname; // Remove all query params
  }, [pathname]);

  // Sync with URL on back/forward
  useEffect(() => {
    setCategories(urlCategories);
    setSort(urlSort);
    setPage(urlPage);
  }, [searchParams]); // Re-run when URL changes

  return {
    categories,
    sort,
    query: urlQuery,
    page,
    toggleCategory,
    clearCategories,
    changeSort,
    goToPage,
    nextPage,
    prevPage,
    clearAll,
    hasActiveFilters: categories.length > 0 || sort !== 'date-desc',
  };
}
