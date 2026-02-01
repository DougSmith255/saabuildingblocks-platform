/**
 * Agent Pages API - Individual Agent Page Operations
 *
 * GET /api/agent-pages/[id] - Get agent page by user ID
 * PATCH /api/agent-pages/[id] - Update agent page (when [id] is the page ID)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';
import { syncAgentPageToKV, AgentPageKVData } from '@/lib/cloudflare-kv';
import { requirePageOwner } from '@/app/api/middleware/agentPageAuth';

export const dynamic = 'force-dynamic';

// CORS headers for cross-origin requests from public site
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function generateStaticParams() {
  return [];
}

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
        { status: 503, headers: CORS_HEADERS }
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
        { status: 404, headers: CORS_HEADERS }
      );
    }

    return NextResponse.json({
      success: true,
      page,
    }, { headers: CORS_HEADERS });
  } catch (error) {
    console.error('Error in GET /api/agent-pages/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: CORS_HEADERS }
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
        { status: 503, headers: CORS_HEADERS }
      );
    }

    // Verify authentication and page ownership
    const { error: authError } = await requirePageOwner(request, id, CORS_HEADERS);
    if (authError) return authError;

    const body = await request.json();
    const {
      display_first_name,
      display_last_name,
      slug,
      email,
      phone,
      show_phone,
      phone_text_only,
      profile_image_url,
      facebook_url,
      instagram_url,
      twitter_url,
      youtube_url,
      tiktok_url,
      linkedin_url,
      custom_links,
      custom_social_links,
      links_settings,
    } = body;

    // Build update object with only provided fields
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (display_first_name !== undefined) updates.display_first_name = display_first_name;
    if (display_last_name !== undefined) updates.display_last_name = display_last_name;
    if (email !== undefined) updates.email = email || null;
    if (phone !== undefined) updates.phone = phone || null;
    if (show_phone !== undefined) updates.show_phone = show_phone;
    if (phone_text_only !== undefined) updates.phone_text_only = phone_text_only;
    // Note: show_call_button and show_text_button are stored in links_settings, not as separate columns
    if (profile_image_url !== undefined) updates.profile_image_url = profile_image_url || null;
    if (facebook_url !== undefined) updates.facebook_url = facebook_url || null;
    if (instagram_url !== undefined) updates.instagram_url = instagram_url || null;
    if (twitter_url !== undefined) updates.twitter_url = twitter_url || null;
    if (youtube_url !== undefined) updates.youtube_url = youtube_url || null;
    if (tiktok_url !== undefined) updates.tiktok_url = tiktok_url || null;
    if (linkedin_url !== undefined) updates.linkedin_url = linkedin_url || null;
    if (custom_links !== undefined) updates.custom_links = custom_links || [];
    if (custom_social_links !== undefined) updates.custom_social_links = custom_social_links || [];
    if (links_settings !== undefined) updates.links_settings = links_settings || {
      accentColor: '#ffd700',
      iconStyle: 'light',
      font: 'synonym',
      bio: ''
    };

    // Get current page to check for slug changes
    const { data: currentPage } = await supabase
      .from('agent_pages')
      .select('slug')
      .eq('id', id)
      .single();

    const previousSlug = currentPage?.slug;

    // Handle slug update with uniqueness check
    if (slug !== undefined && slug !== '') {
      // Validate slug format
      const slugPattern = /^[a-z0-9-]+$/;
      if (!slugPattern.test(slug)) {
        return NextResponse.json(
          { error: 'Slug must contain only lowercase letters, numbers, and hyphens' },
          { status: 400, headers: CORS_HEADERS }
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
          { status: 400, headers: CORS_HEADERS }
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
      // Handle unique constraint violation (slug already taken - race condition)
      if (updateError?.code === '23505' && updateError?.message?.includes('slug')) {
        return NextResponse.json(
          { error: 'This URL slug is already taken. Please choose another.' },
          { status: 400, headers: CORS_HEADERS }
        );
      }
      return NextResponse.json(
        { error: 'Failed to update agent page', details: updateError?.message },
        { status: updateError?.code === 'PGRST116' ? 404 : 500, headers: CORS_HEADERS }
      );
    }

    // If display name changed, sync back to users table to keep both in sync
    if (display_first_name !== undefined || display_last_name !== undefined) {
      const userNameUpdates: Record<string, string> = {};
      if (display_first_name !== undefined) userNameUpdates.first_name = display_first_name;
      if (display_last_name !== undefined) userNameUpdates.last_name = display_last_name;

      const { error: userUpdateError } = await supabase
        .from('users')
        .update(userNameUpdates)
        .eq('id', updatedPage.user_id);

      if (userUpdateError) {
        console.error('[Agent Page Update] Failed to sync display name to users table:', userUpdateError);
      }
    }

    // Fetch user's exp_email and legal_name for KV sync
    const { data: userData } = await supabase
      .from('users')
      .select('exp_email, legal_name')
      .eq('id', updatedPage.user_id)
      .single();

    // Merge user data with page data for KV
    const kvData: AgentPageKVData = {
      ...updatedPage,
      exp_email: userData?.exp_email || null,
      legal_name: userData?.legal_name || null,
    };

    // Sync to Cloudflare KV for edge delivery
    // IMPORTANT: We await this to ensure linktree shows updated data immediately
    const kvSyncResult = await syncAgentPageToKV(kvData, previousSlug || undefined);
    if (!kvSyncResult.success) {
      console.error('KV sync failed:', kvSyncResult.error);
      // Don't fail the request - DB update succeeded, KV will eventually be consistent
    }

    return NextResponse.json({
      success: true,
      page: updatedPage,
      message: 'Agent page updated successfully',
      kvSynced: kvSyncResult.success,
    }, { headers: CORS_HEADERS });
  } catch (error) {
    console.error('Error in PATCH /api/agent-pages/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
