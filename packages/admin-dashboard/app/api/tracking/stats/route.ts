/**
 * Page Tracking Stats API - Authenticated
 *
 * GET /api/tracking/stats?agent_page_id=UUID
 * Returns view/click stats and button breakdown for an agent's pages.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';
import { verifyAccessToken } from '@/lib/auth/jwt';

export const dynamic = 'force-dynamic';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: { ...CORS_HEADERS, 'Access-Control-Max-Age': '86400' },
  });
}

/** Get Monday 00:00 UTC of the current week */
function getWeekStart(): string {
  const now = new Date();
  const day = now.getUTCDay(); // 0=Sun, 1=Mon, ...
  const diff = day === 0 ? 6 : day - 1; // days since Monday
  const monday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - diff));
  return monday.toISOString();
}

interface ButtonBreakdown {
  button_id: string;
  label: string;
  clicks_this_week: number;
  clicks_all_time: number;
}

interface PageStats {
  views_this_week: number;
  views_all_time: number;
  clicks_this_week: number;
  clicks_all_time: number;
  button_breakdown: ButtonBreakdown[];
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseServiceClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection unavailable' },
        { status: 503, headers: CORS_HEADERS }
      );
    }

    // Verify auth
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401, headers: CORS_HEADERS }
      );
    }

    const token = authHeader.substring(7);
    const verification = await verifyAccessToken(token);
    if (!verification.valid || !verification.payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401, headers: CORS_HEADERS }
      );
    }

    // Get agent_page_id from query
    const agentPageId = request.nextUrl.searchParams.get('agent_page_id');
    if (!agentPageId) {
      return NextResponse.json(
        { error: 'agent_page_id parameter required' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Verify user owns this agent page
    const userId = verification.payload.sub;
    const { data: agentPage, error: pageError } = await supabase
      .from('agent_pages')
      .select('id, custom_links')
      .eq('id', agentPageId)
      .eq('user_id', userId)
      .single();

    if (pageError || !agentPage) {
      return NextResponse.json(
        { error: 'Agent page not found or access denied' },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    const weekStart = getWeekStart();
    const customLinks: Array<{ id: string; label: string }> = agentPage.custom_links || [];

    // Build set of valid button IDs for links page (current buttons only)
    const validLinkButtonIds = new Set(customLinks.map(l => l.id));
    validLinkButtonIds.add('learn-about'); // default button always valid

    // Build label lookup from CURRENT custom_links
    const labelLookup = new Map<string, string>();
    for (const link of customLinks) {
      labelLookup.set(link.id, link.label);
    }
    labelLookup.set('learn-about', 'Learn About SAA');

    // Fetch all events for this agent page
    const { data: events, error: eventsError } = await supabase
      .from('page_events')
      .select('page_type, event_type, button_id, created_at')
      .eq('agent_page_id', agentPageId)
      .order('created_at', { ascending: false });

    if (eventsError) {
      return NextResponse.json(
        { error: 'Failed to fetch stats' },
        { status: 500, headers: CORS_HEADERS }
      );
    }

    // Process events into stats
    const linksStats: PageStats = { views_this_week: 0, views_all_time: 0, clicks_this_week: 0, clicks_all_time: 0, button_breakdown: [] };
    const attractionStats: PageStats = { views_this_week: 0, views_all_time: 0, clicks_this_week: 0, clicks_all_time: 0, button_breakdown: [] };

    // Button click accumulators
    const linksButtonClicks = new Map<string, { all: number; week: number }>();
    const attractionButtonClicks = new Map<string, { all: number; week: number }>();

    for (const event of events || []) {
      const isThisWeek = event.created_at >= weekStart;
      const isLinks = event.page_type === 'links';
      const stats = isLinks ? linksStats : attractionStats;
      const buttonMap = isLinks ? linksButtonClicks : attractionButtonClicks;

      if (event.event_type === 'view') {
        stats.views_all_time++;
        if (isThisWeek) stats.views_this_week++;
      } else if (event.event_type === 'click') {
        stats.clicks_all_time++;
        if (isThisWeek) stats.clicks_this_week++;

        if (event.button_id) {
          const existing = buttonMap.get(event.button_id) || { all: 0, week: 0 };
          existing.all++;
          if (isThisWeek) existing.week++;
          buttonMap.set(event.button_id, existing);
        }
      }
    }

    // Build links button breakdown — only CURRENT buttons
    for (const [buttonId, counts] of linksButtonClicks) {
      if (!validLinkButtonIds.has(buttonId)) continue;
      linksStats.button_breakdown.push({
        button_id: buttonId,
        label: labelLookup.get(buttonId) || buttonId,
        clicks_this_week: counts.week,
        clicks_all_time: counts.all,
      });
    }

    // Build attraction button breakdown (fixed set of known buttons)
    const attractionLabels: Record<string, string> = {
      'cta-watch': 'Watch & Decide',
      'form-submit': 'Join Form Submit',
      'btn-join-alliance': 'Join The Alliance',
    };
    // Include social- prefixed buttons dynamically
    for (const [buttonId, counts] of attractionButtonClicks) {
      let label = attractionLabels[buttonId];
      if (!label && buttonId.startsWith('social-')) {
        label = buttonId.replace('social-', '').replace(/^\w/, c => c.toUpperCase());
      }
      if (!label) label = buttonId;
      attractionStats.button_breakdown.push({
        button_id: buttonId,
        label,
        clicks_this_week: counts.week,
        clicks_all_time: counts.all,
      });
    }

    // Sort breakdowns by clicks_this_week desc, then all_time desc
    const sortBreakdown = (a: ButtonBreakdown, b: ButtonBreakdown) =>
      b.clicks_this_week - a.clicks_this_week || b.clicks_all_time - a.clicks_all_time;
    linksStats.button_breakdown.sort(sortBreakdown);
    attractionStats.button_breakdown.sort(sortBreakdown);

    return NextResponse.json({
      success: true,
      data: {
        links: linksStats,
        attraction: attractionStats,
      },
    }, { headers: CORS_HEADERS });

  } catch (error) {
    console.error('[tracking/stats] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
