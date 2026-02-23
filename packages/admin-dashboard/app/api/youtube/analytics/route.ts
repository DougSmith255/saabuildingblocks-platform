import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthenticatedClients, getTokens } from '@/lib/youtube/client';
import { getCached, setCache, CACHE_TTL } from '@/lib/youtube/cache';
import type { DailyMetric } from '@/lib/youtube/types';

export const dynamic = 'force-dynamic';

function getDateRange(range: string): { startDate: string; endDate: string } {
  const end = new Date();
  const start = new Date();
  switch (range) {
    case '7d':
      start.setDate(end.getDate() - 7);
      break;
    case '90d':
      start.setDate(end.getDate() - 90);
      break;
    default: // 28d
      start.setDate(end.getDate() - 28);
  }
  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0],
  };
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '28d';
    const videoId = searchParams.get('videoId') || undefined;
    const metrics = searchParams.get('metrics') ||
      'views,estimatedMinutesWatched,subscribersGained,subscribersLost,likes,shares';

    const { startDate, endDate } = getDateRange(range);

    // Check cache
    const cacheKey = `analytics:${user.id}:${range}:${videoId || 'all'}:${metrics}`;
    const cached = getCached<DailyMetric[]>(cacheKey);
    if (cached) {
      return NextResponse.json({ metrics: cached, range, startDate, endDate });
    }

    // Get channel ID from stored tokens
    const tokens = await getTokens(user.id);
    if (!tokens?.channel_id) {
      return NextResponse.json({ error: 'No channel connected' }, { status: 400 });
    }

    const clients = await getAuthenticatedClients(user.id);
    if (!clients) {
      return NextResponse.json({ error: 'Not connected' }, { status: 401 });
    }

    const queryParams: Record<string, string> = {
      ids: `channel==${tokens.channel_id}`,
      startDate,
      endDate,
      metrics,
      dimensions: 'day',
      sort: 'day',
    };

    if (videoId) {
      queryParams.filters = `video==${videoId}`;
    }

    const analyticsRes = await clients.youtubeAnalytics.reports.query(queryParams);

    const columnHeaders = analyticsRes.data.columnHeaders || [];
    const rows = analyticsRes.data.rows || [];

    const dailyMetrics: DailyMetric[] = rows.map((row: (string | number)[]) => {
      const entry: Record<string, string | number> = {};
      columnHeaders.forEach((header: { name?: string | null }, idx: number) => {
        if (header.name) {
          entry[header.name] = row[idx];
        }
      });
      return {
        date: entry.day as string,
        views: (entry.views as number) || 0,
        estimatedMinutesWatched: (entry.estimatedMinutesWatched as number) || 0,
        subscribersGained: (entry.subscribersGained as number) || 0,
        subscribersLost: (entry.subscribersLost as number) || 0,
        likes: (entry.likes as number) || 0,
        shares: (entry.shares as number) || 0,
      };
    });

    setCache(cacheKey, dailyMetrics, CACHE_TTL.ANALYTICS);

    return NextResponse.json({ metrics: dailyMetrics, range, startDate, endDate });
  } catch (error) {
    console.error('[YouTube Analytics] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
