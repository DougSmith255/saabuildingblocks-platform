/**
 * Agent Pages API - Deactivate Agent Page
 *
 * POST /api/agent-pages/[id]/deactivate - Deactivate an agent page
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';
import { deleteAgentPageFromKV } from '@/lib/cloudflare-kv';

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
 * POST /api/agent-pages/[id]/deactivate
 *
 * Deactivate an agent page to hide it from public view
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

    // Verify page exists and is activated
    const { data: existingPage, error: checkError } = await supabase
      .from('agent_pages')
      .select('id, activated, slug')
      .eq('id', id)
      .single();

    if (checkError || !existingPage) {
      return NextResponse.json(
        { error: 'Agent page not found' },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    if (!existingPage.activated) {
      return NextResponse.json(
        { error: 'Agent page is already deactivated' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Deactivate the page
    const { data: updatedPage, error: updateError } = await supabase
      .from('agent_pages')
      .update({
        activated: false,
        activated_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError || !updatedPage) {
      console.error('Error deactivating agent page:', updateError);
      return NextResponse.json(
        { error: 'Failed to deactivate agent page', details: updateError?.message },
        { status: 500, headers: CORS_HEADERS }
      );
    }

    console.log('Agent page deactivated:', {
      pageId: id,
      slug: updatedPage.slug,
      deactivatedAt: new Date().toISOString(),
    });

    // Remove from Cloudflare KV since page is no longer active
    deleteAgentPageFromKV(updatedPage.slug)
      .then(result => {
        if (!result.success) {
          console.error('KV delete failed on deactivate:', result.error);
        } else {
          console.log('Agent page removed from KV:', updatedPage.slug);
        }
      })
      .catch(err => {
        console.error('KV delete error on deactivate:', err);
      });

    return NextResponse.json({
      success: true,
      page: updatedPage,
      message: 'Agent page deactivated successfully',
    }, { headers: CORS_HEADERS });
  } catch (error) {
    console.error('Error in POST /api/agent-pages/[id]/deactivate:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
