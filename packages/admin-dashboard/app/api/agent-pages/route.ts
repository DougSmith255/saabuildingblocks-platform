/**
 * Agent Pages API - Create New Agent Page
 *
 * POST /api/agent-pages - Create a new agent page for authenticated user
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';

export const dynamic = 'force-dynamic';

// CORS headers for cross-origin requests from public site
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

/**
 * OPTIONS handler for CORS preflight requests
 */
export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      ...CORS_HEADERS,
      'Access-Control-Max-Age': '86400',
    },
  });
}

/**
 * POST /api/agent-pages
 *
 * Create a new agent page for the authenticated user
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServiceClient();

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection unavailable' },
        { status: 503, headers: CORS_HEADERS }
      );
    }

    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401, headers: CORS_HEADERS }
      );
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify token and get user - check sessions table
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('user_id, expires_at')
      .eq('token', token)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401, headers: CORS_HEADERS }
      );
    }

    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Session expired' },
        { status: 401, headers: CORS_HEADERS }
      );
    }

    const userId = session.user_id;

    // Get user details
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, first_name, last_name, email')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    // Check if user already has an agent page
    const { data: existingPage } = await supabase
      .from('agent_pages')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existingPage) {
      return NextResponse.json(
        { error: 'Agent page already exists for this user', page: existingPage },
        { status: 409, headers: CORS_HEADERS }
      );
    }

    // Generate slug from user name
    const slug = `${user.first_name}-${user.last_name}`
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Check if slug is unique
    const { data: slugCheck } = await supabase
      .from('agent_pages')
      .select('id')
      .eq('slug', slug)
      .single();

    // If slug exists, append user id
    const finalSlug = slugCheck ? `${slug}-${userId.slice(0, 8)}` : slug;

    // Create the agent page
    const { data: newPage, error: createError } = await supabase
      .from('agent_pages')
      .insert({
        user_id: userId,
        slug: finalSlug,
        display_first_name: user.first_name,
        display_last_name: user.last_name,
        email: user.email,
        activated: false,
        show_phone: false,
        phone_text_only: false,
        custom_links: [],
        links_settings: {
          accentColor: '#ffd700',
          iconStyle: 'light',
          font: 'synonym',
          bio: '',
          showColorPhoto: false,
        },
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating agent page:', createError);
      return NextResponse.json(
        { error: 'Failed to create agent page' },
        { status: 500, headers: CORS_HEADERS }
      );
    }

    return NextResponse.json({
      success: true,
      page: newPage,
    }, { status: 201, headers: CORS_HEADERS });

  } catch (error) {
    console.error('Error in POST /api/agent-pages:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
