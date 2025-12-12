'use client';

import { useEffect, useRef, useState } from 'react';
import { H1, H2 } from '@saa/shared/components/saa';

/**
 * Test Page: 12 Space-Themed Scroll Hero Effects
 * Keeping Effect 1 (Reveal Mask) and Effect 9 (Asteroid Belt) + 10 new designs
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
// EFFECT 2: Asteroid Belt (KEPT - was Effect 9)
// ============================================================================
function Effect2AsteroidBelt() {
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
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 2: Asteroid Belt</p>
        <H1>SPACE DEBRIS</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Navigate through a field of tumbling asteroids.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 3: Comet Trail
// ============================================================================
function Effect3CometTrail() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const cometX = -20 + progress * 140;
  const cometY = 80 - progress * 60;
  const tailLength = 100 + progress * 200;

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Comet head */}
      <div
        className="absolute w-8 h-8 rounded-full pointer-events-none"
        style={{
          left: `${cometX}%`,
          top: `${cometY}%`,
          background: 'radial-gradient(circle, #fff 0%, #ffd700 40%, #ff8c00 70%, transparent 100%)',
          boxShadow: '0 0 30px #ffd700, 0 0 60px #ff8c00',
        }}
      />
      {/* Comet tail */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: `${cometX - tailLength * 0.8}%`,
          top: `${cometY + 0.3}%`,
          width: `${tailLength}px`,
          height: '20px',
          background: `linear-gradient(90deg, transparent 0%, rgba(255,215,0,0.1) 30%, rgba(255,215,0,0.4) 70%, rgba(255,140,0,0.8) 100%)`,
          filter: 'blur(4px)',
          transform: 'skewY(-5deg)',
        }}
      />
      {/* Secondary tail */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: `${cometX - tailLength * 0.6}%`,
          top: `${cometY + 1}%`,
          width: `${tailLength * 0.7}px`,
          height: '8px',
          background: `linear-gradient(90deg, transparent 0%, rgba(100,200,255,0.2) 50%, rgba(100,200,255,0.5) 100%)`,
          filter: 'blur(3px)',
          transform: 'skewY(-8deg)',
        }}
      />
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 3: Comet Trail</p>
        <H1>COSMIC VOYAGER</H1>
        <p className="text-body text-[#dcdbd5] mt-6">A blazing comet streaks across the void.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 4: Pulsing Quasar
// ============================================================================
function Effect4PulsingQuasar() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const pulseSize = 50 + Math.sin(progress * Math.PI * 6) * 30;
  const jetLength = 50 + progress * 300;
  const rotation = progress * 45;

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Core */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: pulseSize,
          height: pulseSize,
          background: 'radial-gradient(circle, #fff 0%, #ffd700 30%, #ff4500 60%, transparent 100%)',
          boxShadow: `0 0 ${30 + progress * 50}px #ffd700, 0 0 ${60 + progress * 80}px #ff4500`,
        }}
      />
      {/* Jets */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '8px',
          height: `${jetLength}px`,
          background: `linear-gradient(180deg, rgba(100,150,255,0.8) 0%, rgba(100,150,255,0.3) 50%, transparent 100%)`,
          transform: `rotate(${rotation}deg) translateY(-${jetLength / 2 + 30}px)`,
          filter: 'blur(2px)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: '8px',
          height: `${jetLength}px`,
          background: `linear-gradient(0deg, rgba(100,150,255,0.8) 0%, rgba(100,150,255,0.3) 50%, transparent 100%)`,
          transform: `rotate(${rotation}deg) translateY(${jetLength / 2 + 30}px)`,
          filter: 'blur(2px)',
        }}
      />
      {/* Accretion disk */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 200 + progress * 100,
          height: 40 + progress * 20,
          background: `linear-gradient(90deg, rgba(255,100,0,0.3) 0%, rgba(255,200,0,0.5) 50%, rgba(255,100,0,0.3) 100%)`,
          transform: `rotate(${rotation}deg)`,
          filter: 'blur(8px)',
        }}
      />
      <div className="relative z-10 text-center px-4 max-w-4xl mt-32">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 4: Pulsing Quasar</p>
        <H1>COSMIC ENGINE</H1>
        <p className="text-body text-[#dcdbd5] mt-6">A supermassive object powers twin jets of energy.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 5: Galactic Spiral
