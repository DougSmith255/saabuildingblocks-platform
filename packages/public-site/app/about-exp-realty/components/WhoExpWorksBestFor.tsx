'use client';

import { GlassPanel } from '@saa/shared/components/saa/backgrounds';
import { H2 } from '@saa/shared/components/saa/headings';
import { Target, Settings, RefreshCw } from 'lucide-react';

const EXP_FIT_VALUES = [
  { icon: Target, keyword: 'Independence', rest: 'over hierarchy' },
  { icon: Settings, keyword: 'Systems', rest: 'over micromanagement' },
  { icon: RefreshCw, keyword: 'Flexibility', rest: 'in how they build their business' },
];

export default function WhoExpWorksBestForSection() {
  return (
    <GlassPanel variant="champagne">
      <section id="fit" className="py-[50px] px-4 sm:px-8 md:px-12 relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto relative">
          <div className="text-center mb-12">
            <H2>WHO EXP WORKS BEST FOR</H2>
            <p className="text-body mt-4" style={{ color: 'var(--color-body-text)' }}>eXp tends to work best for agents who value:</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 mb-10">
            {EXP_FIT_VALUES.map((value, i) => (
              <div
                key={value.keyword}
                className="group relative rounded-2xl p-6 md:p-8 text-center overflow-hidden exp-fit-card-grainy"
                style={{
                  border: '1px solid rgba(255,255,255,0.06)',
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.02), 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)',
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
                  style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(229,228,221,0.08) 0%, transparent 70%)' }}
                />

                <div className="relative mx-auto mb-5 w-16 h-16 md:w-20 md:h-20">
                  {/* Static base glow */}
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, rgba(229,228,221,0.15), rgba(191,189,176,0.08))',
                      boxShadow: '0 0 30px rgba(229,228,221,0.15), inset 0 0 20px rgba(229,228,221,0.08)',
                    }}
                  />
                  {/* Pulse overlay - opacity animation (GPU-composited) */}
                  <div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      boxShadow: '0 0 40px rgba(229,228,221,0.25), inset 0 0 25px rgba(229,228,221,0.12)',
                      animation: 'expFitIconPulseOpacity 3s ease-in-out infinite',
                      animationDelay: `${i * 0.4}s`,
                      willChange: 'opacity',
                    }}
                  />
                  <div
                    className="absolute inset-2 rounded-full flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(180deg, rgba(20,20,20,0.95), rgba(12,12,12,0.98))',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <value.icon size={24} className="md:w-7 md:h-7" style={{ color: '#e5e4dd', filter: 'drop-shadow(0 0 8px rgba(229,228,221,0.4))' }} />
                  </div>
                </div>

                <p className="text-body relative z-10">
                  <span
                    className="block text-h5 mb-1"
                    style={{ color: '#e5e4dd', textShadow: '0 0 20px rgba(229,228,221,0.2)' }}
                  >
                    {value.keyword}
                  </span>
                  <span style={{ color: 'var(--color-body-text)', opacity: 0.8 }}>{value.rest}</span>
                </p>
              </div>
            ))}
          </div>

          <div
            className="text-center max-w-[700px] mx-auto px-6 py-4 rounded-xl"
            style={{
              background: 'rgba(229,228,221,0.03)',
              border: '1px solid rgba(229,228,221,0.08)',
            }}
          >
            <p className="text-body text-sm" style={{ color: 'var(--color-body-text)', opacity: 0.8 }}>
              Agents who prefer structured oversight can choose to join an eXp production team after joining and selecting a sponsor.
            </p>
          </div>
        </div>

        <style>{`
          @keyframes expFitIconPulseOpacity {
            0%, 100% { opacity: 0; }
            50% { opacity: 1; }
          }

          .exp-fit-card-grainy {
            background:
              url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"),
              linear-gradient(135deg, rgba(20,20,20,0.95) 0%, rgba(12,12,12,0.98) 100%);
            background-blend-mode: overlay, normal;
          }
        `}</style>
      </section>
    </GlassPanel>
  );
}
