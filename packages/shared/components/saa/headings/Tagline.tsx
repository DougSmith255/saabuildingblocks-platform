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
  const textColor = '#e5e4dd';

  // 3D shaded text-shadow (matches H2 default style)
  const textShadow = `
    0.010em 0.013em 0 #dddcd5,
    0.015em 0.025em 0 #d1d0c7,
    0.019em 0.038em 0 #c2c1b8,
    0.024em 0.050em 0 #b3b2a8,
    0.029em 0.063em 0 #a09f94,
    0.033em 0.075em 0 #8d8c80,
    0.038em 0.088em 0 #7a7970,
    0.040em 0.095em 0 #282828,
    0.044em 0.110em 0 #333333,
    0.048em 0.125em 0 #3e3e3e,
    0.052em 0.140em 0 #4a4a4a,
    0.054em 0.150em 0.02em rgba(0, 0, 0, 0.5)
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
