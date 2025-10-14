import { fetchAllPosts } from '@/lib/wordpress/api';
import type { BlogPost } from '@/lib/wordpress/types';
import type { Metadata } from 'next';
import type { CategoryInfo } from './types/filters';
import { CATEGORY_DISPLAY_NAMES } from './types/filters';
import { BlogPostCard, BlogHeader, SearchBar } from './components';
import { BlogContent } from './components/BlogContent';

export const metadata: Metadata = {
  title: 'Blog | SAA Building Blocks',
  description: 'Insights, updates, and industry news from SAA Building Blocks',
};

export default async function BlogListingPage() {
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
          title="Blog"
          description="Insights, updates, and industry news from SAA Building Blocks"
        />

        {/* Search Bar - Phase 11.1 */}
        <SearchBar />

        {/* Blog Content with Suspense - Phase 11.2 */}
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
