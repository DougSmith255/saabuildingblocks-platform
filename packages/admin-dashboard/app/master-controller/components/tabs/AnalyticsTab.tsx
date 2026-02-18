'use client';

import { useState, useEffect, useCallback } from 'react';
import { BarChart3, Eye, Clock, Timer, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';

type Range = '7d' | '30d' | '90d';

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

function DailyChart({ daily, accentColor }: { daily: DailyEntry[]; accentColor: string }) {
  if (daily.length === 0) {
    return (
      <div className="text-sm text-[#888] py-4 text-center">No daily data available</div>
    );
  }

  const maxViews = Math.max(...daily.map((d) => d.views), 1);
  const barMaxHeight = 80;

  return (
    <div className="mt-4">
      <div className="text-xs text-[#888] mb-2">Daily Views</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: `${barMaxHeight + 20}px` }}>
        {daily.map((d) => {
          const height = Math.max((d.views / maxViews) * barMaxHeight, 2);
          return (
            <div
              key={d.date}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}
            >
              <div
                title={`${d.date}: ${d.views} views`}
                style={{
                  width: '100%',
                  maxWidth: '20px',
                  height: `${height}px`,
                  background: accentColor,
                  borderRadius: '2px 2px 0 0',
                  opacity: 0.85,
                  transition: 'opacity 0.2s',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.opacity = '1'; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.opacity = '0.85'; }}
              />
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span className="text-[10px] text-[#666]">{daily[0].date}</span>
        <span className="text-[10px] text-[#666]">{daily[daily.length - 1].date}</span>
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

export function AnalyticsTab() {
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
          {(['7d', '30d', '90d'] as Range[]).map((r) => (
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
    </div>
  );
}
