'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Shared hook for continuous hero animations (CLS-Optimized)
 *
 * Animation behavior:
 * - Starts at idle speed immediately (no intro boost to prevent CLS)
 * - Time initialized to 1 so first render matches animated state
 * - Scroll adds a speed boost for interactivity
 *
 * Returns a time value that continuously increments. Use sine waves
 * on this time value to create smooth, organic oscillations.
 */

export function useContinuousAnimation() {
  // Initialize time to 1 (not 0) so first render positions match animated positions
  const [time, setTime] = useState(1);
  const timeRef = useRef(1);
  const rafRef = useRef<number>(0);
  const lastScrollY = useRef(0);
  const scrollBoostRef = useRef(0);

  useEffect(() => {
    // Speed settings - idle speed only, no intro boost
    const IDLE_SPEED = 0.0002;
    const SCROLL_BOOST_MAX = 0.0006;
    const SCROLL_BOOST_MULTIPLIER = 0.000032;
    const SCROLL_DECAY = 0.92;

    let lastTimestamp = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY.current);
      lastScrollY.current = currentScrollY;

      if (scrollDelta > 0) {
        // Boost proportional to scroll speed, capped at max
        const boost = Math.min(scrollDelta * SCROLL_BOOST_MULTIPLIER, SCROLL_BOOST_MAX);
        scrollBoostRef.current = Math.max(scrollBoostRef.current, boost);
      }
    };

    const animate = (timestamp: number) => {
      const deltaTime = lastTimestamp ? timestamp - lastTimestamp : 16;
      lastTimestamp = timestamp;

      // No intro speed boost - just idle + scroll boost
      const currentSpeed = IDLE_SPEED + scrollBoostRef.current;

      timeRef.current += currentSpeed * deltaTime;
      scrollBoostRef.current *= SCROLL_DECAY;

      setTime(timeRef.current);
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    lastScrollY.current = window.scrollY;
    rafRef.current = requestAnimationFrame(animate);

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
