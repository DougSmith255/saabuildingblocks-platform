'use client';

import React from 'react';
import { H1, H2, Tagline, GlassPanel, GenericCard } from '@saa/shared/components/saa';
import { GenericCyberCardGold } from '@saa/shared/components/saa/cards';
import { StickyHeroWrapper } from '@/components/shared/hero-effects/StickyHeroWrapper';
import { QuantumGridEffect } from '@/components/shared/hero-effects/QuantumGridEffect';
import { Ban } from 'lucide-react';

// ============================================================================
// SECTION 1 CONTENT — word for word
// ============================================================================

const SAA_PARAGRAPHS = [
  'Smart Agent Alliance (SAA) is an organized eXp Realty sponsor organization built to deliver real systems, training, income infrastructure, and community to independent agents.',
  'Smart Agent Alliance operates inside eXp Realty as sponsor-level infrastructure for agents who choose a SAA-aligned sponsor.',
];

const SAA_NOT_STATEMENTS = [
  'This is not a brokerage.',
  'This is not a production team.',
];

const SPONSORSHIP_INTRO =
  'At eXp Realty, agents join the brokerage directly and name an individual sponsor on their application. That sponsor sits within a broader seven-level upline structure.';

const SPONSORSHIP_LEAD = 'At eXp sponsor support varies widely.';

const SPONSORSHIP_BULLETS = [
  'Many sponsors provide little or no ongoing value.',
  'Some operate informal groups.',
  'Very few build durable infrastructure.',
];

// ============================================================================
// VERSION A — "Horizontal Rail Cards"
// Two stacked full-width GenericCard bands with thick left-border accents.
// Desktop: H2 left, body right (flex-row). Mobile: stacked.
// ============================================================================

