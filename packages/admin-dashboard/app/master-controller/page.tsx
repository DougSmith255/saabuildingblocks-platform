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
 *
 * Note: As a client component, this page is not pre-rendered during build.
 * It runs entirely in the browser with access to localStorage and Zustand stores.
 */

import { useState, useEffect, Suspense } from 'react';
import dynamicImport from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { Palette, Type, LayoutGrid, FileCode, Settings, Layers, Zap, Users, BarChart3 } from 'lucide-react';
import { useUserRole, RoleBadge } from '@/lib/rbac';

// Tab components - dynamically imported to prevent SSR
const TypographyTab = dynamicImport(() => import('./components/tabs/TypographyTab').then(mod => ({ default: mod.TypographyTab })), {
  ssr: false,
  loading: () => <div className="p-6 text-[#dcdbd5]">Loading Typography tab...</div>
});

const BrandColorsTab = dynamicImport(() => import('./components/tabs/BrandColorsTab').then(mod => ({ default: mod.BrandColorsTab })), {
  ssr: false,
  loading: () => <div className="p-6 text-[#dcdbd5]">Loading Brand Colors tab...</div>
});

const SpacingTab = dynamicImport(() => import('./components/tabs/SpacingTab').then(mod => ({ default: mod.SpacingTab })), {
  ssr: false,
  loading: () => <div className="p-6 text-[#dcdbd5]">Loading Spacing tab...</div>
});

const ComponentsTab = dynamicImport(() => import('./components/tabs/ComponentsTab').then(mod => ({ default: mod.ComponentsTab })), {
  ssr: false,
  loading: () => <div className="p-6 text-[#dcdbd5]">Loading Components tab...</div>
});

const TemplatesTab = dynamicImport(() => import('./components/tabs/TemplatesTab').then(mod => ({ default: mod.TemplatesTab })), {
  ssr: false,
  loading: () => <div className="p-6 text-[#dcdbd5]">Loading Templates tab...</div>
});

const AutomationsTab = dynamicImport(() => import('./components/tabs/AutomationsTab').then(mod => ({ default: mod.AutomationsTab })), {
  ssr: false,
  loading: () => <div className="p-6 text-[#dcdbd5]">Loading Automations tab...</div>
});

const UserManagementTab = dynamicImport(() => import('./components/tabs/UserManagementTab').then(mod => ({ default: mod.UserManagementTab })), {
  ssr: false,
  loading: () => <div className="p-6 text-[#dcdbd5]">Loading Users tab...</div>
});

const AnalyticsTab = dynamicImport(() => import('./components/tabs/AnalyticsTab').then(mod => ({ default: mod.AnalyticsTab })), {
  ssr: false,
  loading: () => <div className="p-6 text-[#dcdbd5]">Loading Analytics tab...</div>
});

// Store hooks - only used in client component after mount
import { useBrandColorsStore } from './stores/brandColorsStore';
import { useTypographyStore } from './stores/typographyStore';
import { useSpacingStore } from './stores/spacingStore';

type TabId = 'typography' | 'colors' | 'spacing' | 'templates' | 'components' | 'automations' | 'users' | 'analytics';

function MasterControllerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize tab from URL or default to 'typography'
  const [activeTab, setActiveTab] = useState<TabId>(() => {
    const tabParam = searchParams.get('tab');
    const validTabs: TabId[] = ['typography', 'colors', 'spacing', 'templates', 'components', 'automations', 'users', 'analytics'];
    return (tabParam && validTabs.includes(tabParam as TabId)) ? tabParam as TabId : 'typography';
  });

  // RBAC: Get user role
  const { role, isLoading: roleLoading } = useUserRole();

  // Store states
  const brandColors = useBrandColorsStore();
  const typography = useTypographyStore();
  const spacing = useSpacingStore();

  // Sync URL when tab changes
  const handleTabChange = (newTab: TabId) => {
    setActiveTab(newTab);
    router.push(`/master-controller?tab=${newTab}`);
  };

  // All tabs are now accessible to all authenticated users
  const tabs = [
    { id: 'typography' as TabId, label: 'Typography', icon: Type },
    { id: 'colors' as TabId, label: 'Colors', icon: Palette },
    { id: 'spacing' as TabId, label: 'Spacing', icon: LayoutGrid },
    { id: 'templates' as TabId, label: 'Templates', icon: FileCode },
    { id: 'components' as TabId, label: 'Components', icon: Layers },
    { id: 'automations' as TabId, label: 'Automations', icon: Zap },
    { id: 'users' as TabId, label: 'Users', icon: Users },
    { id: 'analytics' as TabId, label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={{ scrollBehavior: 'smooth' }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-display text-3xl font-bold text-[#e5e4dd] flex items-center gap-3">
            <Settings className="w-8 h-8 text-[#ffd700]" />
            Master Controller
          </h1>
          {!roleLoading && role && <RoleBadge role={role} size="md" />}
        </div>
        <p className="text-[#dcdbd5]">
          {role === 'admin'
            ? 'Full admin access: Control typography, colors, spacing, templates, and deployments.'
            : 'Read-only access: View Master Controller settings. Contact admin for edit access.'}
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
            {typography?.settings ? Object.keys(typography.settings).length : 0}
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
                onClick={() => handleTabChange(tab.id)}
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
        {activeTab === 'typography' && <TypographyTab />}

        {activeTab === 'colors' && <BrandColorsTab />}

        {activeTab === 'spacing' && <SpacingTab />}

        {activeTab === 'templates' && (
          <TemplatesTab />
        )}

        {activeTab === 'components' && <ComponentsTab />}

        {activeTab === 'automations' && <AutomationsTab />}

        {activeTab === 'users' && <UserManagementTab />}

        {activeTab === 'analytics' && <AnalyticsTab />}
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

export default function MasterControllerDashboard() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-[#dcdbd5]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00ff88] mx-auto mb-4"></div>
          <p>Loading Master Controller...</p>
        </div>
      </div>
    }>
      <MasterControllerContent />
    </Suspense>
  );
}
