import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthenticatedClients } from '@/lib/youtube/client';
import { getCached, setCache, CACHE_TTL } from '@/lib/youtube/cache';
import type { UploadPattern, YouTubeVideo } from '@/lib/youtube/types';

export const dynamic = 'force-dynamic';

function parseDuration(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  return parseInt(match[1] || '0', 10) * 3600 + parseInt(match[2] || '0', 10) * 60 + parseInt(match[3] || '0', 10);
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check cache
    const cacheKey = `schedule:${user.id}`;
    const cached = getCached<{ patterns: UploadPattern[]; bestSlot: { day: number; hour: number } | null }>(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    const clients = await getAuthenticatedClients(user.id);
    if (!clients) {
      return NextResponse.json({ error: 'Not connected' }, { status: 401 });
    }

    // Get channel uploads playlist
    const channelRes = await clients.youtube.channels.list({
      part: ['contentDetails'],
      mine: true,
    });

    const channelId = channelRes.data.items?.[0]?.id;
    if (!channelId) {
      return NextResponse.json({ error: 'No channel found' }, { status: 404 });
    }

    const uploadsPlaylistId = 'UU' + channelId.substring(2);

    // Fetch all video IDs
    const videoIds: string[] = [];
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
          videoIds.push(item.contentDetails.videoId);
        }
      }
      pageToken = playlistRes.data.nextPageToken || undefined;
    } while (pageToken);

    // Batch fetch video details
    const videos: YouTubeVideo[] = [];
    for (let i = 0; i < videoIds.length; i += 50) {
      const batch = videoIds.slice(i, i + 50);
      const detailsRes = await clients.youtube.videos.list({
        part: ['snippet', 'statistics', 'contentDetails'],
        id: batch,
      });

      for (const item of detailsRes.data.items || []) {
        const durationSeconds = parseDuration(item.contentDetails?.duration || 'PT0S');
        videos.push({
          id: item.id!,
          title: item.snippet?.title || '',
          description: '',
          publishedAt: item.snippet?.publishedAt || '',
          thumbnailUrl: '',
          duration: item.contentDetails?.duration || 'PT0S',
          durationSeconds,
          viewCount: parseInt(item.statistics?.viewCount || '0', 10),
          likeCount: parseInt(item.statistics?.likeCount || '0', 10),
          commentCount: parseInt(item.statistics?.commentCount || '0', 10),
          tags: [],
          categoryId: '',
          privacyStatus: 'public',
          isShort: durationSeconds <= 180,
        });
      }
    }

    // Analyze publish patterns
    const slotMap = new Map<string, { dayOfWeek: number; hour: number; views: number[]; watchTimes: number[] }>();

    for (const video of videos) {
      if (!video.publishedAt) continue;
      const pubDate = new Date(video.publishedAt);
      const dayOfWeek = pubDate.getUTCDay();
      const hour = pubDate.getUTCHours();
      const key = `${dayOfWeek}-${hour}`;

      if (!slotMap.has(key)) {
        slotMap.set(key, { dayOfWeek, hour, views: [], watchTimes: [] });
      }
      const slot = slotMap.get(key)!;
      slot.views.push(video.viewCount);
      slot.watchTimes.push(video.durationSeconds * video.viewCount / 60); // estimated watch minutes
    }

    const patterns: UploadPattern[] = [];
    for (const slot of slotMap.values()) {
      const avgViews = slot.views.reduce((a, b) => a + b, 0) / slot.views.length;
      const avgWatchTime = slot.watchTimes.reduce((a, b) => a + b, 0) / slot.watchTimes.length;
      patterns.push({
        dayOfWeek: slot.dayOfWeek,
        hour: slot.hour,
        videoCount: slot.views.length,
        avgViews: Math.round(avgViews),
        avgWatchTime: Math.round(avgWatchTime),
      });
    }

    // Find best slot (highest avg views among slots with at least 2 videos)
    const qualifiedSlots = patterns.filter(p => p.videoCount >= 2);
    const bestSlot = qualifiedSlots.length > 0
      ? qualifiedSlots.sort((a, b) => b.avgViews - a.avgViews)[0]
      : patterns.length > 0
        ? patterns.sort((a, b) => b.avgViews - a.avgViews)[0]
        : null;

    const result = {
      patterns,
      bestSlot: bestSlot ? { day: bestSlot.dayOfWeek, hour: bestSlot.hour } : null,
    };

    setCache(cacheKey, result, CACHE_TTL.VIDEOS);

    return NextResponse.json(result);
  } catch (error) {
    console.error('[YouTube Schedule] Error:', error);
    return NextResponse.json({ error: 'Failed to analyze upload schedule' }, { status: 500 });
  }
}
