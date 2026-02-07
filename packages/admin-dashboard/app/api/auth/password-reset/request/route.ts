// Force dynamic rendering - exclude from static export
export const dynamic = 'force-dynamic';

/**
 * Password Reset Request API Route
 * POST /api/auth/password-reset/request
 *
 * Initiates password reset flow by generating a secure JWT token
 * and sending reset email to the user.
 *
 * Security Features:
 * - Rate limiting: 3 requests per 10 minutes per email
 * - Generic responses to prevent email enumeration
 * - Stateless JWT tokens (no database required)
 * - 15-minute token expiration
 * - Token includes user ID and password hash for validation
 */

import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';
import { logAuthEvent, checkRateLimit } from '@/lib/auth/jwt';
import { passwordResetRequestSchema, formatZodErrors } from '@/lib/validation/password-schemas';

// CORS headers for cross-origin requests (public site calls this API)
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
function corsResponse(body: object, status: number = 200, extraHeaders: Record<string, string> = {}) {
  return NextResponse.json(body, { status, headers: { ...CORS_HEADERS, ...extraHeaders } });
}

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX_ATTEMPTS = 3;
const TOKEN_EXPIRY_MINUTES = 15;

// JWT secret for password reset tokens (separate from auth tokens for security)
const PASSWORD_RESET_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-min-32-chars-replace-in-production'
);

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

/**
 * Generate a stateless JWT reset token
 * Includes user ID and password hash fingerprint to invalidate on password change
 */
async function generateResetToken(userId: string, passwordHash: string): Promise<string> {
  // Include first 8 chars of password hash - token will be invalid if password changes
  const passwordFingerprint = passwordHash.substring(0, 8);

  const token = await new SignJWT({
    sub: userId,
    type: 'password_reset',
    pwfp: passwordFingerprint, // Password fingerprint for invalidation
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_EXPIRY_MINUTES}m`)
    .setJti(crypto.randomUUID())
    .sign(PASSWORD_RESET_SECRET);

  return token;
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
    const validation = passwordResetRequestSchema.safeParse(body);
    if (!validation.success) {
      return corsResponse(formatZodErrors(validation.error), 400);
    }

    const { email } = validation.data;

    // Rate limiting check (3 requests per 10 minutes per email)
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

      return corsResponse(
        {
          success: false,
          error: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many password reset attempts. Please try again later.',
          resetAt: new Date(rateLimit.resetAt).toISOString(),
        },
        429,
        {
          'X-RateLimit-Limit': String(RATE_LIMIT_MAX_ATTEMPTS),
          'X-RateLimit-Remaining': String(rateLimit.remaining),
          'X-RateLimit-Reset': String(Math.floor(rateLimit.resetAt / 1000)),
        }
      );
    }

    // Find user by email (case-insensitive)
    console.log('[Password Reset] Looking up user with email:', maskEmail(email));
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, username, status, password_hash')
      .ilike('email', email)
      .single();

    console.log('[Password Reset] User lookup result:', { found: !!user, error: userError?.message });

    // ALWAYS return success to prevent email enumeration
    // But only actually send email if user exists
    const maskedEmail = maskEmail(email); // For logging only
    const genericResponse = {
      success: true,
      message: `If an account exists with ${email}, a password reset link has been sent.`,
      data: {
        email: email, // Show full email in response
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

      return corsResponse(genericResponse);
    }

    console.log('[Password Reset] User status:', user.status);

    if (user.status !== 'active') {
      // Don't reveal account status - return generic success
      await logAuthEvent({
        userId: user.id,
        eventType: 'failed_login',
        success: false,
        ipAddress,
        userAgent,
        metadata: { reason: 'account_inactive', action: 'password_reset' },
      });

      return corsResponse(genericResponse);
    }

    // Generate stateless JWT reset token
    console.log('[Password Reset] Generating JWT token for user:', user.id);
    const resetToken = await generateResetToken(user.id, user.password_hash || '');
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000);

    console.log('[Password Reset] Token generated successfully');

    // Log successful password reset request
    await logAuthEvent({
      userId: user.id,
      eventType: 'failed_login', // Using failed_login for password events (audit table)
      success: true,
      ipAddress,
      userAgent,
      metadata: {
        action: 'password_reset_requested',
        expiresAt: expiresAt.toISOString(),
      },
    });

    // Send email with reset link using email service
    console.log('[Password Reset] Preparing to send email to:', maskEmail(user.email));
    console.log('[Password Reset] RESEND_API_KEY configured:', !!process.env.RESEND_API_KEY);

    // Import email sending function
    const { sendPasswordResetEmail } = await import('@/lib/email/send');

    // Send password reset email
    console.log('[Password Reset] Calling sendPasswordResetEmail...');
    const emailResult = await sendPasswordResetEmail(
      user.email,
      user.username,
      resetToken,
      TOKEN_EXPIRY_MINUTES
    );

    console.log('[Password Reset] Email result:', JSON.stringify(emailResult));

    if (!emailResult.success) {
      console.error('[Password Reset] Failed to send email:', emailResult.error);
      // Don't fail the request - just log the error
    }

    console.log(`[Password Reset] Token generated for user ${user.id}. Email sent: ${emailResult.success}`);

    return corsResponse(genericResponse);
  } catch (error) {
    console.error('[Password Reset Request] Error:', error);

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
