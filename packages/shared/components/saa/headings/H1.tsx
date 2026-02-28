'use client';

import React from 'react';
import { extractPlainText } from '../../../utils/extractPlainText';

export interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  /** Disable the glow breathe animation */
  noAnimation?: boolean;
  /**
   * Always disable the close gold glow (layer 4: 0 0 0.05em #ffd700).
   * When false/undefined, layer 4 is responsive: hidden on screens <1200px, visible on ≥1200px.
   * Use this for link pages and agent portal where layer 4 should always be disabled.
   */
  disableCloseGlow?: boolean;
}

/**
 * H1 Component - Optimized Neon Sign Effect
 *
 * PERFORMANCE OPTIMIZATIONS:
 * - Single DOM node (was ~40 nodes with per-character rendering)
 * - CSS text-shadow for all effects (GPU accelerated)
 * - All styles applied immediately (no flash-in)
 * - Animation starts via CSS (no JS delay)
 * - ~97% reduction in DOM nodes
 * - Glow styles in globals.css (no inline <style> tags or Math.random())
 *
 * VISUAL EFFECT:
 * - 3D perspective with rotateX
 * - Neon gold glow with white-hot core
 * - Metal backing plate (gray gradient)
 * - Glow Breathe animation (slow dramatic pulse)
 * - Alt glyphs for N, E, M via font-feature-settings "ss01"
 *
 * SEO/ACCESSIBILITY:
 * - Uses real letters in DOM (Google reads correctly)
 * - Copy/paste gives real letters
 * - Font's ss01 stylistic set renders alternate glyphs visually
 *
 * GLOW LAYER 4 (close gold glow):
 * - Responsive by default: hidden <1200px, visible ≥1200px
 * - Use disableCloseGlow={true} to always hide (for link pages, agent portal)
 */
export default function H1({
  children,
  className = '',
  style = {},
  id,
  noAnimation = false,
  disableCloseGlow = false,
}: HeadingProps) {
  // Extract plain text for SEO/accessibility
  const plainText = extractPlainText(children);

  // CSS class handles text-shadow (responsive layer-4 via .h1-glow, always-off via .h1-glow-no-close)
  const glowClass = disableCloseGlow ? 'h1-glow-no-close' : 'h1-glow';

  return (
    <h1
      id={id}
      className={`text-h1 text-display ${glowClass} ${className}`}
      style={{
        color: '#ffd700',
        transform: 'perspective(800px) rotateX(12deg)',
        fontFeatureSettings: '"ss01" 1',
        /* GPU-accelerated depth shadow */
        filter: 'drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1) drop-shadow(0 0 0.08em rgba(255, 215, 0, 0.25))',
        animation: noAnimation ? 'none' : 'h1GlowBreathe 4s ease-in-out infinite',
        ...style,
      }}
    >
      {plainText}
    </h1>
  );
}
