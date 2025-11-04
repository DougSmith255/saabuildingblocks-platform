import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type TabName = 'typography' | 'colors' | 'spacing' | 'components' | 'templates' | 'user-management';

interface ControllerStore {
  activeTab: TabName;
  showPreview: boolean;
  setActiveTab: (tab: TabName) => void;
  togglePreview: () => void;
}

export const useControllerStore = create<ControllerStore>()(
  persist(
    (set) => ({
      activeTab: 'typography',
      showPreview: false,

      setActiveTab: (tab) => set({ activeTab: tab }),

      togglePreview: () => set((state) => ({ showPreview: !state.showPreview })),
    }),
    {
      name: 'master-controller-ui',
      onRehydrateStorage: () => (state) => {
        console.log('[Controller Store] Hydrated from localStorage:', {
          activeTab: state?.activeTab,
          showPreview: state?.showPreview,
        });
      },
    }
  )
);
