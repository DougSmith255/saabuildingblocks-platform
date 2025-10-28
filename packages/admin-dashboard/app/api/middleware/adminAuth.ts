/**
 * Admin Authorization Middleware
 *
 * Verifies JWT token and checks if user has admin role
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';

export interface AdminAuthResult {
  authorized: boolean;
  userId?: string;
  role?: string;
  error?: string;
  status?: number;
}

/**
 * Verify admin authorization
 *
 * Checks Authorization header for JWT token and verifies user is admin
 */
export async function verifyAdminAuth(request: NextRequest): Promise<AdminAuthResult> {
  try {
    const supabase = getSupabaseServiceClient();

    if (!supabase) {
      return {
        authorized: false,
        error: 'Database connection unavailable',
        status: 503,
      };
    }

    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        authorized: false,
        error: 'Missing or invalid Authorization header',
        status: 401,
      };
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify token with Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return {
        authorized: false,
        error: 'Invalid or expired token',
        status: 401,
      };
    }

    // Get user role from database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, role')
      .eq('id', user.id)
      .single();

    if (userError || !userData) {
      return {
        authorized: false,
        error: 'User not found',
        status: 404,
      };
    }

    // Check if user is admin
    if (userData.role !== 'admin') {
      return {
        authorized: false,
        error: 'Forbidden - Admin access required',
        status: 403,
      };
    }

    return {
      authorized: true,
      userId: user.id,
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
