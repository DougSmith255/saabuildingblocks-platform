import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthenticatedClients, getTokens } from '@/lib/youtube/client';
import { getCached, setCache, CACHE_TTL } from '@/lib/youtube/cache';
import type { RetentionDataPoint } from '@/lib/youtube/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');

    if (!videoId) {
      return NextResponse.json({ error: 'videoId parameter required' }, { status: 400 });
    }

    // Check cache
    const cacheKey = `retention:${user.id}:${videoId}`;
    const cached = getCached<RetentionDataPoint[]>(cacheKey);
    if (cached) {
      return NextResponse.json({ retention: cached });
    }

    const tokens = await getTokens(user.id);
    if (!tokens?.channel_id) {
      return NextResponse.json({ error: 'No channel connected' }, { status: 400 });
    }

    const clients = await getAuthenticatedClients(user.id);
    if (!clients) {
      return NextResponse.json({ error: 'Not connected' }, { status: 401 });
    }

    // Query audience retention data
    const analyticsRes = await clients.youtubeAnalytics.reports.query({
      ids: `channel==${tokens.channel_id}`,
      startDate: '2020-01-01',
      endDate: new Date().toISOString().split('T')[0],
      metrics: 'audienceWatchRatio',
      dimensions: 'elapsedVideoTimeRatio',
      filters: `video==${videoId}`,
      sort: 'elapsedVideoTimeRatio',
    });

    const columnHeaders = analyticsRes.data.columnHeaders || [];
    const rows = analyticsRes.data.rows || [];

    const retention: RetentionDataPoint[] = rows.map((row: (string | number)[]) => {
      const entry: Record<string, number> = {};
      columnHeaders.forEach((header: { name?: string | null }, idx: number) => {
        if (header.name) {
          entry[header.name] = Number(row[idx]);
        }
      });
      return {
        elapsedVideoTimeRatio: entry.elapsedVideoTimeRatio || 0,
        audienceWatchRatio: entry.audienceWatchRatio || 0,
      };
    });

    setCache(cacheKey, retention, CACHE_TTL.RETENTION);

    return NextResponse.json({ retention });
  } catch (error) {
    console.error('[YouTube Retention] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch retention data' }, { status: 500 });
  }
}
