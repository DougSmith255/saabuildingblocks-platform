'use client';

import { useEffect, useRef, useState } from 'react';
import { H1, H2 } from '@saa/shared/components/saa';

/**
 * Test Page: 13 Space-Themed Scroll Hero Effects
 * KEEPING: Effect 1 (Reveal Mask), Effect 2 (Asteroid Belt), Effect 3 (Diagonal Slashes)
 * NEW: 10 varied effects - no plain lines, more interesting visuals
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
// EFFECT 2: Asteroid Belt (KEPT - lowered more)
// ============================================================================
function Effect2AsteroidBelt() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  // Asteroids in a lower horizontal band (55-65% of viewport)
  const asteroids = [...Array(24)].map((_, i) => ({
    x: (i * 137.5) % 100,
    y: 52 + Math.sin(i * 0.8) * 6, // Lowered to 52% center with 6% spread
    size: 10 + (i % 5) * 7,
    speed: 0.5 + (i % 3) * 0.3,
    rotation: i * 45,
  }));

  return (
    <section ref={ref} className="relative min-h-[75vh] flex items-center justify-center overflow-hidden">
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
// EFFECT 3: Diagonal Slashes (KEPT - was Effect 5)
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
// EFFECT 4: Nebula Cloud (NEW - organic cloud shapes)
// ============================================================================
function Effect4NebulaCloud() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const clouds = [
    { x: 20, y: 30, size: 400, color: 'rgba(255,180,0,0.15)', delay: 0 },
    { x: 70, y: 25, size: 350, color: 'rgba(255,215,0,0.12)', delay: 0.1 },
    { x: 40, y: 60, size: 500, color: 'rgba(255,150,0,0.1)', delay: 0.05 },
    { x: 80, y: 70, size: 300, color: 'rgba(255,200,0,0.14)', delay: 0.15 },
    { x: 10, y: 65, size: 380, color: 'rgba(255,215,0,0.11)', delay: 0.08 },
  ];

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {clouds.map((cloud, i) => {
        const adjustedProgress = Math.max(0, (progress - cloud.delay) * 1.2);
        const scale = 0.3 + adjustedProgress * 1.2;
        const opacity = Math.min(1, adjustedProgress * 1.5);
        return (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${cloud.x}%`,
              top: `${cloud.y}%`,
              width: cloud.size,
              height: cloud.size * 0.6,
              background: `radial-gradient(ellipse at center, ${cloud.color} 0%, transparent 70%)`,
              transform: `translate(-50%, -50%) scale(${scale}) rotate(${i * 30 + progress * 20}deg)`,
              opacity,
              filter: `blur(${40 + progress * 20}px)`,
            }}
          />
        );
      })}

      {/* Central bright core */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 100 + progress * 200,
          height: 100 + progress * 200,
          background: `radial-gradient(circle, rgba(255,255,255,${0.2 * progress}) 0%, rgba(255,215,0,${0.15 * progress}) 30%, transparent 70%)`,
          filter: 'blur(20px)',
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 4: Nebula Cloud</p>
        <H1>COSMIC NURSERY</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Ethereal gas clouds drift through space.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 5: Hexagonal Grid (NEW - honeycomb pattern)
// ============================================================================
function Effect5HexagonalGrid() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const hexagons: { x: number; y: number; delay: number }[] = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 12; col++) {
      const xOffset = row % 2 === 0 ? 0 : 4.5;
      hexagons.push({
        x: col * 9 + xOffset,
        y: row * 13,
        delay: (row + col) * 0.02,
      });
    }
  }

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {hexagons.map((hex, i) => {
        const adjustedProgress = Math.max(0, Math.min(1, (progress - hex.delay) * 2));
        const opacity = adjustedProgress * 0.4;
        const scale = 0.5 + adjustedProgress * 0.5;
        return (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: `${hex.x}%`,
              top: `${hex.y}%`,
              width: '80px',
              height: '92px',
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              background: `linear-gradient(180deg, rgba(255,215,0,${opacity}) 0%, rgba(255,180,0,${opacity * 0.5}) 100%)`,
              transform: `scale(${scale})`,
              boxShadow: adjustedProgress > 0.5 ? `0 0 20px rgba(255,215,0,${opacity * 0.5})` : 'none',
            }}
          />
        );
      })}

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 5: Hexagonal Grid</p>
        <H1>DIGITAL MATRIX</H1>
        <p className="text-body text-[#dcdbd5] mt-6">A honeycomb pattern materializes from the void.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 6: Orbiting Rings (NEW - 3D ring system)
