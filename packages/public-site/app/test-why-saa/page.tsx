'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { H2 } from '@saa/shared/components/saa';
import { CTAButton } from '@saa/shared/components/saa';

/**
 * Test page for "Why This Only Works at eXp Realty" section
 * 2 refined versions with creative animations
 */

// Shared content
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
const DOUG_KARRIE_IMAGE = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/doug-and-karrie-co-founders/desktop';
const ALIGNED_INCENTIVES_IMAGE = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-aligned-incentives-value-multiplication/public';
const ENTREPRENEURIAL_SPONSOR_IMAGE = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/exp-realty-sponsor-systems-dark/desktop';

// Image SEO metadata
const ENTREPRENEURIAL_SPONSOR_ALT = 'eXp Realty sponsor delivering entrepreneurial systems to real estate agents';
const ENTREPRENEURIAL_SPONSOR_TITLE = 'eXp Realty Entrepreneurial Sponsor Systems';

// 3D Number Component - LARGER and more impactful
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

// ============================================================================
// VERSION 1: DECK STACK WITH AUTO-ROTATION
// Cards stacked that auto-rotate and click advances to next
// ============================================================================
function Version1() {
  const [activeCard, setActiveCard] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-rotate every 5 seconds
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveCard(prev => (prev + 1) % 4);
    }, 5000);
  }, []);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  // Click advances to next card and resets timer
  const handleCardClick = () => {
    setActiveCard(prev => (prev + 1) % 4);
    startTimer(); // Reset timer on click
  };

  const handleDotClick = (index: number) => {
    setActiveCard(index);
    startTimer(); // Reset timer on dot click
  };

  return (
    <section className="py-16 md:py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: '1100px' }}>
        <div className="text-center mb-10">
          <H2>{HEADLINE}</H2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Deck of cards - MORE OPAQUE */}
          <div className="relative h-[340px]" style={{ perspective: '1000px' }}>
            {STEPS.map((step, i) => {
              const isActive = i === activeCard;
              const isPast = i < activeCard;
              const isFuture = i > activeCard;

              // Stack positioning
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
                // Past cards fan out to the left
                translateY = (activeCard - i) * -15;
                translateX = (activeCard - i) * -20;
                rotation = (activeCard - i) * -5;
                scale = 1 - (activeCard - i) * 0.05;
                opacity = 0.3;
                zIndex = 10 - (activeCard - i);
              } else {
                // Future cards stacked behind
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
                    // MUCH MORE OPAQUE backgrounds
                    backgroundColor: step.highlight
                      ? 'rgba(40, 35, 10, 0.98)'
                      : 'rgba(25, 25, 25, 0.98)',
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
                    {/* 3D Numbers for ALL cards */}
                    {step.highlight ? (
                      <div
                        className="rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: BRAND_YELLOW,
                          width: '56px',
                          height: '56px',
                        }}
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

                  {/* Click hint */}
                  <p className="text-body text-xs opacity-40 mt-4">Click to advance →</p>
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

          {/* Key message card WITH BACKGROUND IMAGE + CIRCUIT BOARD OVERLAY */}
          <figure
            className="relative rounded-2xl overflow-hidden border border-white/10"
            style={{ minHeight: '340px' }}
            itemScope
            itemType="https://schema.org/ImageObject"
          >
            {/* Background image with SEO attributes */}
            <div className="absolute inset-0">
              <img
                src={ENTREPRENEURIAL_SPONSOR_IMAGE}
                alt={ENTREPRENEURIAL_SPONSOR_ALT}
                title={ENTREPRENEURIAL_SPONSOR_TITLE}
                className="w-full h-full object-cover"
                itemProp="contentUrl"
                loading="eager"
              />
              {/* Radial gradient - darkest in center where text is, fades to transparent at edges */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.1) 100%)'
                }}
              />
            </div>

            {/* Circuit board animation overlay */}
            <CircuitBoardBackground />

            {/* Content over image */}
            <figcaption className="relative z-10 p-6 md:p-8 h-full flex flex-col justify-center">
              <p className="font-heading text-2xl md:text-3xl font-bold mb-4" style={{ color: BRAND_YELLOW }}>{DIFFERENTIATOR}</p>
              <p className="text-body text-lg leading-relaxed mb-4" itemProp="description">{KEY_POINT}</p>
              <p className="text-body text-xl italic mb-6" style={{ color: BRAND_YELLOW }}>{TAGLINE}</p>
              <CTAButton href="/exp-realty-sponsor">{CTA_TEXT}</CTAButton>
            </figcaption>

            {/* Hidden SEO metadata */}
            <meta itemProp="name" content={ENTREPRENEURIAL_SPONSOR_TITLE} />
          </figure>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// VERSION 2: TABBED INTERFACE WITH PROGRESS (FIXED TIMER RESET)
