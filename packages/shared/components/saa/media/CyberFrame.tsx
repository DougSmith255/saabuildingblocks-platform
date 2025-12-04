'use client';

import React, { useMemo } from 'react';

export interface CyberFrameProps {
  /** Content to wrap (image, video, iframe, etc.) */
  children: React.ReactNode;
  /** Optional className for the container */
  className?: string;
  /** Aspect ratio for videos (default: none for images, '16/9' for videos) */
  aspectRatio?: string;
  /** Whether this is a video container */
  isVideo?: boolean;
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
 *
 * @example
 * ```tsx
 * // Image
 * <CyberFrame>
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
}: CyberFrameProps) {
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
            /* Subtle green accent glow */
            0 0 15px rgba(0,255,136,0.1);
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
            0 0 25px rgba(0,255,136,0.2);
          border-color: rgba(0,255,136,0.3);
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
          border-top: 2px solid rgba(0,255,136,0.5);
          border-left: 2px solid rgba(0,255,136,0.5);
          /* Only round the outer corner (top-left of the L) */
          border-top-left-radius: 6px;
          border-top-right-radius: 0;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }

        .cyber-frame-corner-tr {
          top: 0;
          right: 0;
          border-top: 2px solid rgba(0,255,136,0.5);
          border-right: 2px solid rgba(0,255,136,0.5);
          /* Only round the outer corner (top-right of the L) */
          border-top-left-radius: 0;
          border-top-right-radius: 6px;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }

        .cyber-frame-corner-bl {
          bottom: 0;
          left: 0;
          border-bottom: 2px solid rgba(0,255,136,0.3);
          border-left: 2px solid rgba(0,255,136,0.3);
          /* Only round the outer corner (bottom-left of the L) */
          border-top-left-radius: 0;
          border-top-right-radius: 0;
          border-bottom-left-radius: 6px;
          border-bottom-right-radius: 0;
        }

        .cyber-frame-corner-br {
          bottom: 0;
          right: 0;
          border-bottom: 2px solid rgba(0,255,136,0.3);
          border-right: 2px solid rgba(0,255,136,0.3);
          /* Only round the outer corner (bottom-right of the L) */
          border-top-left-radius: 0;
          border-top-right-radius: 0;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 6px;
        }

        /* Hover - corners glow brighter */
        .cyber-frame:hover .cyber-frame-corner-tl,
        .cyber-frame:hover .cyber-frame-corner-tr {
          border-color: rgba(0,255,136,0.8);
          box-shadow: 0 0 8px rgba(0,255,136,0.4);
        }

        .cyber-frame:hover .cyber-frame-corner-bl,
        .cyber-frame:hover .cyber-frame-corner-br {
          border-color: rgba(0,255,136,0.5);
          box-shadow: 0 0 6px rgba(0,255,136,0.3);
        }
      `}</style>

      <div
        className={`cyber-frame ${className}`}
        style={{
          '--sheen-angle': `${randomValues.sheenAngle}deg`,
          '--sheen-pos': `${randomValues.sheenPosition}%`,
          '--hue-rotate': `${randomValues.hueRotate}deg`,
          '--holo-opacity': randomValues.holoOpacity,
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
