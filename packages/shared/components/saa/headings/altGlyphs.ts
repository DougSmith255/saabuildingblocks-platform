/**
 * Selectively apply Taskor alternate glyphs for M, A, E, N, T, F.
 *
 * The font has alternates under the `aalt` OpenType feature for many
 * characters, but we only want alternates on M, A, E, N, T, F.
 * N needs "aalt" 2 (second alternate), all others use "aalt" 1.
 */

import React from 'react';

const ALT1_CHARS = new Set(['M', 'A', 'E', 'T', 'F']);
const AALT1_STYLE = { fontFeatureSettings: '"aalt" 1' };
const AALT2_STYLE = { fontFeatureSettings: '"aalt" 2' };

export function altGlyphs(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let i = 0;

  while (i < text.length) {
    const ch = text[i];
    if (ALT1_CHARS.has(ch)) {
      let j = i;
      while (j < text.length && ALT1_CHARS.has(text[j])) j++;
      parts.push(
        React.createElement('span', { key: parts.length, style: AALT1_STYLE }, text.slice(i, j))
      );
      i = j;
    } else if (ch === 'N') {
      let j = i;
      while (j < text.length && text[j] === 'N') j++;
      parts.push(
        React.createElement('span', { key: parts.length, style: AALT2_STYLE }, text.slice(i, j))
      );
      i = j;
    } else {
      let j = i;
      while (j < text.length && !ALT1_CHARS.has(text[j]) && text[j] !== 'N') j++;
      parts.push(text.slice(i, j));
      i = j;
    }
  }

  if (parts.length === 0) return text;
  if (parts.length === 1 && typeof parts[0] === 'string') return parts[0];
  return React.createElement(React.Fragment, null, ...parts);
}
