/**
 * Agent Pages API - Activate Agent Page
 *
 * POST /api/agent-pages/[id]/activate - Activate an agent page
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';
import { syncAgentPageToKV, AgentPageKVData } from '@/lib/cloudflare-kv';

export const dynamic = 'force-dynamic';

// CORS headers for cross-origin requests from public site
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
 * POST /api/agent-pages/[id]/activate
 *
 * Activate an agent page to make it publicly visible
 */
export async function POST(
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

    // Verify page exists and is not already activated
    const { data: existingPage, error: checkError } = await supabase
      .from('agent_pages')
      .select('id, activated, slug, display_first_name, display_last_name')
      .eq('id', id)
      .single();

    if (checkError || !existingPage) {
      return NextResponse.json(
        { error: 'Agent page not found' },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    if (existingPage.activated) {
      return NextResponse.json(
        { error: 'Agent page is already activated' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Validate required fields before activation
    if (!existingPage.slug || !existingPage.display_first_name || !existingPage.display_last_name) {
      return NextResponse.json(
        { error: 'Please fill in all required fields (name and URL slug) before activating' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Activate the page
    const { data: updatedPage, error: updateError } = await supabase
      .from('agent_pages')
      .update({
        activated: true,
        activated_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError || !updatedPage) {
      console.error('Error activating agent page:', updateError);
      return NextResponse.json(
        { error: 'Failed to activate agent page', details: updateError?.message },
        { status: 500, headers: CORS_HEADERS }
      );
    }

    console.log('Agent page activated:', {
      pageId: id,
      slug: updatedPage.slug,
      activatedAt: updatedPage.activated_at,
    });

    // Sync to Cloudflare KV for edge delivery
    syncAgentPageToKV(updatedPage as AgentPageKVData)
      .then(result => {
        if (!result.success) {
          console.error('KV sync failed on activate:', result.error);
        } else {
          console.log('Agent page synced to KV:', updatedPage.slug);
        }
      })
      .catch(err => {
        console.error('KV sync error on activate:', err);
      });

    return NextResponse.json({
      success: true,
      page: updatedPage,
      message: 'Agent page activated successfully',
    }, { headers: CORS_HEADERS });
  } catch (error) {
    console.error('Error in POST /api/agent-pages/[id]/activate:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
