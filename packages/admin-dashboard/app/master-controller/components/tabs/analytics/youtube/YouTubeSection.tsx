'use client';

import { useEffect, useState } from 'react';
import { Loader2, AlertTriangle, LogOut, Youtube } from 'lucide-react';
import { useYouTubeStore } from '@/app/master-controller/stores/youtubeStore';
import { YouTubeConnectPrompt } from './YouTubeConnectPrompt';
import { ChannelOverview } from './ChannelOverview';
import { VideoPerformanceTable } from './VideoPerformanceTable';
import { ThumbnailAudit } from './ThumbnailAudit';
import { ContentDiagnostics } from './ContentDiagnostics';
import { UploadSchedule } from './UploadSchedule';
import { KeywordSEO } from './KeywordSEO';
import { VideoEditModal } from './VideoEditModal';
import { ThumbnailUploadModal } from './ThumbnailUploadModal';
import type { YouTubeVideo } from '@/lib/youtube/types';

export function YouTubeSection() {
  const {
    isConnected,
    channelData,
    connectionLoading,
    connectionError,
    fetchChannel,
    fetchVideos,
    disconnect,
  } = useYouTubeStore();

  const [editingVideo, setEditingVideo] = useState<YouTubeVideo | null>(null);
  const [thumbnailVideo, setThumbnailVideo] = useState<YouTubeVideo | null>(null);

  useEffect(() => {
    fetchChannel();
  }, [fetchChannel]);

  if (connectionLoading) {
    return (
      <div className="p-12 rounded-lg border text-center" style={{
        background: 'rgba(64, 64, 64, 0.2)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
      }}>
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-[#ff0000]" />
        <p className="text-[#dcdbd5]">Checking YouTube connection...</p>
      </div>
    );
  }

  if (connectionError) {
    return (
      <div className="p-6 rounded-lg border" style={{
        background: 'rgba(255, 107, 107, 0.1)',
        borderColor: 'rgba(255, 107, 107, 0.3)',
      }}>
        <div className="flex items-center gap-2 text-[#ff6b6b]">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-medium">Connection Error</span>
        </div>
        <p className="text-[#dcdbd5] text-sm mt-2">{connectionError}</p>
        <button
          onClick={() => fetchChannel()}
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
    );
  }

  if (!isConnected) {
    return <YouTubeConnectPrompt />;
  }

  return (
    <div className="space-y-6">
      {/* Connected Header */}
      <div
        className="p-4 rounded-lg border flex items-center justify-between"
        style={{
          background: 'rgba(64, 64, 64, 0.3)',
          borderColor: 'rgba(255, 0, 0, 0.2)',
        }}
      >
        <div className="flex items-center gap-3">
          <Youtube className="w-5 h-5 text-[#ff0000]" />
          <div>
            <span className="text-[#e5e4dd] font-medium">
              {channelData?.title || 'YouTube Channel'}
            </span>
            <span className="text-[#888] text-sm ml-2">Connected</span>
          </div>
        </div>
        <button
          onClick={disconnect}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition-colors"
          style={{
            color: '#ff6b6b',
            border: '1px solid rgba(255, 107, 107, 0.3)',
            background: 'rgba(255, 107, 107, 0.1)',
          }}
        >
          <LogOut className="w-3.5 h-3.5" />
          Disconnect
        </button>
      </div>

      {/* Dashboard Sections */}
      <ChannelOverview />
      <VideoPerformanceTable
        onEditVideo={setEditingVideo}
        onEditThumbnail={setThumbnailVideo}
      />
      <ThumbnailAudit />
      <ContentDiagnostics />
      <UploadSchedule />
      <KeywordSEO />

      {/* Modals */}
      {editingVideo && (
        <VideoEditModal
          video={editingVideo}
          onClose={() => setEditingVideo(null)}
          onSaved={() => fetchVideos()}
        />
      )}
      {thumbnailVideo && (
        <ThumbnailUploadModal
          video={thumbnailVideo}
          onClose={() => setThumbnailVideo(null)}
          onUploaded={() => fetchVideos()}
        />
      )}
    </div>
  );
}
