'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { H1, H2, Tagline, GlassPanel, Icon3D, CyberCard, CyberCardGold, CTAButton, SecondaryButton, GenericCard } from '@saa/shared/components/saa';
import { StickyHeroWrapper } from '@/components/shared/hero-effects/StickyHeroWrapper';
import { LazyAuroraNetworkEffect } from '@/components/shared/hero-effects/LazyHeroEffects';
import { Building2, Layers, Infinity, TrendingUp, Award, Cloud, Users, DollarSign, Receipt,
  Shield, Headphones, GraduationCap, Video, Handshake,
  Contact, Globe, Laptop, ClipboardCheck, BarChart3, Palette,
  Ban,
} from 'lucide-react';
import { HolographicGlobe } from '../../components/shared/HolographicGlobe';
import type { LucideIcon } from 'lucide-react';

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
 * Scroll Reveal Hook — fires once when element enters viewport
 */
function useScrollReveal(threshold: number = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
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
        <p
          className="text-4xl lg:text-5xl font-bold tabular-nums"
          style={{
            color: '#00bfff',
            textShadow: '-1px -1px 0 #80d4ff, 1px 1px 0 #3d8a9d, 2px 2px 0 #2d6a7d, 3px 3px 0 #1d4a5d, 4px 4px 0 #1d2a3d, 5px 5px 4px rgba(0,0,0,0.5)',
            display: 'inline-block',
          }}
        >
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

// Shared tagline 3D styling for hero stat cards
const heroTaglineStyle: React.CSSProperties = {
  marginBottom: '0.25rem',
  color: '#bfbdb0',
  textShadow: `
    0 0 0.01em #fff,
    0 0 0.02em #fff,
    0 0 0.03em rgba(255,255,255,0.8),
    0 0 0.04em rgba(255,250,240,0.7),
    0 0 0.08em rgba(255, 255, 255, 0.35),
    0 0 0.14em rgba(255, 255, 255, 0.15),
    0 0 0.22em rgba(200, 200, 200, 0.08),
    0.02em 0.02em 0 #2a2a2a,
    0.04em 0.04em 0 #222222,
    0.06em 0.06em 0 #1a1a1a,
    0.08em 0.08em 0 #141414,
    0.10em 0.10em 0 #0f0f0f,
    0.12em 0.12em 0 #080808
  `,
  transform: 'perspective(800px) rotateX(8deg)',
  filter: 'drop-shadow(0.04em 0.04em 0.06em rgba(0,0,0,0.6))',
};

/**
 * Animated Split Display - Shows X/Y with counter animation (only on first mount)
 */
function AnimatedSplitDisplay({ left, right }: { left: number; right: number }) {
  const leftCounter = useScrambleCounter(left, 1500);
  const rightCounter = useScrambleCounter(right, 1500);

  return (
    <>
      <span ref={leftCounter.elementRef}>
        {leftCounter.hasAnimated ? left : leftCounter.displayValue}
      </span>
      <span>/</span>
      <span ref={rightCounter.elementRef}>
        {rightCounter.hasAnimated ? right : rightCounter.displayValue}
      </span>
    </>
  );
}

/**
 * Flip Split Card - Rotates 180° every 4 seconds between two states
 * Front: 80/20 Commission | Back: 0/100 After Cap
 * Always rotates in same direction, with counter animations
 */
const HERO_CARD_BASE: React.CSSProperties = {
  background: 'linear-gradient(180deg, rgba(30,30,30,0.95), rgba(15,15,15,0.98))',
  border: '1px solid rgba(255,255,255,0.06)',
  padding: '16px 30px',
};

function FlipSplitCard() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => prev + 180);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ perspective: '1000px' }}>
      <div
        style={{
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: `rotateY(${rotation}deg)`,
        }}
      >
        {/* Front face - 80/20 Commission (defines the size) */}
        <div style={{ backfaceVisibility: 'hidden' }}>
          <div className="rounded-xl text-center" style={HERO_CARD_BASE}>
            {/* Invisible sizing element - always shows final value to set width */}
            <p className="text-tagline tabular-nums whitespace-nowrap invisible h-0 overflow-hidden" style={heroTaglineStyle} aria-hidden="true">
              80/20
            </p>
            <p className="text-tagline tabular-nums whitespace-nowrap" style={heroTaglineStyle}>
              <AnimatedSplitDisplay left={80} right={20} />
            </p>
            <p className="text-body text-sm opacity-70 whitespace-nowrap">Commission</p>
          </div>
        </div>

        {/* Back face - 0/100 After Cap (positioned absolutely to match front) */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="rounded-xl text-center h-full flex flex-col justify-center" style={HERO_CARD_BASE}>
            <p className="text-tagline tabular-nums whitespace-nowrap" style={heroTaglineStyle}>
              0/100
            </p>
            <p className="text-body text-sm opacity-70 whitespace-nowrap">After Cap</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Hero Stat Card - GenericCard with counter animation and tagline 3D styling
 */
function HeroStatCard({
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
    <div className="rounded-xl text-center" style={HERO_CARD_BASE}>
      {/* Invisible sizing element - always shows final value to set width */}
      <p className="text-tagline tabular-nums whitespace-nowrap invisible h-0 overflow-hidden" style={heroTaglineStyle} aria-hidden="true">
        {prefix}{targetNumber.toLocaleString()}{suffix}
      </p>
      <p className="text-tagline tabular-nums whitespace-nowrap" style={heroTaglineStyle}>
        <span>{prefix}</span>
        <span ref={elementRef}>
          {hasAnimated ? targetNumber.toLocaleString() : displayValue.toLocaleString()}
        </span>
        <span>{suffix}</span>
      </p>
      <p className="text-body text-sm opacity-70 whitespace-nowrap">{label}</p>
    </div>
  );
}

// Award text items for scrolling
const AWARDS = [
  "Forbes – America's Best Employers",
  "Glassdoor – Best Places to Work (8 consecutive years)",
  "RealTrends – #1 in U.S. transaction sides",
  "RealTrends – Top 3 Brokerage by Sales Volume",
  "RealTrends – 500 Top-Ranked Brokerage",
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
        <p
          className="text-4xl font-bold mb-2 tabular-nums"
          style={{
            color: '#00bfff',
            textShadow: '-1px -1px 0 #80d4ff, 1px 1px 0 #3d8a9d, 2px 2px 0 #2d6a7d, 3px 3px 0 #1d4a5d, 4px 4px 0 #1d2a3d, 5px 5px 4px rgba(0,0,0,0.5)',
            display: 'inline-block',
          }}
        >
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
const EXP_PRIORITIES = [
  { icon: Layers, label: 'Production efficiency via central systems' },
  { icon: TrendingUp, label: 'Ownership in a publicly traded company' },
  { icon: Users, label: 'Leverage from scale and shared infrastructure' },
  { icon: Infinity, label: 'Income continuity beyond active sales' },
];

const INTRO_CARDS = [
  { num: '01', text: 'Most brokerages are built around transactions.' },
  { num: '02', text: 'eXp is built around what comes after.' },
];

const INTRO_TEXT_SHADOW = `
  0 0 0.01em #fff,
  0 0 0.02em #fff,
  0 0 0.03em rgba(255,255,255,0.8),
  0 0 0.04em rgba(255,250,240,0.7),
  0 0 0.08em rgba(255, 255, 255, 0.35),
  0 0 0.14em rgba(255, 255, 255, 0.15),
  0 0 0.22em rgba(200, 200, 200, 0.08),
  0.02em 0.02em 0 #2a2a2a,
  0.04em 0.04em 0 #222222,
  0.06em 0.06em 0 #1a1a1a,
  0.08em 0.08em 0 #141414,
  0.10em 0.10em 0 #0f0f0f,
  0.12em 0.12em 0 #080808
`;

// Red text shadow for card 01 (prohibition/do-not theme)
const INTRO_TEXT_SHADOW_RED = `
  0 0 0.01em #fff,
  0 0 0.02em #fff,
  0 0 0.03em rgba(255,255,255,0.8),
  0 0 0.04em rgba(255,100,100,0.7),
  0 0 0.08em rgba(255, 80, 80, 0.35),
  0 0 0.14em rgba(255, 60, 60, 0.15),
  0 0 0.22em rgba(200, 50, 50, 0.08),
  0.02em 0.02em 0 #3a1a1a,
  0.04em 0.04em 0 #351515,
  0.06em 0.06em 0 #250f0f,
  0.08em 0.08em 0 #200a0a,
  0.10em 0.10em 0 #180808,
  0.12em 0.12em 0 #100404
`;

// Blue text shadow for card 02 (eXp theme)
const INTRO_TEXT_SHADOW_BLUE = `
  0 0 0.01em #fff,
  0 0 0.02em #fff,
  0 0 0.03em rgba(255,255,255,0.8),
  0 0 0.04em rgba(0, 191, 255, 0.7),
  0 0 0.08em rgba(0, 191, 255, 0.35),
  0 0 0.14em rgba(0, 191, 255, 0.15),
  0 0 0.22em rgba(0, 150, 200, 0.08),
  0.02em 0.02em 0 #1a2a3a,
  0.04em 0.04em 0 #152535,
  0.06em 0.06em 0 #0f1a25,
  0.08em 0.08em 0 #0a1520,
  0.10em 0.10em 0 #081018,
  0.12em 0.12em 0 #040810
`;

const INTRO_TEXT_FILTER = 'drop-shadow(0.04em 0.04em 0.06em rgba(0,0,0,0.6))';

function IntroFlipCard() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => prev + 180);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Card 01 - Red theme with Ban icon
  const card01 = (
    <CyberCard padding="md" centered className="h-full">
      {/* Ban Icon Badge */}
      <span
        className="absolute top-3 left-3 flex items-center justify-center w-7 h-7 rounded"
        style={{
          background: 'rgba(255,80,80,0.15)',
          border: '1px solid rgba(255,80,80,0.3)',
        }}
      >
        <Ban size={16} style={{ color: '#ff5050' }} />
      </span>
      <div className="flex items-center justify-center h-full min-h-[100px]">
        <p
          className="text-h5 leading-relaxed text-center"
          style={{
            color: '#e8a0a0',
            fontFamily: 'var(--font-taskor), var(--font-display), system-ui',
            fontFeatureSettings: '"ss01" 1',
            textShadow: INTRO_TEXT_SHADOW_RED,
            transform: 'perspective(800px) rotateX(8deg)',
            filter: INTRO_TEXT_FILTER,
          }}
        >
          {INTRO_CARDS[0].text}
        </p>
      </div>
    </CyberCard>
  );

  // Card 02 - Blue theme with eXp X logo
  const card02 = (
    <CyberCardGold padding="md" centered className="h-full">
      {/* eXp X Logo Badge */}
      <span
        className="absolute top-3 left-3 flex items-center justify-center w-7 h-7 rounded"
        style={{
          background: 'rgba(0,191,255,0.15)',
          border: '1px solid rgba(0,191,255,0.3)',
        }}
      >
        <img src="/icons/exp-x.svg" alt="eXp" width={16} height={16} style={{ filter: 'brightness(0) saturate(100%) invert(65%) sepia(80%) saturate(1000%) hue-rotate(170deg) brightness(100%)' }} />
      </span>
      <div className="flex items-center justify-center h-full min-h-[100px]">
        <p
          className="text-h5 leading-relaxed text-center"
          style={{
            color: '#b0d4e8',
            fontFamily: 'var(--font-taskor), var(--font-display), system-ui',
            fontFeatureSettings: '"ss01" 1',
            textShadow: INTRO_TEXT_SHADOW_BLUE,
            transform: 'perspective(800px) rotateX(8deg)',
            filter: INTRO_TEXT_FILTER,
          }}
        >
          {INTRO_CARDS[1].text}
        </p>
      </div>
    </CyberCardGold>
  );

  return (
    <div style={{ perspective: '1000px' }}>
      <div
        style={{
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: `rotateY(${rotation}deg)`,
        }}
      >
        {/* Front - 01 */}
        <div style={{ backfaceVisibility: 'hidden' }}>
          {card01}
        </div>
        {/* Back - 02 */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            transform: 'rotateY(180deg)',
          }}
        >
          {card02}
        </div>
      </div>
    </div>
  );
}

