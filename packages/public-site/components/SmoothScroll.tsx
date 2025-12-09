'use client';

import { useEffect } from 'react';
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
 * @see https://github.com/darkroomengineering/lenis
 */
export default function SmoothScroll() {
  useEffect(() => {
    // Disable browser's automatic scroll restoration
    // This prevents the browser from restoring scroll position when navigating between pages
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Scroll to top on initial page load (for static export navigation)
    window.scrollTo(0, 0);

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 0.7, // Scroll animation duration in seconds
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing function (default)
      orientation: 'vertical', // Scroll direction
      gestureOrientation: 'vertical', // Gesture direction
      smoothWheel: true, // Enable smooth scrolling for mouse wheel
      wheelMultiplier: 0.8, // Mouse wheel sensitivity
      touchMultiplier: 2, // Touch sensitivity
      infinite: false, // Disable infinite scroll
    });

    // Animation frame loop for Lenis
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenis.destroy();
    };
  }, []);

  return null; // This component doesn't render anything
}
