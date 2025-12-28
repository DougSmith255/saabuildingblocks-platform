'use client';

import { useEffect, useRef, useState } from 'react';
import { H2 } from '@saa/shared/components/saa';
import { CTAButton } from '@saa/shared/components/saa';
import { Check } from 'lucide-react';

// Shared content
const HEADLINE = "Why Smart Agent Alliance?";
const INTRO = "Most eXp sponsors offer little or no ongoing value.";
const SUBHEAD = "SAA was built differently.";
const DESCRIPTION = "We invest in real systems, long-term training, and agent collaboration because our incentives are aligned with agent success.";
const BENEFITS = [
  "No production team structure",
  "No commission splits",
  "No required recruiting",
  "No required meetings",
];
const CTA_TEXT = "See How It Works";
const DISCLAIMER = "Access to SAA systems, training, and community is tied to sponsorship at the time of joining eXp Realty.";

// Main image - Aligned Incentives
const ALIGNED_INCENTIVES_IMAGE = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-aligned-incentives-value-multiplication/public';

// Brand yellow color
const BRAND_YELLOW = '#ffd700';

// Scroll reveal hook - each element gets its own observer
function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
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

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

// Individual reveal wrapper components (like ProvenAtScale)
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, isVisible } = useScrollReveal(0.1);
  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.7s ease-out ${delay}s, transform 0.7s ease-out ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function RevealFromLeft({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, isVisible } = useScrollReveal(0.1);
  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(-40px)',
        transition: `opacity 0.7s ease-out ${delay}s, transform 0.7s ease-out ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function RevealFromRight({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, isVisible } = useScrollReveal(0.1);
  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(40px)',
        transition: `opacity 0.7s ease-out ${delay}s, transform 0.7s ease-out ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function RevealScale({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, isVisible } = useScrollReveal(0.1);
  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.95)',
        transition: `opacity 0.7s ease-out ${delay}s, transform 0.7s ease-out ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// 3D Checkmark Component
function Check3D() {
  return (
    <span className="check-3d">
      <Check className="w-6 h-6" strokeWidth={3} />
    </span>
  );
}

export function WhySAA() {
  return (
    <section className="py-24 md:py-32 px-6 overflow-hidden relative">
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
        .check-3d {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 32px;
          height: 32px;
          color: #c4a94d;
          filter:
            drop-shadow(-1px -1px 0 #ffe680)
            drop-shadow(1px 1px 0 #8a7a3d)
            drop-shadow(2px 2px 0 #2a2a1d)
            drop-shadow(3px 3px 2px rgba(0, 0, 0, 0.5));
          transform: perspective(500px) rotateX(8deg);
          flex-shrink: 0;
        }
      `}</style>
      <div className="mx-auto" style={{ maxWidth: '1300px' }}>
        {/* H2 with its own reveal */}
        <Reveal>
          <div className="text-center">
            <H2>{HEADLINE}</H2>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-12 gap-4 md:gap-6">
          {/* Main content card - 7 columns */}
          <div className="md:col-span-7">
            <RevealFromLeft>
              <div className="bento-card relative rounded-2xl overflow-hidden bg-gradient-to-br from-black/60 to-black/40 border border-white/10 p-8 md:p-10 h-full">
              {/* The Problem */}
              <div className="mb-8">
                <span className="text-body text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-red-500/20 text-red-400">The Problem</span>
                <p className="text-body text-lg mt-3 opacity-70">{INTRO}</p>
              </div>

              {/* Our Solution */}
              <div className="mb-8">
                <span className="text-body text-xs uppercase tracking-wider px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(255, 215, 0, 0.2)', color: BRAND_YELLOW }}>Our Solution</span>
                <p className="font-heading text-2xl md:text-3xl font-bold mt-3" style={{ color: BRAND_YELLOW }}>{SUBHEAD}</p>
                <p className="text-body text-lg mt-4 leading-relaxed">{DESCRIPTION}</p>
              </div>

              {/* Benefits Grid with 3D Checkmarks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {BENEFITS.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check3D />
                    <span className="text-body text-sm font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
              </div>
            </RevealFromLeft>
          </div>

          {/* Right column - 5 columns */}
          <div className="md:col-span-5 flex flex-col gap-4 md:gap-6">
            <RevealFromRight>
              <div className="bento-card relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex-1 min-h-[280px]">
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={ALIGNED_INCENTIVES_IMAGE}
                    alt="Smart Agent Alliance aligned incentives model - where agent success and sponsor success grow together"
                    className="bento-image w-full h-full object-cover object-center"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="font-heading font-bold" style={{ color: BRAND_YELLOW, fontSize: '23px' }}>Aligned Incentives</p>
                  <p className="text-body text-xs opacity-70 mt-1">When you succeed, we succeed</p>
                </div>
              </div>
            </RevealFromRight>

            <RevealScale delay={0.1}>
              <div
                className="bento-card relative rounded-2xl overflow-hidden border p-6 md:p-8 text-center"
                style={{ backgroundColor: 'rgba(255, 215, 0, 0.1)', borderColor: 'rgba(255, 215, 0, 0.3)' }}
              >
                <p className="text-body text-lg mb-5">Ready to see the difference?</p>
                <CTAButton href="/exp-realty-sponsor">{CTA_TEXT}</CTAButton>
              </div>
            </RevealScale>
          </div>
        </div>

        <Reveal delay={0.2}>
          <div className="text-center mt-12">
            <p className="text-body text-sm opacity-40 max-w-xl mx-auto">{DISCLAIMER}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
