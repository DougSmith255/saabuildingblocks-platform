'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { H1, Tagline, GlassPanel, Icon3D, CyberCard } from '@saa/shared/components/saa';
import { StickyHeroWrapper } from '@/components/shared/hero-effects/StickyHeroWrapper';
import { SatelliteConstellationEffect } from '@/components/shared/hero-effects/SatelliteConstellationEffect';

const CLOUDFLARE_BASE = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg';

/* ═══════════════════════════════════════════════════════════════
   UTILITY HOOKS & COMPONENTS (unchanged from original)
   ═══════════════════════════════════════════════════════════════ */

/**
 * Scramble Counter Animation Hook
 * Creates a slot-machine style scramble effect that counts up to a target number
 */
function useScrambleCounter(
  targetNumber: number,
  duration: number = 2000,
  triggerOnView: boolean = true
) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);
  const animationRef = useRef<number | null>(null);

  const animate = useCallback(() => {
    if (hasAnimated) return;

    const startTime = performance.now();

    const runAnimation = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      if (progress >= 1) {
        setDisplayValue(targetNumber);
        setHasAnimated(true);
        animationRef.current = null;
      } else {
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(targetNumber * easedProgress);

        const scrambleIntensity = 1 - progress;
        if (Math.random() < scrambleIntensity * 0.4 && progress < 0.8) {
          const variance = Math.floor(targetNumber * 0.1 * scrambleIntensity);
          const scrambledValue = Math.max(0, currentValue + Math.floor(Math.random() * variance * 2) - variance);
          setDisplayValue(scrambledValue);
        } else {
          setDisplayValue(currentValue);
        }

        animationRef.current = requestAnimationFrame(runAnimation);
      }
    };

    animationRef.current = requestAnimationFrame(runAnimation);
  }, [targetNumber, duration, hasAnimated]);

  useEffect(() => {
    if (!triggerOnView) {
      animate();
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          animate();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, triggerOnView, hasAnimated]);

  return { displayValue, elementRef, hasAnimated };
}

/**
 * Animated Stat Component with scramble effect
 */
function AnimatedStat({
  prefix = '',
  targetNumber,
  suffix = '',
  label,
}: {
  prefix?: string;
  targetNumber: number;
  suffix?: string;
  label: string;
}) {
  const { displayValue, elementRef, hasAnimated } = useScrambleCounter(targetNumber, 2000);

  return (
    <CyberCard padding="md" centered>
      <div className="flex items-center justify-center gap-3 mb-2">
        <p className="stat-3d-text text-4xl lg:text-5xl font-bold tabular-nums">
          <span>{prefix}</span>
          <span ref={elementRef}>
            {hasAnimated ? targetNumber.toLocaleString() : displayValue.toLocaleString()}
          </span>
          <span>{suffix}</span>
        </p>
      </div>
      <p className="text-sm uppercase tracking-wider" style={{ color: 'var(--color-body-text)', opacity: 0.8 }}>
        {label}
      </p>
    </CyberCard>
  );
}

// Award text items for scrolling
const AWARDS = [
  "Forbes America's Best Employers",
  "Glassdoor Best Places to Work (8 years straight)",
  "#1 U.S. Brokerage by Transactions, RealTrends",
  "Top 3 Brokerage by Sales Volume, RealTrends",
  "RealTrends 500 Top-Ranked Brokerage",
];

// Logo sources
const LOGOS = [
  { id: 'forbes-logo', alt: 'Forbes', src: `${CLOUDFLARE_BASE}/forbes-logo/public` },
  { id: 'glassdoor-logo', alt: 'Glassdoor', src: `${CLOUDFLARE_BASE}/glassdoor-logo/public` },
  { id: 'realtrends-logo', alt: 'RealTrends', src: `${CLOUDFLARE_BASE}/realtrends-logo/public` },
];


