'use client';

import { SecondaryButton } from '@saa/shared/components/saa/buttons';
import { H2 } from '@saa/shared/components/saa/headings';
import { Briefcase, GraduationCap, Users, Globe, Target, Rocket } from 'lucide-react';

const CARDS = [
  {
    icon: Briefcase,
    title: 'Done-For-You Business Assets',
    text: 'Ready-to-launch marketing funnels and lead tools.',
    theme: 'yellow' as const,
  },
  {
    icon: GraduationCap,
    title: 'Elite On-Demand Training',
    text: 'Advanced blueprints for modern production and scale.',
    theme: 'blue' as const,
  },
  {
    icon: Users,
    title: 'Leadership & Community',
    text: 'Tactical implementation sessions with top active producers.',
    theme: 'yellow' as const,
  },
  {
    icon: Globe,
    title: 'Private Referrals & Global Collaboration',
    text: 'Relationship-driven referral networks and cross-market collaboration.',
    theme: 'blue' as const,
  },
  {
    icon: Target,
    title: 'Agent Attraction Infrastructure',
    text: 'Automated attraction systems and structured pathways with team support.',
    theme: 'yellow' as const,
  },
  {
    icon: Rocket,
    title: 'Professional Onboarding',
    text: 'From joining to operating in 24 hours.',
    theme: 'blue' as const,
  },
];

const THEMES = {
  yellow: {
    primary: '#ffd700', primaryRgb: '255, 215, 0',
    border: 'rgba(255,215,0,0.15)', hoverGlow: 'rgba(255,215,0,0.12)',
    iconBg: 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(200,160,0,0.1))',
    iconBorder: 'rgba(255,215,0,0.3)', iconGlow: 'rgba(255,215,0,0.2)',
    iconInnerBg: 'linear-gradient(180deg, rgba(15,15,10,0.95), rgba(10,10,5,0.98))',
    iconColor: '#ffd700', iconDropShadow: 'rgba(255,215,0,0.5)',
  },
  blue: {
    primary: '#00bfff', primaryRgb: '0, 191, 255',
    border: 'rgba(0,191,255,0.15)', hoverGlow: 'rgba(0,191,255,0.12)',
    iconBg: 'linear-gradient(135deg, rgba(0,191,255,0.2), rgba(0,120,200,0.1))',
    iconBorder: 'rgba(0,191,255,0.3)', iconGlow: 'rgba(0,191,255,0.2)',
    iconInnerBg: 'linear-gradient(180deg, rgba(15,20,30,0.95), rgba(5,10,20,0.98))',
    iconColor: '#00bfff', iconDropShadow: 'rgba(0,191,255,0.5)',
  },
};

/* Shared ring style */
const ringBase: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  borderRadius: '50%',
  pointerEvents: 'none',
};

