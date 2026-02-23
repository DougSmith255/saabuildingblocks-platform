'use client';

import { useState, useEffect, useCallback } from 'react';
import { Activity, Loader2, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useYouTubeStore } from '@/app/master-controller/stores/youtubeStore';
import type { RetentionDataPoint } from '@/lib/youtube/types';

function diagnoseRetention(data: RetentionDataPoint[]): string[] {
  if (data.length < 5) return ['Not enough data for diagnosis'];
  const labels: string[] = [];

  // Check for early drop (0-10% of video)
  const earlyPoints = data.filter(d => d.elapsedVideoTimeRatio <= 0.1);
  const midPoints = data.filter(d => d.elapsedVideoTimeRatio > 0.1 && d.elapsedVideoTimeRatio <= 0.4);

  if (earlyPoints.length >= 2) {
    const earlyStart = earlyPoints[0]?.audienceWatchRatio ?? 1;
    const earlyEnd = earlyPoints[earlyPoints.length - 1]?.audienceWatchRatio ?? 1;
    if (earlyStart > 0 && (earlyStart - earlyEnd) / earlyStart > 0.3) {
      labels.push('Weak hook — first 30 seconds need to be more compelling');
    }
  }

  // Check mid-section drop (10-40%)
  if (midPoints.length >= 2) {
    const midStart = midPoints[0]?.audienceWatchRatio ?? 1;
    const midEnd = midPoints[midPoints.length - 1]?.audienceWatchRatio ?? 1;
    if (midStart > 0 && (midStart - midEnd) / midStart > 0.25) {
      labels.push('Pacing issue — mid-section may be too slow or off-topic');
    }
  }

  // Check for gradual/normal decline
  const first = data[0]?.audienceWatchRatio ?? 0;
  const last = data[data.length - 1]?.audienceWatchRatio ?? 0;
  if (first > 0 && last / first > 0.3) {
    labels.push('Normal pattern — content is well-structured');
  }

  // Check for spikes (re-watches)
  for (let i = 1; i < data.length; i++) {
    if (data[i].audienceWatchRatio > data[i - 1].audienceWatchRatio * 1.15) {
      labels.push('Re-watches detected — viewers replaying a section');
      break;
    }
  }

  return labels.length > 0 ? labels : ['Content retention is typical'];
}

export function ContentDiagnostics() {
  const { videos } = useYouTubeStore();
  const [selectedVideoId, setSelectedVideoId] = useState<string>('');
  const [retention, setRetention] = useState<RetentionDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRetention = useCallback(async (videoId: string) => {
    if (!videoId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/youtube/retention?videoId=${videoId}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to fetch retention');
      setRetention(json.retention || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load retention data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedVideoId) {
      fetchRetention(selectedVideoId);
    }
  }, [selectedVideoId, fetchRetention]);

  // Auto-select first video
  useEffect(() => {
    if (videos.length > 0 && !selectedVideoId) {
      setSelectedVideoId(videos[0].id);
    }
  }, [videos, selectedVideoId]);

  const chartData = retention.map(d => ({
    position: Math.round(d.elapsedVideoTimeRatio * 100),
    retention: Math.round(d.audienceWatchRatio * 100),
  }));

  const diagnosisLabels = retention.length > 0 ? diagnoseRetention(retention) : [];

  const selectedVideo = videos.find(v => v.id === selectedVideoId);

  return (
    <div
      className="p-6 rounded-lg border"
      style={{
        background: 'rgba(64, 64, 64, 0.3)',
        borderColor: 'rgba(136, 136, 255, 0.15)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-[#e5e4dd] flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#8888ff]" />
          Content Diagnostics
        </h3>
      </div>

      {/* Video Selector */}
      <div className="mb-4">
        <select
          value={selectedVideoId}
          onChange={(e) => setSelectedVideoId(e.target.value)}
          className="w-full max-w-md px-3 py-2 rounded-lg text-sm"
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#e5e4dd',
          }}
        >
          <option value="">Select a video...</option>
          {videos.map((v) => (
            <option key={v.id} value={v.id} style={{ background: '#1a1a1a' }}>
              {v.title}
            </option>
          ))}
        </select>
      </div>

      {!selectedVideoId && (
        <div className="text-center py-8 text-[#666] text-sm">
          Select a video above to see its retention curve
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-[#8888ff]" />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: 'rgba(255, 107, 107, 0.1)' }}>
          <AlertTriangle className="w-4 h-4 text-[#ff6b6b]" />
          <span className="text-sm text-[#ff6b6b]">{error}</span>
        </div>
      )}

      {!loading && !error && chartData.length > 0 && (
        <>
          {/* Retention Curve */}
          <div className="h-[250px] mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis
                  dataKey="position"
                  tick={{ fill: '#666', fontSize: 10 }}
                  axisLine={{ stroke: '#333' }}
                  tickLine={false}
                  label={{ value: '% through video', position: 'insideBottom', offset: -5, fill: '#666', fontSize: 10 }}
                />
                <YAxis
                  tick={{ fill: '#666', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                  domain={[0, 'auto']}
                  label={{ value: '% audience', angle: -90, position: 'insideLeft', fill: '#666', fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={{
                    background: '#1a1a1a',
                    border: '1px solid #404040',
                    borderRadius: '6px',
                    color: '#e5e4dd',
                    fontSize: 12,
                  }}
                  formatter={(value) => [`${value}%`, 'Audience Remaining']}
                  labelFormatter={(label) => `${label}% through video`}
                />
                <ReferenceLine y={50} stroke="#444" strokeDasharray="3 3" />
                <Line
                  type="monotone"
                  dataKey="retention"
                  stroke="#8888ff"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#8888ff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Diagnosis Labels */}
          <div className="space-y-2">
            {diagnosisLabels.map((label, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-3 rounded-lg text-sm"
                style={{
                  background: 'rgba(136, 136, 255, 0.05)',
                  border: '1px solid rgba(136, 136, 255, 0.15)',
                }}
              >
                <Activity className="w-3.5 h-3.5 text-[#8888ff] mt-0.5 shrink-0" />
                <span className="text-[#dcdbd5]">{label}</span>
              </div>
            ))}
          </div>

          {/* Video Duration Info */}
          {selectedVideo && (
            <div className="mt-4 text-xs text-[#666]">
              Video duration: {Math.floor(selectedVideo.durationSeconds / 60)}m {selectedVideo.durationSeconds % 60}s
            </div>
          )}
        </>
      )}
    </div>
  );
}
