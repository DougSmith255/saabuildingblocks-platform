/**
 * Color Presets for Brand Colors Tab
 * Pre-defined color schemes for quick application
 */

import type { BrandColorsSettings } from '../types';

export interface ColorPreset {
  id: string;
  name: string;
  description: string;
  colors: BrandColorsSettings;
}

export const COLOR_PRESETS: ColorPreset[] = [
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Cool blues and teals inspired by the sea',
    colors: {
      accentGreen: '#0ea5e9', // Sky blue accent
      brandGold: '#06b6d4', // Cyan brand
      headingText: '#0f172a', // Slate 900 headings
      bodyText: '#475569', // Slate 600 body
      darkGray: '#ffffff', // White dark
      mediumGray: '#f1f5f9', // Slate 100 medium
    },
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Natural greens and earth tones',
    colors: {
      accentGreen: '#10b981', // Emerald accent
      brandGold: '#14b8a6', // Teal brand
      headingText: '#1c1917', // Stone 900 headings
      bodyText: '#57534e', // Stone 600 body
      darkGray: '#ffffff', // White dark
      mediumGray: '#f5f5f4', // Stone 100 medium
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm oranges and purples',
    colors: {
      accentGreen: '#f97316', // Orange accent
      brandGold: '#a855f7', // Purple brand
      headingText: '#1c1917', // Stone 900 headings
      bodyText: '#78716c', // Stone 500 body
      darkGray: '#ffffff', // White dark
      mediumGray: '#fafaf9', // Stone 50 medium
    },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Dark theme with vibrant accents',
    colors: {
      accentGreen: '#3b82f6', // Blue accent
      brandGold: '#8b5cf6', // Violet brand
      headingText: '#f8fafc', // Slate 50 headings
      bodyText: '#cbd5e1', // Slate 300 body
      darkGray: '#0f172a', // Slate 900 dark
      mediumGray: '#1e293b', // Slate 800 medium
    },
  },
  {
    id: 'rose',
    name: 'Rose Garden',
    description: 'Soft pinks and warm neutrals',
    colors: {
      accentGreen: '#f43f5e', // Rose accent
      brandGold: '#ec4899', // Pink brand
      headingText: '#1f2937', // Gray 800 headings
      bodyText: '#6b7280', // Gray 500 body
      darkGray: '#ffffff', // White dark
      mediumGray: '#fef2f2', // Red 50 medium
    },
  },
  {
    id: 'corporate',
    name: 'Corporate Blue',
    description: 'Professional blues and grays',
    colors: {
      accentGreen: '#2563eb', // Blue 600 accent
      brandGold: '#7c3aed', // Violet 600 brand
      headingText: '#111827', // Gray 900 headings
      bodyText: '#6b7280', // Gray 500 body
      darkGray: '#ffffff', // White dark
      mediumGray: '#f9fafb', // Gray 50 medium
    },
  },
  {
    id: 'hyperdrive-sunset',
    name: 'Hyperdrive Sunset',
    description: 'Custom brand colors for Hyperdrive theme',
    colors: {
      accentGreen: '#00ff88',
      headingText: '#e5e4dd',
      bodyText: '#dcdbd5',
      brandGold: '#ffd700',
      darkGray: '#191818',
      mediumGray: '#404040',
    },
  },
];

/**
 * Get preset by ID
 */
export function getPresetById(id: string): ColorPreset | undefined {
  return COLOR_PRESETS.find((preset) => preset.id === id);
}

/**
 * Get all preset IDs
 */
export function getPresetIds(): string[] {
  return COLOR_PRESETS.map((preset) => preset.id);
}
