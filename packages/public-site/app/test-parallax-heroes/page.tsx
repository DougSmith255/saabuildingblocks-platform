'use client';

import { useEffect, useRef, useState } from 'react';
import { H1, H2 } from '@saa/shared/components/saa';

/**
 * Test Page: 11 Space-Themed Scroll Hero Effects
 * All effects show the star background (transparent backgrounds)
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
// EFFECT 1: Reveal Mask (Original Effect 3)
// ============================================================================
function Effect1RevealMask() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);
  const maskSize = 20 + progress * 150;
  const rotation = progress * 90;

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Golden glow reveal - transparent so stars show */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse ${maskSize}% ${maskSize}% at 50% 50%,
            rgba(255,215,0,0.15) 0%, rgba(255,150,0,0.1) 40%, transparent 70%)`,
        }}
      />

      {/* Rotating frames */}
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
// EFFECT 2: Warp Speed / Hyperspace
// ============================================================================
function Effect2WarpSpeed() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  // Streaking lines that elongate with scroll
  const streakLength = 2 + progress * 200;
  const streakOpacity = 0.1 + progress * 0.4;

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Radial warp lines */}
      <div className="absolute inset-0 pointer-events-none" style={{ perspective: '500px' }}>
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 origin-center"
            style={{
              width: `${streakLength}px`,
              height: '2px',
              background: `linear-gradient(90deg, transparent, rgba(255,215,0,${streakOpacity}), rgba(100,180,255,${streakOpacity * 0.5}))`,
              transform: `rotate(${i * 15}deg) translateX(${50 + progress * 100}px)`,
              boxShadow: progress > 0.3 ? `0 0 10px rgba(255,215,0,${streakOpacity})` : 'none',
            }}
          />
        ))}
      </div>

      {/* Central glow */}
      <div
        className="absolute w-32 h-32 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(255,215,0,${0.3 + progress * 0.4}) 0%, transparent 70%)`,
          boxShadow: `0 0 ${60 + progress * 100}px rgba(255,215,0,${0.2 + progress * 0.3})`,
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 2: Warp Speed</p>
        <H1>HYPERSPACE JUMP</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Light streaks elongate as you accelerate into hyperspace.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 3: Orbiting Planets
// ============================================================================
function Effect3OrbitingPlanets() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const planets = [
    { size: 60, orbitRadius: 180, speed: 1, color: 'rgba(255,215,0,0.6)', glow: 'rgba(255,215,0,0.3)' },
    { size: 40, orbitRadius: 280, speed: 1.5, color: 'rgba(100,180,255,0.5)', glow: 'rgba(100,180,255,0.2)' },
    { size: 25, orbitRadius: 350, speed: 2.2, color: 'rgba(255,100,100,0.5)', glow: 'rgba(255,100,100,0.2)' },
  ];

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Central sun */}
      <div
        className="absolute w-20 h-20 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,215,0,0.8) 0%, rgba(255,150,0,0.4) 50%, transparent 70%)',
          boxShadow: `0 0 ${40 + progress * 60}px rgba(255,215,0,0.5)`,
        }}
      />

      {/* Orbit paths */}
      {planets.map((planet, i) => (
        <div
          key={`orbit-${i}`}
          className="absolute rounded-full border border-[#ffd700]/10 pointer-events-none"
          style={{ width: planet.orbitRadius * 2, height: planet.orbitRadius * 2 }}
        />
      ))}

      {/* Orbiting planets */}
      {planets.map((planet, i) => {
        const angle = progress * Math.PI * 2 * planet.speed + (i * Math.PI * 2) / 3;
        const x = Math.cos(angle) * planet.orbitRadius;
        const y = Math.sin(angle) * planet.orbitRadius * 0.4; // Elliptical orbit
        return (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: planet.size,
              height: planet.size,
              background: `radial-gradient(circle at 30% 30%, ${planet.color}, rgba(0,0,0,0.5))`,
              boxShadow: `0 0 20px ${planet.glow}`,
              transform: `translate(${x}px, ${y}px)`,
            }}
          />
        );
      })}

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 3: Orbiting Planets</p>
        <H1>SOLAR SYSTEM</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Planets orbit around a central sun as you scroll.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 4: Spaceship Thrusters
