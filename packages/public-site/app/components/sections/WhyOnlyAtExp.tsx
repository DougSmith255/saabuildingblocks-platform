'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { H2 } from '@saa/shared/components/saa';
import { CTAButton } from '@saa/shared/components/saa';

/**
 * "Why This Only Works at eXp Realty" Section
 * Deck Stack with Auto-Rotation + Circuit Board Background
 */

// Content
const HEADLINE = "Why This Only Works at eXp Realty";
const STEPS = [
  { num: 1, label: "Traditional", title: "Centralized Support", desc: "Most brokerages provide tools, training, and support centrally.", dim: true },
  { num: 2, label: "Limited Sponsors", title: "Restricted Offerings", desc: "Sponsors can only offer what the brokerage provides.", dim: true },
  { num: 3, label: "eXp Model", title: "Entrepreneurial Freedom", desc: "eXp allows sponsors to build and deliver their own systems.", highlight: true },
  { num: 4, label: "SAA Choice", title: "We Invested In You", desc: "Smart Agent Alliance chose to build real infrastructure.", highlight: true },
];
const DIFFERENTIATOR = "eXp Realty is different.";
const KEY_POINT = "eXp is the only brokerage that allows sponsors to operate entrepreneurially — to build, fund, and deliver additional systems directly to agents.";
const TAGLINE = "When you succeed, we succeed.";
const CTA_TEXT = "See Our Systems";

// Brand colors
const BRAND_YELLOW = '#ffd700';

// Images
const ENTREPRENEURIAL_SPONSOR_IMAGE = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/exp-entrepreneurial-sponsor-v2/desktop';
const ENTREPRENEURIAL_SPONSOR_ALT = 'eXp Realty sponsor delivering entrepreneurial systems to real estate agents';
const ENTREPRENEURIAL_SPONSOR_TITLE = 'eXp Realty Entrepreneurial Sponsor Systems';

// 3D Number Component
function Number3D({ num, size = 'medium', dark = false }: { num: number; size?: 'small' | 'medium' | 'large'; dark?: boolean }) {
  const sizeStyles = {
    small: { minWidth: '40px', height: '40px', fontSize: '24px' },
    medium: { minWidth: '56px', height: '56px', fontSize: '32px' },
    large: { minWidth: '72px', height: '72px', fontSize: '42px' },
  };

  const style = sizeStyles[size];

  return (
    <span
      className="inline-flex items-center justify-center font-bold"
      style={{
        ...style,
        color: dark ? '#111' : '#c4a94d',
        filter: dark
          ? 'none'
          : 'drop-shadow(-1px -1px 0 #ffe680) drop-shadow(1px 1px 0 #8a7a3d) drop-shadow(3px 3px 0 #2a2a1d) drop-shadow(4px 4px 2px rgba(0, 0, 0, 0.5))',
        transform: dark ? 'none' : 'perspective(500px) rotateX(8deg)',
      }}
    >
      {num}
    </span>
  );
}

// Circuit Board Background
function CircuitBoardBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ opacity: 0.6 }}>
      <svg
        viewBox="0 0 400 500"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="circuit-glow-why" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="pulse-glow-why" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Circuit traces */}
        <g className="circuit-traces" stroke="rgba(212, 175, 55, 0.25)" strokeWidth="1.5" fill="none">
          <path d="M200 0 L200 100 L150 150 L150 250 L200 300 L200 500" />
          <path d="M200 100 L100 100 L100 200 L50 250 L50 350" />
          <path d="M100 200 L60 200 L60 280" />
          <path d="M150 250 L80 250 L80 380 L120 420" />
          <path d="M200 100 L300 100 L300 180 L350 230 L350 350" />
          <path d="M300 180 L340 180 L340 300" />
          <path d="M200 300 L280 300 L280 400 L320 450" />
          <path d="M50 350 L150 350 L200 400 L350 400" />
          <path d="M80 450 L200 450 L280 450" />
        </g>

        {/* Traveling pulses */}
        <g filter="url(#pulse-glow-why)">
          <circle r="3" fill="#FFD700" opacity="0.9">
            <animateMotion dur="4s" repeatCount="indefinite" path="M200 0 L200 100 L150 150 L150 250 L200 300 L200 500" />
          </circle>
          <circle r="2.5" fill="#FFD700" opacity="0.9">
            <animateMotion dur="5s" repeatCount="indefinite" path="M200 100 L100 100 L100 200 L50 250 L50 350" begin="0.5s" />
          </circle>
          <circle r="2.5" fill="#FFD700" opacity="0.9">
            <animateMotion dur="5s" repeatCount="indefinite" path="M200 100 L300 100 L300 180 L350 230 L350 350" begin="1s" />
          </circle>
          <circle r="2" fill="#FFD700" opacity="0.9">
            <animateMotion dur="6s" repeatCount="indefinite" path="M50 350 L150 350 L200 400 L350 400" begin="2s" />
          </circle>
          <circle r="2" fill="#FFD700" opacity="0.9">
            <animateMotion dur="4s" repeatCount="indefinite" path="M150 250 L80 250 L80 380 L120 420" begin="1.5s" />
          </circle>
          <circle r="2" fill="#FFD700" opacity="0.9">
            <animateMotion dur="4s" repeatCount="indefinite" path="M200 300 L280 300 L280 400 L320 450" begin="3s" />
          </circle>
        </g>
      </svg>
    </div>
  );
}

