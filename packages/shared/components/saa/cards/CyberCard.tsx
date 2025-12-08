'use client';

import React, { useMemo } from 'react';

export interface CyberCardProps {
  /** Card content */
  children: React.ReactNode;
  /** Optional className for the container */
  className?: string;
  /** Padding size: 'sm' (p-4), 'md' (p-6), 'lg' (p-8), 'xl' (p-10) */
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  /** Center the content */
  centered?: boolean;
  /** Link URL - wraps card in anchor tag */
  href?: string;
}

const paddingClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
};

/**
 * CyberCard - Premium futuristic card for featured content and stats
 *
 * MASTER CONTROLLER COMPONENT
 * Location: @saa/shared/components/saa/cards/CyberCard
 *
 * Features:
 * - 3D metal frame (gradient, inset shadows, border glow)
 * - Holographic glass overlay (glossy sheen + iridescent rainbow)
 * - Brand yellow corner accents (L-shaped)
 * - Randomized sheen position per instance
 * - Hover effect: slight lift + enhanced yellow glow
 *
 * Use for:
 * - Important stats and metrics
 * - Featured content that needs attention
 * - Key numbers and highlights
 *
 * @example
 * ```tsx
 * <CyberCard>
 *   <div className="text-5xl font-bold text-amber-400">2,900+</div>
 *   <p className="text-[#dcdbd5]">Agents Strong</p>
 * </CyberCard>
 * ```
 */