// ============================================================================
function Effect5GalacticSpiral() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const rotation = progress * 180;
  const arms = 4;

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Galaxy core */}
      <div
        className="absolute w-20 h-20 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,200,0.9) 0%, rgba(255,215,0,0.5) 40%, transparent 70%)',
          boxShadow: '0 0 40px rgba(255,215,0,0.5)',
        }}
      />
      {/* Spiral arms */}
      {[...Array(arms)].map((_, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            width: 300 + progress * 100,
            height: 300 + progress * 100,
            transform: `rotate(${rotation + (i * 360) / arms}deg)`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              background: `conic-gradient(from ${90 + i * 20}deg, transparent 0deg, rgba(100,150,255,${0.1 + progress * 0.15}) 20deg, rgba(255,200,150,${0.1 + progress * 0.1}) 40deg, transparent 60deg)`,
              borderRadius: '50%',
              filter: 'blur(10px)',
            }}
          />
        </div>
      ))}
      {/* Star dust particles */}
      {[...Array(30)].map((_, i) => {
        const angle = (i * 137.5 + progress * 100) * (Math.PI / 180);
        const radius = 30 + (i % 10) * 25 + progress * 20;
        return (
          <div
            key={`star-${i}`}
            className="absolute w-1 h-1 rounded-full pointer-events-none"
            style={{
              left: `calc(50% + ${Math.cos(angle) * radius}px)`,
              top: `calc(50% + ${Math.sin(angle) * radius}px)`,
              background: i % 3 === 0 ? '#ffd700' : '#fff',
              opacity: 0.3 + (i % 5) * 0.15,
            }}
          />
        );
      })}
      <div className="relative z-10 text-center px-4 max-w-4xl mt-48">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 5: Galactic Spiral</p>
        <H1>COSMIC PINWHEEL</H1>
        <p className="text-body text-[#dcdbd5] mt-6">A spiral galaxy rotates through the cosmos.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 6: Solar Eclipse
// ============================================================================
function Effect6SolarEclipse() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const moonOffset = 150 - progress * 150; // Moon moves in front of sun
  const coronaSize = 80 + progress * 120;
  const coronaOpacity = progress * 0.8;

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Corona (visible during eclipse) */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: coronaSize * 2,
          height: coronaSize * 2,
          background: `radial-gradient(circle, transparent 30%, rgba(255,215,0,${coronaOpacity * 0.3}) 40%, rgba(255,150,0,${coronaOpacity * 0.2}) 60%, transparent 80%)`,
          boxShadow: `0 0 ${coronaSize}px rgba(255,215,0,${coronaOpacity * 0.5})`,
        }}
      />
      {/* Sun */}
      <div
        className="absolute w-24 h-24 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #fff 0%, #ffd700 50%, #ff8c00 100%)',
          boxShadow: '0 0 60px #ffd700',
        }}
      />
      {/* Moon (eclipse) */}
      <div
        className="absolute w-24 h-24 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #2a2a2a 0%, #0a0a0a 100%)',
          transform: `translateX(${moonOffset}px)`,
          boxShadow: progress > 0.7 ? '0 0 30px rgba(255,215,0,0.3)' : 'none',
        }}
      />
      {/* Diamond ring effect at totality */}
      {progress > 0.85 && progress < 0.95 && (
        <div
          className="absolute w-4 h-4 rounded-full pointer-events-none"
          style={{
            background: '#fff',
            boxShadow: '0 0 20px #fff, 0 0 40px #ffd700',
            transform: `translateX(${48 - moonOffset * 0.3}px)`,
          }}
        />
      )}
      <div className="relative z-10 text-center px-4 max-w-4xl mt-48">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 6: Solar Eclipse</p>
        <H1>TOTAL ECLIPSE</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Watch the moon cross the sun's face.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 7: Wormhole Tunnel
