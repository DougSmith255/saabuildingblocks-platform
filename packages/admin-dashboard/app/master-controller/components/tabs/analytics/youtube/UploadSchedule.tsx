'use client';

import { useState, useEffect, useMemo } from 'react';
import { Calendar, Loader2, Star } from 'lucide-react';
import type { UploadPattern } from '@/lib/youtube/types';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function formatHour(h: number): string {
  if (h === 0) return '12a';
  if (h < 12) return `${h}a`;
  if (h === 12) return '12p';
  return `${h - 12}p`;
}

export function UploadSchedule() {
  const [patterns, setPatterns] = useState<UploadPattern[]>([]);
  const [bestSlot, setBestSlot] = useState<{ day: number; hour: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch_data() {
      try {
        const res = await fetch('/api/youtube/schedule');
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to load');
        setPatterns(json.patterns || []);
        setBestSlot(json.bestSlot || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load schedule data');
      } finally {
        setLoading(false);
      }
    }
    fetch_data();
  }, []);

  // Build heatmap data: 7 days x 24 hours
  const heatmapData = useMemo(() => {
    const grid: (UploadPattern | null)[][] = Array.from({ length: 7 }, () =>
      Array.from({ length: 24 }, () => null)
    );
    for (const p of patterns) {
      grid[p.dayOfWeek][p.hour] = p;
    }
    return grid;
  }, [patterns]);

  const maxViews = useMemo(() => {
    return Math.max(...patterns.map(p => p.avgViews), 1);
  }, [patterns]);

  if (loading) {
    return (
      <div
        className="p-8 rounded-lg border text-center"
        style={{ background: 'rgba(64, 64, 64, 0.2)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
      >
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#ffd700]" />
        <p className="text-[#888] text-sm">Analyzing upload patterns...</p>
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

  if (patterns.length === 0) {
    return null;
  }

  return (
    <div
      className="p-6 rounded-lg border"
      style={{
        background: 'rgba(64, 64, 64, 0.3)',
        borderColor: 'rgba(255, 215, 0, 0.15)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-[#e5e4dd] flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#ffd700]" />
          Upload Schedule Insights
        </h3>
      </div>

      {/* Best Slot Recommendation */}
      {bestSlot && (
        <div
          className="mb-4 p-3 rounded-lg border flex items-start gap-2"
          style={{
            background: 'rgba(0, 255, 136, 0.05)',
            borderColor: 'rgba(0, 255, 136, 0.2)',
          }}
        >
          <Star className="w-4 h-4 text-[#00ff88] mt-0.5 shrink-0" />
          <div className="text-sm text-[#dcdbd5]">
            <strong className="text-[#00ff88]">Best time to publish:</strong>{' '}
            {DAYS[bestSlot.day]} at {formatHour(bestSlot.hour)} UTC
            <span className="text-[#888] ml-1">(based on avg views per upload slot)</span>
          </div>
        </div>
      )}

      {/* Heatmap */}
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Hour labels */}
          <div className="flex mb-1 pl-10">
            {HOURS.filter(h => h % 3 === 0).map(h => (
              <div
                key={h}
                className="text-[10px] text-[#666]"
                style={{ width: `${(100 / 8)}%`, textAlign: 'center' }}
              >
                {formatHour(h)}
              </div>
            ))}
          </div>

          {/* Grid rows */}
          {DAYS.map((day, dayIdx) => (
            <div key={day} className="flex items-center mb-0.5">
              <div className="text-xs text-[#888] w-10 text-right pr-2 shrink-0">{day}</div>
              <div className="flex flex-1 gap-0.5">
                {HOURS.map(hour => {
                  const cell = heatmapData[dayIdx][hour];
                  const intensity = cell ? cell.avgViews / maxViews : 0;
                  const isBest = bestSlot?.day === dayIdx && bestSlot?.hour === hour;

                  return (
                    <div
                      key={hour}
                      className="flex-1 rounded-sm relative"
                      style={{
                        height: '20px',
                        background: cell
                          ? `rgba(0, 255, 136, ${0.1 + intensity * 0.6})`
                          : 'rgba(255, 255, 255, 0.02)',
                        border: isBest ? '2px solid #00ff88' : '1px solid transparent',
                      }}
                      title={cell
                        ? `${day} ${formatHour(hour)}: ${cell.videoCount} video(s), avg ${cell.avgViews.toLocaleString()} views`
                        : `${day} ${formatHour(hour)}: No uploads`
                      }
                    >
                      {cell && cell.videoCount > 0 && (
                        <div className="absolute inset-0 flex items-center justify-center text-[8px] text-[#e5e4dd] font-bold">
                          {cell.videoCount}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 text-[10px] text-[#888]">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm" style={{ background: 'rgba(255, 255, 255, 0.02)' }} />
          No uploads
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm" style={{ background: 'rgba(0, 255, 136, 0.2)' }} />
          Low views
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm" style={{ background: 'rgba(0, 255, 136, 0.7)' }} />
          High views
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm border-2 border-[#00ff88]" />
          Best slot
        </div>
      </div>
    </div>
  );
}
