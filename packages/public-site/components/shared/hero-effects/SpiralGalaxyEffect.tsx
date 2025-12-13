'use client';

import { useContinuousAnimation } from './useContinuousAnimation';

/**
 * Spiral Galaxy Effect
 * Rotating galaxy with spiral arms - great for celebratory/achievement themes
 */
export function SpiralGalaxyEffect() {
  const { time, progress } = useContinuousAnimation();

  const arms = 4;
  const dotsPerArm = 30;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
      {/* Spiral arms */}
      {[...Array(arms)].map((_, armIndex) => (
        <div key={armIndex} className="absolute inset-0">
          {[...Array(dotsPerArm)].map((_, dotIndex) => {
            const baseAngle = (armIndex / arms) * 360 + dotIndex * 12;
            const radius = 30 + dotIndex * 12;
            const angle = baseAngle + time * 180;
            const radians = angle * Math.PI / 180;
            const x = 50 + Math.cos(radians) * radius * 0.4;
            const y = 50 + Math.sin(radians) * radius * 0.25;
            const size = 3 + (dotsPerArm - dotIndex) * 0.3;
            const opacity = 0.2 + (dotsPerArm - dotIndex) / dotsPerArm * 0.5 * progress;
            return (
              <div
                key={dotIndex}
                className="absolute rounded-full"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: size,
                  height: size,
                  background: `rgba(255,215,0,${opacity})`,
                  boxShadow: `0 0 ${size * 2}px rgba(255,215,0,${opacity * 0.5})`,
                }}
              />
            );
          })}
        </div>
      ))}

      {/* Central glow */}
      <div
        className="absolute rounded-full"
        style={{
          width: 80 + progress * 40,
          height: 80 + progress * 40,
          background: `radial-gradient(circle, rgba(255,255,255,${0.4 + progress * 0.3}) 0%, rgba(255,215,0,${0.3 + progress * 0.2}) 30%, rgba(255,180,0,${0.1 + progress * 0.1}) 60%, transparent 100%)`,
          boxShadow: `0 0 ${60 + progress * 40}px rgba(255,215,0,0.4)`,
        }}
      />

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
