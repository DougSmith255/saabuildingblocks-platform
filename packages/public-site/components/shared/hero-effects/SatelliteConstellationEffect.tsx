'use client';

import { useContinuousAnimation } from './useContinuousAnimation';

/**
 * Satellite Constellation Effect
 * Earth with orbiting satellites - great for global/tech themes
 */
export function SatelliteConstellationEffect() {
  const { time, progress } = useContinuousAnimation();

  const orbits = [
    { satellites: 4, radius: 35, speed: 1, tilt: 20 },
    { satellites: 3, radius: 25, speed: -0.7, tilt: -15 },
    { satellites: 4, radius: 45, speed: 0.5, tilt: 10 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden hero-effect-layer">
      {/* Subtle blue radiating gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 50%,
            rgba(40,80,140,0.12) 0%,
            rgba(30,60,120,0.06) 40%,
            transparent 70%)`,
        }}
      />

      {/* CSS Earth with realistic continents */}
      <div
        className="absolute rounded-full overflow-hidden"
        style={{
          left: '50%',
          top: '50%',
          width: 180,
          height: 180,
          transform: 'translate(-50%, -50%)',
          background: 'rgb(2, 166, 207)',
          boxShadow: `
            inset -16px 20px 40px rgba(0,0,0,0.2),
            0 0 60px rgba(100,150,255,0.4)
          `,
        }}
      >
        {/* Land mass 1 */}
        <div
          style={{
            position: 'absolute',
            top: '8%',
            left: '18%',
            width: '50%',
            height: '38%',
            background: 'rgb(28, 144, 28)',
            clipPath: 'polygon(30% 28%, 32% 26%, 37% 25%, 42% 25%, 47% 30%, 52% 38%, 55% 45%, 55% 55%, 50% 60%, 42% 58%, 35% 52%, 28% 45%, 25% 38%, 27% 32%)',
          }}
        />
        {/* Land mass 2 */}
        <div
          style={{
            position: 'absolute',
            top: '45%',
            left: '10%',
            width: '45%',
            height: '45%',
            background: 'rgb(28, 144, 28)',
            clipPath: 'polygon(35% 20%, 50% 25%, 58% 38%, 55% 55%, 48% 70%, 35% 72%, 25% 60%, 22% 45%, 28% 30%)',
          }}
        />
        {/* Land mass 3 */}
        <div
          style={{
            position: 'absolute',
            top: '12%',
            right: '8%',
            width: '40%',
            height: '55%',
            background: 'rgb(28, 144, 28)',
            clipPath: 'polygon(20% 15%, 45% 18%, 60% 30%, 55% 50%, 48% 70%, 30% 75%, 15% 60%, 12% 40%, 18% 25%)',
          }}
        />
        {/* Shadow overlay for 3D depth */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            boxShadow: 'inset -16px 20px 40px rgba(0,0,0,0.2)',
          }}
        />
      </div>

      {/* Orbits and satellites */}
      {orbits.map((orbit, orbitIndex) => (
        <div key={orbitIndex} className="absolute inset-0">
          {/* Orbit ring */}
          <div
            className="absolute rounded-full border"
            style={{
              left: '50%',
              top: '50%',
              width: `${orbit.radius * 2}%`,
              height: `${orbit.radius * 1.2}%`,
              transform: `translate(-50%, -50%) rotateX(60deg) rotateZ(${orbit.tilt}deg)`,
              borderColor: 'rgba(255,215,0,0.1)',
              borderWidth: 1,
            }}
          />

          {/* Satellites */}
          {[...Array(orbit.satellites)].map((_, satIndex) => {
            const baseAngle = (satIndex / orbit.satellites) * 360;
            const angle = baseAngle + time * 360 * orbit.speed;
            const radians = angle * Math.PI / 180;
            const x = 50 + Math.cos(radians) * orbit.radius;
            const y = 50 + Math.sin(radians) * orbit.radius * 0.6;
            const scale = 0.6 + (Math.sin(radians) + 1) * 0.2;

            return (
              <div
                key={satIndex}
                className="absolute"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: `translate(-50%, -50%) scale(${scale})`,
                  zIndex: Math.sin(radians) > 0 ? 10 : 5,
                }}
              >
                <div style={{ width: 12, height: 8, background: 'linear-gradient(180deg, rgba(200,200,200,0.9), rgba(150,150,150,0.8))', borderRadius: 2 }} />
                <div style={{ position: 'absolute', top: '50%', left: -15, transform: 'translateY(-50%)', width: 15, height: 20, background: 'linear-gradient(90deg, rgba(50,80,150,0.8), rgba(80,120,200,0.7))', borderRadius: 1 }} />
                <div style={{ position: 'absolute', top: '50%', right: -15, transform: 'translateY(-50%)', width: 15, height: 20, background: 'linear-gradient(90deg, rgba(80,120,200,0.7), rgba(50,80,150,0.8))', borderRadius: 1 }} />
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 30,
                    height: 30,
                    background: `radial-gradient(circle, rgba(255,215,0,${0.2 + Math.sin(time * Math.PI * 4 + satIndex) * 0.1}), transparent 70%)`,
                  }}
                />
              </div>
            );
          })}
        </div>
      ))}

      {/* Communication beams */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.3 + progress * 0.3 }}>
        {[...Array(6)].map((_, i) => {
          const angle = (i / 6) * 360 + time * 60;
          const radians = angle * Math.PI / 180;
          const endX = 50 + Math.cos(radians) * 40;
          const endY = 50 + Math.sin(radians) * 24;
          return (
            <line
              key={i}
              x1="50%"
              y1="50%"
              x2={`${endX}%`}
              y2={`${endY}%`}
              stroke="rgba(255,215,0,0.2)"
              strokeWidth="1"
              strokeDasharray="5,5"
              style={{ filter: 'drop-shadow(0 0 3px rgba(255,215,0,0.3))' }}
            />
          );
        })}
      </svg>

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
