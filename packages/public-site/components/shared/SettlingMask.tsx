/**
 * SettlingMask Component
 *
 * A page-level overlay that hides the "settling" phase during initial page load.
 * This prevents users from seeing:
 * - Font swapping (FOUT) - especially the synonym font in menu items
 * - Layout shifts as components hydrate
 * - Any visual jarring during the first ~300-500ms
 *
 * How it works:
 * 1. Renders as a full-page overlay with subtle blur + slight opacity
 * 2. CSS animation-delay allows fonts/layout to settle (~300ms)
 * 3. Fades out quickly (200ms)
 * 4. Uses pointer-events: none after fade so it doesn't block interaction
 *
 * Performance considerations:
 * - Overlay sits OVER content (doesn't hide DOM) - FCP not affected
 * - Uses CSS animations only (no JS hydration dependency)
 * - Will-change: opacity for GPU compositing
 * - Animation is short to minimize perceived delay
 */
export function SettlingMask() {
  return (
    <div
      className="settling-mask"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999, // Above everything including mobile menu (10010)
        pointerEvents: 'none', // Never block interaction
        // Match site background for seamless effect
        background: 'radial-gradient(at center bottom, rgb(40, 40, 40) 0%, rgb(12, 12, 12) 100%)',
        backgroundColor: 'rgb(12, 12, 12)',
      }}
    />
  );
}

export default SettlingMask;
