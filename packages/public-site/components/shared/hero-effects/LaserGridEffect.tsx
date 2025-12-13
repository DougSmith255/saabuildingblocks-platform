'use client';

import { useEffect, useState } from 'react';
import { useContinuousAnimation } from './useContinuousAnimation';

/**
 * Laser Grid Effect
 * Red crisscrossing laser beams - great for action/security themes
 *
 * Intro: Beams start at full size (1.0) and contract to 0.7 over 3 seconds
 * Idle: Beams oscillate slightly around the 0.7 state
 */
export function LaserGridEffect() {
  const { time, progress } = useContinuousAnimation();
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
      }
    };

    requestAnimationFrame(animate);
  }, []);

  // Intro: animate from 1.0 to 0.7 (so beamScale goes 1.0 → 0.7)
  // After intro, add subtle oscillation from the continuous animation
  const introScale = 1 - introProgress * 0.3; // 1.0 → 0.7
  const oscillation = introProgress >= 1 ? (progress - 0.5) * 0.1 : 0; // Small oscillation after intro
  const beamScale = introScale + oscillation;

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
        // Stagger the intro per beam
        const staggeredIntro = Math.max(0, introProgress - beam.delay) / (1 - beam.delay);
        const beamIntroScale = 1 - Math.min(staggeredIntro, 1) * 0.3;
        const beamOscillation = staggeredIntro >= 1 ? (progress - 0.5) * 0.1 : 0;
        const scale = beamIntroScale + beamOscillation;

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
        const beamIntroScale = 1 - Math.min(staggeredIntro, 1) * 0.3;
        const beamOscillation = staggeredIntro >= 1 ? (progress - 0.5) * 0.1 : 0;
        const scale = beamIntroScale + beamOscillation;

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
    </div>
  );
}
