/**
 * User Management API - Change User Role
 *
 * PATCH /api/users/[id]/role - Change user role (admin/user)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';

export const dynamic = 'force-dynamic';

// Next.js 16 requires generateStaticParams for dynamic routes even when excluded
export async function generateStaticParams() {
  return [];
}

/**
 * PATCH /api/users/[id]/role
 *
 * Change user role
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseServiceClient();

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection unavailable' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { role } = body;

    // Validate role
    if (!role || !['admin', 'user'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be "admin" or "user"' },
        { status: 400 }
      );
    }

    // Update user role
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        role,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single();

    if (updateError || !updatedUser) {
      console.error('❌ Error updating user role:', updateError);
      return NextResponse.json(
        { error: 'Failed to update user role', details: updateError?.message },
        { status: updateError?.code === 'PGRST116' ? 404 : 500 }
      );
    }

    // Remove password_hash from response
    const { password_hash, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      success: true,
      data: userWithoutPassword,
      message: `User role changed to ${role}`,
    });
  } catch (error) {
    console.error('❌ Error in PATCH /api/users/[id]/role:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
