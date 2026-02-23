/**
 * Admin Authorization Middleware
 *
 * Verifies JWT access token and checks if user has admin role.
 * Uses verifyAccessToken from lib/auth/jwt.ts (custom JWT, not Supabase Auth).
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { createClient } from '@/lib/supabase/server';

export interface AdminAuthResult {
  authorized: boolean;
  userId?: string;
  role?: string;
  error?: string;
  status?: number;
}

/**
 * Verify that the request has a valid JWT and the user exists.
 * Does NOT require admin role — use verifyAdminAuth for admin-only routes.
 */
export async function verifyAuth(request: NextRequest): Promise<AdminAuthResult> {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        authorized: false,
        error: 'Missing or invalid Authorization header',
        status: 401,
      };
    }

    const token = authHeader.substring(7);

    // Verify JWT access token
    const { valid, payload, error: tokenError } = await verifyAccessToken(token);

    if (!valid || !payload) {
      return {
        authorized: false,
        error: tokenError || 'Invalid or expired token',
        status: 401,
      };
    }

    const supabase = getSupabaseServiceClient();

    if (!supabase) {
      return {
        authorized: false,
        error: 'Database connection unavailable',
        status: 503,
      };
    }

    // Verify user exists and is active in database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, role, status')
      .eq('id', payload.sub)
      .single();

    if (userError || !userData) {
      return {
        authorized: false,
        error: 'User not found',
        status: 404,
      };
    }

    if (userData.status !== 'active') {
      return {
        authorized: false,
        error: 'Account is not active',
        status: 403,
      };
    }

    return {
      authorized: true,
      userId: userData.id,
      role: userData.role,
    };
  } catch (error) {
    return {
      authorized: false,
      error: 'Internal server error',
      status: 500,
    };
  }
}

/**
 * Verify admin authorization
 *
 * Checks Authorization header for JWT token and verifies user is admin
 */
export async function verifyAdminAuth(request: NextRequest): Promise<AdminAuthResult> {
  const result = await verifyAuth(request);

  if (!result.authorized) {
    return result;
  }

  // Check if user is admin
  if (result.role !== 'admin') {
    return {
      authorized: false,
      error: 'Forbidden - Admin access required',
      status: 403,
    };
  }

  return result;
}

/**
 * Verify admin authorization via Supabase session cookies.
 * Use this for Master Controller and 404 Triage routes (browser-based, no Bearer token).
 */
export async function verifySessionAdminAuth(): Promise<AdminAuthResult> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        authorized: false,
        error: 'Unauthorized',
        status: 401,
      };
    }

    const serviceClient = getSupabaseServiceClient();
    if (!serviceClient) {
      return {
        authorized: false,
        error: 'Database connection unavailable',
        status: 503,
      };
    }

    const { data: userData } = await serviceClient
      .from('users')
      .select('id, role')
      .eq('id', user.id)
      .single();

    if (!userData || userData.role !== 'admin') {
      return {
        authorized: false,
        error: 'Forbidden - Admin access required',
        status: 403,
      };
    }

    return {
      authorized: true,
      userId: userData.id,
      role: userData.role,
    };
  } catch {
    return {
      authorized: false,
      error: 'Internal server error',
      status: 500,
    };
  }
}

/**
 * Middleware wrapper for admin-only endpoints
 */
export async function requireAdmin(
  request: NextRequest,
  handler: (request: NextRequest, userId: string) => Promise<NextResponse>
): Promise<NextResponse> {
  const authResult = await verifyAdminAuth(request);

  if (!authResult.authorized) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status || 401 }
    );
  }

  return handler(request, authResult.userId!);
}
