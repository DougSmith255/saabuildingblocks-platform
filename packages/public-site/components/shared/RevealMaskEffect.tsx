'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * RevealMaskEffect - Golden glow that contracts/expands based on scroll
 *
 * Placed behind hero images to create a cosmic portal effect.
 *
 * Animation behavior:
 * - Renders immediately with static initial state (no pop-in)
 * - Starts animating at idle speed immediately
 * - Scroll adds a small boost
 * - Fading is handled by FixedHeroWrapper (not internally)
 */

// Initial values for SSR/first render (time=0, progress=0.45)
// maskSize = 90 - 0.45 * 40 = 72
const INITIAL_MASK_SIZE = 72;
const INITIAL_PROGRESS = 0.45;

export function RevealMaskEffect() {
  const [time, setTime] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef(0);
  const rafRef = useRef<number>(0);
  const lastScrollY = useRef(0);
  const scrollBoostRef = useRef(0);

  useEffect(() => {
    // Speed settings
    const IDLE_SPEED = 0.000075;
    const SCROLL_BOOST_MAX = 0.0006;
    const SCROLL_BOOST_MULTIPLIER = 0.000024;
    const SCROLL_DECAY = 0.92;

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

      // Start immediately at idle speed
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
  const progress = time === 0 ? INITIAL_PROGRESS : (0.45 + combinedWave * 0.35);

  // Animation values based on progress
  const maskSize = time === 0 ? INITIAL_MASK_SIZE : (90 - progress * 40);
  const rotation = time * 90;

  // Center point: where the H1 meets the image (approximately 42% from top on desktop)
  // This accounts for the image taking up ~50dvh and the H1 overlapping its bottom 25%
  const centerY = '42%';

  return (
    <div
      ref={containerRef}
      className="reveal-mask-effect hero-effect-layer absolute inset-0 pointer-events-none flex items-center justify-center"
      style={{
        zIndex: 0,
      }}
    >
      {/* Golden radial glow - renders immediately with initial state */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse ${maskSize}% ${maskSize * 0.7}% at 50% ${centerY},
            rgba(255,215,0,0.2) 0%,
            rgba(255,180,0,0.12) 35%,
            rgba(255,150,0,0.06) 55%,
            transparent 80%)`,
        }}
      />
      {/* Outer rotating border */}
      <div
        className="absolute w-[80vw] h-[80vw] max-w-[700px] max-h-[700px] border-2 left-1/2"
        style={{
          top: centerY,
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          borderRadius: `${20 + progress * 30}%`,
          borderColor: 'rgba(255,215,0,0.25)',
        }}
      />
      {/* Inner rotating border */}
      <div
        className="absolute w-[60vw] h-[60vw] max-w-[520px] max-h-[520px] border left-1/2"
        style={{
          top: centerY,
          transform: `translate(-50%, -50%) rotate(${-rotation * 0.5}deg)`,
          borderRadius: `${Math.max(20, 50 - progress * 30)}%`,
          borderColor: 'rgba(255,215,0,0.18)',
        }}
      />
      {/* Gradient overlay for depth - uses CSS class for immediate rendering */}
      <div className="hero-vignette" />
    </div>
  );
}
