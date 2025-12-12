'use client';

import { useEffect, useRef, useState } from 'react';
import { H1, H2 } from '@saa/shared/components/saa';

/**
 * Test Page: 16 Scroll Hero Effects
 * KEPT (6): Effect 1 (Reveal Mask), Effect 2 (Asteroid Belt), Effect 3 (Diagonal Slashes),
 *           Effect 4 (Particle Storm), Effect 5 (Spiral Galaxy), Effect 6 (Constellation Map)
 * NEW (10): Effects 7-16 - Spaceman themed designs
 */

// Hook to track scroll position with smoothing
function useScrollProgress(ref: React.RefObject<HTMLElement | null>, smoothFactor = 0.08) {
  const [progress, setProgress] = useState(0);
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const start = windowHeight;
      const end = -rect.height;
      const current = rect.top;
      targetRef.current = Math.max(0, Math.min(1, (start - current) / (start - end)));
    };

    const animate = () => {
      const diff = targetRef.current - currentRef.current;
      if (Math.abs(diff) > 0.0001) {
        currentRef.current += diff * smoothFactor;
        setProgress(currentRef.current);
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [ref, smoothFactor]);

  return progress;
}

// ============================================================================
// EFFECT 1: Reveal Mask (KEPT)
// ============================================================================
function Effect1RevealMask() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);
  const maskSize = 20 + progress * 150;
  const rotation = progress * 90;

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse ${maskSize}% ${maskSize}% at 50% 50%,
            rgba(255,215,0,0.15) 0%, rgba(255,150,0,0.1) 40%, transparent 70%)`,
        }}
      />
      <div
        className="absolute w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] border-2 border-[#ffd700]/30 pointer-events-none"
        style={{ transform: `rotate(${rotation}deg)`, borderRadius: `${20 + progress * 30}%` }}
      />
      <div
        className="absolute w-[60vw] h-[60vw] max-w-[450px] max-h-[450px] border border-[#ffd700]/20 pointer-events-none"
        style={{ transform: `rotate(${-rotation * 0.5}deg)`, borderRadius: `${50 - progress * 30}%` }}
      />
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 1: Reveal Mask</p>
        <H1>EXPANDING PORTAL</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Geometric frames rotate as a golden glow expands from center.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 2: Asteroid Belt (KEPT - lowered more, thicker belt)
// ============================================================================
function Effect2AsteroidBelt() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  // Asteroids in a lower horizontal band - centered at 60% with 12% spread (48-72%)
  const asteroids = [...Array(32)].map((_, i) => ({
    x: (i * 137.5) % 100,
    y: 60 + Math.sin(i * 0.8) * 12, // Lowered to 60% center with 12% spread for thicker belt
    size: 12 + (i % 5) * 8,
    speed: 0.5 + (i % 3) * 0.3,
    rotation: i * 45,
  }));

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Tilted asteroid belt container */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: 'rotate(-5deg) scale(1.1)',
          transformOrigin: 'center center',
        }}
      >
        {asteroids.map((asteroid, i) => (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: `${(asteroid.x + progress * 100 * asteroid.speed) % 120 - 10}%`,
              top: `${asteroid.y + Math.sin(progress * Math.PI * 2 + i) * 4}%`,
              width: asteroid.size,
              height: asteroid.size * 0.7,
              background: `linear-gradient(135deg, rgba(120,110,100,0.8) 0%, rgba(60,55,50,0.9) 100%)`,
              borderRadius: '30% 70% 50% 50%',
              transform: `rotate(${asteroid.rotation + progress * 180}deg)`,
              boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.5), 1px 1px 2px rgba(255,255,255,0.1)',
            }}
          />
        ))}
      </div>
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 2: Asteroid Belt</p>
        <H1>SPACE DEBRIS</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Navigate through a field of tumbling asteroids.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 3: Diagonal Slashes (KEPT)
// ============================================================================
function Effect3DiagonalSlashes() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const slashes = [...Array(8)].map((_, i) => ({
    offset: i * 15 - 10,
    delay: i * 0.05,
    width: 2 + (i % 3),
  }));

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {slashes.map((slash, i) => {
        const adjustedProgress = Math.max(0, Math.min(1, (progress - slash.delay) * 1.3));
        const yOffset = -150 + adjustedProgress * 300;
        return (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: `${slash.offset}%`,
              top: 0,
              width: `${slash.width}px`,
              height: '200%',
              background: `linear-gradient(180deg,
                transparent 0%,
                rgba(255,215,0,${0.3 + (i % 3) * 0.1}) 40%,
                rgba(255,215,0,${0.5 + (i % 3) * 0.1}) 50%,
                rgba(255,215,0,${0.3 + (i % 3) * 0.1}) 60%,
                transparent 100%)`,
              transform: `translateY(${yOffset}%) skewX(-15deg)`,
              boxShadow: `0 0 20px rgba(255,215,0,0.3)`,
            }}
          />
        );
      })}

      {slashes.slice(0, 4).map((slash, i) => {
        const adjustedProgress = Math.max(0, Math.min(1, (progress - slash.delay - 0.1) * 1.3));
        const yOffset = 150 - adjustedProgress * 300;
        return (
          <div
            key={`reverse-${i}`}
            className="absolute pointer-events-none"
            style={{
              right: `${slash.offset}%`,
              top: 0,
              width: '1px',
              height: '200%',
              background: `linear-gradient(180deg, transparent, rgba(255,180,0,0.4), transparent)`,
              transform: `translateY(${yOffset}%) skewX(15deg)`,
            }}
          />
        );
      })}

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 3: Diagonal Slashes</p>
        <H1>ENERGY BLADES</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Diagonal light slashes cut across the screen.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 4: Particle Storm (KEPT - was Effect 7)
// ============================================================================
function Effect4ParticleStorm() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const particles = [...Array(60)].map((_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 3 + Math.random() * 8,
    speed: 0.5 + Math.random() * 1.5,
    angle: Math.random() * 360,
  }));

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {particles.map((p, i) => {
        const moveX = Math.cos(p.angle * Math.PI / 180) * progress * 50;
        const moveY = Math.sin(p.angle * Math.PI / 180) * progress * 50;
        const opacity = 0.3 + Math.sin(progress * Math.PI * 2 + i) * 0.3;
        return (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
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

      {/* Trailing effects */}
      {[...Array(20)].map((_, i) => {
        const trailProgress = Math.max(0, progress - i * 0.02);
        return (
          <div
            key={`trail-${i}`}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${50 + Math.cos(i + progress * 10) * 30 * trailProgress}%`,
              top: `${50 + Math.sin(i + progress * 10) * 30 * trailProgress}%`,
              width: 4,
              height: 4,
              background: `rgba(255,215,0,${0.4 * trailProgress})`,
              boxShadow: `0 0 10px rgba(255,215,0,${0.3 * trailProgress})`,
            }}
          />
        );
      })}

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 4: Particle Storm</p>
        <H1>SOLAR WIND</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Charged particles scatter through the cosmos.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 5: Spiral Galaxy (KEPT - was Effect 12)
