'use client';

import { useEffect, useRef, useState } from 'react';
import { H2 } from '@saa/shared/components/saa';
import { CTAButton } from '@saa/shared/components/saa';

/**
 * Test page for "Why This Only Works at eXp Realty" section
 * 5 VARIATIONS of Connected Network layout
 */

// Shared content
const HEADLINE = "Why This Only Works at eXp Realty";
const INTRO = "Most real estate brokerages provide tools, training, and support centrally.";
const LIMITATION = "Some allow sponsorship, but sponsors are limited to offering only what the brokerage itself provides.";
const DIFFERENTIATOR = "eXp Realty is different.";
const KEY_POINT = "eXp is the only brokerage that allows sponsors to operate entrepreneurially — to build, fund, and deliver additional systems, training, and support directly to the agents they sponsor.";
const CONTEXT = "While most eXp sponsors choose not to build this kind of infrastructure, the model allows it.";
const SAA_STATEMENT = "Smart Agent Alliance exists because we chose to invest in it.";
const TAGLINE = "When you succeed, we succeed.";
const CTA_TEXT = "See Our Systems";
const DISCLAIMER = "Access to SAA systems, training, and community is tied to sponsorship at the time of joining eXp Realty.";

// Brand yellow color
const BRAND_YELLOW = '#ffd700';

// Images
const ALIGNED_INCENTIVES_IMAGE = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-aligned-incentives-value-multiplication/public';
const DOUG_KARRIE_IMAGE = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/doug-and-karrie-co-founders/desktop';

// Custom hook for intersection observer
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

