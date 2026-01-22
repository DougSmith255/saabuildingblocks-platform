'use client';

import { useRef } from 'react';
import { H2 } from '@saa/shared/components/saa';
import { CTAButton } from '@saa/shared/components/saa';
import { Check } from 'lucide-react';

// Shared content
const HEADLINE = "Why Smart Agent Alliance (SAA)?";
const TAGLINE = "Elite systems. Proven training. Real community.";
const INTRO = "Most eXp sponsors offer little or no ongoing value.";
const SUBHEAD = "Smart Agent Alliance was built differently.";
const DESCRIPTION = "We invest in real systems, long-term training, and agent collaboration because our incentives are aligned with agent success.";
const BENEFITS = [
  "Not a production team",
  "No commission splits",
  "No sponsor team fees",
  "No required meetings",
];
const CTA_TEXT = "See How It Works";
const DISCLAIMER = "SAA resources are available to agents who select a SAA-aligned sponsor at the time they join eXp Realty.";

// Main image - Aligned Incentives
const ALIGNED_INCENTIVES_IMAGE = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-aligned-incentives-value-multiplication/public';

// Brand yellow color
const BRAND_YELLOW = '#ffd700';

// 3D Checkmark Component
function Check3D() {
  return (
    <span className="check-3d">
      <Check className="w-6 h-6" strokeWidth={3} />
    </span>
  );
}

export function WhySAA() {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={sectionRef} className="py-24 md:py-32 px-6 overflow-hidden relative">
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
      <div className="mx-auto" style={{ maxWidth: '1500px' }}>
        {/* H2 - always visible */}
        <div className="text-center mb-8">
          <H2>{HEADLINE}</H2>
        </div>

        <div className="grid md:grid-cols-12 gap-4 md:gap-6 items-stretch">
          {/* Main content card - 7 columns */}
          <div className="md:col-span-7">
            <div
              className="rounded-2xl overflow-hidden h-full"
              style={{
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'linear-gradient(to bottom right, rgba(0,0,0,0.6), rgba(0,0,0,0.4))',
              }}
            >
              <div className="p-8 md:p-10">
                <p className="font-heading text-2xl md:text-3xl font-bold" style={{ color: BRAND_YELLOW }}>{TAGLINE}</p>
                <p className="text-body text-lg mt-4 opacity-70">{INTRO}</p>
                <p className="font-heading text-xl md:text-2xl font-bold mt-6" style={{ color: BRAND_YELLOW }}>{SUBHEAD}</p>
                <p className="text-body text-lg mt-4 leading-relaxed">{DESCRIPTION}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  {BENEFITS.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Check3D />
                      <span className="text-body text-sm font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right column - 5 columns */}
          <div className="md:col-span-5 flex flex-col gap-4 md:gap-6 h-full">
            {/* Image card */}
            <div className="flex-1 min-h-0">
              <div
                className="rounded-2xl overflow-hidden relative h-full"
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255,255,255,0.05)',
                }}
              >
                <img
                  src={ALIGNED_INCENTIVES_IMAGE}
                  alt="Smart Agent Alliance aligned incentives model - where agent success and sponsor success grow together"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="font-heading font-bold" style={{ color: BRAND_YELLOW, fontSize: '23px' }}>Aligned Incentives</p>
                  <p className="text-body text-xs opacity-70 mt-1">When you succeed, we succeed</p>
                </div>
              </div>
            </div>

            {/* CTA card */}
            <div>
              <div
                className="bento-card relative rounded-2xl overflow-hidden border p-6 md:p-8 text-center"
                style={{ backgroundColor: 'rgba(255, 215, 0, 0.1)', borderColor: 'rgba(255, 215, 0, 0.3)' }}
              >
                <p className="text-body text-lg mb-5">Grow independently. Succeed together.</p>
                <CTAButton href="/exp-realty-sponsor">{CTA_TEXT}</CTAButton>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-center mt-12">
          <p className="text-body mx-auto" style={{ color: '#e5e4dd', maxWidth: '700px' }}>{DISCLAIMER}</p>
        </div>
      </div>
    </section>
  );
}
