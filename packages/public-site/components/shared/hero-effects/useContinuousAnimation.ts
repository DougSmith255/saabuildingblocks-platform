'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Shared hook for continuous hero animations
 *
 * Animation behavior:
 * - Starts fast and smoothly decelerates to idle speed (no pause/jerk)
 * - Uses exponential decay for natural-feeling slowdown
 * - Scroll adds a small boost (1.5x idle speed)
 *
 * Returns a time value that continuously increments. Use sine waves
 * on this time value to create smooth, organic oscillations.
 */

export function useContinuousAnimation() {
  const [time, setTime] = useState(0);
  const timeRef = useRef(0);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);
  const lastScrollY = useRef(0);
  const scrollBoostRef = useRef(0);

  useEffect(() => {
    // Speed settings
    const IDLE_SPEED = 0.00005;
    const INTRO_SPEED = 0.0004; // 8x idle speed at start
    const DECAY_TIME = 3000; // Time to reach ~95% of idle speed (ms)
    const SCROLL_BOOST = 0.000025; // Adds 0.5x for 1.5x total during scroll
    const SCROLL_DECAY = 0.95;

    let lastTimestamp = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY.current);
      lastScrollY.current = currentScrollY;

      if (scrollDelta > 0) {
        scrollBoostRef.current = SCROLL_BOOST;
      }
    };

    const animate = (timestamp: number) => {
      const deltaTime = lastTimestamp ? timestamp - lastTimestamp : 16;
      lastTimestamp = timestamp;

      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;

      // Exponential decay from intro speed to idle speed
      // speed = idle + (intro - idle) * e^(-elapsed/tau)
      // tau chosen so we're at ~5% of extra speed after DECAY_TIME
      const tau = DECAY_TIME / 3; // ~95% decay after 3 tau
      const extraSpeed = (INTRO_SPEED - IDLE_SPEED) * Math.exp(-elapsed / tau);
      const currentSpeed = IDLE_SPEED + extraSpeed + scrollBoostRef.current;

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
  const progress = 0.45 + combinedWave * 0.35; // Oscillates between 0.1 and 0.8

  return {
    time,      // Raw time value (for rotation, continuous movement)
    progress,  // Oscillating progress (for pulsing, breathing effects)
  };
}
