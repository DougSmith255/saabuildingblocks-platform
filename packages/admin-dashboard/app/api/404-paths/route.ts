/**
 * 404 Paths API - List
 *
 * GET /api/404-paths - List 404 paths with filters, search, sort, pagination
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const status = searchParams.get('status') || '';
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'last_seen_at';
    const sortDir = searchParams.get('sortDir') || 'desc';

    const offset = (page - 1) * limit;

    let query = supabase
      .from('http_404_paths')
      .select('*', { count: 'exact' });

    // Filter by status
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    // Search by path
    if (search) {
      query = query.ilike('path', `%${search}%`);
    }

    // Sort
    const ascending = sortDir === 'asc';
    query = query.order(sortBy, { ascending });

    // Paginate
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('[404-paths] Error fetching:', error);
      return NextResponse.json(
        { error: 'Failed to fetch 404 paths', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('[404-paths] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
