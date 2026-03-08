'use client';

import { useViewport } from '@/contexts/ViewportContext';
import './StaticCounter.css';

/**
 * AgentCounter - Client Component with Viewport-Aware Rendering
 *
 * Pure CSS heading styling - no JS SVG layers.
 *
 * Breakpoint: 780px
 * - Desktop (>=780px): Corner counter with 3D extrusion
 * - Mobile (<780px): Centered below tagline (MobileAgentCounter)
 */
export function AgentCounter() {
  const { isCounterDesktop } = useViewport();

  // Desktop: Corner counter - "4000+ AGENTS" format
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
          {/* Counter numbers */}
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

          {/* "AGENTS" text - pure CSS 3D extrusion */}
          <span
            style={{
              color: '#e5e4dd',
              fontFamily: 'var(--font-taskor), sans-serif',
              fontFeatureSettings: '"ss02" 1',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transform: 'perspective(800px) rotateX(8deg)',
              display: 'inline-block',
              position: 'relative',
              fontWeight: 700,
              textShadow: [
                '0.005em 0.007em 0 #dddcd5',
                '0.010em 0.015em 0 #d5d4cb',
                '0.015em 0.025em 0 #cccbc2',
                '0.019em 0.035em 0 #c2c1b8',
                '0.023em 0.045em 0 #b8b7ae',
                '0.027em 0.055em 0 #abaa9f',
                '0.031em 0.065em 0 #a09f94',
                '0.034em 0.073em 0 #96958a',
                '0.037em 0.080em 0 #8d8c80',
                '0.040em 0.088em 0 #7a7970',
              ].join(', '),
            }}
          >AGENTS</span>
        </span>
      </div>
    );
  }

  // Mobile: Return null - MobileAgentCounter handles < 780px
  return null;
}

/**
 * MobileAgentCounter - Centered counter below tagline for mobile (< 780px)
 *
 * Uses CSS media query (.tagline-counter-suffix) for visibility.
 * Font size is 8px smaller than the desktop corner counter.
 */
export function MobileAgentCounter() {
  const { hasMounted, isCounterDesktop } = useViewport();
  const isVisible = hasMounted && !isCounterDesktop;

  return (
    <div
      className="tagline-counter-suffix"
      style={{
        justifyContent: 'center',
        width: '100%',
        marginTop: '20px',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.2s ease-in',
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25em',
          fontSize: 'clamp(1.25rem, 2vw, 1.6875rem)',
        }}
      >
        {/* Counter numbers */}
        <span
          className="counter-numbers-mobile"
          style={{
            display: 'inline',
            color: '#e5e4dd',
            fontFamily: 'var(--font-synonym), monospace',
            fontWeight: 300,
            fontSize: 'calc(1em + 2px)',
            textShadow: 'none',
          }}
        >
          <span className="counter-digit">4</span>
          <span className="counter-digit">0</span>
          <span className="counter-digit">0</span>
          <span className="counter-digit">0</span>
          <span>+</span>
        </span>

        {/* "AGENTS" text - pure CSS 3D extrusion */}
        <span
          style={{
            color: '#e5e4dd',
            fontFamily: 'var(--font-taskor), sans-serif',
            fontFeatureSettings: '"ss02" 1',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            transform: 'perspective(800px) rotateX(8deg)',
            display: 'inline-block',
            position: 'relative',
            fontWeight: 700,
            textShadow: [
              '0.005em 0.007em 0 #dddcd5',
              '0.010em 0.015em 0 #d5d4cb',
              '0.015em 0.025em 0 #cccbc2',
              '0.019em 0.035em 0 #c2c1b8',
              '0.023em 0.045em 0 #b8b7ae',
              '0.027em 0.055em 0 #abaa9f',
              '0.031em 0.065em 0 #a09f94',
              '0.034em 0.073em 0 #96958a',
              '0.037em 0.080em 0 #8d8c80',
              '0.040em 0.088em 0 #7a7970',
            ].join(', '),
          }}
        >AGENTS</span>
      </span>
    </div>
  );
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
 * - Font's ss02 stylistic set renders alternate glyphs visually
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
        <span className="counter-digit">4</span>
        <span className="counter-digit">0</span>
        <span className="counter-digit">0</span>
        <span className="counter-digit">0</span>
        <span>+ </span>
      </span>

      {/* "Agents)" text - inherits styling from parent Tagline component */}
      <span
        style={{
          color: '#e5e4dd',
          fontFamily: 'var(--font-taskor), sans-serif',
          fontFeatureSettings: '"ss02" 1',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        AGENTS)
      </span>
    </span>
  );
}
