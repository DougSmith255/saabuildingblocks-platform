'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * RevealMaskEffect - Golden glow that contracts/expands based on scroll
 *
 * Placed behind hero images to create a cosmic portal effect.
 *
 * Animation behavior:
 * 1. Intro: Fast animation from 0.1 to 0.5 over 3 seconds
 * 2. Transition: Gradually slows down to idle speed
 * 3. Idle: Continuous animation - time keeps moving forward forever
 *    Visual values use sine waves so they naturally oscillate
 * 4. Scroll: Speeds up the animation
 *
 * The animation feels infinite because it uses periodic functions (sin/cos)
 * that naturally cycle without any abrupt direction changes.
 */

// Intro animates from START to END point
const INITIAL_PROGRESS_START = 0.1;
const INITIAL_PROGRESS_END = 0.5;

export function RevealMaskEffect() {
  // Time accumulator - just keeps incrementing forever
  const [time, setTime] = useState(0);
  const timeRef = useRef(0);
  const rafRef = useRef<number>(0);
  const introStartTimeRef = useRef<number | null>(null);
  const lastScrollY = useRef(0);
  const scrollBoostRef = useRef(0);

  useEffect(() => {
    const INTRO_DURATION = 3000; // 3 seconds for intro animation
    const IDLE_SPEED = 0.00005; // Base time increment per ms (slightly faster idle)
    const SCROLL_SPEED_MULTIPLIER = 0.0006; // How much scroll speeds up animation
    const SCROLL_DECAY = 0.99; // How fast scroll boost decays
    const TRANSITION_DURATION = 2000; // 2 seconds to blend from intro to idle
    let lastTimestamp = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY.current);
      lastScrollY.current = currentScrollY;

      // Add scroll boost
      if (scrollDelta > 0) {
        scrollBoostRef.current = Math.min(scrollDelta * SCROLL_SPEED_MULTIPLIER, 0.005);
      }
    };

    const animate = (timestamp: number) => {
      const deltaTime = lastTimestamp ? timestamp - lastTimestamp : 16;
      lastTimestamp = timestamp;

      // Initialize intro start time
      if (introStartTimeRef.current === null) {
        introStartTimeRef.current = timestamp;
      }

      const elapsed = timestamp - introStartTimeRef.current;

      // Phase 1: Intro animation (0 to INTRO_DURATION)
      // During intro, we map time to match the intro progress
      if (elapsed < INTRO_DURATION) {
        const introProgress = elapsed / INTRO_DURATION;
        const eased = 1 - Math.pow(1 - introProgress, 3);
        // Map intro progress to time value that produces correct visual
        // We want visual progress from 0.1 to 0.5
        timeRef.current = INITIAL_PROGRESS_START + eased * (INITIAL_PROGRESS_END - INITIAL_PROGRESS_START);
      }
      // Phase 2: Transition from intro speed to idle speed
      else if (elapsed < INTRO_DURATION + TRANSITION_DURATION) {
        const transitionProgress = (elapsed - INTRO_DURATION) / TRANSITION_DURATION;

        // Blend from fast intro speed to slow idle speed
        const introEndSpeed = 0.0001; // Approximate speed at end of eased intro
        const blendedSpeed = introEndSpeed * (1 - transitionProgress) + IDLE_SPEED * transitionProgress;

        // Apply speed + scroll boost
        const totalSpeed = blendedSpeed + scrollBoostRef.current;
        timeRef.current += totalSpeed * deltaTime;

        // Decay scroll boost
        scrollBoostRef.current *= SCROLL_DECAY;
      }
      // Phase 3: Continuous idle animation - time keeps going forever
      else {
        const totalSpeed = IDLE_SPEED + scrollBoostRef.current;
        timeRef.current += totalSpeed * deltaTime;

        // Decay scroll boost
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
  // Different frequencies create organic, non-repeating feel
  const wave1 = Math.sin(time * Math.PI * 2); // Primary wave
  const wave2 = Math.sin(time * Math.PI * 1.3 + 0.5); // Secondary wave (different freq)
  const wave3 = Math.cos(time * Math.PI * 0.7); // Tertiary wave

  // Combine waves for organic motion (range roughly -1 to 1, normalized to 0.1-0.8)
  const combinedWave = (wave1 * 0.5 + wave2 * 0.3 + wave3 * 0.2); // Weighted average
  const progress = 0.45 + combinedWave * 0.35; // Centers at 0.45, oscillates ±0.35 (0.1 to 0.8)

  // Animation values based on progress
  const maskSize = 70 - progress * 50; // Shrinks from ~65% to ~30%
  const rotation = time * 90; // Continuous rotation based on raw time (no oscillation)

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center" style={{ zIndex: 0 }}>
      {/* Golden radial glow - continuous visibility */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse ${maskSize}% ${maskSize * 0.8}% at 50% 40%,
            rgba(255,215,0,0.35) 0%,
            rgba(255,180,0,0.25) 30%,
            rgba(255,150,0,0.15) 50%,
            transparent 75%)`,
        }}
      />
      {/* Outer rotating border - centered */}
      <div
        className="absolute w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] border-2"
        style={{
          top: '35%',
          transform: `translateY(-50%) rotate(${rotation}deg)`,
          borderRadius: `${20 + progress * 30}%`,
          borderColor: 'rgba(255,215,0,0.4)',
        }}
      />
      {/* Inner rotating border - centered */}
      <div
        className="absolute w-[60vw] h-[60vw] max-w-[450px] max-h-[450px] border"
        style={{
          top: '35%',
          transform: `translateY(-50%) rotate(${-rotation * 0.5}deg)`,
          borderRadius: `${Math.max(20, 50 - progress * 30)}%`,
          borderColor: 'rgba(255,215,0,0.3)',
        }}
      />
    </div>
  );
}
