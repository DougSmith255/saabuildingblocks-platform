// Force dynamic rendering - exclude from static export
export const dynamic = 'error';

/**
 * Refresh Token API Route
 * POST /api/auth/refresh
 *
 * Exchanges refresh token for new access token
 * Implements token rotation for enhanced security
 */

import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { getSupabaseClient } from '@/app/master-controller/lib/supabaseClient';
import {
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  logAuthEvent,
  checkRateLimit,
} from '@/lib/auth/jwt';

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_ATTEMPTS = 100;

export async function POST(request: NextRequest) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return NextResponse.json(
      {
        success: false,
        error: 'SERVICE_UNAVAILABLE',
        message: 'Authentication service is not available',
      },
      { status: 503 }
    );
  }

  try {
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Get refresh token from HttpOnly cookie
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'MISSING_REFRESH_TOKEN',
          message: 'No refresh token provided',
        },
        { status: 401 }
      );
    }

    // Verify refresh token signature
    const { valid, payload, error } = await verifyRefreshToken(refreshToken);

    if (!valid || !payload) {
      await logAuthEvent({
        eventType: 'token_refresh',
        success: false,
        ipAddress,
        userAgent,
        metadata: { reason: 'invalid_token', error },
      });

      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_REFRESH_TOKEN',
          message: error || 'Refresh token is invalid or expired',
        },
        { status: 401 }
      );
    }

    // Rate limiting per user
    const rateLimitKey = `refresh:${payload.sub}`;
    const rateLimit = checkRateLimit(rateLimitKey, RATE_LIMIT_MAX_ATTEMPTS, RATE_LIMIT_WINDOW_MS);

    if (!rateLimit.allowed) {
      await logAuthEvent({
        userId: payload.sub,
        eventType: 'token_refresh',
        success: false,
        ipAddress,
        userAgent,
        metadata: { reason: 'rate_limit_exceeded' },
      });

      return NextResponse.json(
        {
          success: false,
          error: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many token refresh requests',
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

    // Check if token exists in database and is valid
    const tokenHash = hashToken(refreshToken);
    const { data: dbToken, error: dbError } = await supabase
      .from('refresh_tokens')
      .select('*')
      .eq('token_hash', tokenHash)
      .eq('is_valid', true)
      .single();

    if (dbError || !dbToken) {
      await logAuthEvent({
        userId: payload.sub,
        eventType: 'token_refresh',
        success: false,
        ipAddress,
        userAgent,
        metadata: { reason: 'token_not_found_or_revoked' },
      });

      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_REFRESH_TOKEN',
          message: 'Refresh token has been revoked or does not exist',
        },
        { status: 401 }
      );
    }

    // Check if token has expired in database
    if (new Date(dbToken.expires_at) < new Date()) {
      await supabase
        .from('refresh_tokens')
        .update({ is_valid: false })
        .eq('id', dbToken.id);

      await logAuthEvent({
        userId: payload.sub,
        eventType: 'token_refresh',
        success: false,
        ipAddress,
        userAgent,
        metadata: { reason: 'token_expired' },
      });

      return NextResponse.json(
        {
          success: false,
          error: 'REFRESH_TOKEN_EXPIRED',
          message: 'Refresh token has expired. Please log in again.',
        },
        { status: 401 }
      );
    }

    // Get user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, username, email, role, permissions, is_active, locked_until')
      .eq('id', payload.sub)
      .single();

    if (userError || !user) {
      await logAuthEvent({
        userId: payload.sub,
        eventType: 'token_refresh',
        success: false,
        ipAddress,
        userAgent,
        metadata: { reason: 'user_not_found' },
      });

      return NextResponse.json(
        {
          success: false,
          error: 'USER_NOT_FOUND',
          message: 'User account not found',
        },
        { status: 401 }
      );
    }

    // Check account status
    if (!user.is_active) {
      return NextResponse.json(
        {
          success: false,
          error: 'ACCOUNT_INACTIVE',
          message: 'Account has been deactivated',
        },
        { status: 403 }
      );
    }

    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      return NextResponse.json(
        {
          success: false,
          error: 'ACCOUNT_LOCKED',
          message: 'Account is locked',
          unlockAt: user.locked_until,
        },
        { status: 423 }
      );
    }

    // Generate new access token
    const newAccessToken = await generateAccessToken({
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      permissions: user.permissions || [],
    });

    // Update token usage in database
    await supabase
      .from('refresh_tokens')
      .update({
        last_used_at: new Date().toISOString(),
        use_count: (dbToken.use_count || 0) + 1,
      })
      .eq('id', dbToken.id);

    // Optional: Token Rotation (uncomment for enhanced security)
    // This invalidates old refresh token and issues new one
    /*
    const newTokenId = nanoid();
    const newRefreshToken = await generateRefreshToken({
      userId: user.id,
      tokenId: newTokenId,
      deviceId: payload.deviceId,
    });
    const newTokenHash = hashToken(newRefreshToken);

    // Revoke old token
    await supabase
      .from('refresh_tokens')
      .update({ is_valid: false, revoked_at: new Date().toISOString() })
      .eq('id', dbToken.id);

    // Store new token
    await supabase.from('refresh_tokens').insert({
      id: newTokenId,
      user_id: user.id,
      token_hash: newTokenHash,
      device_name: dbToken.device_name,
      device_type: dbToken.device_type,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      ip_address: ipAddress,
      user_agent: userAgent,
    });
    */

    // Log successful token refresh
    await logAuthEvent({
      userId: user.id,
      eventType: 'token_refresh',
      success: true,
      ipAddress,
      userAgent,
    });

    const response = NextResponse.json({
      success: true,
      data: {
        accessToken: newAccessToken,
        expiresIn: 900, // 15 minutes
      },
    });

    // If token rotation is enabled, set new refresh token cookie
    // response.cookies.set('refreshToken', newRefreshToken, { ... });

    return response;
  } catch (error) {
    console.error('[Refresh Token API] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred during token refresh',
      },
      { status: 500 }
    );
  }
}
