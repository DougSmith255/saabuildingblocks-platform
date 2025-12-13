'use client';

import { useEffect, useState } from 'react';
import { useContinuousAnimation } from './useContinuousAnimation';

/**
 * Laser Grid Effect
 * Red crisscrossing laser beams - great for action/security themes
 *
 * Intro: Beams start at full size (1.0) and contract to 0.8 over 3 seconds
 * Idle: Beams oscillate from 0.1 to 1.0 (full range from useContinuousAnimation)
 */
export function LaserGridEffect() {
  const { time, progress } = useContinuousAnimation();
  const [introComplete, setIntroComplete] = useState(false);
  const [introProgress, setIntroProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const INTRO_DURATION = 3000; // 3 seconds

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / INTRO_DURATION, 1);
      // Ease out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - t, 3);
      setIntroProgress(eased);

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        setIntroComplete(true);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  const horizontalBeams = [...Array(6)].map((_, i) => ({
    y: 15 + i * 14,
    delay: i * 0.02,
  }));

  const verticalBeams = [...Array(8)].map((_, i) => ({
    x: 10 + i * 11,
    delay: i * 0.015,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Horizontal laser beams */}
      {horizontalBeams.map((beam, i) => {
        // During intro: staggered animation from 1.0 to 0.8
        // After intro: use full progress range (0.1 to 0.8 mapped to beam size)
        const staggeredIntro = Math.max(0, introProgress - beam.delay) / (1 - beam.delay);
        const introScale = 1 - Math.min(staggeredIntro, 1) * 0.2; // 1.0 → 0.8

        // After intro, use the full oscillating progress value
        const scale = introComplete ? progress : introScale;

        const width = scale * 100;
        const leftOffset = (100 - width) / 2;

        return (
          <div
            key={`h-${i}`}
            className="absolute"
            style={{
              left: `${leftOffset}%`,
              top: `${beam.y}%`,
              width: `${width}%`,
              height: 2,
              background: `linear-gradient(90deg, rgba(255,100,100,0.9), rgba(255,50,50,0.8), rgba(255,100,100,0.9))`,
              boxShadow: `0 0 10px rgba(255,50,50,0.6), 0 0 30px rgba(255,50,50,0.3)`,
            }}
          />
        );
      })}

      {/* Vertical laser beams */}
      {verticalBeams.map((beam, i) => {
        const staggeredIntro = Math.max(0, introProgress - beam.delay) / (1 - beam.delay);
        const introScale = 1 - Math.min(staggeredIntro, 1) * 0.2;
        const scale = introComplete ? progress : introScale;

        const height = scale * 100;
        const topOffset = (100 - height) / 2;

        return (
          <div
            key={`v-${i}`}
            className="absolute"
            style={{
              left: `${beam.x}%`,
              top: `${topOffset}%`,
              width: 2,
              height: `${height}%`,
              background: `linear-gradient(180deg, rgba(255,100,100,0.9), rgba(255,50,50,0.8), rgba(255,100,100,0.9))`,
              boxShadow: `0 0 10px rgba(255,50,50,0.6), 0 0 30px rgba(255,50,50,0.3)`,
            }}
          />
        );
      })}

      {/* Intersection sparks */}
      {horizontalBeams.map((hBeam, hi) =>
        verticalBeams.map((vBeam, vi) => {
          const pulse = Math.sin(time * 20 + hi + vi);

          return (
            <div
              key={`spark-${hi}-${vi}`}
              className="absolute rounded-full"
              style={{
                left: `${vBeam.x}%`,
                top: `${hBeam.y}%`,
                width: 6 + pulse * 2,
                height: 6 + pulse * 2,
                transform: 'translate(-50%, -50%)',
                background: `rgba(255,255,255,0.8)`,
                boxShadow: `0 0 15px rgba(255,100,100,0.8), 0 0 30px rgba(255,50,50,0.5)`,
              }}
            />
          );
        })
      )}

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
