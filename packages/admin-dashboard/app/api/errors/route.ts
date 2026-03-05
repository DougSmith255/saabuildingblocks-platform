/**
 * Admin Error Log API
 * GET  /api/errors - List errors with filtering/pagination
 * PATCH /api/errors - Update error status (reviewed/resolved)
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifySessionAdminAuth } from '@/app/api/middleware/adminAuth';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await verifySessionAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status || 401 });
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
  }

  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)));
  const severity = searchParams.get('severity');
  const source = searchParams.get('source');
  const status = searchParams.get('status');
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  let query = supabase
    .from('platform_errors')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (severity) query = query.eq('severity', severity);
  if (source) query = query.ilike('source', `%${source}%`);
  if (status) query = query.eq('status', status);
  if (from) query = query.gte('created_at', from);
  if (to) query = query.lte('created_at', to);

  const { data, error, count } = await query;

  if (error) {
    console.error('[errors API] Query failed:', error.message);
    return NextResponse.json({ error: 'Query failed' }, { status: 500 });
  }

  // Summary stats (last 24h)
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [
    { count: errors24h },
    { count: critical24h },
    { count: unreviewedCount },
  ] = await Promise.all([
    supabase
      .from('platform_errors')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', twentyFourHoursAgo),
    supabase
      .from('platform_errors')
      .select('id', { count: 'exact', head: true })
      .eq('severity', 'critical')
      .gte('created_at', twentyFourHoursAgo),
    supabase
      .from('platform_errors')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'new'),
  ]);

  // Unique sources for filter dropdown
  const { data: sourcesData } = await supabase
    .from('platform_errors')
    .select('source')
    .limit(100);
  const uniqueSources = [...new Set(sourcesData?.map(s => s.source) || [])].sort();

  return NextResponse.json({
    errors: data || [],
    total: count || 0,
    page,
    limit,
    summary: {
      errors_24h: errors24h || 0,
      critical_24h: critical24h || 0,
      unreviewed: unreviewedCount || 0,
    },
    sources: uniqueSources,
  });
}

export async function PATCH(request: NextRequest) {
  const auth = await verifySessionAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status || 401 });
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
  }

  let body: { id?: number; ids?: number[]; status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const ids = body.ids || (body.id ? [body.id] : []);
  const newStatus = body.status;

  if (!ids.length || !newStatus) {
    return NextResponse.json({ error: 'ids and status are required' }, { status: 400 });
  }

  if (!['reviewed', 'resolved'].includes(newStatus)) {
    return NextResponse.json({ error: 'status must be reviewed or resolved' }, { status: 400 });
  }

  const updates: Record<string, unknown> = {
    status: newStatus,
    reviewed_by: auth.username || auth.userId || 'admin',
  };
  if (newStatus === 'resolved') {
    updates.resolved_at = new Date().toISOString();
  }

  const { error, count } = await supabase
    .from('platform_errors')
    .update(updates)
    .in('id', ids);

  if (error) {
    console.error('[errors API] Update failed:', error.message);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }

  return NextResponse.json({ success: true, updated: count });
}
