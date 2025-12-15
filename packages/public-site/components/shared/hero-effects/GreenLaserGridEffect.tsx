'use client';

import { useContinuousAnimation } from './useContinuousAnimation';

/**
 * Green Laser Grid Effect (CLS-Optimized)
 * Neon green crisscrossing laser beams - uses brand green (#00ff88)
 *
 * Uses CSS transforms instead of layout properties to prevent CLS:
 * - scaleX/scaleY instead of width/height
 * - All beams render at full size, transforms handle visual scaling
 * - Beams grow outward from 15% to 100%
 */
export function GreenLaserGridEffect() {
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
        {/* Horizontal laser beams - grow from 15% to 100% using scaleX */}
        {horizontalBeams.map((beam, i) => {
          const beamProgress = Math.max(0, Math.min(1, (progress - beam.delay) * beam.speed * 1.2));
          // Beams grow from 0.15 to 1.0 (15% to 100%)
          const scale = Math.max(0.15, Math.min(1, beamProgress * 1.2));

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
                opacity: 1,
                background: `linear-gradient(90deg, rgba(0,255,136,0.9), rgba(0,200,100,0.8), rgba(0,255,136,0.9))`,
                boxShadow: `0 0 10px rgba(0,255,136,0.6), 0 0 30px rgba(0,255,136,0.3)`,
              }}
            />
          );
        })}

        {/* Vertical laser beams - grow from 15% to 100% using scaleY */}
        {verticalBeams.map((beam, i) => {
          const beamProgress = Math.max(0, Math.min(1, (progress - beam.delay) * beam.speed * 1.2));
          // Beams grow from 0.15 to 1.0 (15% to 100%)
          const scale = Math.max(0.15, Math.min(1, beamProgress * 1.2));

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
                opacity: 1,
                background: `linear-gradient(180deg, rgba(0,255,136,0.9), rgba(0,200,100,0.8), rgba(0,255,136,0.9))`,
                boxShadow: `0 0 10px rgba(0,255,136,0.6), 0 0 30px rgba(0,255,136,0.3)`,
              }}
            />
          );
        })}

        {/* Intersection sparks - appear when beams reach intersection */}
        {horizontalBeams.map((hBeam, hi) =>
          verticalBeams.map((vBeam, vi) => {
            const hProgress = Math.max(0, Math.min(1, (progress - hBeam.delay) * hBeam.speed * 1.2));
            const vProgress = Math.max(0, Math.min(1, (progress - vBeam.delay) * vBeam.speed * 1.2));
            const hScale = Math.max(0.15, Math.min(1, hProgress * 1.2));
            const vScale = Math.max(0.15, Math.min(1, vProgress * 1.2));

            // Spark is visible when both beams reach this intersection
            const hReachesX = (vBeam.x >= 50 - hScale * 50) && (vBeam.x <= 50 + hScale * 50);
            const vReachesY = (hBeam.y >= 50 - vScale * 50) && (hBeam.y <= 50 + vScale * 50);
            const sparkVisible = hReachesX && vReachesY && hScale > 0 && vScale > 0;

            const pulse = Math.sin(time * 20 + hi + vi);
            const sparkScale = 1 + pulse * 0.33;

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
                  boxShadow: '0 0 15px rgba(0,255,136,0.8), 0 0 30px rgba(0,255,136,0.48)',
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
