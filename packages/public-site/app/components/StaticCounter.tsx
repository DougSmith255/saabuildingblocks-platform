import './StaticCounter.css';

/**
 * Static Counter - Server Component (No Hydration Needed)
 *
 * PERFORMANCE OPTIMIZATION:
 * - Renders as pure HTML on server (no 'use client')
 * - Counter shows "3700" immediately in HTML
 * - CSS animation triggers automatically (no JS needed)
 * - No React hydration delay (eliminates 1,750ms LCP delay)
 *
 * The animation uses CSS only (see StaticCounter.css):
 * - @keyframes for fade-in
 * - Optional number cycling for visual interest
 * - Will-change for GPU acceleration
 */
export function StaticCounter() {
  return (
    /* Agent Counter - Top Right on desktop (lg+), Top Left on mobile */
    <div
      className="agent-counter-wrapper absolute z-50 left-2 lg:left-auto lg:right-8"
      style={{
        top: '80px',
      }}
    >
      {/* Outer wrapper - no font-family set here */}
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
            {/* Removed fontVariantNumeric - using fixed-width containers instead for performance */}
            <span className="counter-digit">3</span>
            <span className="counter-digit">7</span>
            <span className="counter-digit">0</span>
            <span className="counter-digit">0</span>
          </div>
        </div>

        {/* Glow effects container - Amulya font with neon glow */}
        <div className="counter-glow-container">
          {/* + Symbol with neon glow */}
          <span className="counter-plus neon-glow">+</span>

          {/* AGENTS Text - Static HTML with neon glow */}
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
