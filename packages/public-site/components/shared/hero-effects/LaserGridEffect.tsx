'use client';

import { useContinuousAnimation } from './useContinuousAnimation';

/**
 * Laser Grid Effect (CLS-Optimized)
 * Red crisscrossing laser beams - great for action/security themes
 *
 * Uses CSS transforms instead of layout properties to prevent CLS:
 * - scaleX/scaleY instead of width/height
 * - All beams render at full size, transforms handle visual scaling
 */
export function LaserGridEffect() {
  const { time, progress } = useContinuousAnimation();

  const horizontalBeams = [...Array(6)].map((_, i) => ({
    y: 15 + i * 14,
    delay: i * 0.05,
    speed: 0.8 + (i % 3) * 0.2,
  }));

  const verticalBeams = [...Array(8)].map((_, i) => ({
    x: 10 + i * 11,
    delay: i * 0.04,
    speed: 0.7 + (i % 2) * 0.3,
  }));

  return (
    <>
      {/* Animation container - has overflow-hidden for performance */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden hero-effect-layer">
        {/* Horizontal laser beams - grow from 0 to full (reversed animation) */}
        {horizontalBeams.map((beam, i) => {
          const beamProgress = Math.max(0, Math.min(1, (progress - beam.delay) * beam.speed * 1.2));
          // Reversed: beams grow from 0 to 1 instead of shrinking
          // Minimum scale of 0.3 ensures beams never disappear completely
          const scale = Math.max(0.3, Math.min(1, beamProgress * 1.2));
          const opacity = 1; // Always fully visible since we have minimum scale

          return (
            <div
              key={`h-${i}`}
              className="absolute"
              style={{
                left: 0,
                right: 0,
                top: `${beam.y}%`,
                height: 2,
                transform: `scaleX(${scale})`,
                opacity: opacity,
                background: `linear-gradient(90deg, rgba(255,100,100,0.9), rgba(255,50,50,0.8), rgba(255,100,100,0.9))`,
                boxShadow: `0 0 10px rgba(255,50,50,0.6), 0 0 30px rgba(255,50,50,0.3)`,
              }}
            />
          );
        })}

        {/* Vertical laser beams - grow from 0 to full (reversed animation) */}
        {verticalBeams.map((beam, i) => {
          const beamProgress = Math.max(0, Math.min(1, (progress - beam.delay) * beam.speed * 1.2));
          // Reversed: beams grow from 0 to 1 instead of shrinking
          // Minimum scale of 0.3 ensures beams never disappear completely
          const scale = Math.max(0.3, Math.min(1, beamProgress * 1.2));
          const opacity = 1; // Always fully visible since we have minimum scale

          return (
            <div
              key={`v-${i}`}
              className="absolute"
              style={{
                left: `${beam.x}%`,
                top: 0,
                bottom: 0,
                width: 2,
                transform: `scaleY(${scale})`,
                opacity: opacity,
                background: `linear-gradient(180deg, rgba(255,100,100,0.9), rgba(255,50,50,0.8), rgba(255,100,100,0.9))`,
                boxShadow: `0 0 10px rgba(255,50,50,0.6), 0 0 30px rgba(255,50,50,0.3)`,
              }}
            />
          );
        })}

        {/* Intersection sparks - appear when beams reach intersection */}
        {horizontalBeams.map((hBeam, hi) =>
          verticalBeams.map((vBeam, vi) => {
            const hProgress = Math.max(0, Math.min(1, (progress - hBeam.delay) * hBeam.speed * 1.2));
            const vProgress = Math.max(0, Math.min(1, (progress - vBeam.delay) * vBeam.speed * 1.2));
            // Reversed: scales grow from 0 to 1, with minimum of 0.3
            const hScale = Math.max(0.3, Math.min(1, hProgress * 1.2));
            const vScale = Math.max(0.3, Math.min(1, vProgress * 1.2));

            // Spark is visible when both beams reach this intersection
            // Horizontal beam extends from center, check if it reaches this x position
            const hReachesX = (vBeam.x >= 50 - hScale * 50) && (vBeam.x <= 50 + hScale * 50);
            // Vertical beam extends from center, check if it reaches this y position
            const vReachesY = (hBeam.y >= 50 - vScale * 50) && (hBeam.y <= 50 + vScale * 50);
            const sparkVisible = hReachesX && vReachesY && hScale > 0 && vScale > 0;

            const pulse = Math.sin(time * 20 + hi + vi);
            const sparkScale = 1 + pulse * 0.33; // Scale from ~0.67 to ~1.33 (equivalent to 6px +/- 2px)

            return (
              <div
                key={`spark-${hi}-${vi}`}
                className="absolute rounded-full"
                style={{
                  left: `${vBeam.x}%`,
                  top: `${hBeam.y}%`,
                  width: 6,
                  height: 6,
                  transform: `translate(-50%, -50%) scale(${sparkVisible ? sparkScale : 0})`,
                  opacity: sparkVisible ? 0.8 : 0,
                  background: 'rgba(255,255,255,1)',
                  boxShadow: '0 0 15px rgba(255,100,100,0.8), 0 0 30px rgba(255,50,50,0.48)',
                }}
              />
            );
          })
        )}
      </div>

      {/* Vignette overlay - outside overflow-hidden to extend below fold */}
      <div
        className="absolute left-0 right-0 top-0 pointer-events-none hero-effect-layer"
        style={{
          height: 'calc(100% + 100px)',
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, rgba(0,0,0,0.6) 100%)',
          zIndex: 1,
        }}
      />
    </>
  );
}