export function WhyOnlyAtExp() {
  const [activeCard, setActiveCard] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hasStartedRef = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);

  const startTimer = useCallback(() => {
    if (userInteracted) return; // Stop auto-advance after user clicks
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveCard(prev => (prev + 1) % 4);
    }, 5000);
  }, [userInteracted]);

  // Only start timer when section becomes visible
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStartedRef.current) {
          hasStartedRef.current = true;
          setIsVisible(true);
          startTimer();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(section);
    return () => {
      observer.disconnect();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const handleCardClick = () => {
    setUserInteracted(true); // Permanently disable auto-advance
    if (timerRef.current) clearInterval(timerRef.current);
    setActiveCard(prev => (prev + 1) % 4);
  };

  const handleDotClick = (index: number) => {
    setUserInteracted(true); // Permanently disable auto-advance
    if (timerRef.current) clearInterval(timerRef.current);
    setActiveCard(index);
  };

  return (
    <section ref={sectionRef} className="py-16 md:py-24 px-6 relative">
      {/* Corner fill gradients - fills the rounded corners where glass doesn't cover */}
      <div className="absolute top-0 left-0 w-24 h-24 pointer-events-none" style={{ background: 'radial-gradient(circle at top left, #080808 0%, transparent 70%)' }} />
      <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none" style={{ background: 'radial-gradient(circle at top right, #080808 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 left-0 w-24 h-24 pointer-events-none" style={{ background: 'radial-gradient(circle at bottom left, #080808 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none" style={{ background: 'radial-gradient(circle at bottom right, #080808 0%, transparent 70%)' }} />

      {/* Glass shimmer animation */}
      <style>{`
        @keyframes glassShimmerWhy {
          0% { background-position: 300% 0; }
          100% { background-position: -300% 0; }
        }
        .glass-shimmer-why {
          animation: glassShimmerWhy 20s ease-in-out infinite;
        }
      `}</style>
      {/* 3D Glass Plate Background - lighter variant */}
      <div
        className="absolute inset-x-0 inset-y-0 pointer-events-none rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.12) 50%, rgba(0,0,0,0.08) 100%)',
          borderTop: '1px solid rgba(255,255,255,0.15)',
          borderBottom: '2px solid rgba(0,0,0,0.6)',
          boxShadow: `
            inset 0 1px 0 rgba(255,255,255,0.12),
            inset 0 2px 4px rgba(255,255,255,0.05),
            inset 0 -2px 0 rgba(0,0,0,0.4),
            inset 0 -4px 8px rgba(0,0,0,0.2),
            0 4px 12px rgba(0,0,0,0.3)
          `,
          backdropFilter: 'blur(2px)',
        }}
      >
        {/* Animated shimmer wave - wide gentle gradient */}
        <div
          className="absolute inset-0 glass-shimmer-why"
          style={{
            background: 'linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.01) 20%, rgba(255,255,255,0.025) 35%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.025) 65%, rgba(255,255,255,0.01) 80%, transparent 100%)',
            backgroundSize: '300% 100%',
          }}
        />
        {/* Noise texture overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            opacity: 0.03,
            mixBlendMode: 'overlay',
          }}
        />
      </div>
      <div className="mx-auto" style={{ maxWidth: '1300px' }}>
        <div
          className="text-center relative z-20 transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          }}
        >
          <H2>{HEADLINE}</H2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Deck of cards */}
          <div
            className="relative h-[340px] transition-all duration-700"
            style={{
              perspective: '1000px',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(-40px)',
              transitionDelay: '0.15s',
            }}
          >
            {STEPS.map((step, i) => {
              const isActive = i === activeCard;
              const isPast = i < activeCard;

              let translateY = 0;
              let translateX = 0;
              let rotation = 0;
              let scale = 1;
              let opacity = 1;
              let zIndex = 10;

              if (isActive) {
                translateY = 0;
                rotation = 0;
                scale = 1;
                opacity = 1;
                zIndex = 10;
              } else if (isPast) {
                translateY = (activeCard - i) * -15;
                translateX = (activeCard - i) * -20;
                rotation = (activeCard - i) * -5;
                scale = 1 - (activeCard - i) * 0.05;
                opacity = 0.3;
                zIndex = 10 - (activeCard - i);
              } else {
                translateY = (i - activeCard) * 6;
                rotation = 0;
                scale = 1 - (i - activeCard) * 0.02;
                opacity = 1 - (i - activeCard) * 0.2;
                zIndex = 10 - (i - activeCard);
              }

              return (
                <div
                  key={i}
                  className="absolute inset-0 rounded-2xl p-6 border-2 cursor-pointer transition-all duration-500"
                  style={{
                    backgroundColor: step.highlight ? 'rgba(40, 35, 10, 0.98)' : 'rgba(25, 25, 25, 0.98)',
                    borderColor: step.highlight ? 'rgba(255, 215, 0, 0.5)' : 'rgba(255,255,255,0.15)',
                    transform: `translateY(${translateY}px) translateX(${translateX}px) rotate(${rotation}deg) scale(${scale})`,
                    opacity,
                    zIndex,
                    boxShadow: isActive
                      ? (step.highlight ? '0 10px 40px rgba(255, 215, 0, 0.2)' : '0 10px 40px rgba(0,0,0,0.5)')
                      : '0 5px 20px rgba(0,0,0,0.3)',
                  }}
                  onClick={handleCardClick}
                >
                  <div className="flex items-center gap-5 mb-5">
                    {step.highlight ? (
                      <div
                        className="rounded-full flex items-center justify-center"
                        style={{ backgroundColor: BRAND_YELLOW, width: '56px', height: '56px' }}
                      >
                        <Number3D num={step.num} size="medium" dark />
                      </div>
                    ) : (
                      <div className="rounded-full flex items-center justify-center bg-white/10 border-2 border-white/20" style={{ width: '56px', height: '56px' }}>
                        <Number3D num={step.num} size="medium" />
                      </div>
                    )}
                    <div>
                      <p className="text-body text-xs uppercase tracking-wider opacity-60">{step.label}</p>
                      <p className="font-heading text-xl font-bold" style={step.highlight ? { color: BRAND_YELLOW } : undefined}>{step.title}</p>
                    </div>
                  </div>
                  <p className="text-body text-base opacity-90 leading-relaxed">{step.desc}</p>
                  <p className="text-body text-xs opacity-40 mt-4">Click to advance</p>
                </div>
              );
            })}

            {/* Progress dots */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
              {STEPS.map((step, i) => (
                <button
                  key={i}
                  onClick={() => handleDotClick(i)}
                  className="w-3 h-3 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: i === activeCard
                      ? (step.highlight ? BRAND_YELLOW : 'rgba(255,255,255,0.8)')
                      : 'rgba(255,255,255,0.2)',
                    transform: i === activeCard ? 'scale(1.3)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Key message card with background image + circuit board overlay */}
          <figure
            className="relative rounded-2xl overflow-hidden border border-white/10 transition-all duration-700"
            style={{
              minHeight: '340px',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(40px)',
              transitionDelay: '0.3s',
            }}
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
              <CTAButton href="/exp-realty-sponsor">{CTA_TEXT}</CTAButton>
            </figcaption>

            <meta itemProp="name" content={ENTREPRENEURIAL_SPONSOR_TITLE} />
          </figure>
        </div>
      </div>
    </section>
  );
}
