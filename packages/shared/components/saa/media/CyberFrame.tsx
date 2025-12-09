'use client';

import React, { useState, useEffect } from 'react';

export interface CyberFrameProps {
  /** Content to wrap (image, video, iframe, etc.) */
  children: React.ReactNode;
  /** Optional className for the container */
  className?: string;
  /** Aspect ratio for videos (default: none for images, '16/9' for videos) */
  aspectRatio?: string;
  /** Whether this is a video container */
  isVideo?: boolean;
  /** Color variant: 'gold' (default) or 'green' */
  variant?: 'gold' | 'green';
}

/**
 * CyberFrame - Futuristic holographic glass frame for images and videos
 *
 * MASTER CONTROLLER COMPONENT
 * Location: @saa/shared/components/saa/media/CyberFrame
 *
 * Features:
 * - 3D metal frame (gradient, inset shadows, border glow)
 * - Holographic glass overlay (glossy sheen + iridescent rainbow)
 * - Randomized sheen position per instance
 * - Subtle hover effect (sheen shifts like tilting glass)
 * - Works with images, videos, iframes
 * - Two color variants: gold (default) and green
 *
 * @example
 * ```tsx
 * // Image with gold accents (default)
 * <CyberFrame>
 *   <img src="/photo.jpg" alt="Example" />
 * </CyberFrame>
 *
 * // Image with green accents
 * <CyberFrame variant="green">
 *   <img src="/photo.jpg" alt="Example" />
 * </CyberFrame>
 *
 * // Video/iframe
 * <CyberFrame isVideo aspectRatio="16/9">
 *   <iframe src="https://youtube.com/embed/..." />
 * </CyberFrame>
 * ```
 */
