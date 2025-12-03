'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { BlogPostHero } from './BlogPostHero';
import { RelatedPosts } from './RelatedPosts';
import { ShareButtons } from '@saa/shared/components/saa/interactive';
import { Breadcrumbs } from './Breadcrumbs';
import type { BlogPost } from '@/lib/wordpress/types';

// Lazy load StarBackgroundAlt - only loaded when user switches to light mode
const StarBackgroundAlt = dynamic(
  () => import('@/components/shared/StarBackgroundAlt'),
  { ssr: false }
);

/**
 * Process HTML content to wrap H2 words in spans for per-word metal plate styling
 * This matches the Master Controller H2 component behavior
 */
function processH2WordWrapping(html: string): string {
  // Match H2 tags and wrap each word in a span
  return html.replace(/<h2([^>]*)>(.*?)<\/h2>/gi, (match, attrs, content) => {
    // Strip any existing HTML tags from the content for clean word splitting
    const plainText = content.replace(/<[^>]*>/g, '');
    // Split into words and wrap each in a span
    const wrappedWords = plainText.split(/\s+/).map((word: string) =>
      `<span class="h2-word">${word}</span>`
    ).join(' ');
    return `<h2${attrs}>${wrappedWords}</h2>`;
  });
}

export interface BlogPostTemplateProps {
  /** The blog post data */
  post: BlogPost;
  /** Related posts to display */
  relatedPosts?: BlogPost[];
}

/**
 * BlogPostTemplate - Complete layout for individual blog posts
 *
 * Features:
 * - BlogPostHero with theme switch, category, meta info
 * - Blog content with futuristic image frames
 * - Share buttons
 * - Related posts section
 * - Theme switching (light/dark mode)
 * - Responsive design following PAGE_BUILDER_GUIDELINES
 *
 * @example
 * ```tsx
 * <BlogPostTemplate
 *   post={blogPost}
 *   relatedPosts={relatedPosts}
 *   baseUrl="https://smartagentalliance.com"
 * />
 * ```
 */
export function BlogPostTemplate({
  post,
  relatedPosts = [],
}: BlogPostTemplateProps) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Format date for display
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Get primary category
  const primaryCategory = post.categories[0] || 'Uncategorized';

  // Handle theme change
  const handleThemeChange = (isDark: boolean) => {
    setIsDarkMode(isDark);
    // Theme change can be applied to body class if needed
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('light-mode', !isDark);
    }
  };

  // Build category slug
  const categorySlug = primaryCategory.toLowerCase().replace(/\s+/g, '-');

  return (
    <article className={`blog-post ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* Light mode alternate star background - only rendered when in light mode */}
      {!isDarkMode && <StarBackgroundAlt />}

      {/* Breadcrumbs */}
      <div className="px-4 sm:px-8 md:px-12 pt-4">
        <div className="max-w-[1900px] mx-auto">
          <Breadcrumbs
            category={primaryCategory}
            categorySlug={categorySlug}
            postTitle={post.title}
          />
        </div>
      </div>

      {/* Hero Section */}
      <BlogPostHero
        title={post.title}
        category={primaryCategory}
        author={post.author.name}
        date={formattedDate}
        content={post.content}
        heroImage={post.featuredImage?.url}
        youtubeVideoUrl={post.youtubeVideoUrl}
        onThemeChange={handleThemeChange}
      />

      {/* Main Content */}
      <section className="relative py-8 md:py-12 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1900px] mx-auto">
          <div className="max-w-[1200px] mx-auto">
            {/* Blog Content - Uses blog-content class from globals.css */}
            {/* H2s are processed to wrap words in spans for per-word metal plates */}
            <div
              className="blog-content prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: processH2WordWrapping(post.content) }}
            />

            {/* Share Buttons - from shared components */}
            <ShareButtons
              url={`https://saabuildingblocks.com/blog/${post.slug}`}
              title={post.title}
              excerpt={post.excerpt}
            />
          </div>
        </div>
      </section>

      {/* Related Posts - No border-t here, divider handled by Share section */}
      {relatedPosts.length > 0 && (
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <RelatedPosts
              posts={relatedPosts}
              currentPostId={post.id}
              currentCategory={primaryCategory}
            />
          </div>
        </section>
      )}
    </article>
  );
}

export default BlogPostTemplate;
