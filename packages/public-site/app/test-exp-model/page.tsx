'use client';

/**
 * =============================================================================
 * SAA Design System - Scroll Animation Variations
 * =============================================================================
 *
 * This page showcases reusable scroll animation effects that can be used
 * as components throughout the site.
 *
 * VARIATION 2: Stacked Flipping Cards
 *   - 3D rotating card stack with magnetic snap
 *   - Cards flip up and away as you scroll
 *
 * VARIATION 6: Horizontal Scroll Cards
 *   - Cards slide horizontally with magnetic centering
 *   - Active card highlighted with mystic fog effect
 *
 * =============================================================================
 */

import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { H2, Icon3D } from '@saa/shared/components/saa';
import { DollarSign, TrendingUp, Zap, RefreshCw } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Brand colors
const BRAND_YELLOW = '#ffd700'; // Primary brand yellow for UI elements
const ICON_GOLD = '#c4a94d'; // 3D icon metallic gold

// Register GSAP plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Content data
const PROBLEM_TEXT = {
  line1: "Most real estate brokerages create friction in daily production and offer no durable plan for what comes after it.",
  line2: "Agents are left to solve efficiency, scale, and long-term income on their own."
};

const MODEL_INTRO = {
  line1: "Most brokerages are built around one goal: commission today.",
  line2: "eXp was built around that and three more:"
};

// Icon components for each pillar
const PILLAR_ICONS = [DollarSign, TrendingUp, Zap, RefreshCw];

const PILLARS = [
  {
    title: "Commission",
    subtitle: "The Foundation",
    description: "80/20 split until $16K cap, then 100%. ICON agents earn the cap back in stock.",
  },
  {
    title: "Ownership",
    subtitle: "Build Equity",
    description: "Earn EXPI stock for production milestones. Own part of a publicly traded company.",
  },
  {
    title: "Leverage",
    subtitle: "Scale Systems",
    description: "Access 90,000+ agents globally. Systems that scale with your ambition.",
  },
  {
    title: "Longevity",
    subtitle: "Income That Lasts",
    description: "Seven-tier revenue share. Continues after retirement. Passed to heirs.",
  }
];

const OUTRO = "This model supports agents while they are actively producing and provides options when they are ready to slow down, step back, or think beyond their next deal.";

// ============================================================
// VARIATION 2: Stacked Flipping Cards
// TYPE: GSAP ScrollTrigger with magnetic snap
// Extracted from WhyOnlyAtExp section - reusable effect
// ============================================================

// Sample content for Variation 2
const VARIATION_2_CARDS = [
  { num: 1, text: "Most real estate brokerages provide tools, training, and support centrally.", highlight: false },
  { num: 2, text: "Even when sponsorship exists, sponsors are limited to offering only what the brokerage provides.", highlight: false },
  { num: 3, text: "eXp Realty sponsorship works differently.", highlight: true },
];

// 3D Number Component for card numbers
function Number3D({ num, highlight = false }: { num: number; highlight?: boolean }) {
  const highlightColor = '#9a9a9a';
  const highlightFilter = 'drop-shadow(-1px -1px 0 #ccc) drop-shadow(1px 1px 0 #666) drop-shadow(2px 2px 0 #444) drop-shadow(3px 3px 2px rgba(0, 0, 0, 0.5))';

  return (
    <span
      className="inline-flex items-center justify-center font-bold"
      style={{
        minWidth: '56px',
        height: '56px',
        fontSize: '32px',
        color: highlight ? highlightColor : '#c4a94d',
        filter: highlight ? highlightFilter : 'drop-shadow(-1px -1px 0 #ffe680) drop-shadow(1px 1px 0 #8a7a3d) drop-shadow(3px 3px 0 #2a2a1d) drop-shadow(4px 4px 2px rgba(0, 0, 0, 0.5))',
        transform: 'perspective(500px) rotateX(8deg)',
      }}
    >
      {num}
    </span>
  );
}

