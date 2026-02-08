'use client';

import React, { useState } from 'react';
import { H1, H2, Tagline, GlassPanel, GenericCard, CyberCardGold, NeonGoldText } from '@saa/shared/components/saa';
import { GenericCyberCardGold } from '@saa/shared/components/saa/cards';
import { StickyHeroWrapper } from '@/components/shared/hero-effects/StickyHeroWrapper';
import { QuantumGridEffect } from '@/components/shared/hero-effects/QuantumGridEffect';
import { Ban, Wrench, GraduationCap, Users, Building } from 'lucide-react';

// ============================================================================
// SECTION 1 CONTENT — word for word
// ============================================================================

const SAA_DESCRIPTION =
  'Smart Agent Alliance (SAA) is a sponsor organization inside eXp Realty \u2014 built to deliver real systems, training, income infrastructure, and community to independent agents.';

const SAA_NOT_STATEMENTS = [
  'This is not a brokerage.',
  'This is not a production team.',
];

const SPONSORSHIP_INTRO =
  'At eXp, agents join the brokerage directly and name a sponsor on their application. That sponsor sits within a broader seven-level upline structure.';

const SPONSORSHIP_LEAD = 'Sponsor support varies widely.';

const SPONSORSHIP_BULLETS = [
  'Many sponsors provide little or no ongoing value.',
  'Some operate informal groups.',
  'Very few build durable infrastructure.',
];

// ============================================================================
// SHARED: Panel content renderers (used by all 3 interactive versions)
// ============================================================================

function SAAContent() {
  return (
    <div className="space-y-4">
      <p className="text-body" style={{ color: '#dcdbd5' }}>{SAA_DESCRIPTION}</p>
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
  );
}

function SponsorshipContent() {
  return (
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
  );
}

const PANELS = [
  { id: 'saa', label: 'What Smart Agent Alliance Is', shortLabel: 'What SAA Is', color: '#ffd700', theme: 'default' as const },
  { id: 'sponsorship', label: 'How Sponsorship Works at eXp', shortLabel: 'Sponsorship', color: '#00bfff', theme: 'blue' as const },
];


// ============================================================================
// SECTION 1 — Focus Cards with dynamic GlassPanel
// Both panels always visible. Active card gets a glowing colored border
// with organic pulse animation + full content. Inactive card shows H2
// in vertical writing mode. Wrapped in a crosshatch glass panel whose
// gold↔blue gradient shifts based on which card is active.
// ============================================================================

