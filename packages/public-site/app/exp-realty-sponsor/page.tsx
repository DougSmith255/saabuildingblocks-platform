'use client';

import React, { useState } from 'react';
import { H1, H2, Tagline } from '@saa/shared/components/saa';
import { StickyHeroWrapper } from '@/components/shared/hero-effects/StickyHeroWrapper';
import { QuantumGridEffect } from '@/components/shared/hero-effects/QuantumGridEffect';
import { Ban } from 'lucide-react';

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
// SHARED: Panel content renderers
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
// SECTION 1 — Focus Cards with edge-to-edge GlassPanel
// Sliding-door card reveal: content pre-rendered at fixed min-width,
// card overflow:hidden clips it. Expanding the card reveals content.
// Inactive card has grain overlay + vertical H2 label.
// Gold↔blue crosshatch glass panel spans full viewport width.
// ============================================================================

function Section1() {
  const [active, setActive] = useState(0);
  const other = active === 0 ? 1 : 0;

  const goldGradient = 'linear-gradient(90deg, rgba(255,215,0,0.07) 0%, rgba(255,215,0,0.04) 55%, rgba(0,191,255,0.01) 100%)';
  const blueGradient = 'linear-gradient(90deg, rgba(255,215,0,0.01) 0%, rgba(0,191,255,0.04) 45%, rgba(0,191,255,0.07) 100%)';

  return (
    <section className="py-12 md:py-20">
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

      {/* Edge-to-edge glass panel — full viewport width, no rounded corners */}
      <div
        className="relative overflow-hidden"
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

        {/* Content — max-width centered inside the full-width glass */}
        <div className="relative z-10 max-w-[1100px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-8 md:py-10">

          {/* Desktop: flex layout with sliding-door reveal */}
          <div className="hidden md:flex gap-4">
            {PANELS.map((panel, i) => {
              const isActive = active === i;
              return (
                <div
                  key={panel.id}
                  className="relative"
                  style={{
                    flexGrow: isActive ? 5 : 1,
                    flexBasis: 0,
                    minWidth: 0,
                    transition: 'flex-grow 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                >
                  {/* Pulsing glow ring — outside overflow:hidden card */}
                  {isActive && (
                    <div
                      className="absolute -inset-[3px] rounded-2xl pointer-events-none"
                      style={{
                        border: `2px solid ${panel.color}50`,
                        boxShadow: `0 0 12px 4px ${panel.color}44, 0 0 28px 8px ${panel.color}22`,
                        animation: 'focusPulse 2.4s linear infinite',
                        zIndex: 30,
                      }}
                    />
                  )}

                  {/* Card — overflow:hidden creates the sliding-door clip */}
                  <div
                    className={`focus-card rounded-2xl h-full relative ${!isActive ? 'cursor-pointer' : ''}`}
                    onClick={() => !isActive && setActive(i)}
                    style={{
                      overflow: 'hidden',
                      border: isActive ? `3px solid ${panel.color}` : '1px solid rgba(255,255,255,0.06)',
                      boxShadow: isActive
                        ? `0 0 6px 2px ${panel.color}44, 0 0 20px 4px ${panel.color}22, 0 8px 32px rgba(0,0,0,0.4)`
                        : '0 4px 16px rgba(0,0,0,0.3)',
                      transition: 'border-color 0.35s ease, box-shadow 0.4s ease',
                    }}
                  >
                    {/* Content — in flow when active (sets height), absolute when inactive (clipped by overflow) */}
                    <div
                      className="p-6 lg:p-8"
                      style={{
                        minWidth: '550px',
                        ...(isActive
                          ? {}
                          : { position: 'absolute' as const, top: 0, left: 0, width: '100%' }
                        ),
                      }}
                    >
                      <H2 theme={panel.theme} style={{ textAlign: 'left', marginBottom: '1.25rem' }}>
                        {panel.label}
                      </H2>
                      {i === 0 ? <SAAContent /> : <SponsorshipContent />}
                    </div>

                    {/* Inactive overlay — grain covers content, vertical H2 label */}
                    <div
                      className="absolute inset-0 z-20 flex items-center justify-center focus-card"
                      style={{
                        opacity: isActive ? 0 : 1,
                        pointerEvents: isActive ? 'none' : 'auto',
                        transition: isActive ? 'opacity 0.25s ease 0.15s' : 'opacity 0.2s ease',
                      }}
                    >
                      <div style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                        <H2 theme={panel.theme} style={{ marginBottom: 0 }}>
                          {panel.shortLabel}
                        </H2>
                      </div>
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
      {/* HERO SECTION                                                       */}
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
      {/* Edge-to-edge gold↔blue glass panel. Sliding-door card reveal.     */}
      {/* Glowing border + pulse on active. Vertical H2 on inactive.         */}
      {/* ================================================================== */}
      <Section1 />

    </main>
  );
}
