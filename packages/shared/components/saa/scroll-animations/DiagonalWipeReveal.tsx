'use client';

import React, { useState, useRef, useLayoutEffect, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Brand colors
const BRAND_YELLOW = '#ffd700';

export interface DiagonalWipeRevealItem {
  /** Icon component to render */
  icon: ReactNode;
  /** Title text */
  title: string;
  /** Subtitle/label text */
  subtitle: string;
  /** Description text */
  description: string;
}

export interface DiagonalWipeRevealProps {
  /** Array of card items (works best with 4 items) */
  cards: DiagonalWipeRevealItem[];
  /** Optional className for the section */
  className?: string;
  /** Optional header content */
  header?: ReactNode;
  /** Whether to show the progress bar */
  showProgressBar?: boolean;
}

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

/**
 * DiagonalWipeReveal - Cards reveal with diagonal wipe effect
 *
 * Cards are revealed with a diagonal wipe animation as you scroll.
 * Features velocity-based magnetic snap and mystic fog highlighting.
 *
 * @example
 * ```tsx
 * <DiagonalWipeReveal
 *   cards={[
 *     { icon: <DollarSign />, title: "Commission", subtitle: "The Foundation", description: "..." },
 *     { icon: <TrendingUp />, title: "Ownership", subtitle: "Build Equity", description: "..." },
 *     { icon: <Zap />, title: "Leverage", subtitle: "Scale Systems", description: "..." },
 *     { icon: <RefreshCw />, title: "Longevity", subtitle: "Income That Lasts", description: "..." },
 *   ]}
 *   header={<H2>Section Title</H2>}
 * />
 * ```
 */
export function DiagonalWipeReveal({
  cards,
  className = '',
  header,
  showProgressBar = true,
}: DiagonalWipeRevealProps) {
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

  const totalCards = cards.length;

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

  return (
    <section ref={sectionRef} className={className}>
      <div
        ref={triggerRef}
        style={{
          willChange: 'transform',
          contain: 'layout style paint',
        }}
      >
        <div className="px-6 py-16 md:py-24">
          <div className="mx-auto max-w-5xl">
            {header && <div className="text-center mb-10">{header}</div>}

            <div ref={cardGridRef} className="grid grid-cols-1 md:grid-cols-2 gap-5" style={{ gridAutoRows: '1fr' }}>
              {cards.map((card, index) => {
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
                          {card.icon}
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
            {showProgressBar && (
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
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default DiagonalWipeReveal;
