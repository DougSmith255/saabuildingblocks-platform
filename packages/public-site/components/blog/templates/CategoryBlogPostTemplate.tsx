'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { BlogPostHero } from '../BlogPostHero';
import { AuthorSection } from '../AuthorSection';
import { RelatedPosts } from '../RelatedPosts';
import { ShareButtons } from '@saa/shared/components/saa/interactive';
import { CyberFrame, YouTubeFacade } from '@saa/shared/components/saa/media';
import { SchoolCardsSection } from '../SchoolCardsSection';
import { getTemplateConfig, type CategoryTemplateConfig } from './templateConfig';
import { LazySection } from '@/components/shared/LazySection';
import { BlogSidebar } from '../BlogSidebar';
import type { BlogPost } from '@/lib/wordpress/types';
import { getPostUrl } from '@/lib/blog-post-urls';

// Lazy load CloudBackground - only loaded when user switches to light mode
const CloudBackground = dynamic(
  () => import('@/components/shared/CloudBackground'),
  { ssr: false }
);

/**
 * Extract YouTube video ID from various URL formats
 */
function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

/**
 * BlogContentRenderer - Renders blog content
 * School CTA buttons are styled via CSS to look like SecondaryButton
 * Also handles RankMath FAQ accordion toggle functionality
 */
function BlogContentRenderer({ html }: { html: string }) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Lazy fade-in for blog content images using IntersectionObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const imgs = container.querySelectorAll('img');

    // Mark all images for lazy fade-in
    imgs.forEach((img) => {
      img.classList.add('blog-img-lazy');
      // If image is already cached/loaded, fade in immediately
      if (img.complete && img.naturalHeight > 0) {
        img.classList.add('blog-img-loaded');
      }
    });

    // Fade in when image loads AND is near viewport
    const nearViewport = new Set<Element>();
    const loaded = new Set<Element>();

    const reveal = (img: Element) => {
      if (nearViewport.has(img) && loaded.has(img)) {
        img.classList.add('blog-img-loaded');
      }
    };

    const handleLoad = (e: Event) => {
      const img = e.target as Element;
      loaded.add(img);
      reveal(img);
    };

    imgs.forEach((img) => {
      if (img.complete && img.naturalHeight > 0) {
        loaded.add(img);
      } else {
        img.addEventListener('load', handleLoad, { once: true });
      }
    });

    // Observe images — trigger when within 300px of viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            nearViewport.add(entry.target);
            reveal(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '300px 0px' }
    );

    imgs.forEach((img) => observer.observe(img));

    return () => {
      observer.disconnect();
      imgs.forEach((img) => img.removeEventListener('load', handleLoad));
    };
  }, [html]);

  // Add FAQ accordion toggle functionality
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const faqQuestions = container.querySelectorAll('.rank-math-question');

    const handleClick = (e: Event) => {
      const question = e.currentTarget as HTMLElement;
      const faqItem = question.closest('.rank-math-faq-item');
      if (faqItem) {
        const isCurrentlyOpen = faqItem.classList.contains('is-open');
        // Close all other FAQ items first
        container.querySelectorAll('.rank-math-faq-item.is-open').forEach((item) => {
          item.classList.remove('is-open');
        });
        // Toggle current item (open if it was closed)
        if (!isCurrentlyOpen) {
          faqItem.classList.add('is-open');
        }
      }
    };

    faqQuestions.forEach((question) => {
      question.addEventListener('click', handleClick);
    });

    // Cleanup
    return () => {
      faqQuestions.forEach((question) => {
        question.removeEventListener('click', handleClick);
      });
    };
  }, [html]);

  return <div ref={containerRef} dangerouslySetInnerHTML={{ __html: html }} />;
}

export interface CategoryBlogPostTemplateProps {
  /** The blog post data */
  post: BlogPost;
  /** Category for template customization (optional, defaults to post.categories[0]) */
  category?: string;
  /** Pre-filtered related posts for internal linking (passed from server component) */
  relatedPosts?: BlogPost[];
}

/**
 * CategoryBlogPostTemplate - Category-aware blog post template
 *
 * Extends BlogPostTemplate with category-specific customizations:
 * - Custom accent colors
 * - Custom related posts limits
 * - Category CSS classes for styling hooks
 *
 * Each category can be further customized by editing the config in templateConfig.ts
 */
