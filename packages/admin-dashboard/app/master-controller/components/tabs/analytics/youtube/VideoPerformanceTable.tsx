'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { Loader2, ChevronDown, ChevronUp, ChevronsUpDown, Pencil, Image as ImageIcon, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { useYouTubeStore } from '@/app/master-controller/stores/youtubeStore';
import type { YouTubeVideo, PrivacyStatus } from '@/lib/youtube/types';

type SortKey = 'publishedAt' | 'viewCount' | 'likeCount' | 'commentCount' | 'durationSeconds';
type SortDir = 'asc' | 'desc';

const PAGE_SIZE = 20;

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ChevronsUpDown className="w-3 h-3 text-[#555]" />;
  return dir === 'asc'
    ? <ChevronUp className="w-3 h-3 text-[#ffd700]" />
    : <ChevronDown className="w-3 h-3 text-[#ffd700]" />;
}

function PrivacyBadge({ status }: { status: PrivacyStatus }) {
  const config = {
    public: { label: 'Public', color: '#00ff88', bg: 'rgba(0, 255, 136, 0.1)', border: 'rgba(0, 255, 136, 0.25)' },
    unlisted: { label: 'Unlisted', color: '#ffd700', bg: 'rgba(255, 215, 0, 0.1)', border: 'rgba(255, 215, 0, 0.25)' },
    private: { label: 'Private', color: '#ff6b6b', bg: 'rgba(255, 107, 107, 0.1)', border: 'rgba(255, 107, 107, 0.25)' },
  }[status];

  return (
    <span
      className="px-1.5 py-0.5 rounded text-[10px] font-medium"
      style={{ color: config.color, background: config.bg, border: `1px solid ${config.border}` }}
    >
      {config.label}
    </span>
  );
}

interface VideoPerformanceTableProps {
  onEditVideo?: (video: YouTubeVideo) => void;
  onEditThumbnail?: (video: YouTubeVideo) => void;
}

