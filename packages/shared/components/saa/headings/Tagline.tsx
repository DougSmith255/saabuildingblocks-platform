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

// Map specific characters to alternate glyphs (same as H2)
const ALT_GLYPHS: Record<string, string> = {
  'N': '\uf015',
  'E': '\uf011',
  'M': '\uf016'
};

/**
 * Tagline Component - Server Component (No JavaScript Required)
 *
 * PERFORMANCE OPTIMIZATIONS:
 * - Pure Server Component (no 'use client')
 * - CSS-only fade-in animation (no React hydration needed)
 * - Static neon glow (always on, no flicker)
 * - Static HTML rendered on server
 *
 * Features:
 * - Static neon glow (NO animation)
 * - 3D transform with rotateX and translateZ
 * - Per-character rendering with alt glyphs
 * - Body text color (#bfbdb0) for neon effect
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

  // Convert children to string and split into words
  const text = React.Children.toArray(children).join('');
  const words = text.split(' ');

  // Static neon text-shadow (always at full brightness) - using body text color
  // Using em units so glow scales with font size (matches H1/H2)
  const textShadow = `
    -0.02em -0.02em 0 rgba(255,255,255, 0.4),
    0.02em -0.02em 0 rgba(255,255,255, 0.4),
    -0.02em 0.02em 0 rgba(255,255,255, 0.4),
    0.02em 0.02em 0 rgba(255,255,255, 0.4),
    0 -0.03em 0.1em #bfbdb0,
    0 0 0.03em #bfbdb0,
    0 0 0.07em #bfbdb0,
    0 0 0.12em #9a9888,
    0 0.03em 0.05em #000
  `;

  return (
    <p
      className={`text-tagline ${className}`}
      style={{
        display: 'flex',
        gap: '0.5em',
        flexWrap: 'wrap',
        justifyContent: 'center',
        transformStyle: 'preserve-3d',
        transform: 'rotateX(15deg)',
        position: 'relative',
        ...style
      }}
    >
      {/* SEO-friendly hidden text for search engines and screen readers */}
      <span className="sr-only">{plainText}</span>

      {words.map((word, wordIndex) => (
        <span
          key={wordIndex}
          className="tagline-word"
          style={{
            display: 'inline-flex',
            position: 'relative'
          }}
        >
          {word.split('').map((char, charIndex) => {
            // Apply alt glyph if available
            const displayChar = ALT_GLYPHS[char.toUpperCase()] || char;

            return (
              <span
                key={charIndex}
                className="tagline-char neon-glow"
                style={{
                  display: 'inline-block',
                  color: '#bfbdb0',
                  textShadow,
                  transform: 'translateZ(20px)',
                  position: 'relative',
                }}
              >
                {displayChar}
              </span>
            );
          })}
        </span>
      ))}

      {/* Agent Counter Suffix - inline with tagline (mobile only via CSS) */}
      {showAgentCounter && (
        <span className="tagline-counter-suffix">
          {/* Opening parenthesis */}
          <span
            className="tagline-word"
            style={{ display: 'inline-flex', position: 'relative' }}
          >
            <span
              className="tagline-char neon-glow"
              style={{
                display: 'inline-block',
                color: '#bfbdb0',
                textShadow,
                transform: 'translateZ(20px)',
                position: 'relative',
              }}
            >
              (
            </span>
          </span>

          {/* Counter numbers + plus sign - plain Synonym font, no glow */}
          <span
            className="tagline-word counter-numbers-mobile"
            style={{ display: 'inline-flex', position: 'relative', marginLeft: '-0.3em' }}
          >
            {['3', '7', '0', '0'].map((digit, i) => (
              <span
                key={i}
                className="counter-digit"
                style={{
                  display: 'inline-block',
                  color: '#bfbdb0',
                  position: 'relative',
                  fontFamily: 'var(--font-synonym), monospace',
                  fontWeight: 300,
                  fontSize: 'calc(1em + 10px)',
                  minWidth: '0.6em',
                  textAlign: 'center',
                  transform: 'translateY(-0.1em)',
                }}
              >
                {digit}
              </span>
            ))}
            {/* Plus sign - no space, same styling as numbers */}
            <span
              style={{
                display: 'inline-block',
                color: '#bfbdb0',
                position: 'relative',
                fontFamily: 'var(--font-synonym), monospace',
                fontWeight: 300,
                fontSize: 'calc(1em + 10px)',
                transform: 'translateY(-0.1em)',
              }}
            >
              +
            </span>
          </span>

          {/* "Agents" text + closing parenthesis */}
          <span
            className="tagline-word"
            style={{ display: 'inline-flex', position: 'relative' }}
          >
            {'Agents)'.split('').map((char, charIndex) => {
              const displayChar = ALT_GLYPHS[char.toUpperCase()] || char;
              return (
                <span
                  key={`agents-${charIndex}`}
                  className="tagline-char neon-glow"
                  style={{
                    display: 'inline-block',
                    color: '#bfbdb0',
                    textShadow,
                    transform: 'translateZ(20px)',
                    position: 'relative',
                  }}
                >
                  {displayChar}
                </span>
              );
            })}
          </span>
        </span>
      )}
    </p>
  );
}
