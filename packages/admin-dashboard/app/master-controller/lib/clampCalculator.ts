import type { ClampConfig } from '../types';

/**
 * Generates a CSS clamp() value for fluid typography/spacing
 * Formula: clamp(MIN, calc(INTERCEPT + SLOPE * 100vw), MAX)
 *
 * @param config - ClampConfig with min, max, viewportMin, viewportMax, unit
 * @returns CSS clamp() string
 *
 * @example
 * generateClamp({ min: 32, max: 64, viewportMin: 250, viewportMax: 3000, unit: 'px' })
 * // Returns: "clamp(32px, calc(29.09px + 1.16vw), 64px)"
 */
export function generateClamp(config: ClampConfig): string {
  // Defensive validation to prevent undefined property access
  if (!config || typeof config !== 'object' ||
      typeof config.min !== 'number' || typeof config.max !== 'number' ||
      typeof config.viewportMin !== 'number' || typeof config.viewportMax !== 'number') {
    console.error('[generateClamp] Invalid config:', config);
    return 'clamp(16px, calc(0px + 1vw), 32px)'; // Safe fallback
  }

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
  h1: { min: 50, max: 150, viewportMin: 250, viewportMax: 3000, unit: 'px' },
  h2: { min: 40, max: 96, viewportMin: 250, viewportMax: 3000, unit: 'px' },
  h3: { min: 32, max: 72, viewportMin: 250, viewportMax: 3000, unit: 'px' },
  h4: { min: 26, max: 56, viewportMin: 250, viewportMax: 3000, unit: 'px' },
  h5: { min: 22, max: 44, viewportMin: 250, viewportMax: 3000, unit: 'px' },
  h6: { min: 18, max: 32, viewportMin: 250, viewportMax: 3000, unit: 'px' },
  body: { min: 16, max: 28, viewportMin: 250, viewportMax: 3000, unit: 'px' },
  quote: { min: 18, max: 32, viewportMin: 250, viewportMax: 3000, unit: 'px' },
  link: { min: 16, max: 28, viewportMin: 250, viewportMax: 3000, unit: 'px' },
  button: { min: 16, max: 32, viewportMin: 250, viewportMax: 3000, unit: 'px' },
  caption: { min: 12, max: 16, viewportMin: 250, viewportMax: 3000, unit: 'px' },
  tagline: { min: 30, max: 60, viewportMin: 250, viewportMax: 3000, unit: 'px' },
  menuSubItem: { min: 18, max: 17, viewportMin: 250, viewportMax: 3000, unit: 'px' },
  menuMainItem: { min: 20, max: 25, viewportMin: 250, viewportMax: 3000, unit: 'px' },
};

/**
 * Default clamp configurations for spacing
 */
export const DEFAULT_SPACING_CLAMPS: Record<string, ClampConfig> = {
  containerPadding: { min: 16, max: 80, viewportMin: 250, viewportMax: 3000, unit: 'px' },
  gridGap: { min: 16, max: 32, viewportMin: 250, viewportMax: 3000, unit: 'px' },
  sectionMargin: { min: 32, max: 120, viewportMin: 250, viewportMax: 3000, unit: 'px' },
};
