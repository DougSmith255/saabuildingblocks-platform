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

  // Optimized text-shadow with drop-shadow for glow (GPU accelerated)
  // Matches Tagline component optimization
  const textShadow = `
    0 0 0.01em #fff,
    0 0 0.02em #fff,
    0 0 0.03em rgba(255,255,255,0.8)
  `;
  const filter = `
    drop-shadow(0 0 0.04em #bfbdb0)
    drop-shadow(0 0 0.08em rgba(191,189,176,0.6))
  `;

  // Desktop: Corner counter - "3700+ AGENTS" format (no parentheses, Taskor font, 1.75x size)
  if (isCounterDesktop) {
    return (
      <div
        className="agent-counter-wrapper absolute z-50 left-2 lg:left-auto lg:right-8"
        style={{ top: '130px' }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25em',
            fontSize: 'clamp(1.75rem, 2.625vw, 2.1875rem)',
          }}
        >
          {/* Counter numbers - no parentheses, 10px larger than base */}
          <span
            className="counter-numbers-mobile"
            style={{
              display: 'inline',
              color: '#bfbdb0',
              fontFamily: 'var(--font-synonym), monospace',
              fontWeight: 300,
              fontSize: 'calc(1em + 10px)',
              textShadow: 'none',
            }}
          >
            <span className="counter-digit">3</span>
            <span className="counter-digit">7</span>
            <span className="counter-digit">0</span>
            <span className="counter-digit">0</span>
            <span>+</span>
          </span>

          {/* "AGENTS" text - Taskor font with glow */}
          <span
            style={{
              textShadow,
              filter: filter.trim(),
              fontFamily: 'var(--font-taskor), sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            AGENTS
          </span>
        </span>
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

  // Optimized text-shadow with drop-shadow for glow (GPU accelerated)
  const textShadow = `
    0 0 0.01em #fff,
    0 0 0.02em #fff,
    0 0 0.03em rgba(255,255,255,0.8)
  `;
  const filter = `
    drop-shadow(0 0 0.04em #bfbdb0)
    drop-shadow(0 0 0.08em rgba(191,189,176,0.6))
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
        <span>+ </span>
      </span>

      {/* "Agents)" text - with glow, alt glyphs */}
      <span style={{ textShadow, filter: filter.trim() }}>{convertToAltGlyphs('Agents)')}</span>
    </span>
  );
}
