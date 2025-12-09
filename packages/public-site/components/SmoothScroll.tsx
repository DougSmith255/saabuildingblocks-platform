'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

/**
 * Lenis Smooth Scroll Component
 *
 * Industry-standard smooth scrolling for mouse wheel, trackpad, and touch.
 * Handles cross-browser compatibility automatically.
 *
 * Also handles:
 * - Disabling browser scroll restoration (prevents scroll position being restored on navigation)
 * - Scrolling to top on initial page load
 *
 * Deferred initialization: Uses requestIdleCallback to avoid blocking main thread
 *
 * @see https://github.com/darkroomengineering/lenis
 */
export default function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Disable browser's automatic scroll restoration
    // This prevents the browser from restoring scroll position when navigating between pages
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Scroll to top on initial page load (for static export navigation)
    window.scrollTo(0, 0);

    // Defer Lenis initialization to avoid blocking main thread
    const initLenis = () => {
      // Initialize Lenis
      // NOTE: For snappier mouse wheel, use lower duration and higher wheelMultiplier
      const lenis = new Lenis({
        duration: 0.5, // Reduced from 0.7 for snappier response
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing function (default)
        orientation: 'vertical', // Scroll direction
        gestureOrientation: 'vertical', // Gesture direction
        smoothWheel: true, // Enable smooth scrolling for mouse wheel
        wheelMultiplier: 1.0, // Increased from 0.8 - more responsive to wheel input
        touchMultiplier: 2, // Touch sensitivity
        infinite: false, // Disable infinite scroll
        lerp: 0.15, // Linear interpolation intensity (0-1, higher = snappier, default ~0.1)
      });

      lenisRef.current = lenis;

      // Animation frame loop for Lenis
      function raf(time: number) {
        lenis.raf(time);
        rafIdRef.current = requestAnimationFrame(raf);
      }

      rafIdRef.current = requestAnimationFrame(raf);
    };

    // Use requestIdleCallback to defer initialization, with setTimeout fallback
    let idleCallbackId: number | undefined;
    if ('requestIdleCallback' in window) {
      idleCallbackId = window.requestIdleCallback(initLenis, { timeout: 1000 });
    } else {
      // Fallback for Safari - defer to next frame
      setTimeout(initLenis, 50);
    }

    // Cleanup
    return () => {
      if (idleCallbackId && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleCallbackId);
      }
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
    };
  }, []);

  return null; // This component doesn't render anything
}
