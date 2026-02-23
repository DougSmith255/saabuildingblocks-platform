'use client';

import { useEffect, useMemo } from 'react';
import { Users, Eye, Film, Clock, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useYouTubeStore } from '@/app/master-controller/stores/youtubeStore';
import type { DateRange } from '@/lib/youtube/types';

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function StatCard({
  label,
  value,
  subValue,
  icon: Icon,
  trend,
  color,
}: {
  label: string;
  value: string;
  subValue?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: number;
  color: string;
}) {
  return (
    <div
      className="p-4 rounded-lg border"
      style={{
        background: 'rgba(0, 0, 0, 0.2)',
        borderColor: `${color}33`,
      }}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <div style={{ color }}><Icon className="w-4 h-4" /></div>
        <span className="text-xs text-[#888]">{label}</span>
      </div>
      <div className="text-2xl font-bold text-[#e5e4dd]">{value}</div>
      {subValue && (
        <div className="text-xs text-[#00ff88] mt-1">{subValue}</div>
      )}
      {trend !== undefined && (
        <div className={`flex items-center gap-1 mt-1 text-xs ${trend >= 0 ? 'text-[#00ff88]' : 'text-[#ff6b6b]'}`}>
          {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{trend >= 0 ? '+' : ''}{trend.toFixed(1)}%</span>
          <span className="text-[#666]">vs prev period</span>
        </div>
      )}
    </div>
  );
}

export function ChannelOverview() {
  const {
    channelData,
    dailyMetrics,
    analyticsLoading,
    dateRange,
    setDateRange,
    fetchAnalytics,
  } = useYouTubeStore();

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleRangeChange = (range: DateRange) => {
    setDateRange(range);
    fetchAnalytics(range);
  };

  // Period views (sum of daily views for selected range)
  const periodViews = useMemo(() => {
    return dailyMetrics.reduce((sum, d) => sum + d.views, 0);
  }, [dailyMetrics]);

  // Compute watch hours from daily metrics
  const totalWatchHours = useMemo(() => {
    return dailyMetrics.reduce((sum, d) => sum + d.estimatedMinutesWatched, 0) / 60;
  }, [dailyMetrics]);

  // Net subscribers gained in period
  const netSubsGained = useMemo(() => {
    const gained = dailyMetrics.reduce((s, d) => s + d.subscribersGained, 0);
    const lost = dailyMetrics.reduce((s, d) => s + d.subscribersLost, 0);
    return gained - lost;
  }, [dailyMetrics]);

  // Views trend: compare first half vs second half
  const viewsTrend = useMemo(() => {
    if (dailyMetrics.length < 2) return undefined;
    const mid = Math.floor(dailyMetrics.length / 2);
    const firstHalf = dailyMetrics.slice(0, mid).reduce((s, d) => s + d.views, 0);
    const secondHalf = dailyMetrics.slice(mid).reduce((s, d) => s + d.views, 0);
    if (firstHalf === 0) return undefined;
    return ((secondHalf - firstHalf) / firstHalf) * 100;
  }, [dailyMetrics]);

  // Chart data
  const chartData = useMemo(() => {
    return dailyMetrics.map((d) => ({
      date: d.date.substring(5), // MM-DD
      views: d.views,
      watchTime: Math.round(d.estimatedMinutesWatched),
    }));
  }, [dailyMetrics]);

  return (
    <div
      className="p-6 rounded-lg border"
      style={{
        background: 'rgba(64, 64, 64, 0.3)',
        borderColor: 'rgba(255, 0, 0, 0.15)',
      }}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-[#e5e4dd]">Channel Overview</h3>
        <div className="flex items-center gap-2">
          {(['7d', '28d', '90d'] as DateRange[]).map((r) => (
            <button
              key={r}
              onClick={() => handleRangeChange(r)}
              className="px-3 py-1 rounded text-xs font-medium transition-colors"
              style={{
                background: dateRange === r ? 'rgba(255, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                color: dateRange === r ? '#ff4444' : '#dcdbd5',
                border: dateRange === r ? '1px solid rgba(255, 0, 0, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Subscribers"
          value={channelData ? formatCompact(channelData.subscriberCount) : '--'}
          subValue={netSubsGained !== 0
            ? `${netSubsGained >= 0 ? '+' : ''}${formatCompact(netSubsGained)} in ${dateRange}`
            : undefined
          }
          icon={Users}
          color="#ff4444"
        />
        <StatCard
          label={`Views (${dateRange})`}
          value={periodViews > 0 ? formatCompact(periodViews) : '--'}
          icon={Eye}
          trend={viewsTrend}
          color="#ffd700"
        />
        <StatCard
          label="Total Videos"
          value={channelData ? channelData.videoCount.toLocaleString() : '--'}
          icon={Film}
          color="#00ff88"
        />
        <StatCard
          label={`Watch Hours (${dateRange})`}
          value={totalWatchHours > 0 ? formatCompact(Math.round(totalWatchHours)) : '--'}
          icon={Clock}
          color="#4488ff"
        />
      </div>

      {/* Daily Views Chart */}
      {analyticsLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-[#ff4444]" />
        </div>
      ) : chartData.length > 0 ? (
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ff4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fill: '#666', fontSize: 10 }}
                axisLine={{ stroke: '#333' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#666', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  background: '#1a1a1a',
                  border: '1px solid #404040',
                  borderRadius: '6px',
                  color: '#e5e4dd',
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#ff4444"
                fill="url(#viewsGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center py-8 text-[#666] text-sm">No analytics data for this period</div>
      )}
    </div>
  );
}