function SectionVersionA() {
  return (
    <section className="py-12 md:py-20 px-4 sm:px-8 md:px-12">
      <div className="max-w-[1400px] mx-auto space-y-5">

        {/* ── What SAA Is ── */}
        <GenericCard padding="lg" style={{ borderLeft: '4px solid rgba(255,215,0,0.5)' }}>
          <div className="flex flex-col md:flex-row md:gap-10">
            {/* Left: H2 */}
            <div className="md:w-[320px] flex-shrink-0 mb-4 md:mb-0">
              <H2 style={{ textAlign: 'left', marginBottom: 0 }}>What Smart Agent Alliance Is</H2>
            </div>
            {/* Right: Body */}
            <div className="flex-1 space-y-4">
              {SAA_PARAGRAPHS.map((p, i) => (
                <p key={i} className="text-body" style={{ color: '#dcdbd5' }}>{p}</p>
              ))}
              <div className="flex flex-wrap gap-3 pt-2">
                {SAA_NOT_STATEMENTS.map((s, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-body"
                    style={{
                      fontSize: 'clamp(13px, 1.6vw, 15px)',
                      background: 'rgba(255,80,80,0.08)',
                      border: '1px solid rgba(255,80,80,0.2)',
                      color: '#e8a0a0',
                    }}
                  >
                    <Ban size={13} style={{ color: '#ff5050', flexShrink: 0 }} />
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </GenericCard>

        {/* ── How Sponsorship Works ── */}
        <GenericCard padding="lg" style={{ borderLeft: '4px solid rgba(0,191,255,0.4)' }}>
          <div className="flex flex-col md:flex-row md:gap-10">
            {/* Left: H2 */}
            <div className="md:w-[320px] flex-shrink-0 mb-4 md:mb-0">
              <H2 theme="blue" style={{ textAlign: 'left', marginBottom: 0 }}>How Sponsorship Works at eXp</H2>
            </div>
            {/* Right: Body */}
            <div className="flex-1 space-y-4">
              <p className="text-body" style={{ color: '#dcdbd5' }}>{SPONSORSHIP_INTRO}</p>
              <p className="text-body" style={{ color: '#b0d4e8' }}>{SPONSORSHIP_LEAD}</p>
              <ul className="space-y-2 pl-1">
                {SPONSORSHIP_BULLETS.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-body" style={{ color: '#dcdbd5' }}>
                    <span
                      className="mt-[7px] flex-shrink-0 w-2 h-2 rounded-full"
                      style={{
                        background: 'rgba(0,191,255,0.5)',
                        boxShadow: '0 0 6px rgba(0,191,255,0.3)',
                      }}
                    />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </GenericCard>

      </div>
    </section>
  );
}


// ============================================================================
// VERSION B — "GlassPanel Dual Columns"
// Single GlassPanel (champagne) wrapping two clean columns with a
// thin vertical gold divider (desktop). Mobile: stacked with horizontal rule.
// ============================================================================

function SectionVersionB() {
  return (
    <section className="py-12 md:py-20 px-4 sm:px-8 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <GlassPanel variant="champagne">
          <div className="px-6 py-10 md:px-10 md:py-14">
            <div className="flex flex-col md:flex-row md:gap-0">

              {/* ── Left Column: What SAA Is ── */}
              <div className="flex-1 md:pr-10">
                <H2 style={{ textAlign: 'left', marginBottom: '1.25rem' }}>What Smart Agent Alliance Is</H2>
                <div className="space-y-4">
                  {SAA_PARAGRAPHS.map((p, i) => (
                    <p key={i} className="text-body" style={{ color: '#dcdbd5' }}>{p}</p>
                  ))}
                  <div className="flex flex-col gap-2 pt-1">
                    {SAA_NOT_STATEMENTS.map((s, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-2 text-body"
                        style={{ color: '#e8a0a0', fontSize: 'clamp(13px, 1.6vw, 15px)' }}
                      >
                        <Ban size={14} style={{ color: '#ff5050', flexShrink: 0 }} />
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Divider ── */}
              {/* Desktop: vertical gold line */}
              <div className="hidden md:flex flex-col items-center mx-0">
                <div
                  className="w-px flex-1"
                  style={{
                    background: 'linear-gradient(180deg, transparent 0%, rgba(255,215,0,0.35) 20%, rgba(255,215,0,0.35) 80%, transparent 100%)',
                    boxShadow: '0 0 8px rgba(255,215,0,0.15)',
                  }}
                />
              </div>
              {/* Mobile: horizontal rule */}
              <div className="md:hidden my-8">
                <div
                  className="h-px w-full"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,215,0,0.35) 20%, rgba(255,215,0,0.35) 80%, transparent 100%)',
                    boxShadow: '0 0 8px rgba(255,215,0,0.15)',
                  }}
                />
              </div>

              {/* ── Right Column: How Sponsorship Works ── */}
              <div className="flex-1 md:pl-10">
                <H2 theme="blue" style={{ textAlign: 'left', marginBottom: '1.25rem' }}>How Sponsorship Works at eXp</H2>
                <div className="space-y-4">
                  <p className="text-body" style={{ color: '#dcdbd5' }}>{SPONSORSHIP_INTRO}</p>
                  <p className="text-body" style={{ color: '#b0d4e8' }}>{SPONSORSHIP_LEAD}</p>
                  <ul className="space-y-2 pl-1">
                    {SPONSORSHIP_BULLETS.map((b, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-body" style={{ color: '#dcdbd5' }}>
                        <span
                          className="mt-[7px] flex-shrink-0 w-2 h-2 rounded-full"
                          style={{
                            background: 'rgba(0,191,255,0.5)',
                            boxShadow: '0 0 6px rgba(0,191,255,0.3)',
                          }}
                        />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </GlassPanel>
      </div>
    </section>
  );
}


// ============================================================================
// VERSION C — "Offset Grainy Cards"
// Two GenericCyberCardGold cards side by side on desktop. The right card
// is offset down slightly to create visual interest. Thin top accent bars
// (gold / blue) distinguish each card. Mobile: stacked full-width.
// ============================================================================

function SectionVersionC() {
  return (
    <section className="py-12 md:py-20 px-4 sm:px-8 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:items-start">

          {/* ── Left Card: What SAA Is ── */}
          <div>
            <GenericCyberCardGold padding="lg" centered={false}>
              {/* Gold top accent bar */}
              <div
                className="h-[3px] rounded-full mb-6"
                style={{
                  background: 'linear-gradient(90deg, rgba(255,215,0,0.6) 0%, rgba(255,215,0,0.15) 100%)',
                  boxShadow: '0 0 10px rgba(255,215,0,0.2)',
                }}
              />
              <H2 style={{ textAlign: 'left', marginBottom: '1.25rem' }}>What Smart Agent Alliance Is</H2>
              <div className="space-y-4">
                {SAA_PARAGRAPHS.map((p, i) => (
                  <p key={i} className="text-body" style={{ color: '#dcdbd5' }}>{p}</p>
                ))}
                <div
                  className="mt-4 pt-4 flex flex-col gap-2.5"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
                >
                  {SAA_NOT_STATEMENTS.map((s, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-2 text-body"
                      style={{ color: '#e8a0a0', fontSize: 'clamp(13px, 1.6vw, 15px)' }}
                    >
                      <Ban size={14} style={{ color: '#ff5050', flexShrink: 0 }} />
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </GenericCyberCardGold>
          </div>

          {/* ── Right Card: How Sponsorship Works (offset down on desktop) ── */}
          <div className="md:mt-8">
            <GenericCyberCardGold padding="lg" centered={false}>
              {/* Blue top accent bar */}
              <div
                className="h-[3px] rounded-full mb-6"
                style={{
                  background: 'linear-gradient(90deg, rgba(0,191,255,0.6) 0%, rgba(0,191,255,0.15) 100%)',
                  boxShadow: '0 0 10px rgba(0,191,255,0.2)',
                }}
              />
              <H2 theme="blue" style={{ textAlign: 'left', marginBottom: '1.25rem' }}>How Sponsorship Works at eXp</H2>
              <div className="space-y-4">
                <p className="text-body" style={{ color: '#dcdbd5' }}>{SPONSORSHIP_INTRO}</p>
                <p className="text-body" style={{ color: '#b0d4e8' }}>{SPONSORSHIP_LEAD}</p>
                <ul className="space-y-2 pl-1">
                  {SPONSORSHIP_BULLETS.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-body" style={{ color: '#dcdbd5' }}>
                      <span
                        className="mt-[7px] flex-shrink-0 w-2 h-2 rounded-full"
                        style={{
                          background: 'rgba(0,191,255,0.5)',
                          boxShadow: '0 0 6px rgba(0,191,255,0.3)',
                        }}
                      />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </GenericCyberCardGold>
          </div>

        </div>
      </div>
    </section>
  );
}


// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function ExpRealtySponsor() {
  return (
    <main id="main-content">
      <style jsx global>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes floatMedium {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }
        .float-slow { animation: floatSlow 8s ease-in-out infinite; }
        .float-medium { animation: floatMedium 6s ease-in-out infinite; }
      `}</style>

      {/* Floating Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="float-slow absolute top-[20%] left-[5%] w-48 h-48 rounded-full bg-[#ffd700]/5 blur-[80px]" />
        <div className="float-medium absolute top-[50%] right-[10%] w-64 h-64 rounded-full bg-[#ffd700]/4 blur-[100px]" style={{ animationDelay: '2s' }} />
        <div className="float-slow absolute top-[75%] left-[30%] w-40 h-40 rounded-full bg-[#ffd700]/5 blur-[70px]" style={{ animationDelay: '4s' }} />
      </div>

      {/* ================================================================== */}
      {/* HERO SECTION */}
      {/* ================================================================== */}
      <StickyHeroWrapper>
        <section className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
          <QuantumGridEffect />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1]">
            <div className="relative w-full min-w-[300px] max-w-[2000px] h-full">
              <img
                src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/desktop"
                srcSet="
                  https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/mobile 640w,
                  https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/tablet 1024w,
                  https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/desktop 2000w
                "
                sizes="100vw"
                alt=""
                aria-hidden="true"
                loading="eager"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  objectPosition: 'center 55%',
                  maskImage: 'radial-gradient(ellipse 55% 50% at center 55%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 25%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.15) 65%, transparent 85%)',
                  WebkitMaskImage: 'radial-gradient(ellipse 55% 50% at center 55%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 25%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.15) 65%, transparent 85%)',
                }}
              />
            </div>
          </div>
          <div className="max-w-[1900px] mx-auto w-full text-center relative z-10">
            <div className="relative z-10">
              <H1>Smart Agent Alliance</H1>
              <Tagline className="mt-4">3,700+ agents. We succeed only when you do.</Tagline>
            </div>
          </div>
        </section>
      </StickyHeroWrapper>

      {/* ================================================================== */}
      {/* SECTION 1 — VERSION A: Horizontal Rail Cards                       */}
      {/* Two stacked GenericCard bands. H2 pinned left, body flows right.   */}
      {/* Gold left-border for SAA, blue left-border for Sponsorship.        */}
      {/* ================================================================== */}
      <SectionVersionA />

      {/* ================================================================== */}
      {/* SECTION 1 — VERSION B: GlassPanel Dual Columns                    */}
      {/* Single champagne GlassPanel wrapping two columns.                  */}
      {/* Thin vertical gold divider on desktop, horizontal on mobile.       */}
      {/* ================================================================== */}
      <SectionVersionB />

      {/* ================================================================== */}
      {/* SECTION 1 — VERSION C: Offset Grainy Cards                        */}
      {/* Two GenericCyberCardGold side-by-side with color-coded top accents */}
      {/* and a slight vertical offset on the right card.                    */}
      {/* ================================================================== */}
      <SectionVersionC />

    </main>
  );
}
