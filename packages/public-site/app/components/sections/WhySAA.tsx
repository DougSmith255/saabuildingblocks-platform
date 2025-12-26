'use client';

import { useEffect, useRef, useState } from 'react';
import { H2 } from '@saa/shared/components/saa';
import { CTAButton } from '@saa/shared/components/saa';

// Shared content
const HEADLINE = "Why Smart Agent Alliance";
const INTRO = "Most eXp sponsors offer little or no ongoing value.";
const SUBHEAD = "SAA was built differently.";
const DESCRIPTION = "We invest in real systems, long-term training, and agent collaboration because our incentives are aligned with agent success.";
const BENEFITS = [
  "No production team structure",
  "No commission splits",
  "No required recruiting",
  "No required meetings",
];
const TAGLINE = "Just aligned incentives and real support.";
const CTA_TEXT = "See How It Works";
const DISCLAIMER = "Access to SAA systems, training, and community is tied to sponsorship at the time of joining eXp Realty.";

// Main image - Aligned Incentives
const ALIGNED_INCENTIVES_IMAGE = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-aligned-incentives-value-multiplication/public';

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

// 3D Number Component
function Number3D({ num }: { num: number }) {
  return <span className="number-3d">{num}</span>;
}

export function WhySAA() {
  const { ref, isVisible } = useInView();

  return (
    <section ref={ref} className="py-24 md:py-32 px-6 overflow-hidden">
      <style>{`
        .bento-card {
          transition: transform 0.5s ease, box-shadow 0.5s ease;
        }
        .bento-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
        }
        .bento-image {
          transition: transform 0.7s ease;
        }
        .bento-card:hover .bento-image {
          transform: scale(1.05);
        }
        .number-3d {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 40px;
          height: 40px;
          font-weight: 700;
          font-size: 28px;
          color: #c4a94d;
          filter:
            drop-shadow(-1px -1px 0 #ffe680)
            drop-shadow(1px 1px 0 #8a7a3d)
            drop-shadow(3px 3px 0 #2a2a1d)
            drop-shadow(4px 4px 2px rgba(0, 0, 0, 0.5));
          transform: perspective(500px) rotateX(8deg);
          flex-shrink: 0;
        }
      `}</style>
      <div className="mx-auto" style={{ maxWidth: '1300px' }}>
        <div className={`text-center mb-12 md:mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <H2>{HEADLINE}</H2>
        </div>

        <div className="grid md:grid-cols-12 gap-4 md:gap-6">
          {/* Main content card - 7 columns */}
          <div
            className={`bento-card md:col-span-7 relative rounded-2xl overflow-hidden bg-gradient-to-br from-white/8 to-white/3 border border-white/10 p-8 md:p-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}
            style={{ transitionDelay: '200ms' }}
          >
            <p className="text-body text-lg md:text-xl opacity-70">{INTRO}</p>
            <p className="text-body text-2xl md:text-3xl font-semibold mt-4" style={{ color: BRAND_YELLOW }}>{SUBHEAD}</p>
            <p className="text-body text-lg mt-6 leading-relaxed">{DESCRIPTION}</p>
            <div className="w-24 h-1 rounded-full mt-8 mb-8" style={{ backgroundColor: BRAND_YELLOW }} />
            <div className="space-y-4">
              <p className="text-body text-sm uppercase tracking-wider opacity-50">There is:</p>
              {BENEFITS.map((benefit, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                  style={{ transitionDelay: `${400 + i * 100}ms` }}
                >
                  <Number3D num={i + 1} />
                  <span className="text-body font-bold">{benefit}</span>
                </div>
              ))}
            </div>
            <p className={`text-body text-xl md:text-2xl italic mt-8 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ color: BRAND_YELLOW, transitionDelay: '800ms' }}>
              {TAGLINE}
            </p>
          </div>

          {/* Right column - 5 columns */}
          <div className="md:col-span-5 flex flex-col gap-4 md:gap-6">
            <div
              className={`bento-card relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex-1 min-h-[200px] transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
              style={{ transitionDelay: '300ms' }}
            >
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={ALIGNED_INCENTIVES_IMAGE}
                  alt="Smart Agent Alliance aligned incentives model - where agent success and sponsor success grow together"
                  className="bento-image w-full h-full object-cover object-center"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-body text-sm font-medium" style={{ color: BRAND_YELLOW }}>Aligned Incentives</p>
                <p className="text-body text-xs opacity-70 mt-1">When you succeed, we succeed</p>
              </div>
            </div>
            <div
              className={`bento-card relative rounded-2xl overflow-hidden border p-6 md:p-8 text-center transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              style={{ transitionDelay: '500ms', backgroundColor: 'rgba(255, 215, 0, 0.1)', borderColor: 'rgba(255, 215, 0, 0.3)' }}
            >
              <p className="text-body text-lg mb-5">Ready to see the difference?</p>
              <CTAButton href="/exp-realty-sponsor">{CTA_TEXT}</CTAButton>
            </div>
          </div>
        </div>

        <div className={`text-center mt-12 transition-all duration-700 delay-[900ms] ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-body text-sm opacity-40 max-w-xl mx-auto">{DISCLAIMER}</p>
        </div>
      </div>
    </section>
  );
}
