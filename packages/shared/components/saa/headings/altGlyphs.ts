/**
 * Taskor font alternate glyphs for M, A, E, N, T.
 *
 * The font has alternates under the `aalt` OpenType feature.
 * We use font-feature-settings: "aalt" 1 to activate them.
 * This applies to all characters that have alternates in the font
 * (M, A, E, N, T, F, H, K, R, V, W, Y).
 */

/** No-op identity function - alt glyphs are now handled via CSS font-feature-settings */
export function altGlyphs(text: string): string {
  return text;
}
