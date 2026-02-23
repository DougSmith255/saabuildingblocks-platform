// Force dynamic rendering - exclude from static export
export const dynamic = 'force-dynamic';

/**
 * Password Reset Token Verification API Route
 * POST /api/auth/password-reset/verify
 *
 * Verifies the validity of a password reset JWT token without consuming it.
 * Used to validate token before showing password reset form.
 *
 * Security Features:
 * - JWT signature and expiration verification
 * - Password fingerprint validation
 * - No user information disclosure
 */

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';
import { tokenVerificationSchema, formatZodErrors } from '@/lib/validation/password-schemas';

// JWT secret for password reset tokens — fails at runtime if not set
function getPasswordResetSecret(): Uint8Array {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return new TextEncoder().encode(process.env.JWT_SECRET);
}

interface PasswordResetPayload {
  sub: string;      // User ID
  type: string;     // Should be 'password_reset'
  pwfp: string;     // Password fingerprint
  exp: number;      // Expiration
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = tokenVerificationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(formatZodErrors(validation.error), { status: 400 });
    }

    const { token } = validation.data;

    // Generic invalid token response to prevent enumeration
    const invalidTokenResponse = {
      success: false,
      error: 'INVALID_TOKEN',
      message: 'Invalid or expired reset token',
    };

    // Verify JWT token
    let payload: PasswordResetPayload;
    try {
      const { payload: verified } = await jwtVerify(token, getPasswordResetSecret());
      payload = verified as unknown as PasswordResetPayload;
    } catch {
      return NextResponse.json(invalidTokenResponse, { status: 400 });
    }

    // Validate token type
    if (payload.type !== 'password_reset') {
      return NextResponse.json(invalidTokenResponse, { status: 400 });
    }

    // Verify password fingerprint hasn't changed (token invalidated on password change)
    const supabase = getSupabaseServiceClient();
    if (supabase) {
      const { data: user } = await supabase
        .from('users')
        .select('password_hash')
        .eq('id', payload.sub)
        .single();

      if (user) {
        const currentFingerprint = (user.password_hash || '').substring(0, 8);
        if (payload.pwfp !== currentFingerprint) {
          return NextResponse.json(
            {
              success: false,
              error: 'TOKEN_INVALIDATED',
              message: 'This reset token is no longer valid. Please request a new password reset.',
            },
            { status: 400 }
          );
        }
      }
    }

    // Token is valid — return remaining time
    const now = Math.floor(Date.now() / 1000);
    const timeRemaining = payload.exp - now;

    return NextResponse.json({
      success: true,
      message: 'Token is valid',
      data: {
        valid: true,
        expiresIn: timeRemaining,
        expiresAt: new Date(payload.exp * 1000).toISOString(),
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
