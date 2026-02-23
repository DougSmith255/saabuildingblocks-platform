import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthenticatedClients, getTokens } from '@/lib/youtube/client';
import { getCached, setCache, CACHE_TTL } from '@/lib/youtube/cache';
import type { YouTubeChannel } from '@/lib/youtube/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if connected at all
    const tokens = await getTokens(user.id);
    if (!tokens) {
      return NextResponse.json({ connected: false });
    }

    // Check cache
    const cacheKey = `channel:${user.id}`;
    const cached = getCached<YouTubeChannel>(cacheKey);
    if (cached) {
      return NextResponse.json({ connected: true, channel: cached });
    }

    const clients = await getAuthenticatedClients(user.id);
    if (!clients) {
      return NextResponse.json({ connected: false, error: 'Token expired or revoked' });
    }

    const response = await clients.youtube.channels.list({
      part: ['snippet', 'statistics'],
      mine: true,
    });

    const channel = response.data.items?.[0];
    if (!channel) {
      return NextResponse.json({ connected: true, error: 'No channel found' });
    }

    const channelData: YouTubeChannel = {
      id: channel.id!,
      title: channel.snippet?.title || '',
      description: channel.snippet?.description || '',
      thumbnailUrl: channel.snippet?.thumbnails?.default?.url || '',
      subscriberCount: parseInt(channel.statistics?.subscriberCount || '0', 10),
      viewCount: parseInt(channel.statistics?.viewCount || '0', 10),
      videoCount: parseInt(channel.statistics?.videoCount || '0', 10),
      hiddenSubscriberCount: channel.statistics?.hiddenSubscriberCount || false,
    };

    setCache(cacheKey, channelData, CACHE_TTL.CHANNEL);

    return NextResponse.json({ connected: true, channel: channelData });
  } catch (error) {
    console.error('[YouTube Channel] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch channel data' }, { status: 500 });
  }
}
