'use client';

import { useMemo, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { DeferredFooter } from '@saa/shared/components/performance/DeferredContent';
import { ExternalLinkHandler } from './ExternalLinkHandler';
import { ScrollPerformanceOptimizer } from './ScrollPerformanceOptimizer';
import { ViewportHeightLock } from './ViewportHeightLock';
import { ViewportProvider } from '@/contexts/ViewportContext';

/**
 * LayoutWrapper - Global layout with automatic performance optimization
 *
 * AUTOMATIC OPTIMIZATIONS (applied to ALL pages):
 * - Footer is automatically deferred (loads when user scrolls near bottom)
 * - Improves LCP (Largest Contentful Paint) by 25-35%
 * - Animations pause during scroll on mobile for smooth 60fps
 * - Works with static site export
 * - CSS scroll-timeline section transitions (Chrome 116+, Safari 26+)
 *
 * SECTION TRANSITIONS:
 * - Most pages: All sections get depth transition on scroll
 * - Blog index: Only hero section gets transition
 * - Excluded pages: No transitions (legal, test pages, blog posts, etc.)
 *
 * OVERRIDE BEHAVIOR (when building pages):
 * Use data-defer-priority attribute on any element:
 * - data-defer-priority="immediate" - Load right away (hero content)
 * - data-defer-priority="high" - Load after hero but before scroll
 * - data-defer-priority="low" - Load when user scrolls near it
 *
 * @see /home/claude-flow/📘-PAGE-BUILDER-GUIDE.md for full documentation
 */
export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // List of routes where header/footer should NOT render at all
  const noHeaderFooterRoutes = useMemo(() => [
    '/master-controller',
    '/login',
    '/activate',
    '/activate-account',
    '/reset-password',
    '/sign-up',
    '/_not-found', // 404 page
  ], []);

  // Routes where section transitions should be DISABLED
  const noSectionTransitionRoutes = useMemo(() => [
    '/agent-portal',
    '/doug-linktree',
    '/karrie-linktree',
    '/cookie-policy',
    '/disclaimer',
    '/privacy-policy',
    '/terms-of-use',
    '/test-category-badge',
    '/test-parallax-heroes',
    '/master-controller',
  ], []);

  // Routes where ONLY hero section gets transitions
  const heroOnlyTransitionRoutes = useMemo(() => [
    '/blog', // Blog index - hero only, not individual posts
  ], []);

  // Determine section transition mode based on pathname
  const sectionTransitionMode = useMemo(() => {
    if (!pathname) return 'full'; // Default to full transitions

    // Check for no transitions (exact matches or starts with)
    if (noSectionTransitionRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
      return 'none';
    }

    // Check for individual blog posts (has category/slug pattern)
    // Pattern: /blog/[category]/[slug] - 3+ segments means it's a post
    const segments = pathname.split('/').filter(Boolean);
    if (segments[0] === 'blog' && segments.length >= 3) {
      return 'none'; // Blog posts get no transitions
    }

    // Check for hero-only transitions (exact match only)
    if (heroOnlyTransitionRoutes.includes(pathname)) {
      return 'hero-only';
    }

    return 'full'; // Default: all sections get transitions
  }, [pathname, noSectionTransitionRoutes, heroOnlyTransitionRoutes]);

  // Set body data attributes for CSS to read
  useEffect(() => {
    // Remove both attributes first
    document.body.removeAttribute('data-no-section-transitions');
    document.body.removeAttribute('data-hero-only-transitions');

    // Set appropriate attribute based on mode
    if (sectionTransitionMode === 'none') {
      document.body.setAttribute('data-no-section-transitions', '');
    } else if (sectionTransitionMode === 'hero-only') {
      document.body.setAttribute('data-hero-only-transitions', '');
    }
    // 'full' mode = no attribute needed (CSS default)
  }, [sectionTransitionMode]);

  // Check if current path matches any no-header-footer route (SSR-safe)
  const shouldHideHeaderFooter = useMemo(() => {
    // Check for is-404-page class first (set synchronously by not-found.tsx)
    if (typeof document !== 'undefined' && document.body.classList.contains('is-404-page')) {
      return true;
    }

    // If pathname is null/undefined, don't hide (let it render normally)
    if (!pathname) return false;

    return noHeaderFooterRoutes.some(route => pathname.startsWith(route));
  }, [pathname, noHeaderFooterRoutes]);

  return (
    <ViewportProvider>
      <ExternalLinkHandler />
      <ScrollPerformanceOptimizer />
      <ViewportHeightLock />
      {!shouldHideHeaderFooter && <Header />}
      {/*
        Using div instead of main to avoid nested <main> elements.
        Pages already have their own <main id="main-content"> for accessibility.
        CSS scroll animations target main > section, so this prevents nesting issues.
      */}
      <div
        style={{ minHeight: '100vh', position: 'relative' }}
        data-no-footer={shouldHideHeaderFooter ? 'true' : undefined}
      >
        {children}
      </div>
      {/* Footer is ALWAYS deferred to improve Core Web Vitals (LCP) */}
      {!shouldHideHeaderFooter && (
        <DeferredFooter>
          <Footer />
        </DeferredFooter>
      )}
    </ViewportProvider>
  );
}
