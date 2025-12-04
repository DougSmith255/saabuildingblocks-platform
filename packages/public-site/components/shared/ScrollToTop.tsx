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
 * Usage: Add to layout.tsx inside the body
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const prevPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    // Only scroll if the pathname actually changed (not just hash)
    if (prevPathnameRef.current !== null && prevPathnameRef.current !== pathname) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      });
    }
    prevPathnameRef.current = pathname;
  }, [pathname]);

  return null;
}

export default ScrollToTop;
