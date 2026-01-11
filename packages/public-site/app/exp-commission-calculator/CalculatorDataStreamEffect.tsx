'use client';

import { useEffect, useState, useRef } from 'react';

// Animation progress values
const INITIAL_PROGRESS_START = 0.05;
const INITIAL_PROGRESS_END = 0.5;

/**
 * Data Stream Effect - Green Matrix-style rain
 *
 * Dynamically imported to prevent CLS (Cumulative Layout Shift).
 * This effect renders 440 animated elements (20 columns × 22 characters)
 * that would cause massive layout shifts if rendered during initial page load.
 */
export function CalculatorDataStreamEffect() {
  const [progress, setProgress] = useState(INITIAL_PROGRESS_START);
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const currentRef = useRef(INITIAL_PROGRESS_START);
  const velocityRef = useRef(0);
  const rafRef = useRef<number>(0);
  const introStartTimeRef = useRef<number | null>(null);
  const lastScrollY = useRef(0);
  const scrollVelocityRef = useRef(0);

  useEffect(() => {
    const INTRO_DURATION = 3000;
    const INTRO_VELOCITY = (INITIAL_PROGRESS_END - INITIAL_PROGRESS_START) / INTRO_DURATION;
    const IDLE_VELOCITY = 0.000008;
    const SCROLL_VELOCITY_MULTIPLIER = 0.0003;
    const VELOCITY_DECAY = 0.995;
    const TRANSITION_DURATION = 2000;
    let lastTimestamp = 0;
    let introEndTime: number | null = null;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY.current;
      lastScrollY.current = currentScrollY;

      if (scrollDelta > 0) {
        scrollVelocityRef.current = Math.min(scrollDelta * SCROLL_VELOCITY_MULTIPLIER, 0.002);
      }

      // Fade out based on scroll position - fade faster (complete by 40% of viewport)
      const viewportHeight = window.innerHeight;
      const fadeStart = 0; // Start fading immediately
      const fadeEnd = viewportHeight * 0.4; // Fully faded by 40% of viewport
      const opacity = Math.max(0, 1 - (currentScrollY - fadeStart) / (fadeEnd - fadeStart));
      setScrollOpacity(opacity);
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
        currentRef.current = INITIAL_PROGRESS_START + eased * (INITIAL_PROGRESS_END - INITIAL_PROGRESS_START);
        velocityRef.current = INTRO_VELOCITY * (1 - introProgress);
      }
      // Phase 2: Transition from intro to idle
      else if (elapsed < INTRO_DURATION + TRANSITION_DURATION) {
        if (introEndTime === null) {
          introEndTime = timestamp;
          velocityRef.current = INTRO_VELOCITY * 0.1;
        }

        const transitionProgress = (elapsed - INTRO_DURATION) / TRANSITION_DURATION;
        const blendedVelocity = velocityRef.current * (1 - transitionProgress) + IDLE_VELOCITY * transitionProgress;
        const totalVelocity = blendedVelocity + scrollVelocityRef.current;

        currentRef.current += totalVelocity * deltaTime;
        scrollVelocityRef.current *= VELOCITY_DECAY;
      }
      // Phase 3: Continuous idle animation
      else {
        const totalVelocity = IDLE_VELOCITY + scrollVelocityRef.current;
        currentRef.current += totalVelocity * deltaTime;
        scrollVelocityRef.current *= VELOCITY_DECAY;
      }

      // Loop the animation instead of stopping
      if (currentRef.current > 2) {
        currentRef.current = currentRef.current % 2;
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

  // Detect mobile for reduced columns
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Generate data columns - half on mobile for performance
  const columnCount = isMobile ? 10 : 20;
  const columnWidth = 100 / columnCount;
  const columns = [...Array(columnCount)].map((_, i) => ({
    x: i * columnWidth,
    speed: 0.5 + (i % 4) * 0.3,
    length: 5 + (i % 6),
    delay: (i * 0.02) % 0.4,
    // Deterministic binary pattern to avoid hydration mismatch
    chars: [...Array(22)].map((_, j) => ((i + j) % 2 === 0 ? '1' : '0')),
  }));

  return (
    <>
      {/* Animation container - has overflow-hidden for performance */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden hero-effect-layer"
        lang="en"
        translate="no"
        style={{ opacity: scrollOpacity, transition: 'opacity 0.1s ease-out' }}
      >
        {/* Green data columns */}
        {columns.map((col, i) => {
          const colProgress = Math.max(0, (progress - col.delay) * col.speed * 2);
          const yOffset = colProgress * 100;

          return (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${col.x}%`,
                top: 0,
                width: '3%',
                height: '100%',
                overflow: 'hidden',
                fontFamily: 'monospace',
                fontSize: '14px',
                lineHeight: '1.2',
              }}
            >
              {col.chars.map((char, j) => {
                const charY = ((j * 5 + yOffset) % 105);
                const isHead = j === Math.floor(colProgress * col.chars.length) % col.chars.length;
                const brightness = isHead ? 1 : Math.max(0, 1 - j * 0.06);
                const fadeAtBottom = charY > 70 ? Math.max(0, 1 - (charY - 70) / 30) : 1;

                return (
                  <div
                    key={j}
                    style={{
                      position: 'absolute',
                      top: `${charY}%`,
                      color: isHead
                        ? `rgba(255,255,255,${0.95 * fadeAtBottom})`
                        : `rgba(100,255,100,${brightness * 0.7 * fadeAtBottom})`,
                      textShadow: isHead
                        ? `0 0 15px rgba(100,255,100,${0.8 * fadeAtBottom})`
                        : `0 0 5px rgba(100,255,100,${brightness * 0.3 * fadeAtBottom})`,
                    }}
                  >
                    {char}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Vignette overlay - outside overflow-hidden to extend below fold */}
      <div
        className="absolute left-0 right-0 top-0 pointer-events-none hero-effect-layer"
        style={{
          height: 'calc(100% + 100px)',
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, rgba(0,0,0,0.6) 100%)',
          zIndex: 1,
        }}
      />
    </>
  );
}
