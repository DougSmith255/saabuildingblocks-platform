'use client';

import { useEffect, useState } from 'react';
import { GlassPanel } from '@saa/shared/components/saa/backgrounds';
import { GrainCard, NeonCard } from '@saa/shared/components/saa/cards';
import { H2 } from '@saa/shared/components/saa/headings';
import { Ban } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Layers, TrendingUp, Users, Infinity } from 'lucide-react';

const EXP_PRIORITIES: { icon: LucideIcon; keyword: string; rest: string }[] = [
  { icon: Layers, keyword: 'Keep more', rest: 'take-home income' },
  { icon: TrendingUp, keyword: 'Earn stock', rest: 'in a publicly traded company' },
  { icon: Users, keyword: 'Gain more business', rest: 'through collaboration' },
  { icon: Infinity, keyword: 'Build income', rest: "that isn't tied to closings" },
];

const INTRO_CARDS = [
  { num: '01', text: 'Most brokerages focus on transactions.' },
  { num: '02', text: 'eXp focuses on transactions and income beyond.' },
];

const INTRO_TEXT_SHADOW_RED = `
  0 0 0.01em #fff,
  0 0 0.02em #fff,
  0 0 0.03em rgba(255,255,255,0.8),
  0 0 0.04em rgba(255,100,100,0.7),
  0 0 0.08em rgba(255, 80, 80, 0.35),
  0 0 0.14em rgba(255, 60, 60, 0.15),
  0 0 0.22em rgba(200, 50, 50, 0.08),
  0.02em 0.02em 0 #3a1a1a,
  0.04em 0.04em 0 #351515,
  0.06em 0.06em 0 #250f0f,
  0.08em 0.08em 0 #200a0a,
  0.10em 0.10em 0 #180808,
  0.12em 0.12em 0 #100404
`;

const INTRO_TEXT_SHADOW_BLUE = `
  0 0 0.01em #fff,
  0 0 0.02em #fff,
  0 0 0.03em rgba(255,255,255,0.8),
  0 0 0.04em rgba(0, 191, 255, 0.7),
  0 0 0.08em rgba(0, 191, 255, 0.35),
  0 0 0.14em rgba(0, 191, 255, 0.15),
  0 0 0.22em rgba(0, 150, 200, 0.08),
  0.02em 0.02em 0 #1a2a3a,
  0.04em 0.04em 0 #152535,
  0.06em 0.06em 0 #0f1a25,
  0.08em 0.08em 0 #0a1520,
  0.10em 0.10em 0 #081018,
  0.12em 0.12em 0 #040810
`;

const INTRO_TEXT_FILTER = 'drop-shadow(0.04em 0.04em 0.06em rgba(0,0,0,0.6))';

function IntroFlipCard() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => prev + 180);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const card01 = (
    <GrainCard padding="md" centered className="h-full intro-card-red">
      <span
        className="absolute top-3 left-3 flex items-center justify-center w-7 h-7 rounded"
        style={{
          background: 'rgba(255,80,80,0.15)',
          border: '1px solid rgba(255,80,80,0.3)',
        }}
      >
        <Ban size={16} style={{ color: '#ff5050' }} />
      </span>
      <div className="flex items-center justify-center h-full min-h-[100px]">
        <p
          className="text-h5 leading-relaxed text-center"
          style={{
            color: '#e8a0a0',
            fontFamily: 'var(--font-amulya), system-ui',
            textShadow: INTRO_TEXT_SHADOW_RED,
            transform: 'perspective(800px) rotateX(8deg)',
            filter: INTRO_TEXT_FILTER,
          }}
        >
          {INTRO_CARDS[0].text}
        </p>
      </div>
    </GrainCard>
  );

  const card02 = (
    <NeonCard padding="md" centered className="h-full">
      <span
        className="absolute top-3 left-3 flex items-center justify-center w-7 h-7 rounded"
        style={{
          background: 'rgba(0,191,255,0.15)',
          border: '1px solid rgba(0,191,255,0.3)',
        }}
      >
        <img src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/exp-x-logo-icon/public" alt="eXp" width={16} height={16} className="object-contain" />
      </span>
      <div className="flex items-center justify-center h-full min-h-[100px]">
        <p
          className="text-h5 leading-relaxed text-center"
          style={{
            color: '#b0d4e8',
            fontFamily: 'var(--font-amulya), system-ui',
            textShadow: INTRO_TEXT_SHADOW_BLUE,
            transform: 'perspective(800px) rotateX(8deg)',
            filter: INTRO_TEXT_FILTER,
          }}
        >
          {INTRO_CARDS[1].text}
        </p>
      </div>
    </NeonCard>
  );

  return (
    <div style={{ perspective: '1000px' }}>
      <div
        style={{
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: `rotateY(${rotation}deg)`,
        }}
      >
        <div style={{ backfaceVisibility: 'hidden' }}>
          {card01}
        </div>
        <div
          style={{
            backfaceVisibility: 'hidden',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            transform: 'rotateY(180deg)',
          }}
        >
          {card02}
        </div>
      </div>
    </div>
  );
}

