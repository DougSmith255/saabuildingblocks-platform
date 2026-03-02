/**
 * Resend Apology Activation Email API Route
 *
 * POST /api/invitations/resend-apology
 *   - Body: { email: string } to send to one agent
 *   - Body: { all: true } to send to all invited agents
 *
 * Generates a fresh token, updates DB, sends the apology email.
 * Auth: admin session OR x-automation-secret header.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';
import { verifySessionAdminAuth } from '@/app/api/middleware/adminAuth';
import { sendApologyActivationEmail } from '@/lib/email/send';
import { generateInvitationToken, hashToken } from '@saa/shared/lib/supabase/invitation-service';

export const dynamic = 'force-dynamic';

function verifyAutomationSecret(request: NextRequest): boolean {
  const secret = request.headers.get('x-automation-secret');
  return !!secret && secret === process.env.AUTOMATION_SECRET;
}

export async function POST(request: NextRequest) {
  try {
    // Accept either session auth or automation secret
    if (!verifyAutomationSecret(request)) {
      const authResult = await verifySessionAdminAuth();
      if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: 401 });
      }
    }

    const supabase = getSupabaseServiceClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }

    const body = await request.json();
    const { email: targetEmail, all } = body;

    // Build the list of invitations to resend
    let query = supabase
      .from('user_invitations')
      .select('id, email, user_id, status')
      .in('status', ['pending', 'sent']);

    if (!all && targetEmail) {
      query = query.eq('email', targetEmail);
    }

    const { data: invitations, error: fetchErr } = await query;

    if (fetchErr || !invitations) {
      return NextResponse.json({ error: 'Failed to fetch invitations' }, { status: 500 });
    }

    // Filter to only users still in 'invited' status
    const results: Array<{ email: string; status: string; error?: string }> = [];

    for (const inv of invitations) {
      const { data: user } = await supabase
        .from('users')
        .select('id, first_name, full_name, status')
        .eq('id', inv.user_id)
        .single();

      if (!user || user.status !== 'invited') {
        results.push({ email: inv.email, status: 'skipped', error: 'User already active or not found' });
        continue;
      }

      const firstName = user.first_name || user.full_name?.split(' ')[0] || 'there';

      // Generate fresh token
      const rawToken = generateInvitationToken();
      const tokenHash = hashToken(rawToken);
      const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

      // Update invitation in DB
      const { error: updateErr } = await supabase
        .from('user_invitations')
        .update({
          token: tokenHash,
          expires_at: expiresAt,
          sent_at: new Date().toISOString(),
          status: 'sent',
        })
        .eq('id', inv.id);

      if (updateErr) {
        results.push({ email: inv.email, status: 'failed', error: 'DB update failed: ' + updateErr.message });
        continue;
      }

      // Send the apology email with the raw token
      const emailResult = await sendApologyActivationEmail(inv.email, firstName, rawToken, 48);

      if (emailResult.success) {
        // Log to notification_log
        await supabase.from('notification_log').insert({
          user_id: inv.user_id,
          user_email: inv.email,
          notification_type: 'activation_reminder',
          channel: 'email',
          status: 'sent',
          email_message_id: emailResult.messageId || null,
          trigger_reason: 'Manual apology resend - fixed activation links',
        });

        results.push({ email: inv.email, status: 'sent' });
      } else {
        results.push({ email: inv.email, status: 'failed', error: emailResult.error });
      }

      // Rate limit: 200ms between emails
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    const sent = results.filter(r => r.status === 'sent').length;
    const failed = results.filter(r => r.status === 'failed').length;
    const skipped = results.filter(r => r.status === 'skipped').length;

    return NextResponse.json({
      success: true,
      summary: { total: results.length, sent, failed, skipped },
      results,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}
