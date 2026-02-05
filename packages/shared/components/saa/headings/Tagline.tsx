import React from 'react';

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
 * Tagline Component - 3D Text Effect (matches H2 style)
 *
 * Features:
 * - 3D text effect using layered text-shadows (same as H2)
 * - White core glow with warm white outer glow
 * - Metal backing shadow (offset grays for depth)
 * - Perspective transform with rotateX
 * - Uses H2 sizing from Master Controller
 *
 * SEO/ACCESSIBILITY:
 * - Uses real letters in DOM (Google reads correctly)
 * - Copy/paste gives real letters
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
  const textColor = '#bfbdb0';

  // 3D text-shadow effect (matches H2 style)
  const textShadow = `
    /* WHITE CORE */
    0 0 0.01em #fff,
    0 0 0.02em #fff,
    0 0 0.03em rgba(255,255,255,0.8),
    /* WARM WHITE GLOW */
    0 0 0.05em rgba(255,250,240,0.9),
    0 0 0.09em rgba(255, 255, 255, 0.6),
    0 0 0.13em rgba(255, 255, 255, 0.35),
    0 0 0.18em rgba(200, 200, 200, 0.2),
    /* METAL BACKING (3D depth - thicker) */
    0.02em 0.02em 0 #2a2a2a,
    0.04em 0.04em 0 #222222,
    0.06em 0.06em 0 #1a1a1a,
    0.08em 0.08em 0 #141414,
    0.10em 0.10em 0 #0f0f0f,
    0.12em 0.12em 0 #080808
  `;

  return (
    <p
      className={`text-tagline ${className}`}
      style={{
        textAlign: 'center',
        fontFeatureSettings: '"ss01" 1',
        color: textColor,
        textShadow,
        transform: 'perspective(800px) rotateX(8deg)',
        filter: 'drop-shadow(0.04em 0.04em 0.06em rgba(0,0,0,0.6))',
        ...style
      }}
    >
      {children} {counterSuffix}
    </p>
  );
}
