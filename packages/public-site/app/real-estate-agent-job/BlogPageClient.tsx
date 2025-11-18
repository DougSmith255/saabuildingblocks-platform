/**
 * Blog Page Client Component
 * Smart chunk loading with category-aware filtering
 *
 * Strategy:
 * - Loads lightweight index (~20KB) first with category mapping
 * - Loads only needed chunks based on current page + selected categories
 * - Caches loaded chunks to prevent re-fetching
 * - Category filters work instantly via index metadata
 *
 * Uses URL hash parameters for static export routing compatibility
 */

'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { BlogCard } from '@/components/blog/BlogCard';
import FilterSection from './FilterSection';
import PaginationControls from './PaginationControls';
import type { BlogPost } from '@/lib/wordpress/types';

type CategoryData = {
  slug: string;
  name: string;
  count: number;
  description: string;
  icon: string;
};

interface BlogPageClientProps {
  categories: CategoryData[];
}

interface BlogIndex {
  posts: Array<{
    id: number;
    categories: string[];
    chunk: number;
  }>;
  categoryMap: Record<string, number[]>; // category slug -> chunk numbers
  totalPosts: number;
  totalChunks: number;
  postsPerChunk: number;
}

/**
 * Parse hash parameters from URL
 */
function getHashParams(): URLSearchParams {
  if (typeof window === 'undefined') return new URLSearchParams();
  const hash = window.location.hash.slice(1); // Remove '#'
  return new URLSearchParams(hash);
}

