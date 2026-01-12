/**
 * User Management API - List Users
 *
 * GET /api/users/list - List all users with pagination
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';

export const dynamic = 'force-dynamic';

interface User {
  id: string;
  first_name?: string;
  last_name?: string;
  name: string; // Full name for display (backward compatibility)
  email: string;
  username?: string;
  role: 'admin' | 'user';
  status: 'active' | 'pending' | 'suspended';
  gohighlevel_contact_id?: string;
  created_at: string;
  updated_at: string;
  exp_email?: string; // Agent's eXp Realty email
  legal_name?: string; // Agent's official legal name
  gender?: 'male' | 'female'; // Controls which team calls the user sees
  is_leader?: boolean; // Controls whether user sees leaders-only calls
}

/**
 * Shared logic for fetching users
 */
async function fetchUsers(request: NextRequest) {
  const supabase = getSupabaseServiceClient();

  if (!supabase) {
    return NextResponse.json(
      { error: 'Database connection unavailable' },
      { status: 503 }
    );
  }

  // Parse pagination parameters from URL for GET or body for POST
  let page = 1;
  let limit = 50;

  if (request.method === 'GET') {
    const { searchParams } = new URL(request.url);
    page = parseInt(searchParams.get('page') || '1', 10);
    limit = parseInt(searchParams.get('limit') || '50', 10);
  } else if (request.method === 'POST') {
    try {
      const body = await request.json();
      page = body.page || 1;
      limit = body.limit || 50;
    } catch {
      // Use defaults if body parsing fails
    }
  }

  const offset = (page - 1) * limit;

  // Fetch users from the correct table
  const { data: users, error, count } = await supabase
    .from('users')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('❌ Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users', details: error.message },
      { status: 500 }
    );
  }

  // Map to standardized User interface
  const userList: User[] = (users || []).map((user) => {
    // Build full name from first_name + last_name, fallback to full_name, then email
    const fullName = user.first_name && user.last_name
      ? `${user.first_name} ${user.last_name}`
      : user.full_name || user.name || user.email;

    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      name: fullName,
      email: user.email,
      username: user.username,
      role: user.role || 'user',
      status: user.status || 'active',
      gohighlevel_contact_id: user.gohighlevel_contact_id,
      created_at: user.created_at,
      updated_at: user.updated_at,
      exp_email: user.exp_email,
      legal_name: user.legal_name,
      gender: user.gender || 'male',
      is_leader: user.is_leader || false,
    };
  });

  return NextResponse.json({
    success: true,
    data: userList,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  });
}

/**
 * GET /api/users/list
 *
 * Fetch all users from Supabase (query params for pagination)
 */
export async function GET(request: NextRequest) {
  try {
    const response = await fetchUsers(request);

    // Add cache-busting headers to prevent stale data
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    console.error('❌ Error in GET /api/users/list:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/users/list
 *
 * Fetch all users from Supabase (JSON body for pagination)
 * Supports Master Controller authentication
 */
export async function POST(request: NextRequest) {
  try {
    // Validate authentication (Basic auth or bearer token)
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Basic auth validation (optional - Master Controller uses this)
    if (authHeader.startsWith('Basic ')) {
      const base64Credentials = authHeader.slice(6);
      const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
      const [username, password] = credentials.split(':');

      // Validate against expected credentials
      if (username !== 'builder_user' || password !== 'K8mN#Build7$Q2') {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }
    }

    return await fetchUsers(request);
  } catch (error) {
    console.error('❌ Error in POST /api/users/list:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
