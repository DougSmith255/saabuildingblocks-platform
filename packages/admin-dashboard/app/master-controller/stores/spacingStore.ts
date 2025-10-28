import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SpacingSettings, ClampConfig } from '../types';
import { DEFAULT_SPACING_CLAMPS } from '../lib/clampCalculator';

interface SpacingStore {
  settings: SpacingSettings;
  updateSpacing: (updates: Partial<SpacingSettings>) => void;
  batchUpdate: (settings: Partial<SpacingSettings>) => void;
  resetToDefaults: () => void;
}

const defaultSettings: SpacingSettings = {
  containerPadding: DEFAULT_SPACING_CLAMPS['containerPadding'] as ClampConfig,
  gridGap: DEFAULT_SPACING_CLAMPS['gridGap'] as ClampConfig,
  sectionMargin: DEFAULT_SPACING_CLAMPS['sectionMargin'] as ClampConfig,
  gridMinWidth: 300,
};

export const useSpacingStore = create<SpacingStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,

      updateSpacing: (updates) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...updates,
          },
        })),

      batchUpdate: (settings) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...settings,
          },
        })),

      resetToDefaults: () => set({ settings: defaultSettings }),
    }),
    {
      name: 'master-controller-spacing',
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        console.log('[Spacing Store] Hydrated from localStorage:', state.settings);

        // Validate spacing settings structure
        let needsReset = false;
        const requiredProps = ['containerPadding', 'gridGap', 'sectionMargin'] as const;

        for (const prop of requiredProps) {
          const clampConfig = state.settings[prop];
          if (!clampConfig || typeof clampConfig !== 'object' || !clampConfig.min || !clampConfig.max) {
            console.warn(`[Spacing Store] Invalid data detected for ${prop}, will reset to defaults`);
            needsReset = true;
            break;
          }
        }

        // Reset to defaults if corrupted data detected
        if (needsReset) {
          console.warn('[Spacing Store] Corrupted localStorage detected, resetting to defaults');
          state.settings = defaultSettings;
        }
      },
    }
  )
);
