import { fetchAllPosts } from '@/lib/wordpress/api';
import type { BlogPost } from '@/lib/wordpress/types';
import type { Metadata } from 'next';
import type { CategoryInfo } from '@/components/blog/types/filters';
import { CATEGORY_DISPLAY_NAMES } from '@/components/blog/types/filters';
import { BlogPostCard, BlogHeader, SearchBar } from '@/components/blog';
import { BlogContent } from '@/components/blog/BlogContent';

export const metadata: Metadata = {
  title: 'Real Estate Agent Resources | SAA Building Blocks',
  description: 'Comprehensive resources, guides, and insights for real estate agents',
};

/**
 * Blog Homepage at /real-estate-agent-job/
 * Static generation (no ISR)
 */
export default async function RealEstateAgentBlogPage() {
  // Fetch posts at build time (server-side)
  let posts: BlogPost[] = [];
  let error: string | null = null;

  try {
    posts = await fetchAllPosts();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load blog posts';
    console.error('Error fetching blog posts:', err);
  }

  // Build category info with post counts
  const categoryInfo: CategoryInfo[] = Object.entries(CATEGORY_DISPLAY_NAMES).map(([slug, name]) => ({
    slug: slug as any,
    name,
    count: posts.filter(post => post.categories.includes(slug)).length,
  }));

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  // Main render
  return (
    <div className="min-h-screen bg-black text-[#dcdbd5]">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* BlogHeader component - Protocol compliant */}
        <BlogHeader
          title="Real Estate Agent Resources"
          description="Comprehensive resources, guides, and insights for real estate agents"
        />

        {/* Search Bar */}
        <SearchBar />

        {/* Blog Content with Suspense */}
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#dcdbd5] text-lg font-[var(--font-amulya)]">
              No blog posts found.
            </p>
          </div>
        ) : (
          <BlogContent posts={posts} categories={categoryInfo} />
        )}
      </div>
    </div>
  );
}
