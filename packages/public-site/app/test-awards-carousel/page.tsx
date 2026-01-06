'use client';

import { useEffect, useRef, useState } from 'react';
import { H1, H2 } from '@saa/shared/components/saa';

/**
 * Test Page: Awards Carousel Variations
 * 5 different design approaches for the eXp awards section
 */

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

// ============================================
// VARIATION 1: Text-only scrolling with logo bar above
// ============================================
function Variation1() {
  const trackRef = useRef<HTMLDivElement>(null);
  useCarouselAnimation(trackRef);

  return (
    <section className="py-16 overflow-hidden">
      <div className="text-center mb-8 px-4">
        <h3 className="text-h4 mb-6" style={{ color: 'var(--color-header-text)' }}>Variation 1: Logo Bar + Text Carousel</h3>

        {/* Static Logo Bar */}
        <div className="flex justify-center items-center gap-12 mb-8">
          {LOGOS.map((logo) => (
            <img
              key={logo.id}
              src={logo.src}
              alt={logo.alt}
              className="h-8 md:h-10 w-auto object-contain opacity-70"
            />
          ))}
        </div>
      </div>

      {/* Scrolling Text Carousel */}
      <div className="relative">
        <PortalEdges />
        <div
          style={{
            marginLeft: '12px',
            marginRight: '12px',
            overflow: 'hidden',
            borderRadius: '12px',
          }}
        >
          <ShadowOverlays />
          <div
            ref={trackRef}
            className="flex items-center gap-16 py-6"
            style={{ willChange: 'transform' }}
          >
            {[...AWARDS, ...AWARDS].map((award, i) => (
              <span
                key={i}
                className="flex-shrink-0 text-sm md:text-base font-medium whitespace-nowrap"
                style={{ color: '#ffd700' }}
              >
                {award}
                <span className="mx-8 opacity-30">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// VARIATION 2: Awards with inline mini-logos
// ============================================
function Variation2() {
  const trackRef = useRef<HTMLDivElement>(null);
  useCarouselAnimation(trackRef);

  const awardsWithLogos = [
    { text: "America's Best Employers", logo: LOGOS[0] },
    { text: "Best Places to Work (8 years)", logo: LOGOS[1] },
    { text: "#1 U.S. Brokerage by Transactions", logo: LOGOS[2] },
    { text: "Top 3 by Sales Volume", logo: LOGOS[2] },
    { text: "500 Top-Ranked Brokerage", logo: LOGOS[2] },
  ];

  return (
    <section className="py-16 overflow-hidden">
      <div className="text-center mb-8 px-4">
        <h3 className="text-h4 mb-6" style={{ color: 'var(--color-header-text)' }}>Variation 2: Inline Mini-Logos with Awards</h3>
      </div>

      <div className="relative">
        <PortalEdges />
        <div
          style={{
            marginLeft: '12px',
            marginRight: '12px',
            overflow: 'hidden',
            borderRadius: '12px',
          }}
        >
          <ShadowOverlays />
          <div
            ref={trackRef}
            className="flex items-center gap-12 py-6"
            style={{ willChange: 'transform' }}
          >
            {[...awardsWithLogos, ...awardsWithLogos].map((item, i) => (
              <div
                key={i}
                className="flex-shrink-0 flex items-center gap-3 whitespace-nowrap"
              >
                <img
                  src={item.logo.src}
                  alt={item.logo.alt}
                  className="h-5 w-auto object-contain opacity-80"
                />
                <span className="text-sm md:text-base font-medium" style={{ color: '#e5e4dd' }}>
                  {item.text}
                </span>
                <span className="ml-6 opacity-20" style={{ color: '#ffd700' }}>✦</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// VARIATION 3: Two-row design (logos top, text bottom)
// ============================================
function Variation3() {
  const logoTrackRef = useRef<HTMLDivElement>(null);
  const textTrackRef = useRef<HTMLDivElement>(null);
  useCarouselAnimation(logoTrackRef);
  useCarouselAnimation(textTrackRef);

  return (
    <section className="py-16 overflow-hidden">
      <div className="text-center mb-8 px-4">
        <h3 className="text-h4 mb-6" style={{ color: 'var(--color-header-text)' }}>Variation 3: Two-Row (Logos + Text)</h3>
      </div>

      {/* Logo Row */}
      <div className="relative mb-2">
        <PortalEdges />
        <div
          style={{
            marginLeft: '12px',
            marginRight: '12px',
            overflow: 'hidden',
            borderRadius: '12px 12px 0 0',
            background: 'rgba(255,215,0,0.03)',
          }}
        >
          <ShadowOverlays />
          <div
            ref={logoTrackRef}
            className="flex items-center gap-20 py-4"
            style={{ willChange: 'transform' }}
          >
            {[...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS].map((logo, i) => (
              <img
                key={i}
                src={logo.src}
                alt={logo.alt}
                className="h-8 w-auto object-contain opacity-70 flex-shrink-0"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Text Row */}
      <div className="relative">
        <PortalEdges />
        <div
          style={{
            marginLeft: '12px',
            marginRight: '12px',
            overflow: 'hidden',
            borderRadius: '0 0 12px 12px',
            borderTop: '1px solid rgba(255,215,0,0.1)',
          }}
        >
          <ShadowOverlays />
          <div
            ref={textTrackRef}
            className="flex items-center gap-12 py-4"
            style={{ willChange: 'transform' }}
          >
            {[...AWARDS, ...AWARDS].map((award, i) => (
              <span
                key={i}
                className="flex-shrink-0 text-sm font-medium whitespace-nowrap"
                style={{ color: '#bfbdb0' }}
              >
                {award}
                <span className="mx-6 opacity-30">|</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// VARIATION 4: Ticker-style with gold background
// ============================================
function Variation4() {
  const trackRef = useRef<HTMLDivElement>(null);
  useCarouselAnimation(trackRef);

  return (
    <section className="py-16 overflow-hidden">
      <div className="text-center mb-8 px-4">
        <h3 className="text-h4 mb-6" style={{ color: 'var(--color-header-text)' }}>Variation 4: Ticker-Style with Accent Band</h3>

        {/* Static Logo Bar */}
        <div className="flex justify-center items-center gap-16 mb-6">
          {LOGOS.map((logo) => (
            <img
              key={logo.id}
              src={logo.src}
              alt={logo.alt}
              className="h-10 md:h-12 w-auto object-contain opacity-60"
            />
          ))}
        </div>
      </div>

      {/* Ticker Band - extends to screen edges, attached to side bars */}
      <div className="relative">
        <PortalEdges />
        <div
          style={{
            marginLeft: '12px',
            marginRight: '12px',
            overflow: 'hidden',
            background: 'linear-gradient(180deg, rgba(20,20,20,0.75) 0%, rgba(15,15,15,0.8) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
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
    </section>
  );
}

// ============================================
// VARIATION 5: Elegant single-line with fading edges
// ============================================
function Variation5() {
  const trackRef = useRef<HTMLDivElement>(null);
  useCarouselAnimation(trackRef);

  return (
    <section className="py-16 overflow-hidden">
      <div className="text-center mb-8 px-4">
        <h3 className="text-h4 mb-6" style={{ color: 'var(--color-header-text)' }}>Variation 5: Elegant with Logo Separators</h3>
      </div>

      <div className="relative">
        <PortalEdges />
        <div
          style={{
            marginLeft: '12px',
            marginRight: '12px',
            overflow: 'hidden',
            borderRadius: '12px',
          }}
        >
          <ShadowOverlays />
          <div
            ref={trackRef}
            className="flex items-center gap-6 py-6"
            style={{ willChange: 'transform' }}
          >
            {[...AWARDS, ...AWARDS].map((award, i) => {
              // Cycle through logos as separators
              const logoIndex = i % LOGOS.length;
              return (
                <div key={i} className="flex items-center gap-6 flex-shrink-0">
                  <span
                    className="text-sm md:text-base whitespace-nowrap"
                    style={{ color: '#e5e4dd', opacity: 0.9 }}
                  >
                    {award}
                  </span>
                  <img
                    src={LOGOS[logoIndex].src}
                    alt=""
                    className="h-4 w-auto object-contain opacity-40"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// MAIN TEST PAGE
// ============================================
export default function TestAwardsCarousel() {
  return (
    <main id="main-content" className="min-h-screen py-16">
      <div className="text-center px-4 mb-16">
        <H1>AWARDS CAROUSEL TEST</H1>
        <p className="text-body mt-4 max-w-2xl mx-auto">
          5 variations of the awards carousel design. All use the same scroll-boost effect and 3D portal edges from the homepage logo carousel.
        </p>
      </div>

      <div className="space-y-8">
        <div className="border-b border-white/10 pb-8">
          <Variation1 />
        </div>

        <div className="border-b border-white/10 pb-8">
          <Variation2 />
        </div>

        <div className="border-b border-white/10 pb-8">
          <Variation3 />
        </div>

        <div className="border-b border-white/10 pb-8">
          <Variation4 />
        </div>

        <div className="pb-8">
          <Variation5 />
        </div>
      </div>

      <div className="text-center px-4 mt-16">
        <p className="text-caption" style={{ color: 'var(--text-muted)' }}>
          Note: Glassdoor and RealTrends logos need to be uploaded to Cloudflare Images or placed in /public/images/
        </p>
      </div>
    </main>
  );
}