// ============================================================================
function Effect6OrbitingRings() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const rings = [
    { size: 300, tilt: 75, speed: 1, color: 'rgba(255,215,0,0.4)' },
    { size: 400, tilt: 60, speed: -0.7, color: 'rgba(255,180,0,0.3)' },
    { size: 500, tilt: 80, speed: 0.5, color: 'rgba(255,200,0,0.25)' },
    { size: 350, tilt: 45, speed: -1.2, color: 'rgba(255,215,0,0.35)' },
  ];

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      <div className="absolute" style={{ perspective: '1000px' }}>
        {rings.map((ring, i) => (
          <div
            key={i}
            className="absolute rounded-full border-2 pointer-events-none"
            style={{
              width: ring.size + progress * 100,
              height: ring.size + progress * 100,
              left: '50%',
              top: '50%',
              borderColor: ring.color,
              transform: `translate(-50%, -50%) rotateX(${ring.tilt}deg) rotateZ(${progress * 360 * ring.speed}deg)`,
              boxShadow: `0 0 ${20 + progress * 30}px ${ring.color}, inset 0 0 ${10 + progress * 20}px ${ring.color}`,
            }}
          />
        ))}

        {/* Central orb */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 60 + progress * 40,
            height: 60 + progress * 40,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle, rgba(255,255,255,${0.6 + progress * 0.4}) 0%, rgba(255,215,0,${0.4 + progress * 0.3}) 40%, transparent 70%)`,
            boxShadow: `0 0 ${40 + progress * 60}px rgba(255,215,0,0.5)`,
          }}
        />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 6: Orbiting Rings</p>
        <H1>CELESTIAL DANCE</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Orbital rings spin around a glowing core.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 7: Particle Storm (NEW - scattered particles)
// ============================================================================
function Effect7ParticleStorm() {
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
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 7: Particle Storm</p>
        <H1>SOLAR WIND</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Charged particles scatter through the cosmos.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 8: Warp Tunnel (NEW - hyperspace effect)
// ============================================================================
function Effect8WarpTunnel() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const streaks = [...Array(40)].map((_, i) => ({
    angle: (i / 40) * 360,
    length: 100 + Math.random() * 200,
    width: 1 + Math.random() * 3,
    distance: 20 + Math.random() * 30,
  }));

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Streaking lines from center */}
      {streaks.map((streak, i) => {
        const stretchFactor = 1 + progress * 3;
        const opacity = 0.2 + progress * 0.4;
        return (
          <div
            key={i}
            className="absolute pointer-events-none origin-center"
            style={{
              left: '50%',
              top: '50%',
              width: streak.length * stretchFactor,
              height: streak.width,
              background: `linear-gradient(90deg, transparent 0%, rgba(255,215,0,${opacity}) 30%, rgba(255,255,255,${opacity * 0.8}) 50%, rgba(255,215,0,${opacity}) 70%, transparent 100%)`,
              transform: `rotate(${streak.angle}deg) translateX(${streak.distance + progress * 100}px)`,
              transformOrigin: 'left center',
            }}
          />
        );
      })}

      {/* Central vortex */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 150 - progress * 100,
          height: 150 - progress * 100,
          background: `radial-gradient(circle, rgba(0,0,0,0.8) 0%, rgba(255,215,0,${0.3 * progress}) 50%, transparent 100%)`,
          boxShadow: `0 0 ${50 + progress * 50}px rgba(255,215,0,0.4)`,
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 8: Warp Tunnel</p>
        <H1>LIGHTSPEED</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Stars streak past as you enter hyperspace.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 9: Shattered Glass (NEW - fragmented planes)
// ============================================================================
function Effect9ShatteredGlass() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const shards = [...Array(25)].map((_, i) => ({
    x: 10 + (i % 5) * 20,
    y: 10 + Math.floor(i / 5) * 20,
    rotation: Math.random() * 60 - 30,
    size: 80 + Math.random() * 100,
    delay: Math.random() * 0.3,
  }));

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {shards.map((shard, i) => {
        const adjustedProgress = Math.max(0, (progress - shard.delay) * 1.5);
        const moveX = (shard.x - 50) * adjustedProgress * 0.5;
        const moveY = (shard.y - 50) * adjustedProgress * 0.5;
        const opacity = 0.15 + adjustedProgress * 0.25;
        return (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: `${shard.x + moveX}%`,
              top: `${shard.y + moveY}%`,
              width: shard.size,
              height: shard.size * 0.8,
              background: `linear-gradient(${135 + shard.rotation}deg, rgba(255,215,0,${opacity}) 0%, rgba(255,255,255,${opacity * 0.3}) 50%, rgba(255,180,0,${opacity * 0.8}) 100%)`,
              clipPath: 'polygon(20% 0%, 80% 10%, 100% 60%, 70% 100%, 10% 80%)',
              transform: `rotate(${shard.rotation + adjustedProgress * 20}deg)`,
              boxShadow: adjustedProgress > 0.3 ? `0 0 20px rgba(255,215,0,${opacity * 0.5})` : 'none',
            }}
          />
        );
      })}

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 9: Shattered Glass</p>
        <H1>FRACTURED REALITY</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Space-time splinters into golden fragments.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 10: Pulsing Orbs (NEW - floating spheres)
// ============================================================================
function Effect10PulsingOrbs() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const orbs = [
    { x: 15, y: 25, size: 120, phase: 0 },
    { x: 75, y: 20, size: 100, phase: 0.5 },
    { x: 85, y: 60, size: 140, phase: 0.25 },
    { x: 25, y: 70, size: 110, phase: 0.75 },
    { x: 50, y: 45, size: 160, phase: 0.33 },
    { x: 60, y: 80, size: 90, phase: 0.66 },
    { x: 35, y: 15, size: 80, phase: 0.1 },
  ];

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {orbs.map((orb, i) => {
        const pulse = Math.sin((progress + orb.phase) * Math.PI * 3);
        const scale = 0.8 + pulse * 0.3 + progress * 0.4;
        const opacity = 0.3 + pulse * 0.2 + progress * 0.2;
        const floatY = Math.sin((progress + orb.phase) * Math.PI * 2) * 20;
        return (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${orb.x}%`,
              top: `${orb.y}%`,
              width: orb.size,
              height: orb.size,
              transform: `translate(-50%, calc(-50% + ${floatY}px)) scale(${scale})`,
              background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,${opacity * 0.5}) 0%, rgba(255,215,0,${opacity}) 30%, rgba(255,180,0,${opacity * 0.5}) 60%, transparent 100%)`,
              boxShadow: `0 0 ${30 + pulse * 20}px rgba(255,215,0,${opacity * 0.6}), inset 0 0 ${20 + pulse * 10}px rgba(255,255,255,${opacity * 0.2})`,
            }}
          />
        );
      })}

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 10: Pulsing Orbs</p>
        <H1>ENERGY SPHERES</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Glowing orbs pulse with cosmic energy.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 11: Lightning Network (NEW - branching electricity)
// ============================================================================
function Effect11LightningNetwork() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  // Generate lightning bolt paths
  const generateLightningPath = (startX: number, startY: number, seed: number) => {
    let path = `M ${startX} ${startY}`;
    let x = startX;
    let y = startY;
    const segments = 8;
    for (let i = 0; i < segments; i++) {
      x += (Math.sin(seed + i) * 60) + 30;
      y += 80 + Math.cos(seed + i) * 40;
      path += ` L ${x} ${y}`;
    }
    return path;
  };

  const bolts = [
    { startX: 100, startY: 0, seed: 1 },
    { startX: 300, startY: 0, seed: 2.5 },
    { startX: 500, startY: 0, seed: 4 },
    { startX: 700, startY: 0, seed: 5.5 },
    { startX: 900, startY: 0, seed: 7 },
  ];

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid slice">
        {bolts.map((bolt, i) => {
          const opacity = Math.max(0, Math.sin((progress * 3 + i * 0.5) * Math.PI) * 0.8);
          const pathLength = progress * 1000;
          return (
            <g key={i}>
              <path
                d={generateLightningPath(bolt.startX, bolt.startY, bolt.seed)}
                stroke={`rgba(255,215,0,${opacity})`}
                strokeWidth="3"
                fill="none"
                strokeDasharray={pathLength}
                strokeDashoffset={1000 - pathLength}
                style={{
                  filter: `drop-shadow(0 0 10px rgba(255,215,0,${opacity})) drop-shadow(0 0 20px rgba(255,215,0,${opacity * 0.5}))`,
                }}
              />
              {/* Glow layer */}
              <path
                d={generateLightningPath(bolt.startX, bolt.startY, bolt.seed)}
                stroke={`rgba(255,255,255,${opacity * 0.5})`}
                strokeWidth="1"
                fill="none"
                strokeDasharray={pathLength}
                strokeDashoffset={1000 - pathLength}
              />
            </g>
          );
        })}
      </svg>

      {/* Node points where lightning connects */}
      {[...Array(8)].map((_, i) => {
        const pulseIntensity = Math.sin((progress * 4 + i * 0.3) * Math.PI);
        return (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${15 + i * 12}%`,
              top: `${30 + Math.sin(i * 1.5) * 20}%`,
              width: 15 + pulseIntensity * 10,
              height: 15 + pulseIntensity * 10,
              background: `radial-gradient(circle, rgba(255,255,255,${0.8 * Math.max(0, pulseIntensity)}) 0%, rgba(255,215,0,${0.5 * Math.max(0, pulseIntensity)}) 50%, transparent 100%)`,
              boxShadow: `0 0 ${20 + pulseIntensity * 20}px rgba(255,215,0,${0.5 * Math.max(0, pulseIntensity)})`,
            }}
          />
        );
      })}

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 11: Lightning Network</p>
        <H1>ELECTRIC STORM</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Energy arcs between cosmic nodes.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 12: Spiral Galaxy (NEW - rotating spiral arms)
// ============================================================================
function Effect12SpiralGalaxy() {
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
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 12: Spiral Galaxy</p>
        <H1>COSMIC VORTEX</H1>
        <p className="text-body text-[#dcdbd5] mt-6">A spiral galaxy rotates in the void.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 13: Constellation Map (NEW - connected star patterns)
// ============================================================================
function Effect13ConstellationMap() {
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
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 13: Constellation Map</p>
        <H1>STAR CHART</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Ancient patterns emerge in the night sky.</p>
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
        <p>13 scroll effects</p>
      </div>

      <Effect1RevealMask />
      <Effect2AsteroidBelt />
      <Effect3DiagonalSlashes />
      <Effect4NebulaCloud />
      <Effect5HexagonalGrid />
      <Effect6OrbitingRings />
      <Effect7ParticleStorm />
      <Effect8WarpTunnel />
      <Effect9ShatteredGlass />
      <Effect10PulsingOrbs />
      <Effect11LightningNetwork />
      <Effect12SpiralGalaxy />
      <Effect13ConstellationMap />

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
