'use client';

import React from 'react';

export interface NeonGoldTextProps {
  children: React.ReactNode;
  /** HTML element to render as */
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
  /** Additional CSS classes (use for sizing like text-h2, text-h4, etc.) */
  className?: string;
}

/**
 * NeonGoldText - Applies H1-style neon gold glow to any text
 *
 * MASTER CONTROLLER COMPONENT
 * Location: @saa/shared/components/saa/text/NeonGoldText
 *
 * Features:
 * - Gold color with neon glow effect (matches H1 styling)
 * - White outline for depth
 * - Works with any text size (pass className like text-h2, text-h4)
 * - No 3D rotation - just the glow effect
 *
 * Use inside CyberCardGold for premium headings:
 * ```tsx
 * <CyberCardGold>
 *   <NeonGoldText as="h2" className="text-h2">Premium Title</NeonGoldText>
 *   <p className="text-body">Regular body text</p>
 * </CyberCardGold>
 * ```
 */
export function NeonGoldText({
  children,
  as: Component = 'span',
  className = '',
}: NeonGoldTextProps) {
  return (
    <Component
      className={className}
      style={{
        color: '#ffd700',
        textShadow: `
          -1px -1px 0 rgba(255,255,255, 0.4),
          1px -1px 0 rgba(255,255,255, 0.4),
          -1px 1px 0 rgba(255,255,255, 0.4),
          1px 1px 0 rgba(255,255,255, 0.4),
          0 0 4px #ffd700,
          0 0 8px #ffd700,
          0 0 16px rgba(255,215,0,0.6),
          0 0 24px rgba(255,179,71,0.4)
        `,
      }}
    >
      {children}
    </Component>
  );
}

export default NeonGoldText;