// ============================================================================
function Effect5SpiralGalaxy() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const arms = 4;
  const dotsPerArm = 30;

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {[...Array(arms)].map((_, armIndex) => (
        <div key={armIndex} className="absolute inset-0 pointer-events-none">
          {[...Array(dotsPerArm)].map((_, dotIndex) => {
            const baseAngle = (armIndex / arms) * 360 + dotIndex * 12;
            const radius = 30 + dotIndex * 12;
            const angle = baseAngle + progress * 180;
            const radians = angle * Math.PI / 180;
            const x = 50 + Math.cos(radians) * radius * 0.4;
            const y = 50 + Math.sin(radians) * radius * 0.25;
            const size = 3 + (dotsPerArm - dotIndex) * 0.3;
            const opacity = 0.2 + (dotsPerArm - dotIndex) / dotsPerArm * 0.5 * progress;
            return (
              <div
                key={dotIndex}
                className="absolute rounded-full pointer-events-none"
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

      {/* Galactic core */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 80 + progress * 40,
          height: 80 + progress * 40,
          background: `radial-gradient(circle, rgba(255,255,255,${0.4 + progress * 0.3}) 0%, rgba(255,215,0,${0.3 + progress * 0.2}) 30%, rgba(255,180,0,${0.1 + progress * 0.1}) 60%, transparent 100%)`,
          boxShadow: `0 0 ${60 + progress * 40}px rgba(255,215,0,0.4)`,
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 5: Spiral Galaxy</p>
        <H1>COSMIC VORTEX</H1>
        <p className="text-body text-[#dcdbd5] mt-6">A spiral galaxy rotates in the void.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 6: Constellation Map (KEPT - was Effect 13)
// ============================================================================
function Effect6ConstellationMap() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const stars = [
    { x: 15, y: 20 }, { x: 25, y: 35 }, { x: 40, y: 25 }, { x: 35, y: 45 },
    { x: 55, y: 30 }, { x: 65, y: 15 }, { x: 75, y: 40 }, { x: 85, y: 25 },
    { x: 20, y: 60 }, { x: 45, y: 65 }, { x: 60, y: 55 }, { x: 80, y: 70 },
    { x: 30, y: 80 }, { x: 50, y: 85 }, { x: 70, y: 75 }, { x: 90, y: 60 },
  ];

  const connections = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7],
    [8, 9], [9, 10], [10, 11], [12, 13], [13, 14], [14, 15],
    [1, 8], [3, 9], [4, 10], [6, 11], [9, 13], [10, 14],
  ];

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {connections.map(([from, to], i) => {
          const delay = i * 0.02;
          const lineProgress = Math.max(0, Math.min(1, (progress - delay) * 2));
          const opacity = lineProgress * 0.4;
          return (
            <line
              key={i}
              x1={`${stars[from].x}%`}
              y1={`${stars[from].y}%`}
              x2={`${stars[from].x + (stars[to].x - stars[from].x) * lineProgress}%`}
              y2={`${stars[from].y + (stars[to].y - stars[from].y) * lineProgress}%`}
              stroke={`rgba(255,215,0,${opacity})`}
              strokeWidth="1"
              style={{ filter: `drop-shadow(0 0 3px rgba(255,215,0,${opacity}))` }}
            />
          );
        })}
      </svg>

      {/* Star points */}
      {stars.map((star, i) => {
        const delay = i * 0.03;
        const starProgress = Math.max(0, (progress - delay) * 1.5);
        const pulse = Math.sin((progress * 3 + i * 0.5) * Math.PI);
        const size = 6 + starProgress * 4 + pulse * 2;
        return (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: size,
              height: size,
              transform: 'translate(-50%, -50%)',
              background: `radial-gradient(circle, rgba(255,255,255,${0.8 * starProgress}) 0%, rgba(255,215,0,${0.5 * starProgress}) 50%, transparent 100%)`,
              boxShadow: `0 0 ${10 + pulse * 5}px rgba(255,215,0,${0.5 * starProgress})`,
            }}
          />
        );
      })}

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 6: Constellation Map</p>
        <H1>STAR CHART</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Ancient patterns emerge in the night sky.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 7: Floating Astronaut (NEW - spaceman silhouette drifting)
// ============================================================================
function Effect7FloatingAstronaut() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  // Astronaut floats across from left to right, tumbling slowly
  const astronautX = -10 + progress * 120;
  const astronautY = 50 + Math.sin(progress * Math.PI * 2) * 15;
  const astronautRotation = progress * 360;

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Distant stars */}
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${(i * 17) % 100}%`,
            top: `${(i * 23) % 100}%`,
            width: 2 + (i % 3),
            height: 2 + (i % 3),
            background: `rgba(255,255,255,${0.3 + (i % 5) * 0.1})`,
          }}
        />
      ))}

      {/* Astronaut silhouette */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: `${astronautX}%`,
          top: `${astronautY}%`,
          transform: `translate(-50%, -50%) rotate(${astronautRotation}deg)`,
          width: 120,
          height: 150,
        }}
      >
        {/* Helmet */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(200,200,200,0.9) 0%, rgba(100,100,100,0.8) 100%)',
            boxShadow: 'inset -5px -5px 15px rgba(0,0,0,0.4), 0 0 30px rgba(255,215,0,0.3)',
          }}
        >
          {/* Visor */}
          <div
            style={{
              position: 'absolute',
              top: '20%',
              left: '15%',
              width: '70%',
              height: '50%',
              borderRadius: '40%',
              background: 'linear-gradient(180deg, rgba(255,215,0,0.4) 0%, rgba(50,50,80,0.9) 100%)',
              boxShadow: 'inset 0 0 10px rgba(255,215,0,0.5)',
            }}
          />
        </div>
        {/* Body */}
        <div
          style={{
            position: 'absolute',
            top: 50,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 70,
            height: 60,
            borderRadius: '35% 35% 20% 20%',
            background: 'linear-gradient(180deg, rgba(180,180,180,0.9) 0%, rgba(120,120,120,0.8) 100%)',
            boxShadow: 'inset -3px -3px 10px rgba(0,0,0,0.3)',
          }}
        />
        {/* Backpack/PLSS */}
        <div
          style={{
            position: 'absolute',
            top: 45,
            left: '50%',
            transform: 'translateX(-50%) translateZ(-10px)',
            width: 50,
            height: 50,
            borderRadius: '10%',
            background: 'rgba(100,100,100,0.8)',
            boxShadow: '0 0 20px rgba(255,215,0,0.2)',
          }}
        />
        {/* Arms */}
        <div style={{ position: 'absolute', top: 55, left: 5, width: 15, height: 40, borderRadius: '30%', background: 'rgba(160,160,160,0.8)', transform: `rotate(${20 + Math.sin(progress * Math.PI * 4) * 15}deg)` }} />
        <div style={{ position: 'absolute', top: 55, right: 5, width: 15, height: 40, borderRadius: '30%', background: 'rgba(160,160,160,0.8)', transform: `rotate(${-20 + Math.sin(progress * Math.PI * 4 + 1) * 15}deg)` }} />
        {/* Legs */}
        <div style={{ position: 'absolute', top: 100, left: 25, width: 18, height: 45, borderRadius: '30%', background: 'rgba(160,160,160,0.8)', transform: `rotate(${10 + Math.sin(progress * Math.PI * 3) * 10}deg)` }} />
        <div style={{ position: 'absolute', top: 100, right: 25, width: 18, height: 45, borderRadius: '30%', background: 'rgba(160,160,160,0.8)', transform: `rotate(${-10 + Math.sin(progress * Math.PI * 3 + 0.5) * 10}deg)` }} />
      </div>

      {/* Tether line trailing behind */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <path
          d={`M ${astronautX - 10}% ${astronautY}% Q ${astronautX - 30}% ${astronautY + 10}%, ${astronautX - 50}% ${astronautY - 5}%`}
          stroke="rgba(255,215,0,0.3)"
          strokeWidth="2"
          fill="none"
          style={{ filter: 'drop-shadow(0 0 5px rgba(255,215,0,0.3))' }}
        />
      </svg>

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 7: Floating Astronaut</p>
        <H1>SPACEWALK</H1>
        <p className="text-body text-[#dcdbd5] mt-6">A lone astronaut tumbles gracefully through the void.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 8: Space Station Orbit (NEW - rotating station segments)
// ============================================================================
function Effect8SpaceStationOrbit() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const orbitAngle = progress * 90;

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Station central hub */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) rotateY(${orbitAngle}deg)`,
          perspective: '1000px',
        }}
      >
        {/* Central module */}
        <div
          style={{
            width: 80,
            height: 80,
            margin: '0 auto',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(180,180,180,0.9) 0%, rgba(100,100,100,0.8) 100%)',
            boxShadow: 'inset -10px -10px 30px rgba(0,0,0,0.4), 0 0 40px rgba(255,215,0,0.3)',
          }}
        />
      </div>

      {/* Solar panel arrays - rotating around station */}
      {[0, 90, 180, 270].map((baseAngle, i) => {
        const angle = baseAngle + orbitAngle;
        const radians = angle * Math.PI / 180;
        const distance = 150 + progress * 50;
        const x = 50 + Math.cos(radians) * distance / 5;
        const y = 50 + Math.sin(radians) * distance / 10;
        return (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: `translate(-50%, -50%) rotate(${angle}deg)`,
            }}
          >
            {/* Solar panel structure */}
            <div
              style={{
                width: 150,
                height: 8,
                background: 'linear-gradient(90deg, rgba(100,100,100,0.8), rgba(150,150,150,0.9), rgba(100,100,100,0.8))',
                borderRadius: 2,
              }}
            />
            {/* Panel cells */}
            <div
              style={{
                position: 'absolute',
                top: -25,
                left: 10,
                width: 130,
                height: 60,
                background: 'linear-gradient(180deg, rgba(30,50,100,0.9) 0%, rgba(50,100,200,0.8) 50%, rgba(30,50,100,0.9) 100%)',
                borderRadius: 4,
                boxShadow: `0 0 ${20 + progress * 20}px rgba(100,150,255,0.3)`,
              }}
            >
              {/* Grid lines */}
              {[...Array(6)].map((_, j) => (
                <div key={j} style={{ position: 'absolute', top: 0, left: `${j * 20}%`, width: 1, height: '100%', background: 'rgba(0,0,0,0.3)' }} />
              ))}
            </div>
          </div>
        );
      })}

      {/* Module arms connecting to solar arrays */}
      {[45, 135, 225, 315].map((angle, i) => {
        const radians = (angle + orbitAngle * 0.5) * Math.PI / 180;
        const x = 50 + Math.cos(radians) * 8;
        const y = 50 + Math.sin(radians) * 4;
        return (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: 60,
              height: 20,
              transform: `translate(-50%, -50%) rotate(${angle + orbitAngle * 0.5}deg)`,
              background: 'linear-gradient(180deg, rgba(160,160,160,0.8), rgba(120,120,120,0.7))',
              borderRadius: 4,
              boxShadow: 'inset -2px -2px 5px rgba(0,0,0,0.3)',
            }}
          />
        );
      })}

      <div className="relative z-10 text-center px-4 max-w-4xl mt-40">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 8: Space Station Orbit</p>
        <H1>ORBITAL OUTPOST</H1>
        <p className="text-body text-[#dcdbd5] mt-6">A space station rotates majestically in orbit.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 9: Rocket Launch Trail (NEW - ascending rocket with exhaust)
