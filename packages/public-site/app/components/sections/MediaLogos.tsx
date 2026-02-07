'use client';

import { useEffect, useRef } from 'react';
import { H2 } from '@saa/shared/components/saa';
import { IconCyberCard } from '@saa/shared/components/saa/cards';
import { TrendingUp, Cloud, Users, Percent, Award } from 'lucide-react';

const CLOUDFLARE_BASE = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg';

const logos = [
  { id: 'wsj-logo', alt: 'The Wall Street Journal' },
  { id: 'cnbc-logo', alt: 'CNBC' },
  { id: 'fox-business-logo', alt: 'Fox Business' },
  { id: 'bloomberg-logo', alt: 'Bloomberg' },
  { id: 'yahoo-finance-logo', alt: 'Yahoo Finance' },
  { id: 'forbes-logo', alt: 'Forbes' },
  { id: 'business-insider-logo', alt: 'Business Insider' },
  { id: 'market-watch-logo', alt: 'MarketWatch' },
  { id: 'reuters-logo', alt: 'Reuters' },
  { id: 'usa-today-logo', alt: 'USA Today' },
  { id: 'la-times-logo', alt: 'Los Angeles Times' },
  { id: 'washington-post-logo', alt: 'The Washington Post' },
  { id: 'nasdaq-logo', alt: 'Nasdaq' },
  { id: 'barrons-logo', alt: "Barron's" },
  { id: 'new-york-post-logo', alt: 'New York Post' },
];

/**
 * MediaLogos - Scrolling carousel of media outlet logos
 *
 * Features:
 * - Auto-scrolling infinite carousel
 * - Scroll-boost: accelerates based on user scroll velocity
 * - Pause on hover
 * - Seamless loop with duplicated logos
 * - Modern entrance animation on scroll into view
 */
