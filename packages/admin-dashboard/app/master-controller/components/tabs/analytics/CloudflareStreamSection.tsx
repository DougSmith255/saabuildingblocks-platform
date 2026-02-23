'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { BarChart3, Eye, Clock, Timer, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

type Range = '1d' | '3d' | '7d' | '30d' | '90d';

interface DailyEntry {
  date: string;
  views: number;
  minutesWatched: number;
}

interface VideoData {
  id: string;
  name: string;
  totalViews: number;
  totalMinutesWatched: number;
  avgViewDurationSeconds: number;
  daily: DailyEntry[];
}

interface AnalyticsResponse {
  success: boolean;
  data?: {
    videos: VideoData[];
    range: Range;
  };
  error?: string;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}

function formatNumber(n: number): string {
  return n.toLocaleString();
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function DailyChart({ daily, accentColor }: { daily: DailyEntry[]; accentColor: string }) {
  const chartData = useMemo(() => {
    return daily.map((d) => ({
      date: formatDateLabel(d.date),
      views: d.views,
      minutes: Math.round(d.minutesWatched * 10) / 10,
    }));
  }, [daily]);

  if (daily.length === 0) {
    return (
      <div className="text-sm text-[#888] py-4 text-center">No daily data available</div>
    );
  }

  // Show ~6-8 tick labels evenly spaced
  const tickInterval = Math.max(1, Math.floor(chartData.length / 7));

  // Create a unique gradient ID per chart instance
  const gradientId = `gradient-${accentColor.replace('#', '')}`;

  return (
    <div className="mt-4">
      <div className="text-xs text-[#888] mb-2">Daily Views</div>
      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={accentColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={accentColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#666', fontSize: 10 }}
              axisLine={{ stroke: '#333' }}
              tickLine={false}
              interval={tickInterval}
            />
            <YAxis
              tick={{ fill: '#666', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={45}
              tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)}
            />
            <Tooltip
              contentStyle={{
                background: '#1a1a1a',
                border: '1px solid #404040',
                borderRadius: '6px',
                color: '#e5e4dd',
                fontSize: 12,
              }}
              formatter={(value, name) => {
                if (name === 'views') return [Number(value).toLocaleString(), 'Views'];
                return [Number(value).toLocaleString(), 'Min Watched'];
              }}
            />
            <Area
              type="monotone"
              dataKey="views"
              stroke={accentColor}
              fill={`url(#${gradientId})`}
              strokeWidth={2}
              dot={daily.length <= 14 ? { r: 3, fill: accentColor, strokeWidth: 0 } : false}
              activeDot={{ r: 5, fill: accentColor, stroke: '#1a1a1a', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function VideoCard({ video, accentColor }: { video: VideoData; accentColor: string }) {
  return (
    <div
      className="p-6 rounded-lg border"
      style={{
        background: 'rgba(64, 64, 64, 0.3)',
        backdropFilter: 'blur(8px)',
        borderColor: accentColor.replace(')', ', 0.3)').replace('rgb', 'rgba'),
      }}
    >
      <h3 className="text-lg font-bold mb-4" style={{ color: accentColor }}>
        {video.name}
      </h3>

      <div className="grid grid-cols-3 gap-4 mb-2">
        <div
          className="p-3 rounded-lg border"
          style={{ background: 'rgba(0, 0, 0, 0.2)', borderColor: 'rgba(255, 255, 255, 0.08)' }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <Eye className="w-3.5 h-3.5 text-[#888]" />
            <span className="text-xs text-[#888]">Total Views</span>
          </div>
          <div className="text-xl font-bold text-[#e5e4dd]">{formatNumber(video.totalViews)}</div>
        </div>

        <div
          className="p-3 rounded-lg border"
          style={{ background: 'rgba(0, 0, 0, 0.2)', borderColor: 'rgba(255, 255, 255, 0.08)' }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5 text-[#888]" />
            <span className="text-xs text-[#888]">Minutes Watched</span>
          </div>
          <div className="text-xl font-bold text-[#e5e4dd]">{formatNumber(Math.round(video.totalMinutesWatched))}</div>
        </div>

        <div
          className="p-3 rounded-lg border"
          style={{ background: 'rgba(0, 0, 0, 0.2)', borderColor: 'rgba(255, 255, 255, 0.08)' }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <Timer className="w-3.5 h-3.5 text-[#888]" />
            <span className="text-xs text-[#888]">Avg Duration</span>
          </div>
          <div className="text-xl font-bold text-[#e5e4dd]">{formatDuration(video.avgViewDurationSeconds)}</div>
        </div>
      </div>

      <DailyChart daily={video.daily} accentColor={accentColor} />
    </div>
  );
}

export function CloudflareStreamSection() {
  const [range, setRange] = useState<Range>('30d');
  const [data, setData] = useState<VideoData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async (r: Range) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/master-controller/analytics?range=${r}`);
      const json: AnalyticsResponse = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to fetch analytics');
      }
      setData(json.data!.videos);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics(range);
  }, [range, fetchAnalytics]);

  const handleRangeChange = (newRange: Range) => {
    setRange(newRange);
  };

  const videoColors = ['#ffd700', '#00ff88'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="p-6 rounded-lg border flex items-center justify-between"
        style={{
          background: 'rgba(64, 64, 64, 0.3)',
          borderColor: 'rgba(255, 215, 0, 0.2)',
        }}
      >
        <div>
          <h2 className="text-2xl font-bold text-[#ffd700] flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Video Analytics
          </h2>
          <p className="text-[#dcdbd5] mt-1">Cloudflare Stream views and watch time</p>
        </div>
        <div className="flex items-center gap-2">
          {(['1d', '3d', '7d', '30d', '90d'] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => handleRangeChange(r)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded text-sm font-medium transition-colors disabled:opacity-50"
              style={{
                background: range === r ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                color: range === r ? '#ffd700' : '#dcdbd5',
                border: range === r ? '1px solid rgba(255, 215, 0, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {r}
            </button>
          ))}
          <button
            onClick={() => fetchAnalytics(range)}
            disabled={isLoading}
            className="ml-2 p-1.5 rounded transition-colors disabled:opacity-50"
            style={{ color: '#dcdbd5' }}
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="p-12 rounded-lg border text-center" style={{
          background: 'rgba(64, 64, 64, 0.2)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
        }}>
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-[#ffd700]" />
          <p className="text-[#dcdbd5]">Loading analytics...</p>
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <div className="p-6 rounded-lg border" style={{
          background: 'rgba(255, 107, 107, 0.1)',
          borderColor: 'rgba(255, 107, 107, 0.3)',
        }}>
          <div className="flex items-center gap-2 text-[#ff6b6b]">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">Error loading analytics</span>
          </div>
          <p className="text-[#dcdbd5] text-sm mt-2">{error}</p>
          <button
            onClick={() => fetchAnalytics(range)}
            className="mt-3 px-4 py-2 rounded text-sm font-medium transition-colors"
            style={{
              background: 'rgba(255, 107, 107, 0.2)',
              color: '#ff6b6b',
              border: '1px solid rgba(255, 107, 107, 0.3)',
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Video Cards */}
      {!isLoading && !error && data && (
        <div className="space-y-6">
          {data.map((video, i) => (
            <VideoCard key={video.id} video={video} accentColor={videoColors[i] || '#ffd700'} />
          ))}

          {data.length === 0 && (
            <div className="p-12 rounded-lg border text-center" style={{
              background: 'rgba(64, 64, 64, 0.2)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
            }}>
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-[#404040]" />
              <p className="text-[#888] text-lg">No analytics data available</p>
            </div>
          )}
        </div>
      )}

      {/* Note about data accuracy */}
      <div className="text-[10px] text-[#555] text-center">
        Cloudflare Stream uses adaptive sampling — numbers may vary slightly between time ranges
      </div>
    </div>
  );
}
