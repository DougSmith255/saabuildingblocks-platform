// Spacing Presets for Master Controller

import type { SpacingSettings } from '../types';

export interface SpacingPreset {
  name: string;
  description: string;
  settings: Omit<SpacingSettings, 'gridMinWidth'>;
}

export const SPACING_PRESETS: Record<string, SpacingPreset> = {
  cozy: {
    name: 'Cozy',
    description: 'Smaller spacing, tighter layouts',
    settings: {
      containerPadding: {
        min: 12,
        max: 40,
        viewportMin: 300,
        viewportMax: 2050,
        unit: 'px',
      },
      gridGap: {
        min: 8,
        max: 24,
        viewportMin: 300,
        viewportMax: 2050,
        unit: 'px',
      },
      sectionMargin: {
        min: 24,
        max: 64,
        viewportMin: 300,
        viewportMax: 2050,
        unit: 'px',
      },
    },
  },
  comfortable: {
    name: 'Comfortable',
    description: 'Default spacing, balanced layouts',
    settings: {
      containerPadding: {
        min: 16,
        max: 80,
        viewportMin: 300,
        viewportMax: 2050,
        unit: 'px',
      },
      gridGap: {
        min: 16,
        max: 48,
        viewportMin: 300,
        viewportMax: 2050,
        unit: 'px',
      },
      sectionMargin: {
        min: 32,
        max: 120,
        viewportMin: 300,
        viewportMax: 2050,
        unit: 'px',
      },
    },
  },
  spacious: {
    name: 'Spacious',
    description: 'Larger spacing, more breathing room',
    settings: {
      containerPadding: {
        min: 24,
        max: 120,
        viewportMin: 300,
        viewportMax: 2050,
        unit: 'px',
      },
      gridGap: {
        min: 24,
        max: 64,
        viewportMin: 300,
        viewportMax: 2050,
        unit: 'px',
      },
      sectionMargin: {
        min: 48,
        max: 160,
        viewportMin: 300,
        viewportMax: 2050,
        unit: 'px',
      },
    },
  },
};
