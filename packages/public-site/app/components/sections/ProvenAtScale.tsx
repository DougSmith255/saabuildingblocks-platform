'use client';

import { H2, Icon3D } from '@saa/shared/components/saa';
import { SecondaryButton } from '@saa/shared/components/saa';
import { NeonCard } from '@saa/shared/components/saa/cards';
import { GlassPanel } from '@saa/shared/components/saa/backgrounds/GlassPanel';
import { Globe, TrendingUp, Check } from 'lucide-react';

/**
 * Proven at Scale Section
 * Shows SAA's scale and credibility with wolf pack background
 */

const BRAND_YELLOW = '#ffd700';
const WOLF_PACK_IMAGE = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/desktop';

const HEADLINE = "Proven at Scale";
const STATS = [
  { text: "One of the fastest-growing sponsor organizations at eXp Realty", icon: TrendingUp },
  { text: "Consistently strong agent retention", icon: Check },
  { text: "Supporting agents across the U.S., Canada, Mexico, Australia, and beyond", icon: Globe },
];
const CTA_TEXT = "See What Agents Say";

// Simple wrapper - no animations
function RevealFromLeft({ children }: { children: React.ReactNode; delay?: number }) {
  return <div>{children}</div>;
}

function RevealFromRight({ children }: { children: React.ReactNode; delay?: number }) {
  return <div>{children}</div>;
}

// Static counter with H2 neon text styling (no backing plate)
function StaticCounterNeon({ value, suffix = '' }: { value: string; suffix?: string }) {
  // H2-style white core glow text-shadow (no backing plate)
  const textShadow = `
    0 0 1px #fff,
    0 0 2px #fff,
    0 0 4px rgba(255,255,255,0.8),
    0 0 8px rgba(255,255,255,0.4)
  `;

  return (
    <span
      style={{
        fontVariantNumeric: 'tabular-nums',
        color: '#bfbdb0',
        textShadow: textShadow.trim(),
        display: 'inline-block',
        letterSpacing: '0.02em',
      }}
    >
      {value}{suffix}
    </span>
  );
}

export function ProvenAtScale() {
  return (
    <GlassPanel variant="champagne">
      <section className="py-16 md:py-24 px-6 relative overflow-hidden">
      {/* Wolf Pack Background Image with Ellipse Fade */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          src={WOLF_PACK_IMAGE}
          srcSet="
            https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/mobile 375w,
            https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/tablet 768w,
            https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/desktop 1280w,
            https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/tablet2x 1536w,
            https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/desktop2x 2560w
          "
          sizes="100vw"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
          style={{
            objectPosition: 'center 55%',
            maskImage: 'radial-gradient(ellipse 70% 65% at center 50%, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.6) 30%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 70%, transparent 90%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 65% at center 50%, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.6) 30%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 70%, transparent 90%)',
          }}
        />
      </div>

      <div className="mx-auto relative z-10" style={{ maxWidth: '1600px' }}>
        <div className="grid md:grid-cols-12 gap-8 items-center">
          {/* Left - Content (8 columns) */}
          <div className="md:col-span-8">
            {/* H2 - always visible, no animation */}
            <H2 style={{ textAlign: 'left' }}>{HEADLINE}</H2>

            <div className="space-y-4 mb-8">
              {STATS.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <RevealFromLeft key={i} delay={0.1 + i * 0.1}>
                    <div className="flex items-center gap-4">
                      <Icon3D><Icon className="w-6 h-6 flex-shrink-0" /></Icon3D>
                      <p className="text-body">{stat.text}</p>
                    </div>
                  </RevealFromLeft>
                );
              })}
            </div>

            <RevealFromLeft delay={0.5}>
              <div className="text-center md:text-left">
                <SecondaryButton href="/exp-realty-sponsor">{CTA_TEXT}</SecondaryButton>
              </div>
            </RevealFromLeft>
          </div>

          {/* Right - Featured Cyber Card (4 columns) */}
          <div className="md:col-span-4">
            <RevealFromRight delay={0.2}>
              <NeonCard padding="lg">
                <Icon3D><Globe className="w-14 h-14 mx-auto mb-3" /></Icon3D>
                <p className="font-heading text-3xl md:text-4xl font-bold text-heading">
                  <StaticCounterNeon value="3700" suffix="+" />
                </p>
                <p className="text-body text-base mt-2">Agents in Sponsor Network</p>
              </NeonCard>
            </RevealFromRight>
          </div>
        </div>
      </div>
      </section>
    </GlassPanel>
  );
}
