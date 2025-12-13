'use client';

import { useContinuousAnimation } from './useContinuousAnimation';
import { useMemo } from 'react';

/**
 * Data Stream Effect (Green Matrix Rain)
 * Digital rain effect - great for tech/cloud themes
 *
 * This is the shared version used across pages.
 * Same as login page DataStreamEffect.
 */
export function DataStreamEffect() {
  const { time, progress } = useContinuousAnimation();

  // Memoize column positions (but not chars - those change with time)
  const columnConfigs = useMemo(() => [...Array(20)].map((_, i) => ({
    x: i * 5,
    speed: 0.5 + (i % 4) * 0.3,
    length: 5 + (i % 6),
    delay: (i * 0.02) % 0.4,
  })), []);

  // Generate characters that change over time based on position and time
  const getChar = (colIndex: number, charIndex: number) => {
    // Use time to make characters flip periodically
    const flipRate = 0.5 + (colIndex % 3) * 0.3; // Different flip rates per column
    const charSeed = Math.floor(time * 10 * flipRate + colIndex * 7 + charIndex * 13);
    return String.fromCharCode(0x30A0 + (charSeed % 96));
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden animate-fade-in-effect" lang="en" translate="no">
      {/* Green data columns */}
      {columnConfigs.map((col, i) => {
        const colProgress = Math.max(0, (progress - col.delay) * col.speed * 2);
        const yOffset = colProgress * 100;
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
              const charY = ((j * 5 + yOffset) % 105);
              const isHead = j === Math.floor(colProgress * numChars) % numChars;
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
                  {getChar(i, j)}
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Gradient overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, rgba(0,0,0,0.6) 100%)',
        }}
      />
    </div>
  );
}
