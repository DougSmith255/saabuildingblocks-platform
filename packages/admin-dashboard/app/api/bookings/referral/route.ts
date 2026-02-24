/**
 * Booking Referral API
 *
 * POST /api/bookings/referral
 *
 * Called by the custom booking widget after GHL booking confirmed.
 * Creates a booking_referrals record and emails the referring agent.
 * No RSVP — pure notification. The meeting is already confirmed.
 * Public endpoint (no auth) — rate-limited by IP.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';
import { createHash, randomBytes } from 'crypto';
import { sendEmail } from '@/lib/email/client';
import { BookingReferralNotification } from '@/lib/email/templates/BookingReferralNotification';
import React from 'react';

export const dynamic = 'force-dynamic';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Rate limiting: 10 referral creates per minute per IP
const rateLimits = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 10;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const times = rateLimits.get(ip) || [];
  const recent = times.filter(t => now - t < RATE_LIMIT_WINDOW);
  if (recent.length >= RATE_LIMIT_MAX) return true;
  recent.push(now);
  rateLimits.set(ip, recent);
  return false;
}

// Cleanup stale rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, times] of rateLimits.entries()) {
    const recent = times.filter(t => now - t < RATE_LIMIT_WINDOW);
    if (recent.length === 0) rateLimits.delete(ip);
    else rateLimits.set(ip, recent);
  }
}, 5 * 60 * 1000);

export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: { ...CORS_HEADERS, 'Access-Control-Max-Age': '86400' },
  });
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: CORS_HEADERS }
      );
    }

    const body = await request.json();
    const { agentSlug, visitorName, visitorEmail, visitorPhone, bookingStartTime, bookingEndTime, appointmentId, meetingLink } = body;

    // Validate required fields
    if (!agentSlug || typeof agentSlug !== 'string') {
      return NextResponse.json(
        { error: 'agentSlug is required' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const supabase = getSupabaseServiceClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection unavailable' },
        { status: 503, headers: CORS_HEADERS }
      );
    }

    // Look up agent by slug in agent_pages to get user_id
    const { data: agentPage, error: pageError } = await supabase
      .from('agent_pages')
      .select('user_id, slug, display_first_name, display_last_name, email')
      .eq('slug', agentSlug)
      .eq('activated', true)
      .single();

    if (pageError || !agentPage) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    // Look up agent user for email
    const { data: agentUser, error: userError } = await supabase
      .from('users')
      .select('id, email, full_name')
      .eq('id', agentPage.user_id)
      .single();

    if (userError || !agentUser) {
      return NextResponse.json(
        { error: 'Agent user not found' },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    const agentName = `${agentPage.display_first_name || ''} ${agentPage.display_last_name || ''}`.trim()
      || agentUser.full_name
      || 'Agent';
    const agentEmail = agentUser.email || agentPage.email;

    if (!agentEmail) {
      return NextResponse.json(
        { error: 'Agent has no email configured' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Generate magic link token for auto-login to agent portal
    const rawToken = randomBytes(32).toString('hex');
    const hashedToken = createHash('sha256').update(rawToken).digest('hex');

    // Insert booking referral
    const { error: insertError } = await supabase
      .from('booking_referrals')
      .insert({
        agent_user_id: agentUser.id,
        agent_slug: agentSlug,
        agent_name: agentName,
        agent_email: agentEmail,
        visitor_name: visitorName || null,
        visitor_email: visitorEmail || null,
        visitor_phone: visitorPhone || null,
        booking_start_time: bookingStartTime ? new Date(bookingStartTime).toISOString() : null,
        booking_end_time: bookingEndTime ? new Date(bookingEndTime).toISOString() : null,
        ghl_appointment_id: appointmentId || null,
        meeting_link: meetingLink || null,
        rsvp_token: hashedToken,
        rsvp_status: 'accepted',
        rsvp_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });

    if (insertError) {
      console.error('[booking-referral] Insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to create referral' },
        { status: 500, headers: CORS_HEADERS }
      );
    }

    // Send notification email to agent with magic link to portal
    const firstName = agentPage.display_first_name || agentName.split(' ')[0] || 'Agent';
    const portalLink = `https://saabuildingblocks.com/api/auth/portal-link?token=${rawToken}`;

    await sendEmail({
      to: agentEmail,
      subject: `${visitorName || visitorEmail || 'Someone'} booked a call from your attraction page!`,
      react: React.createElement(BookingReferralNotification, {
        agentFirstName: firstName,
        visitorName: visitorName || undefined,
        visitorEmail: visitorEmail || undefined,
        visitorPhone: visitorPhone || undefined,
        bookingTime: bookingStartTime
          ? new Date(bookingStartTime).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' })
          : undefined,
        portalUrl: portalLink,
      }),
      tags: [
        { name: 'type', value: 'booking-referral' },
        { name: 'agent', value: agentSlug },
      ],
    });

    console.log(`[booking-referral] Created referral for agent ${agentSlug}, email sent to ${agentEmail}`);

    return NextResponse.json(
      { success: true },
      { headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error('[booking-referral] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
