// Force dynamic rendering - exclude from static export
export const dynamic = 'error';

/**
 * Password Reset Token Verification API Route
 * POST /api/auth/password-reset/verify
 *
 * Verifies the validity of a password reset token without consuming it.
 * Used to validate token before showing password reset form.
 *
 * Security Features:
 * - Timing-safe token comparison
 * - Expiration check
 * - Single-use validation
 * - No user information disclosure
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/app/master-controller/lib/supabaseClient';
import { hashToken, timingSafeCompare } from '@/lib/auth/jwt';
import { tokenVerificationSchema, formatZodErrors } from '@/lib/validation/password-schemas';

export async function POST(request: NextRequest) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return NextResponse.json(
      {
        success: false,
        error: 'SERVICE_UNAVAILABLE',
        message: 'Token verification service is not available',
      },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();

    // Validate request body
    const validation = tokenVerificationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(formatZodErrors(validation.error), { status: 400 });
    }

    const { token } = validation.data;

    // Hash the provided token for database lookup
    const tokenHash = hashToken(token);

    // Find token in database
    const { data: resetToken, error: tokenError } = await supabase
      .from('password_reset_tokens')
      .select('id, user_id, token_hash, expires_at, used_at')
      .eq('token_hash', tokenHash)
      .single();

    // Generic invalid token response to prevent enumeration
    const invalidTokenResponse = {
      success: false,
      error: 'INVALID_TOKEN',
      message: 'Invalid or expired reset token',
    };

    if (tokenError || !resetToken) {
      return NextResponse.json(invalidTokenResponse, { status: 400 });
    }

    // Timing-safe token comparison (prevent timing attacks)
    if (!timingSafeCompare(resetToken.token_hash, tokenHash)) {
      return NextResponse.json(invalidTokenResponse, { status: 400 });
    }

    // Check if token has already been used
    if (resetToken.used_at) {
      return NextResponse.json(
        {
          success: false,
          error: 'TOKEN_ALREADY_USED',
          message: 'This reset token has already been used. Please request a new one.',
        },
        { status: 400 }
      );
    }

    // Check if token has expired
    const expiresAt = new Date(resetToken.expires_at);
    const now = new Date();

    if (expiresAt < now) {
      return NextResponse.json(
        {
          success: false,
          error: 'TOKEN_EXPIRED',
          message: 'This reset token has expired. Please request a new one.',
          expiredAt: expiresAt.toISOString(),
        },
        { status: 400 }
      );
    }

    // Token is valid
    const timeRemaining = Math.floor((expiresAt.getTime() - now.getTime()) / 1000); // seconds

    return NextResponse.json({
      success: true,
      message: 'Token is valid',
      data: {
        valid: true,
        expiresIn: timeRemaining,
        expiresAt: expiresAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('[Password Reset Verify] Error:', error);

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