function Variation2() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const cardStackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  // Refs for magnetic effect
  const rawProgressRef = useRef(0);
  const displayProgressRef = useRef(0);
  const lastRawRef = useRef(0);
  const velocityRef = useRef(0);
  const rafRef = useRef<number>(0);
  const isMobileRef = useRef(false);

  const totalCards = VARIATION_2_CARDS.length;

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if mobile
    isMobileRef.current = window.innerWidth < 768;

    // Grace period: 10% at start and 10% at end of scroll range
    const GRACE = isMobileRef.current ? 0 : 0.1;
    const CONTENT_RANGE = 1 - (GRACE * 2);

    // Velocity-based magnetic snap
    const animateMagnetic = () => {
      const raw = rawProgressRef.current;
      const lastRaw = lastRawRef.current;
      const currentDisplay = displayProgressRef.current;

      // Calculate velocity (change since last frame)
      const instantVelocity = Math.abs(raw - lastRaw);
      // Smooth velocity with decay
      velocityRef.current = velocityRef.current * 0.9 + instantVelocity * 0.1;
      lastRawRef.current = raw;

      // Card positions are at 0, 0.5, 1 (for 3 cards)
      const cardStep = 1 / (totalCards - 1);
      const nearestCardIndex = Math.round(raw / cardStep);
      const nearestCardProgress = Math.max(0, Math.min(1, nearestCardIndex * cardStep));

      // When velocity is high, follow raw position
      // When velocity is low, snap to nearest card
      const velocityFactor = Math.min(1, velocityRef.current * 100);

      // Blend between snap target (when stopped) and raw position (when scrolling)
      const targetProgress = nearestCardProgress * (1 - velocityFactor) + raw * velocityFactor;

      // Smooth interpolation toward target
      const newProgress = currentDisplay + (targetProgress - currentDisplay) * 0.15;

      if (Math.abs(newProgress - currentDisplay) > 0.0001) {
        displayProgressRef.current = newProgress;
        setProgress(newProgress);
      }

      rafRef.current = requestAnimationFrame(animateMagnetic);
    };

    rafRef.current = requestAnimationFrame(animateMagnetic);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: cardStackRef.current,
        start: 'center 55%',
        end: '+=200%',
        pin: triggerRef.current,
        pinSpacing: true,
        scrub: 0.5,
        onUpdate: (self: ScrollTrigger) => {
          const mobileMultiplier = isMobileRef.current ? 2 : 1;
          let cardProgress = 0;

          if (self.progress <= GRACE) {
            cardProgress = 0;
          } else if (self.progress >= 1 - GRACE) {
            cardProgress = 1;
          } else {
            cardProgress = Math.min((self.progress - GRACE) / CONTENT_RANGE * mobileMultiplier, 1);
          }

          rawProgressRef.current = cardProgress;
        },
      });
    }, sectionRef);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ctx.revert();
    };
  }, [totalCards]);

  // Misty gold background for highlighted card
  const mistyBackground = `
    radial-gradient(ellipse 120% 80% at 30% 20%, rgba(255,255,255,0.8) 0%, transparent 50%),
    radial-gradient(ellipse 100% 60% at 70% 80%, rgba(255,200,100,0.6) 0%, transparent 40%),
    radial-gradient(ellipse 80% 100% at 50% 50%, rgba(255,215,0,0.7) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 20% 70%, rgba(255,180,50,0.5) 0%, transparent 50%),
    radial-gradient(ellipse 90% 70% at 80% 30%, rgba(255,240,200,0.4) 0%, transparent 45%),
    linear-gradient(180deg, rgba(255,225,150,0.9) 0%, rgba(255,200,80,0.85) 50%, rgba(255,180,50,0.9) 100%)
  `;
  const darkBackground = 'linear-gradient(180deg, rgba(40,40,40,0.98), rgba(20,20,20,0.99))';

  return (
    <section ref={sectionRef}>
      <div
        ref={triggerRef}
        style={{
          willChange: 'transform',
          contain: 'layout style paint',
        }}
      >
        <div className="px-6 py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            {/* Section Label */}
            <div className="text-center mb-4">
              <span className="text-xs uppercase tracking-widest text-gold-500 font-medium">
                Variation 2: Stacked Flipping Cards
              </span>
            </div>

            <div className="text-center mb-8">
              <H2>Sample Heading</H2>
            </div>

            {/* 3D Rotating Card Stack */}
            <div
              ref={cardStackRef}
              className="relative w-full max-w-lg mx-auto"
              style={{
                perspective: '1200px',
                height: '340px',
              }}
            >
              {VARIATION_2_CARDS.map((card, index) => {
                const isLastCard = index === totalCards - 1;
                const globalCardPosition = progress * (totalCards - 1) - index;

                let rotateX = 0, translateZ = 0, translateY = 0, opacity = 1, scale = 1;

                if (isLastCard) {
                  if (globalCardPosition >= 0) {
                    rotateX = 0;
                    opacity = 1;
                    scale = 1;
                    translateZ = 0;
                    translateY = 0;
                  } else {
                    const stackPosition = -globalCardPosition;
                    translateZ = -30 * stackPosition;
                    translateY = 20 * stackPosition;
                    opacity = Math.max(0.4, 1 - stackPosition * 0.15);
                    scale = Math.max(0.88, 1 - stackPosition * 0.04);
                  }
                } else if (globalCardPosition >= 1) {
                  rotateX = -90;
                  opacity = 0;
                  scale = 0.9;
                } else if (globalCardPosition >= 0) {
                  rotateX = -globalCardPosition * 90;
                  opacity = globalCardPosition > 0.7 ? 1 - ((globalCardPosition - 0.7) / 0.3) : 1;
                  scale = 1 - globalCardPosition * 0.1;
                } else {
                  const stackPosition = -globalCardPosition;
                  translateZ = -30 * stackPosition;
                  translateY = 20 * stackPosition;
                  opacity = Math.max(0.4, 1 - stackPosition * 0.15);
                  scale = Math.max(0.88, 1 - stackPosition * 0.04);
                }

                return (
                  <div
                    key={index}
                    className="absolute inset-0 rounded-2xl p-4 md:p-8 flex flex-col items-center justify-center text-center"
                    style={{
                      background: card.highlight ? mistyBackground : darkBackground,
                      border: card.highlight
                        ? '2px solid rgba(180,150,50,0.5)'
                        : `1px solid ${BRAND_YELLOW}44`,
                      boxShadow: card.highlight
                        ? `0 0 40px 8px rgba(255,200,80,0.4), 0 0 80px 16px rgba(255,180,50,0.25)`
                        : `0 0 40px ${BRAND_YELLOW}15, 0 30px 60px -30px rgba(0,0,0,0.8)`,
                      transform: `perspective(1200px) rotateX(${rotateX}deg) translate3d(0, ${translateY}px, ${translateZ}px) scale(${scale})`,
                      transformOrigin: 'center bottom',
                      opacity,
                      zIndex: totalCards - index,
                      backfaceVisibility: 'hidden',
                      willChange: 'transform, opacity',
                      transition: 'background 0.2s ease-out, border 0.2s ease-out, box-shadow 0.2s ease-out',
                    }}
                  >
                    {card.highlight ? (
                      <div
                        className="rounded-full flex items-center justify-center w-12 h-12 md:w-16 md:h-16 mb-3 md:mb-5"
                        style={{
                          backgroundColor: 'rgba(42,42,42,0.9)',
                          border: '3px solid rgba(42,42,42,0.7)',
                          boxShadow: '0 0 30px rgba(0,0,0,0.25), inset 0 0 20px rgba(0,0,0,0.15)',
                        }}
                      >
                        <Number3D num={card.num} highlight />
                      </div>
                    ) : (
                      <div
                        className="rounded-full flex items-center justify-center w-12 h-12 md:w-16 md:h-16 mb-3 md:mb-5"
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          border: '2px solid rgba(255,255,255,0.15)',
                        }}
                      >
                        <Number3D num={card.num} />
                      </div>
                    )}
                    <p
                      className="font-heading font-bold leading-relaxed px-2"
                      style={{
                        color: card.highlight ? '#2a2a2a' : '#e5e5e5',
                        fontSize: 'clamp(24px, calc(22.55px + 0.58vw), 40px)',
                      }}
                    >
                      {card.text}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* 3D Plasma Tube Progress Bar */}
            <div className="flex justify-center mt-16">
              <div
                className="w-80 h-3 rounded-full overflow-hidden relative"
                style={{
                  background: 'linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)',
                  border: '1px solid rgba(245, 245, 240, 0.25)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6), inset 0 -1px 2px rgba(255,255,255,0.05)',
                }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${progress * 100}%`,
                    background: `linear-gradient(180deg, #ffe566 0%, ${BRAND_YELLOW} 40%, #cc9900 100%)`,
                    boxShadow: `0 0 8px ${BRAND_YELLOW}, 0 0 16px ${BRAND_YELLOW}, 0 0 32px ${BRAND_YELLOW}66, inset 0 1px 2px rgba(255,255,255,0.4)`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// VARIATION 3: Clip-Path Reveal Animation
// TYPE: IntersectionObserver (natural scroll)
// Updated with mystic fog styling for revealed cards
// ============================================================

// Sample content for Variation 3
const VARIATION_3_CARDS = [
  { title: "Commission", subtitle: "The Foundation", description: "80/20 split until $16K cap, then 100%. ICON agents earn the cap back in stock." },
  { title: "Ownership", subtitle: "Build Equity", description: "Earn EXPI stock for production milestones. Own part of a publicly traded company." },
  { title: "Leverage", subtitle: "Scale Systems", description: "Access 90,000+ agents globally. Systems that scale with your ambition." },
  { title: "Longevity", subtitle: "Income That Lasts", description: "Seven-tier revenue share. Continues after retirement. Passed to heirs." },
];

function Variation3() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [revealProgress, setRevealProgress] = useState<number[]>([0, 0, 0, 0]);

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll('.reveal-card');
    if (!cards) return;

    const observers = Array.from(cards).map((card, index) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            setRevealProgress(prev => {
              const newProgress = [...prev];
              newProgress[index] = entry.intersectionRatio;
              return newProgress;
            });
          });
        },
        {
          threshold: Array.from({ length: 50 }, (_, i) => i / 50),
          rootMargin: '-5% 0px -5% 0px'
        }
      );
      observer.observe(card);
      return observer;
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  const darkBackground = 'linear-gradient(180deg, rgba(40,40,40,0.98), rgba(20,20,20,0.99))';

  return (
    <section ref={sectionRef} className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-widest text-gold-500 font-medium">
            Variation 3: Clip-Path Reveal
          </span>
        </div>

        <div className="text-center mb-12">
          <H2>Sample Heading</H2>
          <p className="text-body text-gray-400 mt-4">Sample subheading text that describes the section.</p>
        </div>

        <div className="space-y-12">
          {VARIATION_3_CARDS.map((card, index) => {
            const IconComponent = PILLAR_ICONS[index];
            const cardProgress = revealProgress[index];
            const isEven = index % 2 === 0;

            return (
              <div
                key={card.title}
                className={`reveal-card flex flex-col md:flex-row items-center gap-6 ${isEven ? '' : 'md:flex-row-reverse'}`}
              >
                {/* Icon circle */}
                <div
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full flex-shrink-0 relative overflow-hidden flex items-center justify-center"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '2px solid rgba(255,255,255,0.15)',
                    transform: `scale(${0.8 + cardProgress * 0.2})`,
                    opacity: 0.3 + cardProgress * 0.7,
                  }}
                >
                  <Icon3D color={ICON_GOLD} size={64}>
                    <IconComponent className="w-16 h-16" />
                  </Icon3D>
                </div>

                {/* Card content */}
                <div
                  className={`flex-1 p-6 rounded-2xl ${isEven ? '' : 'md:text-right'}`}
                  style={{
                    background: darkBackground,
                    border: `1px solid ${BRAND_YELLOW}44`,
                    boxShadow: `0 0 40px ${BRAND_YELLOW}15`,
                    opacity: 0.4 + cardProgress * 0.6,
                    transform: `translateX(${isEven ? (1 - cardProgress) * 30 : (cardProgress - 1) * 30}px)`,
                  }}
                >
                  <div
                    className={`inline-block px-3 py-1 rounded-full text-xs uppercase tracking-wider mb-3`}
                    style={{
                      background: `${BRAND_YELLOW}22`,
                      color: BRAND_YELLOW,
                    }}
                  >
                    {card.subtitle}
                  </div>
                  <h3 className="text-h5 font-bold mb-3 text-gray-100">
                    {card.title}
                  </h3>
                  <p className="text-body leading-relaxed text-gray-400">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// VARIATION 4: DELETED - Too slow to start, not mobile friendly
// ============================================================

// ============================================================
// VARIATION 6: Horizontal Scroll Cards
// TYPE: GSAP ScrollTrigger with magnetic snap
// Extracted from BuiltForFuture section - reusable effect
// ============================================================

// Sample content for Variation 6
const VARIATION_6_CARDS = [
  { image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-future-cloud/public', text: "Cloud-First Brokerage Model" },
  { image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-future-ai-bot/public', text: "AI-Powered Tools and Training" },
  { image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-future-mobile-first/public', text: "Mobile-First Workflows" },
  { image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-future-borderless/public', text: "Borderless Business" },
  { image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-future-income-benjamins/public', text: "Sustainable Income Beyond Sales" },
];

function Variation6() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Refs for magnetic effect
  const rawPositionRef = useRef(0);
  const displayPositionRef = useRef(0);
  const lastRawRef = useRef(0);
  const velocityRef = useRef(0);
  const rafRef = useRef<number>(0);
  const isMobileRef = useRef(false);

  const totalCards = VARIATION_6_CARDS.length;

  // Responsive card width
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const CARD_WIDTH = isMobile ? 280 : 560;
  const CARD_GAP = isMobile ? 16 : 24;

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if mobile
    const mobile = window.innerWidth < 768;
    isMobileRef.current = mobile;

    // Grace period: 10% at start and 10% at end of scroll range
    const GRACE = mobile ? 0 : 0.1;
    const CONTENT_RANGE = 1 - (GRACE * 2);

    // Velocity-based magnetic snap
    const animateMagnetic = () => {
      const raw = rawPositionRef.current;
      const lastRaw = lastRawRef.current;
      const currentDisplay = displayPositionRef.current;

      // Calculate velocity (change since last frame)
      const instantVelocity = Math.abs(raw - lastRaw);
      // Smooth velocity with decay
      velocityRef.current = velocityRef.current * 0.9 + instantVelocity * 0.1;
      lastRawRef.current = raw;

      // Find nearest card position
      const nearestCard = Math.round(raw);
      const clampedTarget = Math.max(0, Math.min(totalCards - 1, nearestCard));

      // When velocity is high, follow raw position
      // When velocity is low, snap to nearest card
      const velocityFactor = Math.min(1, velocityRef.current * 50);

      // Blend between snap target (when stopped) and raw position (when scrolling)
      const targetPosition = clampedTarget * (1 - velocityFactor) + raw * velocityFactor;

      // Smooth interpolation toward target
      const newPosition = currentDisplay + (targetPosition - currentDisplay) * 0.15;

      if (Math.abs(newPosition - currentDisplay) > 0.001) {
        displayPositionRef.current = newPosition;
        setScrollPosition(newPosition);
      }

      rafRef.current = requestAnimationFrame(animateMagnetic);
    };

    rafRef.current = requestAnimationFrame(animateMagnetic);

    // Pin trigger: 80% on mobile, 55% on desktop
    const pinStart = mobile ? 'center 80%' : 'center 55%';

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: pinStart,
        end: '+=300%',
        pin: triggerRef.current,
        pinSpacing: true,
        scrub: 0.5,
        onUpdate: (self: ScrollTrigger) => {
          const mobileMultiplier = isMobileRef.current ? 2 : 1;
          let cardPosition = 0;

          if (self.progress <= GRACE) {
            cardPosition = 0;
          } else if (self.progress >= 1 - GRACE) {
            cardPosition = totalCards - 1;
          } else {
            const contentProgress = (self.progress - GRACE) / CONTENT_RANGE;
            cardPosition = Math.min(contentProgress * mobileMultiplier, 1) * (totalCards - 1);
          }

          rawPositionRef.current = cardPosition;
        },
      });
    }, sectionRef);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ctx.revert();
    };
  }, [totalCards]);

  // Progress for the progress bar
  const progress = scrollPosition / (totalCards - 1);

  // Mistic fog gradient for active card
  const activeBackground = `
    radial-gradient(ellipse 120% 80% at 30% 20%, rgba(255,255,255,0.8) 0%, transparent 50%),
    radial-gradient(ellipse 100% 60% at 70% 80%, rgba(255,200,100,0.6) 0%, transparent 40%),
    radial-gradient(ellipse 80% 100% at 50% 50%, rgba(255,215,0,0.7) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 20% 70%, rgba(255,180,50,0.5) 0%, transparent 50%),
    radial-gradient(ellipse 90% 70% at 80% 30%, rgba(255,240,200,0.4) 0%, transparent 45%),
    linear-gradient(180deg, rgba(255,225,150,0.9) 0%, rgba(255,200,80,0.85) 50%, rgba(255,180,50,0.9) 100%)
  `;
  const inactiveBackground = `linear-gradient(180deg, rgba(30,30,30,0.95), rgba(15,15,15,0.98))`;

  return (
    <section ref={sectionRef} className="relative pt-16 md:pt-24">
      {/* Invisible wrapper that gets pinned */}
      <div
        ref={triggerRef}
        className="relative"
        style={{
          zIndex: 1,
          willChange: 'transform',
          contain: 'layout style paint',
        }}
      >
        {/* Content */}
        <div ref={contentRef} className="relative">
          {/* Section Label */}
          <div className="text-center mb-4 px-6">
            <span className="text-xs uppercase tracking-widest text-gold-500 font-medium">
              Variation 6: Horizontal Scroll Cards
            </span>
          </div>

          <div className="text-center mb-4 px-6">
            <H2 style={{ maxWidth: '100%' }}>Sample Heading</H2>
          </div>
          <p className="text-body opacity-70 mb-12 text-center max-w-2xl mx-auto px-6">
            Sample subheading text that describes the section content.
          </p>

          {/* Horizontal Scroll Cards Container with Portal Edges */}
          <div className="relative">
            {/* Left curved bar */}
            <div
              className="absolute left-0 z-20 pointer-events-none"
              style={{
                top: '-40px',
                bottom: '-40px',
                width: '12px',
                borderRadius: '0 12px 12px 0',
                background: 'linear-gradient(90deg, rgba(30,28,20,0.95) 0%, rgba(40,35,25,0.9) 100%)',
                borderRight: '1px solid rgba(255,190,0,0.3)',
                boxShadow: '3px 0 12px rgba(0,0,0,0.6), 6px 0 24px rgba(0,0,0,0.3)',
                transform: 'perspective(500px) rotateY(-3deg)',
                transformOrigin: 'right center',
              }}
            />
            {/* Right curved bar */}
            <div
              className="absolute right-0 z-20 pointer-events-none"
              style={{
                top: '-40px',
                bottom: '-40px',
                width: '12px',
                borderRadius: '12px 0 0 12px',
                background: 'linear-gradient(270deg, rgba(30,28,20,0.95) 0%, rgba(40,35,25,0.9) 100%)',
                borderLeft: '1px solid rgba(255,190,0,0.3)',
                boxShadow: '-3px 0 12px rgba(0,0,0,0.6), -6px 0 24px rgba(0,0,0,0.3)',
                transform: 'perspective(500px) rotateY(3deg)',
                transformOrigin: 'left center',
              }}
            />

            {/* Inner container - clips cards horizontally at inner edge of bars */}
            <div
              className="relative"
              style={{
                marginLeft: '12px',
                marginRight: '12px',
                overflowX: 'clip',
                overflowY: 'visible',
              }}
            >
              {/* Cards track */}
              <div className="py-12">
                <div
                  className="flex"
                  style={{
                    gap: `${CARD_GAP}px`,
                    transform: `translateX(calc(50vw - ${CARD_WIDTH / 2}px - 12px - ${(scrollPosition + 2) * (CARD_WIDTH + CARD_GAP)}px))`,
                  }}
                >
                  {/* Create looped array: last 2 cards + all cards + first 2 cards */}
                  {(() => {
                    const loopedCards = [
                      ...VARIATION_6_CARDS.slice(-2),
                      ...VARIATION_6_CARDS,
                      ...VARIATION_6_CARDS.slice(0, 2)
                    ];

                    return loopedCards.map((point, loopIndex) => {
                      const actualIndex = loopIndex - 2;
                      const distance = Math.abs(scrollPosition - actualIndex);
                      const isActive = distance < 0.5;

                      // Scale based on distance from center
                      const scale = Math.max(0.85, 1 - distance * 0.1);

                      // Blur for non-active cards
                      const blurAmount = Math.min(5, distance * 10);

                      // Smart blackout for looped cards
                      let blackoutOpacity = 0;
                      if (actualIndex < 0) {
                        blackoutOpacity = Math.max(0, 1 - scrollPosition);
                      } else if (actualIndex > totalCards - 1) {
                        blackoutOpacity = Math.max(0, (scrollPosition - (totalCards - 2)) / 1);
                      }

                      return (
                        <div
                          key={`${point.text}-${loopIndex}`}
                          className="flex-shrink-0"
                          style={{
                            width: `${CARD_WIDTH}px`,
                            transform: `scale3d(${scale}, ${scale}, 1) translate3d(0, 0, 0)`,
                            filter: `blur(${blurAmount + blackoutOpacity * 4}px) grayscale(${blackoutOpacity * 100}%) brightness(${1 - blackoutOpacity * 0.6})`,
                            opacity: 1 - blackoutOpacity * 0.4,
                            willChange: 'transform, filter, opacity',
                            transition: 'transform 0.05s ease-out, filter 0.075s ease-out, opacity 0.075s ease-out',
                          }}
                        >
                          <div
                            className={`rounded-2xl flex flex-col items-center justify-center relative overflow-hidden ${isMobile ? 'p-4 min-h-[280px]' : 'p-8 min-h-[380px]'}`}
                            style={{
                              background: isActive ? activeBackground : inactiveBackground,
                              border: isActive ? '2px solid rgba(180,150,50,0.5)' : `2px solid ${BRAND_YELLOW}22`,
                              boxShadow: isActive
                                ? `0 0 40px 8px rgba(255,200,80,0.4), 0 0 80px 16px rgba(255,180,50,0.25)`
                                : 'none',
                              transition: 'background 0.2s ease-out, border 0.2s ease-out, box-shadow 0.2s ease-out',
                            }}
                          >
                            {/* Circled Image */}
                            <div
                              className={`rounded-full flex items-center justify-center overflow-hidden relative z-10 ${isMobile ? 'w-[120px] h-[120px] mb-4' : 'w-[200px] h-[200px] mb-6'}`}
                              style={{
                                backgroundColor: isActive ? 'rgba(20,18,12,0.85)' : 'rgba(17,17,17,0.5)',
                                border: isActive ? '3px solid rgba(40,35,20,0.8)' : `3px solid ${BRAND_YELLOW}`,
                                boxShadow: isActive
                                  ? `0 0 30px rgba(0,0,0,0.3), inset 0 0 20px rgba(0,0,0,0.2)`
                                  : 'none',
                                transition: 'background-color 0.2s ease-out, border 0.2s ease-out, box-shadow 0.2s ease-out',
                              }}
                            >
                              <img
                                src={point.image}
                                alt={point.text}
                                className="w-full h-full object-contain"
                              />
                            </div>

                            {/* Text */}
                            <h3
                              className="text-h5 font-bold text-center relative z-10"
                              style={{
                                color: isActive ? '#2a2a2a' : '#e5e4dd',
                                transition: 'color 0.2s ease-out',
                              }}
                            >
                              {point.text}
                            </h3>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* 3D Plasma Tube Progress Bar */}
          <div className="flex justify-center mt-8 px-6">
            <div
              className="w-80 h-3 rounded-full overflow-hidden relative"
              style={{
                background: 'linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)',
                border: '1px solid rgba(245, 245, 240, 0.25)',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6), inset 0 -1px 2px rgba(255,255,255,0.05)',
              }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progress * 100}%`,
                  background: `linear-gradient(180deg, #ffe566 0%, ${BRAND_YELLOW} 40%, #cc9900 100%)`,
                  boxShadow: `0 0 8px ${BRAND_YELLOW}, 0 0 16px ${BRAND_YELLOW}, 0 0 32px ${BRAND_YELLOW}66, inset 0 1px 2px rgba(255,255,255,0.4)`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// VARIATION 7: Text Blur Reveal
// TYPE: IntersectionObserver (natural scroll)
// Updated with mystic fog styling for revealed cards
// ============================================================

// Sample content for Variation 7
const VARIATION_7_CARDS = [
  { title: "Commission", subtitle: "The Foundation", description: "80/20 split until $16K cap, then 100%. ICON agents earn the cap back in stock." },
  { title: "Ownership", subtitle: "Build Equity", description: "Earn EXPI stock for production milestones. Own part of a publicly traded company." },
  { title: "Leverage", subtitle: "Scale Systems", description: "Access 90,000+ agents globally. Systems that scale with your ambition." },
  { title: "Longevity", subtitle: "Income That Lasts", description: "Seven-tier revenue share. Continues after retirement. Passed to heirs." },
];

function Variation7() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [elementProgress, setElementProgress] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const elements = sectionRef.current?.querySelectorAll('.blur-reveal');
    if (!elements) return;

    const observers = Array.from(elements).map((el) => {
      const id = el.getAttribute('data-id') || '';
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            setElementProgress(prev => ({ ...prev, [id]: entry.intersectionRatio }));
          });
        },
        {
          threshold: Array.from({ length: 50 }, (_, i) => i / 50),
          rootMargin: '-20% 0px -10% 0px',
        }
      );
      observer.observe(el);
      return observer;
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  const getBlur = (id: string) => {
    const p = elementProgress[id] || 0;
    return Math.max(0, 15 * (1 - p));
  };

  const getOpacity = (id: string) => {
    const p = elementProgress[id] || 0;
    return Math.min(1, p);
  };

  const getTranslateY = (id: string) => {
    const p = elementProgress[id] || 0;
    return 40 * (1 - p);
  };

  const darkBackground = 'linear-gradient(180deg, rgba(40,40,40,0.98), rgba(20,20,20,0.99))';

  return (
    <section ref={sectionRef} className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-widest text-gold-500 font-medium">
            Variation 7: Text Blur Reveal
          </span>
        </div>

        <div className="text-center mb-12">
          <H2>Sample Heading</H2>
          <p className="text-body text-gray-400 mt-4 max-w-xl mx-auto">Sample subheading text that describes the section.</p>
        </div>

        <div className="space-y-12">
          {VARIATION_7_CARDS.map((card, index) => {
            const IconComponent = PILLAR_ICONS[index];
            const id = `card7-${index}`;

            return (
              <div
                key={card.title}
                className="blur-reveal max-w-2xl mx-auto"
                data-id={id}
                style={{
                  filter: `blur(${getBlur(id)}px)`,
                  opacity: getOpacity(id),
                  transform: `translateY(${getTranslateY(id)}px)`,
                }}
              >
                <div
                  className="p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-center gap-6"
                  style={{
                    background: darkBackground,
                    border: `1px solid ${BRAND_YELLOW}44`,
                    boxShadow: `0 0 40px ${BRAND_YELLOW}15`,
                  }}
                >
                  {/* Icon circle */}
                  <div
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full flex-shrink-0 flex items-center justify-center"
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: '2px solid rgba(255,255,255,0.15)',
                    }}
                  >
                    <Icon3D color={ICON_GOLD} size={48}>
                      <IconComponent className="w-12 h-12" />
                    </Icon3D>
                  </div>

                  <div className="text-center md:text-left">
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: BRAND_YELLOW }}>
                      {card.subtitle}
                    </p>
                    <h3 className="text-h5 font-bold mb-2 text-gray-100">
                      {card.title}
                    </h3>
                    <p className="text-body text-gray-400">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// VARIATION 8: Grid Card Animation
// TYPE: GSAP ScrollTrigger with magnetic snap
// Updated with mystic fog styling for active cards
// ============================================================

// Sample content for Variation 8
const VARIATION_8_CARDS = [
  { title: "Commission", subtitle: "The Foundation" },
  { title: "Ownership", subtitle: "Build Equity" },
  { title: "Leverage", subtitle: "Scale Systems" },
  { title: "Longevity", subtitle: "Income That Lasts" },
];

function Variation8() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const cardGridRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  // Refs for magnetic effect
  const rawProgressRef = useRef(0);
  const displayProgressRef = useRef(0);
  const lastRawRef = useRef(0);
  const velocityRef = useRef(0);
  const rafRef = useRef<number>(0);
  const isMobileRef = useRef(false);

  const totalCards = VARIATION_8_CARDS.length;

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    isMobileRef.current = window.innerWidth < 768;

    const GRACE = isMobileRef.current ? 0 : 0.1;
    const CONTENT_RANGE = 1 - (GRACE * 2);

    // Velocity-based magnetic snap
    const animateMagnetic = () => {
      const raw = rawProgressRef.current;
      const lastRaw = lastRawRef.current;
      const currentDisplay = displayProgressRef.current;

      const instantVelocity = Math.abs(raw - lastRaw);
      velocityRef.current = velocityRef.current * 0.9 + instantVelocity * 0.1;
      lastRawRef.current = raw;

      const cardStep = 1 / (totalCards - 1);
      const nearestCardIndex = Math.round(raw / cardStep);
      const nearestCardProgress = Math.max(0, Math.min(1, nearestCardIndex * cardStep));

      const velocityFactor = Math.min(1, velocityRef.current * 100);
      const targetProgress = nearestCardProgress * (1 - velocityFactor) + raw * velocityFactor;
      const newProgress = currentDisplay + (targetProgress - currentDisplay) * 0.15;

      if (Math.abs(newProgress - currentDisplay) > 0.0001) {
        displayProgressRef.current = newProgress;
        setProgress(newProgress);
      }

      rafRef.current = requestAnimationFrame(animateMagnetic);
    };

    rafRef.current = requestAnimationFrame(animateMagnetic);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: cardGridRef.current,
        start: 'center 55%',
        end: '+=200%',
        pin: triggerRef.current,
        pinSpacing: true,
        scrub: 0.5,
        onUpdate: (self: ScrollTrigger) => {
          const mobileMultiplier = isMobileRef.current ? 2 : 1;
          let cardProgress = 0;

          if (self.progress <= GRACE) {
            cardProgress = 0;
          } else if (self.progress >= 1 - GRACE) {
            cardProgress = 1;
          } else {
            cardProgress = Math.min((self.progress - GRACE) / CONTENT_RANGE * mobileMultiplier, 1);
          }

          rawProgressRef.current = cardProgress;
        },
      });
    }, sectionRef);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ctx.revert();
    };
  }, [totalCards]);

  // Misty gold background for active card
  const mistyBackground = `
    radial-gradient(ellipse 120% 80% at 30% 20%, rgba(255,255,255,0.8) 0%, transparent 50%),
    radial-gradient(ellipse 100% 60% at 70% 80%, rgba(255,200,100,0.6) 0%, transparent 40%),
    radial-gradient(ellipse 80% 100% at 50% 50%, rgba(255,215,0,0.7) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 20% 70%, rgba(255,180,50,0.5) 0%, transparent 50%),
    radial-gradient(ellipse 90% 70% at 80% 30%, rgba(255,240,200,0.4) 0%, transparent 45%),
    linear-gradient(180deg, rgba(255,225,150,0.9) 0%, rgba(255,200,80,0.85) 50%, rgba(255,180,50,0.9) 100%)
  `;
  const darkBackground = 'linear-gradient(180deg, rgba(40,40,40,0.98), rgba(20,20,20,0.99))';

  return (
    <section ref={sectionRef}>
      <div
        ref={triggerRef}
        style={{
          willChange: 'transform',
          contain: 'layout style paint',
        }}
      >
        <div className="px-6 py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6">
              <span className="text-xs uppercase tracking-widest text-gold-500 font-medium">
                Variation 8: Grid Card Animation
              </span>
            </div>

            <div className="mb-8">
              <H2>Sample Heading</H2>
              <p className="text-body text-gray-400 mt-4 max-w-xl mx-auto">
                Sample subheading text that describes the section.
              </p>
            </div>

            <div ref={cardGridRef} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {VARIATION_8_CARDS.map((card, index) => {
                const IconComponent = PILLAR_ICONS[index];
                const activeIndex = Math.round(progress * (totalCards - 1));
                const isActive = index === activeIndex;
                const distance = Math.abs(progress * (totalCards - 1) - index);
                const cardOpacity = Math.max(0.4, 1 - distance * 0.3);
                const cardScale = Math.max(0.9, 1 - distance * 0.05);

                return (
                  <div
                    key={card.title}
                    className="p-5 rounded-2xl text-center"
                    style={{
                      background: isActive ? mistyBackground : darkBackground,
                      border: isActive
                        ? '2px solid rgba(180,150,50,0.5)'
                        : `1px solid ${BRAND_YELLOW}44`,
                      boxShadow: isActive
                        ? '0 0 40px 8px rgba(255,200,80,0.3), 0 0 80px 16px rgba(255,180,50,0.15)'
                        : `0 0 40px ${BRAND_YELLOW}15`,
                      transform: `scale(${cardScale})`,
                      opacity: cardOpacity,
                      transition: 'background 0.2s, border 0.2s, box-shadow 0.2s',
                    }}
                  >
                    <div
                      className="mx-auto mb-3 w-16 h-16 rounded-full flex items-center justify-center"
                      style={{
                        background: isActive ? 'rgba(42,42,42,0.9)' : 'rgba(255,255,255,0.08)',
                        border: isActive ? '3px solid rgba(42,42,42,0.7)' : '2px solid rgba(255,255,255,0.15)',
                        boxShadow: isActive ? '0 0 20px rgba(0,0,0,0.2), inset 0 0 15px rgba(0,0,0,0.1)' : 'none',
                      }}
                    >
                      <Icon3D color={ICON_GOLD} size={40}>
                        <IconComponent className="w-10 h-10" />
                      </Icon3D>
                    </div>
                    <h3
                      className="text-h6 font-bold mb-1"
                      style={{ color: isActive ? '#2a2a2a' : '#e5e5e5' }}
                    >
                      {card.title}
                    </h3>
                    <p
                      className="text-xs"
                      style={{ color: isActive ? '#5a5a5a' : BRAND_YELLOW }}
                    >
                      {card.subtitle}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* 3D Plasma Tube Progress Bar */}
            <div className="mt-12 flex justify-center">
              <div
                className="w-80 h-3 rounded-full overflow-hidden relative"
                style={{
                  background: 'linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)',
                  border: '1px solid rgba(245, 245, 240, 0.25)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6), inset 0 -1px 2px rgba(255,255,255,0.05)',
                }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${progress * 100}%`,
                    background: `linear-gradient(180deg, #ffe566 0%, ${BRAND_YELLOW} 40%, #cc9900 100%)`,
                    boxShadow: `0 0 8px ${BRAND_YELLOW}, 0 0 16px ${BRAND_YELLOW}, 0 0 32px ${BRAND_YELLOW}66, inset 0 1px 2px rgba(255,255,255,0.4)`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// VARIATION 9: Counter Animation with Stats
// TYPE: GSAP ScrollTrigger with magnetic snap
// Updated with mystic fog styling for active stats
// ============================================================

// Sample stats for Variation 9
const VARIATION_9_STATS = [
  { number: 90000, suffix: '+', label: 'Agents Worldwide' },
  { number: 24, suffix: '', label: 'Countries' },
  { number: 80, suffix: '/20', label: 'Commission Split' },
  { number: 7, suffix: ' Tiers', label: 'Revenue Share' },
];

function Variation9() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const statsGridRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  // Refs for magnetic effect
  const rawProgressRef = useRef(0);
  const displayProgressRef = useRef(0);
  const lastRawRef = useRef(0);
  const velocityRef = useRef(0);
  const rafRef = useRef<number>(0);
  const isMobileRef = useRef(false);

  const totalStats = VARIATION_9_STATS.length;

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    isMobileRef.current = window.innerWidth < 768;

    const GRACE = isMobileRef.current ? 0 : 0.1;
    const CONTENT_RANGE = 1 - (GRACE * 2);

    // Velocity-based magnetic snap
    const animateMagnetic = () => {
      const raw = rawProgressRef.current;
      const lastRaw = lastRawRef.current;
      const currentDisplay = displayProgressRef.current;

      const instantVelocity = Math.abs(raw - lastRaw);
      velocityRef.current = velocityRef.current * 0.9 + instantVelocity * 0.1;
      lastRawRef.current = raw;

      const statStep = 1 / (totalStats - 1);
      const nearestStatIndex = Math.round(raw / statStep);
      const nearestStatProgress = Math.max(0, Math.min(1, nearestStatIndex * statStep));

      const velocityFactor = Math.min(1, velocityRef.current * 100);
      const targetProgress = nearestStatProgress * (1 - velocityFactor) + raw * velocityFactor;
      const newProgress = currentDisplay + (targetProgress - currentDisplay) * 0.15;

      if (Math.abs(newProgress - currentDisplay) > 0.0001) {
        displayProgressRef.current = newProgress;
        setProgress(newProgress);
      }

      rafRef.current = requestAnimationFrame(animateMagnetic);
    };

    rafRef.current = requestAnimationFrame(animateMagnetic);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: statsGridRef.current,
        start: 'center 55%',
        end: '+=200%',
        pin: triggerRef.current,
        pinSpacing: true,
        scrub: 0.5,
        onUpdate: (self: ScrollTrigger) => {
          const mobileMultiplier = isMobileRef.current ? 2 : 1;
          let statProgress = 0;

          if (self.progress <= GRACE) {
            statProgress = 0;
          } else if (self.progress >= 1 - GRACE) {
            statProgress = 1;
          } else {
            statProgress = Math.min((self.progress - GRACE) / CONTENT_RANGE * mobileMultiplier, 1);
          }

          rawProgressRef.current = statProgress;
        },
      });
    }, sectionRef);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ctx.revert();
    };
  }, [totalStats]);

  // Misty gold background for active stat
  const mistyBackground = `
    radial-gradient(ellipse 120% 80% at 30% 20%, rgba(255,255,255,0.8) 0%, transparent 50%),
    radial-gradient(ellipse 100% 60% at 70% 80%, rgba(255,200,100,0.6) 0%, transparent 40%),
    radial-gradient(ellipse 80% 100% at 50% 50%, rgba(255,215,0,0.7) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 20% 70%, rgba(255,180,50,0.5) 0%, transparent 50%),
    radial-gradient(ellipse 90% 70% at 80% 30%, rgba(255,240,200,0.4) 0%, transparent 45%),
    linear-gradient(180deg, rgba(255,225,150,0.9) 0%, rgba(255,200,80,0.85) 50%, rgba(255,180,50,0.9) 100%)
  `;
  const darkBackground = 'linear-gradient(180deg, rgba(40,40,40,0.98), rgba(20,20,20,0.99))';

  return (
    <section ref={sectionRef}>
      <div
        ref={triggerRef}
        style={{
          willChange: 'transform',
          contain: 'layout style paint',
        }}
      >
        <div className="px-6 py-16 md:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-4">
              <span className="text-xs uppercase tracking-widest text-gold-500 font-medium">
                Variation 9: Counter Animation
              </span>
            </div>

            <div className="text-center mb-10">
              <H2>Sample Heading</H2>
              <p className="text-body text-gray-400 mt-3">Sample subheading text that describes the section.</p>
            </div>

            <div ref={statsGridRef} className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {VARIATION_9_STATS.map((stat, index) => {
                const activeIndex = Math.round(progress * (totalStats - 1));
                const isActive = index === activeIndex;
                const distance = Math.abs(progress * (totalStats - 1) - index);
                const statOpacity = Math.max(0.4, 1 - distance * 0.3);
                const statScale = Math.max(0.9, 1 - distance * 0.05);

                // Animate the counter based on overall progress
                const countProgress = Math.min(1, progress * 2);
                const currentNumber = Math.floor(stat.number * countProgress);

                return (
                  <div
                    key={stat.label}
                    className="text-center p-5 rounded-2xl"
                    style={{
                      background: isActive ? mistyBackground : darkBackground,
                      border: isActive
                        ? '2px solid rgba(180,150,50,0.5)'
                        : `1px solid ${BRAND_YELLOW}44`,
                      boxShadow: isActive
                        ? '0 0 40px 8px rgba(255,200,80,0.3), 0 0 80px 16px rgba(255,180,50,0.15)'
                        : `0 0 40px ${BRAND_YELLOW}15`,
                      transform: `scale(${statScale})`,
                      opacity: statOpacity,
                      transition: 'background 0.2s, border 0.2s, box-shadow 0.2s',
                    }}
                  >
                    <div
                      className="text-4xl md:text-5xl font-bold mb-2 tabular-nums"
                      style={{ color: isActive ? '#2a2a2a' : BRAND_YELLOW }}
                    >
                      {currentNumber.toLocaleString()}{stat.suffix}
                    </div>
                    <div
                      className="text-sm"
                      style={{ color: isActive ? '#4a4a4a' : '#9ca3af' }}
                    >
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 3D Plasma Tube Progress Bar */}
            <div className="mt-12 flex justify-center">
              <div
                className="w-80 h-3 rounded-full overflow-hidden relative"
                style={{
                  background: 'linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)',
                  border: '1px solid rgba(245, 245, 240, 0.25)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6), inset 0 -1px 2px rgba(255,255,255,0.05)',
                }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${progress * 100}%`,
                    background: `linear-gradient(180deg, #ffe566 0%, ${BRAND_YELLOW} 40%, #cc9900 100%)`,
                    boxShadow: `0 0 8px ${BRAND_YELLOW}, 0 0 16px ${BRAND_YELLOW}, 0 0 32px ${BRAND_YELLOW}66, inset 0 1px 2px rgba(255,255,255,0.4)`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// VARIATION 10: Diagonal Wipe Reveal
// TYPE: GSAP ScrollTrigger with magnetic snap
// Updated with mystic fog styling for revealed cards
// ============================================================

// Sample content for Variation 10
const VARIATION_10_CARDS = [
  { title: "Commission", subtitle: "The Foundation", description: "80/20 split until $16K cap, then 100%. ICON agents earn the cap back in stock." },
  { title: "Ownership", subtitle: "Build Equity", description: "Earn EXPI stock for production milestones. Own part of a publicly traded company." },
  { title: "Leverage", subtitle: "Scale Systems", description: "Access 90,000+ agents globally. Systems that scale with your ambition." },
  { title: "Longevity", subtitle: "Income That Lasts", description: "Seven-tier revenue share. Continues after retirement. Passed to heirs." },
];

function Variation10() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const cardGridRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  // Refs for magnetic effect
  const rawProgressRef = useRef(0);
  const displayProgressRef = useRef(0);
  const lastRawRef = useRef(0);
  const velocityRef = useRef(0);
  const rafRef = useRef<number>(0);
  const isMobileRef = useRef(false);

  const totalCards = VARIATION_10_CARDS.length;

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    isMobileRef.current = window.innerWidth < 768;

    const GRACE = isMobileRef.current ? 0 : 0.1;
    const CONTENT_RANGE = 1 - (GRACE * 2);

    // Velocity-based magnetic snap
    const animateMagnetic = () => {
      const raw = rawProgressRef.current;
      const lastRaw = lastRawRef.current;
      const currentDisplay = displayProgressRef.current;

      const instantVelocity = Math.abs(raw - lastRaw);
      velocityRef.current = velocityRef.current * 0.9 + instantVelocity * 0.1;
      lastRawRef.current = raw;

      const cardStep = 1 / (totalCards - 1);
      const nearestCardIndex = Math.round(raw / cardStep);
      const nearestCardProgress = Math.max(0, Math.min(1, nearestCardIndex * cardStep));

      const velocityFactor = Math.min(1, velocityRef.current * 100);
      const targetProgress = nearestCardProgress * (1 - velocityFactor) + raw * velocityFactor;
      const newProgress = currentDisplay + (targetProgress - currentDisplay) * 0.15;

      if (Math.abs(newProgress - currentDisplay) > 0.0001) {
        displayProgressRef.current = newProgress;
        setProgress(newProgress);
      }

      rafRef.current = requestAnimationFrame(animateMagnetic);
    };

    rafRef.current = requestAnimationFrame(animateMagnetic);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: cardGridRef.current,
        start: 'center 55%',
        end: '+=200%',
        pin: triggerRef.current,
        pinSpacing: true,
        scrub: 0.5,
        onUpdate: (self: ScrollTrigger) => {
          const mobileMultiplier = isMobileRef.current ? 2 : 1;
          let cardProgress = 0;

          if (self.progress <= GRACE) {
            cardProgress = 0;
          } else if (self.progress >= 1 - GRACE) {
            cardProgress = 1;
          } else {
            cardProgress = Math.min((self.progress - GRACE) / CONTENT_RANGE * mobileMultiplier, 1);
          }

          rawProgressRef.current = cardProgress;
        },
      });
    }, sectionRef);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ctx.revert();
    };
  }, [totalCards]);

  // Misty gold background for active card
  const mistyBackground = `
    radial-gradient(ellipse 120% 80% at 30% 20%, rgba(255,255,255,0.8) 0%, transparent 50%),
    radial-gradient(ellipse 100% 60% at 70% 80%, rgba(255,200,100,0.6) 0%, transparent 40%),
    radial-gradient(ellipse 80% 100% at 50% 50%, rgba(255,215,0,0.7) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 20% 70%, rgba(255,180,50,0.5) 0%, transparent 50%),
    radial-gradient(ellipse 90% 70% at 80% 30%, rgba(255,240,200,0.4) 0%, transparent 45%),
    linear-gradient(180deg, rgba(255,225,150,0.9) 0%, rgba(255,200,80,0.85) 50%, rgba(255,180,50,0.9) 100%)
  `;
  const darkBackground = 'linear-gradient(180deg, rgba(40,40,40,0.98), rgba(20,20,20,0.99))';

  return (
    <section ref={sectionRef}>
      <div
        ref={triggerRef}
        style={{
          willChange: 'transform',
          contain: 'layout style paint',
        }}
      >
        <div className="px-6 py-16 md:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-4">
              <span className="text-xs uppercase tracking-widest text-gold-500 font-medium">
                Variation 10: Diagonal Wipe
              </span>
            </div>

            <div className="text-center mb-10">
              <H2>Sample Heading</H2>
              <p className="text-body text-gray-400 mt-3">Sample subheading text that describes the section.</p>
            </div>

            <div ref={cardGridRef} className="grid grid-cols-1 md:grid-cols-2 gap-5" style={{ gridAutoRows: '1fr' }}>
              {VARIATION_10_CARDS.map((card, index) => {
                const IconComponent = PILLAR_ICONS[index];
                const activeIndex = Math.round(progress * (totalCards - 1));
                const isActive = index === activeIndex;
                const distance = Math.abs(progress * (totalCards - 1) - index);
                const cardOpacity = Math.max(0.4, 1 - distance * 0.3);
                const cardScale = Math.max(0.95, 1 - distance * 0.03);

                // Diagonal wipe effect based on card reveal progress
                const revealProgress = Math.max(0, Math.min(1, (progress * (totalCards - 1) - index + 1)));
                const wipePercent = revealProgress * 220;

                return (
                  <div
                    key={card.title}
                    className="relative overflow-hidden rounded-2xl"
                    style={{
                      transform: `scale(${cardScale})`,
                      opacity: cardOpacity,
                    }}
                  >
                    {/* Content layer */}
                    <div
                      className="p-6 md:p-7 relative z-10"
                      style={{
                        background: isActive ? mistyBackground : darkBackground,
                        transition: 'background 0.3s',
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{
                            background: isActive ? 'rgba(42,42,42,0.9)' : 'rgba(255,255,255,0.08)',
                            border: isActive ? '3px solid rgba(42,42,42,0.7)' : '2px solid rgba(255,255,255,0.15)',
                            boxShadow: isActive ? '0 0 20px rgba(0,0,0,0.2), inset 0 0 15px rgba(0,0,0,0.1)' : 'none',
                            transition: 'background 0.3s, border 0.3s, box-shadow 0.3s',
                          }}
                        >
                          <Icon3D color={ICON_GOLD} size={36}>
                            <IconComponent className="w-9 h-9" />
                          </Icon3D>
                        </div>
                        <div>
                          <p
                            className="text-xs uppercase tracking-wider mb-1"
                            style={{ color: isActive ? '#5a5a5a' : BRAND_YELLOW }}
                          >
                            {card.subtitle}
                          </p>
                          <h3
                            className="text-h6 font-bold mb-2"
                            style={{ color: isActive ? '#2a2a2a' : '#e5e5e5' }}
                          >
                            {card.title}
                          </h3>
                          <p
                            className="text-body"
                            style={{ color: isActive ? '#3a3a3a' : '#9ca3af' }}
                          >
                            {card.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Wipe overlay for unrevealed cards */}
                    {!isActive && revealProgress < 1 && (
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: 'linear-gradient(135deg, rgba(30,30,30,0.96), rgba(20,20,20,0.98))',
                          clipPath: `polygon(${wipePercent}% 0, 100% 0, 100% 100%, ${wipePercent - 120}% 100%)`,
                        }}
                      />
                    )}

                    {/* Border */}
                    <div
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{
                        border: isActive
                          ? '2px solid rgba(180,150,50,0.5)'
                          : `1px solid ${BRAND_YELLOW}44`,
                        boxShadow: isActive
                          ? '0 0 40px 8px rgba(255,200,80,0.2), 0 0 80px 16px rgba(255,180,50,0.1)'
                          : 'none',
                        transition: 'border 0.3s, box-shadow 0.3s',
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* 3D Plasma Tube Progress Bar */}
            <div className="mt-12 flex justify-center">
              <div
                className="w-80 h-3 rounded-full overflow-hidden relative"
                style={{
                  background: 'linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)',
                  border: '1px solid rgba(245, 245, 240, 0.25)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6), inset 0 -1px 2px rgba(255,255,255,0.05)',
                }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${progress * 100}%`,
                    background: `linear-gradient(180deg, #ffe566 0%, ${BRAND_YELLOW} 40%, #cc9900 100%)`,
                    boxShadow: `0 0 8px ${BRAND_YELLOW}, 0 0 16px ${BRAND_YELLOW}, 0 0 32px ${BRAND_YELLOW}66, inset 0 1px 2px rgba(255,255,255,0.4)`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================
export default function TestExpModelPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Page Header */}
      <div className="py-16 px-4 text-center border-b border-white/10">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          SAA Scroll Animation Variations
        </h1>
        <p className="text-body text-gray-400 max-w-2xl mx-auto">
          Reusable scroll animation effects with magnetic snap centering, mystic fog highlights,
          and smooth GSAP ScrollTrigger integration.
        </p>
        <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg inline-block">
          <p className="text-emerald-400 text-sm">
            All variations feature magnetic snap, mystic fog active state, and 3D icon styling
          </p>
        </div>
      </div>

      <div className="border-b border-white/10"><Variation2 /></div>
      <div className="border-b border-white/10"><Variation3 /></div>
      <div className="border-b border-white/10"><Variation6 /></div>
      <div className="border-b border-white/10"><Variation7 /></div>
      <div className="border-b border-white/10"><Variation8 /></div>
      <div className="border-b border-white/10"><Variation9 /></div>
      <div className="border-b border-white/10"><Variation10 /></div>

      <div className="py-12 px-4 text-center">
        <p className="text-gray-500 text-sm">
          All variations now use velocity-based magnetic snap centering and mystic fog active card styling.
        </p>
      </div>
    </main>
  );
}
