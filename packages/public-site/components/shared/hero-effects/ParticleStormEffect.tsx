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
        // Brighter: base opacity 0.6, oscillates up to 0.95
        const opacity = 0.6 + Math.sin(time * Math.PI * 2 + i) * 0.35;
        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `calc(${p.x}% + ${moveX}vw)`,
              top: `calc(${p.y}% + ${moveY}vh)`,
              width: p.size,
              height: p.size,
              background: `radial-gradient(circle, rgba(255,215,0,${opacity}) 0%, rgba(255,200,0,${opacity * 0.7}) 50%, transparent 100%)`,
              boxShadow: `0 0 ${p.size * 3}px rgba(255,215,0,${opacity * 0.8}), 0 0 ${p.size * 6}px rgba(255,200,0,${opacity * 0.4})`,
            }}
          />
        );
      })}

      {/* Trail particles - brighter */}
      {[...Array(20)].map((_, i) => {
        const trailProgress = Math.max(0, progress - i * 0.02);
        return (
          <div
            key={`trail-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${50 + Math.cos(i + time * 10) * 30 * trailProgress}%`,
              top: `${50 + Math.sin(i + time * 10) * 30 * trailProgress}%`,
              width: 6,
              height: 6,
              background: `rgba(255,215,0,${0.7 * trailProgress})`,
              boxShadow: `0 0 15px rgba(255,215,0,${0.6 * trailProgress}), 0 0 30px rgba(255,200,0,${0.3 * trailProgress})`,
            }}
          />
        );
      })}
    </div>
  );
}
