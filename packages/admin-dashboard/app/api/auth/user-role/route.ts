// Force dynamic rendering - exclude from static export
export const dynamic = 'force-dynamic';

/**
 * User Role API Route
 * GET /api/auth/user-role
 *
 * Returns user role and data for authenticated user.
 * Uses service role key to bypass RLS on users table.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// CORS headers
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle preflight
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

function jsonResponse(data: object, status: number = 200) {
  return NextResponse.json(data, { status, headers: CORS_HEADERS });
}

function getSupabaseClients() {
  const url = process.env['NEXT_PUBLIC_SUPABASE_URL'];
  const anonKey = process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];
  const serviceKey = process.env['SUPABASE_SERVICE_ROLE_KEY'] || process.env['SUPABASE_SECRET_KEY'];

  if (!url || !anonKey || !serviceKey) return null;

  const authClient = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const serviceClient = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  return { authClient, serviceClient };
}

export async function GET(request: NextRequest) {
  const clients = getSupabaseClients();

  if (!clients) {
    return jsonResponse({ success: false, error: 'Service unavailable' }, 503);
  }

  const { authClient, serviceClient } = clients;

  try {
    // Get auth token from header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return jsonResponse({ success: false, error: 'Missing authorization' }, 401);
    }

    const token = authHeader.substring(7);

    // Verify the token and get user
    const { data: { user: authUser }, error: authError } = await authClient.auth.getUser(token);

    if (authError || !authUser) {
      return jsonResponse({ success: false, error: 'Invalid token' }, 401);
    }

    // Get user data from users table using service client (bypasses RLS)
    const { data: user, error: userError } = await serviceClient
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (userError || !user) {
      return jsonResponse({ success: false, error: 'User not found' }, 404);
    }

    return jsonResponse({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.full_name,
        firstName: user.first_name,
        lastName: user.last_name,
        profilePictureUrl: user.profile_picture_url,
        isActive: user.status === 'active',
      }
    });
  } catch (error) {
    console.error('[User Role API] Error:', error);
    return jsonResponse({ success: false, error: 'Internal error' }, 500);
  }
}