export default function BlogPageClient({ categories }: BlogPageClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [index, setIndex] = useState<BlogIndex | null>(null);
  const [loadedChunks, setLoadedChunks] = useState<Map<number, BlogPost[]>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [isPostsReady, setIsPostsReady] = useState(false);

  // Load index on mount (lightweight ~20KB)
  useEffect(() => {
    async function loadIndex() {
      try {
        const response = await fetch('/blog-posts-index.json');
        const indexData: BlogIndex = await response.json();
        setIndex(indexData);
        console.log('📋 Index loaded:', indexData.totalPosts, 'posts in', indexData.totalChunks, 'chunks');
      } catch (error) {
        console.error('Failed to load blog posts index:', error);
        setIsLoading(false);
      }
    }

    loadIndex();
  }, []);

  /**
   * Load a specific chunk (cached to prevent re-fetching)
   */
  const loadChunk = useCallback(async (chunkNumber: number): Promise<BlogPost[]> => {
    // Return cached chunk if already loaded
    if (loadedChunks.has(chunkNumber)) {
      return loadedChunks.get(chunkNumber)!;
    }

    try {
      console.log(`📦 Loading chunk ${chunkNumber}...`);
      const response = await fetch(`/blog-posts-chunk-${chunkNumber}.json`);
      const posts: BlogPost[] = await response.json();

      // Cache the chunk
      setLoadedChunks(prev => new Map(prev).set(chunkNumber, posts));

      return posts;
    } catch (error) {
      console.error(`Failed to load chunk ${chunkNumber}:`, error);
      return [];
    }
  }, [loadedChunks]);

  /**
   * Determine which chunks are needed based on filters and current page
   */
  const getNeededChunks = useCallback((): number[] => {
    if (!index) return [];

    // If no categories selected, only need the current page's chunk
    if (selectedCategories.length === 0) {
      return [currentPage];
    }

    // Get all chunks that contain any of the selected categories
    const neededChunks = new Set<number>();
    selectedCategories.forEach(categorySlug => {
      const chunks = index.categoryMap[categorySlug] || [];
      chunks.forEach(chunk => neededChunks.add(chunk));
    });

    return Array.from(neededChunks).sort((a, b) => a - b);
  }, [index, selectedCategories, currentPage]);

  /**
   * Load needed chunks when filters or page changes
   */
  useEffect(() => {
    if (!index) return;

    async function loadNeededPosts() {
      setIsLoading(true);
      setIsPostsReady(false);

      const chunksToLoad = getNeededChunks();

      // Load all needed chunks in parallel
      await Promise.all(chunksToLoad.map(chunk => loadChunk(chunk)));

      setIsLoading(false);

      // Defer rendering for smoother transition
      setTimeout(() => {
        setIsPostsReady(true);
      }, 0);
    }

    loadNeededPosts();
  }, [index, getNeededChunks, loadChunk]);

  // Read hash params on mount and when hash changes
  useEffect(() => {
    const updateFromHash = () => {
      const params = getHashParams();
      const page = Number(params.get('page')) || 1;
      const categoryParam = params.get('category');
      const categories = categoryParam ? categoryParam.split(',').filter(Boolean) : [];

      setCurrentPage(page);
      setSelectedCategories(categories);
    };

    updateFromHash();
    window.addEventListener('hashchange', updateFromHash);
    return () => window.removeEventListener('hashchange', updateFromHash);
  }, []);

  const postsPerPage = 9;

  // Helper function to convert category name to slug format
  const categoryNameToSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  };

  /**
   * Combine all loaded chunks into a single posts array
   */
  const allPosts = useMemo((): BlogPost[] => {
    const posts: BlogPost[] = [];

    // If no categories selected, only use the current page chunk
    if (selectedCategories.length === 0) {
      const currentChunk = loadedChunks.get(currentPage);
      if (currentChunk) {
        return currentChunk;
      }
      return [];
    }

    // With categories selected, combine all loaded chunks in order
    Array.from(loadedChunks.entries())
      .sort((a, b) => a[0] - b[0]) // Sort by chunk number
      .forEach(([, chunkPosts]) => {
        posts.push(...chunkPosts);
      });

    return posts;
  }, [loadedChunks, selectedCategories, currentPage]);

  // Client-side filtering using loaded chunks
  const filteredPosts = useMemo(() => {
    if (selectedCategories.length === 0) {
      return allPosts; // Already filtered to current page chunk in allPosts
    }

    // Filter posts that have ANY of the selected categories
    return allPosts.filter(post => {
      if (!post.categories || post.categories.length === 0) return false;

      // Convert post categories to slug format and check if any match selected categories
      return post.categories.some(postCategory => {
        const postCategorySlug = categoryNameToSlug(postCategory);
        return selectedCategories.includes(postCategorySlug);
      });
    });
  }, [allPosts, selectedCategories]);

  // Client-side pagination
  const totalPages = useMemo(() => {
    // When no categories selected, use total chunks count from index
    if (selectedCategories.length === 0 && index) {
      return index.totalChunks; // Total pages available (23)
    }

    // When categories selected, calculate from filtered posts
    return Math.ceil(filteredPosts.length / postsPerPage);
  }, [selectedCategories, index, filteredPosts.length, postsPerPage]);

  // Determine which posts to display
  const currentPosts = useMemo(() => {
    // When no categories selected, we already have the correct chunk loaded
    // No need for additional slicing - just return all posts from current chunk
    if (selectedCategories.length === 0) {
      return filteredPosts; // Already contains only current page's 9 posts
    }

    // When categories selected, do client-side pagination on filtered results
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    return filteredPosts.slice(startIndex, endIndex);
  }, [selectedCategories, filteredPosts, currentPage, postsPerPage]);

  const handleFilterChange = useCallback((categories: string[]) => {
    // Force immediate state update to prevent stale data while waiting for hashchange
    setSelectedCategories(categories);

    // If switching to "All" (no categories), also reset to page 1
    if (categories.length === 0) {
      setCurrentPage(1);
    }
  }, []);

  return (
    <>
      {/* Filter Section - Always visible */}
      <FilterSection categories={categories} onFilterChange={handleFilterChange} />

      {/* Blog Posts Grid */}
      <section
        className="relative px-4 sm:px-8 md:px-12"
        aria-labelledby="posts-heading"
      >
        <div className="max-w-[2500px] mx-auto">
          <h2 id="posts-heading" className="sr-only">
            Blog Articles
          </h2>

          {/* Show loading skeleton while fetching data or mounting posts */}
          {isLoading || !isPostsReady ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {Array.from({ length: 9 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse bg-[rgba(42,42,42,0.5)] rounded-lg"
                  style={{ height: '400px' }}
                />
              ))}
            </div>
          ) : currentPosts.length === 0 ? (
            /* Empty state when no posts match filters */
            <div className="text-center py-16">
              <p className="text-[#dcdbd5] text-lg">
                {selectedCategories.length > 0
                  ? 'No blog posts found for the selected filters. Try selecting different categories!'
                  : 'No blog posts available. Check back soon!'}
              </p>
            </div>
          ) : (
            <>
              {/* Responsive Grid: 3 cols desktop, 2 tablet, 1 mobile */}
              <div className="
                grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
                gap-6 md:gap-8
              ">
                {currentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="blog-card-hover"
                  >
                    <BlogCard post={post} />
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  category={selectedCategories.join(',') || undefined}
                />
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
