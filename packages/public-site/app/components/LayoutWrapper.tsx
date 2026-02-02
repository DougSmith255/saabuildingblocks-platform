'use client';

import { useMemo, useRef, useState, useEffect, useCallback } from 'react';
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

// Dynamic import FloatingVideoButton - "The Inside Look" video pill (bottom-right)
const FloatingVideoButton = dynamic(
  () => import('@/components/shared/FloatingVideoButton'),
  { ssr: false }
);

// Dynamic import VIPGuestPassPopup - one-time VIP Guest Pass lead capture
const VIPGuestPassPopup = dynamic(
  () => import('@/components/shared/VIPGuestPassPopup'),
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
  const exactNoHeaderFooterRoutes = useMemo((): string[] => [
    '/agent-portal', // Agent portal has its own header with SAA logo
  ], []);

  // Routes where only footer should be hidden (header stays)
  const noFooterRoutes = useMemo(() => [
    '/agent-portal',       // Main portal - has its own mobile nav
    '/agent-portal/login', // Login page - header yes, footer no
  ], []);

  // Routes where scroll indicator should be hidden (auth flows, utility pages)
  // These are pages with a header but no meaningful content to scroll to
  // Format: prefix-based routes (matches /route and /route/*)
  const noScrollIndicatorPrefixes = useMemo(() => [
    '/agent-portal',            // All agent portal pages - has its own navigation
    '/download',                // Download page - single viewport
  ], []);

  // Routes where scroll progress bar should be hidden
  // The yellow scroll progress bar should only show on main website, not in app/portal
  const noScrollProgressPrefixes = useMemo(() => [
    '/agent-portal',            // Agent portal - app interface
    '/download',                // Download page
    '/master-controller',       // Admin interface
  ], []);

  // Routes where Lenis smooth scroll should be disabled
  // These pages have fixed layouts with their own scroll containers
  const noSmoothScrollPrefixes = useMemo(() => [
    '/master-controller',       // Admin interface
    '/agent-portal',            // Agent portal has nested scroll containers
  ], []);

  // Routes where the floating "Inside Look" video button should NOT appear
  const noFloatingButtonPrefixes = useMemo(() => [
    '/blog/',                   // Blog posts - no floating button
    '/master-controller',       // Admin interface
    '/login',                   // Auth pages
    '/agent-portal',            // Agent portal
    '/activate',                // Account activation
    '/sign-up',                 // Sign up
    '/download',                // Download page
  ], []);

  // Check for embed mode via URL search params
  const [isEmbedMode, setIsEmbedMode] = useState(false);
  // TEMP: Debug state for testing VIP Guest Pass popup — remove when done
  const [forceVipOpen, setForceVipOpen] = useState(false);

  useEffect(() => {
    // Check URL for embed=true parameter (client-side only)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setIsEmbedMode(params.get('embed') === 'true');
    }
  }, [pathname]);

  // Progressive scroll-based preloading: cache panel background assets
  // so they appear instantly when panels open (no fade/flash)
  useEffect(() => {
    let preloaded = false;
    const preload = () => {
      if (preloaded) return;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      if (docH <= 0 || window.scrollY / docH < 0.1) return;
      preloaded = true;
      window.removeEventListener('scroll', preload);
      // Preload Inside Look video poster into browser cache
      const img = new Image();
      img.src = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/exp-realty-smart-agent-alliance-explained/desktop';
    };
    window.addEventListener('scroll', preload, { passive: true });
    return () => window.removeEventListener('scroll', preload);
  }, []);

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

  // Check if scroll progress bar should be hidden (app/portal pages)
  const shouldHideScrollProgress = useMemo(() => {
    if (!pathname) return false;
    const normalizedPath = pathname.replace(/\/$/, '');
    return noScrollProgressPrefixes.some(prefix =>
      normalizedPath === prefix || normalizedPath.startsWith(prefix + '/')
    );
  }, [pathname, noScrollProgressPrefixes]);

  // Check if Lenis smooth scroll should be disabled (fixed layout pages)
  const shouldDisableSmoothScroll = useMemo(() => {
    if (!pathname) return false;
    const normalizedPath = pathname.replace(/\/$/, '');
    return noSmoothScrollPrefixes.some(prefix =>
      normalizedPath === prefix || normalizedPath.startsWith(prefix + '/')
    );
  }, [pathname, noSmoothScrollPrefixes]);

  // Check if floating video button should be hidden (blog posts, admin, auth)
  const shouldHideFloatingButton = useMemo(() => {
    if (!pathname) return false;
    const normalizedPath = pathname.replace(/\/$/, '');
    return noFloatingButtonPrefixes.some(prefix =>
      normalizedPath === prefix || normalizedPath.startsWith(prefix)
    );
  }, [pathname, noFloatingButtonPrefixes]);

  // Embed mode: minimal wrapper, just the content
  if (isEmbedMode) {
    return <>{children}</>;
  }

  return (
    <ViewportProvider>
      {!shouldDisableSmoothScroll && <SmoothScroll />}
      {!shouldHideScrollProgress && <ScrollProgress />}
      {!shouldHideHeaderFooter && !shouldHideScrollIndicator && <ScrollIndicator />}
      <ExternalLinkHandler />
      <ScrollPerformanceOptimizer />
      <ViewportHeightLock />
      {!shouldHideHeaderFooter && <Header />}
      {!shouldHideHeaderFooter && !shouldHideFloatingButton && <FloatingVideoButton />}
      {!shouldHideHeaderFooter && <VIPGuestPassPopup forceOpen={forceVipOpen} onForceClose={() => setForceVipOpen(false)} />}
      {/* TEMP: Debug button to test VIP Guest Pass popup — remove when done */}
      {!shouldHideHeaderFooter && !shouldHideFloatingButton && (
        <button
          onClick={() => setForceVipOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '320px',
            zIndex: 10005,
            padding: '10px 16px',
            borderRadius: '12px',
            background: 'rgba(20,20,20,0.9)',
            border: '2px solid rgba(60,60,60,0.8)',
            color: '#ffd700',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            letterSpacing: '0.04em',
          }}
        >
          VIP Pass
        </button>
      )}
      {/*
        Using div instead of main to avoid nested <main> elements.
        Pages already have their own <main id="main-content"> for accessibility.
      */}
      <div
        style={{ minHeight: '100vh', position: 'relative', isolation: 'isolate' }}
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