export function VideoPerformanceTable({ onEditVideo, onEditThumbnail }: VideoPerformanceTableProps) {
  const { videos, videosLoading, videosError, fetchVideos } = useYouTubeStore();

  // Combined sort state to avoid the broken nested-setState issue
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: 'publishedAt', dir: 'desc' });
  const [page, setPage] = useState(1);
  const [privacyFilter, setPrivacyFilter] = useState<PrivacyStatus | 'all'>('public');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // Reset page when filters or sort change
  useEffect(() => {
    setPage(1);
  }, [privacyFilter, sort.key, sort.dir]);

  // Single atomic sort handler — no nested setState
  const handleSort = useCallback((key: SortKey) => {
    setSort(prev => ({
      key,
      dir: prev.key === key ? (prev.dir === 'desc' ? 'asc' : 'desc') : 'desc',
    }));
  }, []);

  // Filter out shorts and apply privacy filter
  const filteredVideos = useMemo(() => {
    if (!videos || videos.length === 0) return [];
    return videos.filter(v => {
      if (v.isShort) return false;
      const privacyMatch = privacyFilter === 'all' || v.privacyStatus === privacyFilter;
      return privacyMatch;
    });
  }, [videos, privacyFilter]);

  // Sort
  const sortedVideos = useMemo(() => {
    const sorted = [...filteredVideos];
    sorted.sort((a, b) => {
      let cmp = 0;
      if (sort.key === 'publishedAt') {
        cmp = new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
      } else {
        cmp = (a[sort.key] as number) - (b[sort.key] as number);
      }
      return sort.dir === 'asc' ? cmp : -cmp;
    });
    return sorted;
  }, [filteredVideos, sort.key, sort.dir]);

  // Paginate
  const totalPages = Math.max(1, Math.ceil(sortedVideos.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedVideos = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return sortedVideos.slice(start, start + PAGE_SIZE);
  }, [sortedVideos, safePage]);

  // Privacy counts (excluding shorts)
  const privacyCounts = useMemo(() => {
    const longForm = videos.filter(v => !v.isShort);
    return {
      all: longForm.length,
      public: longForm.filter(v => v.privacyStatus === 'public').length,
      unlisted: longForm.filter(v => v.privacyStatus === 'unlisted').length,
      private: longForm.filter(v => v.privacyStatus === 'private').length,
    };
  }, [videos]);

  if (videosLoading) {
    return (
      <div
        className="p-8 rounded-lg border text-center"
        style={{ background: 'rgba(64, 64, 64, 0.2)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
      >
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#ffd700]" />
        <p className="text-[#888] text-sm">Loading videos...</p>
      </div>
    );
  }

  if (videosError) {
    return (
      <div
        className="p-6 rounded-lg border"
        style={{ background: 'rgba(255, 107, 107, 0.1)', borderColor: 'rgba(255, 107, 107, 0.3)' }}
      >
        <p className="text-[#ff6b6b] text-sm">{videosError}</p>
        <button onClick={() => fetchVideos()} className="mt-2 text-xs text-[#ff6b6b] underline">Retry</button>
      </div>
    );
  }

  const columns: { key: SortKey; label: string; align?: string }[] = [
    { key: 'publishedAt', label: 'Published' },
    { key: 'viewCount', label: 'Views', align: 'right' },
    { key: 'durationSeconds', label: 'Duration', align: 'right' },
    { key: 'likeCount', label: 'Likes', align: 'right' },
    { key: 'commentCount', label: 'Comments', align: 'right' },
  ];

  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{ background: 'rgba(64, 64, 64, 0.3)', borderColor: 'rgba(255, 215, 0, 0.15)' }}
    >
      {/* Header with Content Tabs */}
      <div className="p-4 border-b flex items-center justify-between flex-wrap gap-3" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-[#e5e4dd]">Video Performance</h3>
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors"
          style={{
            background: showFilters || privacyFilter !== 'all' ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            color: showFilters || privacyFilter !== 'all' ? '#ffd700' : '#888',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Filter className="w-3 h-3" />
          Filters
          {privacyFilter !== 'all' && <span className="w-1.5 h-1.5 rounded-full bg-[#ffd700]" />}
        </button>
      </div>

      {/* Filter Bar */}
      {showFilters && (
        <div className="px-4 py-3 border-b flex items-center gap-2 flex-wrap" style={{ borderColor: 'rgba(255, 255, 255, 0.08)', background: 'rgba(0, 0, 0, 0.15)' }}>
          <span className="text-xs text-[#888]">Visibility:</span>
          {([
            { key: 'all' as const, label: 'All', count: privacyCounts.all },
            { key: 'public' as const, label: 'Public', count: privacyCounts.public },
            { key: 'unlisted' as const, label: 'Unlisted', count: privacyCounts.unlisted },
            { key: 'private' as const, label: 'Private', count: privacyCounts.private },
          ]).map(f => (
            <button
              key={f.key}
              onClick={() => setPrivacyFilter(f.key)}
              className="px-2.5 py-1 rounded text-xs font-medium transition-colors"
              style={{
                background: privacyFilter === f.key ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                color: privacyFilter === f.key ? '#ffd700' : '#dcdbd5',
                border: privacyFilter === f.key ? '1px solid rgba(255, 215, 0, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>
      )}

      {/* Table */}
      {pagedVideos.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-[#888]">No videos found{privacyFilter !== 'all' ? ` with "${privacyFilter}" visibility` : ''}</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'rgba(0, 0, 0, 0.3)' }}>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#ffd700] w-12" />
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#ffd700]">Title</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#ffd700]">Status</th>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={`px-4 py-3 text-xs font-semibold text-[#ffd700] cursor-pointer select-none whitespace-nowrap ${col.align === 'right' ? 'text-right' : 'text-left'}`}
                      onClick={() => handleSort(col.key)}
                    >
                      <div className={`inline-flex items-center gap-1 ${col.align === 'right' ? 'flex-row-reverse' : ''}`}>
                        {col.label}
                        <SortIcon active={sort.key === col.key} dir={sort.dir} />
                      </div>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-xs font-semibold text-[#ffd700] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedVideos.map((video) => (
                  <tr
                    key={video.id}
                    className="border-t transition-colors hover:bg-[rgba(255,255,255,0.03)]"
                    style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}
                  >
                    <td className="px-4 py-3">
                      {video.thumbnailUrl && (
                        <img
                          src={video.thumbnailUrl}
                          alt=""
                          className="w-16 h-9 object-cover rounded"
                          loading="lazy"
                        />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-[#e5e4dd] font-medium line-clamp-1 max-w-[300px]">
                        {video.title}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <PrivacyBadge status={video.privacyStatus} />
                    </td>
                    <td className="px-4 py-3 text-sm text-[#dcdbd5] whitespace-nowrap">
                      {formatDate(video.publishedAt)}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#dcdbd5] text-right">
                      {formatCompact(video.viewCount)}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#dcdbd5] text-right">
                      {formatDuration(video.durationSeconds)}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#dcdbd5] text-right">
                      {formatCompact(video.likeCount)}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#dcdbd5] text-right">
                      {formatCompact(video.commentCount)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {onEditVideo && (
                          <button
                            onClick={() => onEditVideo(video)}
                            className="p-1.5 rounded transition-colors hover:bg-[rgba(255,215,0,0.1)]"
                            title="Edit video"
                          >
                            <Pencil className="w-3.5 h-3.5 text-[#ffd700]" />
                          </button>
                        )}
                        {onEditThumbnail && (
                          <button
                            onClick={() => onEditThumbnail(video)}
                            className="p-1.5 rounded transition-colors hover:bg-[rgba(0,255,136,0.1)]"
                            title="Upload thumbnail"
                          >
                            <ImageIcon className="w-3.5 h-3.5 text-[#00ff88]" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t flex items-center justify-between" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
            <span className="text-xs text-[#888]">
              Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, sortedVideos.length)} of {sortedVideos.length} videos
            </span>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="p-1.5 rounded transition-colors disabled:opacity-30"
                  style={{ color: '#dcdbd5', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                  .map((p, idx, arr) => {
                    const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
                    return (
                      <span key={p} className="flex items-center">
                        {showEllipsis && <span className="px-1 text-xs text-[#555]">...</span>}
                        <button
                          onClick={() => setPage(p)}
                          className="min-w-[28px] h-7 rounded text-xs font-medium transition-colors"
                          style={{
                            background: safePage === p ? 'rgba(255, 215, 0, 0.2)' : 'transparent',
                            color: safePage === p ? '#ffd700' : '#888',
                            border: safePage === p ? '1px solid rgba(255, 215, 0, 0.3)' : '1px solid transparent',
                          }}
                        >
                          {p}
                        </button>
                      </span>
                    );
                  })}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className="p-1.5 rounded transition-colors disabled:opacity-30"
                  style={{ color: '#dcdbd5', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
