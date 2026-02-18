'use client';

import { H2, SecondaryButton } from '@saa/shared/components/saa';
import { IconCard } from '@saa/shared/components/saa/cards/IconCard';
import { Rocket, BarChart3, GraduationCap, TrendingUp, LifeBuoy } from 'lucide-react';

const CARDS = [
  {
    icon: Rocket,
    title: 'Guided Launch',
    text: 'Launch your business with clarity from day one.',
    theme: 'yellow' as const,
  },
  {
    icon: BarChart3,
    title: 'Done-For-You Lead Systems',
    text: 'Pre-built business assets ready for implementation.',
    theme: 'blue' as const,
  },
  {
    icon: GraduationCap,
    title: 'Training & Development',
    text: 'Practical training designed for production growth.',
    theme: 'yellow' as const,
  },
  {
    icon: TrendingUp,
    title: 'Income Growth & Attraction',
    text: 'Structured attraction pathways with team support.',
    theme: 'blue' as const,
  },
  {
    icon: LifeBuoy,
    title: 'Ongoing Support',
    text: 'Accessible support and expanding resources.',
    theme: 'yellow' as const,
  },
];

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
      {/* Orbital Rings Background — inline styles to guarantee rendering */}
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
        {/* Ring 1 */}
        <div
          className="orbital-ring"
          style={{
            ...ringBase,
            width: 'min(900px, 80vw)',
            height: 'min(350px, 30vw)',
            border: '1px solid rgba(255, 215, 0, 0.12)',
            animation: 'wyg-orbit 35s linear infinite',
          }}
        />
        {/* Ring 2 */}
        <div
          className="orbital-ring"
          style={{
            ...ringBase,
            width: 'min(1100px, 95vw)',
            height: 'min(420px, 36vw)',
            border: '1px solid rgba(255, 215, 0, 0.08)',
            animation: 'wyg-orbit 50s linear infinite reverse',
            animationDelay: '-15s',
          }}
        />
        {/* Ring 3 */}
        <div
          className="orbital-ring"
          style={{
            ...ringBase,
            width: 'min(700px, 65vw)',
            height: 'min(280px, 24vw)',
            border: '1px solid rgba(255, 215, 0, 0.15)',
            animation: 'wyg-orbit 28s linear infinite',
            animationDelay: '-10s',
          }}
        />
        {/* Ring 4 */}
        <div
          className="orbital-ring"
          style={{
            ...ringBase,
            width: 'min(1300px, 110vw)',
            height: 'min(500px, 42vw)',
            border: '1px solid rgba(255, 215, 0, 0.06)',
            animation: 'wyg-orbit 60s linear infinite reverse',
            animationDelay: '-25s',
          }}
        />
        {/* Center glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 'min(600px, 50vw)',
            height: 'min(600px, 50vw)',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(255, 215, 0, 0.06) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
      </div>

      {/* Keyframes — global style tag for the orbit animation */}
      <style>{`
        @keyframes wyg-orbit {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>

      <div className="mx-auto relative z-10" style={{ maxWidth: '1400px' }}>
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <H2>What You Get Inside SAA</H2>
          <p className="text-body opacity-60 mt-4 max-w-[750px] mx-auto">
            Systems, training, and support built around how agents actually work &mdash; all accessible from your{' '}
            <a href="/exp-realty-sponsor#agent-portal-walkthrough" style={{ color: '#ffd700', textDecoration: 'underline', textUnderlineOffset: '3px' }}>Agent Portal</a>.
          </p>
        </div>

        {/* Cards */}
        <div className="flex flex-wrap gap-5">
          {CARDS.map((card) => (
            <div key={card.title} className="flex-1" style={{ minWidth: '260px' }}>
              <IconCard icon={<card.icon className="w-6 h-6" />} theme={card.theme} className="h-full">
                <h3 className="text-h6 mb-2">{card.title}</h3>
                <p className="text-body" style={{ fontSize: 'clamp(14px, calc(13.5px + 0.2vw), 18px)' }}>{card.text}</p>
              </IconCard>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10 md:mt-12">
          <SecondaryButton href="/exp-realty-sponsor">See SAA's Full Value Stack</SecondaryButton>
        </div>
      </div>
    </section>
  );
}
