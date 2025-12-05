'use client';

import React, { useState, useEffect } from 'react';
import { BlogPostCard } from './BlogPostCard';
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
 * - Responsive grid: 3 cols on wide (1200px+), 2 cols on medium (750-1200px), 1 col on mobile
 * - Always shows up to limit posts (default 3), grid layout changes responsively
 * - Uses existing BlogPostCard component (protocol-compliant)
 * - Gracefully handles empty state
 *
 * Algorithm:
 * 1. Filter out current post by ID
 * 2. Filter out posts with Divi shortcode remnants (broken content)
 * 3. If category provided, prioritize posts from same category
 * 4. Take up to limit posts (default 3)
 * 5. Render using BlogPostCard in responsive grid
 * 6. Return null if no related posts
 *
 * @example
 * ```tsx
 * <RelatedPosts
 *   posts={allPosts}
 *   currentPostId={post.id}
 *   currentCategory="marketing-mastery"
 *   limit={3}
 * />
 * ```
 */
export function RelatedPosts({
  posts,
  currentPostId,
  currentCategory,
  limit = 3,
}: RelatedPostsProps) {
  // Track number of posts to show based on screen width
  // Wide screens: 3 posts, Medium/Small: 2 posts
  const [postCount, setPostCount] = useState(2); // Default to 2 for SSR

  useEffect(() => {
    const updatePostCount = () => {
      const width = window.innerWidth;
      // 1280px+ matches Tailwind xl: breakpoint for 3 columns
      if (width >= 1280) {
        setPostCount(3);
      } else {
        setPostCount(2);
      }
    };

    // Initial check
    updatePostCount();

    // Listen for resize
    window.addEventListener('resize', updatePostCount);
    return () => window.removeEventListener('resize', updatePostCount);
  }, []);

  // Filter out current post and posts with Divi shortcode remnants
  let relatedPosts = posts.filter(p => {
    // Skip current post
    if (p.id === currentPostId) return false;
    // Skip posts that have Divi shortcode remnants (broken content)
    const content = p.content || '';
    if (content.includes('[et_pb_') || content.includes('et_pb_')) return false;
    return true;
  });

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

  // Apply limit and responsive post count
  relatedPosts = relatedPosts.slice(0, Math.min(limit, postCount));

  // Return null if no related posts (graceful handling)
  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 pt-8 border-t border-[#e5e4dd]/20">
      {/* H2 auto-applies display font (Taskor) - Protocol Section 2.1 */}
      {/* 20px margin below heading */}
      <h2 className="text-h2 text-[#e5e4dd]" style={{ marginBottom: '20px' }}>
        Related Posts
      </h2>

      {/* Grid layout - responsive columns via CSS media queries */}
      {/* 1 col on mobile (<750px), 2 cols on medium (750-1200px), 3 cols on wide (1200px+) */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {relatedPosts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
