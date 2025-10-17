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
        className="absolute z-50 left-1/2 -translate-x-1/2 xlg:left-auto xlg:translate-x-0 xlg:right-8"
        style={{
          top: '120px',
        }}
      >
        <div
          className="flex items-center gap-3"
          style={{
            fontFamily: 'var(--font-synonym)',
            fontWeight: 100,
            color: 'var(--color-body-text)',
          }}
        >
          {/* SlotCounter Numbers (LARGEST) */}
          <div
            style={{
              fontSize: '4.01rem',
              maskImage: 'linear-gradient(to bottom, transparent 5%, rgba(0,0,0,0.2) 25%, rgba(0,0,0,0.5) 35%, black 45%, black 60%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0.3) 85%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 5%, rgba(0,0,0,0.2) 25%, rgba(0,0,0,0.5) 35%, black 45%, black 60%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0.3) 85%, transparent 100%)',
            }}
          >
            <SlotCounter
              value={counterValue}
              startValue={startValue}
              autoAnimationStart
              duration={2.5}
              speed={1.6}
              dummyCharacterCount={15}
              hasInfiniteList={true}
              delay={0.12}
              startFromLastDigit={true}
              animateUnchanged={true}
              direction="bottom-up"
            />
          </div>
          {/* + Symbol (MEDIUM) */}
          <span style={{ fontSize: '2.88rem' }}>+</span>
          {/* AGENTS Text (SMALLEST) */}
          <span style={{ fontSize: '1.8rem' }}>AGENTS</span>
        </div>
      </div>

      {/* CSS Animations - 3D Neon Sign Effect */}
      <style jsx>{`
        /* Flicker effect based on texteffects.dev technique */
        @keyframes neonFlicker1 {
          0%, 19.9%, 22%, 62.9%, 64%, 64.9%, 70%, 100% {
            color: #ffd700;
            opacity: 0.99;
            text-shadow:
              -1px -1px 0 rgba(255,255,255, 0.4),
              1px -1px 0 rgba(255,255,255, 0.4),
              -1px 1px 0 rgba(255,255,255, 0.4),
              1px 1px 0 rgba(255,255,255, 0.4),
              0 -2px 8px #ffd700,
              0 0 2px #ffd700,
              0 0 5px #ffd700,
              0 0 15px #ffb347,
              0 0 2px #ffd700,
              0 2px 3px #000;
          }
          20%, 21.9%, 63%, 63.9%, 65%, 69.9% {
            color: rgba(45,45,45,1);
            opacity: 0.4;
            text-shadow: none;
          }
        }

        @keyframes neonFlicker2 {
          0%, 19.9%, 22%, 62.9%, 64%, 64.9%, 70%, 100% {
            color: #ffd700;
            opacity: 0.99;
            text-shadow:
              -1px -1px 0 rgba(255,255,255, 0.4),
              1px -1px 0 rgba(255,255,255, 0.4),
              -1px 1px 0 rgba(255,255,255, 0.4),
              1px 1px 0 rgba(255,255,255, 0.4),
              0 -2px 8px #ffd700,
              0 0 2px #ffd700,
              0 0 5px #ffd700,
              0 0 15px #ffb347,
              0 0 2px #ffd700,
              0 2px 3px #000;
          }
          20%, 21.9%, 63%, 63.9%, 65%, 69.9% {
            color: rgba(45,45,45,1);
            opacity: 0.4;
            text-shadow: none;
          }
        }

        @keyframes neonFlicker3 {
          0%, 19.9%, 22%, 62.9%, 64%, 64.9%, 70%, 100% {
            color: #ffd700;
            opacity: 0.99;
            text-shadow:
              -1px -1px 0 rgba(255,255,255, 0.4),
              1px -1px 0 rgba(255,255,255, 0.4),
              -1px 1px 0 rgba(255,255,255, 0.4),
              1px 1px 0 rgba(255,255,255, 0.4),
              0 -2px 8px #ffd700,
              0 0 2px #ffd700,
              0 0 5px #ffd700,
              0 0 15px #ffb347,
              0 0 2px #ffd700,
              0 2px 3px #000;
          }
          20%, 21.9%, 63%, 63.9%, 65%, 69.9% {
            color: rgba(45,45,45,1);
            opacity: 0.4;
            text-shadow: none;
          }
        }

        /* 3D Neon Character Structure */
        :global(.neon-char) {
          position: relative;
          display: inline-block;
          transform-style: preserve-3d;
        }

        /* Metal backing plate - SOLID 3D metal casing with chrome finish */
        :global(.neon-char::before) {
          content: attr(data-char);
          position: absolute;
          top: 2px;
          left: 2px;
          width: 100%;
          height: 100%;
          background: linear-gradient(145deg,
            #5a5240 0%,
            #4a4238 15%,
            #3a3228 35%,
            #2a2218 50%,
            #3a3228 65%,
            #4a4238 85%,
            #5a5240 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          z-index: -2;
          transform: translateZ(-25px);
          opacity: 1.0;
          text-shadow:
            1px 1px 0 #2a2a2a,
            2px 2px 0 #1a1a1a,
            3px 3px 0 #0f0f0f,
            4px 4px 0 #0a0a0a,
            5px 5px 0 #050505,
            -1px -1px 0 #4a4a4a,
            -1px 0 0 #3a3a3a,
            0 -1px 0 #3a3a3a,
            6px 6px 12px rgba(0,0,0,0.9),
            8px 8px 20px rgba(0,0,0,0.8),
            10px 10px 30px rgba(0,0,0,0.6);
          filter: contrast(1.1) brightness(1.05);
          pointer-events: none;
        }

        /* Main letter - dark gray (backlit look) */
        :global(.neon-char) {
          color: rgba(45,45,45,1);
          text-shadow:
            1px 1px 0 #1a1a1a,
            2px 2px 0 #0f0f0f,
            3px 3px 0 #0a0a0a,
            4px 4px 0 #050505,
            5px 5px 12px rgba(0, 0, 0, 0.8);
        }
      `}</style>
    </>
  );
}
