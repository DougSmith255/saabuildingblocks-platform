'use client';

import React, { useState } from 'react';
import { H1, H2, Tagline, GlassPanel, GenericCard } from '@saa/shared/components/saa';
import { GenericCyberCardGold } from '@saa/shared/components/saa/cards';
import { StickyHeroWrapper } from '@/components/shared/hero-effects/StickyHeroWrapper';
import { QuantumGridEffect } from '@/components/shared/hero-effects/QuantumGridEffect';
import { Ban, ChevronDown } from 'lucide-react';

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
// SHARED: Panel content renderers (used by all 3 interactive versions)
// ============================================================================

function SAAContent() {
  return (
    <div className="space-y-4">
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
// VERSION A — "Segment Toggle"
// Two pill-style toggle buttons at top, single content panel below.
// Only one panel visible at a time. Saves ~50% vertical space.
// ============================================================================

function SectionVersionA() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-12 md:py-20 px-4 sm:px-8 md:px-12">
      <div className="max-w-[1000px] mx-auto">

        {/* ── Toggle bar ── */}
        <div
          className="flex rounded-xl p-1 mb-8 mx-auto"
          style={{
            maxWidth: '600px',
            background: 'linear-gradient(135deg, rgba(20,20,20,0.95) 0%, rgba(12,12,12,0.98) 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.02), 0 4px 16px rgba(0,0,0,0.3)',
          }}
        >
          {PANELS.map((panel, i) => (
            <button
              key={panel.id}
              type="button"
              onClick={() => setActive(i)}
              className="flex-1 py-2.5 px-3 rounded-lg text-center cursor-pointer"
              style={{
                fontFamily: 'var(--font-taskor), sans-serif',
                fontSize: 'clamp(12px, 2.5vw, 15px)',
                fontWeight: 600,
                letterSpacing: '0.04em',
                color: active === i ? '#fff' : 'rgba(255,255,255,0.45)',
                background: active === i
                  ? `linear-gradient(135deg, ${panel.color}22, ${panel.color}11)`
                  : 'transparent',
                border: active === i
                  ? `1px solid ${panel.color}55`
                  : '1px solid transparent',
                boxShadow: active === i
                  ? `0 0 12px ${panel.color}20, inset 0 1px 0 rgba(255,255,255,0.05)`
                  : 'none',
                transition: 'all 0.3s ease',
              }}
            >
              {panel.shortLabel}
            </button>
          ))}
        </div>

        {/* ── Content panel ── */}
        <GenericCard padding="lg">
          <H2
            theme={PANELS[active].theme}
            style={{ textAlign: 'left', marginBottom: '1.25rem' }}
          >
            {PANELS[active].label}
          </H2>
          <div
            key={active}
            style={{
              animation: 'segmentFadeIn 0.3s ease',
            }}
          >
            {active === 0 ? <SAAContent /> : <SponsorshipContent />}
          </div>
        </GenericCard>

        <style>{`
          @keyframes segmentFadeIn {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </section>
  );
}


// ============================================================================
// VERSION B — "Accordion Dual"
// Two accordion rows, only one open at a time. Click header to toggle.
// Uses grid-template-rows for smooth expand/collapse animation.
// Wrapped in a single GlassPanel (champagne).
// ============================================================================

function SectionVersionB() {
  const [expanded, setExpanded] = useState(0);

  // Grain matching GenericCyberCardGold (mobile: 0.5, but this is inside a GlassPanel so keep clean)
  const inactiveBg = 'linear-gradient(135deg, rgba(20,20,20,0.95) 0%, rgba(12,12,12,0.98) 100%)';
  const activeBg = `
    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"),
    linear-gradient(180deg, rgba(18,18,18,0.85) 0%, rgba(12,12,12,0.92) 100%)
  `;

  return (
    <section className="py-12 md:py-20 px-4 sm:px-8 md:px-12">
      <div className="max-w-[1000px] mx-auto">
        <GlassPanel variant="champagne">
          <div className="p-4 sm:p-6 md:p-8 space-y-3">
            {PANELS.map((panel, i) => {
              const isOpen = expanded === i;
              return (
                <div
                  key={panel.id}
                  className="rounded-xl overflow-hidden"
                  style={{
                    background: isOpen ? activeBg : inactiveBg,
                    backgroundBlendMode: isOpen ? 'overlay, normal' : 'normal',
                    border: isOpen ? `2px solid ${panel.color}55` : '1px solid rgba(255,255,255,0.06)',
                    boxShadow: isOpen
                      ? `0 0 20px ${panel.color}20, 0 4px 16px rgba(0,0,0,0.3)`
                      : '0 0 0 1px rgba(255,255,255,0.02), 0 4px 16px rgba(0,0,0,0.3)',
                    transition: 'border 0.35s ease, box-shadow 0.35s ease',
                  }}
                >
                  {/* Header row — always visible */}
                  <button
                    type="button"
                    onClick={() => setExpanded(i)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 cursor-pointer"
                  >
                    <H2
                      theme={panel.theme}
                      style={{ marginBottom: 0, textAlign: 'left' }}
                    >
                      {panel.shortLabel}
                    </H2>
                    <ChevronDown
                      size={22}
                      style={{
                        color: panel.color,
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.3s ease',
                        flexShrink: 0,
                      }}
                    />
                  </button>

                  {/* Collapsible body — grid-template-rows for smooth animation */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateRows: isOpen ? '1fr' : '0fr',
                      transition: 'grid-template-rows 0.4s ease',
                    }}
                  >
                    <div style={{ overflow: 'hidden' }}>
                      <div className="px-4 sm:px-5 pb-5">
                        <div
                          style={{
                            opacity: isOpen ? 1 : 0,
                            transition: isOpen ? 'opacity 0.3s ease 0.15s' : 'opacity 0.15s ease 0s',
                          }}
                        >
                          {i === 0 ? <SAAContent /> : <SponsorshipContent />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassPanel>
      </div>
    </section>
  );
}


// ============================================================================
// VERSION C — "Slide Panel"
// Single GenericCyberCardGold card with two small tab buttons inside.
// Content crossfades with a horizontal slide between the two panels.
// ============================================================================

function SectionVersionC() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-12 md:py-20 px-4 sm:px-8 md:px-12">
      <div className="max-w-[1000px] mx-auto">
        <GenericCyberCardGold padding="lg" centered={false}>

          {/* ── Inline tab buttons ── */}
          <div className="flex gap-2 mb-6">
            {PANELS.map((panel, i) => (
              <button
                key={panel.id}
                type="button"
                onClick={() => setActive(i)}
                className="px-4 py-2 rounded-lg cursor-pointer"
                style={{
                  fontFamily: 'var(--font-taskor), sans-serif',
                  fontSize: 'clamp(11px, 2.2vw, 14px)',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  color: active === i ? '#fff' : 'rgba(255,255,255,0.4)',
                  background: active === i
                    ? `linear-gradient(135deg, ${panel.color}18, ${panel.color}0a)`
                    : 'rgba(255,255,255,0.03)',
                  border: active === i
                    ? `1px solid ${panel.color}44`
                    : '1px solid rgba(255,255,255,0.06)',
                  transition: 'all 0.25s ease',
                }}
              >
                {panel.shortLabel}
              </button>
            ))}
          </div>

          {/* ── Accent bar ── */}
          <div
            className="h-[2px] rounded-full mb-6"
            style={{
              background: `linear-gradient(90deg, ${PANELS[active].color}66 0%, ${PANELS[active].color}15 100%)`,
              boxShadow: `0 0 8px ${PANELS[active].color}20`,
              transition: 'all 0.3s ease',
            }}
          />

          {/* ── H2 title ── */}
          <H2
            theme={PANELS[active].theme}
            style={{ textAlign: 'left', marginBottom: '1.25rem' }}
          >
            {PANELS[active].label}
          </H2>

          {/* ── Sliding content ── */}
          <div className="relative overflow-hidden">
            <div
              style={{
                display: 'flex',
                width: '200%',
                transform: `translateX(${active === 0 ? '0' : '-50%'})`,
                transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              <div style={{ width: '50%', flexShrink: 0 }}>
                <SAAContent />
              </div>
              <div style={{ width: '50%', flexShrink: 0 }}>
                <SponsorshipContent />
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
      {/* SECTION 1 — VERSION A: Segment Toggle                              */}
      {/* Two pill buttons at top, single content panel below.               */}
      {/* Only one panel visible at a time. Content fades in on switch.      */}
      {/* ================================================================== */}
      <SectionVersionA />

      {/* ================================================================== */}
      {/* SECTION 1 — VERSION B: Accordion Dual                             */}
      {/* Two accordion rows inside a champagne GlassPanel.                  */}
      {/* One open at a time. Smooth grid-template-rows animation.           */}
      {/* ================================================================== */}
      <SectionVersionB />

      {/* ================================================================== */}
      {/* SECTION 1 — VERSION C: Slide Panel                                */}
      {/* Single GenericCyberCardGold card with inline tab buttons.          */}
      {/* Content slides horizontally between panels.                        */}
      {/* ================================================================== */}
      <SectionVersionC />

    </main>
  );
}
