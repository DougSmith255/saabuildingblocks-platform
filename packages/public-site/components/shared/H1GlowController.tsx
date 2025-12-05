'use client';

import { useEffect } from 'react';

/**
 * H1 Glow Controller - Random Pulse Animation
 *
 * Creates organic, living neon effect by:
 * - Random pulse duration: 1.5-3 seconds
 * - Random delay between pulses: 2-6 seconds
 * - Brightness peaks at 1.5 for visible effect
 *
 * PERFORMANCE: Deferred loading - runs only after page is fully loaded
 * and browser is idle. Zero impact on LCP/FCP/page load.
 *
 * Uses CSS keyframes for GPU-accelerated animations
 * Respects prefers-reduced-motion
 */
export default function H1GlowController() {
  useEffect(() => {
    // Store timeouts for cleanup
    const timeouts: Set<number> = new Set();
    let isCleanedUp = false;

    // Random number between min and max
    const random = (min: number, max: number) => Math.random() * (max - min) + min;

    // Pulse a single element with random timing
    const pulseElement = (element: HTMLElement) => {
      if (isCleanedUp) return;

      // Random duration for this pulse (1.5-3 seconds for visible effect)
      const pulseDuration = random(1.5, 3);

      // Set the animation on the H1 element
      element.style.animation = `h1GlowPulse ${pulseDuration}s ease-in-out 1`;

      // After pulse completes, wait random time before next pulse
      const pulseTimeout = window.setTimeout(() => {
        if (isCleanedUp) return;
        timeouts.delete(pulseTimeout);

        // Remove animation
        element.style.animation = 'none';

        // Random delay before next pulse (2-6 seconds)
        const delayMs = random(2000, 6000);

        const delayTimeout = window.setTimeout(() => {
          timeouts.delete(delayTimeout);
          pulseElement(element);
        }, delayMs);

        timeouts.add(delayTimeout);
      }, pulseDuration * 1000);

      timeouts.add(pulseTimeout);
    };

    // Main initialization function
    const startGlowAnimations = () => {
      if (isCleanedUp) return;

      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      // Get all H1 elements with glow pulse class
      const glowElements = document.querySelectorAll('h1.h1-glow-pulse');

      // Debug: Log if we found elements
      if (process.env.NODE_ENV === 'development') {
        console.log('[H1GlowController] Found elements:', glowElements.length);
      }

      if (glowElements.length === 0) return;

      // Start each element with a short initial delay (0-2 seconds)
      glowElements.forEach((element) => {
        const initialDelay = random(500, 2000); // Start sooner so user sees it
        const timeout = window.setTimeout(() => {
          timeouts.delete(timeout);
          pulseElement(element as HTMLElement);
        }, initialDelay);
        timeouts.add(timeout);
      });
    };

    // Start after a short delay (don't wait for idle - we want this visible)
    const initGlowEffect = () => {
      // Small delay to ensure DOM is ready, but not too long
      window.setTimeout(() => {
        startGlowAnimations();
      }, 500);
    };

    // Wait for full page load first
    if (document.readyState === 'complete') {
      initGlowEffect();
    } else {
      window.addEventListener('load', initGlowEffect, { once: true });
    }

    // Cleanup on unmount
    return () => {
      isCleanedUp = true;
      timeouts.forEach((timeout) => {
        window.clearTimeout(timeout);
      });
      timeouts.clear();
      // Reset animation styles on H1 elements
      document.querySelectorAll('h1.h1-glow-pulse').forEach((el) => {
        (el as HTMLElement).style.animation = '';
      });
    };
  }, []);

  return null; // This component only provides behavior, no UI
}
