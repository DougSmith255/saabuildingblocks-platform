'use client';

import { useContinuousAnimation } from './useContinuousAnimation';
import { useMemo, useState, useEffect } from 'react';

/**
 * Asteroid Belt Effect
 * Tumbling asteroids flowing across screen - great for content/comparison themes
 * Mobile: 35% fewer asteroids for performance
 */
export function AsteroidBeltEffect() {
  const { time, progress } = useContinuousAnimation();
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile on mount
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Desktop: 32 asteroids, Mobile: ~21 asteroids (35% reduction)
  const asteroidCount = isMobile ? 21 : 32;

  // Memoize asteroids to prevent regeneration
  const asteroids = useMemo(() => [...Array(asteroidCount)].map((_, i) => ({
    x: (i * 137.5) % 100,
    y: 48 + Math.sin(i * 0.8) * 12,
    size: 12 + (i % 5) * 8,
    speed: 0.5 + (i % 3) * 0.3,
    rotation: i * 45,
  })), [asteroidCount]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden hero-effect-layer">
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

      {/* Gradient overlay for depth - extends 100px below fold */}
      <div
        className="absolute left-0 right-0 top-0"
        style={{
          height: 'calc(100% + 100px)',
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, rgba(0,0,0,0.6) 100%)',
        }}
      />
    </div>
  );
}
