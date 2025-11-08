/**
 * Real Estate Agent Resources Blog Page
 * Main blog landing page with magazine-style layout
 *
 * Features:
 * - Full-width layout with spacious horizontal padding
 * - Hero section with H1 and Tagline from Master Controller
 * - Glassmorphism search bar
 * - Large featured post card
 * - Filter/category bar with animated chips
 * - Responsive grid layout (3 cols desktop, 2 tablet, 1 mobile)
 * - Card hover effects with neon green borders
 * - Gold category accents
 * - Staggered fade-in animations on scroll
 * - Real WordPress data integration
 * - Client-side filtering and pagination
 *
 * Layout:
 * - Uses full viewport width (no max-width constraints)
 * - Responsive horizontal padding: 24px → 48px → 64px → 80px
 * - Individual blog posts will have constrained width (not this listing page)
 *
 * Design System:
 * - Background: #0a0a0a (inherits star background from layout)
 * - Heading: #e5e4dd (hover: #00ff88 neon green)
 * - Body text: #dcdbd5
 * - Accent: #ffd700 (gold for categories)
 * - Neon: #00ff88 (for interactive elements)
 */

import { H1, Tagline } from '@saa/shared/components/saa';
import { fetchAllPosts, fetchCategories } from '@/lib/wordpress';
import { FilterBar } from '@/components/blog/FilterBar';
import { FilterablePostList } from '@/components/blog/FilterablePostList';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import type { CategoryInfo } from '@/components/blog/types/filters';

/**
 * Page Metadata for SEO
 */
export const metadata: Metadata = {
  title: 'Real Estate Agent Resources | Smart Agent Alliance',
  description: 'Expert insights, career guidance, and industry trends for real estate professionals. Learn about licensing, marketing strategies, brokerage comparisons, and more.',
  keywords: [
    'real estate agent resources',
    'real estate career advice',
    'real estate licensing',
    'real estate marketing',
    'eXp Realty',
    'brokerage comparison',
    'real estate agent blog',
    'real estate industry trends',
  ],
  openGraph: {
    title: 'Real Estate Agent Resources | Smart Agent Alliance',
    description: 'Expert insights, career guidance, and industry trends for real estate professionals.',
    type: 'website',
  },
};

/**
 * Fetch WordPress data at build time
 * This runs on the server and fetches real posts from WordPress
 */
async function getPageData() {
  try {
    // Fetch posts and categories in parallel
    const [posts, wpCategories] = await Promise.all([
      fetchAllPosts(),
      fetchCategories(),
    ]);

    // Transform categories to match CategoryInfo type
    const categories: CategoryInfo[] = wpCategories.map((cat: { slug: string; name: string; count: number }) => ({
      slug: cat.slug as any, // Type assertion needed for CategorySlug union
      name: cat.name,
      count: cat.count,
    }));

    return { posts, categories };
  } catch (error) {
    console.error('Error fetching WordPress data:', error);
    // Return empty data on error - components will handle empty states
    return { posts: [], categories: [] };
  }
}

/**
 * Blog Page Component
 * Server Component - Fetches real WordPress data
 * Delegates filtering and interactivity to client components
 */
export default async function RealEstateAgentBlogPage() {
  // Fetch WordPress data at build time
  const { posts, categories } = await getPageData();

  return (
    <main id="main-content" className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative px-6 sm:px-12 md:px-16 lg:px-20 pt-32 pb-16"
        aria-labelledby="blog-heading"
      >
        <div className="w-full text-center">
          {/* H1: Using Master Controller H1 component */}
          <div className="mb-6 hero-animate-h1">
            <H1 id="blog-heading">
              Agent Success Hub
            </H1>
          </div>

          {/* Tagline: Using Master Controller Tagline component */}
          <div className="mb-12 hero-animate-tagline">
            <Tagline>
              Expert Insights, Career Guidance, and Industry Trends
            </Tagline>
          </div>

          {/* Search Bar with Glassmorphism - Client Component */}
          <div className="hero-animate-cta">
            <SearchBarClient />
          </div>
        </div>
      </section>

      {/* Filter/Category Bar with Glassmorphism */}
      <section className="relative px-6 sm:px-12 md:px-16 lg:px-20 pb-8">
        <Suspense fallback={<FilterBarSkeleton />}>
          <FilterBar categories={categories} />
        </Suspense>
      </section>

      {/* Blog Posts List with Filtering and Pagination */}
      <section
        className="relative px-6 sm:px-12 md:px-16 lg:px-20 pb-24"
        aria-labelledby="posts-heading"
      >
        <div className="w-full">
          <h2 id="posts-heading" className="sr-only">
            Recent Articles
          </h2>

          <Suspense fallback={<PostsLoadingSkeleton />}>
            <FilterablePostList posts={posts} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}

/**
 * Search Bar Client Component
 * Glassmorphism search with real-time filtering
 * Separated for client-side interactivity
 */
function SearchBarClient() {
  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="
        relative
        glass-effect
        border border-[#808080]/30
        rounded-lg
        search-bar-focus
      ">
        <input
          type="search"
          placeholder="Search articles..."
          aria-label="Search blog posts"
          className="
            w-full px-6 py-4 pl-14
            bg-transparent
            text-[#e5e4dd] placeholder:text-[#dcdbd5]/60
            font-[var(--font-taskor)] text-lg
            focus:outline-none
            rounded-lg
          "
        />

        {/* Search Icon */}
        <svg
          className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#808080]"
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
      </div>
    </div>
  );
}

/**
 * Loading Skeletons for Suspense boundaries
 */
function FilterBarSkeleton() {
  return (
    <div className="
      w-full mb-8 p-6
      bg-[#404040]/30 backdrop-blur-sm
      border border-[#808080]/30
      rounded-lg
      animate-pulse
    ">
      <div className="h-4 w-32 bg-[#808080]/30 rounded mb-4" />
      <div className="flex flex-wrap gap-2 mb-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-10 w-24 bg-[#808080]/30 rounded-full" />
        ))}
      </div>
      <div className="h-10 w-40 bg-[#808080]/30 rounded" />
    </div>
  );
}

function PostsLoadingSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
        <div
          key={i}
          className="
            border border-[#e5e4dd]/20 rounded-lg overflow-hidden
            bg-[#191818]/50 animate-pulse
          "
        >
          <div className="w-full h-64 bg-[#808080]/30" />
          <div className="p-6">
            <div className="h-4 w-20 bg-[#808080]/30 rounded-full mb-4" />
            <div className="h-6 bg-[#808080]/30 rounded mb-3" />
            <div className="h-4 bg-[#808080]/30 rounded mb-2" />
            <div className="h-4 bg-[#808080]/30 rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