function HowExpIsBuilt() {

  return (
    <GlassPanel variant="champagne">
      <section className="py-12 md:py-20">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="text-center mb-10">
            <H2>How eXp is Built for Agents</H2>
          </div>

          {/* Mobile: Flip card */}
          <div className="sm:hidden max-w-[400px] mx-auto mb-10">
            <IntroFlipCard />
          </div>

          {/* Desktop: Side by side cards */}
          <div className="hidden sm:grid grid-cols-2 gap-5 max-w-[1400px] mx-auto mb-10">
            {/* Card 01 - CyberCard with Ban icon and red text */}
            <div className="relative">
              <CyberCard padding="md" centered className="h-full">
                {/* Ban Icon Badge */}
                <span
                  className="absolute top-3 left-3 flex items-center justify-center w-7 h-7 rounded"
                  style={{
                    background: 'rgba(255,80,80,0.15)',
                    border: '1px solid rgba(255,80,80,0.3)',
                  }}
                >
                  <Ban size={16} style={{ color: '#ff5050' }} />
                </span>
                <div className="flex items-center justify-center h-full min-h-[100px]">
                  <p
                    className="text-h5 leading-relaxed text-center"
                    style={{
                      color: '#e8a0a0',
                      fontFamily: 'var(--font-taskor), var(--font-display), system-ui',
                      fontFeatureSettings: '"ss01" 1',
                      textShadow: INTRO_TEXT_SHADOW_RED,
                      transform: 'perspective(800px) rotateX(8deg)',
                      filter: INTRO_TEXT_FILTER,
                    }}
                  >
                    {INTRO_CARDS[0].text}
                  </p>
                </div>
              </CyberCard>
            </div>
            {/* Card 02 - CyberCardGold with eXp X logo and blue text */}
            <div className="relative">
              <CyberCardGold padding="md" centered className="h-full">
                {/* eXp X Logo Badge */}
                <span
                  className="absolute top-3 left-3 flex items-center justify-center w-7 h-7 rounded"
                  style={{
                    background: 'rgba(0,191,255,0.15)',
                    border: '1px solid rgba(0,191,255,0.3)',
                  }}
                >
                  <img src="/icons/exp-x.svg" alt="eXp" width={16} height={16} style={{ filter: 'brightness(0) saturate(100%) invert(65%) sepia(80%) saturate(1000%) hue-rotate(170deg) brightness(100%)' }} />
                </span>
                <div className="flex items-center justify-center h-full min-h-[100px]">
                  <p
                    className="text-h5 leading-relaxed text-center"
                    style={{
                      color: '#b0d4e8',
                      fontFamily: 'var(--font-taskor), var(--font-display), system-ui',
                      fontFeatureSettings: '"ss01" 1',
                      textShadow: INTRO_TEXT_SHADOW_BLUE,
                      transform: 'perspective(800px) rotateX(8deg)',
                      filter: INTRO_TEXT_FILTER,
                    }}
                  >
                    {INTRO_CARDS[1].text}
                  </p>
                </div>
              </CyberCardGold>
            </div>
          </div>

          {/* Priorities label - Amulya font */}
          <p
            className="text-center text-h6 mb-5"
            style={{
              color: 'var(--color-body-text)',
              fontFamily: 'var(--font-amulya)',
            }}
          >
            The model is built around four priorities
          </p>

          {/* Priority cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-[1400px] mx-auto">
            {EXP_PRIORITIES.map((priority, index) => (
              <div
                key={index}
                className="rounded-xl p-5 text-center"
                style={{
                  background: 'linear-gradient(180deg, rgba(0,30,60,0.4), rgba(0,20,40,0.5))',
                  border: '1px solid rgba(0,191,255,0.15)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03)',
                }}
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,191,255,0.15), rgba(0,120,200,0.1))',
                    border: '1px solid rgba(0,191,255,0.25)',
                    boxShadow: '0 0 15px rgba(0,191,255,0.1)',
                  }}
                >
                  <priority.icon size={22} style={{ color: '#00bfff' }} />
                </div>

                {/* Label - body font styling */}
                <p
                  className="text-body text-sm leading-relaxed"
                  style={{ color: 'var(--color-body-text)' }}
                >
                  {priority.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </GlassPanel>
  );
}

// Awards ticker + validation logos — rendered inside SpotlightConsole
function ValidationRibbon() {
  const trackRef = useRef<HTMLDivElement>(null);
  useCarouselAnimation(trackRef);

  return (
    <div className="mt-8">
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

    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   SECTION 1: WHY EXP EXISTS
   ═══════════════════════════════════════════════════════════════ */

const FEATURES: { icon: LucideIcon; keyword: string; type: 'pillar' | 'advantage'; detail: string }[] = [
  {
    icon: Award,
    keyword: 'Agent Rankings',
    type: 'advantage',
    detail: 'Consistently ranked among the highest-rated brokerages by agents on Glassdoor, suggesting the day-to-day experience and support scale beyond individual offices.',
  },
  {
    icon: Cloud,
    keyword: 'Innovation',
    type: 'advantage',
    detail: 'Operates without physical office overhead, allowing more resources to be directed toward technology, training, and agent programs instead of locations.',
  },
  {
    icon: TrendingUp,
    keyword: 'Profitability',
    type: 'advantage',
    detail: 'Cumulatively profitable as a publicly traded brokerage in recent years, which supports long-term viability and continued investment in systems and support.',
  },
  {
    icon: Users,
    keyword: 'Sponsor Support',
    type: 'advantage',
    detail: 'Allows sponsors to independently build and deliver systems and training, which is not permitted at most brokerages and directly affects the level of support agents receive.',
  },
];

/* ═══════════════════════════════════════════════════════════════
   SECTION 2: INCOME & OWNERSHIP — Constants
   ═══════════════════════════════════════════════════════════════ */

const BLUE_3D_SHADOW = '-1px -1px 0 #80d4ff, 1px 1px 0 #3d8a9d, 2px 2px 0 #2d6a7d, 3px 3px 0 #1d4a5d, 4px 4px 0 #1d2a3d, 5px 5px 4px rgba(0,0,0,0.5)';

const INCOME_STREAMS: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: DollarSign,
    title: 'Commission',
    description: '80/20 split until a $16,000 annual cap, then 100% commission',
  },
  {
    icon: Award,
    title: 'ICON Program',
    description: 'Cap returned in company stock for qualifying agents',
  },
  {
    icon: TrendingUp,
    title: 'Stock Ownership',
    description: 'Production-based awards and optional discounted purchase program',
  },
];

const FEES_CARD = {
  icon: Receipt,
  title: 'Fees',
  description: '$85 monthly flat fee, no desk, franchise, or royalty fees',
};

/* ═══════════════════════════════════════════════════════════════
   SECTION 3: SUPPORT & TECHNOLOGY — Constants
   ═══════════════════════════════════════════════════════════════ */

const SUPPORT_TECH_STATS = [
  { prefix: '', targetNumber: 2000, suffix: '+', label: 'Salaried Support Staff' },
  { prefix: '', targetNumber: 24, suffix: '/7', label: 'Expert Help Desk' },
  { prefix: '', targetNumber: 50, suffix: '+', label: 'Weekly Live Trainings' },
  { prefix: '', targetNumber: 3, suffix: '', label: 'CRM Choices Included' },
];

const SUPPORT_BULLETS = [
  { icon: Shield, text: 'Full-service support across brokers, tech, and transactions' },
  { icon: Headphones, text: '24/7 Expert Care help desk plus AI assistant Mira' },
  { icon: GraduationCap, text: 'Live onboarding that gets agents operational quickly' },
  { icon: Handshake, text: 'Mentor program through first three transactions' },
  { icon: Video, text: '50+ weekly live trainings plus full on-demand library' },
  { icon: Building2, text: 'Physical workspaces via Regus offices worldwide' },
];

const TECH_BULLETS = [
  { icon: Contact, text: 'CRM included: BoldTrail, Lofty, or Cloze' },
  { icon: Globe, text: 'IDX-powered website options, eXp-branded or custom' },
  { icon: Laptop, text: 'eXp World — support, training, and leadership access', guestPass: true },
  { icon: ClipboardCheck, text: 'Transaction management and compliance tools' },
  { icon: BarChart3, text: 'Performance analytics and tracking dashboards' },
  { icon: Palette, text: 'Canva Pro tools plus automation for capping agents' },
];

const REVENUE_SHARE = {
  tierCount: 7,
  description: 'Seven-tier program paid from company revenue, optional and inheritable',
};

const RING_COUNT = 7;
const RING_BASE_PCT = 22;  // innermost diameter as % of container
const RING_MAX_PCT = 95;   // outermost diameter as % of container
const RING_STEP_PCT = (RING_MAX_PCT - RING_BASE_PCT) / (RING_COUNT - 1);

const MISTY_BLUE_BG = `
  radial-gradient(ellipse 120% 80% at 30% 20%, rgba(255,255,255,0.85) 0%, transparent 50%),
  radial-gradient(ellipse 100% 60% at 70% 80%, rgba(140,220,255,0.7) 0%, transparent 40%),
  radial-gradient(ellipse 80% 100% at 50% 50%, rgba(80,210,255,0.75) 0%, transparent 60%),
  radial-gradient(ellipse 60% 40% at 20% 70%, rgba(60,190,255,0.55) 0%, transparent 50%),
  radial-gradient(ellipse 90% 70% at 80% 30%, rgba(180,230,255,0.5) 0%, transparent 45%),
  linear-gradient(180deg, rgba(180,230,255,0.92) 0%, rgba(120,210,255,0.88) 50%, rgba(60,180,240,0.92) 100%)
`;
const DARK_CARD_BG = 'linear-gradient(180deg, rgba(30,30,30,0.98), rgba(15,15,15,0.99))';

function FeatureChip({
  icon: Icon,
  keyword,
  isActive,
  onSelect,
}: {
  icon: LucideIcon;
  keyword: string;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      className="rounded-xl relative h-full"
      style={{
        border: isActive ? '2px solid rgba(50,150,220,0.5)' : '2px solid rgba(255,255,255,0.06)',
        boxShadow: isActive
          ? '0 0 20px 4px rgba(0,160,255,0.3), 0 0 40px 8px rgba(0,120,200,0.15)'
          : 'none',
        transition: 'border 0.4s ease, box-shadow 0.4s ease',
      }}
    >
      {/* Dark base background */}
      <div className="absolute inset-0 rounded-xl overflow-hidden" style={{ background: DARK_CARD_BG }} />
      {/* Misty blue overlay — active only */}
      <div
        className="absolute inset-0 rounded-xl overflow-hidden"
        style={{
          background: MISTY_BLUE_BG,
          opacity: isActive ? 1 : 0,
          transition: isActive ? 'opacity 0.7s ease-out' : 'opacity 0.2s ease-out',
        }}
      />

      <button
        type="button"
        onClick={onSelect}
        aria-pressed={isActive}
        className="relative z-10 flex flex-col items-center justify-center gap-2 w-full h-full cursor-pointer px-[5px] py-3"
      >
        <span className="chip-icon-wrap">
          <Icon3D color="#00bfff" size={36} invert={isActive}>
            <Icon size={20} />
          </Icon3D>
        </span>
        <h3
          className="chip-label"
          style={{
            color: isActive ? '#0a1520' : '#e5e4dd',
            fontFamily: 'var(--font-display), system-ui',
            fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
            transition: 'color 0.4s ease',
          }}
        >
          {keyword}
        </h3>
      </button>
    </div>
  );
}

function DetailPanel({ feature, transitionKey }: { feature: typeof FEATURES[number]; transitionKey: number }) {
  const [displayed, setDisplayed] = useState(feature);
  const [displayedKey, setDisplayedKey] = useState(transitionKey);
  const [phase, setPhase] = useState<'in' | 'out'>('in');

  useEffect(() => {
    if (transitionKey === displayedKey) return;
    setPhase('out');
    const timer = setTimeout(() => {
      setDisplayed(feature);
      setDisplayedKey(transitionKey);
      setPhase('in');
    }, 200);
    return () => clearTimeout(timer);
  }, [feature, transitionKey, displayedKey]);

  return (
    <CyberCard padding="md" centered={false} className="h-full">
      <div className="relative h-full flex flex-col justify-center overflow-visible">
        {/* Watermark icon — large faded background icon */}
        <div
          className="absolute pointer-events-none"
          style={{
            right: '-8px',
            bottom: '-8px',
            opacity: phase === 'out' ? 0 : 0.04,
            transform: phase === 'out' ? 'scale(0.8)' : 'scale(1)',
            transition: phase === 'out'
              ? 'opacity 200ms ease-out, transform 200ms ease-out'
              : 'opacity 500ms ease-out 300ms, transform 500ms ease-out 300ms',
            color: '#00bfff',
          }}
        >
          <displayed.icon size={140} strokeWidth={1} />
        </div>

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            transition: phase === 'out'
              ? 'opacity 200ms ease-out, transform 200ms ease-out'
              : 'opacity 300ms ease-out 150ms, transform 300ms ease-out 150ms',
            opacity: phase === 'out' ? 0 : 1,
            transform: phase === 'out' ? 'translateY(-8px)' : 'translateY(0)',
          }}
        >
          <p className="text-body leading-relaxed mb-4">
            {displayed.detail}
          </p>

          <span
            className="inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
            style={{
              background: 'rgba(0,191,255,0.12)',
              color: '#00bfff',
              border: '1px solid rgba(0,191,255,0.25)',
            }}
          >
            {displayed.type === 'pillar' ? 'CORE PILLAR' : 'STRUCTURAL ADVANTAGE'}
          </span>
        </div>
      </div>
    </CyberCard>
  );
}

