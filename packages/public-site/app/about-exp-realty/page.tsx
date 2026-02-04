'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { H1, H2, Tagline, GlassPanel, Icon3D, CyberCard, CyberCardGold, CTAButton, SecondaryButton } from '@saa/shared/components/saa';
import { StickyHeroWrapper } from '@/components/shared/hero-effects/StickyHeroWrapper';
import { LazyAuroraNetworkEffect } from '@/components/shared/hero-effects/LazyHeroEffects';
import { Building2, Layers, Infinity, TrendingUp, Award, Cloud, Users, DollarSign, Receipt } from 'lucide-react';
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

// Award text items for scrolling
const AWARDS = [
  "Forbes America's Best Employers",
  "Glassdoor Best Places to Work (8 years straight)",
  "#1 U.S. Brokerage by Transactions, RealTrends",
  "Top 3 Brokerage by Sales Volume, RealTrends",
  "RealTrends 500 Top-Ranked Brokerage",
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
function StatsBar() {
  return (
    <GlassPanel variant="champagne">
      <section className="py-4 md:py-6">
        <div className="max-w-[1900px] mx-auto px-4 md:px-8">
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

          <TypewriterLines />
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
    icon: Building2,
    keyword: 'Ownership',
    type: 'pillar',
    detail: 'eXp is publicly traded (EXPI). Agents earn stock through production and milestones — real ownership in the company they help build.',
  },
  {
    icon: Layers,
    keyword: 'Leverage',
    type: 'pillar',
    detail: '84,000+ agents across 29 countries. Cloud-based tools, global referrals, and systems built for scale — without office overhead.',
  },
  {
    icon: Infinity,
    keyword: 'Longevity',
    type: 'pillar',
    detail: 'Revenue share is a structural income stream. When agents you attract produce, you earn — even after you slow down or step back.',
  },
  {
    icon: TrendingUp,
    keyword: 'Profitability',
    type: 'advantage',
    detail: 'The only cumulatively profitable publicly traded real estate brokerage in recent years.',
  },
  {
    icon: Award,
    keyword: 'Agent Rankings',
    type: 'advantage',
    detail: 'Consistently ranked the highest-ranked brokerage by Glassdoor\u2019s anonymous agent reviews.',
  },
  {
    icon: Cloud,
    keyword: 'Innovation',
    type: 'advantage',
    detail: 'A cloud-based model that reinvests in systems, support, and agent programs instead of physical offices and franchise layers.',
  },
  {
    icon: Users,
    keyword: 'Sponsor Support',
    type: 'advantage',
    detail: 'The only brokerage that allows sponsors to independently build and deliver additional support.',
  },
];

/* ═══════════════════════════════════════════════════════════════
   SECTION 2: INCOME & OWNERSHIP — Constants
   ═══════════════════════════════════════════════════════════════ */

const BLUE_3D_SHADOW = '-1px -1px 0 #80d4ff, 1px 1px 0 #3d8a9d, 2px 2px 0 #2d6a7d, 3px 3px 0 #1d4a5d, 4px 4px 0 #1d2a3d, 5px 5px 4px rgba(0,0,0,0.5)';

const INCOME_STREAMS: {
  icon: LucideIcon;
  title: string;
  keyMetric: string;
  keyMetricSub?: string;
  keyMetricFont?: string;
  bullets: string[];
}[] = [
  {
    icon: DollarSign,
    title: 'Commission',
    keyMetric: '80/20',
    bullets: [
      '80/20 split until $16K cap',
      '100% after cap',
      'ICON agents earn cap back',
    ],
  },
  {
    icon: Receipt,
    title: 'Simple Fees',
    keyMetric: '$85/mo',
    bullets: [
      '$85/month flat',
      'No desk fees',
      'No franchise/royalty fees',
    ],
  },
  {
    icon: TrendingUp,
    title: 'Stock Ownership',
    keyMetric: 'EXPI',
    keyMetricFont: 'monospace',
    bullets: [
      'Production-based awards',
      'Optional discounted purchase',
      'Public company ownership',
    ],
  },
];

const REVENUE_SHARE = {
  tierCount: 7,
  description: 'eXp pays agents a share of company revenue generated by agents they attract to the brokerage. It\u2019s structured across 7 tiers, continues after retirement, and can be passed to heirs \u2014 with no recruiting requirement.',
  closing: 'Revenue share exists as an option, not an obligation.',
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
          className="chip-label text-xs font-bold uppercase tracking-wider"
          style={{
            color: isActive ? '#0a1520' : '#e5e4dd',
            fontFamily: 'var(--font-family-h3)',
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
    <section className="pt-12 pb-10 px-4 sm:px-8 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        {/* H2 */}
        <div className="text-center mb-8">
          <H2>WHY EXP EXISTS</H2>
        </div>

        {/* Chips visibility sentinel — gates auto-rotation on both desktop and mobile */}
        <div ref={chipsRef}>

        {/* Desktop: two-column grid with dots below */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-[45%_55%] gap-6" style={{ height: '284px', overflow: 'visible' }}>
            {/* Left: chips grid */}
            <div
              style={{
                height: '284px',
                overflow: 'visible',
              }}
            >
              <div className="grid grid-cols-3 gap-3">
                {FEATURES.slice(0, 3).map((f, i) => (
                  <div key={f.keyword}>
                    <FeatureChip
                      icon={f.icon}
                      keyword={f.keyword}
                      isActive={activeIndex === i}
                      onSelect={() => handleSelect(i)}
                    />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {FEATURES.slice(3, 5).map((f, i) => (
                  <div key={f.keyword}>
                    <FeatureChip
                      icon={f.icon}
                      keyword={f.keyword}
                      isActive={activeIndex === i + 3}
                      onSelect={() => handleSelect(i + 3)}
                    />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {FEATURES.slice(5, 7).map((f, i) => (
                  <div key={f.keyword}>
                    <FeatureChip
                      icon={f.icon}
                      keyword={f.keyword}
                      isActive={activeIndex === i + 5}
                      onSelect={() => handleSelect(i + 5)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: detail panel */}
            <div style={{ height: '284px' }}>
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

        {/* Mobile / Tablet: single column with horizontal chip rail */}
        <div className="lg:hidden">
          {/* Horizontal chip rail — breaks out of section padding to reach screen edges */}
          <div className="relative mb-4 -mx-4 sm:-mx-8 md:-mx-12">
            {/* Left fade mask — wide enough to cover the approach, shortened 15px from bottom */}
            <div
              className="absolute left-0 top-0 z-10 pointer-events-none w-10 sm:w-14 md:w-16"
              style={{ bottom: '15px', background: 'linear-gradient(to right, rgb(10,10,10), transparent)' }}
            />
            {/* Right fade mask */}
            <div
              className="absolute right-0 top-0 z-10 pointer-events-none w-10 sm:w-14 md:w-16"
              style={{ bottom: '15px', background: 'linear-gradient(to left, rgb(10,10,10), transparent)' }}
            />

            <div
              ref={chipRailRef}
              className="overflow-x-auto px-4 sm:px-8 md:px-12"
              style={{
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                paddingTop: '28px',
                paddingBottom: '28px',
                marginTop: '-28px',
                marginBottom: '-28px',
              }}
            >
              <div className="flex gap-3 w-fit mx-auto">
                {FEATURES.map((f, i) => (
                  <div
                    key={f.keyword}
                    className="flex-shrink-0"
                    style={{ scrollSnapAlign: 'center', width: '110px' }}
                  >
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

        {/* Validation ribbon — independent third-party proof */}
        <div>
          <p
            className="text-center max-w-[900px] mx-auto text-sm md:text-base leading-relaxed mt-10 mb-[-14px]"
            style={{ color: 'var(--color-body-text)', opacity: 0.65 }}
          >
            Independent validation from third-party organizations
          </p>
          <ValidationRibbon />
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <CTAButton href="#">See the Advantages</CTAButton>
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

function IncomeOwnershipSection() {
  // Scramble counters — trigger on scroll into view
  const oneCounter = useScrambleCounter(1, 1200);
  const threeCounter = useScrambleCounter(3, 1200);
  const tierCounter = useScrambleCounter(7, 1500);
  // Tier bars cascade animation — trigger once on scroll
  const tierBarsReveal = useScrollReveal(0.3);

  return (
    <GlassPanel variant="expBlueCrosshatch">
      <section className="py-16 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1400px] mx-auto">

          {/* A. H2 Heading */}
          <div className="text-center mb-8">
            <H2>INCOME & OWNERSHIP</H2>
          </div>

          {/* B. Intro Text */}
          <div className="text-center max-w-[800px] mx-auto mb-12">
            <p className="text-body leading-relaxed">
              Most brokerages offer one income stream. eXp offers{' '}
              <span style={{ color: '#00bfff', fontWeight: 700 }}>three</span>
              {' '}— production first, with optional paths beyond transactions.
            </p>
          </div>

          {/* C. "1 vs 3" Comparison */}
          <div className="grid grid-cols-[1fr_auto_1fr] sm:grid-cols-[1fr_auto_1fr] gap-3 sm:gap-4 items-center max-w-[700px] mx-auto mb-14">
            {/* Left — Most Brokerages (generic flat card) */}
            <div>
              <div
                className="rounded-xl p-5 sm:p-6 text-center"
                style={{
                  background: 'linear-gradient(180deg, rgba(35,35,35,0.85), rgba(20,20,20,0.9))',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <p
                  className="text-5xl sm:text-6xl lg:text-7xl font-bold tabular-nums"
                  style={{
                    color: 'rgba(255,255,255,0.3)',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  <span ref={oneCounter.elementRef}>
                    {oneCounter.hasAnimated ? '1' : oneCounter.displayValue}
                  </span>
                </p>
                <p
                  className="text-xs sm:text-sm uppercase tracking-wider mt-2"
                  style={{ color: 'var(--color-body-text)', opacity: 0.4 }}
                >
                  INCOME STREAM
                </p>
                <p
                  className="text-[10px] sm:text-xs uppercase tracking-widest mt-1"
                  style={{ color: 'var(--color-body-text)', opacity: 0.3 }}
                >
                  Most Brokerages
                </p>
              </div>
            </div>

            {/* VS pill */}
            <div>
              <span
                className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
                style={{
                  background: 'rgba(0,191,255,0.15)',
                  color: '#00bfff',
                  border: '1px solid rgba(0,191,255,0.3)',
                  fontFamily: 'var(--font-family-h3)',
                }}
              >
                VS
              </span>
            </div>

            {/* Right — eXp Realty (CyberCardGold) */}
            <div>
              <CyberCardGold padding="md" centered>
                <div>
                  <p
                    className="text-5xl sm:text-6xl lg:text-7xl font-bold tabular-nums"
                    style={{
                      color: '#00bfff',
                      textShadow: BLUE_3D_SHADOW,
                    }}
                  >
                    <span ref={threeCounter.elementRef}>
                      {threeCounter.hasAnimated ? '3' : threeCounter.displayValue}
                    </span>
                  </p>
                  <p
                    className="text-xs sm:text-sm uppercase tracking-wider mt-2"
                    style={{ color: '#e5e4dd', opacity: 0.8 }}
                  >
                    INCOME STREAMS
                  </p>
                  <p
                    className="text-[10px] sm:text-xs uppercase tracking-widest mt-1"
                    style={{ color: '#00bfff', opacity: 0.7 }}
                  >
                    eXp Realty
                  </p>
                </div>
              </CyberCardGold>
            </div>
          </div>

          {/* D. Three Income Stream Panels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
            {INCOME_STREAMS.map((stream) => (
              <div key={stream.title}>
                <CyberCard padding="md" centered>
                  <div className="flex flex-col items-center">
                    <Icon3D color="#00bfff" size={40}>
                      <stream.icon size={22} />
                    </Icon3D>

                    {/* Key metric */}
                    <p
                      className="font-bold mt-3 mb-1 tabular-nums flex items-baseline justify-center gap-2"
                      style={{
                        color: '#00bfff',
                        textShadow: BLUE_3D_SHADOW,
                        fontFamily: stream.keyMetricFont || 'inherit',
                      }}
                    >
                      <span className="text-3xl sm:text-4xl">{stream.keyMetric}</span>
                      {stream.keyMetricSub && (
                        <span className="text-sm sm:text-base uppercase tracking-wider" style={{ opacity: 0.7 }}>{stream.keyMetricSub}</span>
                      )}
                    </p>

                    {/* Title */}
                    <h3
                      className="text-base uppercase tracking-wider mb-3"
                      style={{
                        color: '#e5e4dd',
                        fontFamily: 'var(--font-taskor), var(--font-display), system-ui',
                        fontFeatureSettings: '"ss01" 1',
                        fontWeight: 400,
                      }}
                    >
                      {stream.title}
                    </h3>

                    {/* Bullet list */}
                    <ul className="space-y-1.5 text-left">
                      {stream.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="text-sm leading-relaxed flex items-start gap-2"
                          style={{ color: 'var(--color-body-text)' }}
                        >
                          <span style={{ color: '#00bfff', flexShrink: 0, marginTop: '2px' }}>&#x2022;</span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CyberCard>
              </div>
            ))}
          </div>

          {/* E. Revenue Share Spotlight */}
          <div className="mb-12">
            <div
              className="relative overflow-hidden rounded-2xl p-6 sm:p-8 md:p-10"
              style={{
                background: 'rgba(0,40,80,0.3)',
                border: '1px solid rgba(0,191,255,0.25)',
                boxShadow: 'inset 0 0 40px rgba(0,120,255,0.08), 0 0 30px rgba(0,100,200,0.1)',
              }}
            >
              <RisingParticles />
              <div className="relative z-[1] grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 lg:gap-0">
                {/* Text side */}
                <div className="order-2 lg:order-1 flex flex-col justify-center">
                  {/* Badge */}
                  <span
                    className="inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 w-fit"
                    style={{
                      background: 'rgba(0,191,255,0.12)',
                      color: '#00bfff',
                      border: '1px solid rgba(0,191,255,0.25)',
                    }}
                  >
                    UNIQUE DIFFERENTIATOR
                  </span>

                  <h3
                    className="text-2xl sm:text-3xl font-bold uppercase tracking-wider mb-4"
                    style={{
                      color: '#e5e4dd',
                      fontFamily: 'var(--font-family-h3)',
                    }}
                  >
                    Revenue Share
                  </h3>

                  <p
                    className="text-sm sm:text-base leading-relaxed mb-4"
                    style={{ color: 'var(--color-body-text)' }}
                  >
                    {REVENUE_SHARE.description}
                  </p>

                  <p
                    className="text-sm sm:text-base italic mb-4"
                    style={{ color: '#00bfff', opacity: 0.85 }}
                  >
                    {REVENUE_SHARE.closing}
                  </p>

                  <SecondaryButton href="/exp-realty-revenue-share-calculator" variant="blue">Revshare Visualizer</SecondaryButton>
                </div>

                {/* Concentric rings — bleeds to card edges on desktop */}
                <div className="order-1 lg:order-2 flex items-center justify-center lg:block overflow-hidden relative max-h-[clamp(200px,40vw,340px)] lg:max-h-none lg:-mr-10">
                  <div
                    ref={tierBarsReveal.ref}
                    className="relative w-full flex-shrink-0 lg:absolute lg:top-1/2 lg:left-0 lg:-translate-y-1/2"
                    style={{ aspectRatio: '1' }}
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
                        >
                          {/* Tier number label on ring edge — lg only */}
                          <span
                            className="absolute hidden lg:block text-[11px] tabular-nums"
                            style={{
                              top: '50%',
                              right: '-3px',
                              transform: 'translate(100%, -50%)',
                              color: `rgba(255,255,255,${0.3 + (RING_COUNT - 1 - i) * 0.05})`,
                            }}
                          >
                            {i + 1}
                          </span>
                        </div>
                      );
                    })}

                    {/* Center: "7" counter + TIERS label */}
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                      <p
                        className="text-7xl sm:text-8xl font-bold tabular-nums leading-none"
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
                        className="text-base uppercase tracking-widest mt-1"
                        style={{ color: '#e5e4dd', opacity: 0.7 }}
                      >
                        TIERS
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* F. CTA */}
          <div className="text-center">
            <CTAButton href="#">Explore eXp Income</CTAButton>
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
        <section className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
          <LazyAuroraNetworkEffect />
          <div className="max-w-[1900px] mx-auto w-full text-center relative z-10">
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
              <Tagline className="mt-4 text-lg md:text-xl">
                World&apos;s #1 independent brokerage
              </Tagline>
              <p className="text-body mt-4" style={{ opacity: 0.9 }}>
                Built for efficient production and life beyond your last deal.
              </p>
            </div>
          </div>
        </section>
      </StickyHeroWrapper>

      {/* ════ Stats Bar ════ */}
      <StatsBar />

      {/* ════ Section 1: Why eXp Exists ════ */}
      <SpotlightConsole />

      {/* ════ Section 2: Income & Ownership ════ */}
      <IncomeOwnershipSection />

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
