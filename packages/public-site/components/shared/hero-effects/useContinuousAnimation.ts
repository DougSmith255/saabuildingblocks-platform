'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Shared hook for continuous hero animations
 *
 * Animation behavior:
 * 1. Intro: Fast animation over 3 seconds (ease-out)
 * 2. Transition: Gradually slows to idle speed (2 seconds)
 * 3. Idle: Continuous animation using sine waves (never stops)
 * 4. Scroll: Speeds up when user scrolls
 *
 * Returns a time value that continuously increments. Use sine waves
 * on this time value to create smooth, organic oscillations.
 */

const LOOP_MIN = 0.1;
const LOOP_MAX = 0.8;
const INITIAL_PROGRESS_START = 0.1;
const INITIAL_PROGRESS_END = 0.5;

export function useContinuousAnimation() {
  const [time, setTime] = useState(0);
  const timeRef = useRef(0);
  const rafRef = useRef<number>(0);
  const introStartTimeRef = useRef<number | null>(null);
  const lastScrollY = useRef(0);
  const scrollBoostRef = useRef(0);

  useEffect(() => {
    const INTRO_DURATION = 3000;
    const IDLE_SPEED = 0.00005;
    const SCROLL_SPEED_MULTIPLIER = 0.0006;
    const SCROLL_DECAY = 0.99;
    const TRANSITION_DURATION = 2000;
    let lastTimestamp = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY.current);
      lastScrollY.current = currentScrollY;

      if (scrollDelta > 0) {
        scrollBoostRef.current = Math.min(scrollDelta * SCROLL_SPEED_MULTIPLIER, 0.005);
      }
    };

    const animate = (timestamp: number) => {
      const deltaTime = lastTimestamp ? timestamp - lastTimestamp : 16;
      lastTimestamp = timestamp;

      if (introStartTimeRef.current === null) {
        introStartTimeRef.current = timestamp;
      }

      const elapsed = timestamp - introStartTimeRef.current;

      // Phase 1: Intro animation
      if (elapsed < INTRO_DURATION) {
        const introProgress = elapsed / INTRO_DURATION;
        const eased = 1 - Math.pow(1 - introProgress, 3);
        timeRef.current = INITIAL_PROGRESS_START + eased * (INITIAL_PROGRESS_END - INITIAL_PROGRESS_START);
      }
      // Phase 2: Transition from intro to idle
      else if (elapsed < INTRO_DURATION + TRANSITION_DURATION) {
        const transitionProgress = (elapsed - INTRO_DURATION) / TRANSITION_DURATION;
        const introEndSpeed = 0.0001;
        const blendedSpeed = introEndSpeed * (1 - transitionProgress) + IDLE_SPEED * transitionProgress;
        const totalSpeed = blendedSpeed + scrollBoostRef.current;
        timeRef.current += totalSpeed * deltaTime;
        scrollBoostRef.current *= SCROLL_DECAY;
      }
      // Phase 3: Continuous idle animation
      else {
        const totalSpeed = IDLE_SPEED + scrollBoostRef.current;
        timeRef.current += totalSpeed * deltaTime;
        scrollBoostRef.current *= SCROLL_DECAY;
      }

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
