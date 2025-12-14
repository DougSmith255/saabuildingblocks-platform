'use client';

import { useContinuousAnimation } from './useContinuousAnimation';

/**
 * Laser Grid Effect
 * Red crisscrossing laser beams - great for action/security themes
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
    <div className="absolute inset-0 pointer-events-none overflow-hidden hero-effect-layer">
      {/* Horizontal laser beams */}
      {horizontalBeams.map((beam, i) => {
        const beamProgress = Math.max(0, Math.min(1, (progress - beam.delay) * beam.speed * 1.2));
        const width = Math.max(0, 100 - beamProgress * 120);
        const leftOffset = (100 - width) / 2;
        const opacity = width > 5 ? 1 : width / 5;

        return width > 0 ? (
          <div
            key={`h-${i}`}
            className="absolute"
            style={{
              left: `${leftOffset}%`,
              top: `${beam.y}%`,
              width: `${width}%`,
              height: 2,
              background: `linear-gradient(90deg, rgba(255,100,100,${0.9 * opacity}), rgba(255,50,50,${0.8 * opacity}), rgba(255,100,100,${0.9 * opacity}))`,
              boxShadow: `0 0 10px rgba(255,50,50,${0.6 * opacity}), 0 0 30px rgba(255,50,50,${0.3 * opacity})`,
            }}
          />
        ) : null;
      })}

      {/* Vertical laser beams */}
      {verticalBeams.map((beam, i) => {
        const beamProgress = Math.max(0, Math.min(1, (progress - beam.delay) * beam.speed * 1.2));
        const height = Math.max(0, 100 - beamProgress * 120);
        const topOffset = (100 - height) / 2;
        const opacity = height > 5 ? 1 : height / 5;

        return height > 0 ? (
          <div
            key={`v-${i}`}
            className="absolute"
            style={{
              left: `${beam.x}%`,
              top: `${topOffset}%`,
              width: 2,
              height: `${height}%`,
              background: `linear-gradient(180deg, rgba(255,100,100,${0.9 * opacity}), rgba(255,50,50,${0.8 * opacity}), rgba(255,100,100,${0.9 * opacity}))`,
              boxShadow: `0 0 10px rgba(255,50,50,${0.6 * opacity}), 0 0 30px rgba(255,50,50,${0.3 * opacity})`,
            }}
          />
        ) : null;
      })}

      {/* Intersection sparks */}
      {horizontalBeams.map((hBeam, hi) =>
        verticalBeams.map((vBeam, vi) => {
          const hProgress = Math.max(0, Math.min(1, (progress - hBeam.delay) * hBeam.speed * 1.2));
          const vProgress = Math.max(0, Math.min(1, (progress - vBeam.delay) * vBeam.speed * 1.2));
          const hWidth = Math.max(0, 100 - hProgress * 120);
          const vHeight = Math.max(0, 100 - vProgress * 120);
          const hLeft = (100 - hWidth) / 2;
          const hRight = hLeft + hWidth;
          const vTop = (100 - vHeight) / 2;
          const vBottom = vTop + vHeight;

          const beamX = vBeam.x;
          const beamY = hBeam.y;
          const sparkVisible = beamX > hLeft && beamX < hRight && beamY > vTop && beamY < vBottom;

          const pulse = Math.sin(time * 20 + hi + vi);
          const sparkOpacity = sparkVisible ? 0.8 : 0;

          return sparkVisible ? (
            <div
              key={`spark-${hi}-${vi}`}
              className="absolute rounded-full"
              style={{
                left: `${beamX}%`,
                top: `${beamY}%`,
                width: 6 + pulse * 2,
                height: 6 + pulse * 2,
                transform: 'translate(-50%, -50%)',
                background: `rgba(255,255,255,${sparkOpacity})`,
                boxShadow: `0 0 15px rgba(255,100,100,${sparkOpacity}), 0 0 30px rgba(255,50,50,${sparkOpacity * 0.6})`,
              }}
            />
          ) : null;
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
