'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ScrollToTop - Scrolls to top of page on route change
 *
 * This component listens for pathname changes and scrolls to the top.
 * It ignores hash-only changes (like #category=xyz on the blog listing page)
 * so that filtering doesn't cause unwanted scroll jumps.
 *
 * Works with both native scroll and Lenis smooth scroll.
 *
 * Usage: Add to layout.tsx inside the body
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const prevPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    // Only scroll if the pathname actually changed (not just hash)
    if (prevPathnameRef.current !== null && prevPathnameRef.current !== pathname) {
      // Immediately scroll to top - use both methods for Lenis compatibility
      // 1. Native scroll (works on mobile and as fallback)
      window.scrollTo(0, 0);

      // 2. Also set scrollTop directly for immediate effect
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0; // For Safari

      // 3. Use requestAnimationFrame as backup to ensure it sticks
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
      });
    }
    prevPathnameRef.current = pathname;
  }, [pathname]);

  return null;
}

export default ScrollToTop;
