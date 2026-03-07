/**
 * AppShell - Wraps page content with the same global components as Next.js layout
 *
 * Optimized for Astro:
 * - No ScrollToTop (Astro uses full page loads, browser handles scroll position)
 * - No SkipLink (rendered as static HTML in BaseLayout.astro)
 * - No ExternalLinkHandler/ScrollPerformanceOptimizer/ViewportHeightLock
 *   (these are inline <script> tags in BaseLayout.astro, removed from React via Vite plugin)
 */
'use client';

import React from 'react';
import StarBackground from '@public-site/components/shared/StarBackgroundCanvas';
import LayoutWrapper from '@public-site/app/components/LayoutWrapper';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <>
      <StarBackground />
      <LayoutWrapper>{children}</LayoutWrapper>
    </>
  );
}