// ============================================================================
function Effect9RocketLaunchTrail() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  // Rocket ascends from bottom to top
  const rocketY = 100 - progress * 120;
  const rocketX = 50 + Math.sin(progress * Math.PI * 4) * 3;

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Exhaust trail */}
      {[...Array(30)].map((_, i) => {
        const trailProgress = Math.max(0, progress - i * 0.02);
        const size = 20 + i * 8 + Math.sin(progress * 10 + i) * 5;
        const yPos = rocketY + 10 + i * 15;
        const opacity = Math.max(0, 0.4 - i * 0.012);
        const xOffset = Math.sin(i * 0.5 + progress * 5) * (5 + i * 0.5);
        return (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: `calc(${rocketX}% + ${xOffset}px)`,
              top: `${yPos}%`,
              width: size,
              height: size * 1.5,
              transform: 'translate(-50%, 0)',
              background: `radial-gradient(ellipse at center top,
                rgba(255,200,100,${opacity}) 0%,
                rgba(255,150,50,${opacity * 0.7}) 30%,
                rgba(255,100,0,${opacity * 0.4}) 60%,
                transparent 100%)`,
              filter: 'blur(5px)',
            }}
          />
        );
      })}

      {/* Rocket body */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: `${rocketX}%`,
          top: `${rocketY}%`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Nose cone */}
        <div
          style={{
            width: 0,
            height: 0,
            margin: '0 auto',
            borderLeft: '15px solid transparent',
            borderRight: '15px solid transparent',
            borderBottom: '40px solid rgba(200,200,200,0.9)',
            filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.5))',
          }}
        />
        {/* Main body */}
        <div
          style={{
            width: 30,
            height: 80,
            margin: '0 auto',
            background: 'linear-gradient(90deg, rgba(160,160,160,0.9) 0%, rgba(220,220,220,0.95) 50%, rgba(160,160,160,0.9) 100%)',
            boxShadow: 'inset -5px 0 15px rgba(0,0,0,0.3)',
          }}
        />
        {/* Fins */}
        <div style={{ position: 'absolute', bottom: 0, left: -15, width: 0, height: 0, borderTop: '30px solid transparent', borderRight: '20px solid rgba(180,50,50,0.9)' }} />
        <div style={{ position: 'absolute', bottom: 0, right: -15, width: 0, height: 0, borderTop: '30px solid transparent', borderLeft: '20px solid rgba(180,50,50,0.9)' }} />
        {/* Engine nozzle */}
        <div
          style={{
            width: 20,
            height: 15,
            margin: '0 auto',
            background: 'linear-gradient(180deg, rgba(100,100,100,0.9), rgba(60,60,60,0.9))',
            borderRadius: '0 0 50% 50%',
          }}
        />
        {/* Flame */}
        <div
          style={{
            width: 15 + Math.sin(progress * 30) * 5,
            height: 40 + Math.sin(progress * 25) * 10,
            margin: '0 auto',
            background: `linear-gradient(180deg,
              rgba(255,255,200,0.9) 0%,
              rgba(255,200,50,0.8) 30%,
              rgba(255,100,0,0.6) 60%,
              transparent 100%)`,
            borderRadius: '30% 30% 50% 50%',
            filter: 'blur(2px)',
          }}
        />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 9: Rocket Launch Trail</p>
        <H1>LIFTOFF</H1>
        <p className="text-body text-[#dcdbd5] mt-6">A rocket blazes a trail through the atmosphere.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 10: EVA Tether (NEW - umbilical cord waves)
