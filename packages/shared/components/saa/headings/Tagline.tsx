import React from 'react';
import { extractPlainText } from '../../../utils/extractPlainText';

export interface TaglineProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** @deprecated Animation removed - using page-level settling mask instead */
  heroAnimate?: boolean;
  /** @deprecated Animation removed - using page-level settling mask instead */
  animationDelay?: string;
  /** @deprecated Use counterSuffix prop with a client component instead */
  showAgentCounter?: boolean;
  /** Optional counter suffix ReactNode - pass a client component for viewport-aware rendering */
  counterSuffix?: React.ReactNode;
}

/**
 * Tagline Component - Server Component (No JavaScript Required)
 *
 * PERFORMANCE OPTIMIZATIONS:
 * - Pure Server Component (no 'use client')
 * - Single DOM node for text (was ~30+ nodes with per-character rendering)
 * - CSS text-shadow for glow effects (GPU accelerated)
 * - ~95% reduction in DOM nodes
 *
 * Features:
 * - Neon glow using text-shadow (matches H1 style, tagline colors)
 * - 3D transform with rotateX
 * - Alt glyphs for N, E, M via font-feature-settings "ss01"
 * - Body text color (#bfbdb0)
 *
 * SEO/ACCESSIBILITY:
 * - Uses real letters in DOM (Google reads correctly)
 * - Copy/paste gives real letters
 * - Font's ss01 stylistic set renders alternate glyphs visually
 *
 * @example
 * ```tsx
 * <Tagline>For Agents Who Want More</Tagline>
 * ```
 */
export default function Tagline({
  children,
  className = '',
  style = {},
  counterSuffix,
}: TaglineProps) {
  // Extract plain text for SEO/accessibility
  const plainText = extractPlainText(children);

  // Optimized text-shadow with drop-shadow for glow (GPU accelerated)
  // White core in text-shadow, glow via filter: drop-shadow
  const textShadow = `
    /* WHITE CORE (3) - em units for scaling */
    0 0 0.01em #fff,
    0 0 0.02em #fff,
    0 0 0.03em rgba(255,255,255,0.8)
  `;

  // GPU-accelerated glow via filter
  const filter = `
    drop-shadow(0 0 0.04em #bfbdb0)
    drop-shadow(0 0 0.08em rgba(191,189,176,0.6))
  `;

  return (
    <p
      className={`text-tagline ${className}`}
      style={{
        textAlign: 'center',
        transform: 'rotateX(15deg)',
        position: 'relative',
        color: '#bfbdb0',
        fontFeatureSettings: '"ss01" 1',
        textShadow,
        filter: filter.trim(),
        ...style
      }}
    >
      {children} {counterSuffix}
    </p>
  );
}
