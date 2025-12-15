/**
 * Agent Pages API - Individual Agent Page Operations
 *
 * GET /api/agent-pages/[id] - Get agent page by user ID
 * PATCH /api/agent-pages/[id] - Update agent page (when [id] is the page ID)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  return [];
}

/**
 * GET /api/agent-pages/[id]
 *
 * Get agent page by user ID or page ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabaseServiceClient();
    const { id } = await params;

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection unavailable' },
        { status: 503 }
      );
    }

    // Try to find by user_id first, then by page id
    let { data: page, error } = await supabase
      .from('agent_pages')
      .select('*')
      .eq('user_id', id)
      .single();

    // If not found by user_id, try by page id
    if (error || !page) {
      const result = await supabase
        .from('agent_pages')
        .select('*')
        .eq('id', id)
        .single();

      page = result.data;
      error = result.error;
    }

    if (error || !page) {
      return NextResponse.json(
        { error: 'Agent page not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      page,
    });
  } catch (error) {
    console.error('Error in GET /api/agent-pages/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/agent-pages/[id]
 *
 * Update agent page by page ID
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabaseServiceClient();
    const { id } = await params;

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection unavailable' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const {
      display_first_name,
      display_last_name,
      slug,
      phone,
      show_phone,
      phone_text_only,
      facebook_url,
      instagram_url,
      twitter_url,
      youtube_url,
      tiktok_url,
      linkedin_url,
    } = body;

    // Build update object with only provided fields
    const updates: Record<string, string | boolean | null> = {
      updated_at: new Date().toISOString(),
    };

    if (display_first_name !== undefined) updates.display_first_name = display_first_name;
    if (display_last_name !== undefined) updates.display_last_name = display_last_name;
    if (phone !== undefined) updates.phone = phone || null;
    if (show_phone !== undefined) updates.show_phone = show_phone;
    if (phone_text_only !== undefined) updates.phone_text_only = phone_text_only;
    if (facebook_url !== undefined) updates.facebook_url = facebook_url || null;
    if (instagram_url !== undefined) updates.instagram_url = instagram_url || null;
    if (twitter_url !== undefined) updates.twitter_url = twitter_url || null;
    if (youtube_url !== undefined) updates.youtube_url = youtube_url || null;
    if (tiktok_url !== undefined) updates.tiktok_url = tiktok_url || null;
    if (linkedin_url !== undefined) updates.linkedin_url = linkedin_url || null;

    // Handle slug update with uniqueness check
    if (slug !== undefined && slug !== '') {
      // Validate slug format
      const slugPattern = /^[a-z0-9-]+$/;
      if (!slugPattern.test(slug)) {
        return NextResponse.json(
          { error: 'Slug must contain only lowercase letters, numbers, and hyphens' },
          { status: 400 }
        );
      }

      // Check if slug is already taken by another page
      const { data: existingPage } = await supabase
        .from('agent_pages')
        .select('id')
        .eq('slug', slug)
        .neq('id', id)
        .single();

      if (existingPage) {
        return NextResponse.json(
          { error: 'This URL slug is already taken. Please choose another.' },
          { status: 400 }
        );
      }

      updates.slug = slug;
    }

    // Update agent page
    const { data: updatedPage, error: updateError } = await supabase
      .from('agent_pages')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateError || !updatedPage) {
      console.error('Error updating agent page:', updateError);
      return NextResponse.json(
        { error: 'Failed to update agent page', details: updateError?.message },
        { status: updateError?.code === 'PGRST116' ? 404 : 500 }
      );
    }

    return NextResponse.json({
      success: true,
      page: updatedPage,
      message: 'Agent page updated successfully',
    });
  } catch (error) {
    console.error('Error in PATCH /api/agent-pages/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
