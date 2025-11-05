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
    size: { min: 48, max: 120, viewportMin: 250, viewportMax: 3000, unit: 'px' },
    lineHeight: 1.2,
    letterSpacing: -0.02,
    fontWeight: 700,
    fontFamily: 'var(--font-amulya)',
    color: 'headingText',
  },
  h2: {
    size: { min: 40, max: 96, viewportMin: 250, viewportMax: 3000, unit: 'px' },
    lineHeight: 1.2,
    letterSpacing: -0.01,
    fontWeight: 700,
    fontFamily: 'var(--font-amulya)',
    color: 'headingText',
  },
  h3: {
    size: { min: 32, max: 72, viewportMin: 250, viewportMax: 3000, unit: 'px' },
    lineHeight: 1.3,
    letterSpacing: 0,
    fontWeight: 700,
    fontFamily: 'var(--font-amulya)',
    color: 'headingText',
  },
  h4: {
    size: { min: 26, max: 56, viewportMin: 250, viewportMax: 3000, unit: 'px' },
    lineHeight: 1.3,
    letterSpacing: 0,
    fontWeight: 700,
    fontFamily: 'var(--font-amulya)',
    color: 'headingText',
  },
  h5: {
    size: { min: 22, max: 44, viewportMin: 250, viewportMax: 3000, unit: 'px' },
    lineHeight: 1.4,
    letterSpacing: 0,
    fontWeight: 700,
    fontFamily: 'var(--font-amulya)',
    color: 'headingText',
  },
  h6: {
    size: { min: 18, max: 32, viewportMin: 250, viewportMax: 3000, unit: 'px' },
    lineHeight: 1.4,
    letterSpacing: 0,
    fontWeight: 700,
    fontFamily: 'var(--font-amulya)',
    color: 'headingText',
  },
  body: {
    size: { min: 16, max: 28, viewportMin: 250, viewportMax: 3000, unit: 'px' },
    lineHeight: 1.6,
    letterSpacing: 0,
    fontWeight: 400,
    fontFamily: 'var(--font-synonym)',
    color: 'bodyText',
  },
  quote: {
    size: { min: 18, max: 32, viewportMin: 250, viewportMax: 3000, unit: 'px' },
    lineHeight: 1.5,
    letterSpacing: 0,
    fontWeight: 400,
    fontFamily: 'var(--font-amulya)',
    fontStyle: 'italic',
    color: 'bodyText',
  },
  link: {
    size: { min: 16, max: 28, viewportMin: 250, viewportMax: 3000, unit: 'px' },
    lineHeight: 1.6,
    letterSpacing: 0,
    fontWeight: 400,
    fontFamily: 'var(--font-synonym)',
    color: 'accentGreen',
  },
  tagline: {
    size: { min: 16, max: 21, viewportMin: 250, viewportMax: 3000, unit: 'px' },
    lineHeight: 1.5,
    letterSpacing: 0,
    fontWeight: 400,
    fontFamily: 'var(--font-amulya)',
    color: 'bodyText',
  },
  caption: {
    size: { min: 12, max: 16, viewportMin: 250, viewportMax: 3000, unit: 'px' },
    lineHeight: 1.4,
    letterSpacing: 0,
    fontWeight: 400,
    fontFamily: 'var(--font-amulya)',
    color: 'mediumGray',
  },
  menuMainItem: {
    size: { min: 16, max: 20, viewportMin: 250, viewportMax: 3000, unit: 'px' },
    lineHeight: 1.4,
    letterSpacing: 0,
    fontWeight: 500,
    fontFamily: 'var(--font-synonym)',
    color: 'bodyText',
  },
  menuSubItem: {
    size: { min: 14, max: 18, viewportMin: 250, viewportMax: 3000, unit: 'px' },
    lineHeight: 1.4,
    letterSpacing: 0,
    fontWeight: 400,
    fontFamily: 'var(--font-synonym)',
    color: 'bodyText',
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
        set((state) => {
          // Deep merge each text type to preserve nested objects like 'size'
          const newSettings = { ...state.settings };
          Object.keys(settings).forEach((key) => {
            const textType = key as keyof TypographySettings;
            // Only process text types that exist in the current settings (ignore unknown types from DB)
            if (state.settings[textType]) {
              newSettings[textType] = {
                ...state.settings[textType],
                ...settings[textType],
                // Ensure size object is deeply merged
                size: settings[textType]?.size
                  ? { ...state.settings[textType].size, ...settings[textType].size }
                  : state.settings[textType].size,
              };
            } else {
              console.warn(`[Typography Store] Ignoring unknown text type from database: ${textType}`);
            }
          });
          return { settings: newSettings };
        }),

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
      version: 2, // Increment version to trigger migration
      migrate: (persistedState: any, version: number) => {
        // Migration from v0/v1 to v2: Remove deprecated 'button' text type
        if (version < 2) {
          console.warn('[Typography Store] Migrating to v2: Removing deprecated "button" text type');
          if (persistedState?.settings && 'button' in persistedState.settings) {
            const { button, ...cleanedSettings } = persistedState.settings;
            persistedState.settings = cleanedSettings;
          }
        }
        return persistedState;
      },
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        console.log('[Typography Store] Hydrated from localStorage:', state.settings);
        console.log('[Typography Store] Display Text:', { enabled: state.displayTextEnabled, font: state.displayTextFont });

        // Validate typography settings structure
        let needsReset = false;
        const textTypes: Array<keyof TypographySettings> = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body', 'quote', 'link', 'tagline', 'caption', 'menuMainItem', 'menuSubItem'];

        for (const textType of textTypes) {
          const settings = state.settings[textType];
          if (!settings || !settings.size || typeof settings.size !== 'object' ||
              typeof settings?.size?.min !== 'number' || typeof settings?.size?.max !== 'number') {
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
