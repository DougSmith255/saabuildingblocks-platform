/**
 * HeroSettlingMask - CSS-only layout shift cover
 *
 * Covers the hero with a matching background that fades via CSS animation.
 * No JavaScript required - the CSS animation starts as soon as the stylesheet loads,
 * which means LCP is no longer blocked by React hydration.
 *
 * Timeline: opaque for 200ms (layout settle), fades over 300ms, gone by 500ms.
 */
export function HeroSettlingMask() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes hero-settle-fade {
          0%, 40% { opacity: 1; }
          100% { opacity: 0; }
        }
        .hero-settling-mask {
          position: fixed;
          inset: 0;
          z-index: 10000;
          background-color: #0a0a0a;
          pointer-events: none;
          animation: hero-settle-fade 500ms ease-out forwards;
        }
      `}} />
      <div className="hero-settling-mask" aria-hidden="true" />
    </>
  );
}
