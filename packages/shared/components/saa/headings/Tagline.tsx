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
  /** Optional counter suffix (e.g., "– 3,700+ Agents") - renders inline with same styling */
  showAgentCounter?: boolean;
}

/**
 * Convert text to use alt glyphs for N, E, M characters
 */
function convertToAltGlyphs(text: string): string {
  return text.split('').map(char => {
    const upper = char.toUpperCase();
    if (upper === 'N') return '\uf015';
    if (upper === 'E') return '\uf011';
    if (upper === 'M') return '\uf016';
    return char;
  }).join('');
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
 * - Alt glyphs for N, E, M characters
 * - Body text color (#bfbdb0)
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
  showAgentCounter = false,
}: TaglineProps) {
  // Extract plain text for SEO/accessibility
  const plainText = extractPlainText(children);

  // Convert children to string and apply alt glyphs
  const text = typeof children === 'string' ? children : String(children);
  const displayText = convertToAltGlyphs(text);

  // Neon glow text-shadow - using tagline color (#bfbdb0)
  // Adapted from H1 glow layers but with tagline's warm gray color
  const textShadow = `
    /* WHITE-HOT CORE */
    0 0 0.01em #fff,
    0 0 0.02em #fff,
    0 0 0.03em rgba(255,255,255,0.8),
    /* NEON GLOW - tagline color */
    0 0 0.04em #bfbdb0,
    0 0 0.07em #bfbdb0,
    0 0 0.11em rgba(191, 189, 176, 0.9),
    0 0 0.16em rgba(191, 189, 176, 0.7),
    0 0 0.22em rgba(154, 152, 136, 0.5),
    /* DEPTH SHADOW */
    0 0.03em 0.05em rgba(0,0,0,0.4)
  `;

  return (
    <p
      className={`text-tagline ${className}`}
      aria-label={plainText}
      style={{
        display: 'flex',
        gap: '0.5em',
        flexWrap: 'wrap',
        justifyContent: 'center',
        transform: 'rotateX(15deg)',
        position: 'relative',
        color: '#bfbdb0',
        textShadow,
        ...style
      }}
    >
      {/* SEO-friendly hidden text for search engines and screen readers */}
      <span className="sr-only">{plainText}</span>

      {/* Main tagline text - single node */}
      {displayText}

      {/* Agent Counter Suffix - inline with tagline (hidden above 500px via CSS) */}
      {showAgentCounter && (
        <span
          className="tagline-counter-suffix"
          style={{ display: 'inline-flex', alignItems: 'baseline', gap: 0 }}
        >
          {/* Counter numbers with opening parenthesis - plain Synonym font, no glow */}
          {/* Individual digit spans for scramble animation */}
          <span
            className="counter-numbers-mobile"
            style={{
              display: 'inline-block',
              color: '#bfbdb0',
              fontFamily: 'var(--font-synonym), monospace',
              fontWeight: 300,
              fontSize: 'calc(1em + 10px)',
              textShadow: 'none',
              transform: 'translateY(calc(-0.1em - 2px))',
            }}
          >
            <span>(</span>
            <span className="counter-digit">3</span>
            <span className="counter-digit">7</span>
            <span className="counter-digit">0</span>
            <span className="counter-digit">0</span>
            <span>+</span>
          </span>

          {/* "Agents)" text - with glow, alt glyphs */}
          <span>{convertToAltGlyphs(' Agents)')}</span>
        </span>
      )}
    </p>
  );
}
