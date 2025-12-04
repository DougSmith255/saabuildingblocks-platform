'use client';

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { BlogPostHero } from './BlogPostHero';
import { RelatedPosts } from './RelatedPosts';
import { ShareButtons } from '@saa/shared/components/saa/interactive';
import { CyberFrame } from '@saa/shared/components/saa/media';
import { Breadcrumbs } from './Breadcrumbs';
import type { BlogPost } from '@/lib/wordpress/types';

// Lazy load CloudBackground - only loaded when user switches to light mode
// Displays daylight sky scene with animated clouds
const CloudBackground = dynamic(
  () => import('@/components/shared/CloudBackground'),
  { ssr: false }
);

// Lazy load YouTube embed with intersection observer to prevent layout shift
const LazyYouTubeEmbed = dynamic(
  () => Promise.resolve(({ videoId, title }: { videoId: string; title: string }) => {
    const [isLoaded, setIsLoaded] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsLoaded(true);
            observer.disconnect();
          }
        },
        { rootMargin: '100px' }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => observer.disconnect();
    }, []);

    return (
      <div ref={containerRef}>
        <CyberFrame isVideo aspectRatio="16/9" className="w-full">
          {isLoaded ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center">
              <div className="text-white/50 text-sm">Loading video...</div>
            </div>
          )}
        </CyberFrame>
      </div>
    );
  }),
  { ssr: false }
);

/**
 * Extract YouTube video ID from various URL formats
 * Supports: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
 */
function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

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
  const [isTransitioning, setIsTransitioning] = useState(false);
  // Track which direction we're transitioning: 'to-light' or 'to-dark'
  const [transitionDirection, setTransitionDirection] = useState<'to-light' | 'to-dark' | null>(null);

  // Format date for display
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Get primary category
  const primaryCategory = post.categories[0] || 'Uncategorized';

  // Handle theme change with blur transition
  const handleThemeChange = useCallback((isDark: boolean) => {
    // Set transition direction based on target mode
    // If switching TO dark mode, use light blur; TO light mode, use dark blur
    setTransitionDirection(isDark ? 'to-dark' : 'to-light');
    // Start blur transition
    setIsTransitioning(true);

    // After blur is applied, change the theme
    setTimeout(() => {
      setIsDarkMode(isDark);
      if (typeof document !== 'undefined') {
        document.body.classList.toggle('light-mode', !isDark);
      }

      // Remove blur after theme has changed
      setTimeout(() => {
        setIsTransitioning(false);
        setTransitionDirection(null);
      }, 300); // Time for colors to settle
    }, 150); // Time for blur to fully apply
  }, []);

  // Build category slug
  const categorySlug = primaryCategory.toLowerCase().replace(/\s+/g, '-');

  return (
    <article className={`blog-post ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* Theme transition blur overlay */}
      <div
        className={`theme-transition-overlay ${isTransitioning ? 'active' : ''} ${transitionDirection || ''}`}
        aria-hidden="true"
      />

      {/* Hero Section with Cloud Background - extends to top of page */}
      <div className="relative">
        {/* Light mode cloud background - covers entire hero including breadcrumbs area */}
        {!isDarkMode && <CloudBackground />}

        {/* Breadcrumbs - positioned below fixed header */}
        <div className="relative z-10 px-4 sm:px-8 md:px-12 pt-[calc(var(--header-height)+1.625rem)]">
          <div className="max-w-[1900px] mx-auto">
            <Breadcrumbs
              category={primaryCategory}
              categorySlug={categorySlug}
              postTitle={post.title}
            />
          </div>
        </div>

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
      </div>

      {/* YouTube Video Embed - Only shown if ACF field has a URL */}
      {post.youtubeVideoUrl && extractYouTubeVideoId(post.youtubeVideoUrl) && (
        <section className="relative py-8 md:py-12 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="max-w-[1200px] mx-auto">
              <LazyYouTubeEmbed
                videoId={extractYouTubeVideoId(post.youtubeVideoUrl)!}
                title={`Video: ${post.title}`}
              />
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="relative py-8 md:py-12 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1900px] mx-auto">
          <div className="max-w-[1200px] mx-auto">
            {/* Featured Image at top of content */}
            {post.featuredImage?.url && (
              <figure className="blog-featured-image mb-8 md:mb-12">
                <CyberFrame className="w-full">
                  <div className="relative w-full aspect-[16/9]">
                    <Image
                      src={post.featuredImage.url}
                      alt={post.featuredImage.alt || post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                      className="object-cover"
                      priority
                    />
                  </div>
                </CyberFrame>
                {post.featuredImage.alt && (
                  <figcaption className="mt-3 text-sm text-center text-[var(--text-color-body)] opacity-70">
                    {post.featuredImage.alt}
                  </figcaption>
                )}
              </figure>
            )}

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
