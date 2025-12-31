'use client';

import { Icon3D } from '@saa/shared/components/saa';
import { GlassPanel } from '@saa/shared/components/saa/backgrounds/GlassPanel';
import { Globe, Users, TrendingUp } from 'lucide-react';

const PILLAR_GLOW_COLOR = '#bca24a';

// Number style with neon glow and metal backing (same as old pillar text)
const pillarNumberStyle: React.CSSProperties = {
  color: PILLAR_GLOW_COLOR,
  fontWeight: 700,
  minWidth: '1.5em',
  textShadow: `
    /* WHITE CORE */
    0 0 0.01em #fff,
    0 0 0.02em #fff,
    0 0 0.03em rgba(255,255,255,0.8),
    /* GOLD GLOW */
    0 0 0.05em ${PILLAR_GLOW_COLOR},
    0 0 0.09em rgba(188, 162, 74, 0.8),
    0 0 0.13em rgba(188, 162, 74, 0.55),
    0 0 0.18em rgba(188, 162, 74, 0.35),
    /* METAL BACKING (4 layers) */
    0.03em 0.03em 0 #2a2a2a,
    0.045em 0.045em 0 #1a1a1a,
    0.06em 0.06em 0 #0f0f0f,
    0.075em 0.075em 0 #080808
  `,
  filter: `drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1) drop-shadow(0 0 0.08em rgba(188, 162, 74, 0.25))`,
};

// Body text - plain, no glow
const pillarTextStyle: React.CSSProperties = {
  color: '#e5e4dd', // Standard body text color
  fontWeight: 500,
};

/**
 * ValuePillarsTab - Emerald "tab" section with value proposition bullets
 *
 * Designed to wrap around the top of MediaLogos section.
 * Has extra bottom padding that overlaps MediaLogos's top corners.
 */
export function ValuePillarsTab() {
  return (
    <div
      className="relative z-10"
      style={{
        marginBottom: '-38px', // Extend down under MediaLogos (extra 28px)
      }}
    >
      {/* Shadow underneath the card for 3D depth */}
      <div
        className="absolute left-8 right-8"
        style={{
          bottom: '-12px',
          height: '35px',
          background: 'radial-gradient(ellipse 60% 100% at center, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 80%)',
          filter: 'blur(12px)',
          zIndex: -1,
          borderRadius: '50%',
        }}
      />
      {/* Extra background layer for less transparency - this instance only */}
      <div
        className="absolute inset-0 rounded-3xl"
        style={{
          background: 'linear-gradient(180deg, rgba(22, 22, 22, 0.94) 0%, rgba(15, 15, 15, 0.97) 100%)', // Darker grayscale, more opaque
          pointerEvents: 'none',
        }}
      />
      {/* White vignette glow animation */}
      <style>{`
        @keyframes whiteVignetteGlow {
          0%, 100% {
            box-shadow:
              inset 0 20px 30px -15px rgba(255, 255, 255, 0.12),
              inset 0 -20px 30px -15px rgba(255, 255, 255, 0.12),
              inset 20px 0 30px -15px rgba(255, 255, 255, 0.12),
              inset -20px 0 30px -15px rgba(255, 255, 255, 0.12);
          }
          50% {
            box-shadow:
              inset 0 35px 45px -20px rgba(255, 255, 255, 0.22),
              inset 0 -35px 45px -20px rgba(255, 255, 255, 0.22),
              inset 35px 0 45px -20px rgba(255, 255, 255, 0.22),
              inset -35px 0 45px -20px rgba(255, 255, 255, 0.22);
          }
        }
        @keyframes pillarGlowBreathe {
          0%, 100% {
            filter: drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1) drop-shadow(0 0 0.08em rgba(188, 162, 74, 0.25));
          }
          50% {
            filter: drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1.15) drop-shadow(0 0 0.15em rgba(188, 162, 74, 0.45));
          }
        }
        .pillar-number {
          animation: pillarGlowBreathe 4s ease-in-out infinite;
        }
      `}</style>
      <div
        className="absolute inset-0 pointer-events-none z-[3] rounded-3xl"
        style={{
          animation: 'whiteVignetteGlow 4s ease-in-out infinite',
        }}
      />
      <GlassPanel variant="champagne">
        <section className="px-6" style={{ paddingTop: 'calc(1.5rem + 15px)', paddingBottom: 'calc(1.5rem + 15px)' }}>
        <div className="mx-auto" style={{ maxWidth: '900px' }}>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 justify-center">
              <span className="pillar-number text-body text-sm md:text-base" style={pillarNumberStyle}>01</span>
              <span className="text-body text-sm md:text-base" style={pillarTextStyle}><span className="pillar-number" style={pillarNumberStyle}>Smart Agent Alliance</span>, sponsor support built and provided at no cost to agents.</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <span className="pillar-number text-body text-sm md:text-base" style={pillarNumberStyle}>02</span>
              <span className="text-body text-sm md:text-base" style={pillarTextStyle}><span className="pillar-number" style={pillarNumberStyle}>Inside eXp Realty</span>, the largest independent real estate brokerage in the world.</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <span className="pillar-number text-body text-sm md:text-base" style={pillarNumberStyle}>03</span>
              <span className="text-body text-sm md:text-base" style={pillarTextStyle}><span className="pillar-number" style={pillarNumberStyle}>Stronger Together</span>, eXp infrastructure plus SAA systems drive higher agent success.</span>
            </div>
          </div>
        </div>
      </section>
      </GlassPanel>
    </div>
  );
}

export default ValuePillarsTab;
