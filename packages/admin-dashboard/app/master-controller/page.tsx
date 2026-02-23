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
import { Settings, Zap, Users, BarChart3, AlertTriangle } from 'lucide-react';
import { useUserRole, RoleBadge } from '@/lib/rbac';

// Tab components - dynamically imported to prevent SSR
const WebSettingsTab = dynamicImport(() => import('./components/tabs/WebSettingsTab').then(mod => ({ default: mod.WebSettingsTab })), {
  ssr: false,
  loading: () => <div className="p-6 text-[#dcdbd5]">Loading Web Settings tab...</div>
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

const TriageTab = dynamicImport(() => import('./components/tabs/TriageTab').then(mod => ({ default: mod.TriageTab })), {
  ssr: false,
  loading: () => <div className="p-6 text-[#dcdbd5]">Loading 404 Watch tab...</div>
});

type TabId = 'web-settings' | 'automations' | 'users' | 'analytics' | 'triage';

// Legacy tab IDs that should redirect to web-settings with the appropriate sub-tab
const legacyTabMap: Record<string, string> = {
  'typography': 'typography',
  'colors': 'colors',
  'spacing': 'spacing',
  'templates': 'templates',
  'components': 'components',
};

function MasterControllerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize tab from URL or default to 'web-settings'
  const [activeTab, setActiveTab] = useState<TabId>(() => {
    const tabParam = searchParams.get('tab');
    const validTabs: TabId[] = ['web-settings', 'automations', 'users', 'analytics', 'triage'];
    if (tabParam && validTabs.includes(tabParam as TabId)) return tabParam as TabId;
    // Backwards compatibility: redirect legacy tab IDs to web-settings
    if (tabParam && tabParam in legacyTabMap) return 'web-settings';
    return 'web-settings';
  });

  // RBAC: Get user role
  const { role, isLoading: roleLoading } = useUserRole();

  // Backwards compatibility: redirect legacy tab URLs to web-settings with sub-tab
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && tabParam in legacyTabMap) {
      router.replace(`/master-controller?tab=web-settings&sub=${legacyTabMap[tabParam]}`);
    }
  }, [searchParams, router]);

  // Sync URL when tab changes
  const handleTabChange = (newTab: TabId) => {
    setActiveTab(newTab);
    router.push(`/master-controller?tab=${newTab}`);
  };

  // All tabs are now accessible to all authenticated users
  const tabs = [
    { id: 'web-settings' as TabId, label: 'Web Settings', icon: Settings },
    { id: 'automations' as TabId, label: 'Automations', icon: Zap },
    { id: 'users' as TabId, label: 'Users', icon: Users },
    { id: 'analytics' as TabId, label: 'Analytics', icon: BarChart3 },
    { id: 'triage' as TabId, label: '404 Watch', icon: AlertTriangle },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={{ scrollBehavior: 'smooth' }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-display text-3xl font-bold text-[#e5e4dd] flex items-center gap-3">
            <Settings className="w-8 h-8 text-[#ffd700]" />
            Master Controller
          </h1>
          {!roleLoading && role && <RoleBadge role={role} size="md" />}
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
        {activeTab === 'web-settings' && <WebSettingsTab />}

        {activeTab === 'automations' && <AutomationsTab />}

        {activeTab === 'users' && <UserManagementTab />}

        {activeTab === 'analytics' && <AnalyticsTab />}

        {activeTab === 'triage' && <TriageTab />}
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
