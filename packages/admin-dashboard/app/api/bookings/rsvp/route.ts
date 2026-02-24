/**
 * Booking RSVP API
 *
 * GET  /api/bookings/rsvp?token={token}&action={accept|decline}
 *   — Called from email links. Returns HTML confirmation page.
 *
 * PATCH /api/bookings/rsvp
 *   — Called from agent portal. Auth required, IDOR check.
 *   — Body: { referralId, action: 'accept' | 'decline' }
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';
import { createHash } from 'crypto';
import { verifyAuth } from '@/app/api/middleware/adminAuth';
import { GoHighLevelService } from '@/lib/gohighlevel/ghl-service';

export const dynamic = 'force-dynamic';

/**
 * Generate a styled HTML response page for RSVP actions
 */
function rsvpHtmlPage(title: string, message: string, isError = false): Response {
  const accentColor = isError ? '#ff4444' : '#ffd700';
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} - Smart Agent Alliance</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0a0a0a;
      color: #e5e4dd;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 2rem;
    }
    .card {
      max-width: 480px;
      width: 100%;
      background: #1a1a1a;
      border: 1px solid ${accentColor}33;
      border-radius: 16px;
      padding: 3rem 2rem;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    }
    .icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 1.5rem;
      border-radius: 50%;
      background: ${accentColor}15;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
    }
    h1 {
      font-size: 1.5rem;
      color: ${accentColor};
      margin-bottom: 1rem;
    }
    p {
      color: #bfbdb0;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }
    a {
      display: inline-block;
      color: #ffd700;
      text-decoration: none;
      padding: 0.75rem 2rem;
      border: 1px solid #ffd70033;
      border-radius: 8px;
      transition: all 0.2s;
    }
    a:hover { background: #ffd70015; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${isError ? '&#9888;' : '&#10003;'}</div>
    <h1>${title}</h1>
    <p>${message}</p>
    <a href="https://smartagentalliance.com/agent-portal?section=referrals">Go to Agent Portal</a>
  </div>
</body>
</html>`;
  return new Response(html, {
    status: isError ? 400 : 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

/**
 * Apply GHL tags based on RSVP action
 */
async function applyGhlTags(agentEmail: string, action: 'accept' | 'decline'): Promise<void> {
  try {
    const ghl = new GoHighLevelService();
    if (action === 'accept') {
      await ghl.addTagsByEmail(agentEmail, ['referral-meeting-accepted']);
    } else {
      await ghl.addTagsByEmail(agentEmail, ['referral-meeting-declined']);
    }
  } catch (error) {
    // Non-critical — log but don't fail the RSVP
    console.error('[booking-rsvp] GHL tag error:', error);
  }
}

/**
 * Generate a confirmation page that requires the user to click a button.
 * This prevents email clients from auto-triggering the RSVP via link prefetch.
 */
function rsvpConfirmPage(action: string, token: string, visitorName: string | null): Response {
  const isAccept = action === 'accept';
  const actionLabel = isAccept ? 'Join Call' : 'Skip';
  const actionColor = isAccept ? '#00ff88' : '#888888';
  const displayVisitor = visitorName || 'the visitor';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${actionLabel} Meeting - Smart Agent Alliance</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0a0a0a;
      color: #e5e4dd;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 2rem;
    }
    .card {
      max-width: 480px;
      width: 100%;
      background: #1a1a1a;
      border: 1px solid ${actionColor}33;
      border-radius: 16px;
      padding: 3rem 2rem;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    }
    h1 { font-size: 1.5rem; color: ${actionColor}; margin-bottom: 1rem; }
    p { color: #bfbdb0; line-height: 1.6; margin-bottom: 1.5rem; }
    form { display: inline; }
    button {
      display: inline-block;
      color: ${isAccept ? '#0a0a0a' : '#e5e4dd'};
      background: ${isAccept ? '#00ff88' : '#333'};
      border: 1px solid ${actionColor}55;
      font-size: 1rem;
      font-weight: 600;
      padding: 0.75rem 2.5rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }
    button:hover { opacity: 0.85; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    .back { display: inline-block; color: #ffd700; text-decoration: none; margin-top: 1rem; font-size: 14px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${isAccept ? 'Join This Call' : 'Skip This Call'}</h1>
    <p>${isAccept
      ? `You\\'re confirming that you want to <strong>join</strong> the call with <strong>${displayVisitor}</strong>. You\\'ll receive a calendar invite and reminders.`
      : `You\\'re choosing to <strong>skip</strong> the call with <strong>${displayVisitor}</strong>. The meeting will still happen with our team — you just won\\'t be included.`
    }</p>
    <form method="POST" action="/api/bookings/rsvp">
      <input type="hidden" name="token" value="${token}">
      <input type="hidden" name="action" value="${action}">
      <button type="submit" onclick="this.disabled=true;this.textContent='Processing...';">${isAccept ? 'Yes, Join Call' : 'Skip This One'}</button>
    </form>
    <br>
    <a class="back" href="https://smartagentalliance.com/agent-portal?section=referrals">Go to Agent Portal</a>
  </div>
</body>
</html>`;
  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

/**
 * GET /api/bookings/rsvp?token={token}&action={accept|decline}
 *
 * Email link handler. Shows a confirmation page (prevents email prefetch from auto-triggering).
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const action = searchParams.get('action');

  if (!token || !action || !['accept', 'decline'].includes(action)) {
    return rsvpHtmlPage(
      'Invalid Link',
      'This link is invalid. Please check your email for the correct link, or manage your bookings from the Agent Portal.',
      true
    );
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return rsvpHtmlPage('Error', 'Service temporarily unavailable. Please try again later.', true);
  }

  // Hash token for lookup — validate it exists before showing confirm page
  const hashedToken = createHash('sha256').update(token).digest('hex');

  const { data: referral, error } = await supabase
    .from('booking_referrals')
    .select('id, rsvp_status, rsvp_expires_at, visitor_name')
    .eq('rsvp_token', hashedToken)
    .single();

  if (error || !referral) {
    return rsvpHtmlPage(
      'Link Not Found',
      'This RSVP link was not found. It may have already been used or the booking may no longer exist.',
      true
    );
  }

  if (referral.rsvp_status !== 'pending') {
    const statusMsg = referral.rsvp_status === 'accepted'
      ? 'You have already confirmed that you\'re joining this call.'
      : 'You have already skipped this call.';
    return rsvpHtmlPage('Already Responded', statusMsg);
  }

  if (new Date() > new Date(referral.rsvp_expires_at)) {
    return rsvpHtmlPage(
      'Link Expired',
      'This RSVP link has expired. You can still manage this booking from your Agent Portal.',
      true
    );
  }

  // Show confirmation page — user must click the button to actually accept/decline
  return rsvpConfirmPage(action, token, referral.visitor_name);
}

/**
 * POST /api/bookings/rsvp/confirm  (handled here since Next.js routes by directory)
 *
 * Actually processes the RSVP action after user clicks confirm button.
 * Also handles the form POST from the confirmation page at this same route.
 */
export async function POST(request: NextRequest) {
  let token: string | null = null;
  let action: string | null = null;

  // Support both form-encoded (from confirm page) and JSON (fallback)
  const contentType = request.headers.get('content-type') || '';
  if (contentType.includes('application/x-www-form-urlencoded')) {
    const formData = await request.formData();
    token = formData.get('token') as string | null;
    action = formData.get('action') as string | null;
  } else {
    try {
      const body = await request.json();
      token = body.token;
      action = body.action;
    } catch {
      return rsvpHtmlPage('Invalid Request', 'Could not process your request.', true);
    }
  }

  if (!token || !action || !['accept', 'decline'].includes(action)) {
    return rsvpHtmlPage(
      'Invalid Request',
      'This request is invalid. Please check your email for the correct link.',
      true
    );
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return rsvpHtmlPage('Error', 'Service temporarily unavailable. Please try again later.', true);
  }

  const hashedToken = createHash('sha256').update(token).digest('hex');

  const { data: referral, error } = await supabase
    .from('booking_referrals')
    .select('*')
    .eq('rsvp_token', hashedToken)
    .single();

  if (error || !referral) {
    return rsvpHtmlPage(
      'Link Not Found',
      'This RSVP link was not found. It may have already been used or the booking may no longer exist.',
      true
    );
  }

  if (referral.rsvp_status !== 'pending') {
    const statusMsg = referral.rsvp_status === 'accepted'
      ? 'You have already confirmed that you\'re joining this call.'
      : 'You have already skipped this call.';
    return rsvpHtmlPage('Already Responded', statusMsg);
  }

  if (new Date() > new Date(referral.rsvp_expires_at)) {
    return rsvpHtmlPage(
      'Link Expired',
      'This RSVP link has expired. You can still manage this booking from your Agent Portal.',
      true
    );
  }

  const rsvpAction = action as 'accept' | 'decline';
  const { error: updateError } = await supabase
    .from('booking_referrals')
    .update({
      rsvp_status: rsvpAction === 'accept' ? 'accepted' : 'declined',
      rsvp_responded_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', referral.id);

  if (updateError) {
    console.error('[booking-rsvp] Update error:', updateError);
    return rsvpHtmlPage('Error', 'Failed to process your response. Please try again.', true);
  }

  // Apply GHL tags (fire-and-forget)
  applyGhlTags(referral.agent_email, rsvpAction);

  if (rsvpAction === 'accept') {
    return rsvpHtmlPage(
      'You\'re In!',
      'You\'ve joined this call. You\'ll receive a calendar invite and reminders. Thank you!'
    );
  } else {
    return rsvpHtmlPage(
      'Call Skipped',
      'You\'ve opted out of this call. The meeting will still happen with our team — no action needed on your part.'
    );
  }
}

/**
 * PATCH /api/bookings/rsvp
 *
 * Agent portal handler. Auth required, IDOR check.
 * Body: { referralId: string, action: 'accept' | 'decline' }
 */
export async function PATCH(request: NextRequest) {
  try {
    // Verify authentication
    const auth = await verifyAuth(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status || 401 }
      );
    }

    const body = await request.json();
    const { referralId, action } = body;

    if (!referralId || !action || !['accept', 'decline'].includes(action)) {
      return NextResponse.json(
        { error: 'referralId and action (accept|decline) are required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServiceClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection unavailable' },
        { status: 503 }
      );
    }

    // Fetch referral and verify ownership (IDOR check)
    const { data: referral, error } = await supabase
      .from('booking_referrals')
      .select('*')
      .eq('id', referralId)
      .single();

    if (error || !referral) {
      return NextResponse.json(
        { error: 'Referral not found' },
        { status: 404 }
      );
    }

    // IDOR check: must belong to authenticated user
    if (referral.agent_user_id !== auth.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Check if already responded
    if (referral.rsvp_status !== 'pending') {
      return NextResponse.json(
        { error: `Already ${referral.rsvp_status}` },
        { status: 400 }
      );
    }

    // Update status
    const rsvpAction = action as 'accept' | 'decline';
    const { data: updated, error: updateError } = await supabase
      .from('booking_referrals')
      .update({
        rsvp_status: rsvpAction === 'accept' ? 'accepted' : 'declined',
        rsvp_responded_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', referralId)
      .select()
      .single();

    if (updateError) {
      console.error('[booking-rsvp] PATCH update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update' },
        { status: 500 }
      );
    }

    // Apply GHL tags (fire-and-forget)
    applyGhlTags(referral.agent_email, rsvpAction);

    return NextResponse.json({ success: true, referral: updated });
  } catch (error) {
    console.error('[booking-rsvp] PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
