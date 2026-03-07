/**
 * Replace M, A, E, N, T with their Taskor alternate glyphs (PUA codepoints).
 * The Taskor font has alternates under the `aalt` feature, but since CSS
 * font-feature-settings applies to ALL characters, we use direct PUA
 * codepoint replacement for selective control.
 */

const ALT_MAP: Record<string, string> = {
  M: '\uF016',
  A: '\uF00E',
  E: '\uF011',
  N: '\uF015',
  T: '\uF018',
};

export function altGlyphs(text: string): string {
  return text.replace(/[MAENT]/g, ch => ALT_MAP[ch] ?? ch);
}
