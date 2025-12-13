'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * RevealMaskEffect - Golden glow that contracts/expands based on scroll
 *
 * Placed behind hero images to create a cosmic portal effect.
 *
 * Animation behavior:
 * - Starts fast and smoothly decelerates to idle speed (no pause/jerk)
 * - Uses exponential decay for natural-feeling slowdown
 * - Scroll adds a small boost (1.5x idle speed)
 * - Fades to 0 and hides when scrolled past hero
 */

export function RevealMaskEffect() {
  const [time, setTime] = useState(0);
  const [scrollFade, setScrollFade] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef(0);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);
  const lastScrollY = useRef(0);
  const scrollBoostRef = useRef(0);

  useEffect(() => {
    // Speed settings - 1.5X idle and scroll speed
    const IDLE_SPEED = 0.000075;
    const INTRO_SPEED = 0.0006; // 8x idle speed at start
    const DECAY_TIME = 3000; // Time to reach ~95% of idle speed (ms)
    const SCROLL_BOOST_MAX = 0.0003; // Max boost: 1.5X original scroll boost
    const SCROLL_BOOST_MULTIPLIER = 0.000012; // How much each px of scroll adds
    const SCROLL_DECAY = 0.92; // Slower decay so boost lasts longer

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

      // Calculate fade based on scroll position
      const viewportHeight = window.innerHeight;
      const fadeProgress = Math.min(currentScrollY / viewportHeight, 1);
      setScrollFade(1 - fadeProgress);
    };

    const animate = (timestamp: number) => {
      const deltaTime = lastTimestamp ? timestamp - lastTimestamp : 16;
      lastTimestamp = timestamp;

      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;

      // Exponential decay from intro speed to idle speed
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
    handleScroll(); // Initial fade calculation
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

  // Animation values based on progress
  const maskSize = 90 - progress * 40; // Larger: shrinks from ~85% to ~50%
  const rotation = time * 90; // Continuous rotation based on raw time

  // Hide completely when faded out
  if (scrollFade <= 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none flex items-center justify-center"
      style={{
        zIndex: 0,
        opacity: scrollFade,
        visibility: scrollFade <= 0 ? 'hidden' : 'visible',
      }}
    >
      {/* Golden radial glow - less intense, larger, centered lower */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse ${maskSize}% ${maskSize * 0.7}% at 50% 50%,
            rgba(255,215,0,0.2) 0%,
            rgba(255,180,0,0.12) 35%,
            rgba(255,150,0,0.06) 55%,
            transparent 80%)`,
        }}
      />
      {/* Outer rotating border - centered between photo top and tagline bottom */}
      <div
        className="absolute w-[80vw] h-[80vw] max-w-[700px] max-h-[700px] border-2"
        style={{
          top: '45%',
          transform: `translateY(-50%) rotate(${rotation}deg)`,
          borderRadius: `${20 + progress * 30}%`,
          borderColor: 'rgba(255,215,0,0.25)',
        }}
      />
      {/* Inner rotating border - centered between photo top and tagline bottom */}
      <div
        className="absolute w-[60vw] h-[60vw] max-w-[520px] max-h-[520px] border"
        style={{
          top: '45%',
          transform: `translateY(-50%) rotate(${-rotation * 0.5}deg)`,
          borderRadius: `${Math.max(20, 50 - progress * 30)}%`,
          borderColor: 'rgba(255,215,0,0.18)',
        }}
      />
    </div>
  );
}
