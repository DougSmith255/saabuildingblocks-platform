'use client';

import React from 'react';
import Image from 'next/image';

export interface FuturisticImageFrameProps {
  /** Image source URL */
  src: string;
  /** Image alt text */
  alt: string;
  /** Optional width (default: 100%) */
  width?: number;
  /** Optional height */
  height?: number;
  /** Optional caption */
  caption?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * FuturisticImageFrame - Sci-fi styled image frame for blog content
 *
 * Features:
 * - Metal plate frame effect with beveled edges
 * - Luminescent glow emanating from image
 * - Corner accents with gold highlights
 * - Subtle scanning line animation
 * - Responsive sizing
 *
 * @example
 * ```tsx
 * <FuturisticImageFrame
 *   src="/images/chart.png"
 *   alt="Revenue growth chart"
 *   caption="Q4 2024 Performance"
 * />
 * ```
 */
export function FuturisticImageFrame({
  src,
  alt,
  width,
  height,
  caption,
  className = '',
}: FuturisticImageFrameProps) {
  return (
    <figure className={`futuristic-frame my-8 ${className}`}>
      {/* Outer glow container */}
      <div className="relative">
        {/* Background glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#ffd700]/20 via-[#00ff88]/10 to-[#ffd700]/20 rounded-lg blur-md opacity-75" />

        {/* Metal frame */}
        <div
          className="relative rounded-lg overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 50%, #0f0f0f 100%)',
            boxShadow: `
              inset 0 1px 0 rgba(255,255,255,0.1),
              inset 0 -1px 0 rgba(0,0,0,0.5),
              0 0 20px rgba(255,215,0,0.15),
              0 0 40px rgba(0,255,136,0.1)
            `,
            padding: '3px',
          }}
        >
          {/* Inner frame border */}
          <div
            className="relative rounded-md overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #333 0%, #1a1a1a 100%)',
              padding: '2px',
            }}
          >
            {/* Image container */}
            <div className="relative rounded overflow-hidden bg-[#0a0a0a]">
              {/* Scanning line effect */}
              <div
                className="absolute inset-0 z-10 pointer-events-none opacity-30"
                style={{
                  background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
                }}
              />

              {/* Image */}
              {width && height ? (
                <Image
                  src={src}
                  alt={alt}
                  width={width}
                  height={height}
                  className="w-full h-auto object-cover"
                />
              ) : (
                <img
                  src={src}
                  alt={alt}
                  className="w-full h-auto object-cover"
                />
              )}

              {/* Top highlight line */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.5), transparent)',
                }}
              />

              {/* Bottom highlight line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(0,255,136,0.3), transparent)',
                }}
              />
            </div>
          </div>

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#ffd700]/50 rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#ffd700]/50 rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00ff88]/40 rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00ff88]/40 rounded-br-lg" />
        </div>
      </div>

      {/* Caption */}
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-[#808080] font-[var(--font-amulya)] italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export default FuturisticImageFrame;
