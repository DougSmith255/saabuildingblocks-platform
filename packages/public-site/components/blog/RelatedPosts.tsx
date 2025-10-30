'use client';

import React from 'react';
import { BlogPostCard } from './BlogPostCard';
import { CTAButton } from '@saa/shared/components/saa';
import type { BlogPost } from '@/lib/wordpress/types';

export interface RelatedPostsProps {
  posts: BlogPost[];
  currentPostId: number;
  currentCategory?: string;
  limit?: number;
}

/**
 * RelatedPosts - Shows related blog posts from same category
 *
 * PROTOCOL COMPLIANCE:
 * ✅ H2 auto-applies display font (Taskor) - NO className needed
 * ✅ Uses existing BlogPostCard (SAA component compliant)
 * ✅ Uses CyberCardHolographic via BlogPostCard
 * ✅ Brand colors ONLY
 * ✅ Fluid typography (clamp)
 *
 * Features:
 * - Prioritizes posts from same category
 * - Filters out current post from display
 * - Shows 4 posts in 2x2 grid on desktop
 * - Link to category page ("View All in [Category]")
 * - Uses existing BlogPostCard component (protocol-compliant)
 * - Responsive grid layout (1 col mobile, 2x2 on desktop)
 * - Gracefully handles empty state
 *
 * Algorithm:
 * 1. Filter out current post by ID
 * 2. If category provided, prioritize posts from same category
 * 3. Take first 4 posts (limit)
 * 4. Render using BlogPostCard
 * 5. Add link to category page if category exists
 * 6. Return null if no related posts
 *
 * @example
 * ```tsx
 * <RelatedPosts
 *   posts={allPosts}
 *   currentPostId={post.id}
 *   currentCategory="marketing-mastery"
 *   limit={4}
 * />
 * ```
 */
export function RelatedPosts({
  posts,
  currentPostId,
  currentCategory,
  limit = 4,
}: RelatedPostsProps) {
  // Filter out current post
  let relatedPosts = posts.filter(p => p.id !== currentPostId);

  // If category provided, prioritize posts from same category
  if (currentCategory) {
    const sameCategoryPosts = relatedPosts.filter(p =>
      p.categories.includes(currentCategory)
    );
    const otherPosts = relatedPosts.filter(p =>
      !p.categories.includes(currentCategory)
    );
    relatedPosts = [...sameCategoryPosts, ...otherPosts];
  }

  // Limit results
  relatedPosts = relatedPosts.slice(0, limit);

  // Return null if no related posts (graceful handling)
  if (relatedPosts.length === 0) {
    return null;
  }

  // Format category name for display
  const categoryName = currentCategory
    ? currentCategory
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : null;

  return (
    <section className="mt-16 pt-8 border-t border-[#e5e4dd]/20">
      {/* H2 auto-applies display font (Taskor) - Protocol Section 2.1 */}
      <h2 className="text-h2 mb-2 text-[#e5e4dd]">
        Related Posts
      </h2>

      {/* Category link if available */}
      {currentCategory && categoryName && (
        <div className="mb-8">
          <CTAButton href={`/blog/category/${currentCategory}`}>
            View All in {categoryName}
          </CTAButton>
        </div>
      )}

      {/* Grid layout - responsive (1 col mobile, 2x2 desktop) */}
      <div className="grid gap-6 md:grid-cols-2">
        {relatedPosts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
