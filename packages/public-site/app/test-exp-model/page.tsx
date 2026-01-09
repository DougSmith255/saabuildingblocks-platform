'use client';

/**
 * =============================================================================
 * DEBUGGING LOG - Scroll Animation Variations
 * =============================================================================
 *
 * ATTEMPT 1: CSS sticky + tall sections
 * RESULT: FAILED - sticky doesn't freeze scroll, user scrolls past animations
 *
 * ATTEMPT 2: CSS sticky + progress calculations
 * RESULT: FAILED - same issue, animations play but scroll speed unchanged
 *
 * ATTEMPT 3: GSAP ScrollTrigger with pin: true
 * RESULT: PARTIAL - pin works but start/stop is abrupt, no viewport movement
 *
 * ATTEMPT 4: GSAP with smooth ease + slight viewport movement (downward)
 * RESULT: PARTIAL - Movement going wrong direction (down instead of up),
 *         no ease in/out on scroll speed, Var 7 blur too fast, outro too late
 *
 * ATTEMPT 5: Fix direction (negative Y), add ease to GSAP
 * RESULT: PARTIAL - Direction correct now, variations 1 & 5 deleted per user request
 *
 * ATTEMPT 6: Fix Var 7 timing, fix Var 8 layout
 * RESULT: PARTIAL - Still issues:
 *   - Var 2,4,6,8,9,10: Scroll STOPS abruptly then slowly moves - needs to EASE INTO slow
 *   - Var 3: Missing proper H2 styling
 *   - Var 4: H2/subheading animate OUT while content appears - should stay visible
 *   - Var 7: Outro STILL triggers way too late
 *   - Var 8: Subheading animates separately from H2 (causes delay), progress bar needs lower
 *
 * ATTEMPT 7: Fix scroll easing + all above issues
 * RESULT: PARTIAL - Still issues:
 *   - All variations: H2 and subheadings should NOT animate (always visible)
 *   - Var 4: Cards take too long to start animating
 *   - Var 7: Outro broken (cards don't animate out at all), cards too far apart
 *   - Var 8: H2 not using proper sizing, subheading still animating
 *
 * ATTEMPT 8 (CURRENT): Remove ALL H2/subheading animations, fix remaining issues
 * CHANGES:
 *   - ALL VARIATIONS: Remove intro animations from H2 and subheadings (always visible)
 *   - Var 4: Start card animations earlier (lower cardStart values)
 *   - Var 7: Revert rootMargin to reasonable value, reduce card spacing (space-y-12)
 *   - Var 8: Use standard H2 component (remove AnimatedText), remove subheading animation
 *
 * KEY INSIGHT: The issue is that scrub only controls animation speed, not scroll speed.
 * To create the illusion of "easing into slow scroll", we need the Y movement to:
 *   - Start with MORE movement (feels like normal scroll)
 *   - Middle has LESS movement (feels like slow/stopped)
 *   - End with MORE movement (feels like resuming normal scroll)
 * This creates the perception of scroll speed change even though scroll is constant.
 *
 * =============================================================================
 * VARIATION STATUS (8 remaining - Var 1 & 5 deleted):
 * =============================================================================
 *
 * Variation 2 (3D Rotating Cards):
 *   - Type: GSAP pin + scrub
 *   - Status: NEEDS FIX - abrupt stop, needs ease into slow
 *
 * Variation 3 (Clip-Path Reveal):
 *   - Type: IntersectionObserver (natural scroll)
 *   - Status: NEEDS FIX - missing H2 component styling
 *
 * Variation 4 (Parallax Fly-In):
 *   - Type: GSAP pin + scrub
 *   - Status: NEEDS FIX - H2/subheading fade out, should stay visible
 *
 * Variation 6 (Horizontal Scroll):
 *   - Type: GSAP pin + scrub
 *   - Status: NEEDS FIX - abrupt stop, needs ease into slow
 *
 * Variation 7 (Blur Reveal):
 *   - Type: IntersectionObserver (natural scroll)
 *   - Status: NEEDS FIX - outro STILL way too late
 *
 * Variation 8 (Letter Animation):
 *   - Type: GSAP pin + scrub
 *   - Status: NEEDS FIX - subheading separate animation, progress bar position
 *
 * Variation 9 (Counter Animation):
 *   - Type: GSAP pin + scrub
 *   - Status: NEEDS FIX - abrupt stop, needs ease into slow
 *
 * Variation 10 (Diagonal Wipe):
 *   - Type: GSAP pin + scrub
 *   - Status: NEEDS FIX - abrupt stop, needs ease into slow
 *
 * =============================================================================
 */

