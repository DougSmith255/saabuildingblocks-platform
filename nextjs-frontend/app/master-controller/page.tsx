'use client';

/**
 * Master Controller Dashboard Page
 *
 * Central admin dashboard for controlling:
 * - Typography settings (fonts, sizes, line heights)
 * - Brand colors (accent, gold, text colors)
 * - Spacing system (padding, margins, grids)
 * - Component templates (blog, pages)
 *
 * All changes sync to localStorage and Supabase (if configured)
 */

import { useState } from 'react';
import { Palette, Type, LayoutGrid, FileCode, Settings, Layers } from 'lucide-react';

// Tab components
import { TemplatesTab } from './components/tabs/TemplatesTab';

// Store hooks
import { useBrandColorsStore } from './stores/brandColorsStore';
import { useTypographyStore } from './stores/typographyStore';
import { useSpacingStore } from './stores/spacingStore';

type TabId = 'typography' | 'colors' | 'spacing' | 'templates' | 'components';

export default function MasterControllerDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>('typography');

  // Store states
  const brandColors = useBrandColorsStore();
  const typography = useTypographyStore();
  const spacing = useSpacingStore();

  const tabs = [
    { id: 'typography' as TabId, label: 'Typography', icon: Type },
    { id: 'colors' as TabId, label: 'Colors', icon: Palette },
    { id: 'spacing' as TabId, label: 'Spacing', icon: LayoutGrid },
    { id: 'templates' as TabId, label: 'Templates', icon: FileCode },
    { id: 'components' as TabId, label: 'Components', icon: Layers },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-display text-3xl font-bold text-[#e5e4dd] mb-2 flex items-center gap-3">
          <Settings className="w-8 h-8 text-[#ffd700]" />
          Master Controller
        </h1>
        <p className="text-[#dcdbd5]">
          Control typography, colors, spacing, and templates across your entire site.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div
          className="p-4 rounded-lg border"
          style={{
            background: 'rgba(64, 64, 64, 0.5)',
            backdropFilter: 'blur(8px)',
            borderColor: 'rgba(255, 215, 0, 0.2)',
          }}
        >
          <div className="text-sm text-[#dcdbd5] mb-1">Typography Styles</div>
          <div className="text-2xl font-bold text-[#ffd700]">
            {typography?.typography ? Object.keys(typography.typography).length : 0}
          </div>
        </div>
        <div
          className="p-4 rounded-lg border"
          style={{
            background: 'rgba(64, 64, 64, 0.5)',
            backdropFilter: 'blur(8px)',
            borderColor: 'rgba(0, 255, 136, 0.2)',
          }}
        >
          <div className="text-sm text-[#dcdbd5] mb-1">Brand Colors</div>
          <div className="text-2xl font-bold text-[#00ff88]">
            {brandColors ? Object.keys(brandColors).length : 0}
          </div>
        </div>
        <div
          className="p-4 rounded-lg border"
          style={{
            background: 'rgba(64, 64, 64, 0.5)',
            backdropFilter: 'blur(8px)',
            borderColor: 'rgba(229, 228, 221, 0.2)',
          }}
        >
          <div className="text-sm text-[#dcdbd5] mb-1">Spacing Units</div>
          <div className="text-2xl font-bold text-[#e5e4dd]">
            {spacing ? Object.keys(spacing).length : 0}
          </div>
        </div>
        <div
          className="p-4 rounded-lg border"
          style={{
            background: 'rgba(64, 64, 64, 0.5)',
            backdropFilter: 'blur(8px)',
            borderColor: 'rgba(255, 215, 0, 0.2)',
          }}
        >
          <div className="text-sm text-[#dcdbd5] mb-1">Status</div>
          <div className="text-lg font-bold text-[#ffd700]">Active</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-[#404040]">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#ffd700] text-[#ffd700]'
                    : 'border-transparent text-[#dcdbd5] hover:text-[#e5e4dd] hover:border-[#404040]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeTab === 'typography' && (
          <div className="p-6 rounded-lg border" style={{
            background: 'rgba(64, 64, 64, 0.3)',
            borderColor: 'rgba(255, 215, 0, 0.2)',
          }}>
            <h2 className="text-2xl font-bold text-[#e5e4dd] mb-4">Typography Settings</h2>
            <p className="text-[#dcdbd5]">Typography tab is under development. Access via API: <code className="bg-[#191818] px-2 py-1 rounded text-[#00ff88]">/api/master-controller/typography</code></p>
          </div>
        )}

        {activeTab === 'colors' && (
          <div className="p-6 rounded-lg border" style={{
            background: 'rgba(64, 64, 64, 0.3)',
            borderColor: 'rgba(0, 255, 136, 0.2)',
          }}>
            <h2 className="text-2xl font-bold text-[#e5e4dd] mb-4">Brand Colors</h2>
            <p className="text-[#dcdbd5]">Colors tab is under development. Access via store: <code className="bg-[#191818] px-2 py-1 rounded text-[#00ff88]">useBrandColorsStore()</code></p>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              {brandColors && Object.entries(brandColors).map(([key, value]) => (
                <div key={key} className="p-4 rounded-lg border border-[#404040]">
                  <div className="text-sm text-[#dcdbd5] mb-2">{key}</div>
                  <div
                    className="h-12 rounded border border-[#404040]"
                    style={{ backgroundColor: value as string }}
                  />
                  <div className="text-xs text-[#dcdbd5] mt-2 font-mono">{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'spacing' && (
          <div className="p-6 rounded-lg border" style={{
            background: 'rgba(64, 64, 64, 0.3)',
            borderColor: 'rgba(229, 228, 221, 0.2)',
          }}>
            <h2 className="text-2xl font-bold text-[#e5e4dd] mb-4">Spacing System</h2>
            <p className="text-[#dcdbd5]">Spacing tab is under development. Access via store: <code className="bg-[#191818] px-2 py-1 rounded text-[#00ff88]">useSpacingStore()</code></p>
          </div>
        )}

        {activeTab === 'templates' && (
          <TemplatesTab />
        )}

        {activeTab === 'components' && (
          <div className="p-6 rounded-lg border" style={{
            background: 'rgba(64, 64, 64, 0.3)',
            borderColor: 'rgba(255, 215, 0, 0.2)',
          }}>
            <h2 className="text-2xl font-bold text-[#e5e4dd] mb-4">Component Library</h2>
            <p className="text-[#dcdbd5]">Components tab is under development. See <code className="bg-[#191818] px-2 py-1 rounded text-[#00ff88]">/components/saa</code> for React components.</p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-8 p-4 rounded-lg border border-[#404040]" style={{
        background: 'rgba(64, 64, 64, 0.3)',
      }}>
        <div className="text-sm text-[#dcdbd5]">
          <strong className="text-[#ffd700]">Tip:</strong> All changes are automatically saved to localStorage and will sync to Supabase when configured.
        </div>
      </div>
    </div>
  );
}
