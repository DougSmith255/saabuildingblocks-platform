'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { H2 } from '@saa/shared/components/saa';
import { CTAButton } from '@saa/shared/components/saa';

/**
 * "Why This Only Works at eXp Realty" Section
 * 3D Rotating Card Stack with Auto-Flip Animation
 *
 * Behavior:
 * - Cards auto-flip every 2.5 seconds in a loop
 * - Clicking a card stops auto-flip and switches to manual mode
 * - In manual mode, clicking advances to the next card
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
  const totalCards = STEPS.length;
  const [currentCard, setCurrentCard] = useState(0);
  const [isAutoMode, setIsAutoMode] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-flip timer
  useEffect(() => {
    if (!isAutoMode) return;

    timerRef.current = setInterval(() => {
      setCurrentCard(prev => (prev + 1) % totalCards);
    }, 5000); // 5 seconds

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

  // Calculate progress (0 to 1)
  const progress = currentCard / (totalCards - 1);

  return (
    <section>
      {/* Glass panel + content */}
      <div
        className="rounded-3xl overflow-hidden relative"
        style={GLASS_STYLES}
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

            <div className="grid min-[1020px]:grid-cols-2 gap-8 items-start">
              {/* Left Column: Card Stack + Progress Bar */}
              <div className="flex flex-col relative" style={{ zIndex: 10 }}>
                {/* 3D Rotating Card Stack */}
                <div
                  className="relative w-full cursor-pointer"
                  onClick={handleCardClick}
                  style={{
                    perspective: '1200px',
                    height: '340px',
                  }}
                >
                  {STEPS.map((step, index) => {
                    const isLastCard = index === totalCards - 1;
                    // Calculate position relative to current card
                    const relativePosition = currentCard - index;

                    let rotateX = 0, translateZ = 0, translateY = 0, opacity = 1, scale = 1;

                    if (index === currentCard) {
                      // Current card: front and center
                      rotateX = 0;
                      opacity = 1;
                      scale = 1;
                      translateZ = 0;
                      translateY = 0;
                    } else if (index < currentCard) {
                      // Cards that have flipped (above current)
                      rotateX = -90;
                      opacity = 0;
                      scale = 0.9;
                    } else {
                      // Cards in the stack (below current)
                      const stackPosition = index - currentCard;
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
                          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
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

                {/* 3D Plasma Tube Progress Bar - moved up 12px */}
                <div className="flex justify-center mt-5">
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

                {/* Click hint - below progress bar, larger and bold */}
                <p className="text-center text-base font-bold text-white/60 mt-3">
                  Click to control manually
                </p>
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
    </section>
  );
}
