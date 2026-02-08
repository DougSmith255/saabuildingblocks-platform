'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  { id: 'saa', label: 'What Smart Agent Alliance Is', shortLabel: 'What SAA Is', color: '#ffd700', theme: 'gold' as const },
  { id: 'sponsorship', label: 'How Sponsorship Works at eXp', shortLabel: 'Sponsorship', color: '#00bfff', theme: 'blue' as const },
];


// ============================================================================
// SECTION 1 — Focus Cards with edge-to-edge GlassPanel
// Content rendered at a JS-measured fixed pixel width so it NEVER reflows.
// Card overflow:hidden clips it — expanding the card reveals content.
// Both cards render both contents (grid overlay) at the same fixed width
// so heights are equalized on desktop. Mobile renders independently.
// Gold↔blue crosshatch glass panel with rounded-3xl (matching about-exp).
// ============================================================================

function Section1() {
  const [active, setActive] = useState(1); // Start on card 2 — auto-switches to card 1 on scroll
  const other = active === 0 ? 1 : 0;
  const flexRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const hasAutoSwitched = useRef(false);
  const [contentW, setContentW] = useState(0);

  // Measure the active card's width so content can be rendered at a fixed size
  const measure = useCallback(() => {
    if (flexRef.current) {
      const w = flexRef.current.offsetWidth;
      // Active card = 5/6 of (container - 16px gap)
      setContentW(Math.floor((w - 16) * 5 / 6));
    }
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (flexRef.current) ro.observe(flexRef.current);
    return () => ro.disconnect();
  }, [measure]);

  // Auto-switch to card 1 (SAA) when user scrolls ~40% into the section
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAutoSwitched.current) {
          hasAutoSwitched.current = true;
          setActive(0);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const goldGradient = 'linear-gradient(90deg, rgba(255,215,0,0.07) 0%, rgba(255,215,0,0.04) 55%, rgba(0,191,255,0.01) 100%)';
  const blueGradient = 'linear-gradient(90deg, rgba(255,215,0,0.01) 0%, rgba(0,191,255,0.04) 45%, rgba(0,191,255,0.07) 100%)';

  // Fixed-width style for desktop content — SSR fallback uses min-width
  const contentStyle = contentW > 0
    ? { width: `${contentW}px` }
    : { minWidth: '550px' };

  return (
    <section ref={sectionRef} className="py-12 md:py-20">
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
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"),
            linear-gradient(180deg, rgba(18,18,18,0.85) 0%, rgba(12,12,12,0.92) 100%);
          background-blend-mode: overlay, normal;
          backdrop-filter: blur(16px) saturate(120%);
          -webkit-backdrop-filter: blur(16px) saturate(120%);
        }
      `}</style>

      {/* Glass panel — rounded-3xl matching about-exp GlassPanel pattern */}
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

        {/* Content — max-width centered inside the glass */}
        <div className="relative z-10 max-w-[1100px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-8 md:py-10">

          {/* Desktop: flex layout — fixed-width content, height equalized */}
          <div ref={flexRef} className="hidden md:flex gap-4">
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
                    transition: 'flex-grow 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
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

                  {/* Card — active: grain bg via focus-card class; inactive: GenericCard solid bg */}
                  <div
                    className={`${isActive ? 'focus-card' : ''} rounded-2xl h-full relative ${!isActive ? 'cursor-pointer' : ''}`}
                    onClick={() => !isActive && setActive(i)}
                    style={{
                      overflow: 'hidden',
                      ...(!isActive ? {
                        background: 'linear-gradient(180deg, rgba(18,18,18,0.95) 0%, rgba(12,12,12,0.98) 100%)',
                      } : {}),
                      border: isActive ? `3px solid ${panel.color}` : '1px solid rgba(255,255,255,0.06)',
                      boxShadow: isActive
                        ? `0 0 6px 2px ${panel.color}44, 0 0 20px 4px ${panel.color}22, 0 8px 32px rgba(0,0,0,0.4)`
                        : '0 0 0 1px rgba(255,255,255,0.02), 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)',
                      transition: 'border-color 0.5s ease, box-shadow 0.55s ease',
                    }}
                  >
                    {/* Content at FIXED pixel width — never reflows during transitions */}
                    <div className="p-6 lg:p-8" style={contentStyle}>
                      {/* Full H2 title — clip-path reveals left-to-right ("counter grow" effect) */}
                      <div style={{
                        clipPath: isActive ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
                        transition: isActive
                          ? 'clip-path 0.65s cubic-bezier(0.22, 1, 0.36, 1) 0.25s'
                          : 'clip-path 0.35s ease',
                      }}>
                        <H2 theme={panel.theme} style={{ textAlign: 'left', marginBottom: '1.25rem' }}>
                          {panel.label}
                        </H2>
                      </div>
                      {/* Content body — fades in when active */}
                      <div style={{
                        opacity: isActive ? 1 : 0,
                        transition: isActive
                          ? 'opacity 0.5s ease 0.4s'
                          : 'opacity 0.25s ease',
                      }}>
                        {/* Grid overlay: both contents at same width → stable equal height */}
                        <div style={{ display: 'grid' }}>
                          <div style={{ gridArea: '1 / 1' }}>
                            {i === 0 ? <SAAContent /> : <SponsorshipContent />}
                          </div>
                          <div style={{ gridArea: '1 / 1', visibility: 'hidden', pointerEvents: 'none' }} aria-hidden="true">
                            {i === 0 ? <SponsorshipContent /> : <SAAContent />}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Short label — vertical text, slides off horizontally on activation */}
                    <div
                      className="absolute inset-0 z-20 flex items-center justify-center"
                      style={{
                        pointerEvents: isActive ? 'none' : 'auto',
                        transform: isActive
                          ? `translateX(${i === 0 ? '-100%' : '100%'})`
                          : 'translateX(0)',
                        opacity: isActive ? 0 : 1,
                        transition: isActive
                          ? 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease 0.1s'
                          : 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.15s, opacity 0.35s ease 0.1s',
                      }}
                    >
                      <div style={{
                        writingMode: 'vertical-rl',
                        textOrientation: 'mixed',
                      }}>
                        <H2 theme={panel.theme} style={{
                          marginBottom: 0,
                          fontSize: 'clamp(28px, calc(24.36px + 1.45vw), 40px)',
                        }}>
                          {panel.shortLabel}
                        </H2>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile: active card + switcher bar — independent height, no equalization */}
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
              className="w-full mt-3 rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer"
              style={{
                background: 'linear-gradient(180deg, rgba(18,18,18,0.95) 0%, rgba(12,12,12,0.98) 100%)',
                border: `1px solid ${PANELS[other].color}33`,
                boxShadow: '0 0 0 1px rgba(255,255,255,0.02), 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)',
              }}
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
