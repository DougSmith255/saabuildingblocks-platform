'use client';

import { useEffect } from 'react';

/**
 * H1 Glow Controller - Random Pulse Animation
 *
 * Creates organic, living neon effect by:
 * - Random pulse duration: 0.5-2 seconds
 * - Random delay between pulses: 1-5 seconds
 * - Brightness peaks at 1.35
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

      // Random duration for this pulse (0.5-2 seconds for full cycle)
      const pulseDuration = random(0.5, 2);

      // Set the animation
      element.style.animation = `h1GlowPulse ${pulseDuration}s ease-in-out 1`;

      // After pulse completes, wait random time before next pulse
      const pulseTimeout = window.setTimeout(() => {
        if (isCleanedUp) return;
        timeouts.delete(pulseTimeout);

        // Remove animation
        element.style.animation = 'none';

        // Random delay before next pulse (1-5 seconds)
        const delayMs = random(1000, 5000);

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

      // Get all glow pulse elements
      const glowElements = document.querySelectorAll('.h1-glow-pulse');
      if (glowElements.length === 0) return;

      // Start each element with a random initial delay for variety
      glowElements.forEach((element) => {
        const initialDelay = random(0, 3000);
        const timeout = window.setTimeout(() => {
          timeouts.delete(timeout);
          pulseElement(element as HTMLElement);
        }, initialDelay);
        timeouts.add(timeout);
      });
    };

    // Defer until page is fully loaded AND browser is idle
    const initGlowEffect = () => {
      // Use requestIdleCallback if available, otherwise setTimeout
      const scheduleWhenIdle = window.requestIdleCallback
        || ((cb: IdleRequestCallback) => window.setTimeout(cb, 1));

      scheduleWhenIdle(() => {
        startGlowAnimations();
      }, { timeout: 5000 }); // Max wait 5 seconds
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
      // Reset animation styles
      document.querySelectorAll('.h1-glow-pulse').forEach((el) => {
        (el as HTMLElement).style.animation = '';
      });
    };
  }, []);

  return null; // This component only provides behavior, no UI
}