// ============================================================================
function Effect4SpaceshipThrusters() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const thrustLength = 50 + progress * 300;
  const thrustOpacity = 0.3 + progress * 0.5;
  const flicker = Math.sin(progress * 50) * 0.1;

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Spaceship silhouette */}
      <div className="absolute pointer-events-none" style={{ bottom: '30%' }}>
        {/* Ship body */}
        <div
          className="relative"
          style={{
            width: 0,
            height: 0,
            borderLeft: '40px solid transparent',
            borderRight: '40px solid transparent',
            borderBottom: '100px solid rgba(60,60,70,0.8)',
            filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.3))',
          }}
        />

        {/* Left thruster */}
        <div
          className="absolute"
          style={{
            left: '-30px',
            bottom: `-${thrustLength}px`,
            width: '20px',
            height: `${thrustLength}px`,
            background: `linear-gradient(180deg,
              rgba(255,215,0,${thrustOpacity + flicker}) 0%,
              rgba(255,100,0,${thrustOpacity * 0.7}) 30%,
              rgba(255,50,0,${thrustOpacity * 0.3}) 70%,
              transparent 100%)`,
            borderRadius: '0 0 50% 50%',
            filter: `blur(${2 + progress * 3}px)`,
          }}
        />

        {/* Right thruster */}
        <div
          className="absolute"
          style={{
            right: '-30px',
            bottom: `-${thrustLength}px`,
            width: '20px',
            height: `${thrustLength}px`,
            background: `linear-gradient(180deg,
              rgba(255,215,0,${thrustOpacity + flicker}) 0%,
              rgba(255,100,0,${thrustOpacity * 0.7}) 30%,
              rgba(255,50,0,${thrustOpacity * 0.3}) 70%,
              transparent 100%)`,
            borderRadius: '0 0 50% 50%',
            filter: `blur(${2 + progress * 3}px)`,
          }}
        />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 4: Spaceship Thrusters</p>
        <H1>LAUNCH SEQUENCE</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Thruster flames intensify as you power up the engines.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 5: Moon Phases
