/**
 * Global Constants for Master Controller
 *
 * Single source of truth for viewport ranges and other global configuration values.
 * This ensures consistency across all typography, spacing, and clamp calculations.
 */

/**
 * Standard viewport range for fluid typography and spacing
 *
 * These values define the min/max viewport widths for all clamp() calculations:
 * - 250px: Smallest mobile devices
 * - 3000px: Ultra-wide desktop displays (4K, 5K+)
 *
 * All fluid sizing scales linearly between these viewport bounds for a cohesive,
 * responsive design across all screen sizes.
 */
export const VIEWPORT_RANGE = {
  /** Minimum viewport width (smallest mobile) */
  min: 250,
  /** Maximum viewport width (ultra-wide desktop) */
  max: 3000,
} as const;

/**
 * Helper to create a ClampConfig with standard viewport range
 *
 * @param min - Minimum size value
 * @param max - Maximum size value
 * @param unit - CSS unit ('px', 'rem', 'em')
 * @returns ClampConfig object with standard viewport range
 *
 * @example
 * const buttonSize = createClampConfig(14, 20, 'px');
 * // Returns: { min: 14, max: 20, viewportMin: 250, viewportMax: 3000, unit: 'px' }
 */
export function createClampConfig(
  min: number,
  max: number,
  unit: 'px' | 'rem' | 'em' = 'px'
) {
  return {
    min,
    max,
    viewportMin: VIEWPORT_RANGE.min,
    viewportMax: VIEWPORT_RANGE.max,
    unit,
  };
}
