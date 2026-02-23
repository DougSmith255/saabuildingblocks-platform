'use client';

import { useMemo } from 'react';
import { Image as ImageIcon, TrendingUp } from 'lucide-react';
import { useYouTubeStore } from '@/app/master-controller/stores/youtubeStore';

function getCtrColor(ctr: number): string {
  if (ctr >= 5) return '#00ff88';
  if (ctr >= 2) return '#ffd700';
  return '#ff6b6b';
}

function getCtrLabel(ctr: number): string {
  if (ctr >= 5) return 'Good';
  if (ctr >= 2) return 'Average';
  return 'Low';
}

export function ThumbnailAudit() {
  const { videos } = useYouTubeStore();

  // Exclude shorts — thumbnail audit is only relevant for long-form videos
  const longFormVideos = useMemo(() => videos.filter(v => !v.isShort), [videos]);

  // Sort videos by view count (as proxy for impressions since we don't have impression data per-video from Data API)
  const sortedVideos = useMemo(() => {
    return [...longFormVideos]
      .filter(v => v.thumbnailUrl)
      .sort((a, b) => b.viewCount - a.viewCount);
  }, [longFormVideos]);

  // Identify optimization opportunities: high views but relatively low engagement ratio
  const avgEngagement = useMemo(() => {
    if (longFormVideos.length === 0) return 0;
    const totalLikes = longFormVideos.reduce((s, v) => s + v.likeCount, 0);
    const totalViews = longFormVideos.reduce((s, v) => s + v.viewCount, 0);
    return totalViews > 0 ? (totalLikes / totalViews) * 100 : 0;
  }, [longFormVideos]);

  if (longFormVideos.length === 0) {
    return null;
  }

  return (
    <div
      className="p-6 rounded-lg border"
      style={{
        background: 'rgba(64, 64, 64, 0.3)',
        borderColor: 'rgba(0, 255, 136, 0.15)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-[#e5e4dd] flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-[#00ff88]" />
          Thumbnail Audit
        </h3>
        <span className="text-xs text-[#888]">Sorted by views (highest first)</span>
      </div>

      {/* Optimization Opportunities */}
      {sortedVideos.some(v => v.viewCount > 100 && (v.likeCount / Math.max(v.viewCount, 1)) * 100 < avgEngagement * 0.5) && (
        <div
          className="mb-4 p-3 rounded-lg border flex items-start gap-2"
          style={{
            background: 'rgba(255, 215, 0, 0.05)',
            borderColor: 'rgba(255, 215, 0, 0.2)',
          }}
        >
          <TrendingUp className="w-4 h-4 text-[#ffd700] mt-0.5 shrink-0" />
          <div className="text-xs text-[#dcdbd5]">
            <strong className="text-[#ffd700]">Optimization Opportunity:</strong>{' '}
            Some high-view videos have low engagement — consider testing new thumbnails.
          </div>
        </div>
      )}

      {/* Thumbnail Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedVideos.slice(0, 12).map((video) => {
          const engagementRate = video.viewCount > 0
            ? (video.likeCount / video.viewCount) * 100
            : 0;
          const ctrColor = getCtrColor(engagementRate);
          const ctrLabel = getCtrLabel(engagementRate);

          return (
            <div
              key={video.id}
              className="rounded-lg border overflow-hidden transition-all hover:border-[rgba(255,255,255,0.2)]"
              style={{
                background: 'rgba(0, 0, 0, 0.2)',
                borderColor: 'rgba(255, 255, 255, 0.08)',
              }}
            >
              {/* Thumbnail with CTR overlay */}
              <div className="relative aspect-video">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Engagement badge overlay */}
                <div
                  className="absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-bold"
                  style={{
                    background: `${ctrColor}22`,
                    color: ctrColor,
                    border: `1px solid ${ctrColor}44`,
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  {engagementRate.toFixed(1)}% {ctrLabel}
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <div className="text-sm text-[#e5e4dd] font-medium line-clamp-2 mb-2">
                  {video.title}
                </div>
                <div className="flex items-center justify-between text-xs text-[#888]">
                  <span>{video.viewCount.toLocaleString()} views</span>
                  <span>{video.likeCount.toLocaleString()} likes</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
