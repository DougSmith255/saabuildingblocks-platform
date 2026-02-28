'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { H1, Tagline } from '@saa/shared/components/saa/headings';
import { StickyHeroWrapper } from '@/components/shared/hero-effects/StickyHeroWrapper';
import { LazyAuroraNetworkEffect } from '@/components/shared/hero-effects/LazyHeroEffects';
import { useScrambleCounter } from './components/hooks';

/* ═══════════════════════════════════════════════════════════════
   LAZY-LOADED BELOW-FOLD SECTIONS
   ═══════════════════════════════════════════════════════════════ */

const HowExpIsBuilt = dynamic(() => import('./components/HowExpIsBuilt'), { ssr: false });
const SpotlightConsole = dynamic(() => import('./components/SpotlightConsole'), { ssr: false });
const IncomeOwnershipSection = dynamic(() => import('./components/IncomeOwnership'), { ssr: false });
const SupportInfrastructureSection = dynamic(() => import('./components/SupportInfrastructure'), { ssr: false });
const WhatExpProvidesVersionB = dynamic(() => import('./components/WhatExpProvides'), { ssr: false });
const AdditionalAreasSection = dynamic(() => import('./components/AdditionalAreas'), { ssr: false });
const WhoExpWorksBestForSection = dynamic(() => import('./components/WhoExpWorksBestFor'), { ssr: false });
const WhereSAAFitsVersionA = dynamic(() => import('./components/WhereSAAFits'), { ssr: false });

/* ═══════════════════════════════════════════════════════════════
   HERO COMPONENTS (above-fold, render immediately)
   ═══════════════════════════════════════════════════════════════ */

// Shared tagline 3D styling for hero stat cards
const heroTaglineStyle: React.CSSProperties = {
  marginBottom: '0.25rem',
  color: '#bfbdb0',
  textShadow: `
    0 0 0.01em #fff,
    0 0 0.02em #fff,
    0 0 0.03em rgba(255,255,255,0.8),
    0 0 0.04em rgba(255,250,240,0.7),
    0 0 0.08em rgba(255, 255, 255, 0.35),
    0 0 0.14em rgba(255, 255, 255, 0.15),
    0 0 0.22em rgba(200, 200, 200, 0.08),
    0.02em 0.02em 0 #2a2a2a,
    0.04em 0.04em 0 #222222,
    0.06em 0.06em 0 #1a1a1a,
    0.08em 0.08em 0 #141414,
    0.10em 0.10em 0 #0f0f0f,
    0.12em 0.12em 0 #080808
  `,
  transform: 'perspective(800px) rotateX(8deg)',
  filter: 'drop-shadow(0.04em 0.04em 0.06em rgba(0,0,0,0.6))',
};

const HERO_CARD_BASE: React.CSSProperties = {
  background: 'linear-gradient(180deg, rgba(30,30,30,0.95), rgba(15,15,15,0.98))',
  border: '1px solid rgba(255,255,255,0.06)',
  padding: '16px 30px',
};

function AnimatedSplitDisplay({ left, right }: { left: number; right: number }) {
  const leftCounter = useScrambleCounter(left, 1500);
  const rightCounter = useScrambleCounter(right, 1500);

  return (
    <>
      <span ref={leftCounter.elementRef}>
        {leftCounter.hasAnimated ? left : leftCounter.displayValue}
      </span>
      <span>/</span>
      <span ref={rightCounter.elementRef}>
        {rightCounter.hasAnimated ? right : rightCounter.displayValue}
      </span>
    </>
  );
}

