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
        {/* Fade edges - transparent fade */}
        <div
          className="absolute left-0 top-0 bottom-0 w-24 md:w-40 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, rgba(10,10,10,1) 0%, transparent 100%)',
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-24 md:w-40 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to left, rgba(10,10,10,1) 0%, transparent 100%)',
          }}
        />

        {/* Scrolling Track */}
        <div
          ref={trackRef}
          className="flex items-center gap-12 md:gap-20 py-8"
          style={{
            willChange: 'transform',
          }}
        >
          {/* Double the logos for seamless loop */}
          {[...logos, ...logos].map((logo, index) => (
            <div
              key={`${logo.id}-${index}`}
              className="flex-shrink-0 flex items-center justify-center logo-container"
              style={{
                // Mobile: 48px, Desktop: 64px
                height: 'clamp(48px, 5vw, 64px)',
                minWidth: 'clamp(120px, 12vw, 180px)',
                position: 'relative',
              }}
            >
              {/* Brushed metal background plate */}
              <div
                className="absolute inset-0 rounded-lg"
                style={{
                  background: `
                    linear-gradient(135deg,
                      rgba(60,60,60,0.9) 0%,
                      rgba(45,45,45,0.9) 25%,
                      rgba(55,55,55,0.9) 50%,
                      rgba(40,40,40,0.9) 75%,
                      rgba(50,50,50,0.9) 100%
                    )
                  `,
                  // Brushed metal texture using repeating gradients
                  backgroundImage: `
                    linear-gradient(135deg,
                      rgba(60,60,60,0.95) 0%,
                      rgba(45,45,45,0.95) 25%,
                      rgba(55,55,55,0.95) 50%,
                      rgba(40,40,40,0.95) 75%,
                      rgba(50,50,50,0.95) 100%
                    ),
                    repeating-linear-gradient(
                      90deg,
                      transparent 0px,
                      rgba(255,255,255,0.03) 1px,
                      transparent 2px,
                      transparent 4px
                    )
                  `,
                  border: '1px solid rgba(80,80,80,0.5)',
                  borderTop: '1px solid rgba(120,120,120,0.4)',
                  borderBottom: '1px solid rgba(30,30,30,0.6)',
                  boxShadow: `
                    inset 0 1px 0 rgba(255,255,255,0.1),
                    inset 0 -1px 0 rgba(0,0,0,0.2),
                    0 2px 8px rgba(0,0,0,0.3)
                  `,
                  padding: '12px 20px',
                }}
              />
              {/* Shine highlight overlay */}
              <div
                className="absolute inset-0 rounded-lg pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(255,255,255,0.03) 100%)',
                }}
              />
              <img
                src={`${CLOUDFLARE_BASE}/${logo.id}/public`}
                alt={logo.alt}
                loading="lazy"
                className="h-full w-auto object-contain relative z-10"
                style={{
                  maxWidth: 'clamp(150px, 15vw, 220px)',
                  filter: 'brightness(1.15) contrast(1.05)',
                  padding: '8px 16px',
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