export function CategoryBlogPostTemplate({
  post,
  category,
  relatedPosts,
}: CategoryBlogPostTemplateProps) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'to-light' | 'to-dark' | null>(null);

  // Get category from prop or post
  const primaryCategory = category || post.categories[0] || 'Uncategorized';

  // Get template config for this category
  const templateConfig = getTemplateConfig(primaryCategory);

  // Reset to dark mode when navigating away
  useEffect(() => {
    return () => {
      if (typeof document !== 'undefined') {
        document.body.classList.remove('light-mode');
      }
    };
  }, []);

  // Format date for display
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Handle theme change with blur transition
  const handleThemeChange = useCallback((isDark: boolean) => {
    setTransitionDirection(isDark ? 'to-dark' : 'to-light');
    setIsTransitioning(true);

    setTimeout(() => {
      setIsDarkMode(isDark);
      if (typeof document !== 'undefined') {
        document.body.classList.toggle('light-mode', !isDark);
      }

      setTimeout(() => {
        setIsTransitioning(false);
        setTransitionDirection(null);
      }, 300);
    }, 150);
  }, []);

  // Build category slug
  const categorySlug = primaryCategory.toLowerCase().replace(/\s+/g, '-');

  // Check if video should be emphasized
  const hasVideo = post.youtubeVideoUrl && extractYouTubeVideoId(post.youtubeVideoUrl);
  const showVideoSection = hasVideo && (templateConfig.emphasizeVideo || true);

  return (
    <article
      className={`blog-post ${isDarkMode ? 'dark-mode' : 'light-mode'} ${templateConfig.customClassName || ''}`}
      style={{
        '--category-accent': templateConfig.accentColor,
        '--category-accent-secondary': templateConfig.accentColorSecondary,
      } as React.CSSProperties}
    >
      {/* Theme transition blur overlay */}
      <div
        className={`theme-transition-overlay ${isTransitioning ? 'active' : ''} ${transitionDirection || ''}`}
        aria-hidden="true"
      />

      {/* Hero Section with Cloud Background - no wrapper, renders immediately */}
      <div className="relative">
        {!isDarkMode && <CloudBackground />}

        <BlogPostHero
          title={post.title}
          category={primaryCategory}
          categorySlug={categorySlug}
          postTitle={post.title}
          author={post.author.name}
          date={formattedDate}
          content={post.content}
          youtubeVideoUrl={post.youtubeVideoUrl}
          featuredImage={categorySlug === 'real-estate-schools' ? post.featuredImage?.url : undefined}
          featuredImageMaxHeight={templateConfig.heroImageMaxHeight}
          onThemeChange={handleThemeChange}
        />
      </div>

      {/* School Cards Section - Only for Real Estate Schools category */}
      {categorySlug === 'real-estate-schools' && (
        <LazySection height={400}>
          <section className="relative py-8 md:py-12 px-4 sm:px-8 md:px-12">
            <div className="max-w-[1900px] mx-auto">
              <SchoolCardsSection postSlug={post.slug} />
            </div>
          </section>
        </LazySection>
      )}

      {/* License Requirements at a Glance - Always visible for become-an-agent posts */}
      {post.licenseImage && categorySlug === 'become-an-agent' && (
        <section className="relative py-6 md:py-8 px-4 sm:px-8 md:px-12">
          <div className="max-w-[900px] mx-auto">
            <h2
              className="text-lg font-semibold tracking-wide text-center mb-6"
              style={{
                fontFamily: 'var(--font-taskor, sans-serif)',
                color: '#ffd700',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Requirements at a Glance
            </h2>
            <div className="flex justify-center">
              <CyberFrame>
                <Image
                  src={post.licenseImage.url}
                  alt={post.licenseImage.alt || post.licenseImage.title || 'License requirements summary'}
                  width={800}
                  height={670}
                  sizes="(max-width: 900px) 90vw, 800px"
                  className="object-contain w-full h-auto"
                  priority={true}
                />
              </CyberFrame>
            </div>
          </div>
        </section>
      )}

      {/* Comparison Chart - Always visible for brokerage comparison posts */}
      {post.comparisonImages && post.comparisonImages.length > 0 && categorySlug === 'brokerage-comparison' && (
        <section className="relative py-6 md:py-8 px-4 sm:px-8 md:px-12">
          <div className="max-w-[900px] mx-auto">
            <h2
              className="text-lg font-semibold tracking-wide text-center mb-6"
              style={{
                fontFamily: 'var(--font-taskor, sans-serif)',
                color: '#ffd700',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              At-a-Glance Comparison
            </h2>
            <div className="flex justify-center">
              <CyberFrame>
                <Image
                  src={post.comparisonImages[0].url}
                  alt={post.comparisonImages[0].alt || post.comparisonImages[0].title || 'Brokerage comparison chart'}
                  width={800}
                  height={900}
                  sizes="(max-width: 900px) 90vw, 800px"
                  className="object-contain w-full h-auto"
                  priority={true}
                />
              </CyberFrame>
            </div>
          </div>
        </section>
      )}

      {/* YouTube Video Embed */}
      {showVideoSection && hasVideo && (
        <LazySection height={400}>
          <section className="relative py-8 md:py-12 px-4 sm:px-8 md:px-12">
            <div className="max-w-[1900px] mx-auto">
              <div className="max-w-[1200px] mx-auto">
                <CyberFrame isVideo aspectRatio="16/9" className="w-full">
                  <YouTubeFacade
                    videoId={hasVideo}
                    title={`Video: ${post.title}`}
                  />
                </CyberFrame>
              </div>
            </div>
          </section>
        </LazySection>
      )}

      {/* Main Content */}
      <LazySection height={600}>
        <section className="relative py-8 md:py-12 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="max-w-[1400px] mx-auto relative">
              <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-10 lg:items-start">
                {/* Main content column */}
                <div className="relative min-w-0">
                  {/* Feathered backdrop to improve text readability over star background (dark mode only) */}
                  {isDarkMode && (
                    <div className="absolute pointer-events-none" style={{
                      inset: '-2rem',
                      zIndex: -1,
                      background: 'rgba(8, 8, 12, 0.55)',
                      maskImage: 'radial-gradient(ellipse 100% 100% at 50% 50%, black 60%, transparent 100%)',
                      WebkitMaskImage: 'radial-gradient(ellipse 100% 100% at 50% 50%, black 60%, transparent 100%)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      borderRadius: '32px',
                    }} />
                  )}
                  <div className="blog-content max-w-none">
                    {/* Featured Image - only shown in hero for real-estate-schools category */}
                    {/* For other categories, show featured image floated right in content */}
                    {post.featuredImage?.url && categorySlug !== 'real-estate-schools' && (
                      <div className="float-right ml-6 mb-4" style={{ maxHeight: '270px' }}>
                        <CyberFrame>
                          <div className="relative" style={{ maxHeight: '270px' }}>
                            <Image
                              src={post.featuredImage.url}
                              alt={post.featuredImage.alt || post.title}
                              width={480}
                              height={270}
                              sizes="(max-width: 768px) 100vw, 480px"
                              className="object-contain"
                              style={{ maxHeight: '270px', width: 'auto', height: 'auto' }}
                            />
                          </div>
                        </CyberFrame>
                      </div>
                    )}
                    <div data-speakable="summary">
                      <BlogContentRenderer html={post.content} />
                    </div>
                  </div>

                  {/* Share Buttons */}
                  <ShareButtons
                    url={typeof window !== 'undefined' ? `${window.location.origin}${getPostUrl(post)}` : getPostUrl(post)}
                    title={post.title}
                    excerpt={post.excerpt}
                  />
                </div>

                {/* Sidebar column */}
                <BlogSidebar categorySlug={categorySlug} isDarkMode={isDarkMode} />
              </div>
            </div>
          </div>
        </section>
      </LazySection>

      {/* Author Section - shows author bio based on WordPress author name */}
      <LazySection height={300}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="max-w-[1200px] mx-auto">
              <AuthorSection authorName={post.author.name} />
            </div>
          </div>
        </section>
      </LazySection>

      {/* Related Posts - internal linking for SEO */}
      {relatedPosts && relatedPosts.length > 0 && (
        <LazySection height={400}>
          <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
            <div className="max-w-[1900px] mx-auto">
              <div className="max-w-[1200px] mx-auto">
                <RelatedPosts
                  posts={relatedPosts}
                  currentPostId={post.id}
                  currentCategory={post.categories[0]}
                  limit={3}
                />
              </div>
            </div>
          </section>
        </LazySection>
      )}
    </article>
  );
}

export default CategoryBlogPostTemplate;
