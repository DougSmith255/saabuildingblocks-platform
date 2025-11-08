/**
 * FilterablePostList Component
 * Wraps post list with client-side filtering and sorting
 * Phase 11.2 - Filtering & Sorting Implementation
 * Phase 11.3 - Pagination added
 */

'use client';

import { useMemo } from 'react';
import { useFilters } from './hooks/useFilters';
import { ResultsCount } from './ResultsCount';
import { BlogPostCard } from './BlogPostCard';
import { PaginationControls } from './PaginationControls';
import { POSTS_PER_PAGE } from './types/filters';
import type { BlogPost } from '@/lib/wordpress/types';
import type { PaginationState } from './types/filters';

interface FilterablePostListProps {
  posts: BlogPost[];
}

export function FilterablePostList({ posts }: FilterablePostListProps) {
  const { categories, sort, query, page, nextPage, prevPage } = useFilters();

  // Filter posts by selected categories
  const filteredPosts = useMemo(() => {
    if (categories.length === 0) return posts; // Show all

    return posts.filter(post =>
      post.categories.some(cat => categories.includes(cat as any))
    );
  }, [posts, categories]);

  // Sort filtered posts
  const sortedPosts = useMemo(() => {
    const sorted = [...filteredPosts];

    switch (sort) {
      case 'date-desc':
        return sorted.sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      case 'date-asc':
        return sorted.sort((a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      case 'title-asc':
        return sorted.sort((a, b) =>
          a.title.localeCompare(b.title)
        );
      case 'title-desc':
        return sorted.sort((a, b) =>
          b.title.localeCompare(a.title)
        );
      case 'relevance':
        // Relevance sorting handled by WordPress API
        // Just return as-is (already sorted by relevance from search)
        return sorted;
      default:
        return sorted;
    }
  }, [filteredPosts, sort]);

  // Calculate pagination
  const pagination: PaginationState = useMemo(() => {
    const totalItems = sortedPosts.length;
    const totalPages = Math.ceil(totalItems / POSTS_PER_PAGE);
    const currentPage = Math.min(page, totalPages || 1); // Clamp to valid page

    return {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage: POSTS_PER_PAGE,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    };
  }, [sortedPosts.length, page]);

  // Paginate sorted posts
  const paginatedPosts = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    return sortedPosts.slice(startIndex, endIndex);
  }, [sortedPosts, pagination.currentPage]);

  return (
    <>
      {/* Results count */}
      <ResultsCount
        total={posts.length}
        filtered={sortedPosts.length}
        categories={categories}
        query={query}
      />

      {/* Post grid */}
      {sortedPosts.length === 0 ? (
        <EmptyState categories={categories} />
      ) : (
        <>
          {/* Featured Post (First Post on Page 1) */}
          {paginatedPosts.length > 0 && pagination.currentPage === 1 && (
            <div className="mb-12">
              <BlogPostCard post={paginatedPosts[0]} featured />
            </div>
          )}

          {/* Regular Posts Grid - with equal height cards using grid-auto-rows */}
          {paginatedPosts.length > 0 && (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
              {(pagination.currentPage === 1 ? paginatedPosts.slice(1) : paginatedPosts).map(post => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          <PaginationControls
            pagination={pagination}
            onPrevPage={prevPage}
            onNextPage={nextPage}
          />
        </>
      )}
    </>
  );
}

// Empty state when no results
function EmptyState({ categories }: { categories: string[] }) {
  return (
    <div className="text-center py-16">
      <svg className="w-16 h-16 mx-auto mb-4 text-[#808080]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <h3 className="text-[#e5e4dd] font-bold text-xl mb-2">
        No posts found
      </h3>
      <p className="text-[#dcdbd5] font-[var(--font-amulya)] mb-6">
        {categories.length > 0
          ? "Try selecting different categories or clearing filters"
          : "No posts available in this category"
        }
      </p>
    </div>
  );
}
