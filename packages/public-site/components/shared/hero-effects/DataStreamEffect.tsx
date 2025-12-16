'use client';

import { useEffect, useRef, useState, useMemo } from 'react';

/**
 * Data Stream Effect (Green Matrix Rain)
 * Digital rain effect - great for tech/cloud themes
 *
 * Animation: Seamless infinite loop - rain continuously falls down.
 * Each character wraps around from bottom to top using modulo math,
 * so there's never a visible jump or reset.
 *
 * This is the shared version used across pages.
 * Same as login page DataStreamEffect.
 */
export function DataStreamEffect() {
  const [time, setTime] = useState(0);
  const timeRef = useRef(0);
  const rafRef = useRef<number>(0);
  const lastScrollY = useRef(0);
  const scrollBoostRef = useRef(0);

  useEffect(() => {
    // Speed settings
    const IDLE_SPEED = 0.0002; // Base speed for rain fall
    const SCROLL_BOOST_MAX = 0.0005;
    const SCROLL_BOOST_MULTIPLIER = 0.000028;
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

      // Continuously increment time (never resets - modulo handles wrapping)
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

  // Memoize column configurations
  const columnConfigs = useMemo(() => [...Array(20)].map((_, i) => ({
    x: i * 5,
    speed: 0.8 + (i % 4) * 0.4, // Different speeds per column
    offset: (i * 17) % 100, // Stagger starting positions
  })), []);

  // Generate characters that change over time based on position and time
  const getChar = (colIndex: number, charIndex: number) => {
    // Use time to make characters flip periodically
    const flipRate = 0.5 + (colIndex % 3) * 0.3;
    const charSeed = Math.floor(time * 10 * flipRate + colIndex * 7 + charIndex * 13);
    return String.fromCharCode(0x30A0 + (charSeed % 96));
  };

  return (
    <>
      {/* Animation container - has overflow-hidden for performance */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden hero-effect-layer" lang="en" translate="no">
        {/* Green data columns */}
        {columnConfigs.map((col, i) => {
          // Each column moves at its own speed, offset creates stagger
          // Modulo 110 ensures seamless wrap (slightly > 100 for overlap)
          const columnOffset = (time * col.speed * 50 + col.offset) % 110;
          const numChars = 22;

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
              {[...Array(numChars)].map((_, j) => {
                // Each character's Y position wraps seamlessly
                // Characters are evenly spaced, offset by column movement
                const baseY = j * 5; // 5% spacing between chars
                const charY = (baseY + columnOffset) % 110 - 10; // -10 to 100 range

                // "Head" of the rain trail (brightest character)
                const headPosition = (columnOffset / 5) % numChars;
                const distanceFromHead = (j - headPosition + numChars) % numChars;
                const isHead = distanceFromHead === 0;

                // Trail fades based on distance from head
                const trailBrightness = isHead ? 1 : Math.max(0, 1 - distanceFromHead * 0.08);

                // Fade at edges for smooth appearance/disappearance
                const edgeFade = charY < 0 ? Math.max(0, (charY + 10) / 10) :
                                 charY > 90 ? Math.max(0, (100 - charY) / 10) : 1;

                return (
                  <div
                    key={j}
                    style={{
                      position: 'absolute',
                      top: `${charY}%`,
                      color: isHead
                        ? `rgba(255,255,255,${0.95 * edgeFade})`
                        : `rgba(100,255,100,${trailBrightness * 0.7 * edgeFade})`,
                      textShadow: isHead
                        ? `0 0 15px rgba(100,255,100,${0.8 * edgeFade})`
                        : `0 0 5px rgba(100,255,100,${trailBrightness * 0.3 * edgeFade})`,
                      opacity: edgeFade,
                    }}
                  >
                    {getChar(i, j)}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Vignette overlay - uses CSS class for immediate rendering */}
      <div className="hero-vignette hero-effect-layer" style={{ zIndex: 1 }} />
    </>
  );
}
