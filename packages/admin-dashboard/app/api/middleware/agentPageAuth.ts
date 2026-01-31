/**
 * Agent Page Authorization Middleware
 *
 * Verifies JWT token and optionally checks page ownership.
 * Used by agent-pages API routes to ensure only the page owner
 * (or an admin) can modify their agent page data.
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';

export interface AgentAuthResult {
  authorized: boolean;
  userId?: string;
  role?: string;
  error?: string;
  status?: number;
}

/**
 * Verify that the request has a valid JWT token.
 * Returns the authenticated user's ID and role.
 */
export async function verifyAgentAuth(request: NextRequest): Promise<AgentAuthResult> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      authorized: false,
      error: 'Authentication required',
      status: 401,
    };
  }

  const token = authHeader.substring(7);
  const { valid, payload, error } = await verifyAccessToken(token);

  if (!valid || !payload) {
    return {
      authorized: false,
      error: error || 'Invalid or expired token',
      status: 401,
    };
  }

  return {
    authorized: true,
    userId: payload.sub,
    role: payload.role,
  };
}

/**
 * Verify that the authenticated user owns the specified agent page.
 * Admins bypass the ownership check.
 *
 * @param userId - The authenticated user's ID (from JWT)
 * @param pageId - The agent page ID to check ownership of
 * @param role - The user's role (admin bypasses check)
 */
export async function verifyPageOwnership(
  userId: string,
  pageId: string,
  role?: string
): Promise<{ authorized: boolean; error?: string; status?: number }> {
  // Admins can access any page
  if (role === 'admin') {
    return { authorized: true };
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return { authorized: false, error: 'Service unavailable', status: 503 };
  }

  const { data: page, error } = await supabase
    .from('agent_pages')
    .select('user_id')
    .eq('id', pageId)
    .single();

  if (error || !page) {
    return { authorized: false, error: 'Agent page not found', status: 404 };
  }

  if (page.user_id !== userId) {
    return { authorized: false, error: 'You do not have permission to modify this page', status: 403 };
  }

  return { authorized: true };
}

/**
 * Combined auth + ownership check helper.
 * Returns a NextResponse error if unauthorized, or null if authorized.
 * Also returns the userId for use in the handler.
 */
export async function requirePageOwner(
  request: NextRequest,
  pageId: string,
  corsHeaders?: Record<string, string>
): Promise<{ error: NextResponse | null; userId: string }> {
  const auth = await verifyAgentAuth(request);
  if (!auth.authorized) {
    return {
      error: NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status || 401, headers: corsHeaders }
      ),
      userId: '',
    };
  }

  const ownership = await verifyPageOwnership(auth.userId!, pageId, auth.role);
  if (!ownership.authorized) {
    return {
      error: NextResponse.json(
        { success: false, error: ownership.error },
        { status: ownership.status || 403, headers: corsHeaders }
      ),
      userId: '',
    };
  }

  return { error: null, userId: auth.userId! };
}
