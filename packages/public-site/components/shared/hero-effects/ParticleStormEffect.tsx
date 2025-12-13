'use client';

import { useContinuousAnimation } from './useContinuousAnimation';
import { useMemo } from 'react';

/**
 * Particle Storm Effect
 * Scattered golden particles - great for gift/download themes
 */
export function ParticleStormEffect() {
  const { time, progress } = useContinuousAnimation();

  // Memoize particles to prevent regeneration on each render
  const particles = useMemo(() => [...Array(60)].map((_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 3 + Math.random() * 8,
    speed: 0.5 + Math.random() * 1.5,
    angle: Math.random() * 360,
  })), []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Main particles */}
      {particles.map((p, i) => {
        const moveX = Math.cos(p.angle * Math.PI / 180) * progress * 50;
        const moveY = Math.sin(p.angle * Math.PI / 180) * progress * 50;
        const opacity = 0.3 + Math.sin(time * Math.PI * 2 + i) * 0.3;
        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `calc(${p.x}% + ${moveX}vw)`,
              top: `calc(${p.y}% + ${moveY}vh)`,
              width: p.size,
              height: p.size,
              background: `radial-gradient(circle, rgba(255,215,0,${opacity}) 0%, rgba(255,180,0,${opacity * 0.5}) 50%, transparent 100%)`,
              boxShadow: `0 0 ${p.size * 2}px rgba(255,215,0,${opacity * 0.5})`,
            }}
          />
        );
      })}

      {/* Trail particles */}
      {[...Array(20)].map((_, i) => {
        const trailProgress = Math.max(0, progress - i * 0.02);
        return (
          <div
            key={`trail-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${50 + Math.cos(i + time * 10) * 30 * trailProgress}%`,
              top: `${50 + Math.sin(i + time * 10) * 30 * trailProgress}%`,
              width: 4,
              height: 4,
              background: `rgba(255,215,0,${0.4 * trailProgress})`,
              boxShadow: `0 0 10px rgba(255,215,0,${0.3 * trailProgress})`,
            }}
          />
        );
      })}
    </div>
  );
}
