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
    'Vary': 'Origin',
  };
}

// Handle preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(request.headers.get('origin')) });
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
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  const json = (data: object, status = 200) =>
    NextResponse.json(data, { status, headers: corsHeaders });

  const clients = getSupabaseClients();

  if (!clients) {
    return json({ success: false, error: 'Service unavailable' }, 503);
  }

  const { authClient, serviceClient } = clients;

  try {
    // Get auth token from header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return json({ success: false, error: 'Missing authorization' }, 401);
    }

    const token = authHeader.substring(7);

    // Verify the token and get user
    const { data: { user: authUser }, error: authError } = await authClient.auth.getUser(token);

    if (authError || !authUser) {
      return json({ success: false, error: 'Invalid token' }, 401);
    }

    // Get user data from users table using service client (bypasses RLS)
    const { data: user, error: userError } = await serviceClient
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (userError || !user) {
      return json({ success: false, error: 'User not found' }, 404);
    }

    return json({
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
    return json({ success: false, error: 'Internal error' }, 500);
  }
}