// ============================================================================
function Effect10EVATether() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  // Generate wavy tether path points
  const tetherPoints = [...Array(20)].map((_, i) => {
    const t = i / 19;
    const wave = Math.sin(t * Math.PI * 3 + progress * Math.PI * 4) * (30 - t * 20);
    return {
      x: 10 + t * 80,
      y: 50 + wave + Math.sin(t * Math.PI * 2) * 10,
    };
  });

  // Build SVG path
  let pathD = `M ${tetherPoints[0].x} ${tetherPoints[0].y}`;
  for (let i = 1; i < tetherPoints.length; i++) {
    pathD += ` L ${tetherPoints[i].x} ${tetherPoints[i].y}`;
  }

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Airlock/attachment point */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: '8%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 40,
          height: 60,
          background: 'linear-gradient(90deg, rgba(100,100,100,0.9), rgba(150,150,150,0.8))',
          borderRadius: '5px 20px 20px 5px',
          boxShadow: '0 0 20px rgba(255,215,0,0.3)',
        }}
      >
        <div style={{ position: 'absolute', top: '50%', right: -5, transform: 'translateY(-50%)', width: 15, height: 15, borderRadius: '50%', background: 'rgba(200,200,200,0.9)', border: '3px solid rgba(100,100,100,0.8)' }} />
      </div>

      {/* Tether line */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Main tether */}
        <path
          d={pathD}
          stroke="rgba(255,215,0,0.6)"
          strokeWidth="0.5"
          fill="none"
          style={{ filter: 'drop-shadow(0 0 3px rgba(255,215,0,0.5))' }}
        />
        {/* Inner highlight */}
        <path
          d={pathD}
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="0.2"
          fill="none"
        />
      </svg>

      {/* Floating connectors along tether */}
      {[0.2, 0.4, 0.6, 0.8].map((t, i) => {
        const idx = Math.floor(t * (tetherPoints.length - 1));
        const point = tetherPoints[idx];
        return (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              width: 8,
              height: 8,
              transform: 'translate(-50%, -50%)',
              background: 'linear-gradient(135deg, rgba(200,200,200,0.9), rgba(150,150,150,0.8))',
              boxShadow: '0 0 10px rgba(255,215,0,0.4)',
            }}
          />
        );
      })}

      {/* Astronaut at end of tether */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: `${tetherPoints[tetherPoints.length - 1].x}%`,
          top: `${tetherPoints[tetherPoints.length - 1].y}%`,
          transform: `translate(-50%, -50%) rotate(${Math.sin(progress * Math.PI * 2) * 20}deg)`,
        }}
      >
        {/* Simplified astronaut */}
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(200,200,200,0.9), rgba(150,150,150,0.8))', boxShadow: '0 0 20px rgba(255,215,0,0.4)' }}>
          <div style={{ position: 'absolute', top: '25%', left: '20%', width: '60%', height: '35%', borderRadius: '40%', background: 'linear-gradient(180deg, rgba(255,215,0,0.3), rgba(50,50,80,0.8))' }} />
        </div>
        <div style={{ width: 25, height: 25, margin: '-5px auto 0', borderRadius: '30%', background: 'rgba(180,180,180,0.8)' }} />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 10: EVA Tether</p>
        <H1>LIFELINE</H1>
        <p className="text-body text-[#dcdbd5] mt-6">The umbilical cord waves through zero gravity.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 11: Helmet Reflection (NEW - visor with space reflections)
// ============================================================================
function Effect11HelmetReflection() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const helmetSize = 300 + progress * 100;
  const reflectionAngle = progress * 30;

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Background stars reflected in helmet */}
      {[...Array(40)].map((_, i) => {
        const angle = (i / 40) * 360 + reflectionAngle;
        const distance = 20 + (i % 5) * 10;
        const radians = angle * Math.PI / 180;
        const x = 50 + Math.cos(radians) * distance;
        const y = 50 + Math.sin(radians) * distance * 0.6;
        return (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: 3 + (i % 3),
              height: 3 + (i % 3),
              background: `rgba(255,255,255,${0.3 + (i % 4) * 0.1 + progress * 0.2})`,
              boxShadow: `0 0 5px rgba(255,255,255,0.5)`,
            }}
          />
        );
      })}

      {/* Helmet outline */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: helmetSize,
          height: helmetSize,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'linear-gradient(135deg, rgba(200,200,200,0.15) 0%, rgba(100,100,100,0.1) 100%)',
          border: '4px solid rgba(180,180,180,0.4)',
          boxShadow: `
            inset 0 0 60px rgba(0,0,0,0.5),
            0 0 40px rgba(255,215,0,0.2),
            inset -20px -20px 60px rgba(0,0,0,0.3)
          `,
        }}
      />

      {/* Visor (golden tint) */}
      <div
        className="absolute rounded-full pointer-events-none overflow-hidden"
        style={{
          width: helmetSize * 0.7,
          height: helmetSize * 0.5,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: `linear-gradient(${135 + reflectionAngle}deg,
            rgba(255,200,50,0.3) 0%,
            rgba(255,150,0,0.2) 30%,
            rgba(100,80,50,0.4) 70%,
            rgba(50,50,80,0.5) 100%)`,
          border: '2px solid rgba(255,215,0,0.3)',
          boxShadow: `
            inset 0 0 40px rgba(255,215,0,0.2),
            0 0 30px rgba(255,215,0,0.3)
          `,
        }}
      >
        {/* Reflection streak */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: `${20 + progress * 30}%`,
            width: '40%',
            height: '20%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            transform: `rotate(-15deg)`,
            filter: 'blur(10px)',
          }}
        />
        {/* Earth reflection hint */}
        <div
          className="absolute rounded-full"
          style={{
            width: 60,
            height: 40,
            bottom: '20%',
            left: '20%',
            background: 'radial-gradient(ellipse, rgba(50,100,200,0.3), rgba(50,150,100,0.2), transparent)',
            filter: 'blur(5px)',
          }}
        />
      </div>

      {/* Helmet rim highlight */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: helmetSize + 20,
          height: helmetSize / 3,
          left: '50%',
          top: `calc(50% - ${helmetSize / 2.5}px)`,
          transform: 'translate(-50%, 0)',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.2), transparent)',
          borderRadius: '50% 50% 0 0',
          filter: 'blur(5px)',
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-4xl" style={{ marginTop: helmetSize / 2 + 50 }}>
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 11: Helmet Reflection</p>
        <H1>VISOR VIEW</H1>
        <p className="text-body text-[#dcdbd5] mt-6">The universe reflects in a golden visor.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 12: Zero-G Tools (NEW - floating tools and equipment)
