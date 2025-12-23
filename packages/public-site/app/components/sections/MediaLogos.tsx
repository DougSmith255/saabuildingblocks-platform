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

      {/* Heading - uses master controller H2 component */}
      <div
        className={`text-center mb-8 md:mb-12 px-4 transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <H2>eXp Realty in the News</H2>
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
      >
        {/* Fade edges - wide gradient that seamlessly blends into background */}
        <div
          className="absolute left-0 w-40 md:w-64 z-10 pointer-events-none"
          style={{
            top: '-50%',
            bottom: '-50%',
            background: 'linear-gradient(to right, #111111 0%, rgba(17,17,17,0.95) 30%, rgba(17,17,17,0.7) 50%, rgba(17,17,17,0.3) 70%, transparent 100%)',
          }}
        />
        <div
          className="absolute right-0 w-40 md:w-64 z-10 pointer-events-none"
          style={{
            top: '-50%',
            bottom: '-50%',
            background: 'linear-gradient(to left, #111111 0%, rgba(17,17,17,0.95) 30%, rgba(17,17,17,0.7) 50%, rgba(17,17,17,0.3) 70%, transparent 100%)',
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
                  filter: 'brightness(1.15) contrast(1.05)',
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
