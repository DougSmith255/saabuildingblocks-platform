'use client';

import { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { H2 } from '@saa/shared/components/saa';
import { CTAButton } from '@saa/shared/components/saa';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * "Why This Only Works at eXp Realty" Section
 * 3D Rotating Card Stack with Scroll-Based Animation
 *
 * Structure:
 * - sectionRef: outer section element
 * - triggerRef: invisible wrapper that gets pinned (no styling)
 * - contentRef: glass panel + content that animates upward together
 */

// Content
const HEADLINE = "Why This Only Works at eXp Realty";
const STEPS = [
  { num: 1, text: "Most real estate brokerages provide tools, training, and support centrally.", highlight: false },
  { num: 2, text: "Even when sponsorship exists, sponsors are limited to offering only what the brokerage provides.", highlight: false },
  { num: 3, text: "eXp Realty sponsorship works differently.", highlight: true },
];
const DIFFERENTIATOR = "eXp Realty Sponsorship is Different.";
const KEY_POINT = "It is the only brokerage that allows sponsors to build and deliver real systems, training, and support. Most sponsors don't use that freedom. Smart Agent Alliance does.";
const TAGLINE = "When you succeed, we succeed.";
const CTA_TEXT = "See Our Systems";

// Brand colors
const BRAND_YELLOW = '#ffd700';

// Images
const ENTREPRENEURIAL_SPONSOR_IMAGE = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/exp-entrepreneurial-sponsor-v2/desktop';
const ENTREPRENEURIAL_SPONSOR_ALT = 'eXp Realty sponsor delivering entrepreneurial systems to real estate agents';
const ENTREPRENEURIAL_SPONSOR_TITLE = 'eXp Realty Entrepreneurial Sponsor Systems';

// Marigold Glass Panel styles (inlined from GlassPanel component)
const GLASS_STYLES: React.CSSProperties = {
  background: 'linear-gradient(180deg, rgba(255,190,0,0.032) 0%, rgba(255,190,0,0.04) 50%, rgba(255,190,0,0.032) 100%)',
  boxShadow: `
    0 8px 32px rgba(0,0,0,0.4),
    0 4px 12px rgba(0,0,0,0.25),
    inset 0 1px 0 0 rgba(255,255,255,0.35),
    inset 0 2px 4px 0 rgba(255,255,255,0.2),
    inset 0 8px 20px -8px rgba(255,190,0,0.3),
    inset 0 20px 40px -20px rgba(255,255,255,0.15),
    inset 0 -1px 0 0 rgba(0,0,0,0.7),
    inset 0 -2px 6px 0 rgba(0,0,0,0.5),
    inset 0 -10px 25px -8px rgba(0,0,0,0.6),
    inset 0 -25px 50px -20px rgba(0,0,0,0.45)
  `,
  backdropFilter: 'blur(2px)',
};

// 3D Number Component
function Number3D({ num, size = 'medium', dark = false, highlight = false }: { num: number; size?: 'small' | 'medium' | 'large'; dark?: boolean; highlight?: boolean }) {
  const sizeStyles = {
    small: { minWidth: '40px', height: '40px', fontSize: '24px' },
    medium: { minWidth: '56px', height: '56px', fontSize: '32px' },
    large: { minWidth: '72px', height: '72px', fontSize: '42px' },
  };

  const style = sizeStyles[size];

  // Highlight version uses lighter gray for contrast - brighter than the gray circle background
  const highlightColor = '#9a9a9a';
  const highlightFilter = 'drop-shadow(-1px -1px 0 #ccc) drop-shadow(1px 1px 0 #666) drop-shadow(2px 2px 0 #444) drop-shadow(3px 3px 2px rgba(0, 0, 0, 0.5))';

  return (
    <span
      className="inline-flex items-center justify-center font-bold"
      style={{
        ...style,
        color: dark ? '#111' : (highlight ? highlightColor : '#c4a94d'),
        filter: dark
          ? 'none'
          : (highlight ? highlightFilter : 'drop-shadow(-1px -1px 0 #ffe680) drop-shadow(1px 1px 0 #8a7a3d) drop-shadow(3px 3px 0 #2a2a1d) drop-shadow(4px 4px 2px rgba(0, 0, 0, 0.5))'),
        transform: dark ? 'none' : 'perspective(500px) rotateX(8deg)',
      }}
    >
      {num}
    </span>
  );
}

export function WhyOnlyAtExp() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardStackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  // Refs for magnetic effect
  const rawProgressRef = useRef(0);
  const displayProgressRef = useRef(0);
  const lastRawRef = useRef(0);
  const velocityRef = useRef(0);
  const rafRef = useRef<number>(0);
  const isMobileRef = useRef(false);

  const totalCards = STEPS.length;

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if mobile
    isMobileRef.current = window.innerWidth < 768;

    // Grace period: 10% at start and 10% at end of scroll range
    // Buffer zones: desktop has 10% grace at start/end, mobile has none
    const GRACE = isMobileRef.current ? 0 : 0.1;
    const CONTENT_RANGE = 1 - (GRACE * 2);

    // Velocity-based magnetic snap
    // Desktop: strong magnetic effect, Mobile: subtle centering assist
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

      // Mobile: subtle magnetic assist (low intensity, helps center cards when stopped)
      // Desktop: strong magnetic snap effect
      if (isMobileRef.current) {
        // Mobile: much weaker magnetic effect - mostly follows scroll with gentle centering
        // velocityFactor: 0 = stopped (apply centering), 1 = scrolling (follow raw)
        const velocityFactor = Math.min(1, velocityRef.current * 150); // Higher multiplier = less magnetic pull

        // Only apply subtle centering when nearly stopped (velocityFactor < 0.3)
        // Blend: 85% raw position + 15% snap target when stopped
        const magneticStrength = Math.max(0, 0.15 * (1 - velocityFactor * 3));
        const targetProgress = raw * (1 - magneticStrength) + nearestCardProgress * magneticStrength;

        // Very gentle interpolation for mobile
        const newProgress = currentDisplay + (targetProgress - currentDisplay) * 0.12;

        if (Math.abs(newProgress - currentDisplay) > 0.0001) {
          displayProgressRef.current = newProgress;
          setProgress(newProgress);
        }
        rafRef.current = requestAnimationFrame(animateMagnetic);
        return;
      }

      // Desktop: strong magnetic snap effect
      // When velocity is high, follow raw position
      // When velocity is low, snap to nearest card
      const velocityFactor = Math.min(1, velocityRef.current * 100); // 0 = stopped, 1 = scrolling fast

      // Blend between snap target (when stopped) and raw position (when scrolling)
      const targetProgress = nearestCardProgress * (1 - velocityFactor) + raw * velocityFactor;

      // Smooth interpolation toward target
      const newProgress = currentDisplay + (targetProgress - currentDisplay) * 0.15;

      // Always update to keep smooth animation
      if (Math.abs(newProgress - currentDisplay) > 0.0001) {
        displayProgressRef.current = newProgress;
        setProgress(newProgress);
      }

      rafRef.current = requestAnimationFrame(animateMagnetic);
    };

    rafRef.current = requestAnimationFrame(animateMagnetic);

    const ctx = gsap.context(() => {
      // Timeline animates the glass+content together
      const tl = gsap.timeline();

      tl.to(contentRef.current, {
        y: -60, // Drift upward by 60px total (from +30 to -30)
        duration: 1,
        ease: 'none',
      });

      // Pin when the CARD STACK reaches 55% from top of viewport
      ScrollTrigger.create({
        trigger: cardStackRef.current,
        start: 'center 55%',
        end: '+=200%',
        pin: triggerRef.current,
        pinSpacing: true,
        scrub: 0.5,
        animation: tl,
        onUpdate: (self: ScrollTrigger) => {
          // Map scroll progress to card progress with grace periods
          // On mobile, cards move 2x faster relative to scroll
          const mobileMultiplier = isMobileRef.current ? 2 : 1;
          let cardProgress = 0;

          if (self.progress <= GRACE) {
            cardProgress = 0;
          } else if (self.progress >= 1 - GRACE) {
            cardProgress = 1;
          } else {
            // Apply mobile multiplier (2x speed on mobile) and clamp to 0-1 range
            cardProgress = Math.min((self.progress - GRACE) / CONTENT_RANGE * mobileMultiplier, 1);
          }

          // Update raw progress - magnetic loop will interpolate
          rawProgressRef.current = cardProgress;
        },
      });
    }, sectionRef);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ctx.revert();
    };
  }, [totalCards]);

  return (
    <section ref={sectionRef}>
      {/* Invisible wrapper that gets pinned */}
      <div
        ref={triggerRef}
        style={{
          willChange: 'transform',
          contain: 'layout style', // Removed 'paint' to allow content to extend beyond bounds during Y drift
        }}
      >
        {/* Glass panel + content - this entire thing animates upward (desktop only) */}
        <div
          ref={contentRef}
          className="rounded-3xl overflow-hidden relative"
          style={{
            ...GLASS_STYLES,
            transform: 'translateY(30px)', // Start 30px below center
          }}
        >
          {/* Noise texture overlay */}
          <div
            className="absolute inset-0 pointer-events-none rounded-3xl"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              opacity: 0.06,
              mixBlendMode: 'overlay',
            }}
          />

          {/* Content */}
          <div className="relative z-10 px-6 py-16 md:py-24">
            <div className="mx-auto" style={{ maxWidth: '1600px' }}>
              {/* Section Header */}
              <div className="text-center mb-8">
                <H2 style={{ maxWidth: '100%' }}>{HEADLINE}</H2>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* Left Column: Card Stack + Progress Bar */}
                <div className="flex flex-col relative" style={{ zIndex: 10 }}>
                  {/* 3D Rotating Card Stack - works on both mobile and desktop */}
                  <div
                    ref={cardStackRef}
                    className="relative w-full"
                    style={{
                      perspective: '1200px',
                      height: '340px',
                    }}
                  >
                        {STEPS.map((step, index) => {
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
                            <div
                              key={index}
                              className="absolute inset-0 rounded-2xl p-4 md:p-8 flex flex-col items-center justify-center text-center"
                              style={{
                                background: step.highlight ? mistyBackground : darkBackground,
                                border: step.highlight
                                  ? '2px solid rgba(180,150,50,0.5)'
                                  : `1px solid ${BRAND_YELLOW}44`,
                                boxShadow: step.highlight
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
                              {step.highlight ? (
                                <div
                                  className="rounded-full flex items-center justify-center w-12 h-12 md:w-16 md:h-16 mb-3 md:mb-5"
                                  style={{
                                    backgroundColor: 'rgba(42,42,42,0.9)',
                                    border: '3px solid rgba(42,42,42,0.7)',
                                    boxShadow: '0 0 30px rgba(0,0,0,0.25), inset 0 0 20px rgba(0,0,0,0.15)',
                                  }}
                                >
                                  <Number3D num={step.num} size="medium" highlight />
                                </div>
                              ) : (
                                <div
                                  className="rounded-full flex items-center justify-center w-12 h-12 md:w-16 md:h-16 mb-3 md:mb-5"
                                  style={{
                                    background: 'rgba(255,255,255,0.08)',
                                    border: '2px solid rgba(255,255,255,0.15)',
                                  }}
                                >
                                  <Number3D num={step.num} size="medium" />
                                </div>
                              )}
                              <p
                                className="font-heading font-bold leading-relaxed px-2"
                                style={{
                                  color: step.highlight ? '#2a2a2a' : '#e5e5e5',
                                  fontSize: 'clamp(24px, calc(22.55px + 0.58vw), 40px)',
                                }}
                              >
                                {step.text}
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

                {/* Right Column: Key message card */}
                <figure
                  className="relative rounded-2xl overflow-hidden border border-white/10"
                  style={{ minHeight: '340px', zIndex: 1 }}
                  itemScope
                  itemType="https://schema.org/ImageObject"
                >
                  <div className="absolute inset-0">
                    <img
                      src={ENTREPRENEURIAL_SPONSOR_IMAGE}
                      alt={ENTREPRENEURIAL_SPONSOR_ALT}
                      title={ENTREPRENEURIAL_SPONSOR_TITLE}
                      className="w-full h-full object-cover"
                      itemProp="contentUrl"
                      loading="lazy"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.1) 100%)'
                      }}
                    />
                  </div>

                  <figcaption className="relative z-10 p-6 md:p-8 h-full flex flex-col justify-center">
                    <p className="font-heading text-2xl md:text-3xl font-bold mb-4" style={{ color: BRAND_YELLOW }}>{DIFFERENTIATOR}</p>
                    <p className="text-body text-lg leading-relaxed mb-4" itemProp="description">{KEY_POINT}</p>
                    <p className="text-body text-xl italic mb-6" style={{ color: BRAND_YELLOW }}>{TAGLINE}</p>
                    <div className="flex justify-center md:justify-start">
                      <CTAButton href="/exp-realty-sponsor">{CTA_TEXT}</CTAButton>
                    </div>
                  </figcaption>

                  <meta itemProp="name" content={ENTREPRENEURIAL_SPONSOR_TITLE} />
                </figure>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