// ============================================================================
function Effect7WormholeTunnel() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const rings = 8;
  const tunnelDepth = progress * 500;

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Tunnel rings */}
      {[...Array(rings)].map((_, i) => {
        const depth = (i / rings) * tunnelDepth;
        const scale = 1 - (i / rings) * 0.7;
        const hue = 40 + i * 10; // Gold to orange
        return (
          <div
            key={i}
            className="absolute rounded-full border-2 pointer-events-none"
            style={{
              width: 400 * scale,
              height: 400 * scale,
              borderColor: `hsla(${hue}, 80%, 50%, ${0.3 + (1 - i / rings) * 0.4})`,
              transform: `perspective(1000px) translateZ(${-depth}px) rotateZ(${progress * 90 + i * 15}deg)`,
              boxShadow: `0 0 20px hsla(${hue}, 80%, 50%, 0.3), inset 0 0 30px hsla(${hue}, 80%, 50%, 0.1)`,
            }}
          />
        );
      })}
      {/* Center light */}
      <div
        className="absolute w-16 h-16 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(255,255,255,${0.5 + progress * 0.5}) 0%, rgba(255,215,0,${0.3 + progress * 0.3}) 50%, transparent 70%)`,
          transform: `scale(${0.5 + progress * 1.5})`,
        }}
      />
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 7: Wormhole Tunnel</p>
        <H1>SPACE BRIDGE</H1>
        <p className="text-body text-[#dcdbd5] mt-6">A tunnel through spacetime opens before you.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 8: Meteor Shower
// ============================================================================
function Effect8MeteorShower() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const meteors = [...Array(15)].map((_, i) => ({
    startX: 20 + (i * 47) % 60,
    startY: -10 - (i * 23) % 30,
    speed: 0.8 + (i % 4) * 0.3,
    size: 2 + (i % 3),
    delay: (i * 0.1) % 1,
  }));

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {meteors.map((meteor, i) => {
        const adjustedProgress = Math.max(0, Math.min(1, (progress - meteor.delay) * 1.5));
        const x = meteor.startX + adjustedProgress * 80 * meteor.speed;
        const y = meteor.startY + adjustedProgress * 120 * meteor.speed;
        const opacity = adjustedProgress > 0 && adjustedProgress < 0.9 ? 0.8 : 0;
        return (
          <div key={i} className="absolute pointer-events-none" style={{ left: `${x}%`, top: `${y}%`, opacity }}>
            {/* Meteor head */}
            <div
              className="rounded-full"
              style={{
                width: meteor.size * 2,
                height: meteor.size * 2,
                background: '#fff',
                boxShadow: '0 0 10px #ffd700',
              }}
            />
            {/* Meteor trail */}
            <div
              style={{
                position: 'absolute',
                top: -meteor.size,
                left: -60,
                width: 60,
                height: meteor.size,
                background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.5), #fff)',
                transform: 'rotate(-45deg)',
                transformOrigin: 'right center',
                filter: 'blur(1px)',
              }}
            />
          </div>
        );
      })}
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 8: Meteor Shower</p>
        <H1>CELESTIAL RAIN</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Shooting stars streak across the night sky.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 9: Ringed Planet
// ============================================================================
function Effect9RingedPlanet() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const rotation = progress * 30 - 15;
  const planetY = 20 - progress * 10;

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Planet rings (behind) */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 300,
          height: 80,
          top: `${planetY + 2}%`,
          borderRadius: '50%',
          background: 'transparent',
          border: '15px solid rgba(180,160,140,0.3)',
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          transform: `rotateX(75deg) rotateZ(${rotation}deg)`,
          clipPath: 'inset(50% 0 0 0)',
        }}
      />
      {/* Planet body */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 120,
          height: 120,
          top: `${planetY}%`,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #e8d4a8 0%, #c9a866 30%, #8b6914 70%, #5c4a1f 100%)',
          boxShadow: 'inset -20px -10px 40px rgba(0,0,0,0.5), 0 0 30px rgba(255,215,0,0.2)',
        }}
      >
        {/* Planet bands */}
        <div className="absolute inset-0 rounded-full overflow-hidden opacity-30">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: '100%',
                height: '8px',
                top: `${20 + i * 15}%`,
                background: i % 2 === 0 ? 'rgba(139,105,20,0.5)' : 'rgba(200,180,140,0.3)',
              }}
            />
          ))}
        </div>
      </div>
      {/* Planet rings (front) */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 300,
          height: 80,
          top: `${planetY + 2}%`,
          borderRadius: '50%',
          background: 'transparent',
          border: '15px solid rgba(180,160,140,0.4)',
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          transform: `rotateX(75deg) rotateZ(${rotation}deg)`,
          clipPath: 'inset(0 0 50% 0)',
          boxShadow: '0 0 20px rgba(180,160,140,0.2)',
        }}
      />
      <div className="relative z-10 text-center px-4 max-w-4xl mt-64">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 9: Ringed Planet</p>
        <H1>GAS GIANT</H1>
        <p className="text-body text-[#dcdbd5] mt-6">A majestic ringed world floats in the void.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 10: Binary Stars