export function CyberFrame({
  children,
  className = '',
  aspectRatio,
  isVideo = false,
  variant = 'gold',
}: CyberFrameProps) {
  // Use fixed initial values to avoid hydration mismatch, randomize after mount
  const [randomValues, setRandomValues] = useState({
    sheenAngle: 30,
    sheenPosition: 50,
    hueRotate: 180,
    holoOpacity: '0.035',
  });

  useEffect(() => {
    // Randomize values only on client after hydration
    setRandomValues({
      sheenAngle: Math.floor(Math.random() * 30) + 15,
      sheenPosition: Math.floor(Math.random() * 60) + 20,
      hueRotate: Math.floor(Math.random() * 360),
      holoOpacity: (Math.random() * 0.03 + 0.02).toFixed(3),
    });
  }, []);

  // Color values based on variant
  const colors = variant === 'green'
    ? {
        glow: 'rgba(0,255,136,0.1)',
        glowHover: 'rgba(0,255,136,0.2)',
        border: 'rgba(0,255,136,0.3)',
        cornerTop: 'rgba(0,255,136,0.5)',
        cornerBottom: 'rgba(0,255,136,0.3)',
        cornerHoverTop: 'rgba(0,255,136,0.8)',
        cornerHoverBottom: 'rgba(0,255,136,0.5)',
        cornerGlowTop: 'rgba(0,255,136,0.4)',
        cornerGlowBottom: 'rgba(0,255,136,0.3)',
      }
    : {
        glow: 'rgba(255,215,0,0.1)',
        glowHover: 'rgba(255,215,0,0.2)',
        border: 'rgba(255,215,0,0.3)',
        cornerTop: 'rgba(255,215,0,0.5)',
        cornerBottom: 'rgba(255,215,0,0.3)',
        cornerHoverTop: 'rgba(255,215,0,0.8)',
        cornerHoverBottom: 'rgba(255,215,0,0.5)',
        cornerGlowTop: 'rgba(255,215,0,0.4)',
        cornerGlowBottom: 'rgba(255,215,0,0.3)',
      };

  const frameClass = `cyber-frame cyber-frame-${variant}`;

  return (
    <>
      <style jsx global>{`
        .cyber-frame {
          position: relative;
          display: inline-block;
          /* 3D Metal Frame - separate from H2 plates */
          padding: 6px;
          background: linear-gradient(145deg, rgba(80,80,80,0.6) 0%, rgba(40,40,40,0.8) 50%, rgba(60,60,60,0.6) 100%);
          border-radius: 12px;
          border: 1px solid rgba(150,150,150,0.4);
          box-shadow:
            /* Outer shadow for depth */
            0 4px 20px rgba(0,0,0,0.6),
            /* Inner highlight for 3D bevel */
            inset 0 1px 0 rgba(255,255,255,0.15),
            inset 0 -1px 0 rgba(0,0,0,0.3),
            /* Accent glow - uses CSS variable */
            0 0 15px var(--cf-glow);
        }

        .cyber-frame-inner {
          position: relative;
          overflow: hidden;
          border-radius: 8px;
          background: #0a0a0a;
        }

        /* Holographic glass overlay - uses translate for smooth animation */
        .cyber-frame-inner::before {
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
            rgba(255,255,255,0.08) 42%,
            rgba(255,255,255,0.15) 50%,
            rgba(255,255,255,0.08) 58%,
            transparent 65%,
            transparent 100%
          );
          /* Start position based on random value */
          transform: translateX(calc(var(--sheen-pos, 40%) - 50%));
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s ease;
        }

        /* Holographic iridescent overlay */
        .cyber-frame-inner::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 11;
          pointer-events: none;
          /* Rainbow gradient for holographic effect */
          background: linear-gradient(
            calc(var(--sheen-angle, 25deg) + 90deg),
            rgba(255, 0, 128, 0.03) 0%,
            rgba(128, 0, 255, 0.03) 20%,
            rgba(0, 128, 255, 0.03) 40%,
            rgba(0, 255, 128, 0.03) 60%,
            rgba(255, 255, 0, 0.03) 80%,
            rgba(255, 128, 0, 0.03) 100%
          );
          mix-blend-mode: overlay;
          filter: hue-rotate(var(--hue-rotate, 0deg));
          opacity: var(--holo-opacity, 0.8);
          transition: filter 0.6s ease, opacity 0.4s ease;
        }

        /* Hover effect - sheen smoothly slides across */
        .cyber-frame:hover .cyber-frame-inner::before {
          transform: translateX(calc(var(--sheen-pos, 40%) + 30%));
        }

        /* Hover - holographic becomes slightly more visible and shifts hue */
        .cyber-frame:hover .cyber-frame-inner::after {
          filter: hue-rotate(calc(var(--hue-rotate, 0deg) + 30deg));
          opacity: 1;
        }

        /* Hover - frame glows more */
        .cyber-frame:hover {
          box-shadow:
            0 4px 25px rgba(0,0,0,0.7),
            inset 0 1px 0 rgba(255,255,255,0.2),
            inset 0 -1px 0 rgba(0,0,0,0.3),
            0 0 25px var(--cf-glow-hover);
          border-color: var(--cf-border);
        }

        /* Ensure child content fills properly */
        .cyber-frame-inner > img,
        .cyber-frame-inner > video {
          display: block;
          width: 100%;
          height: auto;
          border-radius: 6px;
        }

        /* Video/iframe aspect ratio container */
        .cyber-frame-video {
          position: relative;
          width: 100%;
        }

        .cyber-frame-video iframe,
        .cyber-frame-video video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: none;
          border-radius: 6px;
        }

        /* Corner tech accents - L-shaped with rounded outer tip */
        .cyber-frame-corner {
          position: absolute;
          width: 16px;
          height: 16px;
          z-index: 12;
          pointer-events: none;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .cyber-frame-corner-tl {
          top: 0;
          left: 0;
          border-top: 2px solid var(--cf-corner-top);
          border-left: 2px solid var(--cf-corner-top);
          border-top-left-radius: 6px;
        }

        .cyber-frame-corner-tr {
          top: 0;
          right: 0;
          border-top: 2px solid var(--cf-corner-top);
          border-right: 2px solid var(--cf-corner-top);
          border-top-right-radius: 6px;
        }

        .cyber-frame-corner-bl {
          bottom: 0;
          left: 0;
          border-bottom: 2px solid var(--cf-corner-bottom);
          border-left: 2px solid var(--cf-corner-bottom);
          border-bottom-left-radius: 6px;
        }

        .cyber-frame-corner-br {
          bottom: 0;
          right: 0;
          border-bottom: 2px solid var(--cf-corner-bottom);
          border-right: 2px solid var(--cf-corner-bottom);
          border-bottom-right-radius: 6px;
        }

        /* Hover - corners glow brighter */
        .cyber-frame:hover .cyber-frame-corner-tl,
        .cyber-frame:hover .cyber-frame-corner-tr {
          border-color: var(--cf-corner-hover-top);
          box-shadow: 0 0 8px var(--cf-corner-glow-top);
        }

        .cyber-frame:hover .cyber-frame-corner-bl,
        .cyber-frame:hover .cyber-frame-corner-br {
          border-color: var(--cf-corner-hover-bottom);
          box-shadow: 0 0 6px var(--cf-corner-glow-bottom);
        }
      `}</style>

      <div
        className={`${frameClass} ${className}`}
        style={{
          '--sheen-angle': `${randomValues.sheenAngle}deg`,
          '--sheen-pos': `${randomValues.sheenPosition}%`,
          '--hue-rotate': `${randomValues.hueRotate}deg`,
          '--holo-opacity': randomValues.holoOpacity,
          '--cf-glow': colors.glow,
          '--cf-glow-hover': colors.glowHover,
          '--cf-border': colors.border,
          '--cf-corner-top': colors.cornerTop,
          '--cf-corner-bottom': colors.cornerBottom,
          '--cf-corner-hover-top': colors.cornerHoverTop,
          '--cf-corner-hover-bottom': colors.cornerHoverBottom,
          '--cf-corner-glow-top': colors.cornerGlowTop,
          '--cf-corner-glow-bottom': colors.cornerGlowBottom,
        } as React.CSSProperties}
      >
        <div
          className={`cyber-frame-inner ${isVideo ? 'cyber-frame-video' : ''}`}
          style={aspectRatio ? { aspectRatio } : undefined}
        >
          {children}

          {/* Corner tech accents */}
          <div className="cyber-frame-corner cyber-frame-corner-tl" />
          <div className="cyber-frame-corner cyber-frame-corner-tr" />
          <div className="cyber-frame-corner cyber-frame-corner-bl" />
          <div className="cyber-frame-corner cyber-frame-corner-br" />
        </div>
      </div>
    </>
  );
}

export default CyberFrame;
