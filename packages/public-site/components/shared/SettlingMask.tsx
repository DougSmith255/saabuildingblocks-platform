/**
 * SettlingMask Component
 *
 * A page-level overlay that hides the "settling" phase during initial page load.
 * This prevents users from seeing:
 * - Font swapping (FOUT) - especially the synonym font in menu items
 * - Layout shifts as components hydrate
 * - Any visual jarring during the first ~500ms
 *
 * How it works:
 * 1. Renders as a full-page overlay matching site background
 * 2. CSS animation-delay allows fonts/layout to settle (~400ms)
 * 3. Fades out quickly (300ms)
 * 4. Uses visibility: hidden after fade so it doesn't block anything
 *
 * Performance considerations:
 * - Overlay sits OVER content (doesn't hide DOM) - FCP not affected
 * - Uses CSS animations only (no JS hydration dependency)
 * - All styles inline to guarantee they apply immediately
 * - Animation is short to minimize perceived delay
 */
export function SettlingMask() {
  return (
    <>
      {/* Inline keyframes - must be in document for animation to work */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes settlingFade {
          0% { opacity: 1; }
          100% { opacity: 0; visibility: hidden; }
        }
      `}} />
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 99999, // Above everything including mobile menu (10010)
          pointerEvents: 'none', // Never block interaction
          // Match site background for seamless effect
          background: 'radial-gradient(at center bottom, rgb(40, 40, 40) 0%, rgb(12, 12, 12) 100%)',
          backgroundColor: 'rgb(12, 12, 12)',
          // Animation: 400ms delay (fonts settle) + 300ms fade out
          animation: 'settlingFade 300ms ease-out 400ms forwards',
          willChange: 'opacity',
        }}
      />
    </>
  );
}

export default SettlingMask;
