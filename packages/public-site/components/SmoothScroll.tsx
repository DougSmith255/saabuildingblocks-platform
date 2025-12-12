'use client';

import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';

/**
 * Lenis Smooth Scroll Component
 *
 * Industry-standard smooth scrolling for mouse wheel and trackpad.
 * DESKTOP ONLY - disabled on mobile/touch devices for native scroll performance.
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
  const [isMobile, setIsMobile] = useState(true); // Default to mobile (SSR safe)

  useEffect(() => {
    // Detect mobile/touch devices - disable Lenis on mobile for native scroll
    const checkMobile = () => {
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isNarrowScreen = window.innerWidth < 768;
      return hasTouchScreen && isNarrowScreen;
    };

    setIsMobile(checkMobile());

    // Disable browser's automatic scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Scroll to top on initial page load
    window.scrollTo(0, 0);

    // Skip Lenis on mobile - use native scroll
    if (checkMobile()) {
      return;
    }

    // Defer Lenis initialization to avoid blocking main thread
    const initLenis = () => {
      // Initialize Lenis with DEFAULT settings
      const lenis = new Lenis({
        duration: 1.2, // Default duration
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Default easing
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1, // Default
        touchMultiplier: 1, // Default (not used since disabled on mobile)
        infinite: false,
        lerp: 0.1, // Default lerp
      });

      lenisRef.current = lenis;

      // Animation frame loop for Lenis
      function raf(time: number) {
        lenis.raf(time);
        rafIdRef.current = requestAnimationFrame(raf);
      }

      rafIdRef.current = requestAnimationFrame(raf);
    };

    // Use requestIdleCallback to defer initialization
    let idleCallbackId: number | undefined;
    if ('requestIdleCallback' in window) {
      idleCallbackId = window.requestIdleCallback(initLenis, { timeout: 1000 });
    } else {
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

  return null;
}