// ============================================================================
function Effect5MoonPhases() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  // Shadow position simulates moon phases
  const shadowX = -120 + progress * 240; // Moves from left to right

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Moon */}
      <div className="absolute pointer-events-none" style={{ top: '20%', right: '15%' }}>
        <div
          className="relative w-32 h-32 rounded-full overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #e8e8e8 0%, #b8b8b8 50%, #888888 100%)',
            boxShadow: `0 0 ${30 + progress * 40}px rgba(255,255,255,0.3)`,
          }}
        >
          {/* Craters */}
          <div className="absolute w-6 h-6 rounded-full bg-[#999] opacity-30" style={{ top: '20%', left: '30%' }} />
          <div className="absolute w-4 h-4 rounded-full bg-[#999] opacity-25" style={{ top: '50%', left: '60%' }} />
          <div className="absolute w-8 h-8 rounded-full bg-[#999] opacity-20" style={{ top: '60%', left: '25%' }} />

          {/* Shadow overlay for phase */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `linear-gradient(90deg,
                rgba(0,0,0,0.95) 0%,
                rgba(0,0,0,0.95) 45%,
                transparent 55%,
                transparent 100%)`,
              transform: `translateX(${shadowX}px)`,
            }}
          />
        </div>
      </div>

      {/* Moonlight glow on ground */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 100% at 70% 100%,
            rgba(200,200,255,${0.05 + progress * 0.1}) 0%,
            transparent 70%)`,
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 5: Moon Phases</p>
        <H1>LUNAR CYCLE</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Watch the moon transition through its phases as you scroll.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 6: Neon Grid Horizon
// ============================================================================
function Effect6NeonGrid() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const gridPerspective = 200 + progress * 300;
  const sunRise = 100 - progress * 150;

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Neon sun */}
      <div
        className="absolute w-40 h-40 rounded-full pointer-events-none"
        style={{
          bottom: `${sunRise}px`,
          background: `linear-gradient(180deg,
            rgba(255,50,150,0.8) 0%,
            rgba(255,150,0,0.6) 50%,
            rgba(255,215,0,0.4) 100%)`,
          boxShadow: `0 0 60px rgba(255,100,150,0.5), 0 0 120px rgba(255,150,0,0.3)`,
          clipPath: progress > 0.3 ? 'inset(0 0 50% 0)' : 'none',
        }}
      />

      {/* Perspective grid */}
      <div
        className="absolute left-0 right-0 bottom-0 h-[50vh] pointer-events-none"
        style={{
          perspective: `${gridPerspective}px`,
          perspectiveOrigin: '50% 0%',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,0,150,0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,255,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            transform: 'rotateX(75deg)',
            transformOrigin: '50% 0%',
          }}
        />
      </div>

      {/* Horizontal glow line */}
      <div
        className="absolute left-0 right-0 h-[2px] pointer-events-none"
        style={{
          bottom: '50%',
          background: 'linear-gradient(90deg, transparent, rgba(255,0,150,0.8), rgba(0,255,255,0.8), transparent)',
          boxShadow: '0 0 20px rgba(255,0,150,0.5)',
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ff0099]">Effect 6: Neon Grid</p>
        <H1>SYNTHWAVE HORIZON</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Retro-futuristic neon grid with a rising/setting sun.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 7: Alien Encounter
// ============================================================================
function Effect7AlienEncounter() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const beamWidth = 50 + progress * 150;
  const beamOpacity = 0.1 + progress * 0.4;
  const ufoY = -100 + progress * 50;

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* UFO */}
      <div
        className="absolute pointer-events-none"
        style={{ top: `${ufoY}px`, left: '50%', transform: 'translateX(-50%)' }}
      >
        {/* Dome */}
        <div
          className="w-16 h-8 rounded-t-full mx-auto"
          style={{
            background: 'linear-gradient(180deg, rgba(150,200,255,0.6) 0%, rgba(100,150,200,0.4) 100%)',
            boxShadow: '0 0 20px rgba(100,200,255,0.3)',
          }}
        />
        {/* Body */}
        <div
          className="w-40 h-6 rounded-full"
          style={{
            background: 'linear-gradient(180deg, rgba(80,80,90,0.9) 0%, rgba(40,40,50,0.9) 100%)',
            boxShadow: '0 0 15px rgba(100,200,255,0.2)',
          }}
        />
        {/* Lights */}
        <div className="flex justify-around mt-1">
          {[0, 1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                background: i % 2 === 0 ? '#0ff' : '#ff0',
                boxShadow: `0 0 8px ${i % 2 === 0 ? '#0ff' : '#ff0'}`,
                animation: `pulse ${0.5 + i * 0.1}s ease-in-out infinite alternate`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Tractor beam */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: `${ufoY + 50}px`,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: `${beamWidth}px solid transparent`,
          borderRight: `${beamWidth}px solid transparent`,
          borderTop: `${400}px solid rgba(100,255,200,${beamOpacity})`,
          filter: 'blur(10px)',
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#0ff]">Effect 7: Alien Encounter</p>
        <H1>CLOSE ENCOUNTER</H1>
        <p className="text-body text-[#dcdbd5] mt-6">A UFO descends with its tractor beam intensifying.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 8: Nebula Formation
// ============================================================================
function Effect8Nebula() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Nebula clouds */}
      <div
        className="absolute w-[600px] h-[400px] pointer-events-none blur-3xl"
        style={{
          top: '10%',
          left: '10%',
          background: `radial-gradient(ellipse at center,
            rgba(255,100,200,${0.1 + progress * 0.2}) 0%,
            rgba(150,50,255,${0.05 + progress * 0.15}) 40%,
            transparent 70%)`,
          transform: `scale(${1 + progress * 0.3}) rotate(${progress * 20}deg)`,
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] pointer-events-none blur-3xl"
        style={{
          bottom: '5%',
          right: '5%',
          background: `radial-gradient(ellipse at center,
            rgba(100,200,255,${0.1 + progress * 0.15}) 0%,
            rgba(50,100,200,${0.05 + progress * 0.1}) 50%,
            transparent 70%)`,
          transform: `scale(${1 + progress * 0.4}) rotate(${-progress * 15}deg)`,
        }}
      />
      <div
        className="absolute w-[400px] h-[300px] pointer-events-none blur-2xl"
        style={{
          top: '40%',
          left: '30%',
          background: `radial-gradient(ellipse at center,
            rgba(255,215,0,${0.05 + progress * 0.1}) 0%,
            rgba(255,150,0,${0.03 + progress * 0.07}) 50%,
            transparent 70%)`,
          transform: `scale(${1 + progress * 0.2})`,
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 8: Nebula</p>
        <H1>COSMIC CLOUDS</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Colorful nebula clouds expand and swirl as you explore.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 9: Asteroid Belt
// ============================================================================
function Effect9AsteroidBelt() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const asteroids = [...Array(20)].map((_, i) => ({
    x: (i * 137.5) % 100,
    y: 30 + Math.sin(i * 0.8) * 20,
    size: 8 + (i % 5) * 6,
    speed: 0.5 + (i % 3) * 0.3,
    rotation: i * 45,
  }));

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {asteroids.map((asteroid, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `${(asteroid.x + progress * 100 * asteroid.speed) % 120 - 10}%`,
            top: `${asteroid.y + Math.sin(progress * Math.PI * 2 + i) * 5}%`,
            width: asteroid.size,
            height: asteroid.size * 0.7,
            background: `linear-gradient(135deg, rgba(120,110,100,0.8) 0%, rgba(60,55,50,0.9) 100%)`,
            borderRadius: '30% 70% 50% 50%',
            transform: `rotate(${asteroid.rotation + progress * 180}deg)`,
            boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.5), 1px 1px 2px rgba(255,255,255,0.1)',
          }}
        />
      ))}

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 9: Asteroid Belt</p>
        <H1>SPACE DEBRIS</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Navigate through a field of tumbling asteroids.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 10: Astronaut Drift
// ============================================================================
function Effect10AstronautDrift() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const floatY = Math.sin(progress * Math.PI * 4) * 30;
  const floatX = Math.cos(progress * Math.PI * 2) * 20;
  const rotation = progress * 360;

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Astronaut (simplified geometric) */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '25%',
          right: '20%',
          transform: `translate(${floatX}px, ${floatY}px) rotate(${rotation * 0.1}deg)`,
        }}
      >
        {/* Helmet */}
        <div
          className="w-16 h-16 rounded-full mx-auto relative"
          style={{
            background: 'linear-gradient(135deg, rgba(200,200,220,0.9) 0%, rgba(100,100,120,0.9) 100%)',
            boxShadow: '0 0 20px rgba(255,215,0,0.2)',
          }}
        >
          {/* Visor */}
          <div
            className="absolute inset-2 rounded-full"
            style={{
              background: 'linear-gradient(135deg, rgba(255,200,100,0.4) 0%, rgba(100,50,0,0.6) 100%)',
              boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.3)',
            }}
          />
        </div>
        {/* Body */}
        <div
          className="w-14 h-20 rounded-lg mx-auto -mt-2"
          style={{
            background: 'linear-gradient(180deg, rgba(220,220,230,0.9) 0%, rgba(180,180,190,0.9) 100%)',
          }}
        />
        {/* Backpack */}
        <div
          className="absolute w-10 h-14 rounded -right-3 top-16"
          style={{
            background: 'linear-gradient(90deg, rgba(150,150,160,0.9) 0%, rgba(100,100,110,0.9) 100%)',
          }}
        />
      </div>

      {/* Tether line */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.3 }}>
        <path
          d={`M 50% 100% Q ${50 + floatX * 0.5}% ${60 + floatY * 0.3}% ${80 + floatX * 0.1}% ${25 + floatY * 0.5}%`}
          stroke="#ffd700"
          strokeWidth="2"
          fill="none"
          strokeDasharray="5,5"
        />
      </svg>

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 10: Astronaut</p>
        <H1>SPACEWALK</H1>
        <p className="text-body text-[#dcdbd5] mt-6">An astronaut drifts peacefully in zero gravity.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 11: Black Hole
// ============================================================================
function Effect11BlackHole() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const accretionRotation = progress * 720;
  const eventHorizonSize = 60 + progress * 40;
  const distortionStrength = progress * 20;

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Accretion disk */}
      <div
        className="absolute w-80 h-80 pointer-events-none"
        style={{
          transform: `rotateX(75deg) rotate(${accretionRotation}deg)`,
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(
              from 0deg,
              rgba(255,100,0,0.6) 0deg,
              rgba(255,200,0,0.8) 90deg,
              rgba(255,255,200,0.9) 180deg,
              rgba(255,200,0,0.8) 270deg,
              rgba(255,100,0,0.6) 360deg
            )`,
            filter: `blur(${3 + progress * 5}px)`,
            boxShadow: `0 0 ${40 + progress * 60}px rgba(255,150,0,0.5)`,
          }}
        />
      </div>

      {/* Event horizon (black center) */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: eventHorizonSize,
          height: eventHorizonSize,
          background: 'radial-gradient(circle, #000 0%, #000 70%, transparent 100%)',
          boxShadow: `
            0 0 ${20 + progress * 30}px #000,
            0 0 ${40 + progress * 50}px rgba(0,0,0,0.8)
          `,
        }}
      />

      {/* Gravitational lensing effect (ring of light) */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: eventHorizonSize + 20,
          height: eventHorizonSize + 20,
          border: '2px solid rgba(255,215,0,0.6)',
          boxShadow: `0 0 15px rgba(255,215,0,0.4), inset 0 0 15px rgba(255,215,0,0.2)`,
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-4xl mt-40">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 11: Black Hole</p>
        <H1>EVENT HORIZON</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Matter spirals into the void of a supermassive black hole.</p>
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
        <p>11 scroll effects - all show stars behind</p>
      </div>

      <Effect1RevealMask />
      <Effect2WarpSpeed />
      <Effect3OrbitingPlanets />
      <Effect4SpaceshipThrusters />
      <Effect5MoonPhases />
      <Effect6NeonGrid />
      <Effect7AlienEncounter />
      <Effect8Nebula />
      <Effect9AsteroidBelt />
      <Effect10AstronautDrift />
      <Effect11BlackHole />

      {/* End section */}
      <section className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center px-4">
          <H2>End of Demo</H2>
          <p className="text-body text-[#dcdbd5] mt-4">Pick your favorite space effect!</p>
        </div>
      </section>
    </main>
  );
}
