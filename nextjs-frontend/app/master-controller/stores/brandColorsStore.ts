import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BrandColorsSettings, ColorName } from '../types';

interface BrandColorsStore {
  settings: BrandColorsSettings;
  updateColor: (colorName: ColorName, value: string) => void;
  batchUpdate: (settings: Partial<BrandColorsSettings>) => void;
  resetToDefaults: () => void;
}

const defaultSettings: BrandColorsSettings = {
  accentGreen: '#00ff88',     // Bright green for links/accents
  headingText: '#ffd700',     // Gold for headings (matches brandGold)
  bodyText: '#dcdbd5',        // Slightly darker off-white for body
  brandGold: '#ffd700',       // Gold brand color for hover/CTAs
  darkGray: '#191818',        // Dark gray for containers/button text
  mediumGray: '#404040',      // Medium gray for menus/backgrounds
};

export const useBrandColorsStore = create<BrandColorsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,

      updateColor: (colorName, value) =>
        set((state) => ({
          settings: {
            ...state.settings,
            [colorName]: value,
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
      name: 'master-controller-brand-colors',
      onRehydrateStorage: () => (state) => {
        console.log('[Brand Colors Store] Hydrated from localStorage:', state?.settings);
      },
    }
  )
);
