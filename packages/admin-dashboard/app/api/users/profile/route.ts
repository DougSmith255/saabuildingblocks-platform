// Force dynamic rendering - exclude from static export
export const dynamic = 'force-dynamic';

/**
 * User Profile Update API Route
 * PATCH /api/users/profile
 *
 * Allows users to update their username and password
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/app/master-controller/lib/supabaseClient';
import bcrypt from 'bcryptjs';

// CORS headers for cross-origin requests
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

// Helper to add CORS headers to responses
function corsResponse(body: object, status: number = 200) {
  return NextResponse.json(body, { status, headers: CORS_HEADERS });
}

export async function PATCH(request: NextRequest) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return corsResponse(
      {
        success: false,
        error: 'SERVICE_UNAVAILABLE',
        message: 'Service is not available',
      },
      503
    );
  }

  try {
    const body = await request.json();
    const { userId, username, currentPassword, newPassword } = body;

    if (!userId) {
      return corsResponse(
        {
          success: false,
          error: 'MISSING_USER_ID',
          message: 'User ID is required',
        },
        400
      );
    }

    // Get current user data
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('id, username, password_hash')
      .eq('id', userId)
      .single();

    if (fetchError || !user) {
      return corsResponse(
        {
          success: false,
          error: 'USER_NOT_FOUND',
          message: 'User not found',
        },
        404
      );
    }

    const updates: any = {};

    // Handle username change
    if (username && username !== user.username) {
      // Check if username is already taken
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .neq('id', userId)
        .single();

      if (existingUser) {
        return corsResponse(
          {
            success: false,
            error: 'USERNAME_TAKEN',
            message: 'This username is already taken',
          },
          400
        );
      }

      updates.username = username;
    }

    // Handle password change
    if (newPassword) {
      if (!currentPassword) {
        return corsResponse(
          {
            success: false,
            error: 'CURRENT_PASSWORD_REQUIRED',
            message: 'Current password is required to change password',
          },
          400
        );
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isPasswordValid) {
        return corsResponse(
          {
            success: false,
            error: 'INVALID_PASSWORD',
            message: 'Current password is incorrect',
          },
          401
        );
      }

      // Validate new password
      if (newPassword.length < 8) {
        return corsResponse(
          {
            success: false,
            error: 'PASSWORD_TOO_SHORT',
            message: 'New password must be at least 8 characters',
          },
          400
        );
      }

      // Hash new password
      const saltRounds = 12;
      updates.password_hash = await bcrypt.hash(newPassword, saltRounds);
    }

    // If no updates, return success
    if (Object.keys(updates).length === 0) {
      return corsResponse({
        success: true,
        message: 'No changes to save',
      });
    }

    // Update user
    updates.updated_at = new Date().toISOString();

    const { error: updateError } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId);

    if (updateError) {
      console.error('[Profile Update] Error updating user:', updateError);
      return corsResponse(
        {
          success: false,
          error: 'UPDATE_FAILED',
          message: 'Failed to update profile',
        },
        500
      );
    }

    return corsResponse({
      success: true,
      message: 'Profile updated successfully',
      data: {
        username: updates.username || user.username,
      },
    });
  } catch (error) {
    console.error('[Profile Update API] Error:', error);

    return corsResponse(
      {
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
      },
      500
    );
  }
}
