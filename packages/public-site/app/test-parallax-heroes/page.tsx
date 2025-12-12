'use client';

import { useEffect, useRef, useState } from 'react';
import { H1, H2 } from '@saa/shared/components/saa';

/**
 * Test Page: 12 Space-Themed Scroll Hero Effects
 * ALL EFFECTS USE FULL-WIDTH, EDGE-TO-EDGE SCALE
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
// EFFECT 1: Reveal Mask (KEPT - DO NOT MODIFY)
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
// EFFECT 2: Asteroid Belt (Centered, 75% height, tilted)
// ============================================================================
function Effect2AsteroidBelt() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  // Asteroids now centered in a horizontal band with reduced vertical spread
  const asteroids = [...Array(24)].map((_, i) => ({
    x: (i * 137.5) % 100,
    // Center vertically: y ranges from 35% to 65% (30% band centered at 50%)
    y: 42 + Math.sin(i * 0.8) * 8,
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
          transform: 'rotate(-5deg) scale(1.1)', // Slight tilt
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
// EFFECT 3: Horizontal Light Bars (FULL WIDTH)
// ============================================================================
function Effect3LightBars() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const bars = [
    { y: 15, delay: 0, color: 'rgba(255,215,0,0.6)' },
    { y: 30, delay: 0.1, color: 'rgba(255,180,0,0.5)' },
    { y: 45, delay: 0.2, color: 'rgba(255,150,0,0.4)' },
    { y: 60, delay: 0.15, color: 'rgba(255,200,0,0.5)' },
    { y: 75, delay: 0.25, color: 'rgba(255,215,0,0.4)' },
    { y: 88, delay: 0.05, color: 'rgba(255,170,0,0.5)' },
  ];

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Full-width light bars sweeping across */}
      {bars.map((bar, i) => {
        const adjustedProgress = Math.max(0, Math.min(1, (progress - bar.delay) * 1.5));
        const xPos = -100 + adjustedProgress * 200;
        return (
          <div
            key={i}
            className="absolute left-0 right-0 pointer-events-none"
            style={{
              top: `${bar.y}%`,
              height: '3px',
              background: `linear-gradient(90deg, transparent 0%, ${bar.color} 40%, ${bar.color} 60%, transparent 100%)`,
              transform: `translateX(${xPos}%)`,
              boxShadow: `0 0 30px ${bar.color}, 0 0 60px ${bar.color}`,
            }}
          />
        );
      })}

      {/* Vertical scan line */}
      <div
        className="absolute top-0 bottom-0 w-[2px] pointer-events-none"
        style={{
          left: `${progress * 100}%`,
          background: 'linear-gradient(180deg, transparent, rgba(255,215,0,0.8), transparent)',
          boxShadow: '0 0 20px rgba(255,215,0,0.5)',
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 3: Light Bars</p>
        <H1>SCANNING GRID</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Horizontal light beams sweep across the viewport.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 4: Edge Curtains (FULL WIDTH - slides in from edges)
// ============================================================================
function Effect4EdgeCurtains() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const leftCurtain = Math.max(0, 50 - progress * 50);
  const rightCurtain = Math.max(0, 50 - progress * 50);
  const topGlow = progress * 100;

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Left curtain */}
      <div
        className="absolute left-0 top-0 bottom-0 pointer-events-none"
        style={{
          width: `${leftCurtain}%`,
          background: 'linear-gradient(90deg, rgba(255,215,0,0.3) 0%, rgba(255,215,0,0.1) 50%, transparent 100%)',
          boxShadow: 'inset -50px 0 100px rgba(255,215,0,0.2)',
        }}
      />

      {/* Right curtain */}
      <div
        className="absolute right-0 top-0 bottom-0 pointer-events-none"
        style={{
          width: `${rightCurtain}%`,
          background: 'linear-gradient(270deg, rgba(255,215,0,0.3) 0%, rgba(255,215,0,0.1) 50%, transparent 100%)',
          boxShadow: 'inset 50px 0 100px rgba(255,215,0,0.2)',
        }}
      />

      {/* Top glow bar */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: '4px',
          background: `linear-gradient(90deg, transparent ${50 - topGlow/2}%, rgba(255,215,0,0.8) 50%, transparent ${50 + topGlow/2}%)`,
          boxShadow: '0 0 40px rgba(255,215,0,0.5), 0 0 80px rgba(255,215,0,0.3)',
        }}
      />

      {/* Bottom glow bar */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: '4px',
          background: `linear-gradient(90deg, transparent ${50 - topGlow/2}%, rgba(255,215,0,0.8) 50%, transparent ${50 + topGlow/2}%)`,
          boxShadow: '0 0 40px rgba(255,215,0,0.5), 0 0 80px rgba(255,215,0,0.3)',
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 4: Edge Curtains</p>
        <H1>UNVEILING</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Golden curtains part to reveal the content.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 5: Diagonal Slashes (FULL WIDTH)
// ============================================================================
function Effect5DiagonalSlashes() {
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

      {/* Counter-rotating slashes */}
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
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 5: Diagonal Slashes</p>
        <H1>ENERGY BLADES</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Diagonal light slashes cut across the screen.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 6: Radial Burst (FULL WIDTH from center to edges)
// ============================================================================
function Effect6RadialBurst() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const rays = 16;
  const burstSize = 50 + progress * 200;

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Radial rays extending to edges */}
      {[...Array(rays)].map((_, i) => {
        const angle = (i / rays) * 360;
        const length = burstSize;
        return (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 origin-left pointer-events-none"
            style={{
              width: `${length}vw`,
              height: '2px',
              background: `linear-gradient(90deg, rgba(255,215,0,${0.6 - progress * 0.3}) 0%, rgba(255,215,0,${0.2 * progress}) 50%, transparent 100%)`,
              transform: `rotate(${angle}deg) translateX(20px)`,
              boxShadow: progress > 0.3 ? `0 0 10px rgba(255,215,0,${0.3})` : 'none',
            }}
          />
        );
      })}

      {/* Expanding ring */}
      <div
        className="absolute rounded-full border-2 pointer-events-none"
        style={{
          width: `${burstSize}vw`,
          height: `${burstSize}vw`,
          maxWidth: '200vw',
          maxHeight: '200vw',
          borderColor: `rgba(255,215,0,${0.5 - progress * 0.3})`,
          boxShadow: `0 0 ${30 + progress * 50}px rgba(255,215,0,${0.3 - progress * 0.2}), inset 0 0 ${20 + progress * 30}px rgba(255,215,0,${0.1})`,
        }}
      />

      {/* Second ring */}
      <div
        className="absolute rounded-full border pointer-events-none"
        style={{
          width: `${burstSize * 0.6}vw`,
          height: `${burstSize * 0.6}vw`,
          borderColor: `rgba(255,215,0,${0.3})`,
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 6: Radial Burst</p>
        <H1>COSMIC EXPLOSION</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Energy rays burst outward from the center.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 7: Wave Distortion (FULL WIDTH horizontal waves)
// ============================================================================
function Effect7WaveDistortion() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const waves = 6;

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {[...Array(waves)].map((_, i) => {
        const waveY = 10 + i * 15;
        const amplitude = 20 + progress * 40;
        const frequency = 2 + i * 0.5;
        const phaseShift = progress * Math.PI * 4 + i;

        return (
          <svg
            key={i}
            className="absolute left-0 w-full pointer-events-none"
            style={{ top: `${waveY}%`, height: '100px' }}
            viewBox="0 0 1000 100"
            preserveAspectRatio="none"
          >
            <path
              d={`M 0 50 ${[...Array(20)].map((_, j) => {
                const x = j * 50;
                const y = 50 + Math.sin((j / 5) * frequency + phaseShift) * amplitude;
                return `L ${x} ${y}`;
              }).join(' ')} L 1000 50`}
              stroke={`rgba(255,215,0,${0.2 + (waves - i) * 0.05})`}
              strokeWidth={2 - i * 0.2}
              fill="none"
              style={{
                filter: `drop-shadow(0 0 ${10 + progress * 10}px rgba(255,215,0,${0.3}))`,
              }}
            />
          </svg>
        );
      })}

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 7: Wave Distortion</p>
        <H1>QUANTUM RIPPLES</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Energy waves pulse across the screen.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 8: Corner Flares (FULL WIDTH from all corners)
// ============================================================================
function Effect8CornerFlares() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const flareSize = 30 + progress * 70;

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Top-left flare */}
      <div
        className="absolute top-0 left-0 pointer-events-none"
        style={{
          width: `${flareSize}%`,
          height: `${flareSize}%`,
          background: `radial-gradient(ellipse at 0% 0%, rgba(255,215,0,${0.4 * progress}) 0%, transparent 70%)`,
        }}
      />

      {/* Top-right flare */}
      <div
        className="absolute top-0 right-0 pointer-events-none"
        style={{
          width: `${flareSize}%`,
          height: `${flareSize}%`,
          background: `radial-gradient(ellipse at 100% 0%, rgba(255,180,0,${0.35 * progress}) 0%, transparent 70%)`,
        }}
      />

      {/* Bottom-left flare */}
      <div
        className="absolute bottom-0 left-0 pointer-events-none"
        style={{
          width: `${flareSize}%`,
          height: `${flareSize}%`,
          background: `radial-gradient(ellipse at 0% 100%, rgba(255,200,0,${0.35 * progress}) 0%, transparent 70%)`,
        }}
      />

      {/* Bottom-right flare */}
      <div
        className="absolute bottom-0 right-0 pointer-events-none"
        style={{
          width: `${flareSize}%`,
          height: `${flareSize}%`,
          background: `radial-gradient(ellipse at 100% 100%, rgba(255,215,0,${0.4 * progress}) 0%, transparent 70%)`,
        }}
      />

      {/* Connecting edge glows */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
        style={{
          background: `linear-gradient(90deg, rgba(255,215,0,${0.5 * progress}) 0%, transparent 30%, transparent 70%, rgba(255,215,0,${0.5 * progress}) 100%)`,
          boxShadow: `0 0 30px rgba(255,215,0,${0.3 * progress})`,
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none"
        style={{
          background: `linear-gradient(90deg, rgba(255,215,0,${0.5 * progress}) 0%, transparent 30%, transparent 70%, rgba(255,215,0,${0.5 * progress}) 100%)`,
          boxShadow: `0 0 30px rgba(255,215,0,${0.3 * progress})`,
        }}
      />
      <div
        className="absolute left-0 top-0 bottom-0 w-[2px] pointer-events-none"
        style={{
          background: `linear-gradient(180deg, rgba(255,215,0,${0.5 * progress}) 0%, transparent 30%, transparent 70%, rgba(255,215,0,${0.5 * progress}) 100%)`,
          boxShadow: `0 0 30px rgba(255,215,0,${0.3 * progress})`,
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-[2px] pointer-events-none"
        style={{
          background: `linear-gradient(180deg, rgba(255,215,0,${0.5 * progress}) 0%, transparent 30%, transparent 70%, rgba(255,215,0,${0.5 * progress}) 100%)`,
          boxShadow: `0 0 30px rgba(255,215,0,${0.3 * progress})`,
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 8: Corner Flares</p>
        <H1>POWER SURGE</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Energy builds from all corners of the screen.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 9: Horizon Split (FULL WIDTH horizontal)
// ============================================================================
function Effect9HorizonSplit() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const splitGap = 100 - progress * 100; // Closes as you scroll
  const glowIntensity = progress;

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Top half gradient */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          top: 0,
          height: `calc(50% - ${splitGap / 2}px)`,
          background: `linear-gradient(180deg, transparent 0%, rgba(255,215,0,${0.1 * glowIntensity}) 70%, rgba(255,215,0,${0.3 * glowIntensity}) 100%)`,
        }}
      />

      {/* Bottom half gradient */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          bottom: 0,
          height: `calc(50% - ${splitGap / 2}px)`,
          background: `linear-gradient(0deg, transparent 0%, rgba(255,215,0,${0.1 * glowIntensity}) 70%, rgba(255,215,0,${0.3 * glowIntensity}) 100%)`,
        }}
      />

      {/* Central horizon line */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          top: '50%',
          height: '4px',
          transform: 'translateY(-50%)',
          background: `linear-gradient(90deg, transparent 0%, rgba(255,215,0,${0.8 * glowIntensity}) 20%, rgba(255,255,255,${glowIntensity}) 50%, rgba(255,215,0,${0.8 * glowIntensity}) 80%, transparent 100%)`,
          boxShadow: `0 0 ${40 * glowIntensity}px rgba(255,215,0,${0.6 * glowIntensity}), 0 0 ${80 * glowIntensity}px rgba(255,215,0,${0.4 * glowIntensity})`,
        }}
      />

      {/* Lens flare elements */}
      {progress > 0.3 && (
        <>
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 100 * (progress - 0.3),
              height: 100 * (progress - 0.3),
              background: `radial-gradient(circle, rgba(255,255,255,${0.3 * (progress - 0.3)}) 0%, transparent 70%)`,
            }}
          />
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              top: '45%',
              left: '60%',
              width: 50 * (progress - 0.3),
              height: 50 * (progress - 0.3),
              background: `radial-gradient(circle, rgba(255,215,0,${0.4 * (progress - 0.3)}) 0%, transparent 70%)`,
            }}
          />
        </>
      )}

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 9: Horizon Split</p>
        <H1>NEW DAWN</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Light breaks across the horizon line.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 10: Matrix Rain (FULL WIDTH vertical lines)
// ============================================================================
function Effect10MatrixRain() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const columns = 30;

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {[...Array(columns)].map((_, i) => {
        const x = (i / columns) * 100;
        const speed = 0.5 + (i % 5) * 0.2;
        const delay = (i * 0.03) % 1;
        const adjustedProgress = Math.max(0, Math.min(1, (progress - delay) * 1.5));
        const yOffset = -100 + adjustedProgress * 200;
        const height = 20 + (i % 4) * 15;

        return (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: `${x}%`,
              top: `${yOffset}%`,
              width: '2px',
              height: `${height}%`,
              background: `linear-gradient(180deg, transparent 0%, rgba(255,215,0,${0.1 + (i % 3) * 0.1}) 20%, rgba(255,215,0,${0.4 + (i % 3) * 0.1}) 50%, rgba(255,215,0,${0.1 + (i % 3) * 0.1}) 80%, transparent 100%)`,
              boxShadow: `0 0 10px rgba(255,215,0,${0.2})`,
            }}
          />
        );
      })}

      {/* Horizontal glow lines */}
      {[20, 50, 80].map((y, i) => (
        <div
          key={`h-${i}`}
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            top: `${y}%`,
            height: '1px',
            background: `linear-gradient(90deg, transparent, rgba(255,215,0,${0.2 * progress}), transparent)`,
          }}
        />
      ))}

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 10: Matrix Rain</p>
        <H1>DATA STREAM</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Digital rain cascades across the screen.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 11: Converging Lines (FULL WIDTH from all edges to center)
