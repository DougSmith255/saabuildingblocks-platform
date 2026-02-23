/**
 * 404 Paths API - Single Path
 *
 * PATCH /api/404-paths/[id] - Update a single 404 path (status, redirect_target, notes)
 * DELETE /api/404-paths/[id] - Remove a 404 path entry
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifySessionAdminAuth } from '@/app/api/middleware/adminAuth';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';

export const dynamic = 'force-dynamic';

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
      return NextResponse.json(
        { error: 'Database connection unavailable' },
        { status: 503 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { status, redirect_target, notes } = body;

    const updateData: Record<string, unknown> = {};

    if (status) {
      updateData.status = status;
      updateData.reviewed_at = new Date().toISOString();
      updateData.reviewed_by = 'admin';
    }

    if (redirect_target !== undefined) {
      updateData.redirect_target = redirect_target;
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const { data, error } = await supabase
      .from('http_404_paths')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[404-paths/[id]] PATCH error:', error);
      return NextResponse.json(
        { error: 'Failed to update path', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[404-paths/[id]] PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
      return NextResponse.json(
        { error: 'Database connection unavailable' },
        { status: 503 }
      );
    }

    const { id } = await params;

    const { error } = await supabase
      .from('http_404_paths')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[404-paths/[id]] DELETE error:', error);
      return NextResponse.json(
        { error: 'Failed to delete path', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[404-paths/[id]] DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
