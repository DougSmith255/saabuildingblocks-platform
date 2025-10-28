/**
 * Color Utilities for Brand Colors Tab
 * Validation, conversion, and accessibility helpers
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export type ContrastRating = 'AAA' | 'AA' | 'Fail';

/**
 * Validates hex color format (#RGB or #RRGGBB)
 */
export function isValidHex(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Converts hex color to RGB object
 */
export function hexToRgb(hex: string): RGB | null {
  if (!isValidHex(hex)) return null;

  // Remove # and expand 3-digit hex to 6-digit
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split('')
      .map((char) => char + char)
      .join('');
  }

  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return { r, g, b };
}

/**
 * Converts RGB to hex color
 */
export function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) => {
    const hex = Math.round(n).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

/**
 * Calculates relative luminance for contrast calculations (WCAG formula)
 */
function getLuminance(rgb: RGB): number {
  const rsRGB = rgb.r / 255;
  const gsRGB = rgb.g / 255;
  const bsRGB = rgb.b / 255;

  const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculates WCAG contrast ratio between two colors (1:1 to 21:1)
 */
export function calculateContrast(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 0;

  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Gets WCAG contrast rating (AAA, AA, or Fail)
 */
export function getContrastRating(ratio: number): ContrastRating {
  if (ratio >= 7) return 'AAA'; // WCAG AAA (7:1)
  if (ratio >= 4.5) return 'AA'; // WCAG AA (4.5:1)
  return 'Fail';
}

/**
 * Generates complementary color (180° on color wheel)
 */
export function getComplementary(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  // Convert to HSL, rotate hue 180°, convert back
  const { h, s, l } = rgbToHsl(rgb);
  const newH = (h + 180) % 360;
  return hslToHex(newH, s, l);
}

/**
 * Generates triadic colors (120° apart on color wheel)
 */
export function getTriadic(hex: string): [string, string] {
  const rgb = hexToRgb(hex);
  if (!rgb) return [hex, hex];

  const { h, s, l } = rgbToHsl(rgb);
  return [hslToHex((h + 120) % 360, s, l), hslToHex((h + 240) % 360, s, l)];
}

/**
 * Generates analogous colors (30° apart on color wheel)
 */
export function getAnalogous(hex: string): [string, string] {
  const rgb = hexToRgb(hex);
  if (!rgb) return [hex, hex];

  const { h, s, l } = rgbToHsl(rgb);
  return [hslToHex((h + 30) % 360, s, l), hslToHex((h - 30 + 360) % 360, s, l)];
}

/**
 * Lightens a color by percentage (0-100)
 */
export function lightenColor(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const { h, s, l } = rgbToHsl(rgb);
  const newL = Math.min(100, l + amount);
  return hslToHex(h, s, newL);
}

/**
 * Darkens a color by percentage (0-100)
 */
export function darkenColor(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const { h, s, l } = rgbToHsl(rgb);
  const newL = Math.max(0, l - amount);
  return hslToHex(h, s, newL);
}

/**
 * Converts RGB to HSL
 */
function rgbToHsl(rgb: RGB): { h: number; s: number; l: number } {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Converts HSL to hex color
 */
function hslToHex(h: number, s: number, l: number): string {
  const sDecimal = s / 100;
  const lDecimal = l / 100;

  const c = (1 - Math.abs(2 * lDecimal - 1)) * sDecimal;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lDecimal - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  return rgbToHex({
    r: (r + m) * 255,
    g: (g + m) * 255,
    b: (b + m) * 255,
  });
}

/**
 * Generates color harmony suggestions based on base color
 */
export interface ColorHarmony {
  complementary: string;
  triadic: [string, string];
  analogous: [string, string];
  lighter: string;
  darker: string;
}

export function generateHarmony(baseColor: string): ColorHarmony {
  return {
    complementary: getComplementary(baseColor),
    triadic: getTriadic(baseColor),
    analogous: getAnalogous(baseColor),
    lighter: lightenColor(baseColor, 15),
    darker: darkenColor(baseColor, 15),
  };
}