// Tabs to switch views + progress indicator - timer resets on click
// ============================================================================
function Version2() {
  const [activeTab, setActiveTab] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start/restart the auto-advance timer
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveTab(prev => (prev + 1) % 4);
    }, 5000);
  }, []);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const handleTabChange = (index: number) => {
    if (index === activeTab) return;
    setIsAnimating(true);
    startTimer(); // RESET TIMER on tab click
    setTimeout(() => {
      setActiveTab(index);
      setIsAnimating(false);
    }, 150);
  };

  const step = STEPS[activeTab];

  return (
    <section className="py-16 md:py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: '1000px' }}>
        <div className="text-center mb-8">
          <H2>{HEADLINE}</H2>
        </div>

        {/* Tab buttons - MORE IMPACTFUL */}
        <div className="flex justify-center gap-3 mb-6">
          {STEPS.map((s, i) => (
            <button
              key={i}
              onClick={() => handleTabChange(i)}
              className="px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300"
              style={{
                backgroundColor: activeTab === i
                  ? (s.highlight ? BRAND_YELLOW : 'rgba(255,255,255,0.25)')
                  : 'rgba(255,255,255,0.08)',
                color: activeTab === i && s.highlight ? '#111' : 'inherit',
                border: activeTab === i
                  ? (s.highlight ? `2px solid ${BRAND_YELLOW}` : '2px solid rgba(255,255,255,0.3)')
                  : '2px solid rgba(255,255,255,0.1)',
                transform: activeTab === i ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-white/10 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${((activeTab + 1) / 4) * 100}%`,
              backgroundColor: step.highlight ? BRAND_YELLOW : 'rgba(255,255,255,0.5)',
            }}
          />
        </div>

        {/* Content card - MORE IMPACTFUL with larger 3D numbers */}
        <div className="grid md:grid-cols-5 gap-6">
          <div
            className={`md:col-span-3 rounded-2xl p-8 md:p-10 border-2 transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
            style={{
              backgroundColor: step.highlight ? 'rgba(255, 215, 0, 0.12)' : 'rgba(255,255,255,0.06)',
              borderColor: step.highlight ? 'rgba(255, 215, 0, 0.4)' : 'rgba(255,255,255,0.15)',
            }}
          >
            <div className="flex items-center gap-5 mb-6">
              {/* LARGER 3D Numbers for ALL */}
              {step.highlight ? (
                <div
                  className="rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: BRAND_YELLOW,
                    width: '72px',
                    height: '72px',
                  }}
                >
                  <Number3D num={step.num} size="large" dark />
                </div>
              ) : (
                <div className="rounded-full flex items-center justify-center bg-white/10 border-2 border-white/20" style={{ width: '72px', height: '72px' }}>
                  <Number3D num={step.num} size="large" />
                </div>
              )}
              <div>
                <p className="text-body text-xs uppercase tracking-wider opacity-60">{step.label}</p>
                <p className="font-heading text-2xl font-bold" style={step.highlight ? { color: BRAND_YELLOW } : undefined}>{step.title}</p>
              </div>
            </div>
            <p className="text-body text-xl leading-relaxed">{step.desc}</p>
            {step.highlight && activeTab === 3 && (
              <p className="text-body text-xl italic mt-6" style={{ color: BRAND_YELLOW }}>{TAGLINE}</p>
            )}
          </div>

          {/* Side panel with image/CTA */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex-1 min-h-[180px]">
              <img
                src={DOUG_KARRIE_IMAGE}
                alt="Doug and Karrie"
                className="w-full h-full object-cover object-top"
                style={{
                  maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, transparent 100%)',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-body text-base font-semibold" style={{ color: BRAND_YELLOW }}>Built by agents, for agents</p>
                <p className="text-body text-sm opacity-70 mt-1">{DIFFERENTIATOR}</p>
              </div>
            </div>
            <div className="rounded-2xl border-2 p-5 text-center" style={{ backgroundColor: 'rgba(255, 215, 0, 0.12)', borderColor: 'rgba(255, 215, 0, 0.4)' }}>
              <CTAButton href="/exp-realty-sponsor">{CTA_TEXT}</CTAButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CIRCUIT BOARD ANIMATED BACKGROUND
// PCB-style traces with nodes and traveling pulses
// ============================================================================
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
          {/* Glow filter for nodes */}
          <filter id="circuit-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Stronger glow for active pulses */}
          <filter id="pulse-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Gold gradient for traces */}
          <linearGradient id="trace-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.3"/>
            <stop offset="50%" stopColor="#FFD700" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.3"/>
          </linearGradient>
        </defs>

        {/* Circuit traces - static paths */}
        <g className="circuit-traces" stroke="rgba(212, 175, 55, 0.25)" strokeWidth="1.5" fill="none">
          {/* Main vertical backbone */}
          <path d="M200 0 L200 100 L150 150 L150 250 L200 300 L200 500" className="trace trace-main" />

          {/* Left branch */}
          <path d="M200 100 L100 100 L100 200 L50 250 L50 350" className="trace trace-left-1" />
          <path d="M100 200 L60 200 L60 280" className="trace trace-left-2" />
          <path d="M150 250 L80 250 L80 380 L120 420" className="trace trace-left-3" />

          {/* Right branch */}
          <path d="M200 100 L300 100 L300 180 L350 230 L350 350" className="trace trace-right-1" />
          <path d="M300 180 L340 180 L340 300" className="trace trace-right-2" />
          <path d="M200 300 L280 300 L280 400 L320 450" className="trace trace-right-3" />

          {/* Horizontal connections */}
          <path d="M50 350 L150 350 L200 400 L350 400" className="trace trace-h1" />
          <path d="M80 450 L200 450 L280 450" className="trace trace-h2" />
        </g>

        {/* Traveling pulses - animated circles that move along paths */}
        <g className="pulses" filter="url(#pulse-glow)">
          <circle r="3" className="pulse pulse-1">
            <animateMotion
              dur="4s"
              repeatCount="indefinite"
              path="M200 0 L200 100 L150 150 L150 250 L200 300 L200 500"
            />
          </circle>
          <circle r="2.5" className="pulse pulse-2">
            <animateMotion
              dur="5s"
              repeatCount="indefinite"
              path="M200 100 L100 100 L100 200 L50 250 L50 350"
              begin="0.5s"
            />
          </circle>
          <circle r="2.5" className="pulse pulse-3">
            <animateMotion
              dur="5s"
              repeatCount="indefinite"
              path="M200 100 L300 100 L300 180 L350 230 L350 350"
              begin="1s"
            />
          </circle>
          <circle r="2" className="pulse pulse-4">
            <animateMotion
              dur="6s"
              repeatCount="indefinite"
              path="M50 350 L150 350 L200 400 L350 400"
              begin="2s"
            />
          </circle>
          <circle r="2" className="pulse pulse-5">
            <animateMotion
              dur="4s"
              repeatCount="indefinite"
              path="M150 250 L80 250 L80 380 L120 420"
              begin="1.5s"
            />
          </circle>
          <circle r="2" className="pulse pulse-6">
            <animateMotion
              dur="4s"
              repeatCount="indefinite"
              path="M200 300 L280 300 L280 400 L320 450"
              begin="3s"
            />
          </circle>
        </g>

      </svg>

      <style>{`
        /* Circuit traces */
        .trace {
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        /* Traveling pulses - dots that move along circuit paths */
        .pulse {
          fill: #FFD700;
          opacity: 0.9;
        }
        .pulse-1 { animation: pulse-fade 4s ease-in-out infinite; }
        .pulse-2 { animation: pulse-fade 5s ease-in-out infinite; animation-delay: 0.5s; }
        .pulse-3 { animation: pulse-fade 5s ease-in-out infinite; animation-delay: 1s; }
        .pulse-4 { animation: pulse-fade 6s ease-in-out infinite; animation-delay: 2s; }
        .pulse-5 { animation: pulse-fade 4s ease-in-out infinite; animation-delay: 1.5s; }
        .pulse-6 { animation: pulse-fade 4s ease-in-out infinite; animation-delay: 3s; }

        @keyframes pulse-fade {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// Standalone preview section for circuit board background
function CircuitBoardPreview() {
  return (
    <section className="py-16 md:py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: '1100px' }}>
        <div className="text-center mb-10">
          <H2>Circuit Board Background Preview</H2>
          <p className="text-body text-lg opacity-60 mt-4">
            PCB-style traces with nodes and traveling pulses - gold color scheme
          </p>
        </div>

        {/* Preview container - simulating the right card */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Preview Card 1: Full dark background */}
          <div
            className="relative rounded-2xl overflow-hidden border border-white/10"
            style={{ minHeight: '400px', backgroundColor: 'rgba(10, 10, 10, 0.95)' }}
          >
            <CircuitBoardBackground />

            {/* Content overlay to show how text looks */}
            <div className="relative z-10 p-6 md:p-8 h-full flex flex-col justify-center">
              <p className="font-heading text-2xl md:text-3xl font-bold mb-4" style={{ color: BRAND_YELLOW }}>{DIFFERENTIATOR}</p>
              <p className="text-body text-lg leading-relaxed mb-4">{KEY_POINT}</p>
              <p className="text-body text-xl italic mb-6" style={{ color: BRAND_YELLOW }}>{TAGLINE}</p>
              <CTAButton href="/exp-realty-sponsor">{CTA_TEXT}</CTAButton>
            </div>
          </div>

          {/* Preview Card 2: With original image + circuit overlay */}
          <div
            className="relative rounded-2xl overflow-hidden border border-white/10"
            style={{ minHeight: '400px' }}
          >
            {/* Background image */}
            <div className="absolute inset-0">
              <img
                src={ALIGNED_INCENTIVES_IMAGE}
                alt=""
                className="w-full h-full object-cover"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/75 to-black/65" />
            </div>

            {/* Circuit on top of image */}
            <CircuitBoardBackground />

            {/* Content overlay */}
            <div className="relative z-10 p-6 md:p-8 h-full flex flex-col justify-center">
              <p className="font-heading text-2xl md:text-3xl font-bold mb-4" style={{ color: BRAND_YELLOW }}>{DIFFERENTIATOR}</p>
              <p className="text-body text-lg leading-relaxed mb-4">{KEY_POINT}</p>
              <p className="text-body text-xl italic mb-6" style={{ color: BRAND_YELLOW }}>{TAGLINE}</p>
              <CTAButton href="/exp-realty-sponsor">{CTA_TEXT}</CTAButton>
            </div>
          </div>
        </div>

        {/* Animation explanation */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h4 className="font-heading font-bold mb-3" style={{ color: BRAND_YELLOW }}>Circuit Traces</h4>
            <p className="text-body text-sm opacity-70">
              PCB-style paths connecting nodes, representing the infrastructure and systems SAA has built.
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h4 className="font-heading font-bold mb-3" style={{ color: BRAND_YELLOW }}>Traveling Pulses</h4>
            <p className="text-body text-sm opacity-70">
              Animated dots travel along the circuit paths, representing data and value flowing through the system.
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h4 className="font-heading font-bold mb-3" style={{ color: BRAND_YELLOW }}>Node Highlights</h4>
            <p className="text-body text-sm opacity-70">
              Junction points pulse and glow, representing key touchpoints where sponsors and agents connect.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function TestWhySAAPage() {
  return (
    <main className="min-h-screen bg-[#111111]">
      {/* Navigation */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10 px-6 py-3">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-6 justify-center text-sm">
          <a href="#v1" className="hover:underline font-medium" style={{ color: BRAND_YELLOW }}>V1: Deck Stack</a>
          <a href="#v2" className="hover:underline font-medium" style={{ color: BRAND_YELLOW }}>V2: Tabs + Progress</a>
          <a href="#circuit" className="hover:underline font-medium" style={{ color: BRAND_YELLOW }}>Circuit Board BG</a>
        </div>
      </div>

      {/* V1 */}
      <div id="v1" className="border-b border-white/10">
        <div className="text-center py-6 bg-white/5">
          <h3 className="text-body text-lg font-medium">V1: Deck Stack with Auto-Rotation</h3>
          <p className="text-body text-sm opacity-50">Click cards to advance, auto-rotates every 5 seconds</p>
        </div>
        <Version1 />
      </div>

      {/* V2 */}
      <div id="v2" className="border-b border-white/10">
        <div className="text-center py-6 bg-white/5">
          <h3 className="text-body text-lg font-medium">V2: Tabs + Progress (Timer Resets on Click)</h3>
          <p className="text-body text-sm opacity-50">Click tabs to switch, timer resets on interaction</p>
        </div>
        <Version2 />
      </div>

      {/* Circuit Board Background Preview */}
      <div id="circuit">
        <div className="text-center py-6 bg-white/5">
          <h3 className="text-body text-lg font-medium">Circuit Board Background</h3>
          <p className="text-body text-sm opacity-50">SVG + CSS animation - PCB traces with traveling pulses</p>
        </div>
        <CircuitBoardPreview />
      </div>
    </main>
  );
}
