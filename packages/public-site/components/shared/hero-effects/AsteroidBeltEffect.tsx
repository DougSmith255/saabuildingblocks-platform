'use client';

import { useContinuousAnimation } from './useContinuousAnimation';
import { useMemo } from 'react';

/**
 * Asteroid Belt Effect
 * Tumbling asteroids flowing across screen - great for content/comparison themes
 */
export function AsteroidBeltEffect() {
  const { time, progress } = useContinuousAnimation();

  // Memoize asteroids to prevent regeneration
  const asteroids = useMemo(() => [...Array(32)].map((_, i) => ({
    x: (i * 137.5) % 100,
    y: 48 + Math.sin(i * 0.8) * 12,
    size: 12 + (i % 5) * 8,
    speed: 0.5 + (i % 3) * 0.3,
    rotation: i * 45,
  })), []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          transform: 'rotate(-12deg) scale(1.1)',
          transformOrigin: 'center center',
        }}
      >
        {asteroids.map((asteroid, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${(asteroid.x + time * 100 * asteroid.speed) % 120 - 10}%`,
              top: `${asteroid.y + Math.sin(time * Math.PI * 2 + i) * 4}%`,
              width: asteroid.size,
              height: asteroid.size * 0.7,
              background: `linear-gradient(135deg, rgba(120,110,100,0.8) 0%, rgba(60,55,50,0.9) 100%)`,
              borderRadius: '30% 70% 50% 50%',
              transform: `rotate(${asteroid.rotation + time * 180}deg)`,
              boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.5), 1px 1px 2px rgba(255,255,255,0.1)',
            }}
          />
        ))}
      </div>

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
