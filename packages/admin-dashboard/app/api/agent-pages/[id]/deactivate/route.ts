/**
 * Agent Pages API - Deactivate Agent Page
 *
 * POST /api/agent-pages/[id]/deactivate - Deactivate an agent page
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  return [];
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
        { status: 503 }
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
        { status: 404 }
      );
    }

    if (!existingPage.activated) {
      return NextResponse.json(
        { error: 'Agent page is already deactivated' },
        { status: 400 }
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
        { status: 500 }
      );
    }

    console.log('Agent page deactivated:', {
      pageId: id,
      slug: updatedPage.slug,
      deactivatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      page: updatedPage,
      message: 'Agent page deactivated successfully',
    });
  } catch (error) {
    console.error('Error in POST /api/agent-pages/[id]/deactivate:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
