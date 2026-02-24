/**
 * GHL Booking Webhook API
 *
 * POST /api/bookings/ghl-webhook
 *
 * Called by GoHighLevel workflow automation for appointment events.
 * Handles: booked, rescheduled, cancelled, no-show.
 *
 * If a booking_referral already exists (matched by ghl_appointment_id),
 * it updates the existing record — no agentSlug required for updates.
 * Only new record creation requires an agentSlug.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';
import { sendEmail } from '@/lib/email/client';
import { BookingReferralNotification } from '@/lib/email/templates/BookingReferralNotification';
import React from 'react';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('[ghl-webhook] Received payload:', JSON.stringify(body).slice(0, 2000));

    // Extract contact info
    const visitorName = body.full_name
      || [body.first_name, body.last_name].filter(Boolean).join(' ')
      || null;
    const visitorEmail = body.email || null;
    const visitorPhone = body.phone || null;

    // Extract calendar/appointment info
    const calendar = body.calendar || {};
    const bookingStartTime = calendar.startTime || null;
    const bookingEndTime = calendar.endTime || null;
    const appointmentId = calendar.appointmentId || calendar.id || body.appointment_id || null;
    const calendarId = calendar.calendarId || calendar.id || null;
    const meetingAddress = calendar.address || null;
    const appointmentTitle = calendar.title || null;
    const selectedTimezone = calendar.selectedTimezone || null;
    const ghlContactId = body.contact_id || body.id || null;

    // Appointment status from GHL (booked, confirmed, cancelled, no_show, rescheduled)
    const appointmentStatus = (calendar.appoinmentStatus || calendar.appointmentStatus || body.appointment_status || 'booked').toLowerCase();

    const supabase = getSupabaseServiceClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection unavailable' }, { status: 503 });
    }

    // ── STEP 1: Try to update an existing record by appointment ID ──
    // This handles cancel, reschedule, no-show — no agentSlug needed
    if (appointmentId) {
      const { data: existing } = await supabase
        .from('booking_referrals')
        .select('id')
        .eq('ghl_appointment_id', appointmentId)
        .single();

      if (existing) {
        const updates: Record<string, unknown> = {
          updated_at: new Date().toISOString(),
        };

        if (bookingStartTime) updates.booking_start_time = new Date(bookingStartTime).toISOString();
        if (bookingEndTime) updates.booking_end_time = new Date(bookingEndTime).toISOString();
        if (meetingAddress) updates.meeting_link = meetingAddress;

        if (appointmentStatus === 'cancelled' || appointmentStatus === 'canceled') {
          updates.rsvp_status = 'cancelled';
        } else if (appointmentStatus === 'no_show' || appointmentStatus === 'noshow') {
          updates.rsvp_status = 'no_show';
        } else {
          updates.rsvp_status = 'accepted';
        }

        await supabase
          .from('booking_referrals')
          .update(updates)
          .eq('id', existing.id);

        console.log(`[ghl-webhook] Updated referral ${existing.id}, status: ${appointmentStatus}`);
        return NextResponse.json({ success: true, action: 'updated' });
      }
    }

    // ── STEP 2: Try to enrich a widget-created record (has no appointment ID yet) ──
    // Get referring agent slug from custom contact field
    const agentSlug = body.referring_agent_slug
      || body.referring_agent
      || body.referringAgentSlug
      || body.referringAgent
      || body.agent_slug
      || body.agentSlug
      || null;

    if (appointmentId && visitorEmail && agentSlug) {
      const { data: widgetRecord } = await supabase
        .from('booking_referrals')
        .select('id')
        .eq('agent_slug', agentSlug)
        .eq('visitor_email', visitorEmail)
        .is('ghl_appointment_id', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (widgetRecord) {
        await supabase
          .from('booking_referrals')
          .update({
            ghl_appointment_id: appointmentId,
            ghl_contact_id: ghlContactId,
            ghl_calendar_id: calendarId,
            booking_start_time: bookingStartTime ? new Date(bookingStartTime).toISOString() : undefined,
            booking_end_time: bookingEndTime ? new Date(bookingEndTime).toISOString() : undefined,
            meeting_link: meetingAddress || undefined,
            updated_at: new Date().toISOString(),
          })
          .eq('id', widgetRecord.id);

        console.log(`[ghl-webhook] Enriched widget-created referral ${widgetRecord.id} with GHL data`);
        return NextResponse.json({ success: true, action: 'enriched' });
      }
    }

    // ── STEP 3: No existing record — create a new one (webhook-only flow) ──
    // This requires agentSlug to know which agent to credit
    if (!agentSlug) {
      console.log('[ghl-webhook] No referring_agent_slug and no existing record — skipping.');
      return NextResponse.json({ success: true, skipped: true });
    }

    const { data: agentPage } = await supabase
      .from('agent_pages')
      .select('user_id, slug, display_first_name, display_last_name, email')
      .eq('slug', agentSlug)
      .eq('activated', true)
      .single();

    if (!agentPage) {
      console.error('[ghl-webhook] Agent not found for slug:', agentSlug);
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    const { data: agentUser } = await supabase
      .from('users')
      .select('id, email, full_name')
      .eq('id', agentPage.user_id)
      .single();

    if (!agentUser) {
      return NextResponse.json({ error: 'Agent user not found' }, { status: 404 });
    }

    const agentName = `${agentPage.display_first_name || ''} ${agentPage.display_last_name || ''}`.trim()
      || agentUser.full_name || 'Agent';
    const agentEmail = agentUser.email || agentPage.email;
    if (!agentEmail) {
      return NextResponse.json({ error: 'Agent has no email configured' }, { status: 400 });
    }

    await supabase
      .from('booking_referrals')
      .insert({
        agent_user_id: agentUser.id,
        agent_slug: agentSlug,
        agent_name: agentName,
        agent_email: agentEmail,
        visitor_name: visitorName,
        visitor_email: visitorEmail,
        visitor_phone: visitorPhone,
        ghl_contact_id: ghlContactId,
        ghl_appointment_id: appointmentId,
        ghl_calendar_id: calendarId,
        booking_start_time: bookingStartTime ? new Date(bookingStartTime).toISOString() : null,
        booking_end_time: bookingEndTime ? new Date(bookingEndTime).toISOString() : null,
        meeting_link: meetingAddress || null,
        rsvp_token: 'none',
        rsvp_status: 'accepted',
        rsvp_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      });

    // Send notification email
    const firstName = agentPage.display_first_name || agentName.split(' ')[0] || 'Agent';
    let bookingTimeDisplay: string | undefined;
    if (bookingStartTime) {
      try {
        bookingTimeDisplay = new Date(bookingStartTime).toLocaleDateString('en-US', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          hour: 'numeric', minute: '2-digit',
          timeZone: selectedTimezone || 'America/New_York', timeZoneName: 'short',
        });
      } catch { bookingTimeDisplay = bookingStartTime; }
    }

    await sendEmail({
      to: agentEmail,
      subject: `${visitorName || visitorEmail || 'Someone'} booked a call from your attraction page!`,
      react: React.createElement(BookingReferralNotification, {
        agentFirstName: firstName,
        visitorName: visitorName || undefined,
        visitorEmail: visitorEmail || undefined,
        visitorPhone: visitorPhone || undefined,
        bookingTime: bookingTimeDisplay,
        meetingLink: meetingAddress || undefined,
        appointmentTitle: appointmentTitle || undefined,
      }),
      tags: [
        { name: 'type', value: 'booking-referral' },
        { name: 'agent', value: agentSlug },
      ],
    });

    console.log(`[ghl-webhook] Referral created for agent ${agentSlug}, email sent to ${agentEmail}`);
    return NextResponse.json({ success: true, action: 'created' });
  } catch (error) {
    console.error('[ghl-webhook] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
