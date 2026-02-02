'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { H1, H2, Tagline, GlassPanel, Icon3D, CTAButton, SecondaryButton, JoinModal, InstructionsModal } from '@saa/shared/components/saa';
import { VideoSlidePanel } from '@saa/shared/components/saa/media/VideoSlidePanel';
import { StickyHeroWrapper } from '@/components/shared/hero-effects/StickyHeroWrapper';
import { SatelliteConstellationEffect } from '@/components/shared/hero-effects/SatelliteConstellationEffect';
import dynamic from 'next/dynamic';

const HolographicGlobe = dynamic(
  () => import('@/components/shared/HolographicGlobe').then(mod => mod.HolographicGlobe),
  { ssr: false }
);

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
  label
}: {
  prefix?: string;
  targetNumber: number;
  suffix?: string;
  label: string;
}) {
  const { displayValue, elementRef, hasAnimated } = useScrambleCounter(targetNumber, 2000);

  return (
    <div
      className="text-center p-6 rounded-xl"
      style={{
        background: 'rgba(20,20,20,0.75)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <p className="stat-3d-text text-4xl lg:text-5xl font-bold mb-2 tabular-nums">
        <span>{prefix}</span>
        <span ref={elementRef}>
          {hasAnimated ? targetNumber.toLocaleString() : displayValue.toLocaleString()}
        </span>
        <span>{suffix}</span>
      </p>
      <p className="text-sm uppercase tracking-wider" style={{ color: 'var(--color-body-text)', opacity: 0.8 }}>
        {label}
      </p>
    </div>
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
          <div className="flex justify-center items-center gap-10 md:gap-16 mt-2 px-4">
            {LOGOS.map((logo) => (
              <Icon3D key={logo.id} size={logo.id === 'glassdoor-logo' ? 156 : 120}>
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className={`w-auto object-contain ${logo.id === 'glassdoor-logo' ? 'h-[78px] md:h-[78px]' : 'h-20 md:h-[60px]'}`}
                  style={{ filter: 'brightness(0) invert(0.8)' }}
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
   BLOCK B: "Where eXp Stands Apart" — 3D Flip Card Stack
   ═══════════════════════════════════════════════════════════════ */

const FLIP_CARDS = [
  {
    front: 'Profitability',
    icon: '📊',
    back: 'The only cumulatively profitable publicly traded real estate brokerage in recent years.',
  },
  {
    front: 'Agent Satisfaction',
    icon: '⭐',
    back: 'Consistently the highest-ranked brokerage on Glassdoor\'s anonymous agent reviews — eight consecutive years.',
  },
  {
    front: 'Innovation',
    icon: '🔮',
    back: 'A cloud-based model that reinvests in systems, support, and agent programs instead of physical offices and franchise layers.',
  },
  {
    front: 'Sponsor Support',
    icon: '🤝',
    back: 'The only brokerage that allows sponsors to independently build and deliver additional support programs.',
  },
];

function UnmatchedFlipCards() {
  const [activeCard, setActiveCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const autoFlipRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-rotate every 4 seconds
  useEffect(() => {
    autoFlipRef.current = setInterval(() => {
      setIsFlipped(true);
      setTimeout(() => {
        setIsFlipped(false);
        setTimeout(() => {
          setActiveCard(prev => (prev + 1) % FLIP_CARDS.length);
        }, 400);
      }, 2500);
    }, 4000);

    return () => {
      if (autoFlipRef.current) clearInterval(autoFlipRef.current);
    };
  }, []);

  const handleCardClick = (index: number) => {
    if (autoFlipRef.current) clearInterval(autoFlipRef.current);
    if (index === activeCard) {
      setIsFlipped(!isFlipped);
    } else {
      setIsFlipped(false);
      setActiveCard(index);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Card Container */}
      <div
        className="relative w-full max-w-md mx-auto"
        style={{ perspective: '1200px', height: '220px' }}
      >
        <div
          className="absolute inset-0 transition-transform duration-700 ease-in-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateX(180deg)' : 'rotateX(0deg)',
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-4 p-8 cursor-pointer"
            style={{
              backfaceVisibility: 'hidden',
              background: 'rgba(20,20,20,0.85)',
              border: '1px solid rgba(0,191,255,0.3)',
              boxShadow: '0 0 30px rgba(0,191,255,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
            onClick={() => handleCardClick(activeCard)}
          >
            <span className="text-4xl">{FLIP_CARDS[activeCard].icon}</span>
            <h3
              className="text-2xl font-bold text-center"
              style={{ color: '#00bfff' }}
            >
              {FLIP_CARDS[activeCard].front}
            </h3>
            <p className="text-xs uppercase tracking-widest opacity-50 text-body">
              Tap to reveal
            </p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-8 cursor-pointer"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateX(180deg)',
              background: 'rgba(20,20,20,0.92)',
              border: '1px solid rgba(0,191,255,0.2)',
              boxShadow: '0 0 30px rgba(0,191,255,0.08)',
            }}
            onClick={() => handleCardClick(activeCard)}
          >
            <p className="text-body text-base text-center leading-relaxed">
              {FLIP_CARDS[activeCard].back}
            </p>
          </div>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex gap-3">
        {FLIP_CARDS.map((card, idx) => (
          <button
            key={idx}
            onClick={() => handleCardClick(idx)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300"
            style={{
              background: idx === activeCard ? 'rgba(0,191,255,0.15)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${idx === activeCard ? 'rgba(0,191,255,0.4)' : 'rgba(255,255,255,0.1)'}`,
            }}
          >
            <span className="text-sm">{card.icon}</span>
            <span
              className="text-xs font-medium hidden sm:inline"
              style={{ color: idx === activeCard ? '#00bfff' : 'rgba(255,255,255,0.5)' }}
            >
              {card.front}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   BLOCK C: "The Platform" — Horizontal Scroll Cards
   ═══════════════════════════════════════════════════════════════ */

const PLATFORM_CARDS = [
  {
    headline: 'Support',
    subhead: 'Built to keep pace with ambition',
    bullets: [
      '2,000+ salaried support staff',
      '24/7 Expert Care help desk',
      'AI assistant (Mira) for instant answers',
      'Structured mentor program for first 3 transactions',
      'Regus office access worldwide',
    ],
    btnText: 'Explore eXp support',
  },
  {
    headline: 'Technology',
    subhead: 'Fewer logins. Better workflows.',
    bullets: [
      'Choice of CRM: BoldTrail, Lofty, or Cloze',
      'IDX websites — eXp-branded or custom',
      'eXp World virtual campus',
      'Canva Pro marketing tools',
      'Performance tracking and analytics',
    ],
    btnText: 'Explore eXp technology',
  },
  {
    headline: 'Community',
    subhead: 'An operating layer, not a social layer',
    bullets: [
      'Live collaboration inside eXp World',
      'Global referral opportunities',
      'Cross-market masterminds and events',
      'Direct access to leadership',
      'Culture of sharing best practices',
    ],
    btnText: 'Explore eXp community',
  },
];

function PlatformScrollCards() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-scroll every 3.5s
  useEffect(() => {
    autoScrollRef.current = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % PLATFORM_CARDS.length);
    }, 3500);

    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, []);

  // Scroll to active card
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const cardWidth = container.scrollWidth / PLATFORM_CARDS.length;
    container.scrollTo({ left: cardWidth * activeIndex, behavior: 'smooth' });
  }, [activeIndex]);

  const handleCardClick = (index: number) => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    setActiveIndex(index);
  };

  return (
    <div className="relative w-screen -ml-[50vw] left-1/2">
      {/* Portal Edges - blue */}
      <div
        className="absolute left-0 z-20 pointer-events-none"
        style={{
          top: '-8px', bottom: '-8px', width: '12px',
          borderRadius: '0 12px 12px 0',
          background: `radial-gradient(ellipse 200% 50% at 0% 50%, rgba(0,150,255,0.35) 0%, rgba(0,120,200,0.2) 40%, rgba(0,80,150,0.1) 70%, rgba(0,40,80,0.05) 100%)`,
          borderRight: '1px solid rgba(0,150,255,0.4)',
          boxShadow: 'inset -3px 0 6px rgba(0,150,255,0.2), 3px 0 12px rgba(0,0,0,0.6)',
          transform: 'perspective(500px) rotateY(-3deg)', transformOrigin: 'right center',
        }}
      />
      <div
        className="absolute right-0 z-20 pointer-events-none"
        style={{
          top: '-8px', bottom: '-8px', width: '12px',
          borderRadius: '12px 0 0 12px',
          background: `radial-gradient(ellipse 200% 50% at 100% 50%, rgba(0,150,255,0.35) 0%, rgba(0,120,200,0.2) 40%, rgba(0,80,150,0.1) 70%, rgba(0,40,80,0.05) 100%)`,
          borderLeft: '1px solid rgba(0,150,255,0.4)',
          boxShadow: 'inset 3px 0 6px rgba(0,150,255,0.2), -3px 0 12px rgba(0,0,0,0.6)',
          transform: 'perspective(500px) rotateY(3deg)', transformOrigin: 'left center',
        }}
      />

      {/* Scrollable Cards */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{
          marginLeft: '12px', marginRight: '12px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {PLATFORM_CARDS.map((card, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-full snap-center p-6 md:p-8 cursor-pointer transition-all duration-500"
            onClick={() => handleCardClick(idx)}
            style={{
              background: idx === activeIndex
                ? 'rgba(20,20,20,0.9)'
                : 'rgba(20,20,20,0.6)',
              borderTop: `1px solid ${idx === activeIndex ? 'rgba(0,191,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
              borderBottom: `1px solid ${idx === activeIndex ? 'rgba(0,191,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
              filter: idx === activeIndex ? 'none' : 'blur(0.5px) grayscale(0.3)',
            }}
          >
            <div className="max-w-3xl mx-auto">
              <h3
                className="text-2xl md:text-3xl font-bold mb-1"
                style={{ color: '#00bfff' }}
              >
                {card.headline}
              </h3>
              <p className="text-body text-sm mb-5 italic" style={{ opacity: 0.7 }}>
                {card.subhead}
              </p>
              <ul className="space-y-2 mb-6">
                {card.bullets.map((bullet, bIdx) => (
                  <li
                    key={bIdx}
                    className="text-body flex items-start gap-3 text-sm md:text-base"
                  >
                    <span style={{ color: '#00bfff', flexShrink: 0, marginTop: '2px' }}>&#9656;</span>
                    {bullet}
                  </li>
                ))}
              </ul>
              <SecondaryButton variant="blue" href="#">
                {card.btnText}
              </SecondaryButton>
            </div>
          </div>
        ))}
      </div>

      {/* Progress indicator */}
      <div className="flex justify-center gap-2 mt-4">
        {PLATFORM_CARDS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleCardClick(idx)}
            className="w-8 h-1.5 rounded-full transition-all duration-300"
            style={{
              background: idx === activeIndex ? '#00bfff' : 'rgba(255,255,255,0.2)',
            }}
          />
        ))}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   BLOCK D: "The Economics" — Tabbed Interface
   ═══════════════════════════════════════════════════════════════ */

const INCOME_TABS = [
  {
    label: 'Commission',
    content: [
      '80/20 split until a $16,000 annual cap',
      '100% commission after cap',
      'ICON agents earn the $16,000 cap back in company stock',
    ],
  },
  {
    label: 'Stock',
    content: [
      'Production-based stock awards',
      'Optional discounted stock purchase program',
      'Ownership in a publicly traded company',
    ],
  },
  {
    label: 'Fees',
    content: [
      '$85 per month flat fee',
      'No desk fees',
      'No franchise fees',
      'No royalty fees',
    ],
  },
  {
    label: 'Revenue Share',
    content: [
      'Seven-tier revenue share paid from company revenue',
      'Can continue after retirement',
      'Can be passed on to heirs',
      'No recruiting requirement',
    ],
  },
];

function IncomeTabSection() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      {/* Tab Bar */}
      <div className="flex flex-wrap gap-1 mb-6 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
        {INCOME_TABS.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className="flex-1 min-w-[80px] px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300"
            style={{
              background: idx === activeTab ? 'rgba(0,191,255,0.12)' : 'transparent',
              color: idx === activeTab ? '#00bfff' : 'rgba(255,255,255,0.5)',
              borderBottom: idx === activeTab ? '2px solid #00bfff' : '2px solid transparent',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div
        className="rounded-xl p-6 min-h-[180px]"
        style={{
          background: 'rgba(20,20,20,0.6)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <ul className="space-y-3">
          {INCOME_TABS[activeTab].content.map((item, idx) => (
            <li
              key={idx}
              className="text-body flex items-start gap-3 text-base"
              style={{ animation: 'fadeIn 0.3s ease-out' }}
            >
              <span style={{ color: '#00bfff', flexShrink: 0, marginTop: '3px' }}>&#9670;</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {activeTab === 3 && (
        <p className="text-body text-sm mt-3 opacity-60 italic">
          Revenue share is an option, not an obligation.
        </p>
      )}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   BLOCK E: "The Ecosystem" — Bento Grid
   ═══════════════════════════════════════════════════════════════ */

const DIVISIONS = [
  'Residential', 'Commercial', 'Luxury',
  'Land & Ranch', 'Sports & Entertainment', 'Referral-only',
];

const SOLUTIONS = [
  'Healthcare options', 'Custom signage',
  'Transaction coordination', 'Lending & warranty partners',
  'Utility & closing services', 'Continuing education',
];

function EcosystemBentoGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      {/* Leads Cell — wider */}
      <div
        className="md:col-span-7 rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1"
        style={{
          background: 'rgba(20,20,20,0.7)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <h3 className="text-xl font-bold mb-1" style={{ color: '#00bfff' }}>Leads</h3>
        <p className="text-body text-xs uppercase tracking-widest mb-4" style={{ opacity: 0.5 }}>
          Optional opportunities, not empty promises
        </p>
        <p className="text-body text-sm leading-relaxed mb-4">
          eXp provides a lead ecosystem designed to support different business models at different stages.
          Lead programs vary by source and strategy, allowing agents to engage selectively rather than commit to a single funnel.
          Some programs are referral-based. Some require ad spend. Some are organic and included. None are required.
        </p>
        <SecondaryButton variant="blue" href="#">
          Explore eXp leads
        </SecondaryButton>
      </div>

      {/* Divisions Cell */}
      <div
        className="md:col-span-5 rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1"
        style={{
          background: 'rgba(20,20,20,0.7)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <h3 className="text-xl font-bold mb-1" style={{ color: '#00bfff' }}>Divisions</h3>
        <p className="text-body text-xs uppercase tracking-widest mb-4" style={{ opacity: 0.5 }}>
          Specialize without switching brokerages
        </p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {DIVISIONS.map((div, idx) => (
            <div
              key={idx}
              className="text-body px-3 py-2 rounded-lg text-xs font-medium text-center"
              style={{
                background: 'rgba(0,191,255,0.06)',
                border: '1px solid rgba(0,191,255,0.15)',
              }}
            >
              {div}
            </div>
          ))}
        </div>
        <SecondaryButton variant="blue" href="#">
          Explore eXp divisions
        </SecondaryButton>
      </div>

      {/* Solutions Cell — full width */}
      <div
        className="md:col-span-12 rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1"
        style={{
          background: 'rgba(20,20,20,0.7)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <h3 className="text-xl font-bold mb-1" style={{ color: '#00bfff' }}>Solutions</h3>
        <p className="text-body text-xs uppercase tracking-widest mb-4" style={{ opacity: 0.5 }}>
          Partnerships that remove friction
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {SOLUTIONS.map((solution, idx) => (
            <div
              key={idx}
              className="text-body flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <span style={{ color: '#00bfff', fontSize: '10px' }}>&#9632;</span>
              {solution}
            </div>
          ))}
        </div>
        <SecondaryButton variant="blue" href="#">
          Explore eXp solutions
        </SecondaryButton>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   eXp World Section — HolographicGlobe background + Guest Pass CTA
   ═══════════════════════════════════════════════════════════════ */

function ExpWorldSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isGlobeVisible, setIsGlobeVisible] = useState(false);

  // IntersectionObserver: pause globe when section scrolls out of view
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsGlobeVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const handleGuestPass = () => {
    window.dispatchEvent(new CustomEvent('open-vip-guest-pass'));
  };

  return (
    <div ref={sectionRef} className="relative w-screen -ml-[50vw] left-1/2">
      <GlassPanel variant="expBlue" rounded="3xl" opacity={0.12}>
        <section className="relative py-16 md:py-24 px-4 sm:px-6 overflow-hidden" style={{ minHeight: '500px' }}>
          {/* HolographicGlobe as background */}
          <div className="absolute inset-0 z-0">
            <HolographicGlobe isVisible={isGlobeVisible} />
            {/* Feathered overlay for text readability */}
            <div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,10,30,0.3) 0%, rgba(0,10,30,0.7) 60%, rgba(0,10,30,0.9) 100%)',
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-[900px] mx-auto text-center">
            <H2 theme="blue">eXp World</H2>
            <p className="text-body mt-4 mb-4 max-w-2xl mx-auto text-lg leading-relaxed">
              eXp World is a fully immersive virtual campus — built for collaboration, not commutes.
            </p>
            <p className="text-body mb-8 max-w-2xl mx-auto">
              84,000+ agents across 29 countries connect in real time for live training, leadership access,
              team meetings, and client-facing rooms. Set up your own virtual office and work from anywhere in the world.
            </p>
            <SecondaryButton variant="blue" as="button" onClick={handleGuestPass}>
              Get Your Guest Pass
            </SecondaryButton>
          </div>
        </section>
      </GlassPanel>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════ */

/**
 * About eXp Realty Page
 * Comprehensive overview of eXp Realty's features, benefits, and business model
 * Brand tone: awe-inspiring, futuristic, direct
 *
 * 6 Visual Blocks:
 * A - Why eXp Exists (3-column pillars)
 * B - Where eXp Stands Apart (flip cards)
 * C - The Platform (horizontal scroll cards)
 * D - The Economics (tabbed interface)
 * E - The Ecosystem (bento grid)
 * F - Is eXp Right For You? (closing CTA)
 */
export default function AboutExpRealty() {
  const [activePanel, setActivePanel] = useState<'join' | 'instructions' | 'video' | null>(null);
  const [userName, setUserName] = useState('');

  const handleJoinSuccess = useCallback((data: { firstName: string }) => {
    setUserName(data.firstName);
    setActivePanel('instructions');
  }, []);

  const handleCloseModal = useCallback(() => {
    setActivePanel(null);
  }, []);

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
              <Tagline className="mt-4">
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


      {/* ════ BLOCK A: Why eXp Exists — Normal dark bg ════ */}
      <section className="py-10 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          <H2 theme="blue">Why eXp Exists</H2>
          <p className="text-body mt-4 mb-8 max-w-3xl">
            Most brokerages are built to maximize commission today, with little consideration for scale, ownership, or life beyond production.
            eXp was built around commission <em>and</em> three more:
          </p>

          {/* 3-Column Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { num: '01', title: 'Ownership', desc: 'In a publicly traded company' },
              { num: '02', title: 'Leverage', desc: 'Through scale, systems, and collaboration' },
              { num: '03', title: 'Longevity', desc: 'Income that continues after your last closing' },
            ].map((pillar) => (
              <div
                key={pillar.num}
                className="text-center p-6 rounded-xl"
                style={{
                  background: 'rgba(20,20,20,0.5)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <p
                  className="text-3xl font-bold mb-2"
                  style={{ color: '#00bfff', opacity: 0.6 }}
                >
                  {pillar.num}
                </p>
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: '#e5e4dd' }}
                >
                  {pillar.title}
                </h3>
                <p className="text-body text-sm">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>

          <p className="text-body">
            This structure supports agents while they are actively producing and provides options when they are ready to slow down, step back, or think beyond their next deal.
          </p>
        </div>
      </section>


      {/* ════ eXp World — BLUE GLASS + HolographicGlobe bg ════ */}
      <ExpWorldSection />


      {/* ════ BLOCK B: Where eXp Stands Apart — Normal dark bg ════ */}
      <section className="py-10 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          <H2 theme="blue">Where eXp Stands Apart</H2>
          <p className="text-body mt-4 mb-8 max-w-3xl">
            These advantages are structural, not promotional. Unlike franchise brokerages, eXp Realty does not rely on office-based profit centers.
          </p>
          <UnmatchedFlipCards />
          <div className="mt-6 flex justify-center">
            <SecondaryButton variant="blue" href="#">
              Explore the full case for eXp
            </SecondaryButton>
          </div>
        </div>
      </section>


      {/* ════ BLOCK C: The Platform — BLUE GLASS full-width ════ */}
      <div className="relative w-screen -ml-[50vw] left-1/2">
        <GlassPanel variant="expBlue" rounded="3xl" opacity={0.10}>
          <section className="py-10 px-4 sm:px-6">
            <div className="max-w-[1200px] mx-auto mb-6">
              <H2 theme="blue">The Platform</H2>
              <p className="text-body mt-4">
                Support, technology, and community — integrated into one operating system.
              </p>
            </div>
            <PlatformScrollCards />
          </section>
        </GlassPanel>
      </div>


      {/* ════ BLOCK D: The Economics — Normal dark bg ════ */}
      <section className="py-10 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          <H2 theme="blue">The Economics</H2>
          <p className="text-body mt-4 mb-8 max-w-3xl">
            Most brokerages offer one income stream. eXp offers three: commission, stock, and revenue share.
          </p>
          <IncomeTabSection />
          <div className="mt-6 flex justify-center">
            <SecondaryButton variant="blue" href="#">
              Explore eXp income
            </SecondaryButton>
          </div>
        </div>
      </section>


      {/* ════ BLOCKS E+F: Ecosystem + CTA — BLUE GLASS full-width ════ */}
      <div className="relative w-screen -ml-[50vw] left-1/2">
        <GlassPanel variant="expBlue" rounded="3xl" opacity={0.10}>
          <section className="py-10 px-4 sm:px-6">
            <div className="max-w-[1200px] mx-auto">
              <H2 theme="blue">The Ecosystem</H2>
              <p className="text-body mt-4 mb-8 max-w-3xl">
                Leads, divisions, and solutions — all within one brokerage. Your license stays the same. Your opportunities expand.
              </p>
              <EcosystemBentoGrid />
            </div>
          </section>

          <section className="py-10 px-4 sm:px-6">
            <div className="max-w-[1200px] mx-auto">
              {/* Part 1: Fit + SAA Positioning */}
              <div className="mb-10">
                <H2 theme="blue">Is eXp Right For You?</H2>
                <p className="text-body mt-4 mb-4">
                  eXp works best for agents who value:
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    'Independence over hierarchy',
                    'Systems over micromanagement',
                    'Long-term optionality over short-term perks',
                  ].map((item, idx) => (
                    <li key={idx} className="text-body flex items-center gap-3">
                      <span style={{ color: '#00bfff' }}>&#9670;</span>
                      <span className="text-base">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-body">
                  Smart Agent Alliance operates inside eXp Realty as a sponsor organization, providing additional systems, training, and community to agents who choose it.
                </p>
              </div>

              {/* Part 2: The Bottom Line CTA */}
              <div className="p-8 md:p-12 text-center">
                <H2 theme="blue">The Bottom Line</H2>

                {/* 4 Keywords */}
                <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-6 mb-8">
                  {['Profitable', 'Scalable', 'Agent-centric', 'Global'].map((word) => (
                    <span
                      key={word}
                      className="text-lg md:text-xl font-bold tracking-wide"
                      style={{ color: '#00bfff' }}
                    >
                      {word}.
                    </span>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                  <CTAButton
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setActivePanel('join');
                    }}
                  >
                    JOIN THE ALLIANCE
                  </CTAButton>
                  <CTAButton
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setActivePanel('video');
                    }}
                  >
                    WATCH THE INSIDE LOOK
                  </CTAButton>
                </div>

                <SecondaryButton href="/about">
                  Learn about SAA
                </SecondaryButton>
              </div>
            </div>
          </section>
        </GlassPanel>
      </div>


      {/* ════ MODALS ════ */}

      {/* Shared Backdrop */}
      {(activePanel === 'join' || activePanel === 'instructions') && (
        <div
          className="fixed inset-0 z-[10019] bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={handleCloseModal}
          aria-hidden="true"
        />
      )}

      {/* Join Modal */}
      <JoinModal
        isOpen={activePanel === 'join' || activePanel === 'instructions'}
        onClose={handleCloseModal}
        onSuccess={handleJoinSuccess}
        sponsorName={null}
        hideBackdrop={true}
        zIndexOffset={0}
      />

      {/* Instructions Modal */}
      <InstructionsModal
        isOpen={activePanel === 'instructions'}
        onClose={handleCloseModal}
        userName={userName}
        hideBackdrop={true}
        zIndexOffset={1}
        onNotYou={() => {
          try {
            localStorage.removeItem('saa_join_submitted');
          } catch {}
          setActivePanel('join');
        }}
      />

      {/* Video Slide Panel */}
      <VideoSlidePanel
        isOpen={activePanel === 'video'}
        onClose={handleCloseModal}
      />
    </main>
  );
}
