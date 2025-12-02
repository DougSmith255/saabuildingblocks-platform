/**
 * User Management API - Individual User Operations
 *
 * GET /api/users/[id] - Get user by ID
 * PUT /api/users/[id] - Update user
 * DELETE /api/users/[id] - Delete user (soft delete)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';
import bcryptjs from 'bcryptjs';

export const dynamic = 'force-dynamic';

// Next.js 16 requires generateStaticParams for dynamic routes even when excluded
export async function generateStaticParams() {
  return [];
}

const BCRYPT_ROUNDS = 12;

/**
 * GET /api/users/[id]
 *
 * Get user by ID
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

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Remove password_hash from response
    const { password_hash, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error('❌ Error in GET /api/users/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/users/[id]
 *
 * Update user
 */
export async function PUT(
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
      first_name,
      last_name,
      name,
      full_name,
      email,
      username,
      password,
      role,
      status
    } = body;

    // Build update object with only provided fields
    const updates: Record<string, string> = {
      updated_at: new Date().toISOString(),
    };

    // Handle name fields with backward compatibility
    if (first_name !== undefined && last_name !== undefined) {
      // Preferred: use first_name + last_name directly
      updates.first_name = first_name;
      updates.last_name = last_name;
      updates.full_name = `${first_name} ${last_name}`;
    } else if (full_name !== undefined || name !== undefined) {
      // Backward compatibility: split full_name or name
      const nameToSplit = full_name || name || '';
      const nameParts = nameToSplit.split(' ');
      updates.first_name = nameParts[0] || '';
      updates.last_name = nameParts.slice(1).join(' ') || '';
      updates.full_name = nameToSplit;
    } else if (first_name !== undefined) {
      updates.first_name = first_name;
    } else if (last_name !== undefined) {
      updates.last_name = last_name;
    }

    if (email !== undefined) updates.email = email;
    if (username !== undefined) updates.username = username;
    if (role !== undefined) updates.role = role;
    if (status !== undefined) updates.status = status;

    // Hash new password if provided
    if (password) {
      if (password.length < 8) {
        return NextResponse.json(
          { error: 'Password must be at least 8 characters' },
          { status: 400 }
        );
      }
      updates.password_hash = await bcryptjs.hash(password, BCRYPT_ROUNDS);
    }

    // Update user
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateError || !updatedUser) {
      console.error('❌ Error updating user:', updateError);
      return NextResponse.json(
        { error: 'Failed to update user', details: updateError?.message },
        { status: updateError?.code === 'PGRST116' ? 404 : 500 }
      );
    }

    // Remove password_hash from response
    const { password_hash, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      success: true,
      data: userWithoutPassword,
      message: 'User updated successfully',
    });
  } catch (error) {
    console.error('❌ Error in PUT /api/users/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/users/[id]
 *
 * Hard delete user and all associated data
 * Deletion order (foreign key dependencies):
 * 1. DELETE FROM user_invitations WHERE user_id = ?
 * 2. DELETE FROM users WHERE id = ?
 */
export async function DELETE(
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

    const userId = id;

    // Verify user exists before attempting deletion
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id, email, username')
      .eq('id', userId)
      .single();

    if (checkError || !existingUser) {
      console.error('❌ User not found for deletion:', userId);
      return NextResponse.json(
        { error: 'User not found', details: checkError?.message },
        { status: 404 }
      );
    }

    // Step 1: Delete user_invitations records (foreign key dependency)
    const { error: invitationsError, count: invitationsCount } = await supabase
      .from('user_invitations')
      .delete()
      .eq('user_id', userId);

    if (invitationsError) {
      console.error('❌ Error deleting user_invitations:', invitationsError);
      return NextResponse.json(
        {
          error: 'Failed to delete user invitations',
          details: invitationsError.message,
        },
        { status: 500 }
      );
    }

    // Step 2: Delete user record
    const { error: deleteError, count: userCount } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (deleteError) {
      console.error('❌ Error deleting user:', deleteError);
      return NextResponse.json(
        {
          error: 'Failed to delete user',
          details: deleteError.message,
        },
        { status: 500 }
      );
    }

    // Audit log for deletion
    console.log('✅ User deleted successfully:', {
      userId,
      email: existingUser.email,
      username: existingUser.username,
      invitationsDeleted: invitationsCount || 0,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'User and all associated data deleted successfully',
    });
  } catch (error) {
    console.error('❌ Error in DELETE /api/users/[id]:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