// ============================================================================
function Effect12ZeroGTools() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const tools = [
    { type: 'wrench', x: 20, y: 30, rotation: 45, size: 60 },
    { type: 'screwdriver', x: 75, y: 25, rotation: -30, size: 70 },
    { type: 'tablet', x: 15, y: 65, rotation: 15, size: 80 },
    { type: 'camera', x: 80, y: 60, rotation: -20, size: 50 },
    { type: 'flashlight', x: 40, y: 75, rotation: 60, size: 55 },
    { type: 'hammer', x: 60, y: 20, rotation: -45, size: 65 },
  ];

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {tools.map((tool, i) => {
        const floatY = Math.sin(progress * Math.PI * 2 + i * 1.2) * 20;
        const floatX = Math.cos(progress * Math.PI * 1.5 + i * 0.8) * 10;
        const spin = tool.rotation + progress * 90 * (i % 2 === 0 ? 1 : -1);

        return (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: `calc(${tool.x}% + ${floatX}px)`,
              top: `calc(${tool.y}% + ${floatY}px)`,
              transform: `translate(-50%, -50%) rotate(${spin}deg)`,
            }}
          >
            {tool.type === 'wrench' && (
              <div style={{ width: tool.size, height: tool.size * 0.3 }}>
                <div style={{ width: '70%', height: '100%', background: 'linear-gradient(180deg, rgba(180,180,180,0.9), rgba(120,120,120,0.8))', borderRadius: 4 }} />
                <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', width: '35%', height: '150%', background: 'linear-gradient(180deg, rgba(180,180,180,0.9), rgba(120,120,120,0.8))', borderRadius: '0 50% 50% 0', clipPath: 'polygon(0 20%, 100% 0%, 100% 100%, 0 80%)' }} />
              </div>
            )}
            {tool.type === 'screwdriver' && (
              <div style={{ width: tool.size * 0.15, height: tool.size }}>
                <div style={{ width: '100%', height: '30%', background: 'linear-gradient(90deg, rgba(200,50,50,0.9), rgba(150,30,30,0.8))', borderRadius: '30% 30% 0 0' }} />
                <div style={{ width: '60%', height: '70%', margin: '0 auto', background: 'linear-gradient(90deg, rgba(180,180,180,0.9), rgba(140,140,140,0.8))' }} />
              </div>
            )}
            {tool.type === 'tablet' && (
              <div style={{ width: tool.size, height: tool.size * 0.7, background: 'linear-gradient(135deg, rgba(40,40,50,0.9), rgba(60,60,70,0.8))', borderRadius: 8, border: '2px solid rgba(100,100,100,0.5)', boxShadow: '0 0 20px rgba(100,200,255,0.3)' }}>
                <div style={{ position: 'absolute', inset: 5, background: 'linear-gradient(180deg, rgba(100,200,255,0.2), rgba(50,100,150,0.3))', borderRadius: 4 }} />
              </div>
            )}
            {tool.type === 'camera' && (
              <div style={{ width: tool.size, height: tool.size * 0.7 }}>
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(50,50,50,0.9), rgba(30,30,30,0.8))', borderRadius: 6 }} />
                <div style={{ position: 'absolute', left: '15%', top: '20%', width: '40%', height: '60%', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(80,80,100,0.9), rgba(40,40,60,0.8))', border: '3px solid rgba(100,100,100,0.6)', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5), 0 0 15px rgba(255,215,0,0.3)' }} />
              </div>
            )}
            {tool.type === 'flashlight' && (
              <div style={{ width: tool.size * 0.25, height: tool.size }}>
                <div style={{ width: '150%', height: '25%', marginLeft: '-25%', background: 'linear-gradient(180deg, rgba(200,200,200,0.9), rgba(150,150,150,0.8))', borderRadius: '50% 50% 0 0' }} />
                <div style={{ width: '100%', height: '75%', background: 'linear-gradient(90deg, rgba(60,60,60,0.9), rgba(40,40,40,0.8))' }} />
                {/* Light beam */}
                <div style={{ position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)', width: 40, height: 50, background: `linear-gradient(180deg, rgba(255,255,200,${0.3 + progress * 0.3}), transparent)`, clipPath: 'polygon(30% 100%, 70% 100%, 100% 0%, 0% 0%)', filter: 'blur(5px)' }} />
              </div>
            )}
            {tool.type === 'hammer' && (
              <div style={{ width: tool.size, height: tool.size * 0.4 }}>
                <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '15%', height: '200%', background: 'linear-gradient(90deg, rgba(139,90,43,0.9), rgba(100,60,30,0.8))', borderRadius: 3 }} />
                <div style={{ position: 'absolute', top: 0, left: 0, width: '45%', height: '100%', background: 'linear-gradient(180deg, rgba(180,180,180,0.9), rgba(120,120,120,0.8))', borderRadius: '20% 5% 5% 20%' }} />
              </div>
            )}
            {/* Glow effect */}
            <div
              style={{
                position: 'absolute',
                inset: -10,
                background: `radial-gradient(ellipse, rgba(255,215,0,${0.1 + progress * 0.1}), transparent 70%)`,
                filter: 'blur(10px)',
              }}
            />
          </div>
        );
      })}

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 12: Zero-G Tools</p>
        <H1>WEIGHTLESS WORKSHOP</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Tools drift freely in microgravity.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 13: Lunar Surface (NEW - moon terrain with footprints)