// ============================================================================
function Effect10BinaryStars() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const angle = progress * Math.PI * 2;
  const orbitRadius = 80;
  const star1X = Math.cos(angle) * orbitRadius;
  const star1Y = Math.sin(angle) * orbitRadius * 0.3;
  const star2X = Math.cos(angle + Math.PI) * orbitRadius;
  const star2Y = Math.sin(angle + Math.PI) * orbitRadius * 0.3;

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Orbit path */}
      <div
        className="absolute w-40 h-12 border border-[#ffd700]/20 rounded-full pointer-events-none"
        style={{ transform: 'rotateX(60deg)' }}
      />
      {/* Star 1 (yellow) */}
      <div
        className="absolute w-12 h-12 rounded-full pointer-events-none"
        style={{
          transform: `translate(${star1X}px, ${star1Y}px)`,
          background: 'radial-gradient(circle, #fff 0%, #ffd700 40%, #ff8c00 100%)',
          boxShadow: '0 0 40px #ffd700, 0 0 80px #ff8c00',
          zIndex: star1Y > 0 ? 2 : 0,
        }}
      />
      {/* Star 2 (blue) */}
      <div
        className="absolute w-10 h-10 rounded-full pointer-events-none"
        style={{
          transform: `translate(${star2X}px, ${star2Y}px)`,
          background: 'radial-gradient(circle, #fff 0%, #87ceeb 40%, #4169e1 100%)',
          boxShadow: '0 0 30px #87ceeb, 0 0 60px #4169e1',
          zIndex: star2Y > 0 ? 2 : 0,
        }}
      />
      {/* Energy bridge between stars */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: Math.abs(star1X - star2X) + 20,
          height: 4,
          background: `linear-gradient(90deg, rgba(255,215,0,0.5), rgba(135,206,235,0.5))`,
          transform: `translate(${(star1X + star2X) / 2}px, ${(star1Y + star2Y) / 2}px) rotate(${Math.atan2(star1Y - star2Y, star1X - star2X)}rad)`,
          filter: 'blur(3px)',
          opacity: 0.5 + Math.sin(progress * Math.PI * 8) * 0.3,
        }}
      />
      <div className="relative z-10 text-center px-4 max-w-4xl mt-32">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 10: Binary Stars</p>
        <H1>STELLAR DANCE</H1>
        <p className="text-body text-[#dcdbd5] mt-6">Two stars orbit in an eternal cosmic waltz.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 11: Supernova Explosion
