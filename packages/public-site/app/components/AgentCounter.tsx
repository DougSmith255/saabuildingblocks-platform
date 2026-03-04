'use client';

import { useViewport } from '@/contexts/ViewportContext';
import './StaticCounter.css';

/**
 * AgentCounter - Client Component with Viewport-Aware Rendering
 *
 * PERFORMANCE OPTIMIZATION:
 * - Uses shared ViewportContext (no duplicate event listeners)
 * - Conditionally renders ONLY the appropriate counter (desktop OR mobile)
 * - Eliminates hidden DOM nodes - unused counter is never rendered
 * - Default to desktop counter on server (prevents flash for majority of users)
 *
 * SEO/ACCESSIBILITY:
 * - Uses real letters in DOM (Google reads correctly)
 * - Copy/paste gives real letters
 * - Font's ss01 stylistic set renders alternate glyphs visually
 *
 * Breakpoint: 500px
 * - Desktop (>=500px): Corner counter with glow effects
 * - Mobile (<500px): Inline tagline counter
 */
export function AgentCounter() {
  const { isCounterDesktop } = useViewport();

  // 3D shaded text-shadow (matches Tagline/H2 component)
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
  const filter = 'drop-shadow(0.04em 0.04em 0.06em rgba(0,0,0,0.6))';

  // Desktop: Corner counter - "4000+ AGENTS" format (no parentheses, Taskor font, 1.75x size)
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
              color: '#e5e4dd',
              fontFamily: 'var(--font-synonym), monospace',
              fontWeight: 300,
              fontSize: 'calc(1em + 10px)',
              textShadow: 'none',
            }}
          >
            <span className="counter-digit">4</span>
            <span className="counter-digit">0</span>
            <span className="counter-digit">0</span>
            <span className="counter-digit">0</span>
            <span>+</span>
          </span>

          {/* "AGENTS" text - Taskor font with shaded text effect */}
          <span
            style={{
              color: '#e5e4dd',
              fontFamily: 'var(--font-taskor), sans-serif',
              fontFeatureSettings: '"ss01" 1',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              textShadow: textShadow.trim(),
              filter,
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
 *
 * IMPORTANT: CSS media query in StaticCounter.css handles visibility.
 * - Desktop (>=500px): display:none via CSS - no space taken, no CLS
 * - Mobile (<500px): display:inline-flex via CSS
 * This ensures consistent rendering between SSR and hydration.
 *
 * SEO/ACCESSIBILITY:
 * - Uses real letters in DOM (Google reads correctly)
 * - Copy/paste gives real letters
 * - Font's ss01 stylistic set renders alternate glyphs visually
 */
export function TaglineCounterSuffix() {
  const { hasMounted, isCounterDesktop } = useViewport();

  // Opacity: visible on mobile after mount, hidden otherwise
  // CSS handles display:none on desktop, so opacity only matters on mobile
  const isVisible = hasMounted && !isCounterDesktop;

  return (
    <span
      className="tagline-counter-suffix"
      style={{
        // CSS media query handles display (none on desktop, inline-flex on mobile)
        // Don't set display here - let CSS control it to prevent CLS
        alignItems: 'baseline',
        gap: 0,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.2s ease-in',
      }}
    >
      {/* Counter numbers with opening parenthesis */}
      <span
        className="counter-numbers-mobile"
        style={{
          display: 'inline',
          color: '#e5e4dd',
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

      {/* "Agents)" text - inherits styling from parent Tagline component */}
      <span
        style={{
          color: '#e5e4dd',
          fontFamily: 'var(--font-taskor), sans-serif',
          fontFeatureSettings: '"ss01" 1',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        AGENTS)
      </span>
    </span>
  );
}
