// Force dynamic rendering - exclude from static export
export const dynamic = 'force-dynamic';

/**
 * Password Reset Confirmation API Route
 * POST /api/auth/password-reset/confirm
 *
 * Completes password reset by validating JWT token and updating user password.
 *
 * Security Features:
 * - JWT token verification with expiration check
 * - Password fingerprint validation (token invalid after password change)
 * - Password strength validation
 * - Password history check (prevent reuse of current password)
 * - Automatic logout of all sessions
 * - Comprehensive audit logging
 */

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';
import { logAuthEvent } from '@/lib/auth/jwt';
import { passwordResetConfirmSchema, formatZodErrors } from '@/lib/validation/password-schemas';

const BCRYPT_ROUNDS = 12;

// CORS headers for cross-origin requests
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

// JWT secret for password reset tokens
const PASSWORD_RESET_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-min-32-chars-replace-in-production'
);

interface PasswordResetPayload {
  sub: string;      // User ID
  type: string;     // Should be 'password_reset'
  pwfp: string;     // Password fingerprint
  exp: number;      // Expiration
}

export async function POST(request: NextRequest) {
  const supabase = getSupabaseServiceClient();

  if (!supabase) {
    return corsResponse(
      {
        success: false,
        error: 'SERVICE_UNAVAILABLE',
        message: 'Password reset service is not available',
      },
      503
    );
  }

  try {
    const body = await request.json();
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Validate request body
    const validation = passwordResetConfirmSchema.safeParse(body);
    if (!validation.success) {
      return corsResponse(formatZodErrors(validation.error), 400);
    }

    const { token, password } = validation.data;

    // Generic invalid token response
    const invalidTokenResponse = {
      success: false,
      error: 'INVALID_TOKEN',
      message: 'Invalid or expired reset token',
    };

    // Verify JWT token
    let payload: PasswordResetPayload;
    try {
      const { payload: verified } = await jwtVerify(token, PASSWORD_RESET_SECRET);
      payload = verified as unknown as PasswordResetPayload;

      console.log('[Password Reset] Token verified for user:', payload.sub);
    } catch (jwtError) {
      console.error('[Password Reset] JWT verification failed:', jwtError);
      await logAuthEvent({
        eventType: 'failed_login',
        success: false,
        ipAddress,
        userAgent,
        metadata: { reason: 'invalid_jwt_token', action: 'password_reset_confirm' },
      });

      return corsResponse(invalidTokenResponse, 400);
    }

    // Validate token type
    if (payload.type !== 'password_reset') {
      return corsResponse(invalidTokenResponse, 400);
    }

    // Get user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, username, password_hash, status')
      .eq('id', payload.sub)
      .single();

    if (userError || !user) {
      await logAuthEvent({
        eventType: 'failed_login',
        success: false,
        ipAddress,
        userAgent,
        metadata: { reason: 'user_not_found', userId: payload.sub, action: 'password_reset_confirm' },
      });

      return corsResponse(
        {
          success: false,
          error: 'USER_NOT_FOUND',
          message: 'User not found',
        },
        404
      );
    }

    // Verify password fingerprint - ensures token is invalid after password change
    const currentPasswordFingerprint = (user.password_hash || '').substring(0, 8);
    if (payload.pwfp !== currentPasswordFingerprint) {
      await logAuthEvent({
        userId: user.id,
        eventType: 'failed_login',
        success: false,
        ipAddress,
        userAgent,
        metadata: { reason: 'token_invalidated_password_changed', action: 'password_reset_confirm' },
      });

      return corsResponse(
        {
          success: false,
          error: 'TOKEN_INVALIDATED',
          message: 'This reset token is no longer valid. Please request a new password reset.',
        },
        400
      );
    }

    // Check if user is active
    if (user.status !== 'active') {
      return corsResponse(
        {
          success: false,
          error: 'ACCOUNT_INACTIVE',
          message: 'Account is not active',
        },
        403
      );
    }

    // Check if new password matches current password
    if (user.password_hash) {
      const sameAsCurrentPassword = await bcrypt.compare(password, user.password_hash);
      if (sameAsCurrentPassword) {
        return corsResponse(
          {
            success: false,
            error: 'PASSWORD_REUSE',
            message: 'New password cannot be the same as your current password',
          },
          400
        );
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
      return corsResponse(
        {
          success: false,
          error: 'UPDATE_FAILED',
          message: 'Failed to update password',
        },
        500
      );
    }

    // Revoke all existing refresh tokens (force re-login on all devices)
    // These tables may not exist, so we ignore errors
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

    return corsResponse({
      success: true,
      message: 'Password reset successful. Please login with your new password.',
      data: {
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error('[Password Reset Confirm] Error:', error);

    return corsResponse(
      {
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred. Please try again.',
      },
      500
    );
  }
}
