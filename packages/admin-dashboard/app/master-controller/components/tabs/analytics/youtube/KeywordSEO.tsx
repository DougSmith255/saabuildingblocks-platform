'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Loader2, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { SearchTerm, TrafficSource, DateRange } from '@/lib/youtube/types';
import { useYouTubeStore } from '@/app/master-controller/stores/youtubeStore';

const TRAFFIC_SOURCE_LABELS: Record<string, string> = {
  YT_SEARCH: 'YouTube Search',
  SUGGESTED: 'Suggested Videos',
  EXT_URL: 'External',
  NOTIFICATION: 'Notifications',
  SUBSCRIBER: 'Subscribers',
  PLAYLIST: 'Playlists',
  NO_LINK_OTHER: 'Direct / Other',
  RELATED_VIDEO: 'Related Videos',
  YT_CHANNEL: 'Channel Page',
  ANNOTATION: 'Cards & End Screens',
  CAMPAIGN_CARD: 'Campaign Cards',
  END_SCREEN: 'End Screens',
  YT_OTHER_PAGE: 'Other YT Pages',
};

const TRAFFIC_SOURCE_COLORS = [
  '#ff4444', '#ffd700', '#00ff88', '#4488ff', '#ff88ff',
  '#88ffff', '#ff8844', '#88ff44', '#8844ff', '#ff4488',
];

export function KeywordSEO() {
  const { dateRange } = useYouTubeStore();
  const [searchTerms, setSearchTerms] = useState<SearchTerm[]>([]);
  const [trafficSources, setTrafficSources] = useState<TrafficSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<DateRange>(dateRange);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/youtube/keywords?range=${range}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to load');
        setSearchTerms(json.searchTerms || []);
        setTrafficSources(json.trafficSources || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load keyword data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [range]);

  const trafficChartData = useMemo(() => {
    return trafficSources.slice(0, 8).map(t => ({
      name: TRAFFIC_SOURCE_LABELS[t.source] || t.source,
      views: t.views,
    }));
  }, [trafficSources]);

  if (loading) {
    return (
      <div
        className="p-8 rounded-lg border text-center"
        style={{ background: 'rgba(64, 64, 64, 0.2)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
      >
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#ff4444]" />
        <p className="text-[#888] text-sm">Loading keyword data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="p-6 rounded-lg border"
        style={{ background: 'rgba(255, 107, 107, 0.1)', borderColor: 'rgba(255, 107, 107, 0.3)' }}
      >
        <p className="text-[#ff6b6b] text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div
      className="p-6 rounded-lg border"
      style={{
        background: 'rgba(64, 64, 64, 0.3)',
        borderColor: 'rgba(255, 68, 68, 0.15)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-[#e5e4dd] flex items-center gap-2">
          <Search className="w-5 h-5 text-[#ff4444]" />
          Keyword / SEO Analysis
        </h3>
        <div className="flex items-center gap-2">
          {(['7d', '28d', '90d'] as DateRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className="px-3 py-1 rounded text-xs font-medium transition-colors"
              style={{
                background: range === r ? 'rgba(255, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                color: range === r ? '#ff4444' : '#dcdbd5',
                border: range === r ? '1px solid rgba(255, 68, 68, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Search Terms Table */}
        <div>
          <h4 className="text-sm font-semibold text-[#ffd700] mb-3 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5" />
            Top Search Terms
          </h4>
          {searchTerms.length === 0 ? (
            <div className="text-sm text-[#666] p-4 text-center">No search term data available</div>
          ) : (
            <div className="overflow-hidden rounded-lg border" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'rgba(0, 0, 0, 0.3)' }}>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-[#ffd700]">Search Term</th>
                    <th className="text-right px-3 py-2 text-xs font-semibold text-[#ffd700]">Views</th>
                    <th className="text-right px-3 py-2 text-xs font-semibold text-[#ffd700]">Watch (min)</th>
                  </tr>
                </thead>
                <tbody>
                  {searchTerms.slice(0, 15).map((term, idx) => (
                    <tr
                      key={idx}
                      className="border-t"
                      style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}
                    >
                      <td className="px-3 py-2 text-sm text-[#e5e4dd]">{term.term}</td>
                      <td className="px-3 py-2 text-sm text-[#dcdbd5] text-right">{term.views.toLocaleString()}</td>
                      <td className="px-3 py-2 text-sm text-[#dcdbd5] text-right">{Math.round(term.estimatedMinutesWatched).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Traffic Source Chart */}
        <div>
          <h4 className="text-sm font-semibold text-[#ffd700] mb-3 flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5" />
            Traffic Sources
          </h4>
          {trafficChartData.length === 0 ? (
            <div className="text-sm text-[#666] p-4 text-center">No traffic source data available</div>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trafficChartData} layout="vertical">
                  <XAxis
                    type="number"
                    tick={{ fill: '#666', fontSize: 10 }}
                    axisLine={{ stroke: '#333' }}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: '#888', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    width={120}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#1a1a1a',
                      border: '1px solid #404040',
                      borderRadius: '6px',
                      color: '#e5e4dd',
                      fontSize: 12,
                    }}
                    formatter={(value) => [Number(value).toLocaleString(), 'Views']}
                  />
                  <Bar dataKey="views" radius={[0, 4, 4, 0]}>
                    {trafficChartData.map((_, idx) => (
                      <Cell key={idx} fill={TRAFFIC_SOURCE_COLORS[idx % TRAFFIC_SOURCE_COLORS.length]} fillOpacity={0.7} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
