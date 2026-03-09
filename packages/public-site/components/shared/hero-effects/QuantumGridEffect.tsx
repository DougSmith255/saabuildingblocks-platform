'use client';

import { useEffect, useRef } from 'react';

const GRID_LINES = 24;

// Pre-compute static line positions (never changes)
const HORIZONTAL_LINES = Array.from({ length: GRID_LINES }, (_, i) => {
  const t = i / (GRID_LINES - 1);
  return Math.pow(t, 1.8) * 100;
});

/**
 * Quantum Grid Effect (Digital Horizon)
 * Perspective grid stretching to horizon with sweeping gold pulse.
 *
 * Performance: Uses a single CSS custom property (--pulse-y) updated via rAF
 * instead of React state. Grid lines render once and never re-render.
 * The pulse band moves via CSS calc() referencing the custom property.
 */
export function QuantumGridEffect() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Animation loop - updates one CSS variable, zero React re-renders
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId = 0;
    let time = 0;
    let lastTimestamp = 0;
    let isVisible = true;
    let lastScrollY = window.scrollY;
    let scrollBoost = 0;

    const IDLE_SPEED = 0.0002;
    const SCROLL_BOOST_MAX = 0.0006;
    const SCROLL_BOOST_MULTIPLIER = 0.000032;
    const SCROLL_DECAY = 0.92;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;
      if (scrollDelta > 0) {
        scrollBoost = Math.max(scrollBoost, Math.min(scrollDelta * SCROLL_BOOST_MULTIPLIER, SCROLL_BOOST_MAX));
      }
    };

    const animate = (timestamp: number) => {
      if (!isVisible) { rafId = 0; return; }

      const deltaTime = lastTimestamp ? timestamp - lastTimestamp : 16;
      lastTimestamp = timestamp;

      time += (IDLE_SPEED + scrollBoost) * deltaTime;
      scrollBoost *= SCROLL_DECAY;

      // Same triple-sine-wave math as useContinuousAnimation
      const wave1 = Math.sin(time * Math.PI * 2);
      const wave2 = Math.sin(time * Math.PI * 1.3 + 0.5);
      const wave3 = Math.cos(time * Math.PI * 0.7);
      const progress = 0.575 + (wave1 * 0.5 + wave2 * 0.3 + wave3 * 0.2) * 0.375;

      container.style.setProperty('--pulse-y', `${progress * 100}`);
      rafId = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (!wasVisible && isVisible && !rafId) {
          lastTimestamp = 0;
          rafId = requestAnimationFrame(animate);
        }
      },
      { threshold: 0 },
    );
    observer.observe(container);

    window.addEventListener('scroll', handleScroll, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Animation container - has overflow-hidden for performance */}
      <div
        ref={containerRef}
        className="absolute inset-0 pointer-events-none overflow-hidden hero-effect-layer"
        style={{ '--pulse-y': '57.5' } as React.CSSProperties}
      >
        {/* Perspective grid at TOP extending to 95% */}
        <div
          className="absolute inset-0"
          style={{ perspective: '500px', perspectiveOrigin: '50% 100%' }}
        >
          <div
            style={{
              position: 'absolute',
              left: '-50%',
              right: '-50%',
              top: 0,
              height: '95%',
              transform: 'rotateX(-70deg)',
              transformOrigin: 'top center',
            }}
          >
            {/* Static horizontal lines - render once, never re-render */}
            {HORIZONTAL_LINES.map((y, i) => (
              <div
                key={`h-${i}`}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: `${y}%`,
                  height: 1,
                  background: `rgba(255,215,0,${0.15 + (y / 100) * 0.2})`,
                }}
              />
            ))}

            {/* Pulse band - moves via CSS custom property, no React re-renders */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 'calc(var(--pulse-y) * 1% - 8%)',
                height: '16%',
                background: 'linear-gradient(to bottom, transparent 0%, rgba(255,215,0,0.5) 25%, rgba(255,215,0,0.8) 50%, rgba(255,215,0,0.5) 75%, transparent 100%)',
                boxShadow: '0 0 15px rgba(255,215,0,0.4)',
                pointerEvents: 'none',
                mixBlendMode: 'screen',
              }}
            />

            {/* Static vertical lines */}
            {[...Array(GRID_LINES * 2)].map((_, i) => {
              const x = (i / (GRID_LINES * 2)) * 100;
              return (
                <div
                  key={`v-${i}`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: `${x}%`,
                    width: 1,
                    background: 'linear-gradient(0deg, rgba(255,215,0,0.05), rgba(255,215,0,0.25))',
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Vignette overlay - uses CSS class for immediate rendering */}
      <div className="hero-vignette hero-effect-layer" style={{ zIndex: 1 }} />
    </>
  );
}
