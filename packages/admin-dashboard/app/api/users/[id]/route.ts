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
import { deleteProfilePicture } from '@/lib/cloudflare-r2';
import { deleteAgentPageFromKV, syncAgentPageToKV, AgentPageKVData } from '@/lib/cloudflare-kv';

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
      status,
      exp_email,
      legal_name
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
    if (exp_email !== undefined) updates.exp_email = exp_email;
    if (legal_name !== undefined) updates.legal_name = legal_name;

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

    // If exp_email or legal_name was updated, re-sync agent page to KV
    if (exp_email !== undefined || legal_name !== undefined) {
      // Fetch the user's agent page
      const { data: agentPage } = await supabase
        .from('agent_pages')
        .select('*')
        .eq('user_id', id)
        .single();

      if (agentPage) {
        // Merge updated user data with agent page for KV sync
        const kvData: AgentPageKVData = {
          ...agentPage,
          exp_email: updatedUser.exp_email || null,
          legal_name: updatedUser.legal_name || null,
        };

        // Sync to KV (async, don't wait)
        syncAgentPageToKV(kvData)
          .then(result => {
            if (result.success) {
              console.log('✅ Agent page KV synced after user exp_email/legal_name update');
            } else {
              console.error('❌ KV sync failed:', result.error);
            }
          })
          .catch(err => {
            console.error('❌ KV sync error:', err);
          });
      }
    }

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
 * Deletion order:
 * 1. Get agent_pages slug for KV deletion
 * 2. DELETE FROM user_invitations WHERE user_id = ?
 * 3. DELETE FROM agent_pages WHERE user_id = ?
 * 4. DELETE FROM users WHERE id = ?
 * 5. Delete profile picture from Cloudflare R2
 * 6. Delete agent page from Cloudflare KV
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

    // Step 1: Get agent page slug before deletion (for KV cleanup)
    const { data: agentPage } = await supabase
      .from('agent_pages')
      .select('slug')
      .eq('user_id', userId)
      .single();

    const agentPageSlug = agentPage?.slug;

    // Step 2: Delete user_invitations records (foreign key dependency)
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

    // Step 3: Delete agent_pages records (foreign key dependency)
    const { error: agentPagesError, count: agentPagesCount } = await supabase
      .from('agent_pages')
      .delete()
      .eq('user_id', userId);

    if (agentPagesError) {
      console.error('❌ Error deleting agent_pages:', agentPagesError);
      // Non-critical - continue with user deletion
    }

    // Step 4: Delete user record
    const { error: deleteError } = await supabase
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

    // Step 5: Delete profile picture from Cloudflare R2 (non-blocking)
    let r2DeleteResult: { success: boolean; error?: string } = { success: false, error: 'Not attempted' };
    try {
      r2DeleteResult = await deleteProfilePicture(userId);
      if (!r2DeleteResult.success) {
        console.warn('⚠️ Failed to delete profile picture from R2:', r2DeleteResult.error);
      }
    } catch (r2Error) {
      console.warn('⚠️ R2 deletion error:', r2Error);
    }

    // Step 6: Delete agent page from Cloudflare KV (non-blocking)
    let kvDeleteResult: { success: boolean; error?: string } = { success: false, error: 'Not attempted' };
    if (agentPageSlug) {
      try {
        kvDeleteResult = await deleteAgentPageFromKV(agentPageSlug);
        if (!kvDeleteResult.success) {
          console.warn('⚠️ Failed to delete agent page from KV:', kvDeleteResult.error);
        }
      } catch (kvError) {
        console.warn('⚠️ KV deletion error:', kvError);
      }
    }

    // Audit log for deletion
    console.log('✅ User deleted successfully:', {
      userId,
      email: existingUser.email,
      username: existingUser.username,
      invitationsDeleted: invitationsCount || 0,
      agentPagesDeleted: agentPagesCount || 0,
      agentPageSlug: agentPageSlug || 'none',
      r2Deleted: r2DeleteResult.success,
      kvDeleted: kvDeleteResult.success,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'User and all associated data deleted successfully',
      details: {
        cloudflareR2: r2DeleteResult.success ? 'cleaned' : 'no image found',
        cloudflareKV: agentPageSlug ? (kvDeleteResult.success ? 'cleaned' : 'failed') : 'no agent page',
      },
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
