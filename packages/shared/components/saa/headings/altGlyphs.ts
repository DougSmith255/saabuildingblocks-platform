/**
 * Selectively apply Taskor alternate glyphs for A, E, T, F only.
 *
 * The font has alternates under the `aalt` OpenType feature for many
 * characters (M, A, E, N, T, F, H, K, R, V, W, Y), but we only want
 * alternates on M, A, E, N, T, F. Since CSS font-feature-settings applies to
 * ALL characters, we wrap only the desired chars in spans with "aalt" 1.
 */

import React from 'react';

const ALT_CHARS = new Set(['M', 'A', 'E', 'N', 'T', 'F']);
const AALT_STYLE = { fontFeatureSettings: '"aalt" 1' };

export function altGlyphs(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let i = 0;

  while (i < text.length) {
    if (ALT_CHARS.has(text[i])) {
      let j = i;
      while (j < text.length && ALT_CHARS.has(text[j])) j++;
      parts.push(
        React.createElement('span', { key: parts.length, style: AALT_STYLE }, text.slice(i, j))
      );
      i = j;
    } else {
      let j = i;
      while (j < text.length && !ALT_CHARS.has(text[j])) j++;
      parts.push(text.slice(i, j));
      i = j;
    }
  }

  if (parts.length === 0) return text;
  if (parts.length === 1 && typeof parts[0] === 'string') return parts[0];
  return React.createElement(React.Fragment, null, ...parts);
}
