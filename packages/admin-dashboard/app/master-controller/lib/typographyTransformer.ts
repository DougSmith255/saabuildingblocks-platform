import type { TypographySettings } from '../types';

/**
 * Transform database format to Zustand store format
 *
 * Database format (from old implementation):
 * {
 *   "button": {
 *     "color": "#FFD700",
 *     "size_min": 18,
 *     "size_max": 20,
 *     "font_family": "Taskor"
 *   }
 * }
 *
 * Zustand format (current):
 * {
 *   "button": {
 *     "size": { "min": 18, "max": 20, "viewportMin": 300, "viewportMax": 2050, "unit": "px" },
 *     "fontFamily": "var(--font-taskor)",
 *     "color": "bodyText"
 *   }
 * }
 */

interface DatabaseTypography {
  [key: string]: {
    color?: string;
    weight?: string | number;
    size_max?: number;
    size_min?: number;
    font_family?: string;
  };
}

/**
 * Convert color hex to color key name
 *
 * Maps hex color values to valid BrandColorsSettings keys.
 * Normalizes hex codes to uppercase for case-insensitive matching.
 *
 * CRITICAL: Must use 'brandGold' NOT 'accentGold' (which doesn't exist in BrandColorsSettings)
 */
function colorHexToKey(hex: string): string {
  // Normalize hex to uppercase for consistent lookup
  const normalizedHex = hex.toUpperCase();

  const colorMap: Record<string, string> = {
    '#FFD700': 'brandGold',    // Gold brand color (NOT 'accentGold')
    '#00FF88': 'accentGreen',  // Bright green for links
    '#E5E4DD': 'headingText',  // Light off-white for headings
    '#DCDBD5': 'bodyText',     // Darker off-white for body
    '#BFBDB0': 'bodyText',     // Alternative body color
    '#191818': 'darkGray',     // Dark gray for containers
    '#404040': 'mediumGray',   // Medium gray for menus
  };

  const result = colorMap[normalizedHex];

  // Add warning for unmapped colors to aid debugging
  if (!result) {
    console.warn(`[typographyTransformer] Unmapped color hex '${hex}', falling back to 'bodyText'`);
  }

  return result || 'bodyText';
}

/**
 * Convert font family string to CSS variable format
 */
function fontFamilyToVar(fontFamily: string): string {
  if (fontFamily.includes('var(--')) {
    return fontFamily; // Already in var format
  }

  const lowerFamily = fontFamily.toLowerCase();
  if (lowerFamily.includes('taskor')) {
    return 'var(--font-taskor)';
  } else if (lowerFamily.includes('amulya')) {
    return 'var(--font-amulya)';
  } else if (lowerFamily.includes('synonym')) {
    return 'var(--font-synonym)';
  }

  return 'var(--font-synonym)'; // Default fallback
}

/**
 * Transform database typography format to Zustand store format
 */
export function transformDatabaseToStore(dbTypography: DatabaseTypography): Partial<TypographySettings> {
  const transformed: Partial<TypographySettings> = {};

  for (const [textType, settings] of Object.entries(dbTypography)) {
    if (!settings) continue;

    transformed[textType as keyof TypographySettings] = {
      size: {
        min: settings.size_min ?? 16,
        max: settings.size_max ?? 28,
        viewportMin: 300,
        viewportMax: 2050,
        unit: 'px',
      },
      lineHeight: 1.5, // Default, will be overridden by store defaults
      letterSpacing: 0, // Default, will be overridden by store defaults
      fontWeight: typeof settings.weight === 'string' ? parseInt(settings.weight) : (settings.weight ?? 400),
      fontFamily: settings.font_family ? fontFamilyToVar(settings.font_family) : 'var(--font-synonym)',
      color: settings.color ? colorHexToKey(settings.color) : 'bodyText',
    } as any;
  }

  return transformed;
}
