// Force dynamic rendering - exclude from static export
export const dynamic = 'error';

/**
 * Logout API Route
 * POST /api/auth/logout
 *
 * Invalidates refresh token and clears cookies
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/app/master-controller/lib/supabaseClient';
import { verifyAccessToken, hashToken, logAuthEvent } from '@/lib/auth/jwt';

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

    // Get access token from Authorization header
    const authHeader = request.headers.get('authorization');
    const accessToken = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null;

    // Get refresh token from cookie
    const refreshToken = request.cookies.get('refreshToken')?.value;

    let userId: string | undefined;

    // Verify access token if provided
    if (accessToken) {
      const { valid, payload } = await verifyAccessToken(accessToken);
      if (valid && payload) {
        userId = payload.sub;
      }
    }

    // Invalidate refresh token in database
    if (refreshToken) {
      const tokenHash = hashToken(refreshToken);

      const { data: tokenData } = await supabase
        .from('refresh_tokens')
        .select('user_id')
        .eq('token_hash', tokenHash)
        .single();

      if (tokenData) {
        userId = tokenData.user_id;

        // Mark token as invalid
        await supabase
          .from('refresh_tokens')
          .update({
            is_valid: false,
            revoked_at: new Date().toISOString(),
          })
          .eq('token_hash', tokenHash);
      }
    }

    // Log logout event
    if (userId) {
      await logAuthEvent({
        userId,
        eventType: 'logout',
        success: true,
        ipAddress,
        userAgent,
      });
    }

    // Create response and clear refresh token cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[Logout API] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred during logout',
      },
      { status: 500 }
    );
  }
}
