'use client';

import { useEffect } from 'react';

/**
 * ViewportHeightLock
 *
 * Locks the viewport height on mobile to prevent layout shifts when
 * the browser's address bar hides/shows during scroll.
 *
 * How it works:
 * 1. On mount, calculates window.innerHeight (actual visible height)
 * 2. Sets --vh-locked CSS variable to this value
 * 3. Only recalculates on actual resize events (orientation change, etc.)
 * 4. Does NOT recalculate during scroll (address bar hide/show)
 *
 * Usage in CSS:
 * - Use calc(var(--vh-locked, 1vh) * 100) instead of 100vh/100dvh
 * - Or use the .vh-locked-full class for full viewport height
 *
 * This prevents the "jumping" effect on iOS Safari and Firefox mobile
 * where elements shift as the address bar animates.
 */
export function ViewportHeightLock() {
  useEffect(() => {
    // Only apply on mobile/touch devices
    const isMobile = window.innerWidth < 1024 ||
      window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    if (!isMobile) return;

    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    let lastWidth = window.innerWidth;

    const setViewportHeight = () => {
      // Calculate 1vh equivalent
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh-locked', `${vh}px`);
    };

    // Set initial value
    setViewportHeight();

    const handleResize = () => {
      // Debounce resize events
      if (resizeTimeout) clearTimeout(resizeTimeout);

      resizeTimeout = setTimeout(() => {
        // Only update if width changed (true resize, not address bar)
        // Address bar changes only affect height, not width
        if (window.innerWidth !== lastWidth) {
          lastWidth = window.innerWidth;
          setViewportHeight();
        }
      }, 100);
    };

    // Also update on orientation change (always a true resize)
    const handleOrientationChange = () => {
      setTimeout(() => {
        lastWidth = window.innerWidth;
        setViewportHeight();
      }, 100);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      if (resizeTimeout) clearTimeout(resizeTimeout);
    };
  }, []);

  return null;
}
