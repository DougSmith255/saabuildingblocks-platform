import { NextRequest, NextResponse } from 'next/server';
import { verifySessionAdminAuth } from '@/app/api/middleware/adminAuth';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';

export const dynamic = 'force-dynamic';

// Per-video config. startAfter excludes test/pre-launch data before that date.
const VIDEO_CONFIG: Record<string, { name: string; startAfter?: string }> = {
  'f8c3f1bd9c2db2409ed0e90f60fd4d5b': { name: 'The Inside Look', startAfter: '2026-02-19' },
  '14ba82ce03943a64ef90e3c9771a0d56': { name: 'Portal Walkthrough', startAfter: '2026-02-19' },
};

const VIDEO_IDS = Object.keys(VIDEO_CONFIG);

interface DailyBucket {
  views: number;
  minutesWatched: number;
}

function dateToString(d: Date): string {
  return d.toISOString().split('T')[0];
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

export async function GET(request: NextRequest) {
  try {
    const auth = await verifySessionAdminAuth();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 401 });
    }

    const supabase = getSupabaseServiceClient();
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Supabase not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';
    const validRanges = ['1d', '3d', '7d', '30d', '90d'];
    const safeRange = validRanges.includes(range) ? range : '30d';

    const rangeDays = safeRange === '1d' ? 1 : safeRange === '3d' ? 3 : safeRange === '7d' ? 7 : safeRange === '90d' ? 90 : 30;
    const startDate = dateToString(daysAgo(rangeDays));
    const endDate = dateToString(new Date());

    // Query video_views from Supabase
    const { data, error } = await supabase
      .from('video_views')
      .select('video_id, watch_time_seconds, created_at')
      .in('video_id', VIDEO_IDS)
      .gte('created_at', startDate + 'T00:00:00.000Z')
      .lte('created_at', endDate + 'T23:59:59.999Z');

    if (error) {
      throw new Error(`Supabase query error: ${error.message}`);
    }

    const rows = data || [];

    // Build per-video daily map
    const videoDataMap: Record<string, { daily: Record<string, DailyBucket> }> = {};
    for (const id of VIDEO_IDS) {
      videoDataMap[id] = { daily: {} };
    }

    for (const row of rows) {
      if (!videoDataMap[row.video_id]) continue;
      const date = row.created_at.split('T')[0];
      const config = VIDEO_CONFIG[row.video_id];

      // Exclude test data before startAfter date
      if (config.startAfter && date < config.startAfter) continue;

      const daily = videoDataMap[row.video_id].daily;
      if (!daily[date]) {
        daily[date] = { views: 0, minutesWatched: 0 };
      }
      daily[date].views += 1;
      daily[date].minutesWatched += (Number(row.watch_time_seconds) || 0) / 60;
    }

    const videos = VIDEO_IDS.map((id) => {
      const config = VIDEO_CONFIG[id];
      const vd = videoDataMap[id];

      const dailyEntries = Object.entries(vd.daily)
        .map(([date, d]) => ({
          date,
          views: d.views,
          minutesWatched: Math.round(d.minutesWatched * 100) / 100,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      const totalViews = dailyEntries.reduce((s, d) => s + d.views, 0);
      const totalMinutesWatched = Math.round(dailyEntries.reduce((s, d) => s + d.minutesWatched, 0) * 100) / 100;
      const avgViewDurationSeconds = totalViews > 0 ? Math.round((totalMinutesWatched * 60) / totalViews) : 0;

      return {
        id,
        name: config.name,
        totalViews,
        totalMinutesWatched,
        avgViewDurationSeconds,
        daily: dailyEntries,
      };
    });

    return NextResponse.json({
      success: true,
      data: { videos, range: safeRange },
    });
  } catch (error) {
    console.error('[Analytics API] Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
