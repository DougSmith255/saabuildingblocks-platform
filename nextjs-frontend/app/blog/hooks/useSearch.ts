'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import type { BlogPost } from '@/lib/wordpress/types';
import type { SearchOptions } from '../types/search';

/**
 * useSearch Hook
 * Manages search state and API calls with debouncing
 *
 * @param options - Search configuration options
 * @returns Search state and control functions
 *
 * @example
 * const { query, setQuery, results, isLoading, error } = useSearch({
 *   minQueryLength: 2,
 *   debounceMs: 300,
 * });
 */
export function useSearch(options: SearchOptions = {}) {
  const {
    minQueryLength = 2,
    debounceMs = 300,
    category,
    perPage = 20,
  } = options;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const debouncedQuery = useDebounce(query, debounceMs);

  useEffect(() => {
    const performSearch = async () => {
      // Don't search if query is too short
      if (debouncedQuery.length < minQueryLength) {
        setResults([]);
        setTotal(0);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Build query params
        const params = new URLSearchParams({
          q: debouncedQuery,
          per_page: perPage.toString(),
        });

        if (category) {
          params.append('category', category);
        }

        // Call search API
        const response = await fetch(`/api/search?${params}`);

        if (!response.ok) {
          throw new Error('Search failed');
        }

        const data = await response.json();

        setResults(data.results);
        setTotal(data.total);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Search failed';
        setError(errorMessage);
        setResults([]);
        setTotal(0);
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery, category, minQueryLength, perPage]);

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setTotal(0);
    setError(null);
  };

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    total,
    clearSearch,
  };
}
