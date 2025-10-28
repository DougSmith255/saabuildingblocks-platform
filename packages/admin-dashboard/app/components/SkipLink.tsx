/**
 * Skip Link Component
 * WCAG 2.4.1 Level A Compliance
 *
 * Provides keyboard navigation users with a way to skip directly to main content,
 * bypassing navigation and other repeated page elements.
 *
 * Visual behavior:
 * - Hidden off-screen by default (not visible)
 * - Becomes visible when focused via keyboard (Tab key)
 * - Positioned at top-left when focused
 */

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="skip-link"
      aria-label="Skip to main content"
    >
      Skip to main content
    </a>
  );
}
