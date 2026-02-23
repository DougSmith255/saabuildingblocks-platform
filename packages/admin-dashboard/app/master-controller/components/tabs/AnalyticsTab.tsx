'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { BarChart3, Video, Youtube } from 'lucide-react';

const CloudflareStreamSection = dynamic(
  () => import('./analytics/CloudflareStreamSection').then(mod => ({ default: mod.CloudflareStreamSection })),
  { ssr: false, loading: () => <div className="p-6 text-[#dcdbd5]">Loading videos...</div> }
);

const YouTubeSection = dynamic(
  () => import('./analytics/youtube/YouTubeSection').then(mod => ({ default: mod.YouTubeSection })),
  { ssr: false, loading: () => <div className="p-6 text-[#dcdbd5]">Loading YouTube...</div> }
);

type SubTabId = 'videos' | 'youtube';

export function AnalyticsTab() {
  const searchParams = useSearchParams();

  const [activeSubTab, setActiveSubTab] = useState<SubTabId>(() => {
    const sub = searchParams.get('sub');
    return sub === 'youtube' ? 'youtube' : 'videos';
  });

  // Sync sub-tab from URL changes (e.g., after OAuth redirect)
  useEffect(() => {
    const sub = searchParams.get('sub');
    if (sub === 'youtube') setActiveSubTab('youtube');
  }, [searchParams]);

  const subTabs = [
    { id: 'videos' as SubTabId, label: 'Videos', icon: Video, description: 'Cloudflare Stream analytics' },
    { id: 'youtube' as SubTabId, label: 'YouTube', icon: Youtube, description: 'YouTube channel analytics & management' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#ffd700] flex items-center gap-2 mb-2">
            <BarChart3 className="w-6 h-6" />
            Analytics
          </h2>
          <p className="text-[#dcdbd5]">
            Video analytics and YouTube channel management
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
        {activeSubTab === 'videos' && <CloudflareStreamSection />}
        {activeSubTab === 'youtube' && <YouTubeSection />}
      </div>
    </div>
  );
}