// ============================================================================
function Effect13LunarSurface() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  // Footprint positions (walking pattern)
  const footprints = [...Array(12)].map((_, i) => ({
    x: 15 + i * 7,
    y: 70 + (i % 2) * 5,
    rotation: -5 + (i % 2) * 10,
    delay: i * 0.05,
  }));

  // Craters
  const craters = [
    { x: 20, y: 60, size: 80 },
    { x: 70, y: 55, size: 120 },
    { x: 45, y: 75, size: 60 },
    { x: 85, y: 70, size: 90 },
    { x: 10, y: 80, size: 50 },
  ];

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Lunar surface base */}
      <div
        className="absolute inset-x-0 bottom-0 h-[60%] pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(80,80,80,0.6) 0%, rgba(60,60,60,0.8) 50%, rgba(50,50,50,0.9) 100%)',
        }}
      />

      {/* Craters */}
      {craters.map((crater, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${crater.x}%`,
            top: `${crater.y}%`,
            width: crater.size,
            height: crater.size * 0.4,
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(ellipse, rgba(40,40,40,0.8) 0%, rgba(60,60,60,0.6) 60%, rgba(80,80,80,0.4) 100%)`,
            boxShadow: `
              inset 0 ${crater.size * 0.05}px ${crater.size * 0.1}px rgba(0,0,0,0.5),
              inset 0 -${crater.size * 0.02}px ${crater.size * 0.05}px rgba(255,255,255,0.1)
            `,
          }}
        />
      ))}

      {/* Footprints appearing as you scroll */}
      {footprints.map((fp, i) => {
        const fpProgress = Math.max(0, Math.min(1, (progress - fp.delay) * 3));
        return (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: `${fp.x}%`,
              top: `${fp.y}%`,
              transform: `rotate(${fp.rotation}deg)`,
              opacity: fpProgress,
            }}
          >
            {/* Boot print shape */}
            <div
              style={{
                width: 20,
                height: 35,
                background: 'rgba(40,40,40,0.7)',
                borderRadius: '40% 40% 30% 30%',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              {/* Tread lines */}
              {[...Array(5)].map((_, j) => (
                <div
                  key={j}
                  style={{
                    position: 'absolute',
                    top: 5 + j * 6,
                    left: '15%',
                    width: '70%',
                    height: 2,
                    background: 'rgba(30,30,30,0.8)',
                    borderRadius: 1,
                  }}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Distant Earth */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          right: '15%',
          top: '15%',
          width: 60 + progress * 20,
          height: 60 + progress * 20,
          background: `radial-gradient(circle at 30% 30%,
            rgba(100,150,255,0.8) 0%,
            rgba(50,100,200,0.7) 30%,
            rgba(30,80,150,0.6) 60%,
            rgba(20,60,100,0.5) 100%)`,
          boxShadow: `0 0 ${30 + progress * 20}px rgba(100,150,255,0.4)`,
        }}
      >
        {/* Landmass hints */}
        <div style={{ position: 'absolute', top: '30%', left: '20%', width: '30%', height: '25%', background: 'rgba(50,150,80,0.4)', borderRadius: '40% 60% 50% 50%', filter: 'blur(2px)' }} />
      </div>

      {/* Astronaut silhouette in distance */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: `${30 + progress * 20}%`,
          top: '55%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.6 + progress * 0.3,
        }}
      >
        <div style={{ width: 15, height: 15, borderRadius: '50%', background: 'rgba(200,200,200,0.7)', margin: '0 auto' }} />
        <div style={{ width: 12, height: 18, background: 'rgba(200,200,200,0.6)', margin: '0 auto', borderRadius: '30%' }} />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 13: Lunar Surface</p>
        <H1>MOONWALK</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Footprints mark humanity&apos;s giant leap.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 14: Capsule Reentry (NEW - fiery atmospheric entry)
// ============================================================================
function Effect14CapsuleReentry() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  // Capsule descends with fire trail
  const capsuleY = 20 + progress * 60;
  const shake = Math.sin(progress * Math.PI * 20) * (2 + progress * 3);

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Atmospheric glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(180deg,
            rgba(0,0,30,0.9) 0%,
            rgba(20,10,40,0.8) ${40 + progress * 20}%,
            rgba(50,30,60,0.6) ${70 + progress * 15}%,
            rgba(100,60,80,0.4) 100%)`,
        }}
      />

      {/* Heat trail behind capsule */}
      {[...Array(25)].map((_, i) => {
        const trailY = capsuleY - 5 - i * 4;
        const spread = i * 3 + progress * i * 2;
        const opacity = Math.max(0, 0.5 - i * 0.018);
        return (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: `calc(50% + ${shake * (1 - i / 25)}px + ${Math.sin(i * 0.5 + progress * 10) * spread * 0.3}px)`,
              top: `${trailY}%`,
              width: 30 + spread * 2,
              height: 15 + i * 2,
              transform: 'translate(-50%, -50%)',
              background: `radial-gradient(ellipse,
                rgba(255,${200 - i * 6},${100 - i * 4},${opacity}) 0%,
                rgba(255,${150 - i * 5},0,${opacity * 0.6}) 40%,
                transparent 100%)`,
              filter: `blur(${3 + i * 0.5}px)`,
            }}
          />
        );
      })}

      {/* Capsule body */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: `calc(50% + ${shake}px)`,
          top: `${capsuleY}%`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Heat shield (glowing) */}
        <div
          style={{
            width: 80,
            height: 30,
            background: `linear-gradient(180deg,
              rgba(255,200,100,${0.8 + progress * 0.2}) 0%,
              rgba(255,150,50,0.9) 50%,
              rgba(200,100,50,0.8) 100%)`,
            borderRadius: '50% 50% 30% 30%',
            boxShadow: `0 0 ${40 + progress * 30}px rgba(255,150,50,0.6), 0 0 ${20 + progress * 20}px rgba(255,200,100,0.4)`,
          }}
        />
        {/* Capsule cone */}
        <div
          style={{
            width: 60,
            height: 50,
            margin: '-5px auto 0',
            background: 'linear-gradient(135deg, rgba(60,60,60,0.9), rgba(40,40,40,0.8))',
            clipPath: 'polygon(20% 100%, 80% 100%, 100% 0%, 0% 0%)',
            boxShadow: 'inset -5px 0 15px rgba(255,100,50,0.3)',
          }}
        />
        {/* Windows */}
        <div style={{ position: 'absolute', top: 35, left: '50%', transform: 'translateX(-50%)', width: 15, height: 10, borderRadius: '50%', background: 'rgba(100,150,200,0.6)', boxShadow: 'inset 0 0 5px rgba(0,0,0,0.5)' }} />
      </div>

      {/* Plasma particles */}
      {[...Array(30)].map((_, i) => {
        const particleY = capsuleY + Math.random() * 30 - 15;
        const particleX = 50 + (Math.random() - 0.5) * 30;
        const drift = progress * 50 * (Math.random() + 0.5);
        return (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${particleX}%`,
              top: `calc(${particleY}% - ${drift}px)`,
              width: 3 + Math.random() * 4,
              height: 3 + Math.random() * 4,
              background: `rgba(255,${180 + Math.random() * 75},${Math.random() * 100},${0.5 + Math.random() * 0.3})`,
              boxShadow: '0 0 5px rgba(255,200,100,0.5)',
              filter: 'blur(1px)',
            }}
          />
        );
      })}

      <div className="relative z-10 text-center px-4 max-w-4xl" style={{ marginTop: '30vh' }}>
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 14: Capsule Reentry</p>
        <H1>HOMECOMING</H1>
        <p className="text-body text-[#dcdbd5] mt-6">A capsule blazes through the atmosphere.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 15: Satellite Constellation (NEW - orbiting comm satellites)
