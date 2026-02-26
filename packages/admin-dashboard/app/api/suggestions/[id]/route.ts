/**
 * Agent Suggestions - Individual Suggestion API
 *
 * PATCH  - Update suggestion status/notes (admin only)
 * DELETE - Delete a suggestion (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifySessionAdminAuth } from '@/app/api/middleware/adminAuth';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';

export const dynamic = 'force-dynamic';

/**
 * PATCH /api/suggestions/[id] - Update status or admin notes
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifySessionAdminAuth();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 401 });
    }

    const supabase = getSupabaseServiceClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection unavailable' }, { status: 503 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, admin_notes } = body;

    const updates: Record<string, string> = {};
    if (status) {
      const validStatuses = ['new', 'reviewed', 'implemented', 'dismissed'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      updates.status = status;
    }
    if (admin_notes !== undefined) {
      updates.admin_notes = admin_notes;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('agent_suggestions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[suggestions] PATCH error:', error);
      return NextResponse.json({ error: 'Failed to update suggestion', details: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[suggestions] PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/suggestions/[id] - Delete a suggestion
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifySessionAdminAuth();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 401 });
    }

    const supabase = getSupabaseServiceClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection unavailable' }, { status: 503 });
    }

    const { id } = await params;

    const { error } = await supabase
      .from('agent_suggestions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[suggestions] DELETE error:', error);
      return NextResponse.json({ error: 'Failed to delete suggestion', details: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[suggestions] DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
