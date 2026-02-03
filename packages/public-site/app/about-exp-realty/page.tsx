'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { H1, H2, Tagline, GlassPanel, Icon3D, CyberCard, CTAButton } from '@saa/shared/components/saa';
import { StickyHeroWrapper } from '@/components/shared/hero-effects/StickyHeroWrapper';
import { LazyAuroraNetworkEffect } from '@/components/shared/hero-effects/LazyHeroEffects';
import { Building2, Layers, Infinity, TrendingUp, Award, Cloud, Users } from 'lucide-react';
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
function StatsBar() {
  return (
    <GlassPanel variant="expBlue" rounded="3xl" opacity={0.12}>
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

          {/* Problem statement */}
          <p
            className="mt-6 text-center max-w-3xl mx-auto text-base md:text-lg leading-relaxed"
            style={{ color: 'var(--color-body-text)', opacity: 0.85 }}
          >
            Most real estate brokerages create friction in daily production and offer no durable plan for what comes after it.
            {' '}Agents are left to solve efficiency, scale, and long-term income on their own.
          </p>
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

      {/* Validation logos */}
      <div className="max-w-[1900px] mx-auto">
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 mt-4 px-4">
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
    detail: 'eXp Realty is publicly traded on the NASDAQ (EXPI). Agents can earn stock awards through production, attracting new agents, and reaching milestones. This is not a perk. It is ownership in the company you help build.',
  },
  {
    icon: Layers,
    keyword: 'Leverage',
    type: 'pillar',
    detail: 'eXp operates across 29+ countries with 84,000+ agents. Instead of local office overhead, agents access cloud-based tools, global referral networks, and systems built for efficiency at scale.',
  },
  {
    icon: Infinity,
    keyword: 'Longevity',
    type: 'pillar',
    detail: 'Revenue sharing at eXp is not a bonus. It is a structural income stream tied to your network. When agents you attract to eXp succeed, you earn a share of their production even if you slow down, step back, or retire.',
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

const MISTY_GOLDEN_BG = `
  radial-gradient(ellipse 120% 80% at 30% 20%, rgba(255,255,255,0.8) 0%, transparent 50%),
  radial-gradient(ellipse 100% 60% at 70% 80%, rgba(255,200,100,0.6) 0%, transparent 40%),
  radial-gradient(ellipse 80% 100% at 50% 50%, rgba(255,215,0,0.7) 0%, transparent 60%),
  radial-gradient(ellipse 60% 40% at 20% 70%, rgba(255,180,50,0.5) 0%, transparent 50%),
  radial-gradient(ellipse 90% 70% at 80% 30%, rgba(255,240,200,0.4) 0%, transparent 45%),
  linear-gradient(180deg, rgba(255,225,150,0.9) 0%, rgba(255,200,80,0.85) 50%, rgba(255,180,50,0.9) 100%)
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
      className="rounded-xl relative overflow-hidden"
      style={{
        border: isActive ? '2px solid rgba(180,150,50,0.5)' : '1px solid rgba(255,255,255,0.1)',
        boxShadow: isActive
          ? '0 0 20px 4px rgba(255,200,80,0.3), 0 0 40px 8px rgba(255,180,50,0.15)'
          : 'none',
        transition: 'border 0.4s ease, box-shadow 0.4s ease',
      }}
    >
      {/* Dark base background */}
      <div className="absolute inset-0 rounded-xl" style={{ background: DARK_CARD_BG }} />
      {/* Misty golden overlay — active only */}
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          background: MISTY_GOLDEN_BG,
          opacity: isActive ? 1 : 0,
          transition: isActive ? 'opacity 0.7s ease-out' : 'opacity 0.2s ease-out',
        }}
      />

      <button
        type="button"
        onClick={onSelect}
        aria-pressed={isActive}
        className="relative z-10 flex flex-col items-center gap-2 w-full cursor-pointer p-3"
      >
        <Icon3D color={isActive ? '#4a3a10' : '#c4a94d'} size={36}>
          <Icon size={20} />
        </Icon3D>
        <h3
          className="text-xs font-bold uppercase tracking-wider"
          style={{
            color: isActive ? '#2a1f05' : '#e5e4dd',
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
  const Icon = feature.icon;
  const [displayed, setDisplayed] = useState(feature);
  const [displayedKey, setDisplayedKey] = useState(transitionKey);
  const [phase, setPhase] = useState<'in' | 'out'>('in');

  useEffect(() => {
    if (transitionKey === displayedKey) return;
    // Start exit animation
    setPhase('out');
    const timer = setTimeout(() => {
      setDisplayed(feature);
      setDisplayedKey(transitionKey);
      setPhase('in');
    }, 200);
    return () => clearTimeout(timer);
  }, [feature, transitionKey, displayedKey]);

  return (
    <CyberCard padding="md" centered={false}>
      <div className="relative h-full flex flex-col justify-center p-4 md:p-6" style={{ minHeight: '320px' }}>
        <div
          style={{
            transition: phase === 'out'
              ? 'opacity 200ms ease-out, transform 200ms ease-out'
              : 'opacity 300ms ease-out 150ms, transform 300ms ease-out 150ms',
            opacity: phase === 'out' ? 0 : 1,
            transform: phase === 'out' ? 'translateY(-8px)' : 'translateY(0)',
          }}
        >
          <div className="flex items-center gap-4 mb-4">
            <Icon3D color="#ffd700" size={56}>
              <displayed.icon size={32} />
            </Icon3D>
            <h3
              className="text-h3"
              style={{ color: '#ffd700' }}
            >
              {displayed.keyword}
            </h3>
          </div>

          {/* Animated gold separator */}
          <div className="relative h-[2px] mb-4 overflow-hidden" style={{ background: 'rgba(255,215,0,0.1)' }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, #ffd700, #c4a94d)',
                transform: phase === 'in' ? 'scaleX(1)' : 'scaleX(0)',
                transformOrigin: 'left',
                transition: 'transform 400ms ease-out 200ms',
              }}
            />
          </div>

          <p
            className="text-body leading-relaxed mb-4"
          >
            {displayed.detail}
          </p>

          <span
            className="inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
            style={{
              background: displayed.type === 'pillar'
                ? 'rgba(255,215,0,0.12)'
                : 'rgba(0,191,255,0.12)',
              color: displayed.type === 'pillar' ? '#ffd700' : '#00bfff',
              border: `1px solid ${displayed.type === 'pillar' ? 'rgba(255,215,0,0.25)' : 'rgba(0,191,255,0.25)'}`,
            }}
          >
            {displayed.type === 'pillar' ? 'CORE PILLAR' : 'STRUCTURAL ADVANTAGE'}
          </span>
        </div>
      </div>
    </CyberCard>
  );
}

function SpotlightConsole() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const lastInteraction = useRef(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const chipRailRef = useRef<HTMLDivElement>(null);

  // Auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPaused) {
        // Check if 8s has passed since last interaction
        if (Date.now() - lastInteraction.current > 8000) {
          setIsPaused(false);
        }
        return;
      }
      setActiveIndex((prev) => (prev + 1) % FEATURES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Scroll active chip into view on mobile
  useEffect(() => {
    if (!chipRailRef.current) return;
    const rail = chipRailRef.current;
    const activeChip = rail.children[activeIndex] as HTMLElement | undefined;
    if (activeChip) {
      activeChip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeIndex]);

  const handleSelect = useCallback((index: number) => {
    setActiveIndex(index);
    setIsPaused(true);
    lastInteraction.current = Date.now();
  }, []);

  // Section entry animation via IntersectionObserver
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="pt-12 pb-10 px-4 sm:px-8 md:px-12"
      onMouseEnter={() => { setIsPaused(true); lastInteraction.current = Date.now(); }}
      onMouseLeave={() => { lastInteraction.current = Date.now(); }}
    >
      <div className="max-w-[1400px] mx-auto">
        {/* H2 + intro */}
        <div
          className="text-center mb-8"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 600ms cubic-bezier(0.16,1,0.3,1), transform 600ms cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <H2>WHY EXP EXISTS</H2>
          <p
            className="mt-4 max-w-3xl mx-auto text-base md:text-lg leading-relaxed"
            style={{ color: 'var(--color-body-text)' }}
          >
            Most brokerages are built to maximize commission today, with little consideration for scale, ownership, or life beyond production.
          </p>
          <p
            className="mt-2 max-w-3xl mx-auto text-sm md:text-base leading-relaxed"
            style={{ color: 'var(--color-body-text)', opacity: 0.75 }}
          >
            eXp was built around production and three more — backed by advantages that are structural, not promotional.
          </p>
        </div>

        {/* Desktop: two-column grid */}
        <div className="hidden lg:grid grid-cols-[45%_55%] gap-6 items-stretch">
          {/* Left: chips grid */}
          <div
            style={{
              opacity: isVisible ? 1 : 0,
              transition: 'opacity 500ms ease-out 200ms',
            }}
          >
            <div className="grid grid-cols-3 gap-3">
              {FEATURES.slice(0, 3).map((f, i) => (
                <div
                  key={f.keyword}
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'scale(1)' : 'scale(0.92)',
                    transition: `opacity 400ms ease-out ${200 + i * 80}ms, transform 400ms ease-out ${200 + i * 80}ms`,
                  }}
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
            <div className="grid grid-cols-2 gap-3 mt-3">
              {FEATURES.slice(3, 5).map((f, i) => (
                <div
                  key={f.keyword}
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'scale(1)' : 'scale(0.92)',
                    transition: `opacity 400ms ease-out ${440 + i * 80}ms, transform 400ms ease-out ${440 + i * 80}ms`,
                  }}
                >
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
                <div
                  key={f.keyword}
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'scale(1)' : 'scale(0.92)',
                    transition: `opacity 400ms ease-out ${600 + i * 80}ms, transform 400ms ease-out ${600 + i * 80}ms`,
                  }}
                >
                  <FeatureChip
                    icon={f.icon}
                    keyword={f.keyword}
                    isActive={activeIndex === i + 5}
                    onSelect={() => handleSelect(i + 5)}
                  />
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
                    background: i === activeIndex ? '#ffd700' : 'rgba(255,255,255,0.25)',
                    boxShadow: i === activeIndex ? '0 0 8px rgba(255,215,0,0.6)' : 'none',
                    transform: i === activeIndex ? 'scale(1.3)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right: detail panel */}
          <div
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(20px)',
              transition: 'opacity 700ms ease-out 300ms, transform 700ms ease-out 300ms',
            }}
          >
            <DetailPanel feature={FEATURES[activeIndex]} transitionKey={activeIndex} />
          </div>
        </div>

        {/* Mobile / Tablet: single column with horizontal chip rail */}
        <div className="lg:hidden">
          {/* Horizontal chip rail */}
          <div
            className="relative mb-4"
            style={{
              opacity: isVisible ? 1 : 0,
              transition: 'opacity 500ms ease-out 200ms',
            }}
          >
            {/* Left fade mask */}
            <div
              className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none w-6"
              style={{ background: 'linear-gradient(to right, rgba(10,10,10,0.9), transparent)' }}
            />
            {/* Right fade mask */}
            <div
              className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none w-6"
              style={{ background: 'linear-gradient(to left, rgba(10,10,10,0.9), transparent)' }}
            />

            <div
              ref={chipRailRef}
              className="flex gap-3 overflow-x-auto pb-2 px-2"
              style={{
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
              }}
            >
              {FEATURES.map((f, i) => (
                <div
                  key={f.keyword}
                  className="flex-shrink-0"
                  style={{ scrollSnapAlign: 'center', width: '100px' }}
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

          {/* Detail panel (full width) */}
          <div
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 600ms ease-out 400ms, transform 600ms ease-out 400ms',
            }}
          >
            <DetailPanel feature={FEATURES[activeIndex]} transitionKey={activeIndex} />
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
                  background: i === activeIndex ? '#ffd700' : 'rgba(255,255,255,0.25)',
                  boxShadow: i === activeIndex ? '0 0 8px rgba(255,215,0,0.6)' : 'none',
                  transform: i === activeIndex ? 'scale(1.3)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Validation ribbon — independent third-party proof */}
        <div
          style={{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 600ms ease-out 500ms',
          }}
        >
          <ValidationRibbon />
        </div>

        {/* Closing statement + CTA */}
        <div
          className="mt-8 text-center"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 600ms ease-out 600ms',
          }}
        >
          <p
            className="max-w-2xl mx-auto text-sm md:text-base leading-relaxed mb-6"
            style={{ color: 'var(--color-body-text)', opacity: 0.8 }}
          >
            This structure supports agents while they are actively producing and provides options when they are ready to slow down, step back, or think beyond their next deal.
          </p>
          <CTAButton href="#">Explore eXp&apos;s Unmatched Advantages</CTAButton>
        </div>
      </div>
    </section>
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
          <LazyAuroraNetworkEffect />
          <div className="max-w-[1900px] mx-auto w-full text-center relative z-10">
            <div className="relative z-10">
              <H1>ABOUT EXP REALTY</H1>
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
    </main>
  );
}
