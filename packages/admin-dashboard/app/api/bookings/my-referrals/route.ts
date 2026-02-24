/**
 * My Referral Bookings API
 *
 * GET /api/bookings/my-referrals
 *
 * Returns the authenticated agent's referral bookings.
 * Auth required — IDOR enforced (user can only see own referrals).
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';
import { verifyAuth } from '@/app/api/middleware/adminAuth';

export const dynamic = 'force-dynamic';

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
    'Vary': 'Origin',
  };
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(request.headers.get('origin')) });
}

export async function GET(request: NextRequest) {
  const CORS = getCorsHeaders(request.headers.get('origin'));
  try {
    // Verify authentication
    const auth = await verifyAuth(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status || 401, headers: CORS }
      );
    }

    const supabase = getSupabaseServiceClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection unavailable' },
        { status: 503, headers: CORS }
      );
    }

    // Fetch referrals for authenticated user only (IDOR enforced)
    const { data: referrals, error } = await supabase
      .from('booking_referrals')
      .select('id, visitor_name, visitor_email, visitor_phone, rsvp_status, rsvp_expires_at, booking_start_time, booking_end_time, meeting_link, created_at')
      .eq('agent_user_id', auth.userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[my-referrals] Query error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch referrals' },
        { status: 500, headers: CORS }
      );
    }

    return NextResponse.json({
      success: true,
      referrals: referrals || [],
    }, { headers: CORS });
  } catch (error) {
    console.error('[my-referrals] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: CORS }
    );
  }
}
