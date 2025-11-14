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
        {/* Counter Numbers - Static "3700" in HTML, CSS animation optional */}
        <div
          className="counter-numbers counter-animate"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          3700
        </div>

        {/* + Symbol */}
        <span className="counter-plus">+</span>

        {/* AGENTS Text - Split into characters for neon glow effect */}
        <span className="counter-text" style={{ display: 'inline-flex' }}>
          {'AGENTS'.split('').map((char, i) => (
            <span key={i} className="neon-glow">
              {char}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}
