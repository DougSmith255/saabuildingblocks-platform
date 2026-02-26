/**
 * Agent Suggestions API
 *
 * POST - Submit a suggestion (agent auth via JWT)
 * GET  - List all suggestions (admin auth via session)
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAgentAuth } from '@/app/api/middleware/agentPageAuth';
import { verifySessionAdminAuth } from '@/app/api/middleware/adminAuth';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';

export const dynamic = 'force-dynamic';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * POST /api/suggestions - Agent submits a suggestion
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAgentAuth(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 401, headers: CORS_HEADERS });
    }

    const supabase = getSupabaseServiceClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection unavailable' }, { status: 503, headers: CORS_HEADERS });
    }

    const body = await request.json();
    const { category, suggestion } = body;

    if (!category || !suggestion) {
      return NextResponse.json({ error: 'Category and suggestion are required' }, { status: 400, headers: CORS_HEADERS });
    }

    const validCategories = ['portal-features', 'training', 'templates', 'general'];
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400, headers: CORS_HEADERS });
    }

    if (suggestion.length < 10 || suggestion.length > 2000) {
      return NextResponse.json({ error: 'Suggestion must be between 10 and 2000 characters' }, { status: 400, headers: CORS_HEADERS });
    }

    // Get the user's username
    const { data: user } = await supabase
      .from('users')
      .select('username')
      .eq('id', auth.userId)
      .single();

    const { data, error } = await supabase
      .from('agent_suggestions')
      .insert({
        user_id: auth.userId,
        username: user?.username || 'Unknown',
        category,
        suggestion,
      })
      .select()
      .single();

    if (error) {
      console.error('[suggestions] Insert error:', error);
      return NextResponse.json({ error: 'Failed to submit suggestion', details: error.message }, { status: 500, headers: CORS_HEADERS });
    }

    return NextResponse.json({ success: true, data }, { status: 201, headers: CORS_HEADERS });
  } catch (error) {
    console.error('[suggestions] POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: CORS_HEADERS });
  }
}

/**
 * GET /api/suggestions - Admin lists all suggestions
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await verifySessionAdminAuth();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 401 });
    }

    const supabase = getSupabaseServiceClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection unavailable' }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '25', 10);
    const status = searchParams.get('status') || 'all';
    const category = searchParams.get('category') || 'all';
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortDir = searchParams.get('sortDir') || 'desc';
    const offset = (page - 1) * limit;

    let query = supabase
      .from('agent_suggestions')
      .select('*', { count: 'exact' });

    if (status && status !== 'all') query = query.eq('status', status);
    if (category && category !== 'all') query = query.eq('category', category);
    if (search) query = query.or(`suggestion.ilike.%${search}%,username.ilike.%${search}%`);

    query = query.order(sortBy, { ascending: sortDir === 'asc' });
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('[suggestions] GET error:', error);
      return NextResponse.json({ error: 'Failed to fetch suggestions', details: error.message }, { status: 500 });
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
    console.error('[suggestions] GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
