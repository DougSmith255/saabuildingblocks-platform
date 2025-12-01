'use client';

/**
 * Email Automations Tab
 *
 * Main tab for managing email automation system:
 * - Categories (e.g., "Greeting Emails")
 * - Holiday Templates (12 US federal holidays + Halloween)
 * - Schedules (automated sends on specific dates)
 * - Send Logs (delivery tracking and statistics)
 */

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Mail, FolderOpen, FileText, Calendar, BarChart3, Type } from 'lucide-react';

// Sub-tab components - dynamically imported to prevent SSR issues
const CategoriesSection = dynamic(() => import('./EmailAutomations/CategoriesSection').then(mod => ({ default: mod.CategoriesSection })), {
  ssr: false,
  loading: () => <div className="p-6 text-[#dcdbd5]">Loading categories...</div>
});

const TypographySection = dynamic(() => import('./EmailAutomations/TypographySection').then(mod => ({ default: mod.TypographySection })), {
  ssr: false,
  loading: () => <div className="p-6 text-[#dcdbd5]">Loading typography...</div>
});

const SchedulesSection = dynamic(() => import('./EmailAutomations/SchedulesSection').then(mod => ({ default: mod.SchedulesSection })), {
  ssr: false,
  loading: () => <div className="p-6 text-[#dcdbd5]">Loading schedules...</div>
});

const SendLogsSection = dynamic(() => import('./EmailAutomations/SendLogsSection').then(mod => ({ default: mod.SendLogsSection })), {
  ssr: false,
  loading: () => <div className="p-6 text-[#dcdbd5]">Loading send logs...</div>
});

type SubTabId = 'categories' | 'typography' | 'schedules' | 'logs';

export function EmailAutomationsTab() {
  const [activeSubTab, setActiveSubTab] = useState<SubTabId>('categories');

  const subTabs = [
    { id: 'categories' as SubTabId, label: 'Categories', icon: FolderOpen, description: 'Manage categories & templates' },
    { id: 'typography' as SubTabId, label: 'Typography', icon: Type, description: 'Email font & style settings' },
    { id: 'schedules' as SubTabId, label: 'Schedules', icon: Calendar, description: 'Automated email sends' },
    { id: 'logs' as SubTabId, label: 'Send Logs', icon: BarChart3, description: 'Delivery tracking & stats' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#ffd700] flex items-center gap-2 mb-2">
            <Mail className="w-6 h-6" />
            Email Automations
          </h2>
          <p className="text-[#dcdbd5]">
            Manage holiday greeting emails for your active downline contacts
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
        {activeSubTab === 'categories' && <CategoriesSection />}
        {activeSubTab === 'typography' && <TypographySection />}
        {activeSubTab === 'schedules' && <SchedulesSection />}
        {activeSubTab === 'logs' && <SendLogsSection />}
      </div>

      {/* Info Footer */}
      <div
        className="mt-6 p-4 rounded-lg border border-[rgba(0,255,136,0.2)]"
        style={{ background: 'rgba(0, 255, 136, 0.05)' }}
      >
        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-[#00ff88] mt-0.5" />
          <div className="text-sm text-[#dcdbd5]">
            <strong className="text-[#00ff88]">About Email Automations:</strong>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>12 pre-configured holiday templates with Smart Agent Alliance branding</li>
              <li>Automatically fetch contacts from GoHighLevel with "active-downline" tag</li>
              <li>Personalization tokens: {'{'}{'{'} firstName {'}'}{'}'}, {'{'}{'{'} lastName {'}'}{'}'}, {'{'}{'{'} email {'}'}{'}'}
              </li>
              <li>Scheduled sends on specific dates (auto-calculates variable holidays)</li>
              <li>Delivery tracking via WordPress Mail SMTP with n8n fallback</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
