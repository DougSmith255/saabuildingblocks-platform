'use client';

import { H2, SecondaryButton } from '@saa/shared/components/saa';
import { IconCard } from '@saa/shared/components/saa/cards/IconCard';
import { Rocket, BarChart3, GraduationCap, TrendingUp, LifeBuoy } from 'lucide-react';

/**
 * What You Get with SAA — Homepage Section
 *
 * Three versions (A/B/C) for comparison. Uses IconCards with the same
 * 5 benefit cards from the team value page. Toggle activeVersion below.
 */

const CARDS = [
  {
    icon: Rocket,
    title: 'Guided Launch',
    text: 'Launch your business with clarity from day one.',
    theme: 'yellow' as const,
  },
  {
    icon: BarChart3,
    title: 'Marketing & Lead Systems',
    text: 'Built-in systems that drive visibility and leads.',
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
    text: 'Expand income through optional attraction pathways.',
    theme: 'blue' as const,
  },
  {
    icon: LifeBuoy,
    title: 'Ongoing Support',
    text: 'Accessible support and expanding resources.',
    theme: 'yellow' as const,
  },
];

/* ─── Shared header + CTA ─── */
function SectionHeader() {
  return (
    <div className="text-center mb-10 md:mb-12">
      <H2>What You Get Inside SAA</H2>
      <p className="text-body opacity-60 mt-4 max-w-[750px] mx-auto">
        Systems, training, and support built around how agents actually work &mdash; all accessible from your <a href="/exp-realty-sponsor#agent-portal-walkthrough" style={{ color: '#ffd700', textDecoration: 'underline', textUnderlineOffset: '3px' }}>Agent Portal</a>.
      </p>
    </div>
  );
}

function SectionCTA() {
  return (
    <div className="text-center mt-10 md:mt-12">
      <SecondaryButton href="/exp-realty-sponsor">See the Full Value Stack</SecondaryButton>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   VERSION A — 3+2 Grid (mirrors team value page layout)
   ═══════════════════════════════════════════════════════ */
function VersionA() {
  return (
    <section className="py-16 md:py-24 px-6 relative">
      <div className="mx-auto relative z-10" style={{ maxWidth: '1200px' }}>
        <SectionHeader />

        {/* Top row: 3 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CARDS.slice(0, 3).map((card) => (
            <IconCard key={card.title} icon={<card.icon className="w-6 h-6" />} theme={card.theme}>
              <h3 className="text-h6 mb-2">{card.title}</h3>
              <p className="text-body">{card.text}</p>
            </IconCard>
          ))}
        </div>

        {/* Bottom row: 2 cards spanning full width */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
          {CARDS.slice(3).map((card) => (
            <IconCard key={card.title} icon={<card.icon className="w-6 h-6" />} theme={card.theme}>
              <h3 className="text-h6 mb-2">{card.title}</h3>
              <p className="text-body">{card.text}</p>
            </IconCard>
          ))}
        </div>

        <SectionCTA />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   VERSION B — Compact 5-column grid (desktop) / stacked (mobile)
   All 5 cards in one row on large screens
   ═══════════════════════════════════════════════════════ */
function VersionB() {
  return (
    <section className="py-16 md:py-24 px-6 relative">
      <div className="mx-auto relative z-10" style={{ maxWidth: '1400px' }}>
        <SectionHeader />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {CARDS.map((card) => (
            <IconCard key={card.title} icon={<card.icon className="w-6 h-6" />} theme={card.theme}>
              <h3 className="text-h6 mb-2">{card.title}</h3>
              <p className="text-body" style={{ fontSize: 'clamp(14px, calc(13.5px + 0.2vw), 18px)' }}>{card.text}</p>
            </IconCard>
          ))}
        </div>

        <SectionCTA />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   VERSION C — 2+3 Grid (wider top cards, 3 compact bottom)
   Alternating gold/blue with larger hero cards on top
   ═══════════════════════════════════════════════════════ */
function VersionC() {
  return (
    <section className="py-16 md:py-24 px-6 relative">
      <div className="mx-auto relative z-10" style={{ maxWidth: '1200px' }}>
        <SectionHeader />

        {/* Top row: 2 larger feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {CARDS.slice(0, 2).map((card) => (
            <IconCard key={card.title} icon={<card.icon className="w-7 h-7" />} theme={card.theme}>
              <h3 className="text-h6 mb-2">{card.title}</h3>
              <p className="text-body">{card.text}</p>
            </IconCard>
          ))}
        </div>

        {/* Bottom row: 3 compact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
          {CARDS.slice(2).map((card) => (
            <IconCard key={card.title} icon={<card.icon className="w-6 h-6" />} theme={card.theme}>
              <h3 className="text-h6 mb-2">{card.title}</h3>
              <p className="text-body">{card.text}</p>
            </IconCard>
          ))}
        </div>

        <SectionCTA />
      </div>
    </section>
  );
}

/* ─── Show all 3 versions for comparison ─── */
export function WhatYouGet() {
  return (
    <>
      {/* Version A label */}
      <div className="text-center py-4" style={{ background: 'rgba(255,215,0,0.08)', borderTop: '1px solid rgba(255,215,0,0.2)', borderBottom: '1px solid rgba(255,215,0,0.2)' }}>
        <p className="text-h6" style={{ color: '#ffd700' }}>VERSION A &mdash; 3+2 Grid</p>
      </div>
      <VersionA />

      {/* Version B label */}
      <div className="text-center py-4" style={{ background: 'rgba(0,191,255,0.08)', borderTop: '1px solid rgba(0,191,255,0.2)', borderBottom: '1px solid rgba(0,191,255,0.2)' }}>
        <p className="text-h6" style={{ color: '#00bfff' }}>VERSION B &mdash; 5-Column Row</p>
      </div>
      <VersionB />

      {/* Version C label */}
      <div className="text-center py-4" style={{ background: 'rgba(255,215,0,0.08)', borderTop: '1px solid rgba(255,215,0,0.2)', borderBottom: '1px solid rgba(255,215,0,0.2)' }}>
        <p className="text-h6" style={{ color: '#ffd700' }}>VERSION C &mdash; 2+3 Grid</p>
      </div>
      <VersionC />
    </>
  );
}