export default function HowExpIsBuilt() {
  return (
    <GlassPanel variant="champagne">
      <section className="py-[50px]">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="text-center mb-10">
            <H2>How eXp is Built for Agents</H2>
          </div>

          {/* Mobile: Flip card */}
          <div className="sm:hidden max-w-[400px] mx-auto mb-10">
            <IntroFlipCard />
          </div>

          {/* Desktop: Side by side cards */}
          <div className="hidden sm:grid grid-cols-2 gap-5 max-w-[1400px] mx-auto mb-10">
            <div className="relative h-full">
              <GrainCard padding="md" centered className="h-full flex flex-col intro-card-red">
                <span
                  className="absolute top-3 left-3 flex items-center justify-center w-7 h-7 rounded"
                  style={{
                    background: 'rgba(255,80,80,0.15)',
                    border: '1px solid rgba(255,80,80,0.3)',
                  }}
                >
                  <Ban size={16} style={{ color: '#ff5050' }} />
                </span>
                <div className="flex items-center justify-center flex-1 min-h-[100px]">
                  <p
                    className="text-h5 leading-relaxed text-center"
                    style={{
                      color: '#e8a0a0',
                      fontFamily: 'var(--font-amulya), system-ui',
                      textShadow: INTRO_TEXT_SHADOW_RED,
                      transform: 'perspective(800px) rotateX(8deg)',
                      filter: INTRO_TEXT_FILTER,
                    }}
                  >
                    {INTRO_CARDS[0].text}
                  </p>
                </div>
              </GrainCard>
            </div>
            <div className="relative h-full">
              <NeonCard padding="md" centered className="h-full flex flex-col">
                <span
                  className="absolute top-3 left-3 flex items-center justify-center w-7 h-7 rounded"
                  style={{
                    background: 'rgba(0,191,255,0.15)',
                    border: '1px solid rgba(0,191,255,0.3)',
                  }}
                >
                  <img src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/exp-x-logo-icon/public" alt="eXp" width={16} height={16} className="object-contain" />
                </span>
                <div className="flex items-center justify-center flex-1 min-h-[100px]">
                  <p
                    className="text-h5 leading-relaxed text-center"
                    style={{
                      color: '#b0d4e8',
                      fontFamily: 'var(--font-amulya), system-ui',
                      textShadow: INTRO_TEXT_SHADOW_BLUE,
                      transform: 'perspective(800px) rotateX(8deg)',
                      filter: INTRO_TEXT_FILTER,
                    }}
                  >
                    {INTRO_CARDS[1].text}
                  </p>
                </div>
              </NeonCard>
            </div>
          </div>

          <h3 className="text-h4 text-center mb-5">
            eXp is structured to help agents:
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 max-w-[1400px] mx-auto">
            {EXP_PRIORITIES.map((priority, index) => (
              <div
                key={index}
                className="group relative rounded-2xl p-6 md:p-8 text-center overflow-hidden priority-card-grainy"
                style={{
                  border: '1px solid rgba(255,255,255,0.06)',
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.02), 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)',
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
                  style={{
                    background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(229,228,221,0.08) 0%, transparent 70%)',
                  }}
                />

                <div className="relative mx-auto mb-5 w-16 h-16 md:w-20 md:h-20">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, rgba(229,228,221,0.15), rgba(191,189,176,0.08))',
                      boxShadow: '0 0 30px rgba(229,228,221,0.15), inset 0 0 20px rgba(229,228,221,0.08)',
                      animation: 'priorityIconPulse 3s ease-in-out infinite',
                      animationDelay: `${index * 0.4}s`,
                    }}
                  />
                  <div
                    className="absolute inset-2 rounded-full flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(180deg, rgba(20,20,20,0.95), rgba(12,12,12,0.98))',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <priority.icon size={24} className="md:w-7 md:h-7" style={{ color: '#e5e4dd', filter: 'drop-shadow(0 0 8px rgba(229,228,221,0.4))' }} />
                  </div>
                </div>

                <p className="text-body relative z-10" style={{ color: 'var(--color-bodyText, #bfbdb0)' }}>
                  <span style={{ fontWeight: 700, color: 'var(--color-headingText, #e5e4dd)' }}>{priority.keyword}</span>{' '}
                  {priority.rest}
                </p>
              </div>
            ))}
          </div>

          <style>{`
            @keyframes priorityIconPulse {
              0%, 100% { box-shadow: 0 0 30px rgba(229,228,221,0.15), inset 0 0 20px rgba(229,228,221,0.08); }
              50% { box-shadow: 0 0 40px rgba(229,228,221,0.25), inset 0 0 25px rgba(229,228,221,0.12); }
            }

            .intro-card-red.generic-cyber-card-gold {
              border: 1px solid rgba(255,80,80,0.3) !important;
            }

            .priority-card-grainy {
              background:
                url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"),
                linear-gradient(135deg, rgba(20,20,20,0.95) 0%, rgba(12,12,12,0.98) 100%);
              background-blend-mode: overlay, normal;
            }
          `}</style>
        </div>
      </section>
    </GlassPanel>
  );
}
