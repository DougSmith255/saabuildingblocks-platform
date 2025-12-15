'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Shared hook for continuous hero animations (CLS-Optimized)
 *
 * Animation behavior:
 * - Initial page load: Frozen until page fully loaded, then eases 0 → idle speed
 * - Client-side navigation: Starts at time=0, eases 0 → idle speed immediately
 * - Scroll adds a speed boost for interactivity
 *
 * Returns a time value that continuously increments. Use sine waves
 * on this time value to create smooth, organic oscillations.
 */

// Track if this is the initial page load
let isInitialPageLoad = true;
let pageFullyLoaded = false;

// Set up load listener once globally
if (typeof window !== 'undefined') {
  if (document.readyState === 'complete') {
    pageFullyLoaded = true;
  } else {
    window.addEventListener('load', () => {
      pageFullyLoaded = true;
    }, { once: true });
  }
}

export function useContinuousAnimation() {
  // Initial page load: start at time=1 (frozen position)
  // Client-side nav: start at time=0
  const initialTime = isInitialPageLoad ? 1 : 0;
  const [time, setTime] = useState(initialTime);
  const timeRef = useRef(initialTime);
  const rafRef = useRef<number>(0);
  const lastScrollY = useRef(0);
  const scrollBoostRef = useRef(0);
  const easeStartTimeRef = useRef<number | null>(null);
  const isThisInitialLoad = useRef(isInitialPageLoad);

  useEffect(() => {
    // Speed settings
    const IDLE_SPEED = 0.0002;
    const SCROLL_BOOST_MAX = 0.0006;
    const SCROLL_BOOST_MULTIPLIER = 0.000032;
    const SCROLL_DECAY = 0.92;
    const EASE_IN_DURATION = 500; // ms to ease from 0 → idle speed

    let lastTimestamp = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY.current);
      lastScrollY.current = currentScrollY;

      if (scrollDelta > 0) {
        const boost = Math.min(scrollDelta * SCROLL_BOOST_MULTIPLIER, SCROLL_BOOST_MAX);
        scrollBoostRef.current = Math.max(scrollBoostRef.current, boost);
      }
    };

    const animate = (timestamp: number) => {
      const deltaTime = lastTimestamp ? timestamp - lastTimestamp : 16;
      lastTimestamp = timestamp;

      // For initial page load: wait until page is fully loaded
      // For client-side nav: start immediately
      const canAnimate = !isThisInitialLoad.current || pageFullyLoaded;

      if (canAnimate) {
        // Start ease-in timer when we first can animate
        if (easeStartTimeRef.current === null) {
          easeStartTimeRef.current = timestamp;
        }

        // Calculate ease-in factor (0 to 1 over EASE_IN_DURATION)
        const easeElapsed = timestamp - easeStartTimeRef.current;
        let easeFactor = Math.min(1, easeElapsed / EASE_IN_DURATION);
        // Smooth ease-out curve for natural acceleration
        easeFactor = 1 - Math.pow(1 - easeFactor, 3);

        const currentSpeed = (IDLE_SPEED + scrollBoostRef.current) * easeFactor;
        timeRef.current += currentSpeed * deltaTime;
        scrollBoostRef.current *= SCROLL_DECAY;

        setTime(timeRef.current);
      }
      // If not ready to animate, keep time frozen

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    lastScrollY.current = window.scrollY;
    rafRef.current = requestAnimationFrame(animate);

    // After this component mounts, future navigations are client-side
    isInitialPageLoad = false;

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Use sine waves for smooth, continuous oscillation
  const wave1 = Math.sin(time * Math.PI * 2);
  const wave2 = Math.sin(time * Math.PI * 1.3 + 0.5);
  const wave3 = Math.cos(time * Math.PI * 0.7);

  // Combine waves for organic motion
  const combinedWave = (wave1 * 0.5 + wave2 * 0.3 + wave3 * 0.2);
  const progress = 0.5 + combinedWave * 0.45; // Oscillates between 0.05 and 0.95

  return {
    time,      // Raw time value (for rotation, continuous movement)
    progress,  // Oscillating progress (for pulsing, breathing effects)
  };
}
