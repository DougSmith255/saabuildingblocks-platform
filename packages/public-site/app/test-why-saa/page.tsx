'use client';

import { useEffect, useRef, useState } from 'react';
import { H2 } from '@saa/shared/components/saa';
import { CTAButton } from '@saa/shared/components/saa';

/**
 * Test page for "Why This Only Works at eXp Realty" section
 * 5 CREATIVE layout variations with unique animations
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

// ============================================================================
// VERSION 1: METRO/SUBWAY MAP
// Horizontal transit line with station nodes, animated train pulse
// ============================================================================
function Version1() {
  const { ref, isVisible } = useInView();

  const stations = [
    { label: "Traditional", desc: "Centralized tools only" },
    { label: "Limited Sponsors", desc: "Brokerage offerings only" },
    { label: "eXp Model", desc: "Entrepreneurial freedom", highlight: true },
    { label: "SAA Choice", desc: "We invested in you", highlight: true },
  ];

  return (
    <section ref={ref} className="py-24 md:py-32 px-6 overflow-hidden">
      <style>{`
        @keyframes trainPulse {
          0% { left: -5%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        @keyframes stationGlow {
          0%, 100% { box-shadow: 0 0 15px rgba(255, 215, 0, 0.4); }
          50% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.7); }
        }
        @keyframes lineReveal {
          from { width: 0%; }
          to { width: 100%; }
        }
        .metro-line { animation: lineReveal 1.5s ease-out forwards; }
        .train-pulse { animation: trainPulse 2.5s ease-in-out infinite; animation-delay: 1.5s; }
        .station-glow { animation: stationGlow 2s ease-in-out infinite; }
      `}</style>
      <div className="mx-auto" style={{ maxWidth: '1300px' }}>
        <div className={`text-center mb-12 md:mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <H2>{HEADLINE}</H2>
        </div>

        {/* Main bento card */}
        <div className="rounded-2xl bg-gradient-to-br from-white/8 to-white/3 border border-white/10 p-8 md:p-12">
          {/* Intro text */}
          <p className="text-body text-lg md:text-xl opacity-70 text-center max-w-3xl mx-auto mb-12">{INTRO}</p>

          {/* Metro Line Container */}
          <div className="relative py-16 md:py-20">
            {/* The track background */}
            <div className="absolute left-8 right-8 md:left-12 md:right-12 top-1/2 -translate-y-1/2 h-1 bg-white/10 rounded-full" />

            {/* Animated track fill */}
            <div className="absolute left-8 right-8 md:left-12 md:right-12 top-1/2 -translate-y-1/2 h-1 rounded-full overflow-hidden">
              {isVisible && (
                <>
                  <div className="metro-line absolute h-full rounded-full" style={{ backgroundColor: BRAND_YELLOW }} />
                  <div className="train-pulse absolute h-full w-12 rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${BRAND_YELLOW}, transparent)` }} />
                </>
              )}
            </div>

            {/* Stations */}
            <div className="relative flex justify-between px-8 md:px-12">
              {stations.map((station, i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
                  style={{ transitionDelay: `${600 + i * 200}ms` }}
                >
                  {/* Station marker */}
                  <div
                    className={`w-10 h-10 md:w-14 md:h-14 rounded-full border-4 flex items-center justify-center text-sm md:text-lg font-bold ${station.highlight ? 'station-glow' : ''}`}
                    style={{
                      backgroundColor: station.highlight ? BRAND_YELLOW : '#111',
                      borderColor: station.highlight ? BRAND_YELLOW : 'rgba(255,255,255,0.2)',
                      color: station.highlight ? '#111' : '#fff'
                    }}
                  >
                    {i + 1}
                  </div>

                  {/* Station label - alternating top/bottom */}
                  <div className={`absolute ${i % 2 === 0 ? 'top-full mt-4' : 'bottom-full mb-4'} text-center w-28 md:w-36 left-1/2 -translate-x-1/2`}>
                    <p className="text-body text-xs uppercase tracking-wider opacity-50 mb-1">{station.label}</p>
                    <p className="text-body text-sm font-medium" style={station.highlight ? { color: BRAND_YELLOW } : undefined}>
                      {station.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="w-24 h-1 rounded-full mx-auto my-8" style={{ backgroundColor: BRAND_YELLOW }} />

          {/* Key message */}
          <p className={`text-body text-lg md:text-xl leading-relaxed text-center max-w-3xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '1800ms' }}>
            {KEY_POINT}
          </p>

          {/* Tagline */}
          <p className={`text-body text-xl md:text-2xl italic text-center mt-8 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ color: BRAND_YELLOW, transitionDelay: '2200ms' }}>
            {TAGLINE}
          </p>
        </div>

        {/* CTA */}
        <div className={`text-center mt-10 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '2500ms' }}>
          <CTAButton href="/exp-realty-sponsor">{CTA_TEXT}</CTAButton>
        </div>

        <div className={`text-center mt-10 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '2700ms' }}>
          <p className="text-body text-sm opacity-40 max-w-xl mx-auto">{DISCLAIMER}</p>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// VERSION 2: CONNECTED NODES / NETWORK
// Points connected with animated lines, showing the flow from old to new
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
          50% { transform: scale(1.1); }
        }
        .path-line { stroke-dasharray: 300; animation: drawPath 1.5s ease-out forwards; }
        .node-glow { animation: nodeGlow 2s ease-in-out infinite; }
        .node-pulse { animation: pulseNode 2s ease-in-out infinite; }
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
                  <line x1="18%" y1="50%" x2="38%" y2="50%" stroke="rgba(255,255,255,0.2)" strokeWidth="2" className="path-line" style={{ animationDelay: '0.5s' }} />
                  <line x1="38%" y1="50%" x2="62%" y2="50%" stroke={BRAND_YELLOW} strokeWidth="2" className="path-line" style={{ animationDelay: '1s' }} />
                  <line x1="62%" y1="50%" x2="82%" y2="50%" stroke={BRAND_YELLOW} strokeWidth="2" className="path-line" style={{ animationDelay: '1.5s' }} />
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
                  {/* Node circle */}
                  <div
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-4 flex items-center justify-center text-xl md:text-2xl font-bold mb-4 ${node.highlight ? 'node-glow node-pulse' : ''}`}
                    style={{
                      backgroundColor: node.highlight ? BRAND_YELLOW : 'rgba(255,255,255,0.05)',
                      borderColor: node.highlight ? BRAND_YELLOW : 'rgba(255,255,255,0.15)',
                      color: node.highlight ? '#111' : '#fff'
                    }}
                  >
                    {i + 1}
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
// VERSION 3: TIMELINE (KEEPING AS REQUESTED)
// Vertical timeline showing the progression of the story
// ============================================================================
function Version3() {
  const { ref, isVisible } = useInView();

  const timeline = [
    { label: "The Norm", text: INTRO },
    { label: "The Limitation", text: LIMITATION },
    { label: "The Difference", text: DIFFERENTIATOR, highlight: true },
    { label: "The Opportunity", text: KEY_POINT },
    { label: "Our Choice", text: SAA_STATEMENT },
  ];

  return (
    <section ref={ref} className="py-24 md:py-32 px-6 overflow-hidden">
      <style>{`
        .timeline-line-fill {
          animation: fillLine 2s ease-out forwards;
        }
        @keyframes fillLine {
          from { height: 0%; }
          to { height: 100%; }
        }
      `}</style>
      <div className="mx-auto" style={{ maxWidth: '1300px' }}>
        <div className={`text-center mb-12 md:mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <H2>{HEADLINE}</H2>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-[2px] bg-white/10">
              {isVisible && (
                <div className="timeline-line-fill absolute top-0 left-0 w-full bg-gradient-to-b from-white/30 via-yellow-500/70 to-yellow-500" />
              )}
            </div>

            <div className="space-y-8">
              {timeline.map((item, i) => (
                <div
                  key={i}
                  className={`flex gap-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
                  style={{ transitionDelay: `${400 + i * 300}ms` }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all duration-500"
                    style={{
                      backgroundColor: item.highlight ? BRAND_YELLOW : 'rgba(255,255,255,0.1)',
                      borderColor: item.highlight ? BRAND_YELLOW : 'rgba(255,255,255,0.2)',
                      color: item.highlight ? '#111' : 'inherit',
                      transitionDelay: `${600 + i * 300}ms`
                    }}
                  >
                    <span className="text-sm font-bold">{i + 1}</span>
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-body text-xs uppercase tracking-wider opacity-50 mb-2">{item.label}</p>
                    <p
                      className={`text-body ${item.highlight ? 'text-xl md:text-2xl font-semibold' : 'text-lg'}`}
                      style={item.highlight ? { color: BRAND_YELLOW } : undefined}
                    >
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`text-center mt-12 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '2200ms' }}>
            <p className="text-body text-xl md:text-2xl italic mb-6" style={{ color: BRAND_YELLOW }}>{TAGLINE}</p>
            <CTAButton href="/exp-realty-sponsor">{CTA_TEXT}</CTAButton>
          </div>
        </div>

        <div className={`text-center mt-12 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '2500ms' }}>
          <p className="text-body text-sm opacity-40 max-w-xl mx-auto">{DISCLAIMER}</p>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// VERSION 4: COMPARISON CARDS
// Side-by-side contrast showing limitation vs opportunity
// ============================================================================
function Version4() {
  const { ref, isVisible } = useInView();

  return (
    <section ref={ref} className="py-24 md:py-32 px-6 overflow-hidden">
      <style>{`
        @keyframes checkReveal {
          from { transform: scale(0) rotate(-180deg); opacity: 0; }
          to { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .check-reveal { animation: checkReveal 0.5s ease-out forwards; }
      `}</style>
      <div className="mx-auto" style={{ maxWidth: '1300px' }}>
        <div className={`text-center mb-12 md:mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <H2>{HEADLINE}</H2>
        </div>

        {/* Two column comparison */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left - The Limitation */}
          <div
            className={`rounded-2xl bg-gradient-to-br from-white/5 to-white/2 border border-white/10 p-8 md:p-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}
            style={{ transitionDelay: '200ms' }}
          >
            <p className="text-body text-xs uppercase tracking-wider opacity-40 mb-6">Everywhere Else</p>
            <p className="text-body text-lg md:text-xl opacity-60 mb-4">{INTRO}</p>
            <p className="text-body text-lg opacity-60 mb-8">{LIMITATION}</p>

            <div className="space-y-4">
              {["Centralized tools only", "Limited sponsor support", "No room for innovation"].map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 opacity-50 transition-all duration-500 ${isVisible ? 'opacity-50 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                  style={{ transitionDelay: `${500 + i * 100}ms` }}
                >
                  <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-sm">✕</span>
                  <span className="text-body">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - The Solution */}
          <div
            className={`rounded-2xl bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-2 p-8 md:p-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
            style={{ transitionDelay: '300ms', borderColor: 'rgba(255, 215, 0, 0.3)' }}
          >
            <p className="text-body text-xs uppercase tracking-wider mb-6" style={{ color: BRAND_YELLOW }}>SAA at eXp Realty</p>
            <p className="text-body text-2xl md:text-3xl font-semibold mb-4" style={{ color: BRAND_YELLOW }}>{DIFFERENTIATOR}</p>
            <p className="text-body text-lg leading-relaxed mb-8">{KEY_POINT}</p>

            <div className="space-y-4">
              {["Build custom systems", "Fund real infrastructure", "Deliver direct support"].map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 transition-all duration-500 ${isVisible ? 'translate-x-0' : 'translate-x-4'}`}
                  style={{ transitionDelay: `${600 + i * 100}ms` }}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${isVisible ? 'check-reveal' : 'opacity-0'}`}
                    style={{ backgroundColor: BRAND_YELLOW, color: '#111', animationDelay: `${700 + i * 150}ms` }}
                  >
                    ✓
                  </span>
                  <span className="text-body font-medium">{item}</span>
                </div>
              ))}
            </div>

            <p className={`text-body text-xl md:text-2xl italic mt-8 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ color: BRAND_YELLOW, transitionDelay: '1200ms' }}>
              {TAGLINE}
            </p>
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
// VERSION 5: STACKED CARDS / ACCORDION STYLE
// Progressive reveal of content in stacked card format
// ============================================================================
function Version5() {
  const { ref, isVisible } = useInView();

  const cards = [
    { label: "The Status Quo", text: INTRO, dim: true },
    { label: "The Limitation", text: LIMITATION, dim: true },
    { label: "The eXp Difference", text: DIFFERENTIATOR, highlight: true },
    { label: "The Opportunity", text: KEY_POINT, highlight: true },
    { label: "Our Choice", text: SAA_STATEMENT, highlight: true },
  ];

  return (
    <section ref={ref} className="py-24 md:py-32 px-6 overflow-hidden">
      <style>{`
        @keyframes slideInStack {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .stack-card { animation: slideInStack 0.6s ease-out forwards; }
      `}</style>
      <div className="mx-auto" style={{ maxWidth: '1300px' }}>
        <div className={`text-center mb-12 md:mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <H2>{HEADLINE}</H2>
        </div>

        {/* Stacked cards */}
        <div className="max-w-3xl mx-auto space-y-4">
          {cards.map((card, i) => (
            <div
              key={i}
              className={`rounded-2xl p-6 md:p-8 border-2 ${isVisible ? 'stack-card' : 'opacity-0'} ${
                card.highlight
                  ? 'bg-gradient-to-r from-yellow-500/10 to-yellow-600/5'
                  : 'bg-gradient-to-br from-white/5 to-white/2'
              }`}
              style={{
                borderColor: card.highlight ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255,255,255,0.1)',
                animationDelay: `${300 + i * 200}ms`,
                opacity: card.dim && !card.highlight ? 0.7 : 1
              }}
            >
              <div className="flex items-start gap-4">
                {/* Number indicator */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
                  style={{
                    backgroundColor: card.highlight ? BRAND_YELLOW : 'rgba(255,255,255,0.1)',
                    color: card.highlight ? '#111' : '#fff'
                  }}
                >
                  {i + 1}
                </div>

                <div className="flex-1">
                  <p className="text-body text-xs uppercase tracking-wider opacity-50 mb-2">{card.label}</p>
                  <p
                    className={`text-body ${card.highlight ? 'text-lg md:text-xl font-medium' : 'text-base md:text-lg'}`}
                    style={card.highlight && card.label === "The eXp Difference" ? { color: BRAND_YELLOW } : undefined}
                  >
                    {card.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tagline and CTA */}
        <div className={`text-center mt-12 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '1800ms' }}>
          <p className="text-body text-xl md:text-2xl italic mb-6" style={{ color: BRAND_YELLOW }}>{TAGLINE}</p>
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
          <a href="#v1" className="hover:underline" style={{ color: BRAND_YELLOW }}>V1: Metro Line</a>
          <a href="#v2" className="hover:underline" style={{ color: BRAND_YELLOW }}>V2: Network</a>
          <a href="#v3" className="hover:underline" style={{ color: BRAND_YELLOW }}>V3: Timeline</a>
          <a href="#v4" className="hover:underline" style={{ color: BRAND_YELLOW }}>V4: Comparison</a>
          <a href="#v5" className="hover:underline" style={{ color: BRAND_YELLOW }}>V5: Stacked</a>
        </div>
      </div>

      {/* Version 1 */}
      <div id="v1" className="border-b border-white/10">
        <div className="text-center py-8 bg-white/5">
          <h3 className="text-body text-lg font-medium">Version 1: Metro Line</h3>
          <p className="text-body text-sm opacity-50">Horizontal transit stations with animated line</p>
        </div>
        <Version1 />
      </div>

      {/* Version 2 */}
      <div id="v2" className="border-b border-white/10">
        <div className="text-center py-8 bg-white/5">
          <h3 className="text-body text-lg font-medium">Version 2: Connected Network</h3>
          <p className="text-body text-sm opacity-50">Nodes with animated connecting lines</p>
        </div>
        <Version2 />
      </div>

      {/* Version 3 */}
      <div id="v3" className="border-b border-white/10">
        <div className="text-center py-8 bg-white/5">
          <h3 className="text-body text-lg font-medium">Version 3: Timeline Story</h3>
          <p className="text-body text-sm opacity-50">Vertical timeline with animated fill</p>
        </div>
        <Version3 />
      </div>

      {/* Version 4 */}
      <div id="v4" className="border-b border-white/10">
        <div className="text-center py-8 bg-white/5">
          <h3 className="text-body text-lg font-medium">Version 4: Side-by-Side Comparison</h3>
          <p className="text-body text-sm opacity-50">Limitation vs opportunity contrast</p>
        </div>
        <Version4 />
      </div>

      {/* Version 5 */}
      <div id="v5">
        <div className="text-center py-8 bg-white/5">
          <h3 className="text-body text-lg font-medium">Version 5: Stacked Cards</h3>
          <p className="text-body text-sm opacity-50">Progressive reveal storytelling</p>
        </div>
        <Version5 />
      </div>
    </main>
  );
}
