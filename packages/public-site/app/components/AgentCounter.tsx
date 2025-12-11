'use client';

import { useViewport } from '@/contexts/ViewportContext';
import './StaticCounter.css';

/**
 * Convert text to use alt glyphs for N, E, M characters (matches Tagline component)
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
 * AgentCounter - Client Component with Viewport-Aware Rendering
 *
 * PERFORMANCE OPTIMIZATION:
 * - Uses shared ViewportContext (no duplicate event listeners)
 * - Conditionally renders ONLY the appropriate counter (desktop OR mobile)
 * - Eliminates hidden DOM nodes - unused counter is never rendered
 * - Default to desktop counter on server (prevents flash for majority of users)
 *
 * Breakpoint: 500px
 * - Desktop (>=500px): Corner counter with glow effects
 * - Mobile (<500px): Inline tagline counter
 */
export function AgentCounter() {
  const { isCounterDesktop } = useViewport();

  // Desktop: Corner counter with neon glow (positioned absolutely)
  if (isCounterDesktop) {
    return (
      <div
        className="agent-counter-wrapper absolute z-50 left-2 lg:left-auto lg:right-8"
        style={{ top: '80px' }}
      >
        <div
          className="flex items-center justify-center"
          style={{
            fontWeight: 100,
            gap: 'clamp(0.5rem, 0.75rem, 1rem)',
            padding: '0.75rem 1.5rem',
            borderRadius: '32px',
            minWidth: '280px',
          }}
        >
          {/* Numbers container - body font only */}
          <div className="counter-numbers-wrapper">
            <div className="counter-numbers counter-animate">
              <span className="counter-digit">3</span>
              <span className="counter-digit">7</span>
              <span className="counter-digit">0</span>
              <span className="counter-digit">0</span>
            </div>
          </div>

          {/* Glow effects container - Amulya font with neon glow */}
          <div className="counter-glow-container">
            <span className="counter-plus neon-glow">+</span>
            <span className="counter-text counter-glow-wrapper">
              <span className="neon-glow">A</span>
              <span className="neon-glow">G</span>
              <span className="neon-glow">E</span>
              <span className="neon-glow">N</span>
              <span className="neon-glow">T</span>
              <span className="neon-glow">S</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Mobile: Return null - tagline counter will be shown via showAgentCounter prop
  // The tagline counter is rendered inline within the Tagline component
  return null;
}

/**
 * TaglineCounterSuffix - Renders the inline counter for mobile tagline
 *
 * This is used by the Tagline component when showAgentCounter is true
 * and viewport is mobile (<500px)
 */
export function TaglineCounterSuffix() {
  const { isCounterDesktop } = useViewport();

  // Only render on mobile
  if (isCounterDesktop) {
    return null;
  }

  // Neon glow text-shadow for "Agents)" text
  const textShadow = `
    0 0 0.01em #fff,
    0 0 0.02em #fff,
    0 0 0.03em rgba(255,255,255,0.8),
    0 0 0.04em #bfbdb0,
    0 0 0.07em #bfbdb0,
    0 0 0.11em rgba(191, 189, 176, 0.9),
    0 0 0.16em rgba(191, 189, 176, 0.7),
    0 0 0.22em rgba(154, 152, 136, 0.5),
    0 0.03em 0.05em rgba(0,0,0,0.4)
  `;

  return (
    <span
      className="tagline-counter-suffix"
      style={{ display: 'inline-flex', alignItems: 'baseline', gap: 0 }}
    >
      {/* Counter numbers with opening parenthesis */}
      <span
        className="counter-numbers-mobile"
        style={{
          display: 'inline',
          color: '#bfbdb0',
          fontFamily: 'var(--font-synonym), monospace',
          fontWeight: 300,
          fontSize: '1em',
          textShadow: 'none',
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
      <span style={{ textShadow }}>{convertToAltGlyphs(' Agents)')}</span>
    </span>
  );
}
