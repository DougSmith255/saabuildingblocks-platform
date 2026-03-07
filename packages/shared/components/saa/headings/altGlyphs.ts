/**
 * Taskor font alternate glyphs for M, A, E, N, T, F.
 *
 * The font has a custom ss01 stylistic set that substitutes these 6
 * characters with their alternate glyphs. Applied via CSS:
 * font-feature-settings: "ss01" 1
 *
 * This function is a no-op - alternates are handled entirely by the font
 * and CSS, so real letters stay in the DOM for SEO and copy/paste.
 */

export function altGlyphs(text: string): string {
  return text;
}
