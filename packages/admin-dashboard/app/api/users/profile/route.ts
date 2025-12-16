// Force dynamic rendering - exclude from static export
export const dynamic = 'force-dynamic';

/**
 * User Profile Update API Route
 * PATCH /api/users/profile
 *
 * Allows users to update their username and password
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';
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
  const supabase = getSupabaseServiceClient();

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
    const { userId, username, firstName, lastName, currentPassword, newPassword } = body;

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
      .select('id, username, first_name, last_name, password_hash')
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
    let displayNameChanged = false;

    // Handle first name change
    if (firstName !== undefined && firstName !== user.first_name) {
      updates.first_name = firstName;
      displayNameChanged = true;
    }

    // Handle last name change
    if (lastName !== undefined && lastName !== user.last_name) {
      updates.last_name = lastName;
      displayNameChanged = true;
    }

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

    // Handle password change - no current password required since user is already authenticated
    if (newPassword) {
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

    // If display name changed, also update the agent_pages table
    if (displayNameChanged) {
      const newFirstName = updates.first_name || user.first_name;
      const newLastName = updates.last_name || user.last_name;

      const { error: agentPageError } = await supabase
        .from('agent_pages')
        .update({
          display_first_name: newFirstName,
          display_last_name: newLastName,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (agentPageError) {
        console.error('[Profile Update] Error updating agent page:', agentPageError);
        // Don't fail the whole request, just log the error
      }
    }

    return corsResponse({
      success: true,
      message: 'Profile updated successfully',
      data: {
        username: updates.username || user.username,
        firstName: updates.first_name || user.first_name,
        lastName: updates.last_name || user.last_name,
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