function Section1() {
  const [active, setActive] = useState(0);
  const other = active === 0 ? 1 : 0;

  // Dynamic gradients — gold expands when SAA active, blue expands when Sponsorship active
  const goldGradient = 'linear-gradient(90deg, rgba(255,215,0,0.07) 0%, rgba(255,215,0,0.04) 55%, rgba(0,191,255,0.01) 100%)';
  const blueGradient = 'linear-gradient(90deg, rgba(255,215,0,0.01) 0%, rgba(0,191,255,0.04) 45%, rgba(0,191,255,0.07) 100%)';

  return (
    <section className="py-12 md:py-20 px-4 sm:px-8 md:px-12">
      <style>{`
        @keyframes focusPulse {
          0% { opacity: 0.55; }
          13% { opacity: 0.95; }
          28% { opacity: 0.6; }
          41% { opacity: 0.85; }
          54% { opacity: 0.5; }
          67% { opacity: 1; }
          83% { opacity: 0.7; }
          100% { opacity: 0.55; }
        }
        @keyframes focusFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .focus-card {
          background:
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"),
            linear-gradient(180deg, rgba(18,18,18,0.85) 0%, rgba(12,12,12,0.92) 100%);
          background-blend-mode: overlay, normal;
          backdrop-filter: blur(16px) saturate(120%);
          -webkit-backdrop-filter: blur(16px) saturate(120%);
        }
        @media (min-width: 1024px) {
          .focus-card {
            background:
              url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"),
              linear-gradient(180deg, rgba(18,18,18,0.85) 0%, rgba(12,12,12,0.92) 100%);
            background-blend-mode: overlay, normal;
          }
        }
      `}</style>

      <div className="max-w-[1100px] mx-auto">
        {/* GlassPanel-style wrapper with dynamic gold↔blue crosshatch */}
        <div
          className="relative overflow-hidden rounded-3xl"
          style={{
            boxShadow: `
              0 8px 32px rgba(0,0,0,0.4),
              0 4px 12px rgba(0,0,0,0.25),
              inset 0 1px 0 0 rgba(255,255,255,0.35),
              inset 0 2px 4px 0 rgba(255,255,255,0.2),
              inset 0 20px 40px -20px rgba(255,255,255,0.15),
              inset 0 -1px 0 0 rgba(0,0,0,0.7),
              inset 0 -2px 6px 0 rgba(0,0,0,0.5),
              inset 0 -10px 25px -8px rgba(0,0,0,0.6),
              inset 0 -25px 50px -20px rgba(0,0,0,0.45)
            `,
          }}
        >
          {/* Gold-dominant gradient layer */}
          <div
            className="absolute inset-0"
            style={{
              background: goldGradient,
              opacity: active === 0 ? 1 : 0,
              transition: 'opacity 0.6s ease',
            }}
          />
          {/* Blue-dominant gradient layer */}
          <div
            className="absolute inset-0"
            style={{
              background: blueGradient,
              opacity: active === 1 ? 1 : 0,
              transition: 'opacity 0.6s ease',
            }}
          />
          {/* Crosshatch texture overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-[1]"
            style={{
              backgroundImage: `
                repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, transparent 1px, transparent 6px),
                repeating-linear-gradient(-45deg, rgba(255,255,255,0.03) 0px, transparent 1px, transparent 6px)
              `,
              backgroundSize: '16px 16px',
            }}
          />

          {/* Content */}
          <div className="relative z-10 p-4 sm:p-6 md:p-8 lg:p-10">
            {/* Desktop: side-by-side grid with fr transition */}
            <div
              className="hidden md:grid gap-4"
              style={{
                gridTemplateColumns: active === 0 ? '5fr 1fr' : '1fr 5fr',
                transition: 'grid-template-columns 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              {PANELS.map((panel, i) => {
                const isActive = active === i;
                return (
                  <div
                    key={panel.id}
                    className={`focus-card rounded-2xl relative overflow-hidden ${!isActive ? 'cursor-pointer' : ''}`}
                    onClick={() => !isActive && setActive(i)}
                    style={{
                      border: isActive ? `3px solid ${panel.color}` : '1px solid rgba(255,255,255,0.06)',
                      boxShadow: isActive
                        ? `0 0 6px 2px ${panel.color}44, 0 0 20px 4px ${panel.color}22, 0 8px 32px rgba(0,0,0,0.4)`
                        : '0 4px 16px rgba(0,0,0,0.3)',
                      transition: 'border-color 0.35s ease, box-shadow 0.4s ease',
                    }}
                  >
                    {/* Pulsing glow layer */}
                    {isActive && (
                      <div
                        className="absolute -inset-[3px] rounded-2xl pointer-events-none z-0"
                        style={{
                          border: `2px solid ${panel.color}50`,
                          boxShadow: `0 0 12px 4px ${panel.color}44, 0 0 28px 8px ${panel.color}22`,
                          animation: 'focusPulse 2.4s linear infinite',
                        }}
                      />
                    )}

                    {/* Active state: full content with height equalizer */}
                    <div
                      className="relative z-10 p-6 lg:p-8"
                      style={{
                        opacity: isActive ? 1 : 0,
                        pointerEvents: isActive ? 'auto' : 'none',
                        transition: isActive ? 'opacity 0.35s ease 0.15s' : 'opacity 0.15s ease',
                      }}
                    >
                      <H2 theme={panel.theme} style={{ textAlign: 'left', marginBottom: '1.25rem' }}>
                        {panel.label}
                      </H2>
                      {/* Both contents rendered — taller one sets stable height */}
                      <div style={{ display: 'grid' }}>
                        <div style={{ gridArea: '1 / 1' }}>
                          {i === 0 ? <SAAContent /> : <SponsorshipContent />}
                        </div>
                        <div style={{ gridArea: '1 / 1', visibility: 'hidden', pointerEvents: 'none' }} aria-hidden="true">
                          {i === 0 ? <SponsorshipContent /> : <SAAContent />}
                        </div>
                      </div>
                    </div>

                    {/* Inactive state: vertical H2 label */}
                    <div
                      className="absolute inset-0 z-10 flex items-center justify-center"
                      style={{
                        opacity: isActive ? 0 : 1,
                        pointerEvents: isActive ? 'none' : 'auto',
                        transition: isActive ? 'opacity 0.15s ease' : 'opacity 0.35s ease 0.15s',
                      }}
                    >
                      <div style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                        <H2 theme={panel.theme} style={{ marginBottom: 0 }}>
                          {panel.shortLabel}
                        </H2>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile: active card + switcher bar */}
            <div className="md:hidden">
              <div
                className="focus-card rounded-2xl relative overflow-hidden"
                style={{
                  border: `3px solid ${PANELS[active].color}`,
                  boxShadow: `0 0 6px 2px ${PANELS[active].color}44, 0 0 20px 4px ${PANELS[active].color}22`,
                }}
              >
                <div
                  className="absolute -inset-[3px] rounded-2xl pointer-events-none z-0"
                  style={{
                    border: `2px solid ${PANELS[active].color}50`,
                    boxShadow: `0 0 12px 4px ${PANELS[active].color}44, 0 0 28px 8px ${PANELS[active].color}22`,
                    animation: 'focusPulse 2.4s linear infinite',
                  }}
                />
                <div className="relative z-10 p-5">
                  <H2 theme={PANELS[active].theme} style={{ textAlign: 'left', marginBottom: '1rem' }}>
                    {PANELS[active].label}
                  </H2>
                  <div key={`mob-${active}`} style={{ animation: 'focusFadeIn 0.35s ease' }}>
                    {active === 0 ? <SAAContent /> : <SponsorshipContent />}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActive(other)}
                className="w-full mt-3 focus-card rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer"
                style={{ border: `1px solid ${PANELS[other].color}33` }}
              >
                <span style={{
                  fontFamily: 'var(--font-taskor), sans-serif',
                  fontSize: '13px',
                  color: PANELS[other].color,
                  opacity: 0.6,
                  letterSpacing: '0.06em',
                }}>
                  {PANELS[other].shortLabel}
                </span>
                <span style={{
                  fontFamily: 'var(--font-taskor), sans-serif',
                  color: PANELS[other].color,
                  opacity: 0.4,
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                }}>
                  TAP TO VIEW &rarr;
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}




// ============================================================================
// SECTION 2 CONTENT — "Why SAA Is Different" — word for word
// ============================================================================

const S2_OPENING =
  'At eXp Realty, sponsors are not required to provide any ongoing support. As a result, most never do.';

const S2_PIVOT = 'Smart Agent Alliance was built differently.';

const S2_DIFF_BULLETS = [
  'Built as a sponsor organization, not an individual sponsor',
  'Delivers real systems, training, and income infrastructure',
  'No commission splits or loss of control',
];

const S2_COMP_LINES = [
  'Agents pay Smart Agent Alliance nothing.',
  'We are compensated from eXp\u2019s company revenue only when agents close transactions.',
  'When our agents succeed, we succeed.',
];

const S2_ORG_LEAD =
  'Because Smart Agent Alliance is built as an organization, not a personality-driven sponsor:';

const S2_ORG_BULLETS = [
  { text: 'Systems are designed, maintained, and updated', icon: Wrench },
  { text: 'Training is structured, repeatable, and current', icon: GraduationCap },
  { text: 'Community is active and intentional', icon: Users },
  { text: 'Infrastructure exists independently of any single leader', icon: Building },
];


// ============================================================================
// SECTION 2 — VERSION A: "Statement Stack"
// Pure vertical flow — no cards, no panels. Just raw typography on the dark
// page background. The pivot line is oversized gold. Compensation model in a
// CyberCardGold callout. Org bullets in a compact icon grid.
// Punchy, editorial, high-contrast.
// ============================================================================

function Section2VersionA() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-8 md:px-12">
      <div className="max-w-[900px] mx-auto">

        {/* H2 */}
        <H2 style={{ marginBottom: '1.5rem' }}>Why Smart Agent Alliance Is Different</H2>

        {/* Opening */}
        <p className="text-body text-center mb-6" style={{ color: '#dcdbd5', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
          {S2_OPENING}
        </p>

        {/* Pivot — oversized gold callout */}
        <p
          className="text-center mb-10"
          style={{
            fontFamily: 'var(--font-taskor), sans-serif',
            fontSize: 'clamp(22px, 4vw, 36px)',
            fontWeight: 700,
            color: '#ffd700',
            textShadow: '0 0 0.04em rgba(255,215,0,0.6), 0 0 0.12em rgba(255,215,0,0.2), 0.02em 0.02em 0 #2a2a1d',
            filter: 'drop-shadow(0.03em 0.03em 0.04em rgba(0,0,0,0.5))',
          }}
        >
          {S2_PIVOT}
        </p>

        {/* Difference bullets — horizontal on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
          {S2_DIFF_BULLETS.map((b, i) => (
            <GenericCard key={i} padding="sm" centered>
              <p className="text-body text-sm" style={{ color: '#dcdbd5' }}>
                <span
                  className="inline-block w-5 h-5 rounded-full text-center mr-2 align-middle"
                  style={{
                    background: 'rgba(255,215,0,0.15)',
                    border: '1px solid rgba(255,215,0,0.3)',
                    fontSize: '11px',
                    lineHeight: '20px',
                    color: '#ffd700',
                    fontWeight: 700,
                  }}
                >
                  {i + 1}
                </span>
                {b}
              </p>
            </GenericCard>
          ))}
        </div>

        {/* Compensation model — CyberCardGold callout */}
        <CyberCardGold padding="md">
          <div className="space-y-3">
            <NeonGoldText as="p" className="text-h4">{S2_COMP_LINES[0]}</NeonGoldText>
            <p className="text-body" style={{ color: '#dcdbd5' }}>{S2_COMP_LINES[1]}</p>
            <p className="text-body" style={{ color: '#ffd700', fontWeight: 600 }}>{S2_COMP_LINES[2]}</p>
          </div>
        </CyberCardGold>

        {/* Org structure — lead-in + icon bullets */}
        <div className="mt-10">
          <p className="text-body mb-5 text-center" style={{ color: '#b0d4e8' }}>{S2_ORG_LEAD}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {S2_ORG_BULLETS.map((b) => (
              <div
                key={b.text}
                className="flex items-start gap-3 rounded-xl p-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(20,20,20,0.95) 0%, rgba(12,12,12,0.98) 100%)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <span
                  className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5"
                  style={{
                    background: 'rgba(0,191,255,0.1)',
                    border: '1px solid rgba(0,191,255,0.25)',
                  }}
                >
                  <b.icon size={16} style={{ color: '#00bfff' }} />
                </span>
                <p className="text-body text-sm" style={{ color: '#dcdbd5' }}>{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


// ============================================================================
// SECTION 2 — VERSION B: "GlassPanel Impact"
// Single marigoldCrosshatch GlassPanel. Opening + pivot as the top block.
// Middle: 3 difference bullets as a horizontal row with gold numbering.
// Bottom: CyberCardGold comp model + org bullets side by side on desktop.
// Tighter, more contained feel than Version A.
// ============================================================================

function Section2VersionB() {
  return (
    <section className="py-12 md:py-20 px-4 sm:px-8 md:px-12">
      <div className="max-w-[1100px] mx-auto">
        <GlassPanel variant="marigoldCrosshatch">
          <div className="p-6 sm:p-8 md:p-12">

            {/* H2 */}
            <H2 style={{ marginBottom: '1.25rem' }}>Why Smart Agent Alliance Is Different</H2>

            {/* Opening + Pivot */}
            <div className="text-center mb-8 max-w-[750px] mx-auto">
              <p className="text-body mb-4" style={{ color: '#dcdbd5' }}>{S2_OPENING}</p>
              <p
                style={{
                  fontFamily: 'var(--font-taskor), sans-serif',
                  fontSize: 'clamp(18px, 3.5vw, 28px)',
                  fontWeight: 700,
                  color: '#ffd700',
                  textShadow: '0 0 0.04em rgba(255,215,0,0.5), 0.02em 0.02em 0 #2a2a1d',
                }}
              >
                {S2_PIVOT}
              </p>
            </div>

            {/* Difference bullets — gold-numbered row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
              {S2_DIFF_BULLETS.map((b, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-xl"
                  style={{
                    background: 'rgba(0,0,0,0.25)',
                    border: '1px solid rgba(255,215,0,0.12)',
                  }}
                >
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{
                      background: 'rgba(255,215,0,0.15)',
                      border: '1px solid rgba(255,215,0,0.35)',
                      color: '#ffd700',
                      fontSize: '12px',
                      fontWeight: 700,
                      fontFamily: 'var(--font-taskor), sans-serif',
                    }}
                  >
                    {i + 1}
                  </span>
                  <p className="text-body text-sm" style={{ color: '#dcdbd5' }}>{b}</p>
                </div>
              ))}
            </div>

            {/* Bottom: Comp model + Org bullets — side by side on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Compensation model */}
              <GenericCard padding="md">
                <div className="space-y-3">
                  <p className="text-body" style={{ color: '#ffd700', fontWeight: 700, fontSize: 'clamp(15px, 2vw, 18px)' }}>
                    {S2_COMP_LINES[0]}
                  </p>
                  <p className="text-body text-sm" style={{ color: '#dcdbd5' }}>{S2_COMP_LINES[1]}</p>
                  <p className="text-body text-sm" style={{ color: '#ffd700' }}>{S2_COMP_LINES[2]}</p>
                </div>
              </GenericCard>

              {/* Org structure */}
              <GenericCard padding="md">
                <p className="text-body text-sm mb-3" style={{ color: '#b0d4e8' }}>{S2_ORG_LEAD}</p>
                <ul className="space-y-2.5">
                  {S2_ORG_BULLETS.map((b) => (
                    <li key={b.text} className="flex items-start gap-2.5 text-body text-sm" style={{ color: '#dcdbd5' }}>
                      <span
                        className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center mt-0.5"
                        style={{ background: 'rgba(0,191,255,0.1)', border: '1px solid rgba(0,191,255,0.25)' }}
                      >
                        <b.icon size={12} style={{ color: '#00bfff' }} />
                      </span>
                      <span>{b.text}</span>
                    </li>
                  ))}
                </ul>
              </GenericCard>
            </div>

          </div>
        </GlassPanel>
      </div>
    </section>
  );
}


// ============================================================================
// SECTION 2 — VERSION C: "Three-Phase Stepper"
// Interactive: content split into 3 phases with clickable step indicators.
// Phase 1: "The Problem" (opening)
// Phase 2: "The Difference" (pivot + bullets + comp model)
// Phase 3: "The Structure" (org lead-in + org bullets)
// Only one phase visible at a time — slides between them.
// Maximum space savings.
// ============================================================================

const S2_PHASES = [
  { id: 'problem', label: 'The Problem', color: '#ff5050' },
  { id: 'difference', label: 'The Difference', color: '#ffd700' },
  { id: 'structure', label: 'The Structure', color: '#00bfff' },
];

function Section2VersionC() {
  const [phase, setPhase] = useState(0);

  return (
    <section className="py-12 md:py-20 px-4 sm:px-8 md:px-12">
      <div className="max-w-[900px] mx-auto">

        {/* H2 */}
        <H2 style={{ marginBottom: '1.5rem' }}>Why Smart Agent Alliance Is Different</H2>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {S2_PHASES.map((p, i) => (
            <React.Fragment key={p.id}>
              {i > 0 && (
                <div
                  className="h-px flex-1 max-w-[40px]"
                  style={{
                    background: i <= phase
                      ? `linear-gradient(90deg, ${S2_PHASES[i - 1].color}66, ${p.color}66)`
                      : 'rgba(255,255,255,0.1)',
                    transition: 'background 0.3s ease',
                  }}
                />
              )}
              <button
                type="button"
                onClick={() => setPhase(i)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer"
                style={{
                  background: phase === i ? `${p.color}15` : 'transparent',
                  border: phase === i ? `1px solid ${p.color}44` : '1px solid rgba(255,255,255,0.06)',
                  transition: 'all 0.25s ease',
                }}
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background: i <= phase ? `${p.color}25` : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${i <= phase ? `${p.color}55` : 'rgba(255,255,255,0.1)'}`,
                    color: i <= phase ? p.color : 'rgba(255,255,255,0.3)',
                    fontFamily: 'var(--font-taskor), sans-serif',
                    transition: 'all 0.25s ease',
                  }}
                >
                  {i + 1}
                </span>
                <span
                  className="hidden sm:inline text-xs font-semibold tracking-wide"
                  style={{
                    fontFamily: 'var(--font-taskor), sans-serif',
                    color: phase === i ? p.color : 'rgba(255,255,255,0.35)',
                    transition: 'color 0.25s ease',
                  }}
                >
                  {p.label}
                </span>
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Content panel — slides between phases */}
        <GenericCyberCardGold padding="lg" centered={false}>
          <div className="relative overflow-hidden">
            <div
              style={{
                display: 'flex',
                width: '300%',
                transform: `translateX(${-phase * (100 / 3)}%)`,
                transition: 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              {/* Phase 1: The Problem */}
              <div style={{ width: `${100 / 3}%`, flexShrink: 0 }}>
                <div className="pr-4">
                  <p className="text-body mb-6" style={{ color: '#dcdbd5', fontSize: 'clamp(15px, 2vw, 18px)' }}>
                    {S2_OPENING}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-taskor), sans-serif',
                      fontSize: 'clamp(20px, 3.5vw, 30px)',
                      fontWeight: 700,
                      color: '#ffd700',
                      textShadow: '0 0 0.04em rgba(255,215,0,0.5), 0.02em 0.02em 0 #2a2a1d',
                    }}
                  >
                    {S2_PIVOT}
                  </p>
                </div>
              </div>

              {/* Phase 2: The Difference */}
              <div style={{ width: `${100 / 3}%`, flexShrink: 0 }}>
                <div className="pr-4 space-y-5">
                  <ul className="space-y-3">
                    {S2_DIFF_BULLETS.map((b, i) => (
                      <li key={i} className="flex items-start gap-3 text-body" style={{ color: '#dcdbd5' }}>
                        <span
                          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
                          style={{
                            background: 'rgba(255,215,0,0.15)',
                            border: '1px solid rgba(255,215,0,0.3)',
                            color: '#ffd700',
                            fontSize: '11px',
                            fontWeight: 700,
                          }}
                        >
                          {i + 1}
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div
                    className="rounded-xl p-4"
                    style={{
                      background: 'rgba(255,215,0,0.04)',
                      border: '1px solid rgba(255,215,0,0.15)',
                    }}
                  >
                    <p className="text-body font-semibold mb-1" style={{ color: '#ffd700' }}>{S2_COMP_LINES[0]}</p>
                    <p className="text-body text-sm mb-1" style={{ color: '#dcdbd5' }}>{S2_COMP_LINES[1]}</p>
                    <p className="text-body text-sm" style={{ color: '#ffd700' }}>{S2_COMP_LINES[2]}</p>
                  </div>
                </div>
              </div>

              {/* Phase 3: The Structure */}
              <div style={{ width: `${100 / 3}%`, flexShrink: 0 }}>
                <div className="pr-4">
                  <p className="text-body mb-5" style={{ color: '#b0d4e8' }}>{S2_ORG_LEAD}</p>
                  <div className="space-y-3">
                    {S2_ORG_BULLETS.map((b) => (
                      <div
                        key={b.text}
                        className="flex items-start gap-3 rounded-xl p-3"
                        style={{
                          background: 'rgba(0,191,255,0.04)',
                          border: '1px solid rgba(0,191,255,0.12)',
                        }}
                      >
                        <span
                          className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-0.5"
                          style={{ background: 'rgba(0,191,255,0.1)', border: '1px solid rgba(0,191,255,0.25)' }}
                        >
                          <b.icon size={14} style={{ color: '#00bfff' }} />
                        </span>
                        <p className="text-body text-sm" style={{ color: '#dcdbd5' }}>{b.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GenericCyberCardGold>

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
      {/* SECTION 1 — Focus Cards                                            */}
      {/* Dynamic gold↔blue GlassPanel. Glowing border + pulse on active.   */}
      {/* Vertical H2 on inactive. Height-equalized desktop grid.            */}
      {/* ================================================================== */}
      <Section1 />

      {/* ================================================================== */}
      {/* SECTION 2 — VERSION A: Statement Stack                             */}
      {/* Pure typography flow. Oversized gold pivot line. CyberCardGold      */}
      {/* comp callout. Org bullets in icon grid. Editorial feel.             */}
      {/* ================================================================== */}
      <Section2VersionA />

      {/* ================================================================== */}
      {/* SECTION 2 — VERSION B: GlassPanel Impact                          */}
      {/* Single marigoldCrosshatch GlassPanel. Numbered bullet row.          */}
      {/* Comp model + org bullets side by side on desktop.                   */}
      {/* ================================================================== */}
      <Section2VersionB />

      {/* ================================================================== */}
      {/* SECTION 2 — VERSION C: Three-Phase Stepper                        */}
      {/* Interactive 3-step progression. Only one phase visible at a time.   */}
      {/* Slides between Problem → Difference → Structure.                   */}
      {/* ================================================================== */}
      <Section2VersionC />

    </main>
  );
}
