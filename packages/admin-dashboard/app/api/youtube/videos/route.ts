import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthenticatedClients } from '@/lib/youtube/client';
import { getCached, setCache, CACHE_TTL } from '@/lib/youtube/cache';
import type { YouTubeVideo } from '@/lib/youtube/types';

export const dynamic = 'force-dynamic';

function parseDuration(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check cache
    const cacheKey = `videos:${user.id}`;
    const cached = getCached<YouTubeVideo[]>(cacheKey);
    if (cached) {
      return NextResponse.json({ videos: cached });
    }

    const clients = await getAuthenticatedClients(user.id);
    if (!clients) {
      return NextResponse.json({ error: 'Not connected' }, { status: 401 });
    }

    // Get channel ID to derive uploads playlist
    const channelRes = await clients.youtube.channels.list({
      part: ['contentDetails'],
      mine: true,
    });

    const channelId = channelRes.data.items?.[0]?.id;
    if (!channelId) {
      return NextResponse.json({ error: 'No channel found' }, { status: 404 });
    }

    // Optimization: uploads playlist ID = channel ID with "UC" → "UU"
    const uploadsPlaylistId = 'UU' + channelId.substring(2);

    // Fetch all video IDs from uploads playlist (paginated)
    const videoIdSet = new Set<string>();
    let pageToken: string | undefined;

    do {
      const playlistRes = await clients.youtube.playlistItems.list({
        part: ['contentDetails'],
        playlistId: uploadsPlaylistId,
        maxResults: 50,
        pageToken,
      });

      for (const item of playlistRes.data.items || []) {
        if (item.contentDetails?.videoId) {
          videoIdSet.add(item.contentDetails.videoId);
        }
      }
      pageToken = playlistRes.data.nextPageToken || undefined;
    } while (pageToken);

    const videoIds = Array.from(videoIdSet);

    if (videoIds.length === 0) {
      setCache(cacheKey, [], CACHE_TTL.VIDEOS);
      return NextResponse.json({ videos: [] });
    }

    // Batch fetch video details (50 per request)
    const videos: YouTubeVideo[] = [];

    for (let i = 0; i < videoIds.length; i += 50) {
      const batch = videoIds.slice(i, i + 50);
      const detailsRes = await clients.youtube.videos.list({
        part: ['snippet', 'contentDetails', 'statistics', 'status'],
        id: batch,
      });

      for (const item of detailsRes.data.items || []) {
        const duration = item.contentDetails?.duration || 'PT0S';
        const durationSeconds = parseDuration(duration);
        const privacyStatus = (item.status?.privacyStatus as 'public' | 'unlisted' | 'private') || 'public';
        // Shorts can be up to 3 minutes (180s) since YouTube's 2024 limit increase.
        // YouTube doesn't expose an explicit isShort flag, so we use duration + title heuristic.
        const isShort = durationSeconds <= 180 || (item.snippet?.title?.toLowerCase().includes('#shorts') ?? false);
        videos.push({
          id: item.id!,
          title: item.snippet?.title || '',
          description: item.snippet?.description || '',
          publishedAt: item.snippet?.publishedAt || '',
          thumbnailUrl: item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || '',
          duration,
          durationSeconds,
          viewCount: parseInt(item.statistics?.viewCount || '0', 10),
          likeCount: parseInt(item.statistics?.likeCount || '0', 10),
          commentCount: parseInt(item.statistics?.commentCount || '0', 10),
          tags: item.snippet?.tags || [],
          categoryId: item.snippet?.categoryId || '',
          privacyStatus,
          isShort,
        });
      }
    }

    // Sort by publish date (newest first)
    videos.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    setCache(cacheKey, videos, CACHE_TTL.VIDEOS);

    return NextResponse.json({ videos });
  } catch (error) {
    console.error('[YouTube Videos] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
  }
}
