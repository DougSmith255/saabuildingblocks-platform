// Force dynamic rendering - exclude from static export
export const dynamic = 'force-dynamic';

/**
 * Username Recovery API Route
 * POST /api/auth/username-recovery/request
 *
 * Sends username reminder email to the provided email address.
 * Implements security measures to prevent email enumeration.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/app/master-controller/lib/supabaseClient';
import { logAuthEvent, checkRateLimit } from '@/lib/auth/jwt';
import { formatZodErrors } from '@/lib/auth/schemas';
import {
  usernameRecoveryRequestSchema,
  maskEmail,
  GENERIC_SUCCESS_MESSAGE,
  GENERIC_ERROR_MESSAGE,
  USERNAME_RECOVERY_RATE_LIMIT,
} from '@/lib/auth/username-recovery-schema';

export async function POST(request: NextRequest) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return NextResponse.json(
      {
        success: false,
        error: 'SERVICE_UNAVAILABLE',
        message: 'Service is not available',
      },
      { status: 503 }
    );
  }

  try {
    // Extract request data
    const body = await request.json();
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Validate request body
    const validation = usernameRecoveryRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(formatZodErrors(validation.error), { status: 400 });
    }

    const { email } = validation.data;
    const maskedEmail = maskEmail(email);

    // Rate limiting check (3 attempts per hour per IP)
    const rateLimitKey = `${USERNAME_RECOVERY_RATE_LIMIT.IDENTIFIER_PREFIX}${ipAddress}`;
    const rateLimit = checkRateLimit(
      rateLimitKey,
      USERNAME_RECOVERY_RATE_LIMIT.MAX_ATTEMPTS,
      USERNAME_RECOVERY_RATE_LIMIT.WINDOW_MS
    );

    if (!rateLimit.allowed) {
      // Log rate limit exceeded
      await logAuthEvent({
        eventType: 'failed_login',
        success: false,
        ipAddress,
        userAgent,
        metadata: {
          reason: 'username_recovery_rate_limit',
          email: maskedEmail,
        },
      });

      return NextResponse.json(
        {
          success: false,
          error: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many username recovery requests. Please try again later.',
          resetAt: new Date(rateLimit.resetAt).toISOString(),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': String(USERNAME_RECOVERY_RATE_LIMIT.MAX_ATTEMPTS),
            'X-RateLimit-Remaining': String(rateLimit.remaining),
            'X-RateLimit-Reset': String(Math.floor(rateLimit.resetAt / 1000)),
          },
        }
      );
    }

    // Timing-safe lookup - always take same amount of time
    const lookupStart = Date.now();

    // Find user by email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, username, email, is_active')
      .eq('email', email)
      .single();

    // Calculate minimum response time (prevent timing attacks)
    const MIN_RESPONSE_TIME_MS = 300;
    const elapsed = Date.now() - lookupStart;
    if (elapsed < MIN_RESPONSE_TIME_MS) {
      await new Promise(resolve => setTimeout(resolve, MIN_RESPONSE_TIME_MS - elapsed));
    }

    // Log the attempt (always, regardless of whether email exists)
    await logAuthEvent({
      userId: user?.id || undefined,
      eventType: 'login', // Using login as closest match
      success: !!user && !userError,
      ipAddress,
      userAgent,
      metadata: {
        action: 'username_recovery_attempt',
        email: maskedEmail,
        userFound: !!user,
      },
    });

    // If user exists and is active, send email
    if (user && !userError && user.is_active) {
      // Import email sending function
      const { sendUsernameReminderEmail } = await import('@/lib/email/send');

      // Send username reminder email
      const emailResult = await sendUsernameReminderEmail(
        user.email,
        user.username
      );

      if (!emailResult.success) {
        console.error('[Username Recovery] Failed to send email:', emailResult.error);
        // Don't fail the request - just log the error
      }

      await logAuthEvent({
        userId: user.id,
        eventType: 'login',
        success: true,
        ipAddress,
        userAgent,
        metadata: {
          action: 'username_reminder_sent',
          email: maskedEmail,
          emailSent: emailResult.success,
        },
      });
    }

    // ALWAYS return generic success message (never reveal if email exists)
    return NextResponse.json({
      success: true,
      message: GENERIC_SUCCESS_MESSAGE,
      data: {
        email: maskedEmail, // Show masked email for user confirmation
      },
    });

  } catch (error) {
    console.error('[Username Recovery API] Error:', error);

    // Log the error
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    await logAuthEvent({
      eventType: 'failed_login',
      success: false,
      ipAddress,
      userAgent,
      metadata: {
        action: 'username_recovery_error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });

    // Return generic error (no details)
    return NextResponse.json(
      {
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: GENERIC_ERROR_MESSAGE,
      },
      { status: 500 }
    );
  }
}
