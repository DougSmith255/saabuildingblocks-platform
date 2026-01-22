'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { H2 } from '@saa/shared/components/saa';

const BRAND_YELLOW = '#ffd700';

/**
 * "Built for Where Real Estate Is Going" Section
 * Horizontal Scroll Cards with Auto-Scroll Animation
 *
 * Behavior:
 * - Cards auto-scroll every 2 seconds in a loop
 * - Clicking a card stops auto-scroll and switches to manual mode
 * - In manual mode, clicking advances to the next card
 */

function GrayscaleDataStream() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const timeRef = useRef(0);
  const rafRef = useRef<number>(0);

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

    const animate = (timestamp: number) => {
      const deltaTime = lastTimestamp ? timestamp - lastTimestamp : 16;
      lastTimestamp = timestamp;
      timeRef.current += BASE_SPEED * deltaTime;

      // Update CSS custom property directly on container - no React re-render
      if (containerRef.current) {
        containerRef.current.style.setProperty('--stream-time', String(timeRef.current));
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(rafRef.current);
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
  const totalCards = FUTURE_POINTS.length;
  const [currentCard, setCurrentCard] = useState(0);
  const [isAutoMode, setIsAutoMode] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Responsive card width
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-scroll timer
  useEffect(() => {
    if (!isAutoMode) return;

    timerRef.current = setInterval(() => {
      setCurrentCard(prev => (prev + 1) % totalCards);
    }, 2000); // 2 seconds

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoMode, totalCards]);

  // Handle card click
  const handleCardClick = useCallback(() => {
    if (isAutoMode) {
      // First click: stop auto mode
      setIsAutoMode(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
    // Advance to next card
    setCurrentCard(prev => (prev + 1) % totalCards);
  }, [isAutoMode, totalCards]);

  // Card dimensions - responsive
  const CARD_WIDTH = isMobile ? 280 : 560;
  const CARD_GAP = isMobile ? 16 : 24;

  // Progress for the progress bar
  const progress = currentCard / (totalCards - 1);

  return (
    <section className="relative pt-[calc(6rem+25px)] pb-24">
      {/* Fixed background animation */}
      <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
        <GrayscaleDataStream />
      </div>

      {/* Content */}
      <div className="relative" style={{ zIndex: 1 }}>
        {/* Section Header */}
        <div className="text-center mb-4 px-6">
          <H2 style={{ maxWidth: '100%' }}>{FUTURE_HEADLINE}</H2>
        </div>
        <p className="text-body opacity-70 mb-12 text-center max-w-2xl mx-auto px-6">
          {FUTURE_SUBLINE}
        </p>

        {/* Horizontal Scroll Cards Container with Portal Edges */}
        <div className="relative cursor-pointer" onClick={handleCardClick}>
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
                className="flex transition-transform duration-500 ease-out"
                style={{
                  gap: `${CARD_GAP}px`,
                  // Center current card in viewport
                  transform: `translateX(calc(50vw - ${CARD_WIDTH / 2}px - 12px - ${currentCard * (CARD_WIDTH + CARD_GAP)}px))`,
                }}
              >
                {FUTURE_POINTS.map((point, index) => {
                  const distance = Math.abs(currentCard - index);
                  const isActive = index === currentCard;

                  // Scale based on distance from center
                  const scale = Math.max(0.85, 1 - distance * 0.1);

                  // Blur for non-active cards
                  const blurAmount = Math.min(5, distance * 10);

                  // Mystic fog gradient for active card
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
                      key={index}
                      className="flex-shrink-0 transition-all duration-500"
                      style={{
                        width: `${CARD_WIDTH}px`,
                        transform: `scale(${scale})`,
                        filter: `blur(${blurAmount}px)`,
                      }}
                    >
                      <div
                        className={`rounded-2xl flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 ${isMobile ? 'p-8 min-h-[380px]' : 'p-8 min-h-[380px]'}`}
                        style={{
                          background: isActive ? activeBackground : inactiveBackground,
                          border: isActive ? '2px solid rgba(180,150,50,0.5)' : `2px solid ${BRAND_YELLOW}22`,
                          boxShadow: isActive
                            ? `0 0 40px 8px rgba(255,200,80,0.4), 0 0 80px 16px rgba(255,180,50,0.25)`
                            : 'none',
                        }}
                      >
                        {/* Circled Image */}
                        <div
                          className={`rounded-full flex items-center justify-center overflow-hidden relative z-10 transition-all duration-300 ${isMobile ? 'w-[180px] h-[180px] mb-6' : 'w-[200px] h-[200px] mb-6'}`}
                          style={{
                            backgroundColor: isActive ? 'rgba(20,18,12,0.85)' : point.bgColor,
                            border: isActive ? '3px solid rgba(40,35,20,0.8)' : `3px solid ${BRAND_YELLOW}`,
                            boxShadow: isActive
                              ? `0 0 30px rgba(0,0,0,0.3), inset 0 0 20px rgba(0,0,0,0.2)`
                              : 'none',
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
                          className="text-h5 font-bold text-center relative z-10 transition-colors duration-300"
                          style={{
                            color: isActive ? '#2a2a2a' : '#e5e4dd',
                          }}
                        >
                          {point.text}
                        </h3>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Click hint */}
        <p className="text-center text-sm text-white/50 mt-2">
          {isAutoMode ? 'Click to control manually' : 'Click to advance'}
        </p>

        {/* 3D Plasma Tube Progress Bar */}
        <div className="flex justify-center mt-6 mb-6 px-6">
          <div
            className="w-80 h-3 rounded-full overflow-hidden relative"
            style={{
              background: 'linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)',
              border: '1px solid rgba(245, 245, 240, 0.25)',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6), inset 0 -1px 2px rgba(255,255,255,0.05)',
            }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress * 100}%`,
                background: `linear-gradient(180deg, #ffe566 0%, ${BRAND_YELLOW} 40%, #cc9900 100%)`,
                boxShadow: `0 0 8px ${BRAND_YELLOW}, 0 0 16px ${BRAND_YELLOW}, 0 0 32px ${BRAND_YELLOW}66, inset 0 1px 2px rgba(255,255,255,0.4)`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