// ============================================================================
function Effect11ConvergingLines() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const lineCount = 12;

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Lines from edges converging to center */}
      {[...Array(lineCount)].map((_, i) => {
        const angle = (i / lineCount) * 360;
        const startDistance = 100 - progress * 70; // Start at edge, move toward center

        return (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: '50%',
              top: '50%',
              width: `${150}vw`,
              height: '2px',
              background: `linear-gradient(90deg, rgba(255,215,0,${0.5 * progress}) 0%, rgba(255,215,0,${0.8 * progress}) 50%, transparent ${startDistance}%)`,
              transform: `rotate(${angle}deg)`,
              transformOrigin: '0 50%',
              boxShadow: `0 0 15px rgba(255,215,0,${0.3 * progress})`,
            }}
          />
        );
      })}

      {/* Central convergence glow */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 20 + progress * 100,
          height: 20 + progress * 100,
          background: `radial-gradient(circle, rgba(255,255,255,${0.8 * progress}) 0%, rgba(255,215,0,${0.5 * progress}) 30%, transparent 70%)`,
          boxShadow: `0 0 ${50 * progress}px rgba(255,215,0,${0.5 * progress})`,
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 11: Converging Lines</p>
        <H1>FOCAL POINT</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Energy lines converge from all directions.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 12: Edge Pulse (FULL WIDTH pulsing border)
// ============================================================================
function Effect12EdgePulse() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const pulseWidth = 10 + Math.sin(progress * Math.PI * 4) * 5 + progress * 20;
  const pulseOpacity = 0.2 + progress * 0.4;

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Top edge pulse */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: `${pulseWidth}%`,
          background: `linear-gradient(180deg, rgba(255,215,0,${pulseOpacity}) 0%, transparent 100%)`,
          boxShadow: `inset 0 5px 30px rgba(255,215,0,${pulseOpacity * 0.5})`,
        }}
      />

      {/* Bottom edge pulse */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: `${pulseWidth}%`,
          background: `linear-gradient(0deg, rgba(255,215,0,${pulseOpacity}) 0%, transparent 100%)`,
          boxShadow: `inset 0 -5px 30px rgba(255,215,0,${pulseOpacity * 0.5})`,
        }}
      />

      {/* Left edge pulse */}
      <div
        className="absolute top-0 bottom-0 left-0 pointer-events-none"
        style={{
          width: `${pulseWidth}%`,
          background: `linear-gradient(90deg, rgba(255,215,0,${pulseOpacity}) 0%, transparent 100%)`,
          boxShadow: `inset 5px 0 30px rgba(255,215,0,${pulseOpacity * 0.5})`,
        }}
      />

      {/* Right edge pulse */}
      <div
        className="absolute top-0 bottom-0 right-0 pointer-events-none"
        style={{
          width: `${pulseWidth}%`,
          background: `linear-gradient(270deg, rgba(255,215,0,${pulseOpacity}) 0%, transparent 100%)`,
          boxShadow: `inset -5px 0 30px rgba(255,215,0,${pulseOpacity * 0.5})`,
        }}
      />

      {/* Corner accents */}
      {[
        { top: 0, left: 0 },
        { top: 0, right: 0 },
        { bottom: 0, left: 0 },
        { bottom: 0, right: 0 },
      ].map((pos, i) => (
        <div
          key={i}
          className="absolute w-20 h-20 pointer-events-none"
          style={{
            ...pos,
            background: `radial-gradient(circle at ${pos.left !== undefined ? '0% ' : '100% '}${pos.top !== undefined ? '0%' : '100%'}, rgba(255,215,0,${pulseOpacity * 1.5}) 0%, transparent 70%)`,
          }}
        />
      ))}

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 12: Edge Pulse</p>
        <H1>CONTAINMENT FIELD</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Energy pulses along all edges of the viewport.</p>
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
        <p>12 full-width scroll effects</p>
      </div>

      <Effect1RevealMask />
      <Effect2AsteroidBelt />
      <Effect3LightBars />
      <Effect4EdgeCurtains />
      <Effect5DiagonalSlashes />
      <Effect6RadialBurst />
      <Effect7WaveDistortion />
      <Effect8CornerFlares />
      <Effect9HorizonSplit />
      <Effect10MatrixRain />
      <Effect11ConvergingLines />
      <Effect12EdgePulse />

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
