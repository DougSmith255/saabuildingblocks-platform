'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { H1, H2 } from '@saa/shared/components/saa';
import Image from 'next/image';

/**
 * Test Page: 9 Scroll Hero Effects
 * Effects 1-5: Reveal Mask, Asteroid Belt, Particle Storm, Spiral Galaxy, Constellation Map
 * Effects 6-9: Satellite Constellation, Quantum Grid, Laser Grid, Data Stream
 * DELETED: Lunar Surface, Plasma Storm, Energy Shield, Light Bars
 */

// Initial progress offset - all effects start at this progress value on page load
const INITIAL_PROGRESS = 0.35;

// Hook to track scroll position with smoothing + intro animation
// Effects start at 0 and auto-animate to INITIAL_PROGRESS on page load
function useScrollProgress(ref: React.RefObject<HTMLElement | null>, smoothFactor = 0.08) {
  const [progress, setProgress] = useState(0); // Start at 0 for intro animation
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const rafRef = useRef<number>(0);
  const introCompleteRef = useRef(false);
  const introStartTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const INTRO_DURATION = 1500; // 1.5 seconds for intro animation (0.35 progress)

    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      // Progress starts at INITIAL_PROGRESS when hero top is at viewport top
      // Progress 1 = hero fully scrolled out
      const scrollProgress = Math.max(0, Math.min(1, -rect.top / rect.height));
      // Add initial offset and scale so scrolling from 0 takes us from INITIAL_PROGRESS to 1
      const adjustedProgress = INITIAL_PROGRESS + scrollProgress * (1 - INITIAL_PROGRESS);
      targetRef.current = adjustedProgress;
    };

    const animate = (timestamp: number) => {
      // Handle intro animation first
      if (!introCompleteRef.current) {
        if (introStartTimeRef.current === null) {
          introStartTimeRef.current = timestamp;
        }
        const elapsed = timestamp - introStartTimeRef.current;
        const introProgress = Math.min(1, elapsed / INTRO_DURATION);

        // Ease out cubic for smooth deceleration
        const eased = 1 - Math.pow(1 - introProgress, 3);
        const introValue = eased * INITIAL_PROGRESS;

        currentRef.current = introValue;
        targetRef.current = Math.max(targetRef.current, introValue);
        setProgress(introValue);

        if (introProgress >= 1) {
          introCompleteRef.current = true;
          currentRef.current = INITIAL_PROGRESS;
          targetRef.current = INITIAL_PROGRESS;
        }
      } else {
        // Normal scroll-based animation after intro
        const diff = targetRef.current - currentRef.current;
        if (Math.abs(diff) > 0.0001) {
          currentRef.current += diff * smoothFactor;
          setProgress(currentRef.current);
        }
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
// EFFECT 1: Reveal Mask - REVERSED: starts big, shrinks on scroll
// Gradient edge stays within hero (smaller size range)
// ============================================================================
function Effect1RevealMask() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);
  // REVERSED: Start at 70%, shrink to small (20%) as user scrolls - stays within hero bounds
  const maskSize = 70 - progress * 50;
  const rotation = progress * 90;
  // Fade out the effect as we scroll past 60%
  const fadeOut = progress > 0.6 ? 1 - (progress - 0.6) / 0.4 : 1;

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse ${maskSize}% ${maskSize}% at 50% 50%,
            rgba(255,215,0,${0.15 * fadeOut}) 0%, rgba(255,150,0,${0.1 * fadeOut}) 40%, transparent 70%)`,
        }}
      />
      <div
        className="absolute w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] border-2 pointer-events-none"
        style={{
          transform: `rotate(${rotation}deg)`,
          borderRadius: `${20 + progress * 30}%`,
          borderColor: `rgba(255,215,0,${0.3 * fadeOut})`,
        }}
      />
      <div
        className="absolute w-[60vw] h-[60vw] max-w-[450px] max-h-[450px] border pointer-events-none"
        style={{
          transform: `rotate(${-rotation * 0.5}deg)`,
          borderRadius: `${50 - progress * 30}%`,
          borderColor: `rgba(255,215,0,${0.2 * fadeOut})`,
        }}
      />
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 1: Reveal Mask</p>
        <H1>CONTRACTING PORTAL</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Golden glow contracts as you scroll.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 2: Asteroid Belt (KEPT)
// ============================================================================
function Effect2AsteroidBelt() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const asteroids = [...Array(32)].map((_, i) => ({
    x: (i * 137.5) % 100,
    y: 60 + Math.sin(i * 0.8) * 12,
    size: 12 + (i % 5) * 8,
    speed: 0.5 + (i % 3) * 0.3,
    rotation: i * 45,
  }));

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
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
// EFFECT 3: Particle Storm (was Effect 4, renumbered)
// ============================================================================
function Effect3ParticleStorm() {
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
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 3: Particle Storm</p>
        <H1>SOLAR WIND</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Charged particles scatter through the cosmos.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 4: Spiral Galaxy (was Effect 5, renumbered)
// ============================================================================
function Effect4SpiralGalaxy() {
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
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 4: Spiral Galaxy</p>
        <H1>COSMIC VORTEX</H1>
        <p className="text-body text-[#dcdbd5] mt-6">A spiral galaxy rotates in the void.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 5: Constellation Map - NO earth, NO blue bg, purple/blue stars
// ============================================================================
function Effect5ConstellationMap() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  // Stars positioned across the screen
  const stars = [
    { x: 15, y: 20 }, { x: 25, y: 35 }, { x: 40, y: 25 }, { x: 35, y: 45 },
    { x: 55, y: 30 }, { x: 65, y: 15 }, { x: 75, y: 40 }, { x: 85, y: 25 },
    { x: 20, y: 60 }, { x: 45, y: 65 }, { x: 60, y: 55 }, { x: 80, y: 70 },
    { x: 30, y: 80 }, { x: 50, y: 85 }, { x: 70, y: 75 }, { x: 90, y: 60 },
  ];

  // 50/50 left/right connections - alternating directions
  const connections = [
    [0, 1], [2, 1], [2, 3], [4, 3], [4, 5], [6, 5], [6, 7], // Alternating
    [8, 9], [10, 9], [10, 11], [12, 13], [14, 13], [14, 15], // Alternating
    [1, 8], [3, 9], [4, 10], [6, 11], [9, 13], [10, 14], // Cross connections (mixed)
  ];

  // Alternate between purple and blue for each star
  const getStarColor = (index: number) => {
    const colors = [
      { r: 180, g: 100, b: 255 }, // Purple
      { r: 100, g: 180, b: 255 }, // Blue
      { r: 200, g: 120, b: 255 }, // Light purple
      { r: 80, g: 160, b: 255 },  // Bright blue
    ];
    return colors[index % colors.length];
  };

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* No background gradient - removed blue radiating gradient */}

      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {connections.map(([from, to], i) => {
          // Faster line drawing so they're visible earlier
          const delay = i * 0.01;
          const lineProgress = Math.max(0, Math.min(1, (progress - delay) * 2.5));
          const opacity = lineProgress * 0.5;
          // Alternate line colors between purple and blue
          const lineColor = i % 2 === 0 ? `rgba(180,100,255,${opacity})` : `rgba(100,180,255,${opacity})`;
          return (
            <line
              key={i}
              x1={`${stars[from].x}%`}
              y1={`${stars[from].y}%`}
              x2={`${stars[from].x + (stars[to].x - stars[from].x) * lineProgress}%`}
              y2={`${stars[from].y + (stars[to].y - stars[from].y) * lineProgress}%`}
              stroke={lineColor}
              strokeWidth="1"
              style={{ filter: `drop-shadow(0 0 3px ${lineColor})` }}
            />
          );
        })}
      </svg>

      {stars.map((star, i) => {
        // Stars appear faster with less delay
        const delay = i * 0.015;
        const starProgress = Math.max(0, (progress - delay) * 2);
        const pulse = Math.sin((progress * 3 + i * 0.5) * Math.PI);
        const size = 6 + starProgress * 4 + pulse * 2;
        const color = getStarColor(i);
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
              background: `radial-gradient(circle, rgba(255,255,255,${0.9 * Math.min(1, starProgress)}) 0%, rgba(${color.r},${color.g},${color.b},${0.7 * Math.min(1, starProgress)}) 50%, transparent 100%)`,
              boxShadow: `0 0 ${10 + pulse * 5}px rgba(${color.r},${color.g},${color.b},${0.6 * Math.min(1, starProgress)})`,
            }}
          />
        );
      })}

      {/* Earth removed */}

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 5: Constellation Map</p>
        <H1>STAR CHART</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Ancient patterns emerge in the night sky.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 6: Satellite Constellation - with CSS Earth (was Effect 7/8)
// ============================================================================
function Effect6SatelliteConstellation() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  // 11 satellites total (4+3+4)
  const orbits = [
    { satellites: 4, radius: 35, speed: 1, tilt: 20 },
    { satellites: 3, radius: 25, speed: -0.7, tilt: -15 },
    { satellites: 4, radius: 45, speed: 0.5, tilt: 10 },
  ];

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Subtle blue radiating gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 50%,
            rgba(40,80,140,0.12) 0%,
            rgba(30,60,120,0.06) 40%,
            transparent 70%)`,
        }}
      />

      {/* CSS Earth with realistic continents */}
      <div
        className="absolute rounded-full pointer-events-none overflow-hidden"
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

      {orbits.map((orbit, orbitIndex) => (
        <div key={orbitIndex} className="absolute inset-0 pointer-events-none">
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
                    background: `radial-gradient(circle, rgba(255,215,0,${0.2 + Math.sin(progress * Math.PI * 4 + satIndex) * 0.1}), transparent 70%)`,
                  }}
                />
              </div>
            );
          })}
        </div>
      ))}

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
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 6: Satellite Constellation</p>
        <H1>GLOBAL NETWORK</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Satellites weave a web around Earth.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 7: Quantum Grid - extended to 95%, starts at 0.3
