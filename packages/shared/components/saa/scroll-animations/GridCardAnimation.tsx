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

export interface GridCardAnimationItem {
  /** Icon component to render */
  icon: ReactNode;
  /** Title text */
  title: string;
  /** Subtitle/label text */
  subtitle: string;
}

export interface GridCardAnimationProps {
  /** Array of card items (works best with 4 items) */
  cards: GridCardAnimationItem[];
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
 * GridCardAnimation - 4-card grid with magnetic snap between cards
 *
 * Cards are displayed in a 2x2 grid (4 columns on desktop).
 * Features velocity-based magnetic snap centering and mystic fog highlighting.
 *
 * @example
 * ```tsx
 * <GridCardAnimation
 *   cards={[
 *     { icon: <DollarSign />, title: "Commission", subtitle: "The Foundation" },
 *     { icon: <TrendingUp />, title: "Ownership", subtitle: "Build Equity" },
 *     { icon: <Zap />, title: "Leverage", subtitle: "Scale Systems" },
 *     { icon: <RefreshCw />, title: "Longevity", subtitle: "Income That Lasts" },
 *   ]}
 *   header={<H2>Section Title</H2>}
 * />
 * ```
 */
export function GridCardAnimation({
  cards,
  className = '',
  header,
  showProgressBar = true,
}: GridCardAnimationProps) {
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
          <div className="mx-auto max-w-4xl text-center">
            {header && <div className="mb-8">{header}</div>}

            <div ref={cardGridRef} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {cards.map((card, index) => {
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
                      {card.icon}
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

export default GridCardAnimation;
