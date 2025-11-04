import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TypographySettings } from '../types';

interface TypographyStore {
  settings: TypographySettings;
  displayTextEnabled: boolean;
  displayTextFont: string;
  updateTextType: (textType: keyof TypographySettings, updates: Partial<TypographySettings[keyof TypographySettings]>) => void;
  batchUpdate: (settings: Partial<TypographySettings>) => void;
  resetToDefaults: () => void;
  toggleDisplayText: () => void;
  setDisplayTextFont: (font: string) => void;
}

// Default settings match SAA Default preset (Original Smart Agent Alliance defaults)
const defaultSettings: TypographySettings = {
  h1: {
    size: { min: 48, max: 120, viewportMin: 300, viewportMax: 2050, unit: 'px' },
    lineHeight: 1.2,
    letterSpacing: -0.02,
    fontWeight: 700,
    fontFamily: 'var(--font-amulya)',
    color: 'headingText',
  },
  h2: {
    size: { min: 40, max: 96, viewportMin: 300, viewportMax: 2050, unit: 'px' },
    lineHeight: 1.2,
    letterSpacing: -0.01,
    fontWeight: 700,
    fontFamily: 'var(--font-amulya)',
    color: 'headingText',
  },
  h3: {
    size: { min: 32, max: 72, viewportMin: 300, viewportMax: 2050, unit: 'px' },
    lineHeight: 1.3,
    letterSpacing: 0,
    fontWeight: 700,
    fontFamily: 'var(--font-amulya)',
    color: 'headingText',
  },
  h4: {
    size: { min: 26, max: 56, viewportMin: 300, viewportMax: 2050, unit: 'px' },
    lineHeight: 1.3,
    letterSpacing: 0,
    fontWeight: 700,
    fontFamily: 'var(--font-amulya)',
    color: 'headingText',
  },
  h5: {
    size: { min: 22, max: 44, viewportMin: 300, viewportMax: 2050, unit: 'px' },
    lineHeight: 1.4,
    letterSpacing: 0,
    fontWeight: 700,
    fontFamily: 'var(--font-amulya)',
    color: 'headingText',
  },
  h6: {
    size: { min: 18, max: 32, viewportMin: 300, viewportMax: 2050, unit: 'px' },
    lineHeight: 1.4,
    letterSpacing: 0,
    fontWeight: 700,
    fontFamily: 'var(--font-amulya)',
    color: 'headingText',
  },
  body: {
    size: { min: 16, max: 28, viewportMin: 300, viewportMax: 2050, unit: 'px' },
    lineHeight: 1.6,
    letterSpacing: 0,
    fontWeight: 400,
    fontFamily: 'var(--font-synonym)',
    color: 'bodyText',
  },
  quote: {
    size: { min: 18, max: 32, viewportMin: 300, viewportMax: 2050, unit: 'px' },
    lineHeight: 1.5,
    letterSpacing: 0,
    fontWeight: 400,
    fontFamily: 'var(--font-amulya)',
    fontStyle: 'italic',
    color: 'bodyText',
  },
  link: {
    size: { min: 16, max: 28, viewportMin: 300, viewportMax: 2050, unit: 'px' },
    lineHeight: 1.6,
    letterSpacing: 0,
    fontWeight: 400,
    fontFamily: 'var(--font-synonym)',
    color: 'accentGreen',
  },
  button: {
    size: { min: 14, max: 20, viewportMin: 300, viewportMax: 2050, unit: 'px' },
    lineHeight: 1,
    letterSpacing: 0.01,
    fontWeight: 600,
    fontFamily: 'var(--font-taskor)',
    color: 'bodyText',
  },
  tagline: {
    size: { min: 16, max: 21, viewportMin: 300, viewportMax: 2050, unit: 'px' },
    lineHeight: 1.5,
    letterSpacing: 0,
    fontWeight: 400,
    fontFamily: 'var(--font-amulya)',
    color: 'bodyText',
  },
  caption: {
    size: { min: 12, max: 16, viewportMin: 300, viewportMax: 2050, unit: 'px' },
    lineHeight: 1.4,
    letterSpacing: 0,
    fontWeight: 400,
    fontFamily: 'var(--font-amulya)',
    color: 'mediumGray',
  },
};

export const useTypographyStore = create<TypographyStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      displayTextEnabled: true,
      displayTextFont: 'Taskor',

      updateTextType: (textType, updates) =>
        set((state) => ({
          settings: {
            ...state.settings,
            [textType]: {
              ...state.settings[textType],
              ...updates,
            },
          },
        })),

      batchUpdate: (settings) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...settings,
          },
        })),

      resetToDefaults: () => set({ settings: defaultSettings, displayTextEnabled: true, displayTextFont: 'Taskor' }),

      toggleDisplayText: () =>
        set((state) => ({
          displayTextEnabled: !state.displayTextEnabled,
        })),

      setDisplayTextFont: (font) =>
        set({ displayTextFont: font }),
    }),
    {
      name: 'master-controller-typography',
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        console.log('[Typography Store] Hydrated from localStorage:', state.settings);
        console.log('[Typography Store] Display Text:', { enabled: state.displayTextEnabled, font: state.displayTextFont });

        // Validate typography settings structure
        let needsReset = false;
        const textTypes: Array<keyof TypographySettings> = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body', 'quote', 'link', 'button', 'tagline'];

        for (const textType of textTypes) {
          const settings = state.settings[textType];
          if (!settings || !settings.size || typeof settings.size !== 'object' ||
              typeof settings.size.min !== 'number' || typeof settings.size.max !== 'number') {
            console.warn(`[Typography Store] Invalid data detected for ${textType}, will reset to defaults`);
            needsReset = true;
            break;
          }
        }

        // Reset to defaults if corrupted data detected
        if (needsReset) {
          console.warn('[Typography Store] Corrupted localStorage detected, resetting to defaults');
          state.settings = defaultSettings;
          state.displayTextEnabled = true;
          state.displayTextFont = 'Taskor';
        }
      },
    }
  )
);
