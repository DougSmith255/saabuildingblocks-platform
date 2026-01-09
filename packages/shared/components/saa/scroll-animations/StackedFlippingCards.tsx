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

export interface StackedFlippingCardsItem {
  /** Content to render inside the card */
  content: ReactNode;
  /** Whether this card is highlighted (uses misty gold background) */
  highlight?: boolean;
}

export interface StackedFlippingCardsProps {
  /** Array of card items to display */
  cards: StackedFlippingCardsItem[];
  /** Optional className for the section */
  className?: string;
  /** Optional header content */
  header?: ReactNode;
  /** Whether to show the progress bar */
  showProgressBar?: boolean;
}

// Misty gold background for highlighted cards
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
 * StackedFlippingCards - 3D rotating card stack with magnetic snap
 *
 * Cards flip up and away as you scroll, creating a stacked deck effect.
 * Features velocity-based magnetic snap centering and optional mystic fog highlighting.
 *
 * @example
 * ```tsx
 * <StackedFlippingCards
 *   cards={[
 *     { content: <p>First card content</p> },
 *     { content: <p>Second card content</p> },
 *     { content: <p>Third card content</p>, highlight: true },
 *   ]}
 *   header={<H2>Section Title</H2>}
 * />
 * ```
 */
export function StackedFlippingCards({
  cards,
  className = '',
  header,
  showProgressBar = true,
}: StackedFlippingCardsProps) {
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

  const totalCards = cards.length;

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
          <div className="mx-auto max-w-4xl">
            {header && <div className="text-center mb-8">{header}</div>}

            {/* 3D Rotating Card Stack */}
            <div
              ref={cardStackRef}
              className="relative w-full max-w-lg mx-auto"
              style={{
                perspective: '1200px',
                height: '340px',
              }}
            >
              {cards.map((card, index) => {
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
                    {card.content}
                  </div>
                );
              })}
            </div>

            {/* 3D Plasma Tube Progress Bar */}
            {showProgressBar && (
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
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default StackedFlippingCards;
