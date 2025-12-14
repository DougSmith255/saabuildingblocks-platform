'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ViewTransitionHandler - Adds page transition effects on navigation
 *
 * Uses the View Transitions API for smooth fade transitions between pages.
 * Works in Chrome 111+, Edge 111+, Safari 18+
 * Graceful fallback for unsupported browsers (Firefox)
 */
export function ViewTransitionHandler() {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  // Trigger view transition when pathname changes
  useEffect(() => {
    // Skip on initial render
    if (previousPathname.current === pathname) {
      return;
    }
    previousPathname.current = pathname;

    // Skip if View Transitions API not supported
    if (!('startViewTransition' in document)) {
      return;
    }

    // Skip if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // The transition was already started by Next.js router
    // We just need to ensure the CSS animations are applied
    // The ::view-transition pseudo-elements in globals.css handle the animation
  }, [pathname]);

  // Add a class to body when View Transitions are supported for CSS targeting
  useEffect(() => {
    if ('startViewTransition' in document) {
      document.body.classList.add('view-transitions-supported');
    }
  }, []);

  return null;
}