/**
 * TypewriterLines — sequential typing animation for problem/solution one-liners.
 * Problem types out first, then the answer. Triggered once when scrolled into view.
 */
function TypewriterLines() {
  const PROBLEM = 'Most brokerages trade your future for today\u2019s commission.';
  const ANSWER = 'eXp was built around what comes after the last sale.';
  const CHAR_DELAY = 30;

  const containerRef = useRef<HTMLDivElement>(null);
  const [problemText, setProblemText] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [phase, setPhase] = useState<'idle' | 'problem' | 'gap' | 'answer' | 'done'>('idle');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Trigger on scroll into view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPhase('problem');
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Type problem
  useEffect(() => {
    if (phase !== 'problem') return;
    let i = 0;
    timerRef.current = setInterval(() => {
      i++;
      setProblemText(PROBLEM.slice(0, i));
      if (i >= PROBLEM.length) {
        clearInterval(timerRef.current!);
        timerRef.current = null;
        setPhase('gap');
      }
    }, CHAR_DELAY);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  // Brief pause between lines
  useEffect(() => {
    if (phase !== 'gap') return;
    const t = setTimeout(() => setPhase('answer'), 350);
    return () => clearTimeout(t);
  }, [phase]);

  // Type answer
  useEffect(() => {
    if (phase !== 'answer') return;
    let j = 0;
    timerRef.current = setInterval(() => {
      j++;
      setAnswerText(ANSWER.slice(0, j));
      if (j >= ANSWER.length) {
        clearInterval(timerRef.current!);
        timerRef.current = null;
        setPhase('done');
      }
    }, CHAR_DELAY);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  const cursor = <span className="inline-block w-[2px] h-[1em] align-text-bottom ml-[1px]" style={{ background: 'currentColor', animation: 'cursorBlink 0.6s steps(1) infinite' }} />;

  return (
    <div ref={containerRef} className="mt-6 max-w-[900px] mx-auto text-center" style={{ paddingBottom: '20px' }}>
      <style>{`@keyframes cursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>

      <div className="mb-3">
        <p
          className="font-bold uppercase tracking-wider"
          style={{ color: '#c0513f', fontFamily: 'var(--font-taskor)', fontFeatureSettings: '"ss01" 1', fontSize: 'clamp(16px, calc(14.73px + 0.51vw), 22px)', lineHeight: 1.6 }}
        >
          <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ display: 'inline', verticalAlign: '-0.15em', marginRight: '0.3em' }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
          </svg>
          The Problem
        </p>
        <p className="text-body" style={{ fontSize: 'clamp(15px, calc(13.73px + 0.51vw), 20px)', lineHeight: 1.6 }}>
          <span style={{ position: 'relative', display: 'inline-block' }}>
            <span style={{ visibility: 'hidden' }}>{PROBLEM}</span>
            <span style={{ position: 'absolute', left: 0, top: 0, whiteSpace: 'nowrap' }}>
              {problemText}
              {(phase === 'problem') && cursor}
            </span>
          </span>
        </p>
      </div>

      <div>
        <p
          className="font-bold uppercase tracking-wider"
          style={{ color: '#00bfff', fontFamily: 'var(--font-taskor)', fontFeatureSettings: '"ss01" 1', fontSize: 'clamp(16px, calc(14.73px + 0.51vw), 22px)', lineHeight: 1.6 }}
        >
          <img
            src={`${CLOUDFLARE_BASE}/exp-x-logo-icon/public`}
            alt="eXp"
            style={{ display: 'inline', width: '1em', height: '1em', objectFit: 'contain', verticalAlign: '-0.15em', marginRight: '0.3em' }}
          />
          The Answer
        </p>
        <p className="text-body" style={{ fontSize: 'clamp(15px, calc(13.73px + 0.51vw), 20px)', lineHeight: 1.6 }}>
          <span style={{ position: 'relative', display: 'inline-block' }}>
            <span style={{ visibility: 'hidden' }}>{ANSWER}</span>
            <span style={{ position: 'absolute', left: 0, top: 0, whiteSpace: 'nowrap' }}>
              {answerText}
              {(phase === 'answer') && cursor}
            </span>
          </span>
        </p>
      </div>
    </div>
  );
}

function SpotlightConsole() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isStopped, setIsStopped] = useState(false);
  const chipsRef = useRef<HTMLDivElement>(null);
  const [chipsInView, setChipsInView] = useState(false);
  const chipRailRef = useRef<HTMLDivElement>(null);

  // Auto-rotation — only runs after chips are scrolled into view, stops permanently on click
  useEffect(() => {
    if (!chipsInView || isStopped) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % FEATURES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [chipsInView, isStopped]);

  // Scroll active chip into view on mobile — only when chips are in view
  useEffect(() => {
    if (!chipsInView || !chipRailRef.current) return;
    const rail = chipRailRef.current;
    // Chips are inside a centering wrapper div
    const inner = rail.firstElementChild;
    const activeChip = inner?.children[activeIndex] as HTMLElement | undefined;
    if (activeChip) {
      activeChip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeIndex, chipsInView]);

  const handleSelect = useCallback((index: number) => {
    setActiveIndex(index);
    setIsStopped(true);
  }, []);

  // Chips grid visibility — gates auto-rotation so it only starts when cards are on screen
  useEffect(() => {
    const el = chipsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setChipsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-16 md:py-24 px-4 sm:px-8 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        {/* H2 */}
        <div className="text-center mb-8">
          <H2>Why Agents Look Closely at eXp</H2>
        </div>

        {/* Chips visibility sentinel — gates auto-rotation on both desktop and mobile */}
        <div ref={chipsRef}>

        {/* Desktop: two-column grid with dots below */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-[45%_55%] gap-6" style={{ height: '220px', overflow: 'visible' }}>
            {/* Left: chips grid */}
            <div
              style={{
                height: '220px',
                overflow: 'visible',
              }}
            >
              <div className="grid grid-cols-2 gap-3" style={{ height: 'calc(50% - 6px)' }}>
                {FEATURES.slice(0, 2).map((f, i) => (
                  <div key={f.keyword} style={{ height: '100%' }}>
                    <FeatureChip
                      icon={f.icon}
                      keyword={f.keyword}
                      isActive={activeIndex === i}
                      onSelect={() => handleSelect(i)}
                    />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3" style={{ height: 'calc(50% - 6px)' }}>
                {FEATURES.slice(2, 4).map((f, i) => (
                  <div key={f.keyword} style={{ height: '100%' }}>
                    <FeatureChip
                      icon={f.icon}
                      keyword={f.keyword}
                      isActive={activeIndex === i + 2}
                      onSelect={() => handleSelect(i + 2)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: detail panel */}
            <div style={{ height: '220px' }}>
              <DetailPanel feature={FEATURES[activeIndex]} transitionKey={activeIndex} />
            </div>
          </div>

          {/* Progress dots — centered below the full row */}
          <div className="flex justify-center gap-2 mt-4">
            {FEATURES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelect(i)}
                aria-label={`Go to ${FEATURES[i].keyword}`}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  background: i === activeIndex ? '#00bfff' : 'rgba(255,255,255,0.25)',
                  boxShadow: i === activeIndex ? '0 0 8px rgba(0,191,255,0.6)' : 'none',
                  transform: i === activeIndex ? 'scale(1.3)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Mobile / Tablet: stacked layout */}
        <div className="lg:hidden">
          {/* 4 chips in a single row above description */}
          <div className="mb-4">
            <div className="grid grid-cols-4 gap-2" style={{ height: '100px' }}>
              {FEATURES.map((f, i) => (
                <div key={f.keyword} style={{ height: '100%' }}>
                  <FeatureChip
                    icon={f.icon}
                    keyword={f.keyword}
                    isActive={activeIndex === i}
                    onSelect={() => handleSelect(i)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Detail panel (full width) — grid overlay for stable height (tallest panel wins) */}
          <div style={{ display: 'grid', position: 'relative', zIndex: 1 }}>
            {FEATURES.map((f, i) => (
              <div
                key={f.keyword}
                aria-hidden={i !== activeIndex}
                style={{
                  gridArea: '1 / 1',
                  visibility: i === activeIndex ? 'visible' : 'hidden',
                  pointerEvents: i === activeIndex ? 'auto' : 'none',
                }}
              >
                <DetailPanel feature={f} transitionKey={i === activeIndex ? activeIndex : -1} />
              </div>
            ))}
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mt-4">
            {FEATURES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelect(i)}
                aria-label={`Go to ${FEATURES[i].keyword}`}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  background: i === activeIndex ? '#00bfff' : 'rgba(255,255,255,0.25)',
                  boxShadow: i === activeIndex ? '0 0 8px rgba(0,191,255,0.6)' : 'none',
                  transform: i === activeIndex ? 'scale(1.3)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        </div>
        </div>{/* end chipsRef sentinel */}

        {/* Validation ribbon */}
        <div className="mt-10">
          <ValidationRibbon />
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <SecondaryButton href="#">More on How eXp is Different</SecondaryButton>
        </div>
      </div>
    </section>
  );
}


/**
 * Rising Particles — lightweight canvas effect for Revenue Share panel
 */
function RisingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const COUNT = 25;

    interface Particle {
      x: number;
      y: number;
      r: number;
      speed: number;
      drift: number;
      opacity: number;
    }

    let particles: Particle[] = [];
    let rafId: number;

    const init = () => {
      particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 1.5 + Math.random() * 1.5,
        speed: 0.3 + Math.random() * 0.5,
        drift: (Math.random() - 0.5) * 0.4,
        opacity: 0.1 + Math.random() * 0.25,
      }));
    };

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      canvas.width = rect.width;
      canvas.height = rect.height;
      if (particles.length === 0) init();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -p.r) {
          p.y = canvas.height + p.r;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -p.r) p.x = canvas.width + p.r;
        if (p.x > canvas.width + p.r) p.x = -p.r;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,191,255,${p.opacity})`;
        ctx.fill();
      }
      rafId = requestAnimationFrame(draw);
    };

    resize();
    rafId = requestAnimationFrame(draw);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 2: INCOME & OWNERSHIP
   ═══════════════════════════════════════════════════════════════ */

/**
 * CommissionDonut - Animated donut chart showing 80/20 split → 100%
 */
function CommissionDonut() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.5 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const size = 80;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const eightyPercent = circumference * 0.8;

  return (
    <div ref={ref} className="flex items-center justify-center mb-4">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(0,191,255,0.15)"
          strokeWidth={strokeWidth}
        />
        {/* 80% segment - cyan */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#00bfff"
          strokeWidth={strokeWidth}
          strokeDasharray={`${eightyPercent} ${circumference}`}
          strokeDashoffset={isVisible ? 0 : circumference}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: 'drop-shadow(0 0 4px rgba(0,191,255,0.5))',
          }}
        />
        {/* 20% segment - gold */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#ffd700"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference * 0.2} ${circumference}`}
          strokeDashoffset={isVisible ? -eightyPercent : circumference}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.3s',
            filter: 'drop-shadow(0 0 4px rgba(255,215,0,0.5))',
          }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-lg font-bold" style={{ color: '#00bfff' }}>80</span>
        <span className="text-[10px] opacity-60" style={{ color: '#ffd700' }}>/ 20</span>
      </div>
    </div>
  );
}

/**
 * IconBadge - Trophy achievement badge with glow effect
 */
function IconBadge() {
  return (
    <div className="flex items-center justify-center mb-4">
      <div
        className="relative w-16 h-16 rounded-full flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle, rgba(255,215,0,0.2) 0%, rgba(255,215,0,0.05) 70%, transparent 100%)',
          boxShadow: '0 0 20px rgba(255,215,0,0.3), inset 0 0 15px rgba(255,215,0,0.1)',
          animation: 'iconGlow 3s ease-in-out infinite',
        }}
      >
        <Award size={32} style={{ color: '#ffd700', filter: 'drop-shadow(0 0 6px rgba(255,215,0,0.6))' }} />
      </div>
      <style jsx>{`
        @keyframes iconGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(255,215,0,0.3), inset 0 0 15px rgba(255,215,0,0.1); }
          50% { box-shadow: 0 0 30px rgba(255,215,0,0.5), inset 0 0 20px rgba(255,215,0,0.2); }
        }
      `}</style>
    </div>
  );
}

/**
 * StockChart - Mini upward trending stock chart
 */
function StockChart() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.5 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Chart points for upward trend
  const points = [
    { x: 0, y: 45 },
    { x: 15, y: 40 },
    { x: 30, y: 42 },
    { x: 45, y: 30 },
    { x: 60, y: 25 },
    { x: 75, y: 28 },
    { x: 90, y: 15 },
    { x: 100, y: 10 },
  ];

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = pathD + ` L 100 50 L 0 50 Z`;

  return (
    <div ref={ref} className="flex items-center justify-center mb-4">
      <svg width={100} height={50} viewBox="0 0 100 50" className="overflow-visible">
        {/* Gradient fill under the line */}
        <defs>
          <linearGradient id="stockGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(0,255,136,0.3)" />
            <stop offset="100%" stopColor="rgba(0,255,136,0)" />
          </linearGradient>
        </defs>
        {/* Area fill */}
        <path
          d={areaD}
          fill="url(#stockGradient)"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.8s ease-out 0.5s',
          }}
        />
        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke="#00ff88"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 200,
            strokeDashoffset: isVisible ? 0 : 200,
            transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: 'drop-shadow(0 0 4px rgba(0,255,136,0.6))',
          }}
        />
        {/* End dot */}
        <circle
          cx={100}
          cy={10}
          r={3}
          fill="#00ff88"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.3s ease-out 1.5s',
            filter: 'drop-shadow(0 0 4px rgba(0,255,136,0.8))',
          }}
        />
      </svg>
    </div>
  );
}