// Carousel hook
function useCarouselAnimation(trackRef: React.RefObject<HTMLDivElement | null>) {
  const animationRef = useRef<number | null>(null);
  const positionRef = useRef(0);
  const baseVelocityRef = useRef(0.5);
  const velocityRef = useRef(0.5);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const isMobile = window.innerWidth < 768;
    const baseSpeed = isMobile ? 1.2 : 0.5;
    baseVelocityRef.current = baseSpeed;
    velocityRef.current = baseSpeed;

    const animate = () => {
      const singleSetWidth = track.scrollWidth / 2;

      if (singleSetWidth > 0) {
        positionRef.current += velocityRef.current;

        if (velocityRef.current > baseVelocityRef.current) {
          velocityRef.current *= 0.98;
          if (velocityRef.current < baseVelocityRef.current) velocityRef.current = baseVelocityRef.current;
        }

        if (positionRef.current >= singleSetWidth) {
          positionRef.current = positionRef.current - singleSetWidth;
        }

        track.style.transform = `translateX(-${positionRef.current}px)`;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY.current);
      lastScrollY.current = currentScrollY;

      const boost = Math.min(scrollDelta * 0.3, 8);
      if (boost > baseVelocityRef.current) {
        velocityRef.current = Math.max(velocityRef.current, boost);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [trackRef]);
}

// Shadow Overlays Component
function ShadowOverlays() {
  return (
    <>
      <div
        className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none"
        style={{
          width: '30px',
          background: 'radial-gradient(ellipse 100% 60% at 0% 50%, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)',
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none"
        style={{
          width: '30px',
          background: 'radial-gradient(ellipse 100% 60% at 100% 50%, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)',
        }}
      />
    </>
  );
}

// Stats data
const STATS = [
  { prefix: 'S&P ', targetNumber: 600, suffix: '', label: 'Company' },
  { prefix: '', targetNumber: 84000, suffix: '+', label: 'Agents' },
  { prefix: '', targetNumber: 29, suffix: '+', label: 'Countries' },
];

// Rotating Stats Component for Mobile
function RotatingStats() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayValues, setDisplayValues] = useState<number[]>(STATS.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState<boolean[]>(STATS.map(() => false));
  const animationRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const animateCurrentStat = useCallback((index: number) => {
    if (hasAnimated[index]) return;

    const targetNumber = STATS[index].targetNumber;
    const duration = 1500;
    const startTime = performance.now();

    const runAnimation = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      if (progress >= 1) {
        setDisplayValues(prev => {
          const newValues = [...prev];
          newValues[index] = targetNumber;
          return newValues;
        });
        setHasAnimated(prev => {
          const newAnimated = [...prev];
          newAnimated[index] = true;
          return newAnimated;
        });
        animationRef.current = null;
      } else {
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(targetNumber * easedProgress);
        const scrambleIntensity = 1 - progress;

        let displayVal = currentValue;
        if (Math.random() < scrambleIntensity * 0.4 && progress < 0.8) {
          const variance = Math.floor(targetNumber * 0.1 * scrambleIntensity);
          displayVal = Math.max(0, currentValue + Math.floor(Math.random() * variance * 2) - variance);
        }

        setDisplayValues(prev => {
          const newValues = [...prev];
          newValues[index] = displayVal;
          return newValues;
        });

        animationRef.current = requestAnimationFrame(runAnimation);
      }
    };

    animationRef.current = requestAnimationFrame(runAnimation);
  }, [hasAnimated]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => {
          const next = (prev + 1) % STATS.length;
          if (!hasAnimated[next]) {
            setTimeout(() => animateCurrentStat(next), 100);
          }
          return next;
        });
        setIsAnimating(false);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [hasAnimated, animateCurrentStat]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated[0]) {
          animateCurrentStat(0);
        }
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animateCurrentStat, hasAnimated]);

  const currentStat = STATS[currentIndex];
  const displayValue = hasAnimated[currentIndex]
    ? currentStat.targetNumber.toLocaleString()
    : displayValues[currentIndex].toLocaleString();

  return (
    <div
      ref={containerRef}
      className="text-center p-6 rounded-xl relative overflow-hidden"
      style={{
        background: 'rgba(20,20,20,0.75)',
        border: '1px solid rgba(255,255,255,0.1)',
        minHeight: '120px',
      }}
    >
      <div
        className={`transition-all duration-300 ease-in-out ${
          isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`}
      >
        <p className="stat-3d-text text-4xl font-bold mb-2 tabular-nums">
          {currentStat.prefix}{displayValue}{currentStat.suffix}
        </p>
        <p className="text-sm uppercase tracking-wider" style={{ color: 'var(--color-body-text)', opacity: 0.8 }}>
          {currentStat.label}
        </p>
      </div>
      <div className="flex justify-center gap-2 mt-4">
        {STATS.map((_, idx) => (
          <div
            key={idx}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              background: idx === currentIndex ? '#00bfff' : 'rgba(255,255,255,0.3)',
              transform: idx === currentIndex ? 'scale(1.2)' : 'scale(1)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Awards Ribbon Component with Glass Panel (full-width)
function AwardsRibbon() {
  const trackRef = useRef<HTMLDivElement>(null);
  useCarouselAnimation(trackRef);

  return (
    <GlassPanel variant="expBlue" rounded="3xl" opacity={0.12}>
      <section className="py-4 md:py-6 overflow-visible">
        <div className="max-w-[1900px] mx-auto px-4 md:px-8 mb-4">
          <div className="md:hidden">
            <RotatingStats />
          </div>
          <div className="hidden md:grid grid-cols-3 gap-8">
            {STATS.map((stat, index) => (
              <AnimatedStat
                key={index}
                prefix={stat.prefix}
                targetNumber={stat.targetNumber}
                suffix={stat.suffix}
                label={stat.label}
              />
            ))}
          </div>
        </div>

        {/* Ticker Band - full width */}
        <div className="relative w-screen -ml-[50vw] left-1/2">
          {/* Portal Edges - blue */}
          <div
            className="absolute left-0 z-20 pointer-events-none"
            style={{
              top: '-16px', bottom: '-16px', width: '12px',
              borderRadius: '0 12px 12px 0',
              background: `radial-gradient(ellipse 200% 50% at 0% 50%, rgba(0,150,255,0.35) 0%, rgba(0,120,200,0.2) 40%, rgba(0,80,150,0.1) 70%, rgba(0,40,80,0.05) 100%)`,
              borderRight: '1px solid rgba(0,150,255,0.4)',
              boxShadow: 'inset -3px 0 6px rgba(0,150,255,0.2), inset -1px 0 2px rgba(0,180,255,0.3), 3px 0 12px rgba(0,0,0,0.6), 6px 0 24px rgba(0,0,0,0.3)',
              transform: 'perspective(500px) rotateY(-3deg)', transformOrigin: 'right center',
            }}
          />
          <div
            className="absolute right-0 z-20 pointer-events-none"
            style={{
              top: '-16px', bottom: '-16px', width: '12px',
              borderRadius: '12px 0 0 12px',
              background: `radial-gradient(ellipse 200% 50% at 100% 50%, rgba(0,150,255,0.35) 0%, rgba(0,120,200,0.2) 40%, rgba(0,80,150,0.1) 70%, rgba(0,40,80,0.05) 100%)`,
              borderLeft: '1px solid rgba(0,150,255,0.4)',
              boxShadow: 'inset 3px 0 6px rgba(0,150,255,0.2), inset 1px 0 2px rgba(0,180,255,0.3), -3px 0 12px rgba(0,0,0,0.6), -6px 0 24px rgba(0,0,0,0.3)',
              transform: 'perspective(500px) rotateY(3deg)', transformOrigin: 'left center',
            }}
          />

          <div
            className="relative overflow-hidden"
            style={{
              marginLeft: '12px', marginRight: '12px',
              background: 'rgba(20,20,20,0.75)',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <ShadowOverlays />
            <div ref={trackRef} className="flex items-center py-5" style={{ willChange: 'transform' }}>
              {[...AWARDS, ...AWARDS].map((award, i) => (
                <div key={i} className="flex items-center flex-shrink-0">
                  <span
                    className="text-sm md:text-base font-semibold uppercase tracking-wide whitespace-nowrap"
                    style={{ color: 'var(--color-header-text)' }}
                  >
                    {award}
                  </span>
                  <span
                    className="mx-6 text-lg"
                    style={{
                      color: '#00bfff',
                      textShadow: '0 0 8px rgba(0,191,255,0.7), 0 0 16px rgba(0,191,255,0.5), 0 0 24px rgba(0,191,255,0.3)',
                    }}
                  >★</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Logo Bar */}
        <div className="max-w-[1900px] mx-auto">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 mt-2 px-4">
            {LOGOS.map((logo) => (
              <Icon3D key={logo.id} color="#00bfff" size={logo.id === 'glassdoor-logo' ? 140 : 100}>
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className={`w-auto object-contain ${logo.id === 'glassdoor-logo' ? 'h-[60px] md:h-[70px]' : 'h-14 md:h-[50px]'}`}
                  style={{ filter: 'brightness(0.7) sepia(1) hue-rotate(180deg) saturate(0.5)' }}
                />
              </Icon3D>
            ))}
          </div>
        </div>
      </section>
    </GlassPanel>
  );
}


/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function AboutExpRealty() {

  return (
    <main id="main-content">
      {/* Fade-in keyframe */}
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      {/* ════ Hero Section ════ */}
      <StickyHeroWrapper>
        <section className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
          <SatelliteConstellationEffect />
          <div className="max-w-[1900px] mx-auto w-full text-center relative z-10">
            <div className="relative z-10">
              <H1>ABOUT EXP REALTY</H1>
              <Tagline className="mt-4 text-lg md:text-xl">
                World&apos;s #1 independent brokerage.
              </Tagline>
              <p className="text-body mt-4" style={{ opacity: 0.9 }}>
                Production-focused. Future-proofed.
              </p>
            </div>
          </div>
        </section>
      </StickyHeroWrapper>

      {/* ════ Awards Ribbon ════ */}
      <AwardsRibbon />
    </main>
  );
}
