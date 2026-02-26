/**
 * Agent Suggestions Stats API
 *
 * GET - Get suggestion counts by status (admin only)
 */

import { NextResponse } from 'next/server';
import { verifySessionAdminAuth } from '@/app/api/middleware/adminAuth';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const auth = await verifySessionAdminAuth();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 401 });
    }

    const supabase = getSupabaseServiceClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection unavailable' }, { status: 503 });
    }

    const { data, error } = await supabase
      .from('agent_suggestions')
      .select('status');

    if (error) {
      console.error('[suggestions/stats] Error:', error);
      return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }

    const stats = {
      total: data?.length || 0,
      new: data?.filter(s => s.status === 'new').length || 0,
      reviewed: data?.filter(s => s.status === 'reviewed').length || 0,
      implemented: data?.filter(s => s.status === 'implemented').length || 0,
      dismissed: data?.filter(s => s.status === 'dismissed').length || 0,
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error('[suggestions/stats] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
