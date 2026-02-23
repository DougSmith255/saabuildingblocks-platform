'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { Settings, Type, Palette, LayoutGrid, FileCode, Layers } from 'lucide-react';

const TypographyTab = dynamic(
  () => import('./TypographyTab').then(mod => ({ default: mod.TypographyTab })),
  { ssr: false, loading: () => <div className="p-6 text-[#dcdbd5]">Loading Typography...</div> }
);

const BrandColorsTab = dynamic(
  () => import('./BrandColorsTab').then(mod => ({ default: mod.BrandColorsTab })),
  { ssr: false, loading: () => <div className="p-6 text-[#dcdbd5]">Loading Colors...</div> }
);

const SpacingTab = dynamic(
  () => import('./SpacingTab').then(mod => ({ default: mod.SpacingTab })),
  { ssr: false, loading: () => <div className="p-6 text-[#dcdbd5]">Loading Spacing...</div> }
);

const TemplatesTab = dynamic(
  () => import('./TemplatesTab').then(mod => ({ default: mod.TemplatesTab })),
  { ssr: false, loading: () => <div className="p-6 text-[#dcdbd5]">Loading Templates...</div> }
);

const ComponentsTab = dynamic(
  () => import('./ComponentsTab').then(mod => ({ default: mod.ComponentsTab })),
  { ssr: false, loading: () => <div className="p-6 text-[#dcdbd5]">Loading Components...</div> }
);

type SubTabId = 'typography' | 'colors' | 'spacing' | 'templates' | 'components';

const validSubTabs: SubTabId[] = ['typography', 'colors', 'spacing', 'templates', 'components'];

export function WebSettingsTab() {
  const searchParams = useSearchParams();

  const [activeSubTab, setActiveSubTab] = useState<SubTabId>(() => {
    const sub = searchParams.get('sub');
    return (sub && validSubTabs.includes(sub as SubTabId)) ? sub as SubTabId : 'typography';
  });

  // Sync sub-tab from URL changes
  useEffect(() => {
    const sub = searchParams.get('sub');
    if (sub && validSubTabs.includes(sub as SubTabId)) {
      setActiveSubTab(sub as SubTabId);
    }
  }, [searchParams]);

  const subTabs = [
    { id: 'typography' as SubTabId, label: 'Typography', icon: Type, description: 'Font families, sizes, and line heights' },
    { id: 'colors' as SubTabId, label: 'Colors', icon: Palette, description: 'Brand and accent colors' },
    { id: 'spacing' as SubTabId, label: 'Spacing', icon: LayoutGrid, description: 'Padding, margins, and grid settings' },
    { id: 'templates' as SubTabId, label: 'Templates', icon: FileCode, description: 'Blog and page templates' },
    { id: 'components' as SubTabId, label: 'Components', icon: Layers, description: 'Component configuration' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#ffd700] flex items-center gap-2 mb-2">
            <Settings className="w-6 h-6" />
            Web Settings
          </h2>
          <p className="text-[#dcdbd5]">
            Typography, colors, spacing, templates, and component configuration
          </p>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex gap-2 border-b border-[#404040] pb-2">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all ${
                activeSubTab === tab.id
                  ? 'bg-[rgba(255,215,0,0.1)] border-b-2 border-[#ffd700] text-[#ffd700]'
                  : 'text-[#dcdbd5] hover:text-[#e5e4dd] hover:bg-[rgba(64,64,64,0.3)]'
              }`}
              title={tab.description}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Sub-tab Content */}
      <div className="min-h-[500px]">
        {activeSubTab === 'typography' && <TypographyTab />}
        {activeSubTab === 'colors' && <BrandColorsTab />}
        {activeSubTab === 'spacing' && <SpacingTab />}
        {activeSubTab === 'templates' && <TemplatesTab />}
        {activeSubTab === 'components' && <ComponentsTab />}
      </div>
    </div>
  );
}
