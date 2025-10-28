/**
 * Typography Utilities
 * Helper functions for typography calculations and transformations
 *
 * @module lib/typography/utils
 */

/**
 * Calculate modular scale
 */
export function modularScale(base: number, ratio: number, step: number): number {
  return base * Math.pow(ratio, step);
}

/**
 * Generate fluid typography clamp()
 */
export function fluidType(
  minSize: number,
  maxSize: number,
  minViewport: number = 320,
  maxViewport: number = 1920
): string {
  const slope = (maxSize - minSize) / (maxViewport - minViewport);
  const intercept = minSize - slope * minViewport;

  return `clamp(${minSize}rem, ${intercept}rem + ${slope * 100}vw, ${maxSize}rem)`;
}

/**
 * Convert px to rem
 */
export function pxToRem(px: number, base: number = 16): number {
  return px / base;
}

/**
 * Convert rem to px
 */
export function remToPx(rem: number, base: number = 16): number {
  return rem * base;
}

/**
 * Calculate line height from font size
 */
export function calculateLineHeight(fontSize: number, target: 'tight' | 'normal' | 'relaxed'): number {
  const ratios = {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  };

  return fontSize * ratios[target];
}

/**
 * Check contrast ratio for accessibility
 */
export function getContrastRatio(foreground: string, background: string): number {
  // Simple contrast calculation (WCAG 2.1)
  const getLuminance = (color: string): number => {
    // This is a simplified version - real implementation would parse color values
    // For demonstration, return placeholder values
    return 0.5;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if text meets WCAG AA standards
 */
export function meetsWCAGAA(fontSize: number, contrastRatio: number): boolean {
  // Large text (18pt/24px or 14pt/18.66px bold) requires 3:1
  // Normal text requires 4.5:1
  const isLargeText = fontSize >= 24 || fontSize >= 18.66;
  const requiredRatio = isLargeText ? 3 : 4.5;

  return contrastRatio >= requiredRatio;
}

/**
 * Generate responsive typography CSS
 */
export function generateResponsiveCSS(
  property: string,
  minValue: number,
  maxValue: number,
  minViewport: number = 320,
  maxViewport: number = 1920,
  unit: string = 'px'
): string {
  const fluid = fluidType(
    pxToRem(minValue),
    pxToRem(maxValue),
    minViewport,
    maxViewport
  );

  return `${property}: ${fluid};`;
}

/**
 * Create typography scale
 */
export function createTypographyScale(
  baseSize: number,
  ratio: number,
  steps: number = 8
): Record<string, number> {
  const scale: Record<string, number> = {};

  for (let i = -steps; i <= steps; i++) {
    const size = modularScale(baseSize, ratio, i);
    scale[`step-${i >= 0 ? '+' : ''}${i}`] = Math.round(size * 100) / 100;
  }

  return scale;
}

/**
 * Get optimal line length
 */
export function getOptimalLineLength(fontSize: number): { min: number; max: number; ideal: number } {
  // Optimal: 50-75 characters per line
  // Comfortable: 45-85 characters
  const charWidth = fontSize * 0.5; // Approximate character width

  return {
    min: 45 * charWidth,
    ideal: 65 * charWidth,
    max: 85 * charWidth,
  };
}

/**
 * Validate font stack
 */
export function validateFontStack(fontStack: string): boolean {
  // Check if font stack has fallbacks
  const fonts = fontStack.split(',').map((f) => f.trim());

  if (fonts.length < 2) {
    console.warn('Font stack should include fallback fonts');
    return false;
  }

  // Check if it ends with a generic font family
  const genericFamilies = ['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui'];
  const lastFont = fonts[fonts.length - 1].toLowerCase();

  if (!genericFamilies.includes(lastFont)) {
    console.warn('Font stack should end with a generic font family');
    return false;
  }

  return true;
}

/**
 * Apply vertical rhythm
 */
export function verticalRhythm(
  baseLineHeight: number,
  multiplier: number = 1
): number {
  return baseLineHeight * multiplier;
}

/**
 * Calculate optimal letter spacing
 */
export function calculateLetterSpacing(fontSize: number): string {
  // Larger text needs tighter spacing
  if (fontSize >= 48) return '-0.02em';
  if (fontSize >= 36) return '-0.015em';
  if (fontSize >= 24) return '-0.01em';
  if (fontSize >= 18) return '-0.005em';
  if (fontSize >= 14) return '0';
  return '0.01em';
}
