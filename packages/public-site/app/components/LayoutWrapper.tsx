'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Header from '@/components/shared/Header';
import { DeferredFooter } from '@saa/shared/components/performance/DeferredContent';

// Dynamic import Footer - JS only loads when user scrolls near bottom
const Footer = dynamic(() => import('@/components/shared/Footer'), { ssr: false });

// Dynamic import SmoothScroll (Lenis) - deferred to reduce initial JS bundle
const SmoothScroll = dynamic(() => import('@/components/SmoothScroll'), { ssr: false });

// Dynamic import ScrollProgress - moved here to conditionally hide in embed mode
const ScrollProgress = dynamic(() => import('@/components/shared/ScrollProgress'), { ssr: false });

// Dynamic import ScrollIndicator - global scroll arrow indicator for all pages
const ScrollIndicator = dynamic(
  () => import('@saa/shared/components/saa/interactive/ScrollIndicator').then(mod => mod.ScrollIndicator),
  { ssr: false }
);

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
 *
 * OVERRIDE BEHAVIOR (when building pages):
 * Use data-defer-priority attribute on any element:
 * - data-defer-priority="immediate" - Load right away (hero content)
 * - data-defer-priority="high" - Load after hero but before scroll
 * - data-defer-priority="low" - Load when user scrolls near it
 *
 * @see /home/claude-flow/📘-PAGE-BUILDER-GUIDE.md for full documentation
 */
// Check for 404 page BEFORE component mounts (synchronous, no flash)
// This runs once at module load time on the client
const getInitialIs404 = (): boolean => {
  if (typeof document === 'undefined') return false;
  return document.querySelector('main[data-is-404="true"]') !== null;
};

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Use a ref to check 404 status synchronously before first render
  // This prevents the header from ever being added to the DOM on 404 pages
  const is404PageRef = useRef(getInitialIs404());

  // List of routes where header/footer should NOT render at all
  const noHeaderFooterRoutes = useMemo(() => [
    '/master-controller',
    '/login',
    '/activate',
    '/activate-account',
    '/reset-password',
    '/sign-up',
  ], []);

  // Routes where header/footer should be hidden, but NOT sub-routes
  const exactNoHeaderFooterRoutes = useMemo(() => [
    '/agent-portal', // Main portal - no header/footer
  ], []);

  // Routes where only footer should be hidden (header stays)
  const noFooterRoutes = useMemo(() => [
    '/agent-portal/login', // Login page - header yes, footer no
  ], []);

  // Routes where scroll indicator should be hidden (auth flows, utility pages)
  // These are pages with a header but no meaningful content to scroll to
  // Format: prefix-based routes (matches /route and /route/*)
  const noScrollIndicatorPrefixes = useMemo(() => [
    '/agent-portal/login',      // Login page - single viewport, no scroll content
    '/agent-portal/activate',   // Account activation - single viewport form
    '/agent-portal/forgot',     // Forgot password/username (future routes)
    '/agent-portal/reset',      // Password reset (future routes)
  ], []);

  // Check for embed mode via URL search params
  const [isEmbedMode, setIsEmbedMode] = useState(false);

  useEffect(() => {
    // Check URL for embed=true parameter (client-side only)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setIsEmbedMode(params.get('embed') === 'true');
    }
  }, [pathname]);

  // Check if current path matches any no-header-footer route (SSR-safe)
  const shouldHideHeaderFooter = useMemo(() => {
    // Embed mode hides everything
    if (isEmbedMode) return true;

    // 404 pages detected via data attribute (checked synchronously before render)
    if (is404PageRef.current) return true;

    // If pathname is null/undefined, don't hide (let it render normally)
    if (!pathname) return false;

    // Check prefix-based routes (e.g., /master-controller/*)
    if (noHeaderFooterRoutes.some(route => pathname.startsWith(route))) {
      return true;
    }

    // Check exact match routes (e.g., /agent-portal but NOT /agent-portal/login)
    if (exactNoHeaderFooterRoutes.includes(pathname) || exactNoHeaderFooterRoutes.includes(pathname.replace(/\/$/, ''))) {
      return true;
    }

    return false;
  }, [pathname, noHeaderFooterRoutes, exactNoHeaderFooterRoutes, isEmbedMode]);

  // Check if footer should be hidden (but header stays)
  const shouldHideFooterOnly = useMemo(() => {
    if (!pathname) return false;
    return noFooterRoutes.includes(pathname) || noFooterRoutes.includes(pathname.replace(/\/$/, ''));
  }, [pathname, noFooterRoutes]);

  // Check if scroll indicator should be hidden (auth pages, utility pages)
  // Uses prefix matching to catch sub-routes and trailing slashes
  const shouldHideScrollIndicator = useMemo(() => {
    if (!pathname) return false;
    const normalizedPath = pathname.replace(/\/$/, '');
    // Check if path starts with any of the no-scroll-indicator prefixes
    return noScrollIndicatorPrefixes.some(prefix =>
      normalizedPath === prefix || normalizedPath.startsWith(prefix + '/')
    );
  }, [pathname, noScrollIndicatorPrefixes]);

  // Embed mode: minimal wrapper, just the content
  if (isEmbedMode) {
    return <>{children}</>;
  }

  return (
    <ViewportProvider>
      <SmoothScroll />
      <ScrollProgress />
      {!shouldHideHeaderFooter && !shouldHideScrollIndicator && <ScrollIndicator />}
      <ExternalLinkHandler />
      <ScrollPerformanceOptimizer />
      <ViewportHeightLock />
      {!shouldHideHeaderFooter && <Header />}
      {/*
        Using div instead of main to avoid nested <main> elements.
        Pages already have their own <main id="main-content"> for accessibility.
      */}
      <div
        style={{ minHeight: '100vh', position: 'relative' }}
        data-no-footer={shouldHideHeaderFooter || shouldHideFooterOnly ? 'true' : undefined}
      >
        {children}
      </div>
      {/* Footer is ALWAYS deferred to improve Core Web Vitals (LCP) */}
      {!shouldHideHeaderFooter && !shouldHideFooterOnly && (
        <DeferredFooter>
          <Footer />
        </DeferredFooter>
      )}
    </ViewportProvider>
  );
}
