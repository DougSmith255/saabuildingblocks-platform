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
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';
import { verifyAccessToken } from '@/lib/auth/jwt';

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://saabuildingblocks.com',
  'https://www.saabuildingblocks.com',
  'https://smartagentalliance.com',
  'https://www.smartagentalliance.com',
  'https://saabuildingblocks.pages.dev',
];

function getCorsHeaders(origin?: string | null): Record<string, string> {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    'Pragma': 'no-cache',
    'Vary': 'Origin',
  };
}

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(request.headers.get('origin')) });
}

export async function GET(request: NextRequest) {
  const supabase = getSupabaseServiceClient();

  if (!supabase) {
    return NextResponse.json(
      {
        success: false,
        error: 'SERVICE_UNAVAILABLE',
        message: 'Authentication service is not available',
      },
      { status: 503, headers: getCorsHeaders(request.headers.get('origin')) }
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
        { status: 401, headers: getCorsHeaders(request.headers.get('origin')) }
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
        { status: 401, headers: getCorsHeaders(request.headers.get('origin')) }
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
        first_name,
        last_name,
        profile_picture_url,
        role,
        status,
        email_verified,
        email_verification_pending,
        created_at,
        last_login_at,
        gender,
        is_leader,
        state
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
        { status: 404, headers: getCorsHeaders(request.headers.get('origin')) }
      );
    }

    // Check account status — reject suspended/deactivated users
    if (user.status && user.status !== 'active') {
      return NextResponse.json(
        {
          success: false,
          error: 'ACCOUNT_INACTIVE',
          message: 'Your account is not active',
        },
        { status: 403, headers: getCorsHeaders(request.headers.get('origin')) }
      );
    }

    // Return user information
    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        username: user.username || user.email,
        email: user.email,
        fullName: user.full_name,
        full_name: user.full_name,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_picture_url: user.profile_picture_url,
        profilePictureUrl: user.profile_picture_url,
        role: user.role,
        emailVerified: user.email_verified,
        emailVerificationPending: user.email_verification_pending || false,
        isActive: user.status === 'active',
        createdAt: user.created_at,
        lastLoginAt: user.last_login_at,
        gender: user.gender || 'male',
        is_leader: user.is_leader || false,
        state: user.state || null,
      },
    }, { headers: getCorsHeaders(request.headers.get('origin')) });
  } catch (error) {
    console.error('[Get User Info API] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred while fetching user information',
      },
      { status: 500, headers: getCorsHeaders(request.headers.get('origin')) }
    );
  }
}
