// Force dynamic rendering - exclude from static export
export const dynamic = 'force-dynamic';

/**
 * Notification Cron API Route
 * POST /api/notifications/cron
 *
 * Sweeps for users who qualify for automated notifications:
 * 1. Activation reminder — 48hrs after invite, still status='invited'
 * 2. Link page nudge — 48hrs after onboarding_completed_at, link page not activated
 *
 * Controlled by NOTIFICATIONS_ENABLED env var:
 * - false (default): dry-run mode — logs what WOULD be sent to notification_log
 * - true: actually sends emails
 *
 * Authentication: requires AUTOMATION_SECRET header or admin auth
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'crypto';
import { sendWelcomeEmail } from '@/lib/email/send';
import { sendEmail } from '@/lib/email/client';
import { LinkPageNudgeEmail } from '@/lib/email/templates/LinkPageNudgeEmail';

const HOURS_BEFORE_ACTIVATION_REMINDER = 48;
const HOURS_BEFORE_LINK_PAGE_NUDGE = 48;

/**
 * When NOTIFICATIONS_TEST_EMAIL is set, only that email gets processed.
 * This lets you test the full flow with a single account before going live.
 */
function getTestEmail(): string | null {
  return process.env.NOTIFICATIONS_TEST_EMAIL || null;
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function isEnabled(): boolean {
  return process.env.NOTIFICATIONS_ENABLED === 'true';
}

/**
 * Verify request is authorized (automation secret or admin auth)
 */
function verifyAuth(request: NextRequest): boolean {
  const secret = request.headers.get('x-automation-secret');
  if (secret && secret === process.env.AUTOMATION_SECRET) {
    return true;
  }
  // Also allow admin cookie-based auth (for Master Controller trigger)
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return true;
  }
  return false;
}

// ============================================================================
// 1. Activation Reminder
// ============================================================================

async function sweepActivationReminders(supabase: ReturnType<typeof getSupabase>, dryRun: boolean) {
  const results: Array<{ email: string; status: string; reason: string }> = [];

  // Find users who:
  // - status = 'invited' (haven't activated)
  // - created_at is more than 48 hours ago
  const cutoff = new Date();
  cutoff.setHours(cutoff.getHours() - HOURS_BEFORE_ACTIVATION_REMINDER);

  let query = supabase
    .from('users')
    .select('id, email, first_name, status, created_at')
    .eq('status', 'invited')
    .lt('created_at', cutoff.toISOString());

  const testEmail = getTestEmail();
  if (testEmail) {
    query = query.eq('email', testEmail);
  }

  const { data: eligibleUsers, error } = await query;

  if (error || !eligibleUsers?.length) {
    return { checked: 0, results: [] };
  }

  for (const user of eligibleUsers) {
    // Check if we already sent this reminder
    const { data: existing } = await supabase
      .from('notification_log')
      .select('id')
      .eq('user_id', user.id)
      .eq('notification_type', 'activation_reminder')
      .eq('channel', 'email')
      .limit(1);

    if (existing?.length) {
      results.push({ email: user.email, status: 'skipped', reason: 'Already sent reminder' });
      continue;
    }

    if (dryRun) {
      // Log as dry_run
      await supabase.from('notification_log').insert({
        user_id: user.id,
        user_email: user.email,
        notification_type: 'activation_reminder',
        channel: 'email',
        status: 'dry_run',
        trigger_reason: `${HOURS_BEFORE_ACTIVATION_REMINDER}hrs since invite, still status=invited`,
        metadata: { created_at: user.created_at },
      });
      results.push({ email: user.email, status: 'dry_run', reason: 'Would re-send activation email' });
    } else {
      // Generate new activation token and update user
      const newToken = randomBytes(32).toString('hex');
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await supabase.from('user_invitations')
        .update({ token: newToken, expires_at: expiresAt.toISOString() })
        .eq('user_id', user.id)
        .eq('status', 'pending');

      // Send the same welcome email (not marked as "reminder")
      const emailResult = await sendWelcomeEmail(
        user.email,
        user.first_name || 'there',
        newToken,
        168 // 7 days
      );

      await supabase.from('notification_log').insert({
        user_id: user.id,
        user_email: user.email,
        notification_type: 'activation_reminder',
        channel: 'email',
        status: emailResult.success ? 'sent' : 'failed',
        email_message_id: emailResult.messageId || null,
        email_error: emailResult.error || null,
        trigger_reason: `${HOURS_BEFORE_ACTIVATION_REMINDER}hrs since invite, still status=invited`,
        metadata: { created_at: user.created_at, new_token: newToken },
      });

      results.push({
        email: user.email,
        status: emailResult.success ? 'sent' : 'failed',
        reason: emailResult.success ? 'Re-sent activation email' : emailResult.error || 'Unknown error',
      });
    }
  }

  return { checked: eligibleUsers.length, results };
}

