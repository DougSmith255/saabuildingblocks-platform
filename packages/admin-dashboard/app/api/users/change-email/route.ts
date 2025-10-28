// Force dynamic rendering - exclude from static export
export const dynamic = 'force-dynamic';

/**
 * Email Change API Route
 * POST /api/users/change-email
 *
 * Initiates email change flow by:
 * 1. Verifying user's password
 * 2. Generating secure verification token
 * 3. Storing pending change in email_change_requests table
 * 4. Sending verification email to NEW email address
 * 5. Email only updates after user clicks verification link
 *
 * Security Features:
 * - Password verification required
 * - Rate limiting: 3 requests per hour per user
 * - Cryptographically secure tokens (32 bytes)
 * - 24-hour token expiration
 * - New email must be verified before change takes effect
 * - Audit logging
 */

import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';
import { getSupabaseClient } from '@/app/master-controller/lib/supabaseClient';
import { hashToken, logAuthEvent, checkRateLimit } from '@/lib/auth/jwt';
import { z } from 'zod';

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_ATTEMPTS = 3;
const TOKEN_EXPIRY_HOURS = 24;

// ============================================================================
// Validation Schema
// ============================================================================

const emailChangeRequestSchema = z.object({
  current_email: z.string().email('Invalid current email address'),
  new_email: z.string().email('Invalid new email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type EmailChangeRequest = z.infer<typeof emailChangeRequestSchema>;

function formatZodErrors(error: z.ZodError) {
  return {
    success: false,
    error: 'VALIDATION_ERROR',
    message: 'Validation failed',
    errors: error.issues.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    })),
  };
}

// ============================================================================
// Main Handler
// ============================================================================

export async function POST(request: NextRequest) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return NextResponse.json(
      {
        success: false,
        error: 'SERVICE_UNAVAILABLE',
        message: 'Email change service is not available',
      },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Validate request body
    const validation = emailChangeRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(formatZodErrors(validation.error), { status: 400 });
    }

    const { current_email, new_email, password } = validation.data;

    // Check if emails are the same
    if (current_email.toLowerCase() === new_email.toLowerCase()) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_EMAIL',
          message: 'New email must be different from current email',
        },
        { status: 400 }
      );
    }

    // Find user by current email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', current_email)
      .single();

    if (userError || !user) {
      await logAuthEvent({
        eventType: 'failed_login',
        success: false,
        ipAddress,
        userAgent,
        metadata: { reason: 'user_not_found', action: 'email_change', email: current_email },
      });

      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
        { status: 401 }
      );
    }

    // Rate limiting check (3 requests per hour per user)
    const rateLimitKey = `email-change:${user.id}`;
    const rateLimit = checkRateLimit(rateLimitKey, RATE_LIMIT_MAX_ATTEMPTS, RATE_LIMIT_WINDOW_MS);

    if (!rateLimit.allowed) {
      await logAuthEvent({
        userId: user.id,
        eventType: 'failed_login',
        success: false,
        ipAddress,
        userAgent,
        metadata: { reason: 'rate_limit_exceeded', action: 'email_change' },
      });

      return NextResponse.json(
        {
          success: false,
          error: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many email change requests. Please try again later.',
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

    // Verify password
    const passwordValid = await bcrypt.compare(password, user.password_hash);

    if (!passwordValid) {
      await logAuthEvent({
        userId: user.id,
        eventType: 'failed_login',
        success: false,
        ipAddress,
        userAgent,
        metadata: { reason: 'invalid_password', action: 'email_change' },
      });

      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
        { status: 401 }
      );
    }

    // Check if new email is already in use
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', new_email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'EMAIL_IN_USE',
          message: 'This email address is already associated with another account',
        },
        { status: 409 }
      );
    }

    // Check if there's already a pending email change request for this new email
    const { data: existingRequest } = await supabase
      .from('email_change_requests')
      .select('*')
      .eq('new_email', new_email)
      .is('verified_at', null)
      .gte('expires_at', new Date().toISOString())
      .single();

    if (existingRequest) {
      return NextResponse.json(
        {
          success: false,
          error: 'EMAIL_CHANGE_PENDING',
          message: 'There is already a pending email change request for this email address',
        },
        { status: 409 }
      );
    }

    // Generate cryptographically secure token (32 bytes = 64 hex chars)
    const verificationToken = randomBytes(32).toString('hex');
    const tokenHash = hashToken(verificationToken);
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

    // Invalidate any existing email change requests for this user
    await supabase
      .from('email_change_requests')
      .delete()
      .eq('user_id', user.id)
      .is('verified_at', null);

    // Store email change request in database
    const { error: requestError } = await supabase
      .from('email_change_requests')
      .insert({
        user_id: user.id,
        old_email: current_email,
        new_email: new_email,
        token: tokenHash,
        expires_at: expiresAt.toISOString(),
        ip_address: ipAddress,
      });

    if (requestError) {
      console.error('[Email Change] Request creation error:', requestError);
      return NextResponse.json(
        {
          success: false,
          error: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create email change request',
        },
        { status: 500 }
      );
    }

    // Log successful email change request
    await logAuthEvent({
      userId: user.id,
      eventType: 'failed_login', // Using failed_login for email change events
      success: true,
      ipAddress,
      userAgent,
      metadata: {
        action: 'email_change_requested',
        old_email: current_email,
        new_email: new_email,
        expiresAt: expiresAt.toISOString(),
      },
    });

    // Send verification email to NEW email address
    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL || 'https://saabuildingblocks.com'}/verify-email-change/${verificationToken}`;

    // Import email sending function
    const { sendEmailChangeVerification } = await import('@/lib/email/send');

    // Send email verification
    const emailResult = await sendEmailChangeVerification(
      new_email,
      user.username,
      current_email,
      verificationToken,
      TOKEN_EXPIRY_HOURS
    );

    if (!emailResult.success) {
      console.error('[Email Change] Failed to send verification email:', emailResult.error);
      // Don't fail the request - the token is still valid
    }

    console.log(`[Email Change] Verification token generated for user ${user.id}. Email sent: ${emailResult.success}`);

    return NextResponse.json({
      success: true,
      message: `A verification email has been sent to ${new_email}. Please check your inbox and click the verification link to complete the email change.`,
      data: {
        new_email: new_email,
        expires_in: TOKEN_EXPIRY_HOURS * 60 * 60, // seconds
        expires_at: expiresAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('[Email Change] Error:', error);

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