import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { H2, Icon3D } from '@saa/shared/components/saa';
import { DollarSign, TrendingUp, Zap, RefreshCw } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WhyOnlyAtExp } from '../components/sections/WhyOnlyAtExp';

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
// VARIATION 2: 3D Rotating Card Stack
// TYPE: GSAP ScrollTrigger with pin + smooth continuous movement
// STATUS: ATTEMPT 9 - Smooth continuous progress, no jumps between cards
// ============================================================
function Variation2() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // Simple linear movement - very slow continuous scroll
      const tl = gsap.timeline();

      tl.to(contentRef.current, {
        y: -100,
        duration: 1,
        ease: 'none', // Linear movement throughout
      });

      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: 'top top',
        end: '+=400%', // Longer scroll distance for smoother feel
        pin: true,
        scrub: 1, // Higher scrub for smoother feel
        animation: tl,
        onUpdate: (self) => {
          setProgress(self.progress);
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const totalCards = PILLARS.length;
  // Progress bar fades out with last card
  const progressBarOpacity = progress < 0.9 ? 1 : Math.max(0, 1 - (progress - 0.9) / 0.1);

  return (
    <section ref={sectionRef}>
      <div ref={triggerRef} className="h-screen flex items-center justify-center overflow-hidden">
        <div ref={contentRef} className="max-w-5xl mx-auto px-4 w-full">
          {/* Section Label - no progress text */}
          <div className="text-center mb-4">
            <span className="text-xs uppercase tracking-widest text-gold-500 font-medium">
              Variation 2: 3D Rotating Stack
            </span>
          </div>

          <div className="text-center mb-8">
            <H2>The eXp Model</H2>
          </div>

          {/* 3D Card Stack - Smooth continuous animation */}
          <div className="relative min-h-[380px] mx-auto w-full max-w-lg" style={{ perspective: '1200px' }}>
            {PILLARS.map((pillar, index) => {
              const IconComponent = PILLAR_ICONS[index];

              // Continuous smooth progress for each card
              // Each card gets its portion of the 0-1 progress range
              const cardStartProgress = index / totalCards;
              const cardEndProgress = (index + 1) / totalCards;

              // How far through THIS card's animation are we (0-1)
              const cardProgress = Math.max(0, Math.min(1,
                (progress - cardStartProgress) / (cardEndProgress - cardStartProgress)
              ));

              // Smooth interpolation for all cards based on global progress
              const globalCardPosition = progress * totalCards - index;

              let rotateX = 0, translateZ = 0, translateY = 0, opacity = 1, scale = 1;

              if (globalCardPosition >= 1) {
                // Card is past - rotated away
                rotateX = -90;
                opacity = 0;
                scale = 0.9;
              } else if (globalCardPosition >= 0) {
                // Current card - smoothly rotating based on progress
                rotateX = -globalCardPosition * 90;
                opacity = globalCardPosition > 0.7 ? 1 - ((globalCardPosition - 0.7) / 0.3) : 1;
                scale = 1 - globalCardPosition * 0.1;
              } else {
                // Future card - stacked behind
                const stackPosition = -globalCardPosition;
                translateZ = -30 * stackPosition;
                translateY = 20 * stackPosition;
                opacity = Math.max(0.4, 1 - stackPosition * 0.15);
                scale = Math.max(0.88, 1 - stackPosition * 0.04);
              }

              return (
                <div
                  key={pillar.title}
                  className="absolute inset-0 rounded-2xl p-8"
                  style={{
                    background: `linear-gradient(180deg, rgba(40,40,40,0.98), rgba(20,20,20,0.99))`,
                    border: `1px solid ${BRAND_YELLOW}44`,
                    boxShadow: `0 0 60px ${BRAND_YELLOW}22, 0 30px 60px -30px rgba(0,0,0,0.8)`,
                    transform: `perspective(1200px) rotateX(${rotateX}deg) translateZ(${translateZ}px) translateY(${translateY}px) scale(${scale})`,
                    transformOrigin: 'center bottom',
                    opacity,
                    zIndex: totalCards - index,
                    backfaceVisibility: 'hidden',
                    transition: 'none', // Remove CSS transitions for GSAP control
                  }}
                >
                  {/* Number circle - off-black text, larger */}
                  <div
                    className="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                    style={{ background: BRAND_YELLOW, color: '#1a1a1a' }}
                  >
                    {index + 1}
                  </div>
                  <div className="h-full flex flex-col justify-center">
                    {/* 3D Icon - uses metallic gold */}
                    <div className="mb-4">
                      <Icon3D color={ICON_GOLD} size={48}>
                        <IconComponent className="w-12 h-12" />
                      </Icon3D>
                    </div>
                    <h3 className="text-h5 font-bold text-gray-100 mb-2">{pillar.title}</h3>
                    <p className="text-sm uppercase tracking-wider mb-4" style={{ color: BRAND_YELLOW }}>
                      {pillar.subtitle}
                    </p>
                    <p className="text-body text-gray-400 leading-relaxed">{pillar.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress bar - 3D plasma tube, fades with last card, moved lower */}
          <div
            className="flex justify-center mt-16 transition-opacity duration-300"
            style={{ opacity: progressBarOpacity }}
          >
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
                  transition: 'none', // Remove transition for smooth GSAP sync
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
// VARIATION 3: Clip-Path Reveal Animation
// TYPE: IntersectionObserver (natural scroll)
// STATUS: WORKING - no changes needed
// ============================================================
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

  return (
    <section ref={sectionRef} className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-widest text-gold-500 font-medium">
            Variation 3: Clip-Path Reveal
          </span>
        </div>

        <div className="text-center mb-12">
          <H2>The eXp Model</H2>
          <p className="text-body text-gray-400 mt-4">{MODEL_INTRO.line1}</p>
          <p className="text-body text-gold-400 font-medium">{MODEL_INTRO.line2}</p>
        </div>

        <div className="space-y-20">
          {PILLARS.map((pillar, index) => {
            const IconComponent = PILLAR_ICONS[index];
            const cardProgress = revealProgress[index];
            const clipValue = Math.min(100, cardProgress * 200);
            const isEven = index % 2 === 0;

            return (
              <div
                key={pillar.title}
                className={`reveal-card flex items-center gap-8 ${isEven ? '' : 'flex-row-reverse'}`}
              >
                <div
                  className="w-1/3 aspect-square rounded-2xl relative overflow-hidden flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${BRAND_YELLOW}22, ${BRAND_YELLOW}44)`,
                    clipPath: isEven
                      ? `polygon(0 0, ${clipValue}% 0, ${clipValue}% 100%, 0 100%)`
                      : `polygon(${100 - clipValue}% 0, 100% 0, 100% 100%, ${100 - clipValue}% 100%)`,
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      style={{
                        transform: `scale(${0.6 + cardProgress * 0.4})`,
                        opacity: cardProgress,
                      }}
                    >
                      <Icon3D color={ICON_GOLD} size={64}>
                        <IconComponent className="w-16 h-16" />
                      </Icon3D>
                    </div>
                  </div>
                </div>

                <div
                  className={`flex-1 ${isEven ? '' : 'text-right'}`}
                  style={{
                    opacity: Math.min(1, cardProgress * 2),
                    transform: `translateX(${isEven ? (1 - cardProgress) * 40 : (cardProgress - 1) * 40}px)`,
                  }}
                >
                  <div
                    className="inline-block px-3 py-1 rounded-full text-xs uppercase tracking-wider mb-3"
                    style={{ background: `${BRAND_YELLOW}22`, color: BRAND_YELLOW }}
                  >
                    {pillar.subtitle}
                  </div>
                  <h3 className="text-h5 font-bold text-gray-100 mb-3">{pillar.title}</h3>
                  <p className="text-body text-gray-400 leading-relaxed">{pillar.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <p className="text-body text-gray-400 max-w-xl mx-auto">{OUTRO}</p>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// VARIATION 4: DELETED - Too slow to start, not mobile friendly
// ============================================================

// ============================================================
// VARIATION 6: Horizontal Scroll
// TYPE: GSAP ScrollTrigger with pin + eased Y movement
// STATUS: ATTEMPT 7 - Multi-phase Y movement for easing into/out of slow
// ============================================================
function Variation6() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // Multi-phase timeline for easing into/out of slow scroll
      const tl = gsap.timeline();

      // Phase 1 (0-15%): Fast initial movement
      tl.to(contentRef.current, {
        y: -40,
        duration: 0.15,
        ease: 'power2.out',
      });

      // Phase 2 (15-85%): Very slow movement during main animation
      tl.to(contentRef.current, {
        y: -60,
        duration: 0.70,
        ease: 'none',
      });

      // Phase 3 (85-100%): Fast movement out
      tl.to(contentRef.current, {
        y: -110,
        duration: 0.15,
        ease: 'power2.in',
      });

      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: 'top top',
        end: '+=350%',
        pin: true,
        scrub: 0.5,
        animation: tl,
        onUpdate: (self) => setProgress(self.progress),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const totalCards = PILLARS.length;

  // Main animation: 0% to 85%
  // Outro: 85% to 100%
  const mainProgress = Math.max(0, Math.min(1, progress / 0.85));
  const outroProgress = Math.max(0, (progress - 0.85) / 0.15);

  const scrollPosition = mainProgress * (totalCards - 1);
  const activeIndex = Math.round(scrollPosition);

  return (
    <section ref={sectionRef}>
      <div ref={triggerRef} className="h-screen flex flex-col justify-center overflow-hidden">
        <div ref={contentRef}>
          <div className="text-center mb-4 px-4">
            <span className="text-xs uppercase tracking-widest text-gold-500 font-medium">
              Variation 6: Horizontal Scroll
            </span>
          </div>

          <div className="text-center mb-8 px-4">
            <H2>The eXp Model</H2>
          </div>

          {/* Cards container with extra padding for glow - uses CSS calc for responsive widths */}
          <div className="relative w-full overflow-visible py-12 px-4">
            <div
              className="flex gap-6 transition-transform duration-100"
              style={{
                // Start with first card centered, scroll left as progress increases
                // Card width is responsive: min(85vw, 420px), gap is 1.5rem (24px)
                transform: `translateX(calc(50vw - min(42.5vw, 210px) - ${scrollPosition} * (min(85vw, 420px) + 1.5rem)))`,
                opacity: 1 - outroProgress * 0.5,
              }}
            >
              {PILLARS.map((pillar, index) => {
                const IconComponent = PILLAR_ICONS[index];
                const distance = Math.abs(scrollPosition - index);
                const isActive = distance < 0.5;
                const scale = Math.max(0.8, 1 - distance * 0.15);
                const cardOpacity = Math.max(0.4, 1 - distance * 0.4);

                return (
                  <div
                    key={pillar.title}
                    className="flex-shrink-0 w-[85vw] max-w-[420px] transition-all duration-200"
                    style={{
                      transform: `scale(${scale})`,
                      opacity: cardOpacity,
                    }}
                  >
                    <div
                      className="p-6 md:p-8 rounded-3xl min-h-[280px] flex flex-col justify-center relative"
                      style={{
                        background: `linear-gradient(180deg, rgba(30,30,30,0.95), rgba(15,15,15,0.98))`,
                        border: `2px solid ${BRAND_YELLOW}${isActive ? '77' : '22'}`,
                        boxShadow: isActive
                          ? `0 0 80px 20px ${BRAND_YELLOW}44, 0 0 120px 40px ${BRAND_YELLOW}22`
                          : 'none',
                      }}
                    >
                      <div className="mx-auto mb-6">
                        <Icon3D color={ICON_GOLD} size={80}>
                          <IconComponent className="w-20 h-20" />
                        </Icon3D>
                      </div>
                      <div className="text-center">
                        <p className="text-xs uppercase tracking-wider mb-2" style={{ color: BRAND_YELLOW }}>
                          {pillar.subtitle}
                        </p>
                        <h3 className="text-h5 font-bold text-gray-100 mb-4">{pillar.title}</h3>
                        <p className="text-body text-gray-400 leading-relaxed">{pillar.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress bar - 3D plasma tube */}
          <div className="mt-8 flex justify-center px-4">
            <div
              className="w-80 h-3 rounded-full overflow-hidden relative"
              style={{
                background: 'linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)',
                border: '1px solid rgba(245, 245, 240, 0.25)',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6), inset 0 -1px 2px rgba(255,255,255,0.05)',
              }}
            >
              <div
                className="h-full rounded-full transition-all duration-100"
                style={{
                  width: `${mainProgress * 100}%`,
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
// STATUS: ATTEMPT 8 - Fix outro, reduce card spacing
// ============================================================
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
          // More thresholds for smoother animation
          threshold: Array.from({ length: 50 }, (_, i) => i / 50),
          // rootMargin: top right bottom left
          // -20% top = outro starts when element is 20% from exiting the top (reasonable)
          // -10% bottom = intro starts when element is 10% into viewport from bottom
          rootMargin: '-20% 0px -10% 0px',
        }
      );
      observer.observe(el);
      return observer;
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  // MUCH SLOWER blur reveal - takes full intersection ratio to complete
  const getBlur = (id: string) => {
    const p = elementProgress[id] || 0;
    // Blur goes from 15px to 0 over the entire progress (0 to 1)
    return Math.max(0, 15 * (1 - p));
  };

  const getOpacity = (id: string) => {
    const p = elementProgress[id] || 0;
    // Opacity goes from 0 to 1 over the entire progress (slower than before)
    return Math.min(1, p);
  };

  const getTranslateY = (id: string) => {
    const p = elementProgress[id] || 0;
    // TranslateY goes from 40px to 0 over the entire progress
    return 40 * (1 - p);
  };

  return (
    <section ref={sectionRef} className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-widest text-gold-500 font-medium">
            Variation 7: Text Blur Reveal
          </span>
        </div>

        {/* H2 with metal backing plate and subheading */}
        <div className="text-center mb-12">
          <H2>The eXp Model</H2>
          <p className="text-body text-gray-400 mt-4 max-w-xl mx-auto">{PROBLEM_TEXT.line1}</p>
        </div>

        {/* Reduced spacing between cards */}
        <div className="space-y-12">
          {PILLARS.map((pillar, index) => {
            const IconComponent = PILLAR_ICONS[index];
            const id = `card7-${index}`;
            return (
              <div
                key={pillar.title}
                className="blur-reveal max-w-2xl mx-auto"
                data-id={id}
                style={{
                  filter: `blur(${getBlur(id)}px)`,
                  opacity: getOpacity(id),
                  transform: `translateY(${getTranslateY(id)}px)`,
                }}
              >
                <div
                  className="p-8 rounded-3xl"
                  style={{
                    background: `linear-gradient(135deg, rgba(25,25,25,0.9), rgba(15,15,15,0.95))`,
                    borderLeft: `4px solid ${BRAND_YELLOW}`,
                  }}
                >
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <Icon3D color={ICON_GOLD} size={64}>
                        <IconComponent className="w-16 h-16" />
                      </Icon3D>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider mb-1" style={{ color: BRAND_YELLOW }}>
                        {pillar.subtitle}
                      </p>
                      <h3 className="text-h5 font-bold text-gray-100 mb-2">{pillar.title}</h3>
                      <p className="text-body text-gray-400">{pillar.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="blur-reveal text-center mt-16"
          data-id="outro7"
          style={{
            filter: `blur(${getBlur('outro7')}px)`,
            opacity: getOpacity('outro7'),
            transform: `translateY(${getTranslateY('outro7')}px)`,
          }}
        >
          <p className="text-body text-gray-400 max-w-xl mx-auto">{OUTRO}</p>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// VARIATION 8: Split Letter Animation (cards only)
// TYPE: GSAP ScrollTrigger with pin + eased Y movement
// STATUS: ATTEMPT 8 - H2/subheading always visible, only cards animate
// ============================================================
function Variation8() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // Multi-phase timeline for easing into/out of slow scroll
      const tl = gsap.timeline();

      // Phase 1 (0-15%): Fast initial movement
      tl.to(contentRef.current, {
        y: -50,
        duration: 0.15,
        ease: 'power2.out',
      });

      // Phase 2 (15-85%): Very slow movement during main animation
      tl.to(contentRef.current, {
        y: -70,
        duration: 0.70,
        ease: 'none',
      });

      // Phase 3 (85-100%): Fast movement out
      tl.to(contentRef.current, {
        y: -120,
        duration: 0.15,
        ease: 'power2.in',
      });

      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: 'top top',
        end: '+=350%',
        pin: true,
        scrub: 0.5,
        animation: tl,
        onUpdate: (self) => setProgress(self.progress),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef}>
      <div ref={triggerRef} className="h-screen flex items-center justify-center overflow-hidden">
        <div ref={contentRef} className="max-w-4xl mx-auto px-4 w-full text-center">
          <div className="mb-6">
            <span className="text-xs uppercase tracking-widest text-gold-500 font-medium">
              Variation 8: Card Animation
            </span>
          </div>

          <div className="mb-8">
            <H2>The eXp Model</H2>
            <p className="text-body text-gray-400 mt-4 max-w-xl mx-auto">
              {MODEL_INTRO.line2}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PILLARS.map((pillar, index) => {
              const IconComponent = PILLAR_ICONS[index];
              const cardStart = index * 0.15;
              const cardProgress = Math.max(0, Math.min(1, (progress - cardStart) / 0.2));

              return (
                <div
                  key={pillar.title}
                  className="p-5 rounded-2xl text-center transition-all duration-100"
                  style={{
                    background: `linear-gradient(180deg, rgba(30,30,30,0.9), rgba(20,20,20,0.95))`,
                    border: `1px solid ${BRAND_YELLOW}33`,
                    transform: `translateY(${(1 - cardProgress) * 50}px) scale(${0.85 + cardProgress * 0.15})`,
                    opacity: cardProgress,
                  }}
                >
                  <div className="mx-auto mb-3">
                    <Icon3D color={ICON_GOLD} size={48}>
                      <IconComponent className="w-12 h-12" />
                    </Icon3D>
                  </div>
                  <h3 className="text-h6 font-bold text-gray-100 mb-1">{pillar.title}</h3>
                  <p className="text-xs" style={{ color: BRAND_YELLOW }}>{pillar.subtitle}</p>
                </div>
              );
            })}
          </div>

          {/* Progress bar - 3D plasma tube */}
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
                className="h-full rounded-full transition-all duration-100"
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
// VARIATION 9: Counter Animation
// TYPE: GSAP ScrollTrigger with pin + eased Y movement
// STATUS: ATTEMPT 7 - Multi-phase Y movement for easing into/out of slow
// ============================================================
function Variation9() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // Multi-phase timeline for easing into/out of slow scroll
      const tl = gsap.timeline();

      // Phase 1 (0-15%): Fast initial movement
      tl.to(contentRef.current, {
        y: -40,
        duration: 0.15,
        ease: 'power2.out',
      });

      // Phase 2 (15-85%): Very slow movement during main animation
      tl.to(contentRef.current, {
        y: -60,
        duration: 0.70,
        ease: 'none',
      });

      // Phase 3 (85-100%): Fast movement out
      tl.to(contentRef.current, {
        y: -100,
        duration: 0.15,
        ease: 'power2.in',
      });

      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: 0.5,
        animation: tl,
        onUpdate: (self) => setProgress(self.progress),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { number: 90000, suffix: '+', label: 'Agents Worldwide' },
    { number: 24, suffix: '', label: 'Countries' },
    { number: 80, suffix: '/20', label: 'Commission Split' },
    { number: 7, suffix: ' Tiers', label: 'Revenue Share' },
  ];

  return (
    <section ref={sectionRef}>
      <div ref={triggerRef} className="h-screen flex items-center justify-center">
        <div ref={contentRef} className="max-w-5xl mx-auto px-4 w-full">
          <div className="text-center mb-4">
            <span className="text-xs uppercase tracking-widest text-gold-500 font-medium">
              Variation 9: Counter Animation
            </span>
          </div>

          <div className="text-center mb-10">
            <H2>The eXp Model</H2>
            <p className="text-body text-gray-400 mt-3">{MODEL_INTRO.line1}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
            {stats.map((stat, index) => {
              const statStart = index * 0.1;
              const statProgress = Math.max(0, Math.min(1, (progress - statStart) / 0.3));
              const currentNumber = Math.floor(stat.number * statProgress);

              return (
                <div
                  key={stat.label}
                  className="text-center p-5 rounded-2xl transition-all duration-100"
                  style={{
                    background: 'rgba(20,20,20,0.85)',
                    border: `1px solid ${BRAND_YELLOW}44`,
                    boxShadow: `0 0 ${50 * statProgress}px ${BRAND_YELLOW}33`,
                    transform: `scale(${0.85 + statProgress * 0.15}) translateY(${(1 - statProgress) * 25}px)`,
                    opacity: 0.4 + statProgress * 0.6,
                  }}
                >
                  <div className="text-4xl md:text-5xl font-bold mb-2 tabular-nums" style={{ color: BRAND_YELLOW }}>
                    {currentNumber.toLocaleString()}{stat.suffix}
                  </div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {PILLARS.map((pillar, index) => {
              const IconComponent = PILLAR_ICONS[index];
              const cardStart = 0.5 + index * 0.08;
              const cardProgress = Math.max(0, Math.min(1, (progress - cardStart) / 0.2));

              return (
                <div
                  key={pillar.title}
                  className="p-3 rounded-xl text-center transition-all duration-100"
                  style={{
                    background: `${BRAND_YELLOW}11`,
                    border: `1px solid ${BRAND_YELLOW}33`,
                    transform: `translateY(${(1 - cardProgress) * 30}px)`,
                    opacity: cardProgress,
                  }}
                >
                  <Icon3D color={ICON_GOLD} size={32}>
                    <IconComponent className="w-8 h-8" />
                  </Icon3D>
                  <p className="text-xs font-medium text-gray-100 mt-1">{pillar.title}</p>
                </div>
              );
            })}
          </div>

          {/* Progress bar - 3D plasma tube */}
          <div className="mt-8 flex justify-center">
            <div
              className="w-80 h-3 rounded-full overflow-hidden relative"
              style={{
                background: 'linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)',
                border: '1px solid rgba(245, 245, 240, 0.25)',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6), inset 0 -1px 2px rgba(255,255,255,0.05)',
              }}
            >
              <div
                className="h-full rounded-full transition-all duration-100"
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
// VARIATION 10: Diagonal Wipe Reveal
// TYPE: GSAP ScrollTrigger with pin + eased Y movement
// STATUS: ATTEMPT 8 - Brand yellow, 3D icons, progress bar, no bg
// ============================================================
function Variation10() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // Multi-phase timeline for easing into/out of slow scroll
      const tl = gsap.timeline();

      // Phase 1 (0-15%): Fast initial movement
      tl.to(contentRef.current, {
        y: -50,
        duration: 0.15,
        ease: 'power2.out',
      });

      // Phase 2 (15-85%): Very slow movement during main animation
      tl.to(contentRef.current, {
        y: -70,
        duration: 0.70,
        ease: 'none',
      });

      // Phase 3 (85-100%): Fast movement out
      tl.to(contentRef.current, {
        y: -120,
        duration: 0.15,
        ease: 'power2.in',
      });

      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: 'top top',
        end: '+=330%',
        pin: true,
        scrub: 0.5,
        animation: tl,
        onUpdate: (self) => setProgress(self.progress),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef}>
      <div ref={triggerRef} className="h-screen flex items-center justify-center overflow-hidden relative">

        <div ref={contentRef} className="relative z-10 max-w-5xl mx-auto px-4 w-full">
          <div className="text-center mb-4">
            <span className="text-xs uppercase tracking-widest text-gold-500 font-medium">
              Variation 10: Diagonal Wipe
            </span>
          </div>

          {/* H2 always visible - no animation */}
          <div className="text-center mb-10">
            <H2>The eXp Model</H2>
          </div>

          {/* Grid with auto-row sizing for equal heights per row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5" style={{ gridAutoRows: '1fr' }}>
            {PILLARS.map((pillar, index) => {
              const IconComponent = PILLAR_ICONS[index];
              // Cards start immediately since H2 has no animation
              const cardStart = index * 0.15;
              const cardProgress = Math.max(0, Math.min(1, (progress - cardStart) / 0.28));
              const wipePercent = cardProgress * 220;

              return (
                <div
                  key={pillar.title}
                  className="relative overflow-hidden rounded-2xl transition-all duration-100"
                  style={{ background: 'rgba(20,20,20,0.4)' }}
                >
                  {/* Content layer - position relative for natural sizing */}
                  <div className="p-7 relative z-10">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${BRAND_YELLOW}22`, boxShadow: `0 0 30px ${BRAND_YELLOW}44` }}
                      >
                        <Icon3D color={ICON_GOLD} size={40}>
                          <IconComponent className="w-10 h-10" />
                        </Icon3D>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider mb-1" style={{ color: BRAND_YELLOW }}>
                          {pillar.subtitle}
                        </p>
                        <h3 className="text-h6 font-bold text-gray-100 mb-2">{pillar.title}</h3>
                        <p className="text-body text-gray-400">{pillar.description}</p>
                      </div>
                    </div>
                  </div>
                  {/* Wipe overlay - starts covering card, reveals as wipe progresses */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `linear-gradient(135deg, rgba(30,30,30,0.96), rgba(20,20,20,0.98))`,
                      clipPath: `polygon(${wipePercent}% 0, 100% 0, 100% 100%, ${wipePercent - 120}% 100%)`,
                    }}
                  />
                  {/* Border overlay */}
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-100"
                    style={{ border: `2px solid ${BRAND_YELLOW}`, opacity: cardProgress * 0.6 }}
                  />
                </div>
              );
            })}
          </div>

          {/* Progress bar - 3D plasma tube */}
          <div className="mt-8 flex justify-center">
            <div
              className="w-80 h-3 rounded-full overflow-hidden relative"
              style={{
                background: 'linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)',
                border: '1px solid rgba(245, 245, 240, 0.25)',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6), inset 0 -1px 2px rgba(255,255,255,0.05)',
              }}
            >
              <div
                className="h-full rounded-full transition-all duration-100"
                style={{
                  width: `${progress * 100}%`,
                  background: `linear-gradient(180deg, #ffe566 0%, ${BRAND_YELLOW} 40%, #cc9900 100%)`,
                  boxShadow: `0 0 8px ${BRAND_YELLOW}, 0 0 16px ${BRAND_YELLOW}, 0 0 32px ${BRAND_YELLOW}66, inset 0 1px 2px rgba(255,255,255,0.4)`,
                }}
              />
            </div>
          </div>

          <div
            className="text-center mt-8 transition-all duration-200"
            style={{
              opacity: Math.max(0, (progress - 0.8) * 5),
              transform: `translateY(${Math.max(0, (1 - (progress - 0.8) * 5) * 15)}px)`,
            }}
          >
            <p className="text-body text-gray-400 max-w-xl mx-auto">{OUTRO}</p>
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
          eXp Model Section - Design Variations
        </h1>
        <p className="text-body text-gray-400 max-w-2xl mx-auto">
          Testing GSAP ScrollTrigger with smooth ease and slight viewport movement during pin.
          All pinned variations now have smooth start/stop and the content moves slightly downward.
        </p>
        <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg inline-block">
          <p className="text-emerald-400 text-sm">
            Attempt 4: Smooth ease + slight Y movement (50-80px) during pin
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

      {/* Auto-switching tabbed animation from homepage */}
      <div className="border-b border-white/10">
        <div className="text-center pt-8 mb-4">
          <span className="text-xs uppercase tracking-widest text-gold-500 font-medium">
            Homepage Tabbed Animation: Auto-Switching Deck Stack
          </span>
        </div>
        <WhyOnlyAtExp />
      </div>

      <div className="py-12 px-4 text-center">
        <p className="text-gray-500 text-sm">
          All pinned variations now have:
          <br />
          • Smooth scrub (value: 2) for gradual animation
          <br />
          • Slight downward movement (50-80px) during pin
          <br />
          • Content smoothly transitions in and out of pin
        </p>
      </div>
    </main>
  );
}
