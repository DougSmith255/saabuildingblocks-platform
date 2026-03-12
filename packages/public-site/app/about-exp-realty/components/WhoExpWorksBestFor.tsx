'use client';

import { useEffect, useRef, useState } from 'react';
import { GlassPanel } from '@saa/shared/components/saa/backgrounds';
import { H2 } from '@saa/shared/components/saa/headings';
import { Compass, Settings, GitBranch } from 'lucide-react';

const PERSONAS = [
  {
    keyword: 'Independence',
    rest: 'over hierarchy',
    subtitle: 'Agents who thrive with autonomy and self-direction.',
    Icon: Compass,
    borderColor: 'rgba(0,191,255,0.25)',
    glowColor: 'rgba(0,191,255,0.08)',
    accentColor: '#00bfff',
    variant: 'tall' as const,
  },
  {
    keyword: 'Systems',
    rest: 'over micromanagement',
    subtitle: 'Agents who prefer repeatable processes over ad-hoc guidance.',
    Icon: Settings,
    borderColor: 'rgba(0,191,255,0.2)',
    glowColor: 'rgba(0,191,255,0.06)',
    accentColor: '#00bfff',
    variant: 'wide' as const,
  },
  {
    keyword: 'Flexibility',
    rest: 'in how they build their business',
    subtitle: 'Agents who want to customize their approach and offerings.',
    Icon: GitBranch,
    borderColor: 'rgba(0,191,255,0.15)',
    glowColor: 'rgba(0,191,255,0.05)',
    accentColor: '#00bfff',
    variant: 'rounded' as const,
  },
];

export default function WhoExpWorksBestForSection() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <GlassPanel variant="expBlueCrosshatch">
    <section id="fit" ref={sectionRef} className="py-[50px] px-4 sm:px-8 md:px-12 relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto relative">
        <div className="text-center mb-6">
          <H2>WHO EXP WORKS BEST FOR</H2>
          <p className="text-body mt-4" style={{ color: 'var(--color-body-text)' }}>eXp tends to work best for agents who value:</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6 mb-10">
          {PERSONAS.map((persona, i) => (
            <div
              key={persona.keyword}
              className={`who-exp-card who-exp-card-${persona.variant} group relative overflow-hidden`}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(24px)',
                transition: `opacity 0.6s ease ${i * 120}ms, transform 0.6s ease ${i * 120}ms`,
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
                style={{ background: `radial-gradient(ellipse 80% 60% at 50% 30%, ${persona.glowColor} 0%, transparent 70%)` }}
              />

              {/* Icon area */}
              <div className="who-exp-illustration relative flex items-center justify-center">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center"
                  style={{
                    background: `rgba(0,191,255,0.06)`,
                    border: '1.5px solid rgba(0,191,255,0.2)',
                    boxShadow: '0 0 30px rgba(0,191,255,0.08)',
                  }}
                >
                  <persona.Icon size={40} style={{ color: '#00bfff', opacity: 0.8 }} />
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10 px-6 pb-6">
                <p className="text-body relative z-10">
                  <span
                    className="block text-h5 mb-1"
                    style={{ color: '#e5e4dd', textShadow: '0 0 20px rgba(229,228,221,0.15)' }}
                  >
                    {persona.keyword}
                  </span>
                  <span style={{ color: 'var(--color-body-text)', opacity: 0.8 }}>{persona.rest}</span>
                </p>
                <p className="text-sm mt-2" style={{ color: 'var(--color-body-text)', opacity: 0.8 }}>{persona.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="text-center max-w-[700px] mx-auto px-6 py-4 rounded-xl"
          style={{
            background: 'rgba(229,228,221,0.03)',
            border: '1px solid rgba(229,228,221,0.08)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.6s ease 400ms, transform 0.6s ease 400ms',
          }}
        >
          <p className="text-body text-sm" style={{ color: 'var(--color-body-text)', opacity: 0.8 }}>
            Agents who prefer structured oversight can choose to join an eXp production team after joining and selecting a sponsor.
          </p>
        </div>
      </div>

      <style>{`
        .who-exp-card {
          background: linear-gradient(180deg, rgba(18,20,28,0.95), rgba(10,12,18,0.98));
          transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
        }
        .who-exp-card:hover {
          transform: translateY(-4px) !important;
        }

        /* Tall portrait card - thin left accent */
        .who-exp-card-tall {
          border-radius: 16px;
          border: 1px solid rgba(0,191,255,0.12);
          border-left: 3px solid rgba(0,191,255,0.35);
        }
        .who-exp-card-tall:hover {
          border-color: rgba(0,191,255,0.25);
          border-left-color: rgba(0,191,255,0.6);
          box-shadow: 0 0 30px rgba(0,191,255,0.08), 0 8px 24px rgba(0,0,0,0.3);
        }

        /* Wide card - gradient bg accent */
        .who-exp-card-wide {
          border-radius: 16px;
          border: 1px solid rgba(0,191,255,0.1);
          background: linear-gradient(160deg, rgba(8,22,38,0.95), rgba(10,12,18,0.98)) !important;
        }
        .who-exp-card-wide:hover {
          border-color: rgba(0,191,255,0.25);
          box-shadow: 0 0 30px rgba(0,191,255,0.06), 0 8px 24px rgba(0,0,0,0.3);
        }

        /* Rounded card - softer shadow */
        .who-exp-card-rounded {
          border-radius: 24px;
          border: 1px solid rgba(0,191,255,0.08);
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }
        .who-exp-card-rounded:hover {
          border-color: rgba(0,191,255,0.2);
          box-shadow: 0 0 25px rgba(0,191,255,0.05), 0 8px 32px rgba(0,0,0,0.3) !important;
        }

        .who-exp-illustration {
          height: 140px;
          padding: 16px;
          overflow: hidden;
        }
        .who-exp-card:hover .who-exp-illustration > div {
          transform: scale(1.06);
          transition: transform 0.3s ease;
        }
      `}</style>
    </section>
    </GlassPanel>
  );
}
