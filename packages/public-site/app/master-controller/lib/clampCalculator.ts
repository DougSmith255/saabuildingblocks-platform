import type { ClampConfig } from '../types';

/**
 * Generates a CSS clamp() value for fluid typography/spacing
 * Formula: clamp(MIN, calc(INTERCEPT + SLOPE * 100vw), MAX)
 *
 * @param config - ClampConfig with min, max, viewportMin, viewportMax, unit
 * @returns CSS clamp() string
 *
 * @example
 * generateClamp({ min: 32, max: 64, viewportMin: 300, viewportMax: 2050, unit: 'px' })
 * // Returns: "clamp(32px, calc(14.17px + 5.83vw), 64px)"
 */
export function generateClamp(config: ClampConfig): string {
  const { min, max, viewportMin, viewportMax, unit } = config;

  // Calculate slope and intercept for linear interpolation
  const slope = (max - min) / (viewportMax - viewportMin);
  const intercept = min - slope * viewportMin;

  // Build fluid value: intercept + slope * 100vw
  const interceptStr = intercept.toFixed(2);
  const slopePercentage = (slope * 100).toFixed(2);
  const fluidValue = `calc(${interceptStr}${unit} + ${slopePercentage}vw)`;

  // Return clamp with proper formatting
  return `clamp(${min}${unit}, ${fluidValue}, ${max}${unit})`;
}

/**
 * Default clamp configurations for typography
 */
export const DEFAULT_TYPOGRAPHY_CLAMPS: Record<string, ClampConfig> = {
  h1: { min: 32, max: 64, viewportMin: 300, viewportMax: 2050, unit: 'px' },
  h2: { min: 28, max: 48, viewportMin: 300, viewportMax: 2050, unit: 'px' },
  h3: { min: 24, max: 36, viewportMin: 300, viewportMax: 2050, unit: 'px' },
  h4: { min: 20, max: 28, viewportMin: 300, viewportMax: 2050, unit: 'px' },
  h5: { min: 18, max: 24, viewportMin: 300, viewportMax: 2050, unit: 'px' },
  h6: { min: 16, max: 20, viewportMin: 300, viewportMax: 2050, unit: 'px' },
  body: { min: 14, max: 18, viewportMin: 300, viewportMax: 2050, unit: 'px' },
  quote: { min: 16, max: 22, viewportMin: 300, viewportMax: 2050, unit: 'px' },
  link: { min: 14, max: 18, viewportMin: 300, viewportMax: 2050, unit: 'px' },
  button: { min: 14, max: 18, viewportMin: 300, viewportMax: 2050, unit: 'px' },
};

/**
 * Default clamp configurations for spacing
 */
export const DEFAULT_SPACING_CLAMPS: Record<string, ClampConfig> = {
  containerPadding: { min: 16, max: 80, viewportMin: 300, viewportMax: 2050, unit: 'px' },
  gridGap: { min: 16, max: 32, viewportMin: 300, viewportMax: 2050, unit: 'px' },
  sectionMargin: { min: 32, max: 120, viewportMin: 300, viewportMax: 2050, unit: 'px' },
};
