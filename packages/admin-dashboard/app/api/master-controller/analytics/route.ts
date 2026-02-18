import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Per-video config: name + optional earliest date to include
const VIDEO_CONFIG: Record<string, { name: string; startAfter?: string }> = {
  'f8c3f1bd9c2db2409ed0e90f60fd4d5b': { name: 'The Inside Look', startAfter: '2026-02-17' },
  'ff51a795a915986de673e181b6acfcfa': { name: 'Portal Walkthrough', startAfter: '2026-02-17' },
};

const VIDEO_IDS = Object.keys(VIDEO_CONFIG);

function getDateRange(range: string): { start: string; end: string } {
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
      start.setDate(end.getDate() - 30);
  }
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
}

export async function GET(request: NextRequest) {
  try {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    if (!accountId || !apiToken) {
      return NextResponse.json(
        { success: false, error: 'Cloudflare credentials not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';
    const validRanges = ['7d', '30d', '90d'];
    const safeRange = validRanges.includes(range) ? range : '30d';
    const { start, end } = getDateRange(safeRange);

    const query = `
      query {
        viewer {
          accounts(filter: { accountTag: "${accountId}" }) {
            streamMinutesViewedAdaptiveGroups(
              filter: {
                date_geq: "${start}"
                date_leq: "${end}"
                uid_in: ${JSON.stringify(VIDEO_IDS)}
              }
              orderBy: [date_ASC]
              limit: 10000
            ) {
              count
              sum {
                minutesViewed
              }
              dimensions {
                date
                uid
              }
            }
          }
        }
      }
    `;

    const cfResponse = await fetch('https://api.cloudflare.com/client/v4/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!cfResponse.ok) {
      const text = await cfResponse.text();
      console.error('[Analytics API] Cloudflare error:', cfResponse.status, text);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch analytics from Cloudflare' },
        { status: 502 }
      );
    }

    const cfData = await cfResponse.json();

    if (cfData.errors && cfData.errors.length > 0) {
      console.error('[Analytics API] GraphQL errors:', cfData.errors);
      return NextResponse.json(
        { success: false, error: cfData.errors[0].message || 'GraphQL query failed' },
        { status: 502 }
      );
    }

    const groups = cfData.data?.viewer?.accounts?.[0]?.streamMinutesViewedAdaptiveGroups || [];

    // Build per-video data
    const videoDataMap: Record<string, { daily: Record<string, { views: number; minutesWatched: number }> }> = {};
    for (const id of VIDEO_IDS) {
      videoDataMap[id] = { daily: {} };
    }

    for (const group of groups) {
      const uid = group.dimensions.uid;
      const date = group.dimensions.date;
      if (!videoDataMap[uid]) continue;

      if (!videoDataMap[uid].daily[date]) {
        videoDataMap[uid].daily[date] = { views: 0, minutesWatched: 0 };
      }
      videoDataMap[uid].daily[date].views += group.count;
      videoDataMap[uid].daily[date].minutesWatched += group.sum.minutesViewed;
    }

    const videos = VIDEO_IDS.map((id) => {
      const config = VIDEO_CONFIG[id];
      const vd = videoDataMap[id];
      const dailyEntries = Object.entries(vd.daily)
        .map(([date, d]) => ({ date, views: d.views, minutesWatched: Math.round(d.minutesWatched * 100) / 100 }))
        .filter((d) => !config.startAfter || d.date >= config.startAfter)
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
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
