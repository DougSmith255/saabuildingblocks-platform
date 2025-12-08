'use client';

import React from 'react';

export interface GoldEmbossedTextProps {
  /** Text content */
  children: React.ReactNode;
  /** Optional className for additional styling (font-size, etc.) */
  className?: string;
  /** HTML element to render: 'span', 'div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' */
  as?: 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

/**
 * GoldEmbossedText - Raised/embossed gold text effect
 *
 * MASTER CONTROLLER COMPONENT
 * Location: @saa/shared/components/saa/text/GoldEmbossedText
 *
 * Features:
 * - Rich gold gradient color
 * - Raised/embossed 3D effect (highlight on top, shadow on bottom)
 * - Looks like text stamped into gold metal
 * - Works at any font size
 *
 * Use for:
 * - Premium headings inside CyberCardGold
 * - Trophy/award-style text
 * - Featured titles that need gold emphasis
 *
 * @example
 * ```tsx
 * <GoldEmbossedText className="text-3xl font-bold">
 *   Premium Feature
 * </GoldEmbossedText>
 * ```
 */
export function GoldEmbossedText({
  children,
  className = '',
  as: Component = 'span',
}: GoldEmbossedTextProps) {
  return (
    <>
      <style jsx global>{`
        .gold-embossed-text {
          /* Gold gradient fill */
          background: linear-gradient(
            180deg,
            #fff6d5 0%,
            #ffd700 20%,
            #e6b800 50%,
            #cc9900 80%,
            #b38600 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;

          /* Embossed/raised effect using text-shadow */
          /* Light on top (raised surface catching light) */
          /* Dark on bottom (shadow beneath raised text) */
          text-shadow:
            /* Top highlight - light catching the raised edge */
            0 -1px 0 rgba(255, 255, 255, 0.4),
            0 -2px 2px rgba(255, 245, 200, 0.3),
            /* Bottom shadow - depth beneath raised text */
            0 1px 0 rgba(0, 0, 0, 0.4),
            0 2px 3px rgba(0, 0, 0, 0.3),
            0 4px 6px rgba(0, 0, 0, 0.2),
            /* Subtle gold glow */
            0 0 10px rgba(255, 215, 0, 0.2);

          /* Ensure crisp rendering */
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
      <Component className={`gold-embossed-text ${className}`}>
        {children}
      </Component>
    </>
  );
}

export default GoldEmbossedText;
