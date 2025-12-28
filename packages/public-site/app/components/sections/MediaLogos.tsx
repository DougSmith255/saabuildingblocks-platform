'use client';

import { useEffect, useRef, useState } from 'react';
import { H2 } from '@saa/shared/components/saa';

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

  // Carousel animation
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Get the width of one set of logos
    const singleSetWidth = track.scrollWidth / 2;

    const animate = () => {
      // Apply velocity with decay
      positionRef.current += velocityRef.current;

      // Decay velocity back to base
      if (velocityRef.current > 0.5) {
        velocityRef.current *= 0.98;
        if (velocityRef.current < 0.5) velocityRef.current = 0.5;
      }

      // Reset position for seamless loop
      if (positionRef.current >= singleSetWidth) {
        positionRef.current = 0;
      }

      track.style.transform = `translateX(-${positionRef.current}px)`;
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
      {/* Corner fill gradients - only bottom corners (hero is above), z-0 = behind glass */}
      <div className="absolute bottom-0 left-0 w-24 h-24 pointer-events-none z-0" style={{ background: 'radial-gradient(circle at bottom left, #080808 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none z-0" style={{ background: 'radial-gradient(circle at bottom right, #080808 0%, transparent 70%)' }} />

      {/* Glass shimmer animation */}
      <style>{`
        @keyframes glassShimmerMedia {
          0% { background-position: 300% 0; }
          100% { background-position: -300% 0; }
        }
        .glass-shimmer-media {
          animation: glassShimmerMedia 30s linear infinite;
        }
      `}</style>
      {/* 3D Glass Plate Background */}
      <div
        className="absolute inset-x-0 inset-y-0 pointer-events-none rounded-3xl overflow-hidden z-[1]"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.25) 100%)',
          borderTop: '1px solid rgba(255,255,255,0.15)',
          borderBottom: '2px solid rgba(0,0,0,0.6)',
          boxShadow: `
            inset 0 1px 0 rgba(255,255,255,0.12),
            inset 0 2px 4px rgba(255,255,255,0.05),
            inset 0 -2px 0 rgba(0,0,0,0.4),
            inset 0 -4px 8px rgba(0,0,0,0.2),
            0 4px 12px rgba(0,0,0,0.3)
          `,
          backdropFilter: 'blur(2px)',
        }}
      >
        {/* Animated shimmer wave - subtle gradient */}
        <div
          className="absolute inset-0 glass-shimmer-media"
          style={{
            background: 'linear-gradient(105deg, transparent 0%, transparent 20%, rgba(255,255,255,0.025) 35%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.025) 65%, transparent 80%, transparent 100%)',
            backgroundSize: '300% 100%',
          }}
        />
        {/* Noise texture overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            opacity: 0.03,
            mixBlendMode: 'overlay',
          }}
        />
      </div>
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
        <H2>eXp Realty in the News</H2>
        <p
          className={`text-body max-w-3xl mx-auto opacity-80 mb-8 transition-all duration-700 delay-150 ease-out ${
            isVisible ? 'opacity-80 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          eXp, the largest independent brokerage in the world, is a S&P 600 SmallCap company
          and the first cloud-based brokerage that has been featured in major national and global media outlets.
        </p>
      </div>

      {/* Carousel Container */}
      <div
        className={`relative z-10 transition-all duration-700 delay-300 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Two unified gradient masks - left and right */}
        {/* Left mask: fades from left screen edge toward center, and fades top/bottom */}
        <div
          className="absolute left-0 w-48 md:w-72 z-10 pointer-events-none"
          style={{
            top: '-20%',
            bottom: '-20%',
            background: '#0b0a0a',
            maskImage: `
              linear-gradient(to right, black 0%, transparent 100%),
              linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)
            `,
            maskComposite: 'intersect',
            WebkitMaskImage: `
              linear-gradient(to right, black 0%, transparent 100%),
              linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)
            `,
            WebkitMaskComposite: 'source-in',
          }}
        />
        {/* Right mask: fades from right screen edge toward center, and fades top/bottom */}
        <div
          className="absolute right-0 w-48 md:w-72 z-10 pointer-events-none"
          style={{
            top: '-20%',
            bottom: '-20%',
            background: '#0b0a0a',
            maskImage: `
              linear-gradient(to left, black 0%, transparent 100%),
              linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)
            `,
            maskComposite: 'intersect',
            WebkitMaskImage: `
              linear-gradient(to left, black 0%, transparent 100%),
              linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)
            `,
            WebkitMaskComposite: 'source-in',
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
                loading={index < 10 ? 'eager' : 'lazy'}
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
    </section>
  );
}

export default MediaLogos;
