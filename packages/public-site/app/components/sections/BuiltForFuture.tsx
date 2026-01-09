'use client';

import React, { useEffect, useRef, useState, useMemo, useLayoutEffect } from 'react';
import { H2 } from '@saa/shared/components/saa';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const BRAND_YELLOW = '#ffd700';

/**
 * "Built for Where Real Estate Is Going" Section
 * Horizontal Scroll Cards with Scroll-Based Animation
 *
 * Structure:
 * - sectionRef: outer section element
 * - GrayscaleDataStream: fixed background animation (not pinned)
 * - triggerRef: invisible wrapper that gets pinned (no styling)
 * - contentRef: content that animates upward together
 */

function GrayscaleDataStream() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const timeRef = useRef(0);
  const rafRef = useRef<number>(0);
  const scrollSpeedRef = useRef(1);
  const lastScrollY = useRef(0);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Animation loop that updates DOM directly without React re-renders
  useEffect(() => {
    const BASE_SPEED = 0.00028;
    let lastTimestamp = 0;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const scrollDelta = Math.abs(currentY - lastScrollY.current);
      lastScrollY.current = currentY;
      scrollSpeedRef.current = 1 + Math.min(scrollDelta * 0.05, 3);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const animate = (timestamp: number) => {
      const deltaTime = lastTimestamp ? timestamp - lastTimestamp : 16;
      lastTimestamp = timestamp;
      timeRef.current += BASE_SPEED * deltaTime * scrollSpeedRef.current;
      scrollSpeedRef.current = Math.max(1, scrollSpeedRef.current * 0.95);

      // Update CSS custom property directly on container - no React re-render
      if (containerRef.current) {
        containerRef.current.style.setProperty('--stream-time', String(timeRef.current));
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const columnCount = isMobile ? 8 : 20;
  const columnWidth = 100 / columnCount;

  const columnConfigs = useMemo(() => [...Array(columnCount)].map((_, i) => ({
    x: i * columnWidth,
    speed: 0.8 + (i % 4) * 0.4,
    offset: (i * 17) % 100,
  })), [columnCount, columnWidth]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0, contain: 'strict' }}
    >
      {columnConfigs.map((col, i) => (
        <DataStreamColumn key={i} col={col} colIndex={i} columnWidth={columnWidth} />
      ))}
    </div>
  );
}

// Memoized column component - only re-renders when props change (they don't during animation)
const DataStreamColumn = React.memo(function DataStreamColumn({
  col,
  colIndex,
  columnWidth,
}: {
  col: { x: number; speed: number; offset: number };
  colIndex: number;
  columnWidth: number;
}) {
  const columnRef = useRef<HTMLDivElement>(null);
  const numChars = 22;

  // Update positions via RAF reading parent's CSS custom property
  useEffect(() => {
    let rafId: number;

    const updatePositions = () => {
      const container = columnRef.current?.parentElement;
      if (!container || !columnRef.current) {
        rafId = requestAnimationFrame(updatePositions);
        return;
      }

      const time = parseFloat(container.style.getPropertyValue('--stream-time') || '0');
      const columnOffset = (time * col.speed * 60 + col.offset) % 110;

      const chars = columnRef.current.children;
      for (let j = 0; j < chars.length; j++) {
        const charEl = chars[j] as HTMLElement;
        const baseY = j * 5;
        const charY = (baseY + columnOffset) % 110 - 10;
        const headPosition = (columnOffset / 5) % numChars;
        const distanceFromHead = (j - headPosition + numChars) % numChars;
        const isHead = distanceFromHead === 0;
        const trailBrightness = isHead ? 1 : Math.max(0, 1 - distanceFromHead * 0.08);
        const edgeFade = charY < 12 ? Math.max(0, charY / 12) : charY > 88 ? Math.max(0, (100 - charY) / 12) : 1;

        charEl.style.top = charY + '%';
        charEl.style.opacity = String(edgeFade);
        charEl.style.color = isHead
          ? `rgba(180,180,180,${0.4 * edgeFade})`
          : `rgba(120,120,120,${trailBrightness * 0.25 * edgeFade})`;
        charEl.style.textShadow = isHead
          ? `0 0 6px rgba(150,150,150,${0.3 * edgeFade})`
          : `0 0 2px rgba(100,100,100,${0.1 * edgeFade})`;

        // Update character (0 or 1) based on time
        const flipRate = 0.6 + (colIndex % 3) * 0.3;
        const charSeed = Math.floor(time * 15 * flipRate + colIndex * 7 + j * 13);
        charEl.textContent = charSeed % 2 === 0 ? '0' : '1';
      }

      rafId = requestAnimationFrame(updatePositions);
    };

    rafId = requestAnimationFrame(updatePositions);
    return () => cancelAnimationFrame(rafId);
  }, [col.speed, col.offset, colIndex]);

  return (
    <div
      ref={columnRef}
      className="absolute"
      style={{
        left: col.x + '%',
        top: 0,
        width: columnWidth + '%',
        height: '100%',
        overflow: 'hidden',
        fontFamily: 'monospace',
        fontSize: '14px',
        lineHeight: '1.4',
        contain: 'layout style',
      }}
    >
      {[...Array(numChars)].map((_, j) => (
        <div key={j} style={{ position: 'absolute', willChange: 'top, opacity, color' }}>
          0
        </div>
      ))}
    </div>
  );
});

const FUTURE_HEADLINE = "Built for Where Real Estate Is Going";
const FUTURE_SUBLINE = "The future of real estate is cloud-based, global, and technology-driven. SAA is already there.";

const FUTURE_POINTS = [
  { image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-future-cloud/public', text: "Cloud-First Brokerage Model", imgClass: "w-full h-full object-contain", imgStyle: {}, bgColor: 'rgba(17,17,17,0.5)' },
  { image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-future-ai-bot/public', text: "AI-Powered Tools and Training", imgClass: "w-full h-full object-cover", imgStyle: { transform: 'scale(1.25) translate(10px, 18px)' }, bgColor: 'rgba(17,17,17,0.5)' },
  { image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-future-mobile-first/public', text: "Mobile-First Workflows", imgClass: "w-full h-full object-cover", imgStyle: { transform: 'scale(0.95) translate(3px, 10px)' }, bgColor: 'rgba(17,17,17,0.5)' },
  { image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-future-borderless/public', text: "Borderless Business", imgClass: "w-full h-full object-cover", imgStyle: { transform: 'scale(1.15) translate(-1px, -1px)' }, bgColor: 'rgba(17,17,17,0.5)' },
  { image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-future-income-benjamins/public', text: "Sustainable Income Beyond Sales", imgClass: "w-full h-full object-cover", imgStyle: { transform: 'scale(1.35) translateX(5px)' }, bgColor: '#111' },
];

export function BuiltForFuture() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Refs for magnetic effect
  const rawPositionRef = useRef(0);
  const displayPositionRef = useRef(0);
  const lastRawRef = useRef(0);
  const velocityRef = useRef(0);
  const rafRef = useRef<number>(0);
  const isMobileRef = useRef(false);

  const totalCards = FUTURE_POINTS.length;

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if mobile
    const isMobile = window.innerWidth < 768;
    isMobileRef.current = isMobile;

    // Grace period: 10% at start and 10% at end of scroll range
    // Buffer zones: desktop has 10% grace at start/end, mobile has none
    const GRACE = isMobile ? 0 : 0.1;
    const CONTENT_RANGE = 1 - (GRACE * 2);

    // Velocity-based magnetic snap
    // Desktop: strong magnetic effect, Mobile: subtle centering assist
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

      // Mobile: subtle magnetic assist (low intensity, helps center cards when stopped)
      // Desktop: strong magnetic snap effect
      if (isMobileRef.current) {
        // Mobile: much weaker magnetic effect - mostly follows scroll with gentle centering
        // velocityFactor: 0 = stopped (apply centering), 1 = scrolling (follow raw)
        const velocityFactor = Math.min(1, velocityRef.current * 80); // Higher multiplier = less magnetic pull

        // Only apply subtle centering when nearly stopped (velocityFactor < 0.3)
        // Blend: 85% raw position + 15% snap target when stopped
        const magneticStrength = Math.max(0, 0.15 * (1 - velocityFactor * 3));
        const targetPosition = raw * (1 - magneticStrength) + clampedTarget * magneticStrength;

        // Very gentle interpolation for mobile
        const newPosition = currentDisplay + (targetPosition - currentDisplay) * 0.12;

        if (Math.abs(newPosition - currentDisplay) > 0.001) {
          displayPositionRef.current = newPosition;
          setScrollPosition(newPosition);
        }
        rafRef.current = requestAnimationFrame(animateMagnetic);
        return;
      }

      // Desktop: strong magnetic snap effect
      // When velocity is high, follow raw position
      // When velocity is low, snap to nearest card
      // velocityRef.current typically ranges from 0 (stopped) to ~0.1 (fast scroll)
      const velocityFactor = Math.min(1, velocityRef.current * 50); // 0 = stopped, 1 = scrolling fast

      // Blend between snap target (when stopped) and raw position (when scrolling)
      const targetPosition = clampedTarget * (1 - velocityFactor) + raw * velocityFactor;

      // Smooth interpolation toward target
      const newPosition = currentDisplay + (targetPosition - currentDisplay) * 0.15;

      // Always update to keep smooth animation
      if (Math.abs(newPosition - currentDisplay) > 0.001) {
        displayPositionRef.current = newPosition;
        setScrollPosition(newPosition);
      }

      rafRef.current = requestAnimationFrame(animateMagnetic);
    };

    rafRef.current = requestAnimationFrame(animateMagnetic);

    // Pin trigger: 65% on mobile (lower on screen), 55% on desktop
    const pinStart = isMobile ? 'center 65%' : 'center 55%';

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: pinStart,
        end: '+=300%',
        pin: triggerRef.current,
        pinSpacing: true,
        scrub: 0.5,
        onUpdate: (self: ScrollTrigger) => {
          // Map scroll progress to card positions with grace periods
          // On mobile, cards move 2x faster relative to scroll
          const mobileMultiplier = isMobileRef.current ? 2 : 1;
          let cardPosition = 0;

          if (self.progress <= GRACE) {
            cardPosition = 0;
          } else if (self.progress >= 1 - GRACE) {
            cardPosition = totalCards - 1;
          } else {
            const contentProgress = (self.progress - GRACE) / CONTENT_RANGE;
            // Apply mobile multiplier (2x speed on mobile) and clamp to valid range
            cardPosition = Math.min(contentProgress * mobileMultiplier, 1) * (totalCards - 1);
          }

          // Update raw position - magnetic loop will interpolate
          rawPositionRef.current = cardPosition;
        },
      });

      // Subtle Y drift animation
      gsap.to(contentRef.current, {
        y: -60,
        ease: 'none',
          scrollTrigger: {
            trigger: triggerRef.current,
            start: pinStart,
            end: '+=300%',
            scrub: 2.5,
          }
        });
    }, sectionRef);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ctx.revert();
    };
  }, [totalCards]);

  // Progress for the progress bar
  const progress = scrollPosition / (totalCards - 1);

  // Responsive card width
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Card dimensions - responsive
  const CARD_WIDTH = isMobile ? 280 : 560;
  const CARD_GAP = isMobile ? 16 : 24;

  return (
    <section ref={sectionRef} className="relative pt-16 md:pt-24">
      {/* Fixed background animation - outside pinned content */}
      <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
        <GrayscaleDataStream />
      </div>

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
        {/* Content - animates upward (desktop only) */}
        <div
          ref={contentRef}
          className="relative"
          style={{
            transform: 'translateY(30px)', // Start 30px below center
          }}
        >
          {/* Section Header */}
          <div className="text-center mb-4 px-6">
            <H2 style={{ maxWidth: '100%' }}>{FUTURE_HEADLINE}</H2>
          </div>
          <p className="text-body opacity-70 mb-12 text-center max-w-2xl mx-auto px-6">
            {FUTURE_SUBLINE}
          </p>

          {/* Horizontal Scroll Cards Container with Portal Edges - works on both mobile and desktop */}
          <div ref={cardsContainerRef} className="relative">
                {/* 3D Curved Portal Edges - raised bars that cards slide under */}
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

                {/* Inner container - clips cards horizontally at inner edge of bars, but allows vertical overflow for glow */}
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
                        // Offset for looped cards on left (2 cards worth), then center current card
                        // 50vw centers in viewport, subtract half card width, subtract margin, subtract position offset
                        transform: `translateX(calc(50vw - ${CARD_WIDTH / 2}px - 12px - ${(scrollPosition + 2) * (CARD_WIDTH + CARD_GAP)}px))`,
                      }}
                    >
                      {/* Create looped array: last 2 cards + all cards + first 2 cards */}
                      {(() => {
                        const loopedCards = [
                          ...FUTURE_POINTS.slice(-2), // Last 2 cards at start
                          ...FUTURE_POINTS,            // All cards
                          ...FUTURE_POINTS.slice(0, 2) // First 2 cards at end
                        ];

                        return loopedCards.map((point, loopIndex) => {
                          // Calculate the actual card index relative to scroll position
                          // loopIndex 0,1 are the prepended cards (indices -2, -1)
                          // loopIndex 2 to totalCards+1 are the real cards (indices 0 to totalCards-1)
                          // loopIndex totalCards+2 onwards are appended cards
                          const actualIndex = loopIndex - 2;
                          const distance = Math.abs(scrollPosition - actualIndex);
                          const isActive = distance < 0.5;

                          // Scale based on distance from center
                          const scale = Math.max(0.85, 1 - distance * 0.1);

                          // Blur for non-active cards - fast transition, reduced max blur for readability
                          // At distance 0.5+, full blur (5px). At distance 0, no blur.
                          const blurAmount = Math.min(5, distance * 10);

                          // Smart blackout for looped cards based on scroll position
                          // At start (card 0): black out cards to the left (actualIndex < 0)
                          // At end (card 4): black out cards to the right (actualIndex > 4)
                          let blackoutOpacity = 0;
                          if (actualIndex < 0) {
                            // Prepended cards (left side) - fade out as we approach the start
                            // When scrollPosition is 0, fully black. When scrollPosition > 1, visible.
                            blackoutOpacity = Math.max(0, 1 - scrollPosition);
                          } else if (actualIndex > totalCards - 1) {
                            // Appended cards (right side) - fade out as we approach the end
                            // When scrollPosition is 4, fully black. When scrollPosition < 3, visible.
                            blackoutOpacity = Math.max(0, (scrollPosition - (totalCards - 2)) / 1);
                          }

                          // Mystic fog gradient for active card - 90% opacity (10% transparent)
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
                                    backgroundColor: isActive ? 'rgba(20,18,12,0.85)' : point.bgColor,
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
                                    className={point.imgClass}
                                    style={point.imgStyle}
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
