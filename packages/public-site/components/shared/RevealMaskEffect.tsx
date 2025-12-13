'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * RevealMaskEffect - Golden glow that contracts/expands based on scroll
 *
 * Placed behind hero images to create a cosmic portal effect.
 * The mask starts large and shrinks as user scrolls, or vice versa.
 *
 * Animation behavior:
 * 1. Intro: Fast animation from START to END over 3 seconds
 * 2. Transition: Gradually slows down to idle speed (smooth blend)
 * 3. Idle: Continuous slow animation that never stops
 * 4. Scroll: Speeds up when user scrolls
 */

// Initial progress offset - effect animates from START to END on page load
const INITIAL_PROGRESS_START = 0.05;
const INITIAL_PROGRESS_END = 0.5;

export function RevealMaskEffect() {
  const [progress, setProgress] = useState(INITIAL_PROGRESS_START);
  const currentRef = useRef(INITIAL_PROGRESS_START);
  const velocityRef = useRef(0); // Current animation velocity
  const rafRef = useRef<number>(0);
  const introStartTimeRef = useRef<number | null>(null);
  const lastScrollY = useRef(0);
  const scrollVelocityRef = useRef(0);

  useEffect(() => {
    const INTRO_DURATION = 3000; // 3 seconds for intro animation
    const INTRO_VELOCITY = (INITIAL_PROGRESS_END - INITIAL_PROGRESS_START) / INTRO_DURATION; // Progress per ms during intro
    const IDLE_VELOCITY = 0.000008; // Very slow continuous velocity (progress per ms)
    const SCROLL_VELOCITY_MULTIPLIER = 0.0003; // How much scroll affects velocity
    const VELOCITY_DECAY = 0.995; // How fast velocity decays to idle (per frame)
    const TRANSITION_DURATION = 2000; // 2 seconds to blend from intro to idle
    let lastTimestamp = 0;
    let introEndTime: number | null = null;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY.current;
      lastScrollY.current = currentScrollY;

      // Add scroll velocity (positive = scrolling down = faster animation)
      if (scrollDelta > 0) {
        scrollVelocityRef.current = Math.min(scrollDelta * SCROLL_VELOCITY_MULTIPLIER, 0.002);
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
      if (elapsed < INTRO_DURATION) {
        // Ease out cubic for smooth deceleration during intro
        const introProgress = elapsed / INTRO_DURATION;
        const eased = 1 - Math.pow(1 - introProgress, 3);
        currentRef.current = INITIAL_PROGRESS_START + eased * (INITIAL_PROGRESS_END - INITIAL_PROGRESS_START);

        // Track velocity for smooth transition
        velocityRef.current = INTRO_VELOCITY * (1 - introProgress); // Velocity decreases during intro
      }
      // Phase 2: Transition from intro to idle (INTRO_DURATION to INTRO_DURATION + TRANSITION_DURATION)
      else if (elapsed < INTRO_DURATION + TRANSITION_DURATION) {
        if (introEndTime === null) {
          introEndTime = timestamp;
          // Set initial velocity to match end of intro
          velocityRef.current = INTRO_VELOCITY * 0.1; // Already slowed by ease-out
        }

        const transitionProgress = (elapsed - INTRO_DURATION) / TRANSITION_DURATION;

        // Blend from current velocity to idle velocity
        const blendedVelocity = velocityRef.current * (1 - transitionProgress) + IDLE_VELOCITY * transitionProgress;

        // Add scroll boost
        const totalVelocity = blendedVelocity + scrollVelocityRef.current;

        // Apply velocity
        currentRef.current += totalVelocity * deltaTime;

        // Decay scroll velocity
        scrollVelocityRef.current *= VELOCITY_DECAY;
      }
      // Phase 3: Continuous idle animation (after transition)
      else {
        // Base idle velocity + scroll boost
        const totalVelocity = IDLE_VELOCITY + scrollVelocityRef.current;

        // Apply velocity
        currentRef.current += totalVelocity * deltaTime;

        // Decay scroll velocity
        scrollVelocityRef.current *= VELOCITY_DECAY;
      }

      // Keep progress in reasonable bounds (loop back for continuous effect)
      // Using modulo-like behavior but smooth
      if (currentRef.current > 2) {
        currentRef.current = 2; // Cap to prevent overflow, visual doesn't change much past 1
      }

      setProgress(currentRef.current);
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

  // Animation values - continuous effect
  // Mask shrinks as progress increases but never fully disappears
  const effectiveProgress = Math.min(progress, 1.5); // Cap visual effect at 1.5
  const maskSize = Math.max(20, 70 - effectiveProgress * 35); // Shrinks from 70% to 20% min
  const rotation = effectiveProgress * 90;

  // Gentle opacity reduction for depth but never fully fades
  const minOpacity = 0.3; // Never go below 30% opacity
  const opacityFactor = Math.max(minOpacity, 1 - effectiveProgress * 0.5);

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center" style={{ zIndex: 0 }}>
      {/* Golden radial glow - continuous visibility */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse ${maskSize}% ${maskSize * 0.8}% at 50% 40%,
            rgba(255,215,0,${0.35 * opacityFactor}) 0%,
            rgba(255,180,0,${0.25 * opacityFactor}) 30%,
            rgba(255,150,0,${0.15 * opacityFactor}) 50%,
            transparent 75%)`,
        }}
      />
      {/* Outer rotating border - centered */}
      <div
        className="absolute w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] border-2"
        style={{
          top: '35%',
          transform: `translateY(-50%) rotate(${rotation}deg)`,
          borderRadius: `${20 + effectiveProgress * 30}%`,
          borderColor: `rgba(255,215,0,${0.4 * opacityFactor})`,
        }}
      />
      {/* Inner rotating border - centered */}
      <div
        className="absolute w-[60vw] h-[60vw] max-w-[450px] max-h-[450px] border"
        style={{
          top: '35%',
          transform: `translateY(-50%) rotate(${-rotation * 0.5}deg)`,
          borderRadius: `${Math.max(20, 50 - effectiveProgress * 30)}%`,
          borderColor: `rgba(255,215,0,${0.3 * opacityFactor})`,
        }}
      />
    </div>
  );
}
