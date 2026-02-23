/**
 * 404 Paths API - Stats
 *
 * GET /api/404-paths/stats - Aggregate stats for the triage dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifySessionAdminAuth } from '@/app/api/middleware/adminAuth';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = await verifySessionAdminAuth();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 401 });
    }

    const supabase = getSupabaseServiceClient();

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection unavailable' },
        { status: 503 }
      );
    }

    // Run all stat queries in parallel
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [unreviewedResult, totalResult, resolvedTodayResult, activeRedirectsResult] = await Promise.all([
      supabase
        .from('http_404_paths')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'unreviewed'),
      supabase
        .from('http_404_paths')
        .select('*', { count: 'exact', head: true }),
      supabase
        .from('http_404_paths')
        .select('*', { count: 'exact', head: true })
        .in('status', ['redirect', 'junk', 'ignored'])
        .gte('reviewed_at', todayStart.toISOString()),
      supabase
        .from('http_404_paths')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'redirect'),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        unreviewed: unreviewedResult.count || 0,
        total: totalResult.count || 0,
        resolvedToday: resolvedTodayResult.count || 0,
        activeRedirects: activeRedirectsResult.count || 0,
      },
    });
  } catch (error) {
    console.error('[404-paths/stats] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