export function CyberCard({
  children,
  className = '',
  padding = 'md',
  centered = true,
  href,
}: CyberCardProps) {
  // Generate random values for this instance (consistent per mount)
  const randomValues = useMemo(() => ({
    // Sheen angle: 15-45 degrees
    sheenAngle: Math.floor(Math.random() * 30) + 15,
    // Sheen position: 20-80% across
    sheenPosition: Math.floor(Math.random() * 60) + 20,
    // Holographic hue rotation: 0-360 degrees
    hueRotate: Math.floor(Math.random() * 360),
    // Slight variation in holographic intensity
    holoOpacity: (Math.random() * 0.03 + 0.02).toFixed(3), // 0.02-0.05
  }), []);

  const paddingClass = paddingClasses[padding];
  const centerClass = centered ? 'text-center' : '';

  const cardContent = (
    <>
      <style jsx global>{`
        .cyber-card {
          position: relative;
          display: block;
          /* 3D Metal Frame */
          background: linear-gradient(145deg, rgba(80,80,80,0.6) 0%, rgba(40,40,40,0.8) 50%, rgba(60,60,60,0.6) 100%);
          border-radius: 12px;
          border: 1px solid rgba(150,150,150,0.4);
          box-shadow:
            /* Outer shadow for depth */
            0 4px 20px rgba(0,0,0,0.6),
            /* Inner highlight for 3D bevel */
            inset 0 1px 0 rgba(255,255,255,0.15),
            inset 0 -1px 0 rgba(0,0,0,0.3),
            /* Subtle yellow accent glow */
            0 0 15px rgba(255,215,0,0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }

        .cyber-card-inner {
          position: relative;
          overflow: hidden;
          border-radius: 10px;
          background: rgba(10,10,10,0.8);
        }

        /* Holographic glass overlay - uses translate for smooth animation */
        .cyber-card-inner::before {
          content: "";
          position: absolute;
          inset: -100% -50%;
          z-index: 10;
          pointer-events: none;
          /* Glossy sheen gradient - wider to allow smooth sliding */
          background: linear-gradient(
            var(--sheen-angle, 25deg),
            transparent 0%,
            transparent 35%,
            rgba(255,255,255,0.06) 42%,
            rgba(255,255,255,0.12) 50%,
            rgba(255,255,255,0.06) 58%,
            transparent 65%,
            transparent 100%
          );
          /* Start position based on random value */
          transform: translateX(calc(var(--sheen-pos, 40%) - 50%));
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        /* Holographic iridescent overlay */
        .cyber-card-inner::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 11;
          pointer-events: none;
          /* Rainbow gradient for holographic effect */
          background: linear-gradient(
            calc(var(--sheen-angle, 25deg) + 90deg),
            rgba(255, 0, 128, 0.02) 0%,
            rgba(128, 0, 255, 0.02) 20%,
            rgba(0, 128, 255, 0.02) 40%,
            rgba(0, 255, 128, 0.02) 60%,
            rgba(255, 255, 0, 0.02) 80%,
            rgba(255, 128, 0, 0.02) 100%
          );
          mix-blend-mode: overlay;
          filter: hue-rotate(var(--hue-rotate, 0deg));
          opacity: var(--holo-opacity, 0.8);
          transition: filter 0.6s ease, opacity 0.4s ease;
        }

        /* Hover effect - lift + enhanced glow */
        .cyber-card:hover {
          transform: translateY(-3px);
          box-shadow:
            0 8px 30px rgba(0,0,0,0.7),
            inset 0 1px 0 rgba(255,255,255,0.2),
            inset 0 -1px 0 rgba(0,0,0,0.3),
            0 0 30px rgba(255,215,0,0.25);
          border-color: rgba(255,215,0,0.4);
        }

        /* Hover - sheen smoothly slides across */
        .cyber-card:hover .cyber-card-inner::before {
          transform: translateX(calc(var(--sheen-pos, 40%) + 30%));
        }

        /* Hover - holographic becomes slightly more visible and shifts hue */
        .cyber-card:hover .cyber-card-inner::after {
          filter: hue-rotate(calc(var(--hue-rotate, 0deg) + 30deg));
          opacity: 1;
        }

        /* Corner tech accents - L-shaped with brand yellow */
        .cyber-card-corner {
          position: absolute;
          width: 16px;
          height: 16px;
          z-index: 12;
          pointer-events: none;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .cyber-card-corner-tl {
          top: 0;
          left: 0;
          border-top: 2px solid rgba(255,215,0,0.5);
          border-left: 2px solid rgba(255,215,0,0.5);
          border-top-left-radius: 6px;
        }

        .cyber-card-corner-tr {
          top: 0;
          right: 0;
          border-top: 2px solid rgba(255,215,0,0.5);
          border-right: 2px solid rgba(255,215,0,0.5);
          border-top-right-radius: 6px;
        }

        .cyber-card-corner-bl {
          bottom: 0;
          left: 0;
          border-bottom: 2px solid rgba(255,215,0,0.3);
          border-left: 2px solid rgba(255,215,0,0.3);
          border-bottom-left-radius: 6px;
        }

        .cyber-card-corner-br {
          bottom: 0;
          right: 0;
          border-bottom: 2px solid rgba(255,215,0,0.3);
          border-right: 2px solid rgba(255,215,0,0.3);
          border-bottom-right-radius: 6px;
        }

        /* Hover - corners glow brighter */
        .cyber-card:hover .cyber-card-corner-tl,
        .cyber-card:hover .cyber-card-corner-tr {
          border-color: rgba(255,215,0,0.9);
          box-shadow: 0 0 10px rgba(255,215,0,0.5);
        }

        .cyber-card:hover .cyber-card-corner-bl,
        .cyber-card:hover .cyber-card-corner-br {
          border-color: rgba(255,215,0,0.6);
          box-shadow: 0 0 8px rgba(255,215,0,0.4);
        }

        /* Content container */
        .cyber-card-content {
          position: relative;
          z-index: 5;
        }
      `}</style>

      <div
        className={`cyber-card ${className}`}
        style={{
          '--sheen-angle': `${randomValues.sheenAngle}deg`,
          '--sheen-pos': `${randomValues.sheenPosition}%`,
          '--hue-rotate': `${randomValues.hueRotate}deg`,
          '--holo-opacity': randomValues.holoOpacity,
        } as React.CSSProperties}
      >
        <div className="cyber-card-inner">
          <div className={`cyber-card-content ${paddingClass} ${centerClass}`}>
            {children}
          </div>

          {/* Corner tech accents */}
          <div className="cyber-card-corner cyber-card-corner-tl" />
          <div className="cyber-card-corner cyber-card-corner-tr" />
          <div className="cyber-card-corner cyber-card-corner-bl" />
          <div className="cyber-card-corner cyber-card-corner-br" />
        </div>
      </div>
    </>
  );

  // Wrap in link if href is provided
  if (href) {
    return (
      <a href={href} className="block no-underline">
        {cardContent}
      </a>
    );
  }

  return cardContent;
}

export default CyberCard;
