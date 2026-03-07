'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { BlogPostHero } from '../BlogPostHero';
import { AuthorSection } from '../AuthorSection';
import { RelatedPosts } from '../RelatedPosts';
import { ShareButtons, FAQ } from '@saa/shared/components/saa/interactive';
import { CyberFrame, YouTubeFacade } from '@saa/shared/components/saa/media';
import { SchoolCardsSection } from '../SchoolCardsSection';
import H2 from '@saa/shared/components/saa/headings/H2';
import { getTemplateConfig, type CategoryTemplateConfig } from './templateConfig';
import { LazySection } from '@/components/shared/LazySection';
import { BlogSidebar } from '../BlogSidebar';
import type { BlogPost } from '@/lib/wordpress/types';
import { getPostUrl } from '@/lib/blog-post-urls';
import { createDivBackLayers, BLOG_H2_DARK, BLOG_H2_LIGHT } from '@saa/shared/components/saa/headings/useStrokeBackLayers';

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

  // Note: FAQ accordion is now handled by the shared FAQ React component,
  // not by DOM manipulation of rank-math classes.

  return <div ref={containerRef} dangerouslySetInnerHTML={{ __html: html }} />;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface CategoryBlogPostTemplateProps {
  /** The blog post data */
  post: BlogPost;
  /** Category for template customization (optional, defaults to post.categories[0]) */
  category?: string;
  /** Pre-filtered related posts for internal linking (passed from server component) */
  relatedPosts?: BlogPost[];
  /** Extracted FAQ items to render with the shared FAQ accordion */
  faqs?: FAQItem[];
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
  faqs,
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

  // Apply CSS div backing to blog content H2 elements after render.
  // Uses div layers (like H2.tsx) instead of SVG text - reflows naturally on resize.
  useEffect(() => {
    const applyH2Backing = () => {
      // Deduplicate TOC blocks (WordPress sometimes outputs multiples) - keep only the first
      const tocBlocks = document.querySelectorAll<HTMLElement>('.blog-content .wp-block-rank-math-toc-block, .blog-content #rank-math-toc');
      const seen = new Set<HTMLElement>();
      tocBlocks.forEach((toc) => {
        if (seen.size > 0 && !seen.has(toc)) { toc.remove(); return; }
        seen.add(toc);
      });

      // Inject h2 into Rank Math TOC blocks that lack one (some posts have it, some don't)
      document.querySelectorAll<HTMLElement>('.blog-content .wp-block-rank-math-toc-block, .blog-content #rank-math-toc').forEach((toc) => {
        if (!toc.querySelector(':scope > h2')) {
          const h2 = document.createElement('h2');
          h2.textContent = 'Table of Contents';
          toc.insertBefore(h2, toc.firstChild);
        }
      });

      const config = isDarkMode ? BLOG_H2_DARK : BLOG_H2_LIGHT;
      const h2s = document.querySelectorAll<HTMLElement>('.blog-content h2');
      h2s.forEach((h2) => {
        // Ensure text-h2 class for responsive font-size (same as site-wide H2)
        h2.classList.add('text-h2');
        const existingWrapper = h2.closest('.heading-wrapper');
        if (existingWrapper) {
          // Already wrapped - remove old backing and re-apply with current config
          existingWrapper.querySelectorAll('[data-h2-backing], svg[aria-hidden]').forEach((el) => el.remove());
          createDivBackLayers(existingWrapper as HTMLDivElement, h2, config);
          return;
        }
        const wrapper = document.createElement('div');
        wrapper.classList.add('heading-wrapper');
        const computed = getComputedStyle(h2);
        wrapper.style.cssText = 'position:relative;display:inline-block;width:100%;overflow:visible;text-align:inherit;'
          + `margin-top:${computed.marginTop};margin-bottom:${computed.marginBottom};`;
        h2.parentNode?.insertBefore(wrapper, h2);
        wrapper.appendChild(h2);
        h2.classList.add('heading-front', 'text-h2');
        h2.style.marginTop = '0';
        h2.style.marginBottom = '0';
        createDivBackLayers(wrapper, h2, config);
      });
    };
    document.fonts.ready.then(applyH2Backing);
    // No resize handler needed - CSS div layers reflow naturally
  }, [post.content, isDarkMode]);

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

  // Extract YouTube video ID if present
  const hasVideo = post.youtubeVideoUrl && extractYouTubeVideoId(post.youtubeVideoUrl);

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
          featuredImage={!hasVideo ? post.featuredImage?.url : undefined}
          featuredImageMaxHeight={templateConfig.heroImageMaxHeight}
          onThemeChange={handleThemeChange}
        />
      </div>

      {/* Main Content */}
      <section className="relative py-8 md:py-12 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1900px] mx-auto">
          <div className="max-w-[1400px] mx-auto relative">
            <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-10 relative">
              {/* Feathered backdrop at grid level so sidebar aligns with it (dark mode only) */}
              {isDarkMode && (
                <div className="absolute pointer-events-none blog-content-backdrop" style={{
                  inset: '-2rem',
                  zIndex: -1,
                  background: 'rgba(8, 8, 12, 0.55)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  borderRadius: '32px',
                }} />
              )}
              {/* Main content column */}
              <div className="relative min-w-0">
                {/* School Cards - inline in content column for real-estate-schools */}
                {categorySlug === 'real-estate-schools' && (
                  <div className="mb-8">
                    <SchoolCardsSection postSlug={post.slug} />
                  </div>
                )}

                {/* License Requirements at a Glance - inline for become-an-agent */}
                {post.licenseImage && categorySlug === 'become-an-agent' && (
                  <div className="mb-8 text-center" id="requirements-at-a-glance">
                    <H2>Requirements at a Glance</H2>
                    <CyberFrame className="w-full">
                      <Image
                        src={post.licenseImage.url}
                        alt={post.licenseImage.alt || post.licenseImage.title || 'License requirements summary'}
                        width={800}
                        height={670}
                        sizes="(max-width: 1024px) 90vw, 900px"
                        className="object-contain w-full h-auto"
                        priority={true}
                      />
                    </CyberFrame>
                  </div>
                )}

                {/* Inline YouTube video */}
                {hasVideo && (
                  <div className="mb-8">
                    <CyberFrame isVideo aspectRatio="16/9" className="w-full">
                      <YouTubeFacade videoId={hasVideo} title={`Video: ${post.title}`} />
                    </CyberFrame>
                  </div>
                )}
                <div className="blog-content max-w-none">
                  {/* Comparison Chart - inline for brokerage-comparison */}
                  {post.comparisonImages && post.comparisonImages.length > 0 && categorySlug === 'brokerage-comparison' && (
                    <div className="mb-8 mx-auto" style={{ maxWidth: 900 }} id="at-a-glance-comparison">
                      <h2 id="at-a-glance-comparison-heading" style={{ textAlign: 'center' }}>At-a-Glance Comparison</h2>
                      <CyberFrame className="!block w-full">
                        <Image
                          src={post.comparisonImages[0].url}
                          alt={post.comparisonImages[0].alt || post.comparisonImages[0].title || 'Brokerage comparison chart'}
                          width={900}
                          height={1013}
                          sizes="(max-width: 900px) 100vw, 900px"
                          className="object-contain w-full h-auto"
                          priority={true}
                        />
                      </CyberFrame>
                    </div>
                  )}
                  <div data-speakable="summary">
                    <BlogContentRenderer html={post.content} />
                  </div>
                </div>

                {/* FAQ Accordion */}
                {faqs && faqs.length > 0 && (
                  <div className="mt-12">
                    <div id="frequently-asked-questions">
                      <H2>Frequently Asked Questions</H2>
                    </div>
                    <FAQ items={faqs} />
                  </div>
                )}

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
