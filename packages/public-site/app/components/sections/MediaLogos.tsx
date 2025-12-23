'use client';

import { useEffect, useRef, useState } from 'react';

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
  const isPaused = useRef(false);
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
      if (!isPaused.current) {
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

  const handleMouseEnter = () => {
    isPaused.current = true;
  };

  const handleMouseLeave = () => {
    isPaused.current = false;
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-24 overflow-hidden"
    >
      {/* SVG filter for frosted/textured glass effect on logos */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="frosted-texture" x="-20%" y="-20%" width="140%" height="140%">
            {/* Noise texture */}
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
            {/* Displacement for roughness */}
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G" result="displaced" />
            {/* Slight blur for frosted look */}
            <feGaussianBlur in="displaced" stdDeviation="0.3" result="blurred" />
            {/* Enhance contrast */}
            <feComponentTransfer in="blurred" result="enhanced">
              <feFuncR type="linear" slope="1.1" intercept="0.05" />
              <feFuncG type="linear" slope="1.1" intercept="0.05" />
              <feFuncB type="linear" slope="1.1" intercept="0.05" />
            </feComponentTransfer>
            {/* Add specular lighting for shine */}
            <feSpecularLighting in="noise" surfaceScale="2" specularConstant="0.8" specularExponent="20" lightingColor="#ffffff" result="specular">
              <fePointLight x="-100" y="-100" z="200" />
            </feSpecularLighting>
            {/* Composite specular with image */}
            <feComposite in="specular" in2="SourceGraphic" operator="in" result="specularMask" />
            <feBlend in="enhanced" in2="specularMask" mode="screen" result="final" />
          </filter>
        </defs>
      </svg>

      {/* Heading - flat, no 3D transform */}
      <div
        className={`text-center mb-8 md:mb-12 px-4 transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <h2 className="text-h2 text-display" style={{ color: '#bfbdb0' }}>
          eXp Realty in the News
        </h2>
        <p
          className={`text-body mt-4 max-w-3xl mx-auto opacity-80 transition-all duration-700 delay-150 ease-out ${
            isVisible ? 'opacity-80 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          eXp, the largest independent brokerage in the world, is a S&P 600 SmallCap company
          and the first cloud-based brokerage that has been featured in major national and global media outlets.
        </p>
      </div>

      {/* Carousel Container */}
      <div
        className={`relative transition-all duration-700 delay-300 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Fade edges - seamless blend into background */}
        <div
          className="absolute left-0 top-0 bottom-0 w-32 md:w-48 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, var(--background, #0a0a0a) 0%, var(--background, #0a0a0a) 20%, transparent 100%)',
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-32 md:w-48 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to left, var(--background, #0a0a0a) 0%, var(--background, #0a0a0a) 20%, transparent 100%)',
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
                loading="lazy"
                className="h-full w-auto object-contain"
                style={{
                  maxWidth: 'clamp(200px, 18vw, 240px)',
                  filter: 'url(#frosted-texture) brightness(1.2) contrast(1.1)',
                  opacity: 0.85,
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
