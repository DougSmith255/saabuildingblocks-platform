// Force dynamic rendering - exclude from static export
export const dynamic = 'error';

/**
 * Password Reset Request API Route
 * POST /api/auth/password-reset/request
 *
 * Initiates password reset flow by generating a secure token
 * and sending reset email to the user.
 *
 * Security Features:
 * - Rate limiting: 3 requests per hour per email
 * - Generic responses to prevent email enumeration
 * - Cryptographically secure tokens (32 bytes)
 * - 15-minute token expiration
 * - Audit logging
 */

import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { getSupabaseClient } from '@/app/master-controller/lib/supabaseClient';
import { hashToken, logAuthEvent, checkRateLimit } from '@/lib/auth/jwt';
import { passwordResetRequestSchema, formatZodErrors } from '@/lib/validation/password-schemas';

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_ATTEMPTS = 3;
const TOKEN_EXPIRY_MINUTES = 15;

/**
 * Mask email for security (show first 2 chars and domain)
 * Example: jo***@example.com
 */
function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (local.length <= 2) {
    return `${local[0]}***@${domain}`;
  }
  return `${local.substring(0, 2)}***@${domain}`;
}

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
    const validation = passwordResetRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(formatZodErrors(validation.error), { status: 400 });
    }

    const { email } = validation.data;

    // Rate limiting check (3 requests per hour per email)
    const rateLimitKey = `password-reset:${email.toLowerCase()}`;
    const rateLimit = checkRateLimit(rateLimitKey, RATE_LIMIT_MAX_ATTEMPTS, RATE_LIMIT_WINDOW_MS);

    if (!rateLimit.allowed) {
      await logAuthEvent({
        eventType: 'failed_login',
        success: false,
        ipAddress,
        userAgent,
        metadata: { reason: 'rate_limit_exceeded', email: maskEmail(email), action: 'password_reset' },
      });

      return NextResponse.json(
        {
          success: false,
          error: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many password reset attempts. Please try again later.',
          resetAt: new Date(rateLimit.resetAt).toISOString(),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': String(RATE_LIMIT_MAX_ATTEMPTS),
            'X-RateLimit-Remaining': String(rateLimit.remaining),
            'X-RateLimit-Reset': String(Math.floor(rateLimit.resetAt / 1000)),
          },
        }
      );
    }

    // Find user by email (case-insensitive)
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, username')
      .ilike('email', email)
      .single();

    // ALWAYS return success to prevent email enumeration
    // But only actually send email if user exists
    const maskedEmail = maskEmail(email);
    const genericResponse = {
      success: true,
      message: `If an account exists with ${maskedEmail}, a password reset link has been sent.`,
      data: {
        email: maskedEmail,
        expiresIn: TOKEN_EXPIRY_MINUTES * 60, // seconds
      },
    };

    if (userError || !user) {
      // Log failed attempt but return generic success
      await logAuthEvent({
        eventType: 'failed_login',
        success: false,
        ipAddress,
        userAgent,
        metadata: { reason: 'user_not_found', email: maskedEmail, action: 'password_reset' },
      });

      return NextResponse.json(genericResponse);
    }

    // Check if user account is active
    const { data: userStatus } = await supabase
      .from('users')
      .select('status')
      .eq('id', user.id)
      .single();

    if (userStatus?.status !== 'active') {
      // Don't reveal account status - return generic success
      await logAuthEvent({
        userId: user.id,
        eventType: 'failed_login',
        success: false,
        ipAddress,
        userAgent,
        metadata: { reason: 'account_inactive', action: 'password_reset' },
      });

      return NextResponse.json(genericResponse);
    }

    // Generate cryptographically secure token (32 bytes = 64 hex chars)
    const resetToken = randomBytes(32).toString('hex');
    const tokenHash = hashToken(resetToken);
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000);

    // Invalidate any existing reset tokens for this user
    await supabase
      .from('password_reset_tokens')
      .update({ used_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .is('used_at', null);

    // Store hashed token in database
    const { error: tokenError } = await supabase
      .from('password_reset_tokens')
      .insert({
        user_id: user.id,
        token_hash: tokenHash,
        expires_at: expiresAt.toISOString(),
        ip_address: ipAddress,
      });

    if (tokenError) {
      console.error('[Password Reset] Token creation error:', tokenError);
      return NextResponse.json(
        {
          success: false,
          error: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create password reset token',
        },
        { status: 500 }
      );
    }

    // Log successful password reset request
    await logAuthEvent({
      userId: user.id,
      eventType: 'failed_login', // Using failed_login for password events
      success: true,
      ipAddress,
      userAgent,
      metadata: {
        action: 'password_reset_requested',
        expiresAt: expiresAt.toISOString(),
      },
    });

    // Send email with reset link using email service
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'https://saabuildingblocks.com'}/login/reset-password/${resetToken}`;

    // Import email sending function
    const { sendPasswordResetEmail } = await import('@/lib/email/send');

    // Send password reset email
    const emailResult = await sendPasswordResetEmail(
      user.email,
      user.username,
      resetToken,
      TOKEN_EXPIRY_MINUTES
    );

    if (!emailResult.success) {
      console.error('[Password Reset] Failed to send email:', emailResult.error);
      // Don't fail the request - just log the error
    }

    console.log(`[Password Reset] Token generated for user ${user.id}. Email sent: ${emailResult.success}`);

    return NextResponse.json(genericResponse);
  } catch (error) {
    console.error('[Password Reset Request] Error:', error);

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