// ============================================================================
function Effect11Supernova() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const explosionSize = 20 + progress * 400;
  const coreSize = Math.max(5, 40 - progress * 35);
  const debrisCount = 20;

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Explosion shockwave */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: explosionSize,
          height: explosionSize,
          background: `radial-gradient(circle,
            transparent 0%,
            transparent ${70 - progress * 30}%,
            rgba(255,100,0,${0.5 - progress * 0.3}) ${80 - progress * 20}%,
            rgba(255,200,0,${0.3 - progress * 0.2}) ${90 - progress * 10}%,
            transparent 100%)`,
          boxShadow: `0 0 ${50 + progress * 100}px rgba(255,150,0,${0.5 - progress * 0.3})`,
        }}
      />
      {/* Debris particles */}
      {[...Array(debrisCount)].map((_, i) => {
        const angle = (i / debrisCount) * Math.PI * 2;
        const distance = progress * (100 + (i % 5) * 40);
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        return (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full pointer-events-none"
            style={{
              transform: `translate(${x}px, ${y}px)`,
              background: i % 3 === 0 ? '#ffd700' : i % 3 === 1 ? '#ff4500' : '#fff',
              opacity: 1 - progress * 0.7,
              boxShadow: `0 0 ${5 + (i % 3) * 3}px currentColor`,
            }}
          />
        );
      })}
      {/* Core remnant */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: coreSize,
          height: coreSize,
          background: progress < 0.5
            ? 'radial-gradient(circle, #fff 0%, #ffd700 50%, #ff4500 100%)'
            : 'radial-gradient(circle, #87ceeb 0%, #4169e1 50%, #000080 100%)',
          boxShadow: progress < 0.5
            ? '0 0 50px #ffd700'
            : '0 0 30px #87ceeb',
        }}
      />
      <div className="relative z-10 text-center px-4 max-w-4xl mt-48">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 11: Supernova</p>
        <H1>STELLAR DEATH</H1>
        <p className="text-body text-[#dcdbd5] mt-6">A massive star explodes in a blaze of glory.</p>
      </div>
    </section>
  );
}

// ============================================================================
// EFFECT 12: Space Station Flyby
// ============================================================================
function Effect12SpaceStation() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);

  const stationX = 120 - progress * 160;
  const stationY = 30 + Math.sin(progress * Math.PI) * 10;
  const rotation = -20 + progress * 40;

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Space station */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: `${stationX}%`,
          top: `${stationY}%`,
          transform: `rotate(${rotation}deg)`,
        }}
      >
        {/* Central module */}
        <div
          style={{
            width: 60,
            height: 25,
            background: 'linear-gradient(180deg, #e0e0e0 0%, #808080 50%, #404040 100%)',
            borderRadius: 4,
            boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), 0 0 20px rgba(255,215,0,0.2)',
          }}
        />
        {/* Solar panels */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: -80,
            width: 70,
            height: 30,
            background: 'linear-gradient(90deg, #1a237e 0%, #303f9f 50%, #1a237e 100%)',
            transform: 'translateY(-50%)',
            boxShadow: '0 0 10px rgba(100,150,255,0.3)',
          }}
        >
          {/* Panel grid lines */}
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ position: 'absolute', left: `${(i + 1) * 14}%`, top: 0, bottom: 0, width: 1, background: 'rgba(0,0,0,0.3)' }} />
          ))}
        </div>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: -80,
            width: 70,
            height: 30,
            background: 'linear-gradient(90deg, #1a237e 0%, #303f9f 50%, #1a237e 100%)',
            transform: 'translateY(-50%)',
            boxShadow: '0 0 10px rgba(100,150,255,0.3)',
          }}
        >
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ position: 'absolute', left: `${(i + 1) * 14}%`, top: 0, bottom: 0, width: 1, background: 'rgba(0,0,0,0.3)' }} />
          ))}
        </div>
        {/* Lights */}
        <div className="absolute -top-1 left-1/4 w-2 h-2 rounded-full bg-red-500" style={{ boxShadow: '0 0 8px #ff0000' }} />
        <div className="absolute -bottom-1 right-1/4 w-2 h-2 rounded-full bg-green-500" style={{ boxShadow: '0 0 8px #00ff00' }} />
      </div>
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <p className="text-caption uppercase tracking-widest mb-4 text-[#ffd700]">Effect 12: Space Station</p>
        <H1>ORBITAL OUTPOST</H1>
        <p className="text-body text-[#dcdbd5] mt-6">A station drifts silently through the void.</p>
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
        <p>12 scroll effects</p>
      </div>

      <Effect1RevealMask />
      <Effect2AsteroidBelt />
      <Effect3CometTrail />
      <Effect4PulsingQuasar />
      <Effect5GalacticSpiral />
      <Effect6SolarEclipse />
      <Effect7WormholeTunnel />
      <Effect8MeteorShower />
      <Effect9RingedPlanet />
      <Effect10BinaryStars />
      <Effect11Supernova />
      <Effect12SpaceStation />

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
