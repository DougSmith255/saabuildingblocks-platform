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

import { useState, useEffect, useCallback, Suspense } from 'react';
import dynamicImport from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { Settings, Zap, Users, BarChart3, AlertTriangle, Lightbulb, Bug } from 'lucide-react';
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

const SuggestionsTab = dynamicImport(() => import('./components/tabs/SuggestionsTab').then(mod => ({ default: mod.SuggestionsTab })), {
  ssr: false,
  loading: () => <div className="p-6 text-[#dcdbd5]">Loading Suggestions tab...</div>
});

const ErrorLogTab = dynamicImport(() => import('./components/tabs/ErrorLogTab').then(mod => ({ default: mod.ErrorLogTab })), {
  ssr: false,
  loading: () => <div className="p-6 text-[#dcdbd5]">Loading Error Log tab...</div>
});

type TabId = 'web-settings' | 'automations' | 'users' | 'analytics' | 'triage' | 'suggestions' | 'errors';

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
    const validTabs: TabId[] = ['web-settings', 'automations', 'users', 'analytics', 'triage', 'suggestions', 'errors'];
    if (tabParam && validTabs.includes(tabParam as TabId)) return tabParam as TabId;
    // Backwards compatibility: redirect legacy tab IDs to web-settings
    if (tabParam && tabParam in legacyTabMap) return 'web-settings';
    return 'web-settings';
  });

  // RBAC: Get user role
  const { role, isLoading: roleLoading } = useUserRole();

  // Portal presence tracking
  const [portalAgents, setPortalAgents] = useState<{ username: string; section: string; secsAgo: number }[]>([]);
  const [portalCount, setPortalCount] = useState(0);
  const [showPortalTooltip, setShowPortalTooltip] = useState(false);

  const fetchPresence = useCallback(async () => {
    try {
      const res = await fetch('/api/portal-heartbeat');
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) {
        setPortalCount(data.count);
        setPortalAgents(data.agents || []);
      }
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    fetchPresence();
    const interval = setInterval(fetchPresence, 15000);
    return () => clearInterval(interval);
  }, [fetchPresence]);

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
    { id: 'suggestions' as TabId, label: 'Suggestions', icon: Lightbulb },
    { id: 'errors' as TabId, label: 'Error Log', icon: Bug },
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
          <div className="flex items-center gap-3">
            {/* Portal presence badge */}
            <div className="relative">
              <button
                onClick={() => setShowPortalTooltip(!showPortalTooltip)}
                onBlur={() => setTimeout(() => setShowPortalTooltip(false), 200)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                  portalCount > 0
                    ? 'bg-[#00ff88]/10 border-[#00ff88]/30 text-[#00ff88]'
                    : 'bg-[#404040]/30 border-[#404040] text-[#dcdbd5]/60'
                }`}
                title={portalCount > 0 ? `${portalCount} agent(s) in portal` : 'No agents in portal — safe to restart'}
              >
                <span className={`w-2 h-2 rounded-full ${portalCount > 0 ? 'bg-[#00ff88] animate-pulse' : 'bg-[#dcdbd5]/30'}`} />
                {portalCount > 0 ? `${portalCount} in portal` : 'Portal clear'}
              </button>

              {/* Tooltip dropdown */}
              {showPortalTooltip && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-[#191818] border border-[#404040] rounded-lg shadow-xl z-50 overflow-hidden">
                  <div className="px-3 py-2 border-b border-[#404040]">
                    <p className="text-xs font-medium text-[#dcdbd5]/60">
                      {portalCount > 0 ? 'Agents currently in portal' : 'No agents online'}
                    </p>
                  </div>
                  {portalAgents.length > 0 ? (
                    <div className="max-h-48 overflow-y-auto">
                      {portalAgents.map((agent, i) => (
                        <div key={i} className="px-3 py-2 flex items-center justify-between border-b border-[#404040]/50 last:border-0">
                          <div>
                            <p className="text-sm text-[#e5e4dd] font-medium">{agent.username}</p>
                            <p className="text-xs text-[#dcdbd5]/40 capitalize">{agent.section.replace(/-/g, ' ')}</p>
                          </div>
                          <span className="text-xs text-[#dcdbd5]/40">{agent.secsAgo}s ago</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-3 py-4 text-center">
                      <p className="text-sm text-[#00ff88]">Safe to rebuild/restart</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            {!roleLoading && role && <RoleBadge role={role} size="md" />}
          </div>
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

        {activeTab === 'suggestions' && <SuggestionsTab />}

        {activeTab === 'errors' && <ErrorLogTab />}
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