export function WhatYouGet() {
  return (
    <section className="py-16 md:py-24 px-6 relative overflow-hidden">
      {/* Orbital Rings Background */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <div className="orbital-ring" style={{ ...ringBase, width: 'min(900px, 80vw)', height: 'min(350px, 30vw)', border: '1px solid rgba(255, 215, 0, 0.12)', animation: 'wyg-orbit 35s linear infinite' }} />
        <div className="orbital-ring" style={{ ...ringBase, width: 'min(1100px, 95vw)', height: 'min(420px, 36vw)', border: '1px solid rgba(255, 215, 0, 0.08)', animation: 'wyg-orbit 50s linear infinite reverse', animationDelay: '-15s' }} />
        <div className="orbital-ring" style={{ ...ringBase, width: 'min(700px, 65vw)', height: 'min(280px, 24vw)', border: '1px solid rgba(255, 215, 0, 0.15)', animation: 'wyg-orbit 28s linear infinite', animationDelay: '-10s' }} />
        <div className="orbital-ring" style={{ ...ringBase, width: 'min(1300px, 110vw)', height: 'min(500px, 42vw)', border: '1px solid rgba(255, 215, 0, 0.06)', animation: 'wyg-orbit 60s linear infinite reverse', animationDelay: '-25s' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: 'min(600px, 50vw)', height: 'min(600px, 50vw)', transform: 'translate(-50%, -50%)', background: 'radial-gradient(circle, rgba(255, 215, 0, 0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes wyg-orbit {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes wyg-icon-pulse-yellow {
          0%, 100% { box-shadow: 0 0 30px rgba(255,215,0,0.2), inset 0 0 20px rgba(255,215,0,0.1); }
          50% { box-shadow: 0 0 40px rgba(255,215,0,0.35), inset 0 0 25px rgba(255,215,0,0.15); }
        }
        @keyframes wyg-icon-pulse-blue {
          0%, 100% { box-shadow: 0 0 30px rgba(0,191,255,0.2), inset 0 0 20px rgba(0,191,255,0.1); }
          50% { box-shadow: 0 0 40px rgba(0,191,255,0.35), inset 0 0 25px rgba(0,191,255,0.15); }
        }
      `}</style>

      <div className="mx-auto relative z-10" style={{ maxWidth: '1400px' }}>
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <H2 style={{ marginBottom: '0.5rem' }}>Six Systems Inside the SAA Portal</H2>
          <p className="text-body opacity-60 max-w-[750px] mx-auto">
            Get the professional resources of a high-level organization with the 100% freedom of a solo agent. No splits. No sponsor fees. No added costs beyond eXp. Just a stronger eXp experience.
          </p>
        </div>

        {/* Cards - two independent rows */}
        {[CARDS.slice(0, 3), CARDS.slice(3)].map((row, rowIdx) => (
          <div key={rowIdx} className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5${rowIdx > 0 ? ' mt-5' : ''}`}>
            {row.map((card) => {
              const colors = THEMES[card.theme];
              return (
                <div key={card.title}>
                  <div
                    className="group relative rounded-2xl p-6 md:p-8 text-center overflow-hidden h-full"
                    style={{
                      background: 'linear-gradient(135deg, rgba(20,20,20,0.95) 0%, rgba(12,12,12,0.98) 100%)',
                      border: `1px solid ${colors.border}`,
                      boxShadow: '0 0 0 1px rgba(255,255,255,0.02), 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)',
                    }}
                  >
                    {/* Hover glow */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
                      style={{ background: `radial-gradient(ellipse 80% 60% at 50% 30%, ${colors.hoverGlow} 0%, transparent 70%)` }}
                    />

                    {/* Icon with animated glow ring */}
                    <div className="relative mx-auto mb-5 w-16 h-16 md:w-20 md:h-20">
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: colors.iconBg,
                          boxShadow: `0 0 30px ${colors.iconGlow}, inset 0 0 20px rgba(${colors.primaryRgb}, 0.1)`,
                          animation: `wyg-icon-pulse-${card.theme} 3s ease-in-out infinite`,
                        }}
                      />
                      <div
                        className="absolute inset-2 rounded-full flex items-center justify-center"
                        style={{
                          background: colors.iconInnerBg,
                          border: `1px solid ${colors.iconBorder}`,
                        }}
                      >
                        <div style={{ color: colors.iconColor, filter: `drop-shadow(0 0 8px ${colors.iconDropShadow})` }}>
                          <card.icon className="w-6 h-6" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      <h3 className="text-h6 mb-2 flex items-center justify-center" style={{ minHeight: '2.4em' }}>{card.title}</h3>
                      <p className="text-body" style={{ fontSize: 'clamp(14px, calc(13.5px + 0.2vw), 18px)' }}>{card.text}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* CTA */}
        <div className="text-center mt-10 md:mt-12">
          <SecondaryButton href="/exp-realty-sponsor">See SAA&#39;s Value</SecondaryButton>
        </div>
      </div>
    </section>
  );
}