// 3D Number Component (from Icon3D pattern)
function Number3D({ num, size = 'medium' }: { num: number; size?: 'small' | 'medium' | 'large' }) {
  const sizeClasses = {
    small: 'min-w-[32px] h-[32px] text-xl',
    medium: 'min-w-[40px] h-[40px] text-2xl',
    large: 'min-w-[56px] h-[56px] text-3xl',
  };

  return (
    <span
      className={`number-3d ${sizeClasses[size]}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        color: '#c4a94d',
        filter: `
          drop-shadow(-1px -1px 0 #ffe680)
          drop-shadow(1px 1px 0 #8a7a3d)
          drop-shadow(3px 3px 0 #2a2a1d)
          drop-shadow(4px 4px 2px rgba(0, 0, 0, 0.5))
        `,
        transform: 'perspective(500px) rotateX(8deg)',
        flexShrink: 0,
      }}
    >
      {num}
    </span>
  );
}

// ============================================================================
// VERSION 1: ORIGINAL CONNECTED NETWORK (BASE VERSION)
// The user's favorite - nodes with animated connecting lines
// ============================================================================
function Version1() {
  const { ref, isVisible } = useInView();

  const nodes = [
    { label: "Traditional", desc: "Centralized only" },
    { label: "Limited Sponsors", desc: "Restricted offerings" },
    { label: "eXp Model", desc: "Open architecture", highlight: true },
    { label: "SAA Systems", desc: "Custom built for you", highlight: true },
  ];

  return (
    <section ref={ref} className="py-24 md:py-32 px-6 overflow-hidden">
      <style>{`
        @keyframes drawPath {
          from { stroke-dashoffset: 300; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes nodeGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
          50% { box-shadow: 0 0 40px rgba(255, 215, 0, 0.6); }
        }
        @keyframes pulseNode {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .path-line-v1 { stroke-dasharray: 300; animation: drawPath 1.5s ease-out forwards; }
        .node-glow-v1 { animation: nodeGlow 2s ease-in-out infinite; }
        .node-pulse-v1 { animation: pulseNode 2s ease-in-out infinite; }
      `}</style>
      <div className="mx-auto" style={{ maxWidth: '1300px' }}>
        <div className={`text-center mb-12 md:mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <H2>{HEADLINE}</H2>
        </div>

        {/* Main bento card */}
        <div className="rounded-2xl bg-gradient-to-br from-white/8 to-white/3 border border-white/10 p-8 md:p-12">
          {/* Intro text */}
          <p className="text-body text-lg md:text-xl opacity-70 text-center max-w-3xl mx-auto mb-12">{INTRO}</p>

          {/* Network visualization */}
          <div className="relative py-8">
            {/* SVG connecting lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
              {isVisible && (
                <>
                  <line x1="18%" y1="50%" x2="38%" y2="50%" stroke="rgba(255,255,255,0.2)" strokeWidth="2" className="path-line-v1" style={{ animationDelay: '0.5s' }} />
                  <line x1="38%" y1="50%" x2="62%" y2="50%" stroke={BRAND_YELLOW} strokeWidth="2" className="path-line-v1" style={{ animationDelay: '1s' }} />
                  <line x1="62%" y1="50%" x2="82%" y2="50%" stroke={BRAND_YELLOW} strokeWidth="2" className="path-line-v1" style={{ animationDelay: '1.5s' }} />
                </>
              )}
            </svg>

            {/* Nodes grid */}
            <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {nodes.map((node, i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
                  style={{ transitionDelay: `${400 + i * 300}ms` }}
                >
                  {/* Node circle with 3D number */}
                  <div
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-4 flex items-center justify-center mb-4 ${node.highlight ? 'node-glow-v1 node-pulse-v1' : ''}`}
                    style={{
                      backgroundColor: node.highlight ? BRAND_YELLOW : 'rgba(255,255,255,0.05)',
                      borderColor: node.highlight ? BRAND_YELLOW : 'rgba(255,255,255,0.15)',
                    }}
                  >
                    {node.highlight ? (
                      <span className="text-xl md:text-2xl font-bold" style={{ color: '#111' }}>{i + 1}</span>
                    ) : (
                      <Number3D num={i + 1} />
                    )}
                  </div>

                  {/* Node label */}
                  <p className="text-body text-xs uppercase tracking-wider opacity-50 mb-1">{node.label}</p>
                  <p className="text-body text-sm md:text-base font-medium text-center" style={node.highlight ? { color: BRAND_YELLOW } : undefined}>
                    {node.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="w-24 h-1 rounded-full mx-auto my-8" style={{ backgroundColor: BRAND_YELLOW }} />

          {/* Key message */}
          <p className={`text-body text-lg md:text-xl leading-relaxed text-center max-w-3xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '2000ms' }}>
            {KEY_POINT}
          </p>

          {/* Tagline */}
          <p className={`text-body text-xl md:text-2xl italic text-center mt-8 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ color: BRAND_YELLOW, transitionDelay: '2400ms' }}>
            {TAGLINE}
          </p>
        </div>

        {/* CTA */}
        <div className={`text-center mt-10 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '2700ms' }}>
          <CTAButton href="/exp-realty-sponsor">{CTA_TEXT}</CTAButton>
        </div>

        <div className={`text-center mt-10 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '2900ms' }}>
          <p className="text-body text-sm opacity-40 max-w-xl mx-auto">{DISCLAIMER}</p>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// VERSION 2: NETWORK WITH IMAGE BENTO
// Network nodes with featured image card beside it
// ============================================================================
function Version2() {
  const { ref, isVisible } = useInView();

  const nodes = [
    { label: "Traditional", desc: "Centralized only" },
    { label: "Limited Sponsors", desc: "Restricted offerings" },
    { label: "eXp Model", desc: "Open architecture", highlight: true },
    { label: "SAA Systems", desc: "Custom built for you", highlight: true },
  ];

  return (
    <section ref={ref} className="py-24 md:py-32 px-6 overflow-hidden">
      <style>{`
        @keyframes drawPathV2 {
          from { stroke-dashoffset: 300; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes nodeGlowV2 {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
          50% { box-shadow: 0 0 40px rgba(255, 215, 0, 0.6); }
        }
        .path-line-v2 { stroke-dasharray: 300; animation: drawPathV2 1.5s ease-out forwards; }
        .node-glow-v2 { animation: nodeGlowV2 2s ease-in-out infinite; }
        .bento-image-v2 { transition: transform 0.7s ease; }
        .bento-card-v2:hover .bento-image-v2 { transform: scale(1.05); }
      `}</style>
      <div className="mx-auto" style={{ maxWidth: '1300px' }}>
        <div className={`text-center mb-12 md:mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <H2>{HEADLINE}</H2>
        </div>

        {/* Bento grid layout */}
        <div className="grid md:grid-cols-12 gap-4 md:gap-6">
          {/* Main network card - 8 columns */}
          <div
            className={`bento-card-v2 md:col-span-8 rounded-2xl bg-gradient-to-br from-white/8 to-white/3 border border-white/10 p-8 md:p-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}
            style={{ transitionDelay: '200ms' }}
          >
            <p className="text-body text-lg md:text-xl opacity-70 mb-8">{INTRO}</p>

            {/* Network visualization */}
            <div className="relative py-6">
              {/* SVG connecting lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                {isVisible && (
                  <>
                    <line x1="15%" y1="50%" x2="38%" y2="50%" stroke="rgba(255,255,255,0.2)" strokeWidth="2" className="path-line-v2" style={{ animationDelay: '0.5s' }} />
                    <line x1="38%" y1="50%" x2="62%" y2="50%" stroke={BRAND_YELLOW} strokeWidth="2" className="path-line-v2" style={{ animationDelay: '1s' }} />
                    <line x1="62%" y1="50%" x2="85%" y2="50%" stroke={BRAND_YELLOW} strokeWidth="2" className="path-line-v2" style={{ animationDelay: '1.5s' }} />
                  </>
                )}
              </svg>

              {/* Nodes grid */}
              <div className="relative grid grid-cols-4 gap-4">
                {nodes.map((node, i) => (
                  <div
                    key={i}
                    className={`flex flex-col items-center transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
                    style={{ transitionDelay: `${400 + i * 250}ms` }}
                  >
                    <div
                      className={`w-12 h-12 md:w-16 md:h-16 rounded-full border-3 flex items-center justify-center mb-3 ${node.highlight ? 'node-glow-v2' : ''}`}
                      style={{
                        backgroundColor: node.highlight ? BRAND_YELLOW : 'rgba(255,255,255,0.05)',
                        borderColor: node.highlight ? BRAND_YELLOW : 'rgba(255,255,255,0.15)',
                        borderWidth: '3px',
                      }}
                    >
                      {node.highlight ? (
                        <span className="text-lg md:text-xl font-bold" style={{ color: '#111' }}>{i + 1}</span>
                      ) : (
                        <Number3D num={i + 1} size="small" />
                      )}
                    </div>
                    <p className="text-body text-[10px] md:text-xs uppercase tracking-wider opacity-50 mb-0.5">{node.label}</p>
                    <p className="text-body text-xs md:text-sm font-medium text-center" style={node.highlight ? { color: BRAND_YELLOW } : undefined}>
                      {node.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-16 h-1 rounded-full my-6" style={{ backgroundColor: BRAND_YELLOW }} />

            <p className={`text-body text-base md:text-lg leading-relaxed transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '1800ms' }}>
              {KEY_POINT}
            </p>
          </div>

          {/* Right column - 4 columns */}
          <div className="md:col-span-4 flex flex-col gap-4 md:gap-6">
            {/* Image card */}
            <div
              className={`bento-card-v2 relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex-1 min-h-[200px] transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
              style={{ transitionDelay: '400ms' }}
            >
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={ALIGNED_INCENTIVES_IMAGE}
                  alt="Smart Agent Alliance aligned incentives model"
                  className="bento-image-v2 w-full h-full object-cover object-center"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-body text-sm font-medium" style={{ color: BRAND_YELLOW }}>Aligned Incentives</p>
                <p className="text-body text-xs opacity-70 mt-1">When you succeed, we succeed</p>
              </div>
            </div>

            {/* CTA card */}
            <div
              className={`bento-card-v2 rounded-2xl border p-6 text-center transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              style={{ transitionDelay: '600ms', backgroundColor: 'rgba(255, 215, 0, 0.1)', borderColor: 'rgba(255, 215, 0, 0.3)' }}
            >
              <p className="text-body text-xl md:text-2xl italic mb-4" style={{ color: BRAND_YELLOW }}>{TAGLINE}</p>
              <CTAButton href="/exp-realty-sponsor">{CTA_TEXT}</CTAButton>
            </div>
          </div>
        </div>

        <div className={`text-center mt-10 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '2000ms' }}>
          <p className="text-body text-sm opacity-40 max-w-xl mx-auto">{DISCLAIMER}</p>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// VERSION 3: VERTICAL NETWORK FLOW
// Network flows vertically with large 3D numbers and connecting lines
// ============================================================================
function Version3() {
  const { ref, isVisible } = useInView();

  const steps = [
    { num: 1, label: "Traditional Brokerages", desc: "Provide tools, training, and support centrally.", dim: true },
    { num: 2, label: "Limited Sponsors", desc: "Only offer what the brokerage itself provides.", dim: true },
    { num: 3, label: "eXp Realty Model", desc: "Allows sponsors to operate entrepreneurially.", highlight: true },
    { num: 4, label: "Smart Agent Alliance", desc: "We chose to build, fund, and deliver real systems.", highlight: true },
  ];

  return (
    <section ref={ref} className="py-24 md:py-32 px-6 overflow-hidden">
      <style>{`
        @keyframes verticalLineFill {
          from { height: 0%; }
          to { height: 100%; }
        }
        @keyframes nodeEnter {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .vertical-line-fill { animation: verticalLineFill 2s ease-out forwards; }
        .node-enter { animation: nodeEnter 0.6s ease-out forwards; }
      `}</style>
      <div className="mx-auto" style={{ maxWidth: '1300px' }}>
        <div className={`text-center mb-12 md:mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <H2>{HEADLINE}</H2>
        </div>

        {/* Bento grid */}
        <div className="grid md:grid-cols-12 gap-4 md:gap-6">
          {/* Vertical flow card - 7 columns */}
          <div
            className={`md:col-span-7 rounded-2xl bg-gradient-to-br from-white/8 to-white/3 border border-white/10 p-8 md:p-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="relative">
              {/* Vertical connecting line */}
              <div className="absolute left-6 md:left-7 top-0 bottom-0 w-[3px] bg-white/10 rounded-full">
                {isVisible && (
                  <div className="vertical-line-fill absolute top-0 left-0 w-full rounded-full bg-gradient-to-b from-white/30 via-yellow-500/70 to-yellow-500" />
                )}
              </div>

              {/* Steps */}
              <div className="space-y-8">
                {steps.map((step, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-6 pl-2 ${isVisible ? 'node-enter' : 'opacity-0'}`}
                    style={{ animationDelay: `${400 + i * 300}ms`, opacity: step.dim ? 0.6 : 1 }}
                  >
                    {/* 3D Number */}
                    <div
                      className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center ${step.highlight ? '' : ''}`}
                      style={{
                        backgroundColor: step.highlight ? BRAND_YELLOW : 'rgba(255,255,255,0.08)',
                        border: step.highlight ? 'none' : '2px solid rgba(255,255,255,0.15)',
                      }}
                    >
                      {step.highlight ? (
                        <span className="text-2xl font-bold" style={{ color: '#111' }}>{step.num}</span>
                      ) : (
                        <Number3D num={step.num} size="medium" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-2">
                      <p className="text-body text-xs uppercase tracking-wider opacity-50 mb-1">{step.label}</p>
                      <p
                        className={`text-body ${step.highlight ? 'text-lg font-medium' : 'text-base'}`}
                        style={step.highlight ? { color: BRAND_YELLOW } : undefined}
                      >
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-16 h-1 rounded-full mt-8 ml-2" style={{ backgroundColor: BRAND_YELLOW }} />
            <p className={`text-body text-xl md:text-2xl italic mt-6 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ color: BRAND_YELLOW, transitionDelay: '2000ms' }}>
              {TAGLINE}
            </p>
          </div>

          {/* Right column - 5 columns */}
          <div className="md:col-span-5 flex flex-col gap-4 md:gap-6">
            {/* Key point card */}
            <div
              className={`rounded-2xl bg-gradient-to-br from-white/8 to-white/3 border border-white/10 p-6 md:p-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
              style={{ transitionDelay: '400ms' }}
            >
              <p className="text-body text-2xl md:text-3xl font-semibold mb-4" style={{ color: BRAND_YELLOW }}>{DIFFERENTIATOR}</p>
              <p className="text-body text-base md:text-lg leading-relaxed">{KEY_POINT}</p>
            </div>

            {/* Image card */}
            <div
              className={`relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex-1 min-h-[200px] transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              style={{ transitionDelay: '600ms' }}
            >
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={DOUG_KARRIE_IMAGE}
                  alt="Doug and Karrie - Co-founders"
                  className="w-full h-full object-cover object-top"
                  style={{
                    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 60%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 60%, transparent 100%)',
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-body text-sm font-medium" style={{ color: BRAND_YELLOW }}>Built by agents, for agents</p>
                <p className="text-body text-xs opacity-70 mt-1">{SAA_STATEMENT}</p>
              </div>
            </div>

            {/* CTA */}
            <div
              className={`rounded-2xl border p-6 text-center transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              style={{ transitionDelay: '800ms', backgroundColor: 'rgba(255, 215, 0, 0.1)', borderColor: 'rgba(255, 215, 0, 0.3)' }}
            >
              <CTAButton href="/exp-realty-sponsor">{CTA_TEXT}</CTAButton>
            </div>
          </div>
        </div>

        <div className={`text-center mt-10 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '2200ms' }}>
          <p className="text-body text-sm opacity-40 max-w-xl mx-auto">{DISCLAIMER}</p>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// VERSION 4: DIAGONAL NETWORK WITH IMAGES
// Network flows diagonally across bento cards with images
// ============================================================================
function Version4() {
  const { ref, isVisible } = useInView();

  const nodes = [
    { num: 1, label: "Traditional", short: "Centralized only", full: INTRO },
    { num: 2, label: "Limited", short: "Restricted", full: LIMITATION },
    { num: 3, label: "eXp Model", short: "Open architecture", full: DIFFERENTIATOR, highlight: true },
    { num: 4, label: "SAA Systems", short: "Built for you", full: SAA_STATEMENT, highlight: true },
  ];

  return (
    <section ref={ref} className="py-24 md:py-32 px-6 overflow-hidden">
      <style>{`
        @keyframes diagonalLine {
          from { stroke-dashoffset: 500; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes glowPulse {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.4)); }
          50% { filter: drop-shadow(0 0 25px rgba(255, 215, 0, 0.7)); }
        }
        .diagonal-line { stroke-dasharray: 500; animation: diagonalLine 2s ease-out forwards; }
        .glow-pulse { animation: glowPulse 2s ease-in-out infinite; }
      `}</style>
      <div className="mx-auto" style={{ maxWidth: '1300px' }}>
        <div className={`text-center mb-12 md:mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <H2>{HEADLINE}</H2>
        </div>

        {/* Diagonal bento layout */}
        <div className="relative">
          {/* SVG overlay for diagonal connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
            {isVisible && (
              <>
                {/* Diagonal connecting lines between cards */}
                <line x1="25%" y1="20%" x2="75%" y2="35%" stroke="rgba(255,255,255,0.15)" strokeWidth="2" className="diagonal-line" style={{ animationDelay: '0.3s' }} />
                <line x1="25%" y1="50%" x2="75%" y2="65%" stroke={BRAND_YELLOW} strokeWidth="2" className="diagonal-line" style={{ animationDelay: '0.8s' }} />
              </>
            )}
          </svg>

          {/* First row */}
          <div className="grid md:grid-cols-12 gap-4 md:gap-6 mb-4 md:mb-6">
            {/* Node 1 card */}
            <div
              className={`md:col-span-5 rounded-2xl bg-gradient-to-br from-white/8 to-white/3 border border-white/10 p-6 md:p-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: '200ms' }}
            >
              <div className="flex items-center gap-4 mb-4">
                <Number3D num={1} size="large" />
                <div>
                  <p className="text-body text-xs uppercase tracking-wider opacity-50">{nodes[0].label}</p>
                  <p className="text-body font-medium">{nodes[0].short}</p>
                </div>
              </div>
              <p className="text-body text-sm opacity-70">{nodes[0].full}</p>
            </div>

            {/* Image card */}
            <div
              className={`md:col-span-7 relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 min-h-[180px] transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: '300ms' }}
            >
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={ALIGNED_INCENTIVES_IMAGE}
                  alt="Aligned incentives"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-5">
                <p className="text-body text-sm font-medium" style={{ color: BRAND_YELLOW }}>Traditional Model</p>
                <p className="text-body text-xs opacity-70">Centralized, limited support</p>
              </div>
            </div>
          </div>

          {/* Second row */}
          <div className="grid md:grid-cols-12 gap-4 md:gap-6 mb-4 md:mb-6">
            {/* Node 2 card */}
            <div
              className={`md:col-span-4 md:col-start-2 rounded-2xl bg-gradient-to-br from-white/8 to-white/3 border border-white/10 p-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
              style={{ transitionDelay: '500ms' }}
            >
              <div className="flex items-center gap-4 mb-3">
                <Number3D num={2} size="medium" />
                <p className="text-body text-xs uppercase tracking-wider opacity-50">{nodes[1].label}</p>
              </div>
              <p className="text-body text-sm opacity-70">{nodes[1].full}</p>
            </div>

            {/* Differentiator card */}
            <div
              className={`md:col-span-6 rounded-2xl border-2 p-6 md:p-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0 glow-pulse' : 'opacity-0 translate-x-8'}`}
              style={{ transitionDelay: '700ms', backgroundColor: 'rgba(255, 215, 0, 0.08)', borderColor: 'rgba(255, 215, 0, 0.3)' }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: BRAND_YELLOW }}>
                  <span className="text-2xl font-bold" style={{ color: '#111' }}>3</span>
                </div>
                <div>
                  <p className="text-body text-xs uppercase tracking-wider" style={{ color: BRAND_YELLOW }}>{nodes[2].label}</p>
                  <p className="text-body font-medium" style={{ color: BRAND_YELLOW }}>{nodes[2].short}</p>
                </div>
              </div>
              <p className="text-body text-lg font-semibold" style={{ color: BRAND_YELLOW }}>{DIFFERENTIATOR}</p>
            </div>
          </div>

          {/* Third row */}
          <div className="grid md:grid-cols-12 gap-4 md:gap-6">
            {/* Image with founders */}
            <div
              className={`md:col-span-5 md:col-start-3 relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 min-h-[200px] transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              style={{ transitionDelay: '900ms' }}
            >
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={DOUG_KARRIE_IMAGE}
                  alt="Doug and Karrie"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            </div>

            {/* SAA Systems card */}
            <div
              className={`md:col-span-5 rounded-2xl border-2 p-6 md:p-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: '1100ms', backgroundColor: 'rgba(255, 215, 0, 0.1)', borderColor: 'rgba(255, 215, 0, 0.4)' }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: BRAND_YELLOW }}>
                  <span className="text-2xl font-bold" style={{ color: '#111' }}>4</span>
                </div>
                <div>
                  <p className="text-body text-xs uppercase tracking-wider" style={{ color: BRAND_YELLOW }}>{nodes[3].label}</p>
                  <p className="text-body font-medium" style={{ color: BRAND_YELLOW }}>{nodes[3].short}</p>
                </div>
              </div>
              <p className="text-body text-lg leading-relaxed">{KEY_POINT}</p>
              <p className="text-body text-xl italic mt-4" style={{ color: BRAND_YELLOW }}>{TAGLINE}</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className={`text-center mt-10 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '1500ms' }}>
          <CTAButton href="/exp-realty-sponsor">{CTA_TEXT}</CTAButton>
        </div>

        <div className={`text-center mt-10 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '1700ms' }}>
          <p className="text-body text-sm opacity-40 max-w-xl mx-auto">{DISCLAIMER}</p>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// VERSION 5: NETWORK HUB DESIGN
// Central hub with radiating connections to surrounding nodes
// ============================================================================
function Version5() {
  const { ref, isVisible } = useInView();

  const outerNodes = [
    { num: 1, label: "Traditional", desc: "Centralized tools only", angle: -45 },
    { num: 2, label: "Limited", desc: "Restricted offerings", angle: 45 },
  ];

  return (
    <section ref={ref} className="py-24 md:py-32 px-6 overflow-hidden">
      <style>{`
        @keyframes hubPulse {
          0%, 100% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.4), inset 0 0 20px rgba(255, 215, 0, 0.2); }
          50% { box-shadow: 0 0 60px rgba(255, 215, 0, 0.6), inset 0 0 30px rgba(255, 215, 0, 0.3); }
        }
        @keyframes radiateIn {
          from { stroke-dashoffset: 200; opacity: 0; }
          to { stroke-dashoffset: 0; opacity: 1; }
        }
        @keyframes nodeReveal {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
        .hub-pulse { animation: hubPulse 3s ease-in-out infinite; }
        .radiate-line { stroke-dasharray: 200; animation: radiateIn 1s ease-out forwards; }
        .node-reveal { animation: nodeReveal 0.5s ease-out forwards; }
      `}</style>
      <div className="mx-auto" style={{ maxWidth: '1300px' }}>
        <div className={`text-center mb-12 md:mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <H2>{HEADLINE}</H2>
        </div>

        {/* Hub layout */}
        <div className="grid md:grid-cols-12 gap-4 md:gap-6">
          {/* Left info cards */}
          <div className="md:col-span-4 flex flex-col gap-4 md:gap-6">
            <div
              className={`rounded-2xl bg-gradient-to-br from-white/8 to-white/3 border border-white/10 p-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}
              style={{ transitionDelay: '200ms' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Number3D num={1} />
                <p className="text-body text-xs uppercase tracking-wider opacity-50">Traditional</p>
              </div>
              <p className="text-body text-sm opacity-70">{INTRO}</p>
            </div>

            <div
              className={`rounded-2xl bg-gradient-to-br from-white/8 to-white/3 border border-white/10 p-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}
              style={{ transitionDelay: '400ms' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Number3D num={2} />
                <p className="text-body text-xs uppercase tracking-wider opacity-50">Limited Sponsors</p>
              </div>
              <p className="text-body text-sm opacity-70">{LIMITATION}</p>
            </div>

            {/* Image card */}
            <div
              className={`relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex-1 min-h-[150px] transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              style={{ transitionDelay: '600ms' }}
            >
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={ALIGNED_INCENTIVES_IMAGE}
                  alt="Aligned incentives"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            </div>
          </div>

          {/* Center hub */}
          <div
            className={`md:col-span-4 flex flex-col items-center justify-center py-8 transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
            style={{ transitionDelay: '800ms' }}
          >
            {/* The Hub */}
            <div
              className="hub-pulse w-40 h-40 md:w-48 md:h-48 rounded-full flex flex-col items-center justify-center text-center p-6"
              style={{
                backgroundColor: BRAND_YELLOW,
                border: '4px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <span className="text-4xl md:text-5xl font-bold" style={{ color: '#111' }}>eXp</span>
              <span className="text-sm md:text-base font-medium mt-1" style={{ color: '#111' }}>Model</span>
            </div>

            <div className="mt-6 text-center">
              <p className="text-body text-2xl md:text-3xl font-semibold" style={{ color: BRAND_YELLOW }}>{DIFFERENTIATOR}</p>
            </div>

            {/* Arrow pointing down */}
            <div className={`mt-6 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '1200ms' }}>
              <svg width="40" height="60" viewBox="0 0 40 60">
                <path d="M20 0 L20 45 M10 35 L20 50 L30 35" stroke={BRAND_YELLOW} strokeWidth="3" fill="none" />
              </svg>
            </div>
          </div>

          {/* Right - SAA result */}
          <div className="md:col-span-4 flex flex-col gap-4 md:gap-6">
            {/* Key point */}
            <div
              className={`rounded-2xl bg-gradient-to-br from-white/8 to-white/3 border border-white/10 p-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
              style={{ transitionDelay: '1000ms' }}
            >
              <p className="text-body text-base leading-relaxed">{KEY_POINT}</p>
            </div>

            {/* SAA highlight */}
            <div
              className={`rounded-2xl border-2 p-6 md:p-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
              style={{ transitionDelay: '1200ms', backgroundColor: 'rgba(255, 215, 0, 0.1)', borderColor: 'rgba(255, 215, 0, 0.4)' }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: BRAND_YELLOW }}>
                  <span className="text-2xl font-bold" style={{ color: '#111' }}>4</span>
                </div>
                <p className="text-body font-medium" style={{ color: BRAND_YELLOW }}>SAA Systems</p>
              </div>
              <p className="text-body text-sm opacity-80">{SAA_STATEMENT}</p>
              <p className="text-body text-xl italic mt-4" style={{ color: BRAND_YELLOW }}>{TAGLINE}</p>
            </div>

            {/* Founders image */}
            <div
              className={`relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex-1 min-h-[150px] transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              style={{ transitionDelay: '1400ms' }}
            >
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={DOUG_KARRIE_IMAGE}
                  alt="Doug and Karrie"
                  className="w-full h-full object-cover object-top"
                  style={{
                    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, transparent 100%)',
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-body text-xs opacity-70">Built by agents, for agents</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className={`text-center mt-10 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '1800ms' }}>
          <CTAButton href="/exp-realty-sponsor">{CTA_TEXT}</CTAButton>
        </div>

        <div className={`text-center mt-10 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '2000ms' }}>
          <p className="text-body text-sm opacity-40 max-w-xl mx-auto">{DISCLAIMER}</p>
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
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10 px-6 py-3">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-4 justify-center text-sm">
          <a href="#v1" className="hover:underline" style={{ color: BRAND_YELLOW }}>V1: Original Network</a>
          <a href="#v2" className="hover:underline" style={{ color: BRAND_YELLOW }}>V2: Network + Image Bento</a>
          <a href="#v3" className="hover:underline" style={{ color: BRAND_YELLOW }}>V3: Vertical Flow</a>
          <a href="#v4" className="hover:underline" style={{ color: BRAND_YELLOW }}>V4: Diagonal Network</a>
          <a href="#v5" className="hover:underline" style={{ color: BRAND_YELLOW }}>V5: Hub Design</a>
        </div>
      </div>

      {/* Version 1 - Original */}
      <div id="v1" className="border-b border-white/10">
        <div className="text-center py-8 bg-white/5">
          <h3 className="text-body text-lg font-medium">Version 1: Original Connected Network</h3>
          <p className="text-body text-sm opacity-50">Horizontal nodes with animated connecting lines + 3D numbers</p>
        </div>
        <Version1 />
      </div>

      {/* Version 2 - With Image Bento */}
      <div id="v2" className="border-b border-white/10">
        <div className="text-center py-8 bg-white/5">
          <h3 className="text-body text-lg font-medium">Version 2: Network with Image Bento</h3>
          <p className="text-body text-sm opacity-50">Network layout with featured image and CTA cards</p>
        </div>
        <Version2 />
      </div>

      {/* Version 3 - Vertical Flow */}
      <div id="v3" className="border-b border-white/10">
        <div className="text-center py-8 bg-white/5">
          <h3 className="text-body text-lg font-medium">Version 3: Vertical Network Flow</h3>
          <p className="text-body text-sm opacity-50">Vertical progression with large 3D numbers and images</p>
        </div>
        <Version3 />
      </div>

      {/* Version 4 - Diagonal */}
      <div id="v4" className="border-b border-white/10">
        <div className="text-center py-8 bg-white/5">
          <h3 className="text-body text-lg font-medium">Version 4: Diagonal Network</h3>
          <p className="text-body text-sm opacity-50">Diagonal flow across bento grid with connecting lines</p>
        </div>
        <Version4 />
      </div>

      {/* Version 5 - Hub */}
      <div id="v5">
        <div className="text-center py-8 bg-white/5">
          <h3 className="text-body text-lg font-medium">Version 5: Network Hub</h3>
          <p className="text-body text-sm opacity-50">Central eXp hub with radiating connections</p>
        </div>
        <Version5 />
      </div>
    </main>
  );
}
