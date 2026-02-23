import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { YouTubeChannel, YouTubeVideo, DailyMetric, DateRange } from '@/lib/youtube/types';

interface YouTubeStore {
  // Connection
  isConnected: boolean;
  channelData: YouTubeChannel | null;
  connectionLoading: boolean;
  connectionError: string | null;

  // Videos
  videos: YouTubeVideo[];
  videosLoading: boolean;
  videosError: string | null;

  // Analytics
  dailyMetrics: DailyMetric[];
  analyticsLoading: boolean;
  analyticsError: string | null;

  // Preferences
  dateRange: DateRange;
  selectedVideoId: string | null;

  // Actions
  setDateRange: (range: DateRange) => void;
  setSelectedVideoId: (id: string | null) => void;
  fetchChannel: () => Promise<void>;
  fetchVideos: () => Promise<void>;
  fetchAnalytics: (range?: DateRange, videoId?: string) => Promise<void>;
  disconnect: () => Promise<void>;
  reset: () => void;
}

export const useYouTubeStore = create<YouTubeStore>()(
  persist(
    (set, get) => ({
      // Initial state
      isConnected: false,
      channelData: null,
      connectionLoading: true,
      connectionError: null,

      videos: [],
      videosLoading: false,
      videosError: null,

      dailyMetrics: [],
      analyticsLoading: false,
      analyticsError: null,

      dateRange: '28d',
      selectedVideoId: null,

      setDateRange: (range) => set({ dateRange: range }),
      setSelectedVideoId: (id) => set({ selectedVideoId: id }),

      fetchChannel: async () => {
        set({ connectionLoading: true, connectionError: null });
        try {
          const res = await fetch('/api/youtube/channel');
          const json = await res.json();
          if (!res.ok) throw new Error(json.error || 'Failed to check connection');

          set({
            isConnected: json.connected === true && !json.error,
            channelData: json.channel || null,
            connectionLoading: false,
          });
        } catch (err) {
          set({
            connectionLoading: false,
            connectionError: err instanceof Error ? err.message : 'Connection check failed',
          });
        }
      },

      fetchVideos: async () => {
        set({ videosLoading: true, videosError: null });
        try {
          const res = await fetch('/api/youtube/videos');
          const json = await res.json();
          if (!res.ok) throw new Error(json.error || 'Failed to fetch videos');
          set({ videos: json.videos || [], videosLoading: false });
        } catch (err) {
          set({
            videosLoading: false,
            videosError: err instanceof Error ? err.message : 'Failed to fetch videos',
          });
        }
      },

      fetchAnalytics: async (range?: DateRange, videoId?: string) => {
        const dateRange = range || get().dateRange;
        set({ analyticsLoading: true, analyticsError: null });
        try {
          const params = new URLSearchParams({ range: dateRange });
          if (videoId) params.set('videoId', videoId);

          const res = await fetch(`/api/youtube/analytics?${params}`);
          const json = await res.json();
          if (!res.ok) throw new Error(json.error || 'Failed to fetch analytics');
          set({ dailyMetrics: json.metrics || [], analyticsLoading: false });
        } catch (err) {
          set({
            analyticsLoading: false,
            analyticsError: err instanceof Error ? err.message : 'Failed to fetch analytics',
          });
        }
      },

      disconnect: async () => {
        try {
          await fetch('/api/youtube/disconnect', { method: 'POST' });
        } catch {
          // Continue with local cleanup
        }
        set({
          isConnected: false,
          channelData: null,
          videos: [],
          dailyMetrics: [],
          selectedVideoId: null,
          connectionError: null,
          videosError: null,
          analyticsError: null,
        });
      },

      reset: () => set({
        isConnected: false,
        channelData: null,
        connectionLoading: true,
        connectionError: null,
        videos: [],
        videosLoading: false,
        videosError: null,
        dailyMetrics: [],
        analyticsLoading: false,
        analyticsError: null,
        selectedVideoId: null,
      }),
    }),
    {
      name: 'youtube-preferences',
      partialize: (state) => ({
        dateRange: state.dateRange,
      }),
    }
  )
);