/**
 * FeesBadge - Clean $85 circular badge with crossed-out fees
 */
function FeesBadge() {
  return (
    <div className="flex flex-col items-center mb-4">
      {/* $85 Badge */}
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
        style={{
          background: 'radial-gradient(circle, rgba(0,191,255,0.15) 0%, rgba(0,191,255,0.05) 70%, transparent 100%)',
          border: '2px solid rgba(0,191,255,0.4)',
          boxShadow: '0 0 15px rgba(0,191,255,0.2), inset 0 0 10px rgba(0,191,255,0.1)',
        }}
      >
        <span
          className="text-lg font-bold"
          style={{
            color: '#00bfff',
            textShadow: '0 0 8px rgba(0,191,255,0.5)',
          }}
        >
          $85
        </span>
      </div>
      {/* Crossed out fees */}
      <div className="flex flex-wrap justify-center gap-2 text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
        <span className="line-through">Desk fees</span>
        <span className="line-through">Franchise</span>
        <span className="line-through">Royalties</span>
      </div>
    </div>
  );
}

function IncomeOwnershipSection() {
  // Scramble counter for 7 tiers
  const tierCounter = useScrambleCounter(7, 1500);
  // Tier bars cascade animation — trigger once on scroll
  const tierBarsReveal = useScrollReveal(0.3);

  // Card visual components mapped by title
  const cardVisuals: Record<string, React.ReactNode> = {
    'Commission': <CommissionDonut />,
    'ICON Program': <IconBadge />,
    'Stock Ownership': <StockChart />,
  };

  return (
    <GlassPanel variant="expBlueCrosshatch" noBlur>
      <section className="py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1400px] mx-auto">

          {/* A. H2 Heading */}
          <div className="text-center mb-12">
            <H2>INCOME & OWNERSHIP</H2>
          </div>

          {/* B. Three Income Stream Cards (Commission, ICON Program, Stock Ownership) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {INCOME_STREAMS.map((stream) => (
              <div key={stream.title} className="h-full">
                <CyberCard padding="md" centered className="h-full">
                  <div className="flex flex-col items-center text-center h-full">
                    {/* Visual */}
                    <div className="relative">
                      {cardVisuals[stream.title]}
                    </div>

                    {/* Title */}
                    <h3
                      className="uppercase tracking-wider mb-3"
                      style={{
                        color: '#e5e4dd',
                        fontFamily: 'var(--font-taskor), var(--font-display), system-ui',
                        fontFeatureSettings: '"ss01" 1',
                        fontWeight: 400,
                        fontSize: 'var(--font-size-h6)',
                      }}
                    >
                      {stream.title}
                    </h3>

                    {/* Description */}
                    <p
                      className="text-sm leading-relaxed mt-auto"
                      style={{ color: 'var(--color-body-text)' }}
                    >
                      {stream.description}
                    </p>
                  </div>
                </CyberCard>
              </div>
            ))}
          </div>

          {/* C. Bottom Row: Fees CyberCard + Revenue Share Blue Card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {/* Left: Fees CyberCard */}
            <div className="h-full">
              <CyberCard padding="md" centered className="h-full">
                <div className="flex flex-col items-center text-center h-full justify-center">
                  {/* Visual */}
                  <FeesBadge />

                  {/* Title */}
                  <h3
                    className="uppercase tracking-wider mb-3"
                    style={{
                      color: '#e5e4dd',
                      fontFamily: 'var(--font-taskor), var(--font-display), system-ui',
                      fontFeatureSettings: '"ss01" 1',
                      fontWeight: 400,
                      fontSize: 'var(--font-size-h6)',
                    }}
                  >
                    {FEES_CARD.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--color-body-text)' }}
                  >
                    {FEES_CARD.description}
                  </p>
                </div>
              </CyberCard>
            </div>

            {/* Right: Revenue Share Blue Card with 7-tier animation */}
            <div
              className="relative rounded-2xl p-6 sm:p-8 h-full"
              style={{
                background: 'rgba(0,40,80,0.3)',
                border: '1px solid rgba(0,191,255,0.25)',
                boxShadow: 'inset 0 0 40px rgba(0,120,255,0.08), 0 0 30px rgba(0,100,200,0.1)',
              }}
            >
              <RisingParticles />

              {/* 7-tier rings as absolute background layer */}
              <div
                className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center"
                style={{ overflow: 'visible' }}
              >
                <div
                  ref={tierBarsReveal.ref}
                  className="relative"
                  style={{ width: '280px', height: '280px' }}
                >
                  {/* Rings */}
                  {Array.from({ length: RING_COUNT }, (_, i) => {
                    const pct = RING_BASE_PCT + i * RING_STEP_PCT;
                    const opacity = 0.6 - i * 0.05;
                    return (
                      <div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                          width: `${pct}%`,
                          height: `${pct}%`,
                          top: '50%',
                          left: '50%',
                          transform: tierBarsReveal.isVisible
                            ? 'translate(-50%,-50%) scale(1)'
                            : 'translate(-50%,-50%) scale(0)',
                          opacity: tierBarsReveal.isVisible ? 1 : 0,
                          border: `1px solid rgba(0,191,255,${opacity})`,
                          boxShadow: `0 0 8px rgba(0,191,255,${opacity * 0.5})`,
                          transition: `transform 600ms cubic-bezier(0.22,1,0.36,1) ${i * 150}ms, opacity 600ms cubic-bezier(0.22,1,0.36,1) ${i * 150}ms`,
                          animation: tierBarsReveal.isVisible && i === RING_COUNT - 1
                            ? 'ringPulse 3s ease-in-out 2.5s infinite'
                            : undefined,
                        }}
                      />
                    );
                  })}

                  {/* Center: "7" counter + TIERS label */}
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                    <p
                      className="text-5xl sm:text-6xl font-bold tabular-nums leading-none"
                      style={{
                        color: '#00bfff',
                        textShadow: BLUE_3D_SHADOW,
                      }}
                    >
                      <span ref={tierCounter.elementRef}>
                        {tierCounter.hasAnimated ? '7' : tierCounter.displayValue}
                      </span>
                    </p>
                    <p
                      className="text-sm uppercase tracking-widest mt-1"
                      style={{ color: '#e5e4dd', opacity: 0.7 }}
                    >
                      TIERS
                    </p>
                  </div>
                </div>
              </div>

              {/* Content layer - text on left, space for rings on right */}
              <div className="relative z-[1] grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[200px]">
                {/* Text side */}
                <div className="flex flex-col justify-center">
                  <h3
                    className="uppercase tracking-wider mb-3"
                    style={{
                      color: '#e5e4dd',
                      fontFamily: 'var(--font-taskor), var(--font-display), system-ui',
                      fontFeatureSettings: '"ss01" 1',
                      fontWeight: 400,
                      fontSize: 'var(--font-size-h6)',
                    }}
                  >
                    Revenue Share
                  </h3>

                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--color-body-text)' }}
                  >
                    {REVENUE_SHARE.description}
                  </p>
                </div>

                {/* Right side - empty space for the background rings to show through */}
                <div className="hidden lg:block" />
              </div>
            </div>
          </div>

          {/* D. CTA */}
          <div className="text-center">
            <CTAButton href="#">Explore eXp Income</CTAButton>
          </div>
        </div>
      </section>
    </GlassPanel>
  );
}