function FlipSplitCard() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => prev + 180);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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
          <div className="rounded-xl text-center" style={HERO_CARD_BASE}>
            <p className="text-tagline tabular-nums whitespace-nowrap invisible h-0 overflow-hidden" style={heroTaglineStyle} aria-hidden="true">
              80/20
            </p>
            <p className="text-tagline tabular-nums whitespace-nowrap" style={heroTaglineStyle}>
              <AnimatedSplitDisplay left={80} right={20} />
            </p>
            <p className="text-body text-sm opacity-70 whitespace-nowrap">Commission</p>
          </div>
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
          <div className="rounded-xl text-center h-full flex flex-col justify-center" style={HERO_CARD_BASE}>
            <p className="text-tagline tabular-nums whitespace-nowrap" style={heroTaglineStyle}>
              100%
            </p>
            <p className="text-body text-sm opacity-70 whitespace-nowrap">After Cap</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroStatCard({
  prefix = '',
  targetNumber,
  suffix = '',
  label,
}: {
  prefix?: string;
  targetNumber: number;
  suffix?: string;
  label: string;
}) {
  const { displayValue, elementRef, hasAnimated } = useScrambleCounter(targetNumber, 2000);

  return (
    <div className="rounded-xl text-center" style={HERO_CARD_BASE}>
      <p className="text-tagline tabular-nums whitespace-nowrap invisible h-0 overflow-hidden" style={heroTaglineStyle} aria-hidden="true">
        {prefix}{targetNumber.toLocaleString()}{suffix}
      </p>
      <p className="text-tagline tabular-nums whitespace-nowrap" style={heroTaglineStyle}>
        <span>{prefix}</span>
        <span ref={elementRef}>
          {hasAnimated ? targetNumber.toLocaleString() : displayValue.toLocaleString()}
        </span>
        <span>{suffix}</span>
      </p>
      <p className="text-body text-sm opacity-70 whitespace-nowrap">{label}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function AboutExpRealty() {
  // Apply blue theme class to body so header/logo overrides work outside #main-content
  useEffect(() => {
    document.body.classList.add('about-exp-blue-theme');
    return () => document.body.classList.remove('about-exp-blue-theme');
  }, []);

  return (
    <main id="main-content">
      {/* Page-level blue theme overrides */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ringPulse { 0%,100% { box-shadow: 0 0 8px rgba(160,80,255,0.15); } 50% { box-shadow: 0 0 14px rgba(160,80,255,0.4), 0 0 28px rgba(160,80,255,0.2); } }

        /* Income & Ownership Grid Layout - custom breakpoint at 1200px */
        .income-cards-grid {
          display: grid;
          grid-template-columns: 1fr;
        }
        @media (min-width: 768px) {
          .income-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .income-cards-grid .income-card-md-full { grid-column: span 2; }
        }
        @media (min-width: 1200px) {
          .income-cards-grid {
            grid-template-columns: repeat(6, 1fr);
          }
          .income-cards-grid .income-card-2 { grid-column: span 2; }
          .income-cards-grid .income-card-3 { grid-column: span 3; }
        }

        /* Blue CTA light bars + glow — scoped to main content + header (not slide panels) */
        /* Variant-specific glow classes (.cta-glow-*) override the page-level blue below */
        .about-exp-blue-theme #main-content .cta-light-bar,
        .about-exp-blue-theme header .cta-light-bar {
          background: #00bfff !important;
        }
        .about-exp-blue-theme #main-content .cta-light-bar-pulse,
        .about-exp-blue-theme header .cta-light-bar-pulse {
          --glow-color: 0, 191, 255 !important;
        }
        /* Per-variant overrides — only purple + green escape the page-level blue */
        .about-exp-blue-theme #main-content .cta-light-bar-pulse.cta-glow-purple { --glow-color: 191, 95, 255 !important; }
        .about-exp-blue-theme #main-content .cta-light-bar-pulse.cta-glow-green { --glow-color: 0, 255, 136 !important; }
        .about-exp-blue-theme #main-content .cta-light-bar.cta-glow-purple { background: #9933ff !important; }
        .about-exp-blue-theme #main-content .cta-light-bar.cta-glow-green { background: #00cc66 !important; }

        /* Blue header + footer logo gradients */
        .about-exp-blue-theme #headerLogoGradient stop:nth-child(1),
        .about-exp-blue-theme #footerLogoGradient stop:nth-child(1) {
          stop-color: #b0e0ff !important;
        }
        .about-exp-blue-theme #headerLogoGradient stop:nth-child(2),
        .about-exp-blue-theme #footerLogoGradient stop:nth-child(2) {
          stop-color: #00bfff !important;
        }
        .about-exp-blue-theme #headerLogoGradient stop:nth-child(3),
        .about-exp-blue-theme #footerLogoGradient stop:nth-child(3) {
          stop-color: #0090c0 !important;
        }

        /* Blue compact S logo (PNG) — CSS filter to match blue theme */
        .about-exp-blue-theme .logo-compact img {
          filter: brightness(0) saturate(100%) invert(60%) sepia(90%) saturate(2000%) hue-rotate(170deg) brightness(1.05);
        }

        /* Blue hover borders on header CTA */
        .about-exp-blue-theme .header-btn a:hover {
          border-left-color: rgba(0, 191, 255, 0.4) !important;
          border-right-color: rgba(0, 191, 255, 0.4) !important;
        }

        /* Blue scroll progress bar */
        .about-exp-blue-theme .scroll-progress-bar > div {
          background-color: #00bfff !important;
          box-shadow: 0 0 10px rgba(0, 191, 255, 0.5), 0 0 20px rgba(0, 191, 255, 0.3) !important;
        }

        /* Blue burger menu */
        .about-exp-blue-theme .hamburger .line,
        .about-exp-blue-theme .hamburger.menu-open .line,
        .about-exp-blue-theme .hamburger-svg .line {
          stroke: #00bfff !important;
        }

        /* Blue footer rocket/flame icon + glow */
        .about-exp-blue-theme .rocket-icon {
          fill: #00bfff !important;
          filter: drop-shadow(0 0 10px rgba(0, 191, 255, 0.8)) !important;
        }

        /* Blue NeonCard — scoped to main content only (not slide panels) */
        .about-exp-blue-theme #main-content .cyber-card-gold-frame {
          border-color: #00bfff;
          box-shadow:
            0 0 4px 1px rgba(0, 191, 255, 0.5),
            0 0 8px 2px rgba(0, 191, 255, 0.35),
            0 0 16px 4px rgba(0, 191, 255, 0.2),
            0 0 24px 6px rgba(0, 191, 255, 0.1),
            0 4px 12px rgba(0,0,0,0.3);
        }
        .about-exp-blue-theme #main-content .cyber-card-gold-frame::after {
          box-shadow:
            0 0 6px 2px rgba(0, 191, 255, 0.6),
            0 0 12px 4px rgba(0, 191, 255, 0.4),
            0 0 20px 6px rgba(0, 191, 255, 0.25),
            0 0 32px 10px rgba(0, 191, 255, 0.12),
            0 6px 16px rgba(0,0,0,0.35);
        }
        .about-exp-blue-theme #main-content .cyber-card-gold-frame::before {
          border-color: rgba(255,255,255,0.5);
        }
      `}</style>

      {/* ════ Hero Section ════ */}
      <StickyHeroWrapper>
        <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
          <LazyAuroraNetworkEffect />
          <div className="max-w-[1900px] mx-auto w-full text-center relative z-10 flex-1 flex flex-col justify-center">
            <div className="relative z-10">
              <H1
                style={{
                  color: '#00bfff',
                  textShadow: `
                    0 0 0.01em #fff,
                    0 0 0.02em #fff,
                    0 0 0.03em rgba(255,255,255,0.8),
                    0 0 0.09em rgba(0, 191, 255, 0.8),
                    0 0 0.13em rgba(0, 191, 255, 0.55),
                    0 0 0.18em rgba(0, 140, 200, 0.35),
                    0.03em 0.03em 0 #2a2a2a,
                    0.045em 0.045em 0 #1a1a1a,
                    0.06em 0.06em 0 #0f0f0f,
                    0.075em 0.075em 0 #080808
                  `,
                  filter: 'drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1) drop-shadow(0 0 0.08em rgba(0, 191, 255, 0.25))',
                }}
              >ABOUT EXP REALTY</H1>
              <div className="mt-4 mx-auto" style={{ maxWidth: '1100px' }}>
                <Tagline style={{ fontSize: 'clamp(17px, 4vw, 37px)' }}>A brokerage built for efficient production and income beyond sales.</Tagline>
              </div>

              {/* Stats Cards with counter animation */}
              <div className="flex flex-wrap justify-center gap-2 mt-8 mx-auto" style={{ maxWidth: '1200px' }}>
                <FlipSplitCard />
                <HeroStatCard targetNumber={28} suffix="+" label="Countries" />
                <HeroStatCard prefix="S&P " targetNumber={600} label="Company" />
              </div>
            </div>
          </div>

        </section>
      </StickyHeroWrapper>

      {/* Sections wrapper — 100px gap + 50px glass padding = 150px visual spacing */}
      <div className="flex flex-col" style={{ gap: '100px' }}>
        <HowExpIsBuilt />
        <SpotlightConsole />
        <IncomeOwnershipSection />
        <SupportInfrastructureSection />
        <WhatExpProvidesVersionB />
        <AdditionalAreasSection />
        <WhoExpWorksBestForSection />
        <WhereSAAFitsVersionA />
      </div>

      {/* Blue H1 glow — must render AFTER H1 component so this keyframe wins */}
      <style>{`
        @keyframes h1GlowBreathe {
          0%, 100% {
            filter: drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1) drop-shadow(0 0 0.08em rgba(0, 191, 255, 0.25));
          }
          50% {
            filter: drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1.15) drop-shadow(0 0 0.15em rgba(0, 191, 255, 0.45));
          }
        }
      `}</style>
    </main>
  );
}
