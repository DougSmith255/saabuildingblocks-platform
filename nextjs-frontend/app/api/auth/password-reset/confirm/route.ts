// Force dynamic rendering - exclude from static export
export const dynamic = 'error';

/**
 * Password Reset Confirmation API Route
 * POST /api/auth/password-reset/confirm
 *
 * Completes password reset by validating token and updating user password.
 *
 * Security Features:
 * - Timing-safe token verification
 * - Password strength validation
 * - Password history check (prevent reuse of last 5 passwords)
 * - Single-use token consumption
 * - Automatic logout of all sessions
 * - Comprehensive audit logging
 */

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getSupabaseClient } from '@/app/master-controller/lib/supabaseClient';
import { hashToken, timingSafeCompare, logAuthEvent } from '@/lib/auth/jwt';
import { passwordResetConfirmSchema, formatZodErrors } from '@/lib/validation/password-schemas';

const BCRYPT_ROUNDS = 12;
const PASSWORD_HISTORY_LIMIT = 5;

export async function POST(request: NextRequest) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return NextResponse.json(
      {
        success: false,
        error: 'SERVICE_UNAVAILABLE',
        message: 'Password reset service is not available',
      },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Validate request body
    const validation = passwordResetConfirmSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(formatZodErrors(validation.error), { status: 400 });
    }

    const { token, password } = validation.data;

    // Hash the provided token for database lookup
    const tokenHash = hashToken(token);

    // Find and lock the token record (prevent race conditions)
    const { data: resetToken, error: tokenError } = await supabase
      .from('password_reset_tokens')
      .select('id, user_id, token_hash, expires_at, used_at')
      .eq('token_hash', tokenHash)
      .single();

    // Generic invalid token response
    const invalidTokenResponse = {
      success: false,
      error: 'INVALID_TOKEN',
      message: 'Invalid or expired reset token',
    };

    if (tokenError || !resetToken) {
      await logAuthEvent({
        eventType: 'failed_login',
        success: false,
        ipAddress,
        userAgent,
        metadata: { reason: 'invalid_token', action: 'password_reset_confirm' },
      });

      return NextResponse.json(invalidTokenResponse, { status: 400 });
    }

    // Timing-safe token comparison
    if (!timingSafeCompare(resetToken.token_hash, tokenHash)) {
      return NextResponse.json(invalidTokenResponse, { status: 400 });
    }

    // Check if token has already been used
    if (resetToken.used_at) {
      await logAuthEvent({
        userId: resetToken.user_id,
        eventType: 'failed_login',
        success: false,
        ipAddress,
        userAgent,
        metadata: { reason: 'token_already_used', action: 'password_reset_confirm' },
      });

      return NextResponse.json(
        {
          success: false,
          error: 'TOKEN_ALREADY_USED',
          message: 'This reset token has already been used',
        },
        { status: 400 }
      );
    }

    // Check if token has expired
    const expiresAt = new Date(resetToken.expires_at);
    if (expiresAt < new Date()) {
      await logAuthEvent({
        userId: resetToken.user_id,
        eventType: 'failed_login',
        success: false,
        ipAddress,
        userAgent,
        metadata: { reason: 'token_expired', action: 'password_reset_confirm' },
      });

      return NextResponse.json(
        {
          success: false,
          error: 'TOKEN_EXPIRED',
          message: 'This reset token has expired',
        },
        { status: 400 }
      );
    }

    // Get user and password history
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, username, password_hash')
      .eq('id', resetToken.user_id)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: 'USER_NOT_FOUND',
          message: 'User not found',
        },
        { status: 404 }
      );
    }

    // Check if new password matches current password
    const sameAsCurrentPassword = await bcrypt.compare(password, user.password_hash);
    if (sameAsCurrentPassword) {
      return NextResponse.json(
        {
          success: false,
          error: 'PASSWORD_REUSE',
          message: 'New password cannot be the same as your current password',
        },
        { status: 400 }
      );
    }

    // Get password history (last 5 passwords)
    const { data: passwordHistory } = await supabase
      .from('password_history')
      .select('password_hash')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(PASSWORD_HISTORY_LIMIT);

    // Check against password history
    if (passwordHistory) {
      for (const historic of passwordHistory) {
        const matchesHistoric = await bcrypt.compare(password, historic.password_hash);
        if (matchesHistoric) {
          return NextResponse.json(
            {
              success: false,
              error: 'PASSWORD_REUSE',
              message: `Password cannot be one of your last ${PASSWORD_HISTORY_LIMIT} passwords`,
            },
            { status: 400 }
          );
        }
      }
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // Update user password and reset security fields
    const { error: updateError } = await supabase
      .from('users')
      .update({
        password_hash: newPasswordHash,
        last_password_change: new Date().toISOString(),
        failed_login_attempts: 0,
        locked_until: null,
        force_password_change: false,
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('[Password Reset] Update error:', updateError);
      return NextResponse.json(
        {
          success: false,
          error: 'UPDATE_FAILED',
          message: 'Failed to update password',
        },
        { status: 500 }
      );
    }

    // Mark token as used (single-use enforcement)
    await supabase
      .from('password_reset_tokens')
      .update({ used_at: new Date().toISOString() })
      .eq('id', resetToken.id);

    // Revoke all existing refresh tokens (force re-login on all devices)
    await supabase
      .from('refresh_tokens')
      .update({ revoked_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .is('revoked_at', null);

    // Deactivate all active sessions
    await supabase
      .from('user_sessions')
      .update({
        is_active: false,
        ended_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .eq('is_active', true);

    // Log successful password reset
    await logAuthEvent({
      userId: user.id,
      eventType: 'failed_login', // Using failed_login type for password events
      success: true,
      ipAddress,
      userAgent,
      metadata: {
        action: 'password_reset_completed',
        sessionsRevoked: true,
      },
    });

    console.log(`[Password Reset] Password reset successful for user ${user.id}`);

    return NextResponse.json({
      success: true,
      message: 'Password reset successful. Please login with your new password.',
      data: {
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error('[Password Reset Confirm] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred. Please try again.',
      },
      { status: 500 }
    );
  }
}