// ============================================================================
function Effect15SatelliteConstellation() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  // Multiple orbital paths with satellites
  const orbits = [
    { satellites: 8, radius: 35, speed: 1, tilt: 20 },
    { satellites: 6, radius: 25, speed: -0.7, tilt: -15 },
    { satellites: 10, radius: 45, speed: 0.5, tilt: 10 },
  ];

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Earth in center */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          left: '50%',
          top: '50%',
          width: 120,
          height: 120,
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle at 35% 35%,
            rgba(100,180,255,0.9) 0%,
            rgba(50,120,200,0.8) 40%,
            rgba(30,80,150,0.7) 70%,
            rgba(20,50,100,0.6) 100%)`,
          boxShadow: '0 0 60px rgba(100,150,255,0.4), inset -10px -10px 30px rgba(0,0,0,0.3)',
        }}
      >
        {/* Cloud patterns */}
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: '40%', height: '15%', background: 'rgba(255,255,255,0.3)', borderRadius: '50%', filter: 'blur(3px)' }} />
        <div style={{ position: 'absolute', top: '50%', right: '15%', width: '30%', height: '10%', background: 'rgba(255,255,255,0.25)', borderRadius: '50%', filter: 'blur(2px)' }} />
        {/* Landmass */}
        <div style={{ position: 'absolute', top: '25%', left: '30%', width: '35%', height: '30%', background: 'rgba(50,150,80,0.4)', borderRadius: '40%', filter: 'blur(2px)' }} />
      </div>

      {/* Orbital rings and satellites */}
      {orbits.map((orbit, orbitIndex) => (
        <div key={orbitIndex} className="absolute inset-0 pointer-events-none">
          {/* Orbital path (faint) */}
          <div
            className="absolute rounded-full border pointer-events-none"
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
            const angle = baseAngle + progress * 360 * orbit.speed;
            const radians = angle * Math.PI / 180;
            const x = 50 + Math.cos(radians) * orbit.radius;
            const y = 50 + Math.sin(radians) * orbit.radius * 0.6;
            const scale = 0.6 + (Math.sin(radians) + 1) * 0.2;

            return (
              <div
                key={satIndex}
                className="absolute pointer-events-none"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: `translate(-50%, -50%) scale(${scale})`,
                  zIndex: Math.sin(radians) > 0 ? 10 : 5,
                }}
              >
                {/* Satellite body */}
                <div style={{ width: 12, height: 8, background: 'linear-gradient(180deg, rgba(200,200,200,0.9), rgba(150,150,150,0.8))', borderRadius: 2 }} />
                {/* Solar panels */}
                <div style={{ position: 'absolute', top: '50%', left: -15, transform: 'translateY(-50%)', width: 15, height: 20, background: 'linear-gradient(90deg, rgba(50,80,150,0.8), rgba(80,120,200,0.7))', borderRadius: 1 }} />
                <div style={{ position: 'absolute', top: '50%', right: -15, transform: 'translateY(-50%)', width: 15, height: 20, background: 'linear-gradient(90deg, rgba(80,120,200,0.7), rgba(50,80,150,0.8))', borderRadius: 1 }} />
                {/* Signal glow */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 30,
                    height: 30,
                    background: `radial-gradient(circle, rgba(255,215,0,${0.2 + Math.sin(progress * Math.PI * 4 + satIndex) * 0.1}), transparent 70%)`,
                  }}
                />
              </div>
            );
          })}
        </div>
      ))}

      {/* Communication beams */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.3 + progress * 0.3 }}>
        {[...Array(6)].map((_, i) => {
          const angle = (i / 6) * 360 + progress * 60;
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

      <div className="relative z-10 text-center px-4 max-w-4xl mt-40">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 15: Satellite Constellation</p>
        <H1>GLOBAL NETWORK</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Satellites weave a web around Earth.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 16: Spacesuit HUD (NEW - helmet display overlay)
// ============================================================================
function Effect16SpacesuitHUD() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  // Animated values
  const o2Level = 98 - progress * 5;
  const heartRate = 72 + Math.sin(progress * Math.PI * 8) * 8;
  const altitude = Math.floor(408 + progress * 12);
  const velocity = (7.66 + progress * 0.1).toFixed(2);

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* HUD frame overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ border: '4px solid rgba(255,215,0,0.2)', borderRadius: 20, margin: 20 }}>
        {/* Corner brackets */}
        <div style={{ position: 'absolute', top: -2, left: -2, width: 40, height: 40, borderTop: '3px solid rgba(255,215,0,0.6)', borderLeft: '3px solid rgba(255,215,0,0.6)' }} />
        <div style={{ position: 'absolute', top: -2, right: -2, width: 40, height: 40, borderTop: '3px solid rgba(255,215,0,0.6)', borderRight: '3px solid rgba(255,215,0,0.6)' }} />
        <div style={{ position: 'absolute', bottom: -2, left: -2, width: 40, height: 40, borderBottom: '3px solid rgba(255,215,0,0.6)', borderLeft: '3px solid rgba(255,215,0,0.6)' }} />
        <div style={{ position: 'absolute', bottom: -2, right: -2, width: 40, height: 40, borderBottom: '3px solid rgba(255,215,0,0.6)', borderRight: '3px solid rgba(255,215,0,0.6)' }} />
      </div>

      {/* Top status bar */}
      <div
        className="absolute top-8 left-1/2 transform -translate-x-1/2 pointer-events-none"
        style={{ fontFamily: 'monospace', color: 'rgba(255,215,0,0.8)', fontSize: 12 }}
      >
        <div className="flex gap-8 justify-center items-center">
          <div className="text-center">
            <div style={{ fontSize: 10, opacity: 0.6 }}>MISSION TIME</div>
            <div>{Math.floor(progress * 180)}:{String(Math.floor((progress * 180 * 60) % 60)).padStart(2, '0')}:{String(Math.floor((progress * 180 * 3600) % 60)).padStart(2, '0')}</div>
          </div>
          <div className="text-center">
            <div style={{ fontSize: 10, opacity: 0.6 }}>STATUS</div>
            <div style={{ color: 'rgba(100,255,100,0.9)' }}>NOMINAL</div>
          </div>
          <div className="text-center">
            <div style={{ fontSize: 10, opacity: 0.6 }}>COMMS</div>
            <div style={{ color: progress > 0.7 ? 'rgba(255,100,100,0.9)' : 'rgba(100,255,100,0.9)' }}>
              {progress > 0.7 ? 'SIGNAL WEAK' : 'CONNECTED'}
            </div>
          </div>
        </div>
      </div>

      {/* Left panel - Life support */}
      <div
        className="absolute left-8 top-1/2 transform -translate-y-1/2 pointer-events-none"
        style={{ fontFamily: 'monospace', color: 'rgba(255,215,0,0.8)', fontSize: 11, width: 120 }}
      >
        <div style={{ borderBottom: '1px solid rgba(255,215,0,0.3)', paddingBottom: 8, marginBottom: 8 }}>
          <div style={{ fontSize: 9, opacity: 0.6 }}>LIFE SUPPORT</div>
        </div>
        <div className="mb-3">
          <div style={{ fontSize: 9, opacity: 0.6 }}>O2 LEVEL</div>
          <div className="flex items-center gap-2">
            <div style={{ flex: 1, height: 6, background: 'rgba(255,215,0,0.2)', borderRadius: 3 }}>
              <div style={{ width: `${o2Level}%`, height: '100%', background: o2Level > 50 ? 'rgba(100,255,100,0.8)' : 'rgba(255,200,100,0.8)', borderRadius: 3 }} />
            </div>
            <span>{o2Level.toFixed(1)}%</span>
          </div>
        </div>
        <div className="mb-3">
          <div style={{ fontSize: 9, opacity: 0.6 }}>SUIT PRESSURE</div>
          <div>4.3 PSI</div>
        </div>
        <div className="mb-3">
          <div style={{ fontSize: 9, opacity: 0.6 }}>HEART RATE</div>
          <div style={{ color: heartRate > 85 ? 'rgba(255,200,100,0.9)' : 'rgba(100,255,100,0.9)' }}>
            {Math.floor(heartRate)} BPM
          </div>
        </div>
        <div>
          <div style={{ fontSize: 9, opacity: 0.6 }}>SUIT TEMP</div>
          <div>72°F</div>
        </div>
      </div>

      {/* Right panel - Navigation */}
      <div
        className="absolute right-8 top-1/2 transform -translate-y-1/2 pointer-events-none"
        style={{ fontFamily: 'monospace', color: 'rgba(255,215,0,0.8)', fontSize: 11, width: 120, textAlign: 'right' }}
      >
        <div style={{ borderBottom: '1px solid rgba(255,215,0,0.3)', paddingBottom: 8, marginBottom: 8 }}>
          <div style={{ fontSize: 9, opacity: 0.6 }}>NAVIGATION</div>
        </div>
        <div className="mb-3">
          <div style={{ fontSize: 9, opacity: 0.6 }}>ALTITUDE</div>
          <div>{altitude} km</div>
        </div>
        <div className="mb-3">
          <div style={{ fontSize: 9, opacity: 0.6 }}>VELOCITY</div>
          <div>{velocity} km/s</div>
        </div>
        <div className="mb-3">
          <div style={{ fontSize: 9, opacity: 0.6 }}>ORBIT</div>
          <div>LEO</div>
        </div>
        <div>
          <div style={{ fontSize: 9, opacity: 0.6 }}>NEXT SUNRISE</div>
          <div>{45 - Math.floor(progress * 20)}m</div>
        </div>
      </div>

      {/* Center crosshair */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div style={{ width: 60, height: 60, position: 'relative' }}>
          <div style={{ position: 'absolute', top: '50%', left: 0, width: 20, height: 1, background: 'rgba(255,215,0,0.5)' }} />
          <div style={{ position: 'absolute', top: '50%', right: 0, width: 20, height: 1, background: 'rgba(255,215,0,0.5)' }} />
          <div style={{ position: 'absolute', left: '50%', top: 0, width: 1, height: 20, background: 'rgba(255,215,0,0.5)' }} />
          <div style={{ position: 'absolute', left: '50%', bottom: 0, width: 1, height: 20, background: 'rgba(255,215,0,0.5)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 8, height: 8, border: '1px solid rgba(255,215,0,0.6)', borderRadius: '50%' }} />
        </div>
      </div>

      {/* Bottom warning area */}
      <div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-none text-center"
        style={{ fontFamily: 'monospace', color: 'rgba(255,215,0,0.8)', fontSize: 11 }}
      >
        {progress > 0.5 && (
          <div style={{ color: 'rgba(255,200,100,0.9)', animation: 'pulse 1s infinite' }}>
            ⚠ EVA TIME REMAINING: {Math.floor((1 - progress) * 180)} MIN
          </div>
        )}
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 16: Spacesuit HUD</p>
        <H1>MISSION CONTROL</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Vital data streams across the visor display.</p>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function TestParallaxHeroes() {
  return (
    <main id="main-content">
      {/* Navigation hint */}
      <div className="fixed top-24 right-4 z-50 bg-black/80 border border-[#ffd700]/30 rounded-lg p-4 text-caption text-[#dcdbd5]/80 max-w-[200px]">
        <p className="text-[#ffd700] font-medium mb-2">Space Effects Demo</p>
        <p>16 scroll effects</p>
        <p className="mt-2 text-xs">1-6: Kept favorites</p>
        <p className="text-xs">7-16: Spaceman themed</p>
      </div>

      {/* Kept effects (1-6) */}
      <Effect1RevealMask />
      <Effect2AsteroidBelt />
      <Effect3DiagonalSlashes />
      <Effect4ParticleStorm />
      <Effect5SpiralGalaxy />
      <Effect6ConstellationMap />

      {/* New spaceman-themed effects (7-16) */}
      <Effect7FloatingAstronaut />
      <Effect8SpaceStationOrbit />
      <Effect9RocketLaunchTrail />
      <Effect10EVATether />
      <Effect11HelmetReflection />
      <Effect12ZeroGTools />
      <Effect13LunarSurface />
      <Effect14CapsuleReentry />
      <Effect15SatelliteConstellation />
      <Effect16SpacesuitHUD />

      {/* End section */}
      <section className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center px-4">
          <H2>End of Demo</H2>
          <p className="text-body text-[#dcdbd5] mt-4">Pick your favorite effect!</p>
        </div>
      </section>
    </main>
  );
}
