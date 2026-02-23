import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthenticatedClients, getTokens } from '@/lib/youtube/client';
import { getCached, setCache, CACHE_TTL } from '@/lib/youtube/cache';
import type { SearchTerm, TrafficSource } from '@/lib/youtube/types';

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
    default:
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
    const { startDate, endDate } = getDateRange(range);

    const tokens = await getTokens(user.id);
    if (!tokens?.channel_id) {
      return NextResponse.json({ error: 'No channel connected' }, { status: 400 });
    }

    // Check cache
    const cacheKey = `keywords:${user.id}:${range}`;
    const cached = getCached<{ searchTerms: SearchTerm[]; trafficSources: TrafficSource[] }>(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    const clients = await getAuthenticatedClients(user.id);
    if (!clients) {
      return NextResponse.json({ error: 'Not connected' }, { status: 401 });
    }

    // Fetch search terms (traffic source detail for YouTube Search)
    let searchTerms: SearchTerm[] = [];
    try {
      const searchRes = await clients.youtubeAnalytics.reports.query({
        ids: `channel==${tokens.channel_id}`,
        startDate,
        endDate,
        metrics: 'views,estimatedMinutesWatched',
        dimensions: 'insightTrafficSourceDetail',
        filters: 'insightTrafficSourceType==YT_SEARCH',
        sort: '-views',
        maxResults: 50,
      });

      const headers = searchRes.data.columnHeaders || [];
      const rows = searchRes.data.rows || [];

      searchTerms = rows.map((row: (string | number)[]) => {
        const entry: Record<string, string | number> = {};
        headers.forEach((h: { name?: string | null }, i: number) => {
          if (h.name) entry[h.name] = row[i];
        });
        return {
          term: entry.insightTrafficSourceDetail as string,
          views: (entry.views as number) || 0,
          estimatedMinutesWatched: (entry.estimatedMinutesWatched as number) || 0,
        };
      });
    } catch {
      // Search terms may not be available for all channels
    }

    // Fetch traffic source breakdown
    let trafficSources: TrafficSource[] = [];
    try {
      const trafficRes = await clients.youtubeAnalytics.reports.query({
        ids: `channel==${tokens.channel_id}`,
        startDate,
        endDate,
        metrics: 'views,estimatedMinutesWatched',
        dimensions: 'insightTrafficSourceType',
        sort: '-views',
      });

      const headers = trafficRes.data.columnHeaders || [];
      const rows = trafficRes.data.rows || [];

      trafficSources = rows.map((row: (string | number)[]) => {
        const entry: Record<string, string | number> = {};
        headers.forEach((h: { name?: string | null }, i: number) => {
          if (h.name) entry[h.name] = row[i];
        });
        return {
          source: entry.insightTrafficSourceType as string,
          views: (entry.views as number) || 0,
          estimatedMinutesWatched: (entry.estimatedMinutesWatched as number) || 0,
        };
      });
    } catch {
      // Traffic sources may not be available
    }

    const result = { searchTerms, trafficSources };
    setCache(cacheKey, result, CACHE_TTL.KEYWORDS);

    return NextResponse.json(result);
  } catch (error) {
    console.error('[YouTube Keywords] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch keyword data' }, { status: 500 });
  }
}
