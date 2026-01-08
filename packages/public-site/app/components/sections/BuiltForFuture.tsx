'use client';

import { useEffect, useRef, useState, useMemo, useLayoutEffect } from 'react';
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
  const [time, setTime] = useState(0);
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
      setTime(timeRef.current);
      scrollSpeedRef.current = Math.max(1, scrollSpeedRef.current * 0.95);
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

  const getChar = (colIndex: number, charIndex: number) => {
    const flipRate = 0.6 + (colIndex % 3) * 0.3;
    const charSeed = Math.floor(time * 15 * flipRate + colIndex * 7 + charIndex * 13);
    return charSeed % 2 === 0 ? '0' : '1';
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {columnConfigs.map((col, i) => {
        const columnOffset = (time * col.speed * 60 + col.offset) % 110;
        const numChars = 22;
        return (
          <div key={i} className="absolute" style={{ left: col.x + '%', top: 0, width: columnWidth + '%', height: '100%', overflow: 'hidden', fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.4' }}>
            {[...Array(numChars)].map((_, j) => {
              const baseY = j * 5;
              const charY = (baseY + columnOffset) % 110 - 10;
              const headPosition = (columnOffset / 5) % numChars;
              const distanceFromHead = (j - headPosition + numChars) % numChars;
              const isHead = distanceFromHead === 0;
              const trailBrightness = isHead ? 1 : Math.max(0, 1 - distanceFromHead * 0.08);
              const edgeFade = charY < 12 ? Math.max(0, charY / 12) : charY > 88 ? Math.max(0, (100 - charY) / 12) : 1;
              const headColor = 'rgba(180,180,180,' + (0.4 * edgeFade) + ')';
              const trailColor = 'rgba(120,120,120,' + (trailBrightness * 0.25 * edgeFade) + ')';
              return (
                <div key={j} style={{ position: 'absolute', top: charY + '%', color: isHead ? headColor : trailColor, textShadow: isHead ? '0 0 6px rgba(150,150,150,' + (0.3 * edgeFade) + ')' : '0 0 2px rgba(100,100,100,' + (0.1 * edgeFade) + ')', opacity: edgeFade }}>
                  {getChar(i, j)}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

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

  const totalCards = FUTURE_POINTS.length;

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const isMobileView = window.innerWidth < 768;

    // Grace period: 10% at start and 10% at end of scroll range
    const GRACE = 0.1;
    const CONTENT_RANGE = 1 - (GRACE * 2); // 80% of scroll for actual card movement

    // Velocity-based magnetic snap
    // When velocity is high (scrolling): follow raw position closely
    // When velocity is low (stopped): snap strongly to nearest card
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

    const ctx = gsap.context(() => {
      // On mobile: trigger based on cards container, shorter scroll distance
      // On desktop: trigger based on section wrapper
      ScrollTrigger.create({
        trigger: isMobileView ? cardsContainerRef.current : triggerRef.current,
        start: 'center center',
        end: isMobileView ? '+=200%' : '+=300%', // Shorter scroll distance on mobile
        pin: triggerRef.current,
        pinSpacing: true,
        scrub: isMobileView ? 0.3 : 0.5, // Faster response on mobile
        onUpdate: (self) => {
          // Map scroll progress to card positions with grace periods
          let cardPosition = 0;

          if (self.progress <= GRACE) {
            cardPosition = 0;
          } else if (self.progress >= 1 - GRACE) {
            cardPosition = totalCards - 1;
          } else {
            const contentProgress = (self.progress - GRACE) / CONTENT_RANGE;
            cardPosition = contentProgress * (totalCards - 1);
          }

          // Update raw position - magnetic loop will interpolate
          rawPositionRef.current = cardPosition;
        },
      });

      // Subtle Y drift animation (desktop only)
      if (!isMobileView) {
        gsap.to(contentRef.current, {
          y: -60,
          ease: 'none',
          scrollTrigger: {
            trigger: triggerRef.current,
            start: 'center center',
            end: '+=300%',
            scrub: 2.5,
          }
        });
      }
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
      <div ref={triggerRef} className="relative" style={{ zIndex: 1 }}>
        {/* Content - animates upward (desktop only) */}
        <div
          ref={contentRef}
          className="relative"
          style={{
            transform: isMobile ? 'none' : 'translateY(30px)', // Start 30px below center on desktop
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
                                transform: `scale(${scale})`,
                                filter: `blur(${blurAmount + blackoutOpacity * 4}px) grayscale(${blackoutOpacity * 100}%) brightness(${1 - blackoutOpacity * 0.6})`,
                                opacity: 1 - blackoutOpacity * 0.4,
                                transition: 'transform 0.1s ease-out, filter 0.15s ease-out, opacity 0.15s ease-out',
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