export function MediaLogos() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const positionRef = useRef(0);
  const velocityRef = useRef(1.2); // Base velocity (px per frame) - 1.2x speed

  // Carousel animation - recalculates width each frame to handle image loading
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const animate = () => {
      // Recalculate width each frame to handle late-loading images
      const singleSetWidth = track.scrollWidth / 2;

      // Only animate if we have a valid width
      if (singleSetWidth > 0) {
        // Constant velocity - no scroll boost for better performance
        positionRef.current += velocityRef.current;

        // Reset position for seamless loop (with small buffer to prevent jumps)
        if (positionRef.current >= singleSetWidth) {
          positionRef.current = positionRef.current - singleSetWidth;
        }

        track.style.transform = `translateX(-${positionRef.current}px)`;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-24 overflow-hidden"
    >
      {/* SVG filter for subtle crosshatch/sandpaper texture on logos */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="crosshatch-texture" x="-5%" y="-5%" width="110%" height="110%">
            {/* Create fine diagonal lines pattern */}
            <feTurbulence type="fractalNoise" baseFrequency="0.8 0.8" numOctaves="1" seed="5" result="noise" />
            {/* Very subtle displacement for texture feel */}
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.4" xChannelSelector="R" yChannelSelector="G" result="textured" />
            {/* Subtle top highlight for engraved look */}
            <feSpecularLighting in="noise" surfaceScale="0.8" specularConstant="0.3" specularExponent="35" lightingColor="#ffffff" result="highlight">
              <feDistantLight azimuth="225" elevation="45" />
            </feSpecularLighting>
            {/* Blend highlight with textured image */}
            <feComposite in="highlight" in2="SourceGraphic" operator="in" result="highlightMask" />
            <feBlend in="textured" in2="highlightMask" mode="screen" result="final" />
          </filter>
        </defs>
      </svg>

      {/* Heading - uses master controller H2 component */}
      <div className="text-center px-4 relative z-10">
        <H2>Why eXp Realty?</H2>

        {/* Cards Grid: 3 on top, 2 on bottom */}
        <div
          className="mx-auto mb-8"
          style={{ maxWidth: '1800px' }}
        >
          {/* Top Row - 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Card 1: Profitable */}
            <IconCyberCard
              icon={<TrendingUp className="w-6 h-6 md:w-7 md:h-7" />}
              theme="yellow"
              hover
              centered
            >
              <h3 className="font-bold mb-2" style={{ color: '#e5e4dd', fontSize: 'clamp(24px, calc(22.55px + 0.58vw), 40px)' }}>Proven Profitability</h3>
              <p className="text-body opacity-90 text-sm">The only cumulatively profitable public real estate company.</p>
            </IconCyberCard>

            {/* Card 2: Cloud-Based */}
            <IconCyberCard
              icon={<Cloud className="w-6 h-6 md:w-7 md:h-7" />}
              theme="yellow"
              hover
              centered
            >
              <h3 className="font-bold mb-2" style={{ color: '#e5e4dd', fontSize: 'clamp(24px, calc(22.55px + 0.58vw), 40px)' }}>Cloud-First Pioneer</h3>
              <p className="text-body opacity-90 text-sm">S&P 600 SmallCap. First cloud-based brokerage.</p>
            </IconCyberCard>

            {/* Card 3: Sponsor Choice */}
            <IconCyberCard
              icon={<Users className="w-6 h-6 md:w-7 md:h-7" />}
              theme="yellow"
              hover
              centered
            >
              <h3 className="font-bold mb-2" style={{ color: '#e5e4dd', fontSize: 'clamp(24px, calc(22.55px + 0.58vw), 40px)' }}>Choose Your Sponsor</h3>
              <p className="text-body opacity-90 text-sm">Access real systems and support through the sponsor you choose.</p>
            </IconCyberCard>
          </div>

          {/* Bottom Row - 2 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 4: Commission - Green */}
            <IconCyberCard
              icon={<Percent className="w-6 h-6 md:w-7 md:h-7" />}
              theme="green"
              hover
              centered
            >
              <h3 className="font-bold mb-2" style={{ color: '#00cc66', fontSize: 'clamp(24px, calc(22.55px + 0.58vw), 40px)' }}>Industry-Leading Splits</h3>
              <p className="text-body opacity-90 text-sm">80/20 split until cap → 100% commission. Flat monthly fee.</p>
            </IconCyberCard>

            {/* Card 5: RevShare - Purple */}
            <IconCyberCard
              icon={<Award className="w-6 h-6 md:w-7 md:h-7" />}
              theme="purple"
              hover
              centered
            >
              <h3 className="font-bold mb-2" style={{ color: '#9933ff', fontSize: 'clamp(24px, calc(22.55px + 0.58vw), 40px)' }}>Passive Income Potential</h3>
              <p className="text-body opacity-90 text-sm">Optional revenue share income + stock opportunities.</p>
            </IconCyberCard>
          </div>
        </div>
      </div>

      {/* Caption above logo scroller */}
      <p className="text-body text-sm opacity-60 text-center mb-6 px-4">
        eXp is frequently featured in major national and global media outlets.
      </p>

      {/* Carousel Container - portal edges at screen edges */}
      <div className="relative z-10">
        {/* 3D Curved Portal Edges - raised bars that logos slide under */}
        {/* Left curved bar */}
        <div
          className="absolute left-0 z-20 pointer-events-none"
          style={{
            top: '-8px',
            bottom: '-8px',
            width: '12px',
            borderRadius: '0 12px 12px 0',
            /* Convex gradient - center raised (brightest), edges recessed (darker) */
            background: `
              radial-gradient(ellipse 200% 50% at 0% 50%,
                rgba(255,200,50,0.35) 0%,
                rgba(255,180,0,0.2) 40%,
                rgba(180,140,0,0.1) 70%,
                rgba(100,80,0,0.05) 100%
              )
            `,
            borderRight: '1px solid rgba(255,190,0,0.4)',
            boxShadow: `
              inset -3px 0 6px rgba(255,200,50,0.2),
              inset -1px 0 2px rgba(255,220,100,0.3),
              3px 0 12px rgba(0,0,0,0.6),
              6px 0 24px rgba(0,0,0,0.3)
            `,
            /* Slight curve toward edge */
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
            /* Convex gradient - center raised (brightest), edges recessed (darker) */
            background: `
              radial-gradient(ellipse 200% 50% at 100% 50%,
                rgba(255,200,50,0.35) 0%,
                rgba(255,180,0,0.2) 40%,
                rgba(180,140,0,0.1) 70%,
                rgba(100,80,0,0.05) 100%
              )
            `,
            borderLeft: '1px solid rgba(255,190,0,0.4)',
            boxShadow: `
              inset 3px 0 6px rgba(255,200,50,0.2),
              inset 1px 0 2px rgba(255,220,100,0.3),
              -3px 0 12px rgba(0,0,0,0.6),
              -6px 0 24px rgba(0,0,0,0.3)
            `,
            /* Slight curve toward edge */
            transform: 'perspective(500px) rotateY(3deg)',
            transformOrigin: 'left center',
          }}
        />

        {/* Inner clipping container - clips logos at inner edge of 3D bars */}
        <div
          className="relative"
          style={{
            marginLeft: '12px',
            marginRight: '12px',
            overflow: 'hidden',
            borderRadius: '12px',
          }}
        >
          {/* Shadow overlays - these sit above logos to simulate bar shadow */}
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

          {/* Scrolling Track */}
          <div
            ref={trackRef}
            className="flex items-center gap-8 md:gap-16 py-8"
            style={{
              willChange: 'transform',
            }}
          >
            {/* Double the logos for seamless loop - with 3D effect matching agent attraction page */}
            {[...logos, ...logos].map((logo, index) => (
              <div
                key={`${logo.id}-${index}`}
                className="flex-shrink-0 flex items-center justify-center"
                style={{
                  minWidth: 'clamp(180px, 15vw, 200px)',
                }}
              >
                {/* 3D wrapper - matches [slug].js .logo-3d-wrapper */}
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '120px',
                    height: '120px',
                    filter: 'drop-shadow(-1px -1px 0 #e6d99a) drop-shadow(1px 1px 0 #756429) drop-shadow(3px 3px 0 #2a2a1d) drop-shadow(4px 4px 2px rgba(0, 0, 0, 0.5))',
                    transform: 'perspective(500px) rotateX(8deg)',
                  }}
                >
                  <img
                    src={`${CLOUDFLARE_BASE}/${logo.id}/public`}
                    alt={logo.alt}
                    loading="eager"
                    className="h-[70px] md:h-[72px] w-auto object-contain"
                    style={{
                      maxWidth: 'clamp(200px, 18vw, 300px)',
                      filter: 'brightness(0) invert(0.8)',
                    }}
                  />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default MediaLogos;