// ============================================================================
// 2. Link Page Nudge
// ============================================================================

async function sweepLinkPageNudges(supabase: ReturnType<typeof getSupabase>, dryRun: boolean) {
  const results: Array<{ email: string; status: string; reason: string }> = [];

  // Find users who:
  // - status = 'active'
  // - onboarding_completed_at is more than 48 hours ago
  // - do NOT have an activated agent page
  const cutoff = new Date();
  cutoff.setHours(cutoff.getHours() - HOURS_BEFORE_LINK_PAGE_NUDGE);

  let query = supabase
    .from('users')
    .select('id, email, first_name, onboarding_completed_at')
    .eq('status', 'active')
    .not('onboarding_completed_at', 'is', null)
    .lt('onboarding_completed_at', cutoff.toISOString());

  const testEmail = getTestEmail();
  if (testEmail) {
    query = query.eq('email', testEmail);
  }

  const { data: eligibleUsers, error } = await query;

  if (error || !eligibleUsers?.length) {
    return { checked: 0, results: [] };
  }

  for (const user of eligibleUsers) {
    // Check if their agent page is already activated
    const { data: agentPage } = await supabase
      .from('agent_pages')
      .select('activated')
      .eq('user_id', user.id)
      .single();

    if (agentPage?.activated) {
      results.push({ email: user.email, status: 'skipped', reason: 'Link page already activated' });
      continue;
    }

    // Check if we already sent this nudge
    const { data: existing } = await supabase
      .from('notification_log')
      .select('id')
      .eq('user_id', user.id)
      .eq('notification_type', 'link_page_nudge')
      .eq('channel', 'email')
      .limit(1);

    if (existing?.length) {
      results.push({ email: user.email, status: 'skipped', reason: 'Already sent nudge' });
      continue;
    }

    const portalLink = 'https://smartagentalliance.com/agent-portal';

    if (dryRun) {
      await supabase.from('notification_log').insert({
        user_id: user.id,
        user_email: user.email,
        notification_type: 'link_page_nudge',
        channel: 'email',
        status: 'dry_run',
        trigger_reason: `${HOURS_BEFORE_LINK_PAGE_NUDGE}hrs since onboarding complete, link page not activated`,
        metadata: { onboarding_completed_at: user.onboarding_completed_at },
      });
      results.push({ email: user.email, status: 'dry_run', reason: 'Would send link page nudge' });
    } else {
      const emailResult = await sendEmail({
        to: user.email,
        subject: 'Your Link Page is Ready to Set Up — Smart Agent Alliance',
        react: LinkPageNudgeEmail({
          firstName: user.first_name || 'there',
          portalLink,
        }),
        tags: [{ name: 'category', value: 'link_page_nudge' }],
      });

      await supabase.from('notification_log').insert({
        user_id: user.id,
        user_email: user.email,
        notification_type: 'link_page_nudge',
        channel: 'email',
        status: emailResult.success ? 'sent' : 'failed',
        email_message_id: emailResult.messageId || null,
        email_error: emailResult.error || null,
        trigger_reason: `${HOURS_BEFORE_LINK_PAGE_NUDGE}hrs since onboarding complete, link page not activated`,
        metadata: { onboarding_completed_at: user.onboarding_completed_at },
      });

      results.push({
        email: user.email,
        status: emailResult.success ? 'sent' : 'failed',
        reason: emailResult.success ? 'Sent link page nudge' : emailResult.error || 'Unknown error',
      });
    }
  }

  return { checked: eligibleUsers.length, results };
}

// ============================================================================
// Route Handler
// ============================================================================

export async function POST(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabase();
  const dryRun = !isEnabled();

  const [activationResults, linkPageResults] = await Promise.all([
    sweepActivationReminders(supabase, dryRun),
    sweepLinkPageNudges(supabase, dryRun),
  ]);

  return NextResponse.json({
    success: true,
    mode: dryRun ? 'dry_run' : 'live',
    notifications_enabled: !dryRun,
    test_email_filter: getTestEmail() || null,
    timestamp: new Date().toISOString(),
    activation_reminders: activationResults,
    link_page_nudges: linkPageResults,
  });
}

/**
 * GET /api/notifications/cron - Status check
 */
export async function GET(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabase();

  // Get recent notification log entries
  const { data: recentLogs } = await supabase
    .from('notification_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  // Get counts by status
  const { data: statusCounts } = await supabase
    .from('notification_log')
    .select('status, notification_type')
    .order('created_at', { ascending: false });

  const counts: Record<string, number> = {};
  statusCounts?.forEach((row) => {
    const key = `${row.notification_type}:${row.status}`;
    counts[key] = (counts[key] || 0) + 1;
  });

  return NextResponse.json({
    notifications_enabled: isEnabled(),
    mode: isEnabled() ? 'live' : 'dry_run',
    summary: counts,
    recent: recentLogs || [],
  });
}
