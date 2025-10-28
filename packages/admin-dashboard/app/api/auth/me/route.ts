// Force dynamic rendering - exclude from static export
export const dynamic = 'force-dynamic';

/**
 * Current User Info API Route
 * GET /api/auth/me
 *
 * Returns information about the currently authenticated user
 * Protected route - requires valid access token
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/app/master-controller/lib/supabaseClient';
import { verifyAccessToken } from '@/lib/auth/jwt';

export async function GET(request: NextRequest) {
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
    // Get access token from Authorization header
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          error: 'AUTHENTICATION_REQUIRED',
          message: 'No access token provided',
        },
        { status: 401 }
      );
    }

    const accessToken = authHeader.substring(7);

    // Verify access token
    const { valid, payload, error } = await verifyAccessToken(accessToken);

    if (!valid || !payload) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_TOKEN',
          message: error || 'Access token is invalid or expired',
        },
        { status: 401 }
      );
    }

    // Get user data from database
    const { data: user, error: userError } = await supabase
      .from('users')
      .select(`
        id,
        username,
        email,
        full_name,
        display_name,
        avatar_url,
        bio,
        role,
        permissions,
        email_verified,
        email_verification_pending,
        is_active,
        created_at,
        last_login_at,
        metadata
      `)
      .eq('id', payload.sub)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: 'USER_NOT_FOUND',
          message: 'User account not found',
        },
        { status: 404 }
      );
    }

    // Check if account is active
    if (!user.is_active) {
      return NextResponse.json(
        {
          success: false,
          error: 'ACCOUNT_INACTIVE',
          message: 'Your account has been deactivated',
        },
        { status: 403 }
      );
    }

    // Return user information
    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        displayName: user.display_name,
        avatarUrl: user.avatar_url,
        bio: user.bio,
        role: user.role,
        permissions: user.permissions || [],
        emailVerified: user.email_verified,
        emailVerificationPending: user.email_verification_pending || false,
        isActive: user.is_active,
        createdAt: user.created_at,
        lastLoginAt: user.last_login_at,
        metadata: user.metadata || {},
      },
    });
  } catch (error) {
    console.error('[Get User Info API] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred while fetching user information',
      },
      { status: 500 }
    );
  }
}
