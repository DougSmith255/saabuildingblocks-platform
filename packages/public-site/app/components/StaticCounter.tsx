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
    /* Agent Counter - Top Right on desktop, Top Left on mobile */
    <div
      className="agent-counter-wrapper absolute z-50 left-2 xlg:left-auto xlg:right-8"
      style={{
        top: '80px',
      }}
    >
      <div
        className="counter-container flex items-center justify-center"
        style={{
          fontWeight: 100,
          color: 'var(--color-body-text)',
          gap: 'clamp(0.5rem, 0.75rem, 1rem)',
          padding: '0.75rem 1.5rem',
          borderRadius: '32px',
          minWidth: '280px',
        }}
      >
        {/* Counter Numbers - Static HTML with neon glow */}
        <div
          className="counter-numbers counter-animate counter-glow-wrapper"
          style={{ fontVariantNumeric: 'tabular-nums', display: 'inline-flex' }}
        >
          <span className="neon-glow">3</span>
          <span className="neon-glow">7</span>
          <span className="neon-glow">0</span>
          <span className="neon-glow">0</span>
        </div>

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
  );
}
