'use client';

import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';

/**
 * Lenis Smooth Scroll Component
 *
 * Industry-standard smooth scrolling for mouse wheel and trackpad.
 * DESKTOP ONLY - disabled on touch-PRIMARY devices (phones/tablets) for:
 * - Native scroll performance
 * - Prevents clicks being blocked during scroll momentum
 *
 * Detection uses CSS media query 'pointer: coarse' to identify touch-primary
 * devices. Laptops with touchscreens still get Lenis since their primary
 * pointer is a mouse/trackpad (pointer: fine).
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
    // Detect touch-PRIMARY devices (phones/tablets) - NOT laptops with touchscreens
    // Use CSS media query 'pointer: coarse' which detects touch-primary input devices
    // This allows Lenis on laptops with touchscreens while disabling on phones/tablets
    const checkTouchPrimaryDevice = () => {
      // Check if primary pointer is coarse (finger) rather than fine (mouse)
      if (window.matchMedia('(pointer: coarse)').matches) {
        return true;
      }
      // Fallback: narrow screen + touch = likely mobile
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isNarrowScreen = window.innerWidth < 768;
      return hasTouch && isNarrowScreen;
    };

    setIsMobile(checkTouchPrimaryDevice());

    // Disable browser's automatic scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Scroll to top on initial page load
    window.scrollTo(0, 0);

    // Skip Lenis on touch-primary devices - use native scroll
    // This avoids the issue where clicks are blocked during scroll momentum on mobile
    if (checkTouchPrimaryDevice()) {
      console.log('[SmoothScroll] Skipping Lenis - touch-primary device detected');
      return;
    }

    console.log('[SmoothScroll] Initializing Lenis for desktop');

    // Defer Lenis initialization to avoid blocking main thread
    const initLenis = () => {
      console.log('[SmoothScroll] Lenis init callback running');
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

      // Stop current scroll animation on any click - allows immediate interaction
      // This fixes the issue where clicks don't register while Lenis is animating
      // We use stop() then start() to cancel momentum but keep Lenis active
      const handleClick = () => {
        if (lenis.isScrolling) {
          lenis.stop();
          // Immediately restart Lenis so future scrolling works
          lenis.start();
        }
      };

      // Use capture phase to catch clicks before they reach interactive elements
      window.addEventListener('pointerdown', handleClick, { capture: true, passive: true });

      // Animation frame loop for Lenis
      function raf(time: number) {
        lenis.raf(time);
        rafIdRef.current = requestAnimationFrame(raf);
      }

      rafIdRef.current = requestAnimationFrame(raf);
      console.log('[SmoothScroll] Lenis initialized and running');

      // Store cleanup function
      (lenis as any).__clickCleanup = () => {
        window.removeEventListener('pointerdown', handleClick, { capture: true });
      };
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
        // Clean up click listener
        (lenisRef.current as any).__clickCleanup?.();
        lenisRef.current.destroy();
      }
    };
  }, []);

  return null;
}
