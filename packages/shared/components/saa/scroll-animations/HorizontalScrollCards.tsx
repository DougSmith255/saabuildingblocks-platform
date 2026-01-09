'use client';

import React, { useState, useRef, useLayoutEffect, useEffect, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Brand colors
const BRAND_YELLOW = '#ffd700';

export interface HorizontalScrollCardsItem {
  /** Image URL for the card */
  image: string;
  /** Alt text for the image */
  imageAlt?: string;
  /** Text to display below the image */
  text: string;
}

export interface HorizontalScrollCardsProps {
  /** Array of card items */
  cards: HorizontalScrollCardsItem[];
  /** Optional className for the section */
  className?: string;
  /** Optional header content */
  header?: ReactNode;
  /** Whether to show the progress bar */
  showProgressBar?: boolean;
  /** Whether to show the portal edge bars */
  showPortalEdges?: boolean;
}

// Misty fog gradient for active card
const activeBackground = `
  radial-gradient(ellipse 120% 80% at 30% 20%, rgba(255,255,255,0.8) 0%, transparent 50%),
  radial-gradient(ellipse 100% 60% at 70% 80%, rgba(255,200,100,0.6) 0%, transparent 40%),
  radial-gradient(ellipse 80% 100% at 50% 50%, rgba(255,215,0,0.7) 0%, transparent 60%),
  radial-gradient(ellipse 60% 40% at 20% 70%, rgba(255,180,50,0.5) 0%, transparent 50%),
  radial-gradient(ellipse 90% 70% at 80% 30%, rgba(255,240,200,0.4) 0%, transparent 45%),
  linear-gradient(180deg, rgba(255,225,150,0.9) 0%, rgba(255,200,80,0.85) 50%, rgba(255,180,50,0.9) 100%)
`;
const inactiveBackground = 'linear-gradient(180deg, rgba(30,30,30,0.95), rgba(15,15,15,0.98))';

/**
 * HorizontalScrollCards - Cards slide horizontally with magnetic centering
 *
 * Features velocity-based magnetic snap, mystic fog active state,
 * and optional portal edge styling with infinite loop effect.
 *
 * @example
 * ```tsx
 * <HorizontalScrollCards
 *   cards={[
 *     { image: '/image1.jpg', text: 'First Card' },
 *     { image: '/image2.jpg', text: 'Second Card' },
 *   ]}
 *   header={<H2>Section Title</H2>}
 * />
 * ```
 */
export function HorizontalScrollCards({
  cards,
  className = '',
  header,
  showProgressBar = true,
  showPortalEdges = true,
}: HorizontalScrollCardsProps) {
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

  const totalCards = cards.length;

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

  return (
    <section ref={sectionRef} className={`relative pt-16 md:pt-24 ${className}`}>
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
          {header && <div className="text-center mb-8 px-6">{header}</div>}

          {/* Horizontal Scroll Cards Container with Portal Edges */}
          <div className="relative">
            {/* Left curved bar */}
            {showPortalEdges && (
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
            )}
            {/* Right curved bar */}
            {showPortalEdges && (
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
            )}

            {/* Inner container - clips cards horizontally at inner edge of bars */}
            <div
              className="relative"
              style={{
                marginLeft: showPortalEdges ? '12px' : '0',
                marginRight: showPortalEdges ? '12px' : '0',
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
                    transform: `translateX(calc(50vw - ${CARD_WIDTH / 2}px - ${showPortalEdges ? 12 : 0}px - ${(scrollPosition + 2) * (CARD_WIDTH + CARD_GAP)}px))`,
                  }}
                >
                  {/* Create looped array: last 2 cards + all cards + first 2 cards */}
                  {(() => {
                    const loopedCards = [
                      ...cards.slice(-2),
                      ...cards,
                      ...cards.slice(0, 2)
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
                                alt={point.imageAlt || point.text}
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
          {showProgressBar && (
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
          )}
        </div>
      </div>
    </section>
  );
}

export default HorizontalScrollCards;