/* ═══════════════════════════════════════════════════════════════
   SECTION 3: SUPPORT & TECHNOLOGY
   ═══════════════════════════════════════════════════════════════ */

/**
 * RotatingSupportTechStats — mobile auto-rotating single stat display
 * Follows the existing RotatingStats pattern with SUPPORT_TECH_STATS data.
 */
function RotatingSupportTechStats() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayValues, setDisplayValues] = useState<number[]>(SUPPORT_TECH_STATS.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState<boolean[]>(SUPPORT_TECH_STATS.map(() => false));
  const animationRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const animateCurrentStat = useCallback((index: number) => {
    if (hasAnimated[index]) return;

    const targetNumber = SUPPORT_TECH_STATS[index].targetNumber;
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
          const next = (prev + 1) % SUPPORT_TECH_STATS.length;
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

  const currentStat = SUPPORT_TECH_STATS[currentIndex];
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
        <p
          className="text-4xl font-bold mb-2 tabular-nums"
          style={{
            color: '#00bfff',
            textShadow: BLUE_3D_SHADOW,
            display: 'inline-block',
          }}
        >
          {currentStat.prefix}{displayValue}{currentStat.suffix}
        </p>
        <p className="text-sm uppercase tracking-wider" style={{ color: 'var(--color-body-text)', opacity: 0.8 }}>
          {currentStat.label}
        </p>
      </div>
      <div className="flex justify-center gap-2 mt-4">
        {SUPPORT_TECH_STATS.map((_, idx) => (
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

const transparentCardStyle: React.CSSProperties = {
  background: 'rgba(0, 15, 40, 0.35)',
  border: '1px solid rgba(0, 191, 255, 0.15)',
  borderRadius: '16px',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  padding: '24px',
};

function SupportTechnologySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [globeVisible, setGlobeVisible] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setGlobeVisible(entry.isIntersecting),
      { rootMargin: '200px' }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12 overflow-hidden">
      {/* HolographicGlobe background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.4, zIndex: 0 }}
      >
        <HolographicGlobe isVisible={globeVisible} />
      </div>

      {/* Content — above globe */}
      <div className="relative max-w-[1400px] mx-auto" style={{ zIndex: 1 }}>

        {/* H2 Heading */}
        <div className="text-center mb-8">
          <H2>SUPPORT & TECHNOLOGY</H2>
        </div>

        {/* Stat badges row — desktop */}
        <div className="hidden md:grid grid-cols-4 gap-4 mb-10">
          {SUPPORT_TECH_STATS.map((stat, i) => (
            <div key={i}>
              <AnimatedStat {...stat} />
            </div>
          ))}
        </div>

        {/* Stat badges — mobile rotating */}
        <div className="md:hidden mb-8">
          <RotatingSupportTechStats />
        </div>

        {/* Two-column detail cards with CTAs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Support Column */}
          <div className="flex flex-col gap-4">
            <div style={transparentCardStyle} className="flex-1">
              <h3
                className="uppercase tracking-wider mb-2"
                style={{
                  color: '#00bfff',
                  fontFamily: 'var(--font-taskor), var(--font-display), system-ui',
                  fontFeatureSettings: '"ss01" 1',
                  fontWeight: 400,
                  fontSize: 'var(--font-size-h6)',
                }}
              >
                Support
              </h3>
              <p
                className="text-sm italic mb-4"
                style={{ color: '#00bfff', opacity: 0.85 }}
              >
                Independent, but not unprotected.
              </p>
              <ul className="space-y-3">
                {SUPPORT_BULLETS.map((bullet) => (
                  <li
                    key={bullet.text}
                    className="text-body text-sm leading-relaxed flex items-center gap-3"
                    style={{ color: 'var(--color-body-text)' }}
                  >
                    <bullet.icon
                      size={16}
                      style={{ color: '#00bfff', flexShrink: 0, opacity: 0.8 }}
                    />
                    {bullet.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-center">
              <SecondaryButton href="#" variant="blue">Explore eXp Support</SecondaryButton>
            </div>
          </div>

          {/* Technology Column */}
          <div className="flex flex-col gap-4">
            <div style={transparentCardStyle} className="flex-1">
              <h3
                className="uppercase tracking-wider mb-2"
                style={{
                  color: '#00bfff',
                  fontFamily: 'var(--font-taskor), var(--font-display), system-ui',
                  fontFeatureSettings: '"ss01" 1',
                  fontWeight: 400,
                  fontSize: 'var(--font-size-h6)',
                }}
              >
                Technology
              </h3>
              <p
                className="text-sm italic mb-4"
                style={{ color: '#00bfff', opacity: 0.85 }}
              >
                Included in the flat brokerage fee.
              </p>
              <ul className="space-y-3">
                {TECH_BULLETS.map((bullet) => (
                  <li
                    key={bullet.text}
                    className="text-body text-sm leading-relaxed flex items-center gap-3"
                    style={{ color: 'var(--color-body-text)' }}
                  >
                    <bullet.icon
                      size={16}
                      style={{ color: '#00bfff', flexShrink: 0, opacity: 0.8 }}
                    />
                    <span>
                      {bullet.text}
                      {bullet.guestPass && (
                        <>
                          {' — '}
                          <button
                            type="button"
                            onClick={() => window.dispatchEvent(new Event('open-vip-guest-pass'))}
                            className="cursor-pointer font-bold"
                            style={{ color: '#00bfff' }}
                          >
                            get a guest pass
                          </button>
                        </>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-center">
              <SecondaryButton href="#" variant="blue">Explore eXp Technology</SecondaryButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function AboutExpRealty() {
  // Apply blue theme class to body so header/logo overrides work outside #main-content
  useEffect(() => {
    document.body.classList.add('about-exp-blue-theme');
    return () => document.body.classList.remove('about-exp-blue-theme');
  }, []);

  return (
    <main id="main-content">
      {/* Page-level blue theme overrides */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ringPulse { 0%,100% { box-shadow: 0 0 8px rgba(0,191,255,0.08); } 50% { box-shadow: 0 0 14px rgba(0,191,255,0.25), 0 0 28px rgba(0,191,255,0.1); } }

        /* Blue CTA light bars + glow — scoped to main content + header (not slide panels) */
        .about-exp-blue-theme #main-content .cta-light-bar,
        .about-exp-blue-theme header .cta-light-bar {
          background: #00bfff !important;
        }
        .about-exp-blue-theme #main-content .cta-light-bar-pulse,
        .about-exp-blue-theme header .cta-light-bar-pulse {
          --glow-color: 0, 191, 255 !important;
        }

        /* Blue header + footer logo gradients */
        .about-exp-blue-theme #headerLogoGradient stop:nth-child(1),
        .about-exp-blue-theme #footerLogoGradient stop:nth-child(1) {
          stop-color: #b0e0ff !important;
        }
        .about-exp-blue-theme #headerLogoGradient stop:nth-child(2),
        .about-exp-blue-theme #footerLogoGradient stop:nth-child(2) {
          stop-color: #00bfff !important;
        }
        .about-exp-blue-theme #headerLogoGradient stop:nth-child(3),
        .about-exp-blue-theme #footerLogoGradient stop:nth-child(3) {
          stop-color: #0090c0 !important;
        }

        /* Blue hover borders on header CTA */
        .about-exp-blue-theme .header-btn a:hover {
          border-left-color: rgba(0, 191, 255, 0.4) !important;
          border-right-color: rgba(0, 191, 255, 0.4) !important;
        }

        /* Blue scroll progress bar */
        .about-exp-blue-theme .scroll-progress-bar > div {
          background-color: #00bfff !important;
          box-shadow: 0 0 10px rgba(0, 191, 255, 0.5), 0 0 20px rgba(0, 191, 255, 0.3) !important;
        }

        /* Blue burger menu */
        .about-exp-blue-theme .hamburger .line,
        .about-exp-blue-theme .hamburger.menu-open .line,
        .about-exp-blue-theme .hamburger-svg .line {
          stroke: #00bfff !important;
        }

        /* Blue footer rocket/flame icon + glow */
        .about-exp-blue-theme .rocket-icon {
          fill: #00bfff !important;
          filter: drop-shadow(0 0 10px rgba(0, 191, 255, 0.8)) !important;
        }

        /* Blue CyberCardGold — scoped to main content only (not slide panels) */
        .about-exp-blue-theme #main-content .cyber-card-gold-frame {
          border-color: #00bfff;
          box-shadow:
            0 0 4px 1px rgba(0, 191, 255, 0.5),
            0 0 8px 2px rgba(0, 191, 255, 0.35),
            0 0 16px 4px rgba(0, 191, 255, 0.2),
            0 0 24px 6px rgba(0, 191, 255, 0.1),
            0 4px 12px rgba(0,0,0,0.3);
        }
        .about-exp-blue-theme #main-content .cyber-card-gold-frame::after {
          box-shadow:
            0 0 6px 2px rgba(0, 191, 255, 0.6),
            0 0 12px 4px rgba(0, 191, 255, 0.4),
            0 0 20px 6px rgba(0, 191, 255, 0.25),
            0 0 32px 10px rgba(0, 191, 255, 0.12),
            0 6px 16px rgba(0,0,0,0.35);
        }
        .about-exp-blue-theme #main-content .cyber-card-gold-frame::before {
          border-color: rgba(255,255,255,0.5);
        }
      `}</style>

      {/* ════ Hero Section ════ */}
      <StickyHeroWrapper>
        <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
          <LazyAuroraNetworkEffect />
          <div className="max-w-[1900px] mx-auto w-full text-center relative z-10 flex-1 flex flex-col justify-center">
            <div className="relative z-10">
              <H1
                style={{
                  color: '#00bfff',
                  textShadow: `
                    0 0 0.01em #fff,
                    0 0 0.02em #fff,
                    0 0 0.03em rgba(255,255,255,0.8),
                    0 0 0.09em rgba(0, 191, 255, 0.8),
                    0 0 0.13em rgba(0, 191, 255, 0.55),
                    0 0 0.18em rgba(0, 140, 200, 0.35),
                    0.03em 0.03em 0 #2a2a2a,
                    0.045em 0.045em 0 #1a1a1a,
                    0.06em 0.06em 0 #0f0f0f,
                    0.075em 0.075em 0 #080808
                  `,
                  filter: 'drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1) drop-shadow(0 0 0.08em rgba(0, 191, 255, 0.25))',
                }}
              >ABOUT EXP REALTY</H1>
              <div className="mt-4 mx-auto" style={{ maxWidth: '1100px' }}>
                <Tagline style={{ fontSize: 'clamp(17px, 4vw, 37px)' }}>A brokerage built for efficient production and income beyond sales.</Tagline>
              </div>

              {/* Stats Cards with counter animation */}
              <div className="flex flex-wrap justify-center mt-8 mx-auto" style={{ maxWidth: '1200px', gap: '20px' }}>
                <FlipSplitCard />
                <HeroStatCard targetNumber={28} suffix="+" label="Countries" />
                <HeroStatCard prefix="S&P " targetNumber={600} label="Company" />
              </div>
            </div>
          </div>

        </section>
      </StickyHeroWrapper>

      {/* ════ How eXp is Built ════ */}
      <HowExpIsBuilt />

      {/* ════ Section 1: Why Agents Look Closely at eXp ════ */}
      <SpotlightConsole />

      {/* ════ Section 2: Income & Ownership ════ */}
      <IncomeOwnershipSection />

      {/* ════ Section 3: Support & Technology ════ */}
      <SupportTechnologySection />

      {/* Blue H1 glow — must render AFTER H1 component so this keyframe wins */}
      <style>{`
        @keyframes h1GlowBreathe {
          0%, 100% {
            filter: drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1) drop-shadow(0 0 0.08em rgba(0, 191, 255, 0.25));
          }
          50% {
            filter: drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1.15) drop-shadow(0 0 0.15em rgba(0, 191, 255, 0.45));
          }
        }
      `}</style>
    </main>
  );
}
