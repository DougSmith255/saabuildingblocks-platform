export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  hiddenSubscriberCount: boolean;
}

export type PrivacyStatus = 'public' | 'unlisted' | 'private';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl: string;
  duration: string; // ISO 8601 duration
  durationSeconds: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  tags: string[];
  categoryId: string;
  privacyStatus: PrivacyStatus;
  isShort: boolean;
}

export interface YouTubeVideoAnalytics {
  videoId: string;
  views: number;
  estimatedMinutesWatched: number;
  averageViewDuration: number;
  averageViewPercentage: number;
  impressions: number;
  impressionsCtr: number;
  likes: number;
  comments: number;
  shares: number;
  subscribersGained: number;
  subscribersLost: number;
}

export interface RetentionDataPoint {
  elapsedVideoTimeRatio: number;
  audienceWatchRatio: number;
}

export interface DailyMetric {
  date: string;
  views: number;
  estimatedMinutesWatched: number;
  subscribersGained: number;
  subscribersLost: number;
  likes: number;
  shares: number;
}

export interface SearchTerm {
  term: string;
  views: number;
  estimatedMinutesWatched: number;
}

export interface TrafficSource {
  source: string;
  views: number;
  estimatedMinutesWatched: number;
}

export interface UploadPattern {
  dayOfWeek: number; // 0=Sun, 6=Sat
  hour: number; // 0-23
  videoCount: number;
  avgViews: number;
  avgWatchTime: number;
}

export interface YouTubeTokens {
  id: string;
  user_id: string;
  encrypted_access_token: string;
  encrypted_refresh_token: string;
  token_expires_at: string;
  channel_id: string | null;
  channel_title: string | null;
  channel_thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
}

export type DateRange = '7d' | '28d' | '90d';
