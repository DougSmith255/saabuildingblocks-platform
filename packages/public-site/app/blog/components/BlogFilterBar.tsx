'use client';

import { useState, useEffect, useCallback } from 'react';

export interface FilterState {
  searchQuery: string;
  selectedCategories: string[];
}

export interface BlogFilterBarProps {
  categories: string[];
  onFilterChange: (filters: FilterState) => void;
  resultCount: number;
}

export function BlogFilterBar({
  categories,
  onFilterChange,
  resultCount
}: BlogFilterBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search input for performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Notify parent of filter changes
  useEffect(() => {
    onFilterChange({
      searchQuery: debouncedQuery,
      selectedCategories,
    });
  }, [debouncedQuery, selectedCategories, onFilterChange]);

  const toggleCategory = useCallback((category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategories([]);
  }, []);

  const hasActiveFilters = searchQuery.length > 0 || selectedCategories.length > 0;

  return (
    <div className="sticky top-20 z-40 mb-12 backdrop-blur-lg bg-black/40 border border-white/10 rounded-2xl p-6 shadow-2xl">
      {/* Search Input */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full px-6 py-4 pl-12 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#00ff88] focus:border-transparent focus:bg-white/10"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
              aria-label="Clear search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Category Chips */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Categories
          </h3>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-[#00ff88] hover:text-[#00ff88]/80 transition-colors duration-200 font-medium"
            >
              Clear All
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const isActive = selectedCategories.includes(category);
            return (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105
                  ${
                    isActive
                      ? 'bg-[#ffd700]/20 text-[#ffd700] border-2 border-[#ffd700] shadow-lg shadow-[#ffd700]/20'
                      : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:border-white/20'
                  }
                `}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Result Count */}
      <div className="pt-4 border-t border-white/10">
        <p className="text-sm text-gray-400">
          <span className="font-semibold text-[#00ff88]">{resultCount}</span>{' '}
          {resultCount === 1 ? 'article' : 'articles'} found
        </p>
      </div>
    </div>
  );
}
