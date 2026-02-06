'use client';

import { Icon3D, SecondaryButton } from '@saa/shared/components/saa';
import { GlassPanel } from '@saa/shared/components/saa/backgrounds/GlassPanel';
import { Globe, Users, TrendingUp } from 'lucide-react';

// Number style - H2 3D styling (larger than text)
const pillarNumberStyle: React.CSSProperties = {
  color: '#bfbdb0',
  fontWeight: 700,
  minWidth: '1.5em',
  fontSize: '1.75em', // 75% larger
  textShadow: `
    /* WHITE CORE */
    0 0 0.01em #fff,
    0 0 0.02em #fff,
    0 0 0.03em rgba(255,255,255,0.8),
    /* WARM WHITE GLOW - extended and dilute for sharp definition */
    0 0 0.04em rgba(255,250,240,0.7),
    0 0 0.08em rgba(255, 255, 255, 0.35),
    0 0 0.14em rgba(255, 255, 255, 0.15),
    0 0 0.22em rgba(200, 200, 200, 0.08),
    /* METAL BACKING (3D depth - thicker) */
    0.02em 0.02em 0 #2a2a2a,
    0.04em 0.04em 0 #222222,
    0.06em 0.06em 0 #1a1a1a,
    0.08em 0.08em 0 #141414,
    0.10em 0.10em 0 #0f0f0f,
    0.12em 0.12em 0 #080808
  `,
  transform: 'perspective(800px) rotateX(8deg)',
  filter: 'drop-shadow(0.04em 0.04em 0.06em rgba(0,0,0,0.6))',
};

// Label style (Smart Agent Alliance, Inside eXp Realty, Stronger Together) - H2 3D styling without H2 sizing
const pillarLabelStyle: React.CSSProperties = {
  color: '#bfbdb0',
  fontWeight: 700,
  textShadow: `
    /* WHITE CORE */
    0 0 0.01em #fff,
    0 0 0.02em #fff,
    0 0 0.03em rgba(255,255,255,0.8),
    /* WARM WHITE GLOW - extended and dilute for sharp definition */
    0 0 0.04em rgba(255,250,240,0.7),
    0 0 0.08em rgba(255, 255, 255, 0.35),
    0 0 0.14em rgba(255, 255, 255, 0.15),
    0 0 0.22em rgba(200, 200, 200, 0.08),
    /* METAL BACKING (3D depth - thicker) */
    0.02em 0.02em 0 #2a2a2a,
    0.04em 0.04em 0 #222222,
    0.06em 0.06em 0 #1a1a1a,
    0.08em 0.08em 0 #141414,
    0.10em 0.10em 0 #0f0f0f,
    0.12em 0.12em 0 #080808
  `,
  transform: 'perspective(800px) rotateX(8deg)',
  filter: 'drop-shadow(0.04em 0.04em 0.06em rgba(0,0,0,0.6))',
};

// Body text - plain, no glow
const pillarTextStyle: React.CSSProperties = {
  color: '#bfbdb0', // Body text color
  fontWeight: 400,
  fontFamily: 'var(--font-synonym), system-ui, sans-serif',
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
      `}</style>
      <div
        className="absolute inset-0 pointer-events-none z-[3] rounded-3xl"
        style={{
          animation: 'whiteVignetteGlow 4s ease-in-out infinite',
        }}
      />
      <GlassPanel variant="champagne">
        <section className="px-6" style={{ paddingTop: 'calc(1.5rem + 15px)', paddingBottom: 'calc(1.5rem + 15px)' }}>
        <div className="mx-auto" style={{ maxWidth: '1500px' }}>
          <div className="flex flex-col gap-3 items-center">
            <div className="flex flex-col gap-3 text-left">
              <div className="flex items-center gap-3">
                <span className="text-body text-sm md:text-base" style={pillarNumberStyle}>01</span>
                <span className="text-body text-sm md:text-base" style={pillarTextStyle}><span style={pillarLabelStyle}>Smart Agent Alliance</span>, sponsor support built and provided at no cost to agents.</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-body text-sm md:text-base" style={pillarNumberStyle}>02</span>
                <span className="text-body text-sm md:text-base" style={pillarTextStyle}><span style={pillarLabelStyle}>Inside eXp Realty</span>, the largest independent real estate brokerage in the world.</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-body text-sm md:text-base" style={pillarNumberStyle}>03</span>
                <span className="text-body text-sm md:text-base" style={pillarTextStyle}><span style={pillarLabelStyle}>Stronger Together</span>, eXp infrastructure plus SAA systems drive higher agent success.</span>
              </div>
            </div>
            <div className="mt-3">
              <SecondaryButton href="/about-exp-realty">
                Learn How Sponsorship Works at eXp
              </SecondaryButton>
            </div>
          </div>
        </div>
      </section>
      </GlassPanel>
    </div>
  );
}

export default ValuePillarsTab;
