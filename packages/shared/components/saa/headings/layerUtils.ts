/**
 * Heading layer utilities - controls how many backing layers render
 * based on screen size for performance.
 *
 * Desktop: 4 layers (from 6-8), no SVG filter
 * Mobile: 0 layers (backing disabled entirely)
 */

const DESKTOP_LAYERS = 4;
const MOBILE_LAYERS = 0;

export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 768px)').matches;
}

/**
 * Evenly sample `count` layers from the full array, always including
 * first (brightest/farthest) and last (darkest/nearest).
 */
export function selectLayers<T>(layers: T[], count: number): T[] {
  if (layers.length <= count) return layers;
  if (count <= 1) return [layers[layers.length - 1]];
  const result: T[] = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.round(i * (layers.length - 1) / (count - 1));
    result.push(layers[idx]);
  }
  return result;
}

/**
 * Get the right number of layers for current screen size.
 */
export function getVisibleLayers<T>(layers: T[]): T[] {
  const count = isMobile() ? MOBILE_LAYERS : DESKTOP_LAYERS;
  return selectLayers(layers, count);
}
