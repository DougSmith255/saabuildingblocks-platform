'use client';

import SlotCounter from 'react-slot-counter';
import { useState, useEffect } from 'react';

/**
 * Client-side animations for homepage
 * - SlotCounter animation loop
 * - Hydration state management
 */
export function HomepageClient() {
  // Counter animation loop state
  const [counterValue, setCounterValue] = useState("0000");
  const [startValue, setStartValue] = useState("0000");
  const [isHydrated, setIsHydrated] = useState(false);

  // Wait for hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // Initial animation from 0000 to 3700
    const firstTimeout = setTimeout(() => {
      setCounterValue("3700");
    }, 100);

    // Loop: hold at 3700 for 3s, then reset instantly to 0000 and animate to 3700
    const interval = setInterval(() => {
      // Instant reset to 0000 (no animation)
      setStartValue("0000");
      setCounterValue("0000");

      // After a tiny delay, animate to 3700
      setTimeout(() => {
        setStartValue("0000");
        setCounterValue("3700");
      }, 50);
    }, 5000); // 2s animation + 3s hold at 3700

    return () => {
      clearTimeout(firstTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {/* Agent Counter - Top Right on desktop, Centered on mobile */}
      <div
        className="agent-counter-wrapper absolute z-50 left-1/2 -translate-x-1/2 xlg:left-auto xlg:translate-x-0 xlg:right-8"
        style={{
          top: '120px',
        }}
      >
        <div
          className="flex items-center"
          style={{
            fontFamily: 'var(--font-synonym)',
            fontWeight: 100,
            color: 'var(--color-body-text)',
            gap: 'clamp(0.5rem, 0.75rem, 1rem)',
          }}
        >
          {/* SlotCounter Numbers - 50px on mobile, 80px on desktop (2/3 of original 120px) */}
          <div
            className="counter-numbers"
            style={{
              fontSize: '80px',
              fontFamily: 'var(--font-amulya)',
              maskImage: 'linear-gradient(to bottom, transparent 5%, rgba(0,0,0,0.2) 25%, rgba(0,0,0,0.5) 35%, black 45%, black 60%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0.3) 85%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 5%, rgba(0,0,0,0.2) 25%, rgba(0,0,0,0.5) 35%, black 45%, black 60%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0.3) 85%, transparent 100%)',
            }}
          >
            <SlotCounter
              value={counterValue}
              startValue={startValue}
              autoAnimationStart
              duration={2.5}
              {...({
                dummyCharacterCount: 15,
                hasInfiniteList: true,
                startFromLastDigit: true,
                animateUnchanged: true,
                direction: "bottom-up"
              } as any)}
            />
          </div>
          {/* + Symbol - 1.5x on mobile (45px), 3x on desktop (90px) */}
          <span className="counter-plus" style={{ fontSize: '90px' }}>+</span>
          {/* AGENTS Text - 1.5x on mobile (45px), 3x on desktop (90px) */}
          <span className="counter-text" style={{ fontSize: '90px' }}>AGENTS</span>
        </div>
      </div>

    </>
  );
}
