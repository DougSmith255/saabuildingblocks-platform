'use client';

import { useEffect, useRef, useState } from 'react';
import { H2 } from '@saa/shared/components/saa';
import { CTAButton } from '@saa/shared/components/saa';

/**
 * Test page for "Why This Only Works at eXp Realty" section
 * Refined layout - distinct from WhySAA section above
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
// NEW LAYOUT: CENTERED FULL-WIDTH WITH HORIZONTAL PROGRESSION
// Different from WhySAA's 7/5 column split
// ============================================================================
function WhyExpSection() {
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
        @keyframes horizontalLineFill {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes nodeEnter {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes stepReveal {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .horizontal-line-fill { animation: horizontalLineFill 2s ease-out forwards; }
        .node-enter { animation: nodeEnter 0.6s ease-out forwards; }
        .step-reveal { animation: stepReveal 0.5s ease-out forwards; }
      `}</style>
      <div className="mx-auto" style={{ maxWidth: '1300px' }}>
        {/* Header */}
        <div className={`text-center mb-12 md:mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <H2>{HEADLINE}</H2>
        </div>

        {/* Full-width intro card */}
        <div
          className={`rounded-2xl bg-gradient-to-br from-white/8 to-white/3 border border-white/10 p-8 md:p-12 mb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '200ms' }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-body text-lg md:text-xl opacity-70 mb-4">{INTRO}</p>
            <p className="text-body text-lg opacity-70">{LIMITATION}</p>
          </div>
        </div>

        {/* Horizontal progression - 4 steps in a row */}
        <div className="relative mb-6">
          {/* Connecting line behind the steps */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-white/10 rounded-full hidden md:block" style={{ margin: '0 10%' }}>
            {isVisible && (
              <div className="horizontal-line-fill absolute h-full rounded-full bg-gradient-to-r from-white/20 via-yellow-500/50 to-yellow-500" />
            )}
          </div>

          {/* Steps grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`relative rounded-2xl p-6 md:p-8 border transition-all duration-700 ${isVisible ? 'step-reveal' : 'opacity-0'} ${
                  step.highlight
                    ? 'bg-gradient-to-br from-yellow-500/15 to-yellow-600/5'
                    : 'bg-gradient-to-br from-white/8 to-white/3'
                }`}
                style={{
                  borderColor: step.highlight ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255,255,255,0.1)',
                  animationDelay: `${400 + i * 200}ms`,
                }}
              >
                {/* Number */}
                <div className="flex justify-center mb-4">
                  {step.highlight ? (
                    <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: BRAND_YELLOW }}>
                      <span className="text-2xl font-bold" style={{ color: '#111' }}>{step.num}</span>
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full flex items-center justify-center bg-white/5 border-2 border-white/15">
                      <Number3D num={step.num} size="medium" />
                    </div>
                  )}
                </div>

                {/* Label & Description */}
                <div className="text-center">
                  <p className="text-body text-xs uppercase tracking-wider opacity-50 mb-2">{step.label}</p>
                  <p
                    className={`text-body ${step.highlight ? 'text-base font-medium' : 'text-sm'}`}
                    style={step.highlight ? { color: BRAND_YELLOW } : { opacity: step.dim ? 0.7 : 1 }}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key point and image in 3-column layout (different from 7/5 above) */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {/* Key point - full width card */}
          <div
            className={`md:col-span-2 rounded-2xl border-2 p-8 md:p-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '1200ms', backgroundColor: 'rgba(255, 215, 0, 0.08)', borderColor: 'rgba(255, 215, 0, 0.3)' }}
          >
            <p className="text-body text-2xl md:text-3xl font-semibold mb-4" style={{ color: BRAND_YELLOW }}>{DIFFERENTIATOR}</p>
            <p className="text-body text-lg md:text-xl leading-relaxed mb-6">{KEY_POINT}</p>
            <p className="text-body text-lg opacity-70 mb-6">{SAA_STATEMENT}</p>
            <p className="text-body text-xl md:text-2xl italic" style={{ color: BRAND_YELLOW }}>{TAGLINE}</p>
          </div>

          {/* Right column - image and CTA stacked */}
          <div className="flex flex-col gap-4 md:gap-6">
            {/* Image */}
            <div
              className={`relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex-1 min-h-[200px] transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              style={{ transitionDelay: '1400ms' }}
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
              </div>
            </div>

            {/* CTA */}
            <div
              className={`rounded-2xl border p-6 text-center transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              style={{ transitionDelay: '1600ms', backgroundColor: 'rgba(255, 215, 0, 0.1)', borderColor: 'rgba(255, 215, 0, 0.3)' }}
            >
              <CTAButton href="/exp-realty-sponsor">{CTA_TEXT}</CTAButton>
            </div>
          </div>
        </div>

        <div className={`text-center mt-10 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '1800ms' }}>
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
      {/* Header */}
      <div className="text-center py-8 bg-white/5 border-b border-white/10">
        <h3 className="text-body text-lg font-medium">Why This Only Works at eXp Realty</h3>
        <p className="text-body text-sm opacity-50">Horizontal 4-step progression + 2/1 column bottom layout</p>
      </div>

      <WhyExpSection />
    </main>
  );
}
