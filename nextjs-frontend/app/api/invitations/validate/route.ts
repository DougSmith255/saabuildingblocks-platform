/**
 * Validate Invitation Token API Route
 *
 * GET /api/invitations/validate - Validate invitation token
 *
 * PUBLIC endpoint (no auth) with rate limiting
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';
import { validateInvitationTokenSchema } from '@/lib/validation/invitation';
import { rateLimit } from '@/lib/middleware/rate-limit';
import { createHash } from 'crypto';
import { ZodError } from 'zod';

export const dynamic = 'error';

/**
 * GET /api/invitations/validate - Validate invitation token
 *
 * Public endpoint to check if an invitation token is valid
 * Includes rate limiting to prevent brute force attacks
 */
export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting (5 attempts per minute per IP)
    const rateLimitResult = await rateLimit(request, {
      maxRequests: 5,
      windowMs: 60000, // 1 minute
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          valid: false,
          reason: 'rate_limit_exceeded',
          error: 'Too many validation attempts. Please try again later.'
        },
        {
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rateLimitResult.resetTime || Date.now() + 60000),
          },
        }
      );
    }

    const supabase = getSupabaseServiceClient();
    if (!supabase) {
      return NextResponse.json(
        { valid: false, reason: 'service_unavailable' },
        { status: 503 }
      );
    }

    // Get token from query parameter
    const token = request.nextUrl.searchParams.get('token');

    // Validate token format with Zod
    let validatedToken: string;
    try {
      const result = validateInvitationTokenSchema.parse({ token });
      validatedToken = result.token;
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            valid: false,
            reason: 'invalid_format',
            error: 'Invalid token format'
          },
          {
            status: 400,
            headers: {
              'X-RateLimit-Limit': '5',
              'X-RateLimit-Remaining': String(rateLimitResult.remaining || 0),
            },
          }
        );
      }
      throw error;
    }

    // Hash token using SHA-256 for database lookup
    const tokenHash = createHash('sha256')
      .update(validatedToken)
      .digest('hex');

    // Query database using token_hash (not plain token)
    const { data: invitation, error } = await supabase
      .from('user_invitations')
      .select('id, email, user_id, status, expires_at, created_at')
      .eq('token', tokenHash)
      .single();

    if (error || !invitation) {
      return NextResponse.json(
        {
          valid: false,
          reason: 'not_found',
          error: 'Invitation not found'
        },
        {
          status: 404,
          headers: {
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': String(rateLimitResult.remaining || 0),
          },
        }
      );
    }

    // Check if invitation has already been used
    if (invitation.status === 'accepted') {
      return NextResponse.json(
        {
          valid: false,
          reason: 'already_used',
          error: 'This invitation has already been used'
        },
        {
          status: 400,
          headers: {
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': String(rateLimitResult.remaining || 0),
          },
        }
      );
    }

    // Check if invitation is cancelled
    if (invitation.status === 'cancelled') {
      return NextResponse.json(
        {
          valid: false,
          reason: 'cancelled',
          error: 'This invitation has been cancelled'
        },
        {
          status: 400,
          headers: {
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': String(rateLimitResult.remaining || 0),
          },
        }
      );
    }

    // Check expiration using expires_at field (not calculated from created_at)
    const now = new Date();
    const expiresAt = new Date(invitation.expires_at);

    if (now > expiresAt) {
      // Update status to expired if not already
      if (invitation.status !== 'expired') {
        await supabase
          .from('user_invitations')
          .update({ status: 'expired', updated_at: now.toISOString() })
          .eq('id', invitation.id);
      }

      return NextResponse.json(
        {
          valid: false,
          reason: 'expired',
          error: 'This invitation has expired'
        },
        {
          status: 400,
          headers: {
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': String(rateLimitResult.remaining || 0),
          },
        }
      );
    }

    // Get user details (use full_name, not first_name)
    const { data: user } = await supabase
      .from('users')
      .select('id, email, name, status')
      .eq('id', invitation.user_id)
      .single();

    // Extract first name from full_name
    const firstName = user?.name?.split(' ')[0] || '';

    // Return success with CORS headers
    return NextResponse.json(
      {
        valid: true,
        firstName,
        email: invitation.email,
        expiresAt: invitation.expires_at,
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type',
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': String(rateLimitResult.remaining || 0),
        },
      }
    );
  } catch (error) {
    // Use structured logging (not console.log) - log to external service in production
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // In production, send to logging service (e.g., Sentry, LogRocket)
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to logging service
      // logger.error('Invitation validation error', { error: errorMessage });
    }

    return NextResponse.json(
      {
        valid: false,
        reason: 'server_error',
        error: 'An error occurred while validating the invitation'
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS handler for CORS preflight requests
 */
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
      },
    }
  );
}
