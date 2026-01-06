'use client';

import { useEffect, useRef } from 'react';
import { H1, Tagline, GlassPanel, Icon3D } from '@saa/shared/components/saa';
import { StickyHeroWrapper } from '@/components/shared/hero-effects/StickyHeroWrapper';
import { SatelliteConstellationEffect } from '@/components/shared/hero-effects/SatelliteConstellationEffect';

const CLOUDFLARE_BASE = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg';

// Award text items for scrolling
const AWARDS = [
  "Forbes America's Best Employers",
  "Glassdoor Best Places to Work (8 years straight)",
  "#1 U.S. Brokerage by Transactions, RealTrends",
  "Top 3 Brokerage by Sales Volume, RealTrends",
  "RealTrends 500 Top-Ranked Brokerage",
];

// Logo sources - all from Cloudflare Images
const LOGOS = [
  { id: 'forbes-logo', alt: 'Forbes', src: `${CLOUDFLARE_BASE}/forbes-logo/public` },
  { id: 'glassdoor-logo', alt: 'Glassdoor', src: `${CLOUDFLARE_BASE}/glassdoor-logo/public` },
  { id: 'realtrends-logo', alt: 'RealTrends', src: `${CLOUDFLARE_BASE}/realtrends-logo/public` },
];

// Reusable carousel hook with scroll boost
function useCarouselAnimation(trackRef: React.RefObject<HTMLDivElement | null>) {
  const animationRef = useRef<number | null>(null);
  const positionRef = useRef(0);
  const velocityRef = useRef(0.5);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const animate = () => {
      const singleSetWidth = track.scrollWidth / 2;

      if (singleSetWidth > 0) {
        positionRef.current += velocityRef.current;

        if (velocityRef.current > 0.5) {
          velocityRef.current *= 0.98;
          if (velocityRef.current < 0.5) velocityRef.current = 0.5;
        }

        if (positionRef.current >= singleSetWidth) {
          positionRef.current = positionRef.current - singleSetWidth;
        }

        track.style.transform = `translateX(-${positionRef.current}px)`;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY.current);
      lastScrollY.current = currentScrollY;

      const boost = Math.min(scrollDelta * 0.3, 8);
      if (boost > 0.5) {
        velocityRef.current = Math.max(velocityRef.current, boost);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [trackRef]);
}

// 3D Portal Edge Bars Component
function PortalEdges() {
  return (
    <>
      {/* Left curved bar */}
      <div
        className="absolute left-0 z-20 pointer-events-none"
        style={{
          top: '-8px',
          bottom: '-8px',
          width: '12px',
          borderRadius: '0 12px 12px 0',
          background: `radial-gradient(ellipse 200% 50% at 0% 50%,
            rgba(255,200,50,0.35) 0%,
            rgba(255,180,0,0.2) 40%,
            rgba(180,140,0,0.1) 70%,
            rgba(100,80,0,0.05) 100%
          )`,
          borderRight: '1px solid rgba(255,190,0,0.4)',
          boxShadow: `
            inset -3px 0 6px rgba(255,200,50,0.2),
            inset -1px 0 2px rgba(255,220,100,0.3),
            3px 0 12px rgba(0,0,0,0.6),
            6px 0 24px rgba(0,0,0,0.3)
          `,
          transform: 'perspective(500px) rotateY(-3deg)',
          transformOrigin: 'right center',
        }}
      />
      {/* Right curved bar */}
      <div
        className="absolute right-0 z-20 pointer-events-none"
        style={{
          top: '-8px',
          bottom: '-8px',
          width: '12px',
          borderRadius: '12px 0 0 12px',
          background: `radial-gradient(ellipse 200% 50% at 100% 50%,
            rgba(255,200,50,0.35) 0%,
            rgba(255,180,0,0.2) 40%,
            rgba(180,140,0,0.1) 70%,
            rgba(100,80,0,0.05) 100%
          )`,
          borderLeft: '1px solid rgba(255,190,0,0.4)',
          boxShadow: `
            inset 3px 0 6px rgba(255,200,50,0.2),
            inset 1px 0 2px rgba(255,220,100,0.3),
            -3px 0 12px rgba(0,0,0,0.6),
            -6px 0 24px rgba(0,0,0,0.3)
          `,
          transform: 'perspective(500px) rotateY(3deg)',
          transformOrigin: 'left center',
        }}
      />
    </>
  );
}

// Shadow Overlays Component
function ShadowOverlays() {
  return (
    <>
      <div
        className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none"
        style={{
          width: '30px',
          background: 'radial-gradient(ellipse 100% 60% at 0% 50%, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)',
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none"
        style={{
          width: '30px',
          background: 'radial-gradient(ellipse 100% 60% at 100% 50%, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)',
        }}
      />
    </>
  );
}

// Stats data
const STATS = [
  { value: 'S&P 600', label: 'Company' },
  { value: '84,000+', label: 'Agents' },
  { value: '29+', label: 'Countries' },
];

// Awards Ribbon Component with Glass Panel (full-width)
function AwardsRibbon() {
  const trackRef = useRef<HTMLDivElement>(null);
  useCarouselAnimation(trackRef);

  return (
    <GlassPanel variant="marigoldCrosshatch" rounded="3xl">
      <section className="py-12 md:py-16 overflow-visible">
        {/* Stats Cards - 3 horizontal cards with 3D text */}
        <div className="max-w-[1900px] mx-auto px-4 md:px-8 mb-8">
          <div className="grid grid-cols-3 gap-4 md:gap-8">
            {STATS.map((stat, index) => (
              <div
                key={index}
                className="text-center p-4 md:p-6 rounded-xl"
                style={{
                  background: 'rgba(20,20,20,0.75)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <p className="stat-3d-text text-2xl md:text-4xl lg:text-5xl font-bold mb-1 md:mb-2">
                  {stat.value}
                </p>
                <p className="text-xs md:text-sm uppercase tracking-wider" style={{ color: 'var(--color-body-text)', opacity: 0.8 }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Ticker Band - full width edge to edge with proper portal edges */}
        <div className="relative w-screen -ml-[50vw] left-1/2">
          {/* 3D Portal Edges at screen edges */}
          <div
            className="absolute left-0 z-20 pointer-events-none"
            style={{
              top: '-8px',
              bottom: '-8px',
              width: '12px',
              borderRadius: '0 12px 12px 0',
              background: `radial-gradient(ellipse 200% 50% at 0% 50%,
                rgba(255,200,50,0.35) 0%,
                rgba(255,180,0,0.2) 40%,
                rgba(180,140,0,0.1) 70%,
                rgba(100,80,0,0.05) 100%
              )`,
              borderRight: '1px solid rgba(255,190,0,0.4)',
              boxShadow: `
                inset -3px 0 6px rgba(255,200,50,0.2),
                inset -1px 0 2px rgba(255,220,100,0.3),
                3px 0 12px rgba(0,0,0,0.6),
                6px 0 24px rgba(0,0,0,0.3)
              `,
              transform: 'perspective(500px) rotateY(-3deg)',
              transformOrigin: 'right center',
            }}
          />
          <div
            className="absolute right-0 z-20 pointer-events-none"
            style={{
              top: '-8px',
              bottom: '-8px',
              width: '12px',
              borderRadius: '12px 0 0 12px',
              background: `radial-gradient(ellipse 200% 50% at 100% 50%,
                rgba(255,200,50,0.35) 0%,
                rgba(255,180,0,0.2) 40%,
                rgba(180,140,0,0.1) 70%,
                rgba(100,80,0,0.05) 100%
              )`,
              borderLeft: '1px solid rgba(255,190,0,0.4)',
              boxShadow: `
                inset 3px 0 6px rgba(255,200,50,0.2),
                inset 1px 0 2px rgba(255,220,100,0.3),
                -3px 0 12px rgba(0,0,0,0.6),
                -6px 0 24px rgba(0,0,0,0.3)
              `,
              transform: 'perspective(500px) rotateY(3deg)',
              transformOrigin: 'left center',
            }}
          />

          {/* Inner content with margins for portal edges */}
          <div
            className="relative overflow-hidden"
            style={{
              marginLeft: '12px',
              marginRight: '12px',
              background: 'rgba(20,20,20,0.75)',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <ShadowOverlays />
            <div
              ref={trackRef}
              className="flex items-center py-5"
              style={{ willChange: 'transform' }}
            >
              {[...AWARDS, ...AWARDS].map((award, i) => (
                <div key={i} className="flex items-center flex-shrink-0">
                  <span
                    className="text-sm md:text-base font-semibold uppercase tracking-wide whitespace-nowrap"
                    style={{ color: 'var(--color-header-text)' }}
                  >
                    {award}
                  </span>
                  <span
                    className="mx-6 text-lg"
                    style={{
                      color: '#ffd700',
                      textShadow: '0 0 8px rgba(255,215,0,0.7), 0 0 16px rgba(255,215,0,0.5), 0 0 24px rgba(255,215,0,0.3)',
                    }}
                  >★</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Logo Bar - below the ribbon with 3D effect (spacing reduced) */}
        <div className="max-w-[1900px] mx-auto">
          <div className="flex justify-center items-center gap-10 md:gap-16 mt-5 pb-2 px-4">
            {LOGOS.map((logo) => (
              <Icon3D key={logo.id} size={logo.id === 'glassdoor-logo' ? 156 : 120}>
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className={`w-auto object-contain ${logo.id === 'glassdoor-logo' ? 'h-[78px] md:h-[78px]' : 'h-20 md:h-[60px]'}`}
                  style={{ filter: 'brightness(0) invert(0.8)' }}
                />
              </Icon3D>
            ))}
          </div>
        </div>
      </section>
    </GlassPanel>
  );
}

/**
 * About eXp Realty Page
 * Comprehensive overview of eXp Realty's features, benefits, and business model
 * Brand tone: awe-inspiring, futuristic, direct
 */
export default function AboutExpRealty() {
  return (
    <main id="main-content">
      {/* Hero Section */}
      <StickyHeroWrapper>
        <section className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
          <SatelliteConstellationEffect />
          <div className="max-w-[1900px] mx-auto w-full text-center relative z-10">
            <H1>ABOUT EXP REALTY</H1>
            <Tagline className="mt-4">
              World&apos;s #1 independent brokerage.
            </Tagline>
            <p className="text-body mt-4" style={{ opacity: 0.9 }}>
              Production-focused. Future-proofed.
            </p>
          </div>
        </section>
      </StickyHeroWrapper>

      {/* Awards Ribbon Section */}
      <AwardsRibbon />

      {/* Sections to be built properly */}
    </main>
  );
}