// ============================================================================
function Effect7QuantumGrid() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const gridLines = 24;

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Perspective grid at TOP extending to 95% */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          perspective: '500px',
          perspectiveOrigin: '50% 100%',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '-50%',
            right: '-50%',
            top: 0,
            height: '95%', // Extended even further
            transform: 'rotateX(-70deg)',
            transformOrigin: 'top center',
          }}
        >
          {/* Horizontal lines - pulse visible on load */}
          {[...Array(gridLines)].map((_, i) => {
            const y = (i / gridLines) * 100;
            const pulseY = progress * 100;
            const pulseHit = Math.abs(y - pulseY) < 8;
            return (
              <div
                key={`h-${i}`}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: `${y}%`,
                  height: pulseHit ? 2 : 1,
                  background: pulseHit
                    ? `rgba(255,215,0,${0.8})`
                    : `rgba(255,215,0,${0.15 + (y / 100) * 0.2})`,
                  boxShadow: pulseHit ? '0 0 15px rgba(255,215,0,0.6)' : 'none',
                }}
              />
            );
          })}
          {/* Vertical lines */}
          {[...Array(gridLines * 2)].map((_, i) => {
            const x = (i / (gridLines * 2)) * 100;
            return (
              <div
                key={`v-${i}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: `${x}%`,
                  width: 1,
                  background: `linear-gradient(0deg, rgba(255,215,0,0.05), rgba(255,215,0,0.25))`,
                }}
              />
            );
          })}
        </div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 7: Quantum Grid</p>
        <H1>DIGITAL HORIZON</H1>
        <p className="text-body text-[#dcdbd5] mt-6">A neon grid stretches to infinity.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 8: Laser Grid - lasers RETRACT off screen
// ============================================================================
function Effect8LaserGrid() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

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
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Horizontal laser beams - start full width, retract to edges */}
      {horizontalBeams.map((beam, i) => {
        const beamProgress = Math.max(0, Math.min(1, (progress - beam.delay) * beam.speed * 1.2));
        // Start at full width (100%), shrink from both ends
        const width = Math.max(0, 100 - beamProgress * 120);
        const leftOffset = (100 - width) / 2;
        const opacity = width > 5 ? 1 : width / 5;

        return width > 0 ? (
          <div
            key={`h-${i}`}
            className="absolute pointer-events-none"
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

      {/* Vertical laser beams - same retraction behavior */}
      {verticalBeams.map((beam, i) => {
        const beamProgress = Math.max(0, Math.min(1, (progress - beam.delay) * beam.speed * 1.2));
        const height = Math.max(0, 100 - beamProgress * 120);
        const topOffset = (100 - height) / 2;
        const opacity = height > 5 ? 1 : height / 5;

        return height > 0 ? (
          <div
            key={`v-${i}`}
            className="absolute pointer-events-none"
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

      {/* Intersection sparks - visible while beams overlap */}
      {horizontalBeams.map((hBeam, hi) =>
        verticalBeams.map((vBeam, vi) => {
          const hProgress = Math.max(0, Math.min(1, (progress - hBeam.delay) * hBeam.speed * 1.2));
          const vProgress = Math.max(0, Math.min(1, (progress - vBeam.delay) * vBeam.speed * 1.2));
          // Spark visible when both beams still have width/height at intersection
          const hWidth = Math.max(0, 100 - hProgress * 120);
          const vHeight = Math.max(0, 100 - vProgress * 120);
          const hLeft = (100 - hWidth) / 2;
          const hRight = hLeft + hWidth;
          const vTop = (100 - vHeight) / 2;
          const vBottom = vTop + vHeight;

          const beamX = vBeam.x;
          const beamY = hBeam.y;
          const sparkVisible = beamX > hLeft && beamX < hRight && beamY > vTop && beamY < vBottom;

          const pulse = Math.sin(progress * 20 + hi + vi);
          const sparkOpacity = sparkVisible ? 0.8 : 0;

          return sparkVisible ? (
            <div
              key={`spark-${hi}-${vi}`}
              className="absolute rounded-full pointer-events-none"
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

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 8: Laser Grid</p>
        <H1>SECURITY BREACH</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Red lasers crisscross the darkness.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 9: Data Stream - streams extend to base (100%) with fade
// ============================================================================
function Effect9DataStream() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const columns = [...Array(25)].map((_, i) => ({
    x: i * 4,
    speed: 0.5 + (i % 4) * 0.3,
    length: 5 + (i % 6),
    delay: (i * 0.02) % 0.4,
    chars: [...Array(22)].map(() => String.fromCharCode(0x30A0 + Math.random() * 96)),
  }));

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Data columns - extended to full height with fade at bottom */}
      {columns.map((col, i) => {
        const colProgress = Math.max(0, (progress - col.delay) * col.speed * 2);
        const yOffset = colProgress * 100;

        return (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: `${col.x}%`,
              top: 0,
              width: '4%',
              height: '100%',
              overflow: 'hidden',
              fontFamily: 'monospace',
              fontSize: '14px',
              lineHeight: '1.2',
            }}
          >
            {col.chars.map((char, j) => {
              const charY = ((j * 5 + yOffset) % 105);
              const isHead = j === Math.floor(colProgress * col.chars.length) % col.chars.length;
              const brightness = isHead ? 1 : Math.max(0, 1 - j * 0.06);
              // Fade out at bottom - starts fading at 70%, fully faded by 100%
              const fadeAtBottom = charY > 70 ? Math.max(0, 1 - (charY - 70) / 30) : 1;

              return (
                <div
                  key={j}
                  style={{
                    position: 'absolute',
                    top: `${charY}%`,
                    color: isHead ? `rgba(255,255,255,${0.95 * fadeAtBottom})` : `rgba(100,255,100,${brightness * 0.7 * fadeAtBottom})`,
                    textShadow: isHead ? `0 0 15px rgba(100,255,100,${0.8 * fadeAtBottom})` : `0 0 5px rgba(100,255,100,${brightness * 0.3 * fadeAtBottom})`,
                  }}
                >
                  {char}
                </div>
              );
            })}
          </div>
        );
      })}

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 9: Data Stream</p>
        <H1>DIGITAL RAIN</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Code cascades through the network.</p>
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
        <p>9 scroll effects</p>
        <p className="mt-2 text-xs">Auto-play intro to {INITIAL_PROGRESS}</p>
      </div>

      {/* Effects 1-9 (Lunar Surface removed) */}
      <Effect1RevealMask />
      <Effect2AsteroidBelt />
      <Effect3ParticleStorm />
      <Effect4SpiralGalaxy />
      <Effect5ConstellationMap />
      <Effect6SatelliteConstellation />
      <Effect7QuantumGrid />
      <Effect8LaserGrid />
      <Effect9DataStream />

      {/* End section */}
      <section className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center px-4">
          <H2>End of Demo</H2>
          <p className="text-body text-[#dcdbd5] mt-4">9 effects ready for editing!</p>
        </div>
      </section>
    </main>
  );
}
