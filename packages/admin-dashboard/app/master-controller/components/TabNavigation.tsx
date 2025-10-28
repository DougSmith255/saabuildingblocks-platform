'use client';

import { Type, Palette, LayoutGrid, Package, Users } from 'lucide-react';
import { useControllerStore } from '../stores/controllerStore';

export type TabId = 'typography' | 'colors' | 'spacing' | 'components' | 'user-management';

const TABS = [
  { id: 'typography' as const, label: 'Typography', icon: Type },
  { id: 'colors' as const, label: 'Brand Colors', icon: Palette },
  { id: 'spacing' as const, label: 'Spacing & Layout', icon: LayoutGrid },
  { id: 'components' as const, label: 'Components', icon: Package },
  { id: 'user-management' as const, label: 'User Management', icon: Users },
];

export function TabNavigation() {
  const { activeTab, setActiveTab } = useControllerStore();

  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    if (e.key === 'ArrowRight') {
      const nextIndex = (currentIndex + 1) % TABS.length;
      const nextTab = TABS[nextIndex];
      if (nextTab) setActiveTab(nextTab.id);
    } else if (e.key === 'ArrowLeft') {
      const prevIndex = (currentIndex - 1 + TABS.length) % TABS.length;
      const prevTab = TABS[prevIndex];
      if (prevTab) setActiveTab(prevTab.id);
    }
  };

  return (
    <nav
      className="flex items-center gap-1 border-b border-[#404040] bg-[#191818]/95 overflow-x-auto"
      role="tablist"
      aria-label="Master Controller Tabs"
    >
      {TABS.map(({ id, label, icon: Icon }, index) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          role="tab"
          aria-selected={activeTab === id}
          aria-controls={`${id}-panel`}
          tabIndex={activeTab === id ? 0 : -1}
          className={`flex items-center gap-2 px-6 py-4 font-medium transition-all border-b-3 whitespace-nowrap ${
            activeTab === id
              ? 'border-[#ffd700] text-[#ffd700] bg-[#ffd700]/10'
              : 'border-transparent text-[#dcdbd5] hover:text-[#00ff88] hover:bg-[#404040]/50'
          }`}
        >
          <Icon className="w-5 h-5" />
          <span className="text-display hidden sm:inline">{label}</span>
        </button>
      ))}
    </nav>
  );
}
