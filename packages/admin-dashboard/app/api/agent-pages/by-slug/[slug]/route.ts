/**
 * Agent Pages API - Fetch by Slug
 *
 * GET /api/agent-pages/by-slug/[slug] - Get agent page by slug
 *
 * PUBLIC endpoint (no auth) - used by public site to display agent pages
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';

export const dynamic = 'force-dynamic';

// Required for static export compatibility
export function generateStaticParams() {
  return [];
}

/**
 * GET /api/agent-pages/by-slug/[slug]
 *
 * Public endpoint to fetch an agent page by its URL slug.
 * Only returns active pages.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = getSupabaseServiceClient();
    const { slug } = await params;

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection unavailable' },
        { status: 503 }
      );
    }

    // Validate slug format
    const slugPattern = /^[a-z0-9-]+$/;
    if (!slugPattern.test(slug)) {
      return NextResponse.json(
        { error: 'Invalid slug format' },
        { status: 400 }
      );
    }

    // Fetch agent page by slug
    const { data: page, error } = await supabase
      .from('agent_pages')
      .select(`
        id,
        user_id,
        slug,
        display_first_name,
        display_last_name,
        profile_image_url,
        phone,
        show_phone,
        phone_text_only,
        facebook_url,
        instagram_url,
        twitter_url,
        youtube_url,
        tiktok_url,
        linkedin_url,
        is_active,
        created_at,
        updated_at
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error || !page) {
      return NextResponse.json(
        { error: 'Agent page not found' },
        {
          status: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
          },
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        page,
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    console.error('Error in GET /api/agent-pages/by-slug/[slug]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS handler for CORS preflight requests
 */
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
      },
    }
  );
}
