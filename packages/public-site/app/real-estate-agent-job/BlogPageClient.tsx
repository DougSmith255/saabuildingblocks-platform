/**
 * Blog Page Client Component
 * Handles client-side filtering and pagination of pre-fetched posts
 *
 * This component receives ALL blog posts from the server component
 * and performs filtering/pagination on the client side for static export compatibility
 * Uses URL hash parameters for static export routing compatibility
 */

'use client';

import { useMemo, useState, useEffect } from 'react';
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
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPostsReady, setIsPostsReady] = useState(false);

  // Fetch blog posts from static JSON file
  useEffect(() => {
    async function loadPosts() {
      try {
        const response = await fetch('/blog-posts.json');
        const posts = await response.json();
        setAllPosts(posts);
        setIsLoading(false);

        // Defer rendering to next tick for smoother loading
        setTimeout(() => {
          setIsPostsReady(true);
        }, 0);
      } catch (error) {
        console.error('Failed to load blog posts:', error);
        setIsLoading(false);
      }
    }

    loadPosts();
  }, []);

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

  // Client-side filtering
  const filteredPosts = useMemo(() => {
    if (selectedCategories.length === 0) {
      return allPosts; // Show all if no filters
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
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  const handleFilterChange = () => {
    // Filter change is handled by URL updates in FilterSection
    // This is just a placeholder for any future needs
  };

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
