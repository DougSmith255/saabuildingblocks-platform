'use client';

import { useEffect, useRef, useState } from 'react';
import { H2, Icon3D, SecondaryButton } from '@saa/shared/components/saa';
import { TrendingUp, Cloud, Percent, Award, Users } from 'lucide-react';

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
  const velocityRef = useRef(0.5); // Base velocity (px per frame)
  const lastScrollY = useRef(0);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer for entrance animation
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Carousel animation - recalculates width each frame to handle image loading
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const animate = () => {
      // Recalculate width each frame to handle late-loading images
      const singleSetWidth = track.scrollWidth / 2;

      // Only animate if we have a valid width
      if (singleSetWidth > 0) {
        // Apply velocity with decay
        positionRef.current += velocityRef.current;

        // Decay velocity back to base
        if (velocityRef.current > 0.5) {
          velocityRef.current *= 0.98;
          if (velocityRef.current < 0.5) velocityRef.current = 0.5;
        }

        // Reset position for seamless loop (with small buffer to prevent jumps)
        if (positionRef.current >= singleSetWidth) {
          positionRef.current = positionRef.current - singleSetWidth;
        }

        track.style.transform = `translateX(-${positionRef.current}px)`;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    // Scroll boost handler
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY.current);
      lastScrollY.current = currentScrollY;

      // Boost velocity based on scroll speed (capped)
      const boost = Math.min(scrollDelta * 0.3, 8);
      if (boost > 0.5) {
        velocityRef.current = Math.max(velocityRef.current, boost);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Removed hover pause - carousel now scrolls continuously

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
      <div
        className={`text-center px-4 transition-all duration-700 ease-out relative z-10 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <H2>Why eXp Realty?</H2>

        {/* Cards Grid: 3 on top, 2 on bottom */}
        <div
          className="mx-auto mb-8"
          style={{ maxWidth: '1800px' }}
        >
          {/* Top Row - 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Card 1: Profitable */}
            <div
              className="p-6 rounded-2xl text-center flex flex-col items-center transition-all duration-700 ease-out"
              style={{
                background: 'rgba(10,10,10,0.6)',
                border: '1px solid rgba(255,215,0,0.15)',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transitionDelay: '0.2s',
              }}
            >
              <div className="mb-4">
                <Icon3D size={80}><TrendingUp className="w-12 h-12" /></Icon3D>
              </div>
              <h3 className="font-bold mb-2" style={{ color: '#e5e4dd', fontSize: 'clamp(24px, calc(22.55px + 0.58vw), 40px)' }}>Proven Profitability</h3>
              <p className="text-body opacity-90 text-sm">The only cumulatively profitable public real estate company.</p>
            </div>

            {/* Card 2: Cloud-Based */}
            <div
              className="p-6 rounded-2xl text-center flex flex-col items-center transition-all duration-700 ease-out"
              style={{
                background: 'rgba(10,10,10,0.6)',
                border: '1px solid rgba(255,215,0,0.15)',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transitionDelay: '0.35s',
              }}
            >
              <div className="mb-4">
                <Icon3D size={80}><Cloud className="w-12 h-12" /></Icon3D>
              </div>
              <h3 className="font-bold mb-2" style={{ color: '#e5e4dd', fontSize: 'clamp(24px, calc(22.55px + 0.58vw), 40px)' }}>Cloud-First Pioneer</h3>
              <p className="text-body opacity-90 text-sm">S&P 600 SmallCap. First cloud-based brokerage.</p>
            </div>

            {/* Card 3: Sponsor Choice */}
            <div
              className="p-6 rounded-2xl text-center flex flex-col items-center transition-all duration-700 ease-out"
              style={{
                background: 'rgba(10,10,10,0.6)',
                border: '1px solid rgba(255,215,0,0.15)',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transitionDelay: '0.5s',
              }}
            >
              <div className="mb-4">
                <Icon3D size={80}><Users className="w-12 h-12" /></Icon3D>
              </div>
              <h3 className="font-bold mb-2" style={{ color: '#e5e4dd', fontSize: 'clamp(24px, calc(22.55px + 0.58vw), 40px)' }}>Choose Your Sponsor</h3>
              <p className="text-body opacity-90 text-sm">Choose your sponsor. Access real support.</p>
            </div>
          </div>

          {/* Bottom Row - 2 cards with colored borders and buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 4: Commission - Green */}
            <div
              className="p-6 rounded-2xl text-center flex flex-col items-center transition-all duration-700 ease-out"
              style={{
                background: 'rgba(10,10,10,0.6)',
                border: '2px solid rgba(0,204,102,0.5)',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transitionDelay: '0.65s',
              }}
            >
              <div className="mb-4">
                <Icon3D size={80} color="#00cc66"><Percent className="w-12 h-12" /></Icon3D>
              </div>
              <h3 className="font-bold mb-2" style={{ color: '#00cc66', fontSize: 'clamp(24px, calc(22.55px + 0.58vw), 40px)' }}>Industry-Leading Splits</h3>
              <p className="text-body opacity-90 text-sm mb-4">80/20 split until cap → 100% commission. Flat monthly fee.</p>
              <div className="mt-auto">
                <SecondaryButton href="/exp-commission-calculator/" variant="green">
                  Commission Calculator
                </SecondaryButton>
              </div>
            </div>

            {/* Card 5: RevShare - Purple */}
            <div
              className="p-6 rounded-2xl text-center flex flex-col items-center transition-all duration-700 ease-out"
              style={{
                background: 'rgba(10,10,10,0.6)',
                border: '2px solid rgba(153,51,255,0.5)',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transitionDelay: '0.8s',
              }}
            >
              <div className="mb-4">
                <Icon3D size={80} color="#9933ff"><Award className="w-12 h-12" /></Icon3D>
              </div>
              <h3 className="font-bold mb-2" style={{ color: '#9933ff', fontSize: 'clamp(24px, calc(22.55px + 0.58vw), 40px)' }}>Passive Income Potential</h3>
              <p className="text-body opacity-90 text-sm mb-4">Optional revenue share income + stock opportunities.</p>
              <div className="mt-auto">
                <SecondaryButton href="/exp-realty-revenue-share-calculator/" variant="purple">
                  RevShare Visualizer
                </SecondaryButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Container - portal edges at screen edges */}
      <div
        className={`relative z-10 transition-all duration-700 delay-300 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
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
            {/* Double the logos for seamless loop */}
            {[...logos, ...logos].map((logo, index) => (
              <div
                key={`${logo.id}-${index}`}
                className="flex-shrink-0 flex items-center justify-center"
                style={{
                  // Mobile: 80px (doubled from 40), Desktop: 56px
                  height: 'clamp(80px, 6vw, 56px)',
                  minWidth: 'clamp(180px, 15vw, 200px)',
                }}
              >
                <img
                  src={`${CLOUDFLARE_BASE}/${logo.id}/public`}
                  alt={logo.alt}
                  loading="eager"
                  className="h-full w-auto object-contain"
                  style={{
                    maxWidth: 'clamp(200px, 18vw, 240px)',
                    filter: 'url(#crosshatch-texture) brightness(1.1) contrast(1.05)',
                    opacity: 0.9,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default MediaLogos;
