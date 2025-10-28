'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearch } from './hooks/useSearch';

/**
 * SearchBar Component
 * Blog search with autocomplete, keyboard navigation, and accessibility
 *
 * Features:
 * - Debounced search (300ms)
 * - Instant results dropdown
 * - Keyboard navigation (↑↓ Enter Escape)
 * - WCAG 2.1 Level AA compliant
 * - Loading/empty/error states
 *
 * Typography:
 * - Input: font-[var(--font-taskor)] (UI element)
 * - Result titles: Auto-apply from h3 (display font)
 * - Result metadata: font-[var(--font-amulya)] (body text)
 *
 * Colors:
 * - Input border: #808080 (lightGray)
 * - Input focus: #00ff88 (accentGreen)
 * - Text: #e5e4dd (headingText)
 * - Placeholder: #dcdbd5 with opacity
 * - Hover: #00ff88 (accentGreen)
 */
export function SearchBar() {
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const {
    query,
    setQuery,
    results,
    isLoading,
    total,
    clearSearch,
  } = useSearch({ minQueryLength: 2, debounceMs: 300 });

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target as Node) &&
        resultsRef.current &&
        !resultsRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) {
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => Math.min(prev + 1, Math.min(results.length, 5) - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        if (focusedIndex >= 0 && results[focusedIndex]) {
          window.location.href = `/blog/${results[focusedIndex].slug}`;
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Open dropdown when results are available
  useEffect(() => {
    if (query.length >= 2 && (results.length > 0 || !isLoading)) {
      setIsOpen(true);
      setFocusedIndex(-1);
    }
  }, [results, query, isLoading]);

  // Display up to 5 results in dropdown
  const displayResults = results.slice(0, 5);
  const hasMoreResults = results.length > 5;

  return (
    <div className="relative max-w-2xl mx-auto mb-12">
      {/* Search Form */}
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          // Form submission handled by Enter key on focused result
        }}
        className="relative"
      >
        {/* Search Input */}
        <div className="relative">
          <input
            ref={inputRef}
            type="search"
            role="searchbox"
            aria-label="Search blog posts"
            aria-controls="search-results"
            aria-expanded={isOpen}
            aria-activedescendant={focusedIndex >= 0 ? `result-${focusedIndex}` : undefined}
            aria-describedby="search-instructions"
            placeholder="Search blog posts..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setFocusedIndex(-1);
            }}
            onFocus={() => query.length >= 2 && setIsOpen(true)}
            onKeyDown={handleKeyDown}
            className="
              w-full px-4 py-3 pl-12 pr-12
              bg-[#404040] text-[#e5e4dd]
              font-[var(--font-taskor)] text-lg
              rounded-lg
              border-2 border-[#808080]
              focus:border-[#00ff88] focus:outline-none
              placeholder:text-[#dcdbd5] placeholder:opacity-60
              transition-colors duration-200
            "
          />

          {/* Search Icon */}
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#808080]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          {/* Loading Spinner or Clear Button */}
          {isLoading ? (
            <div className="absolute right-4 top-1/2 -translate-y-1/2" aria-label="Searching">
              <div className="w-5 h-5 border-2 border-[#00ff88] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : query.length > 0 ? (
            <button
              onClick={() => {
                clearSearch();
                setIsOpen(false);
                inputRef.current?.focus();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#808080] hover:text-[#e5e4dd] transition-colors"
              aria-label="Clear search"
              type="button"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : null}
        </div>

        {/* Hidden instructions for screen readers */}
        <div id="search-instructions" className="sr-only">
          Use arrow keys to navigate results, Enter to select, Escape to close
        </div>
      </form>

      {/* Search Results Dropdown */}
      {isOpen && query.length >= 2 && (
        <div
          ref={resultsRef}
          id="search-results"
          role="listbox"
          aria-label="Search results"
          className="
            absolute top-full mt-2 w-full
            bg-[#404040]/95 backdrop-blur-sm
            border-2 border-[#808080]
            rounded-lg shadow-2xl
            max-h-[500px] overflow-y-auto
            z-50
          "
        >
          {/* Loading State */}
          {isLoading && (
            <div className="px-4 py-8 text-center">
              <div className="inline-block w-6 h-6 border-2 border-[#00ff88] border-t-transparent rounded-full animate-spin mb-2" />
              <p className="text-[#dcdbd5] font-[var(--font-amulya)] text-sm">
                Searching...
              </p>
            </div>
          )}

          {/* Results */}
          {!isLoading && displayResults.length > 0 && (
            <>
              {displayResults.map((post, index) => (
                <Link
                  key={post.id}
                  id={`result-${index}`}
                  href={`/blog/${post.slug}`}
                  role="option"
                  aria-selected={focusedIndex === index}
                  className={`
                    block px-4 py-4 border-b border-[#808080]/30 last:border-b-0
                    transition-colors duration-150
                    ${focusedIndex === index ? 'bg-[#00ff88]/10 border-[#00ff88]' : 'hover:bg-[#808080]/20'}
                  `}
                  onMouseEnter={() => setFocusedIndex(index)}
                >
                  <div className="flex gap-4">
                    {/* Featured Image */}
                    {post.featuredImage && (
                      <div className="flex-shrink-0 w-16 h-16 relative rounded overflow-hidden">
                        <Image
                          src={post.featuredImage.url}
                          alt={post.featuredImage.alt || post.title}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                    )}

                    {/* Post Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[#e5e4dd] font-bold text-base mb-1 truncate">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-[#dcdbd5]/70 font-[var(--font-amulya)]">
                        {post.categories[0] && (
                          <>
                            <span className="text-[#ffd700]">{post.categories[0]}</span>
                            <span>•</span>
                          </>
                        )}
                        <time dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </time>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}

              {/* View All Results Link */}
              {hasMoreResults && (
                <div className="px-4 py-3 text-center border-t border-[#808080]">
                  <span className="text-[#00ff88] text-sm font-[var(--font-taskor)]">
                    View all {total} results →
                  </span>
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!isLoading && query.length >= 2 && results.length === 0 && (
            <div className="px-4 py-8 text-center">
              <svg
                className="w-12 h-12 mx-auto mb-3 text-[#808080]"
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
              <p className="text-[#e5e4dd] font-[var(--font-taskor)] text-base mb-1">
                No results found for &quot;{query}&quot;
              </p>
              <p className="text-[#dcdbd5] font-[var(--font-amulya)] text-sm">
                Try different keywords or browse our categories
              </p>
            </div>
          )}
        </div>
      )}

      {/* Screen Reader Status */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {isLoading && "Searching..."}
        {!isLoading && results.length > 0 && `Found ${total} results for "${query}"`}
        {!isLoading && query.length >= 2 && results.length === 0 && `No results found for "${query}"`}
      </div>
    </div>
  );
}
