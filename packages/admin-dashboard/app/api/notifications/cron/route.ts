// Force dynamic rendering - exclude from static export
export const dynamic = 'force-dynamic';

/**
 * Notification Cron API Route
 * POST /api/notifications/cron
 *
 * Called hourly by system cron. Checks timezone windows and sends:
 *
 * 1. Activation reminders (existing agents, invited before Feb 25 2026):
 *    - AgentActivationEmail every 2 days until they activate
 *    - Fresh token generated each time
 *
 * 2. Welcome reminders (new agents, invited Feb 25 2026 or later):
 *    - WelcomeEmail every 2 days until they activate
 *    - Fresh token generated each time
 *
 * 3. Link page nudges (active users, onboarding complete):
 *    - LinkPageNudgeEmail every 2 days, max 4 sends
 *    - Only if link page not yet activated
 *
 * Timezone-aware: only sends when it's 9-10 AM in the user's local timezone.
 * Users without a state default to America/New_York.
 *
 * Controlled by NOTIFICATIONS_ENABLED env var.
 * Authentication: requires AUTOMATION_SECRET header or Bearer token.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomBytes, createHash } from 'crypto';
import { sendWelcomeEmail, sendAgentActivationEmail } from '@/lib/email/send';
import { sendEmail } from '@/lib/email/client';
import { LinkPageNudgeEmail } from '@/lib/email/templates/LinkPageNudgeEmail';

// Portal launch cutoff - agents invited before this are "existing" (get AgentActivationEmail)
// Agents invited on or after this date are "new" (get WelcomeEmail)
// Set to Feb 26 to include the Feb 25 batch as existing agents
const PORTAL_LAUNCH_DATE = '2026-02-26T00:00:00.000Z';

// How many days between repeat sends
const REPEAT_INTERVAL_DAYS = 2;

// Max link page nudge emails
const MAX_LINK_PAGE_NUDGES = 4;

// Target local hour for sending (9 AM)
const TARGET_HOUR = 9;

// ============================================================================
// State abbreviation to timezone mapping
// ============================================================================

const STATE_TIMEZONES: Record<string, string> = {
  // Eastern
  CT: 'America/New_York', DE: 'America/New_York', FL: 'America/New_York',
  GA: 'America/New_York', ME: 'America/New_York', MD: 'America/New_York',
  MA: 'America/New_York', MI: 'America/Detroit', NH: 'America/New_York',
  NJ: 'America/New_York', NY: 'America/New_York', NC: 'America/New_York',
  OH: 'America/New_York', PA: 'America/New_York', RI: 'America/New_York',
  SC: 'America/New_York', VT: 'America/New_York', VA: 'America/New_York',
  WV: 'America/New_York', DC: 'America/New_York',
  // Central
  AL: 'America/Chicago', AR: 'America/Chicago', IL: 'America/Chicago',
  IN: 'America/Indiana/Indianapolis', IA: 'America/Chicago', KS: 'America/Chicago',
  KY: 'America/Kentucky/Louisville', LA: 'America/Chicago', MN: 'America/Chicago',
  MS: 'America/Chicago', MO: 'America/Chicago', NE: 'America/Chicago',
  ND: 'America/Chicago', OK: 'America/Chicago', SD: 'America/Chicago',
  TN: 'America/Chicago', TX: 'America/Chicago', WI: 'America/Chicago',
  // Mountain
  AZ: 'America/Phoenix', CO: 'America/Denver', ID: 'America/Boise',
  MT: 'America/Denver', NM: 'America/Denver', UT: 'America/Denver',
  WY: 'America/Denver',
  // Pacific
  CA: 'America/Los_Angeles', NV: 'America/Los_Angeles',
  OR: 'America/Los_Angeles', WA: 'America/Los_Angeles',
  // Other
  AK: 'America/Anchorage', HI: 'Pacific/Honolulu',
};

function getTimezone(state: string | null): string {
  if (state && STATE_TIMEZONES[state.toUpperCase()]) {
    return STATE_TIMEZONES[state.toUpperCase()];
  }
  return 'America/New_York'; // default
}

/**
 * Check if current UTC time falls in the target hour window for a timezone.
 * Returns true if it's currently TARGET_HOUR:00-TARGET_HOUR:59 in that timezone.
 */
function isInSendWindow(timezone: string): boolean {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    hour12: false,
  });
  const localHour = parseInt(formatter.format(now), 10);
  return localHour === TARGET_HOUR;
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

function verifyAuth(request: NextRequest): boolean {
  const secret = request.headers.get('x-automation-secret');
  if (secret && secret === process.env.AUTOMATION_SECRET) {
    return true;
  }
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return true;
  }
  return false;
}

// ============================================================================
// 1. Activation Reminders (existing agents - invited before portal launch)
// ============================================================================

async function sweepActivationReminders(
  supabase: ReturnType<typeof getSupabase>,
  dryRun: boolean
) {
  const results: Array<{ email: string; name: string; status: string; reason: string }> = [];

  // Get all invited users created BEFORE portal launch (existing agents)
  const { data: users, error } = await supabase
    .from('users')
    .select('id, email, first_name, last_name, status, created_at, state')
    .eq('status', 'invited')
    .lt('created_at', PORTAL_LAUNCH_DATE);

  if (error || !users?.length) {
    return { type: 'activation_reminder', checked: 0, sent: 0, results: [] };
  }

  let sentCount = 0;

  for (const user of users) {
    const name = `${user.first_name} ${user.last_name}`;
    const timezone = getTimezone(user.state);

    // Check timezone window
    if (!isInSendWindow(timezone)) {
      results.push({ email: user.email, name, status: 'skipped', reason: `Not in send window (${timezone})` });
      continue;
    }

    // Check last send date - only send if >= 2 days since last send
    const { data: lastSend } = await supabase
      .from('notification_log')
      .select('created_at')
      .eq('user_id', user.id)
      .in('notification_type', ['activation_reminder', 'activation_blast', 'manual_resend'])
      .eq('channel', 'email')
      .in('status', ['sent', 'dry_run'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (lastSend) {
      const daysSince = (Date.now() - new Date(lastSend.created_at).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < REPEAT_INTERVAL_DAYS) {
        results.push({ email: user.email, name, status: 'skipped', reason: `Last sent ${daysSince.toFixed(1)} days ago` });
        continue;
      }
    }

    if (dryRun) {
      await supabase.from('notification_log').insert({
        user_id: user.id,
        user_email: user.email,
        notification_type: 'activation_reminder',
        channel: 'email',
        status: 'dry_run',
        trigger_reason: 'Recurring activation reminder (existing agent)',
        metadata: { timezone, state: user.state },
      });
      results.push({ email: user.email, name, status: 'dry_run', reason: 'Would send AgentActivationEmail' });
      continue;
    }

    // Generate fresh token - store hash in DB, send plaintext in email
    const newToken = randomBytes(32).toString('hex');
    const newTokenHash = createHash('sha256').update(newToken).digest('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);

    // Update or create invitation (match 'sent' or 'pending' status)
    const { data: existingInvite } = await supabase
      .from('user_invitations')
      .select('id')
      .eq('user_id', user.id)
      .in('status', ['pending', 'sent'])
      .limit(1)
      .single();

    if (existingInvite) {
      await supabase.from('user_invitations')
        .update({ token: newTokenHash, expires_at: expiresAt.toISOString(), status: 'sent' })
        .eq('id', existingInvite.id);
    } else {
      await supabase.from('user_invitations').insert({
        user_id: user.id,
        email: user.email,
        token: newTokenHash,
        status: 'sent',
        expires_at: expiresAt.toISOString(),
      });
    }

    const emailResult = await sendAgentActivationEmail(
      user.email,
      user.first_name || 'there',
      newToken,
      48
    );

    await supabase.from('notification_log').insert({
      user_id: user.id,
      user_email: user.email,
      notification_type: 'activation_reminder',
      channel: 'email',
      status: emailResult.success ? 'sent' : 'failed',
      email_message_id: emailResult.messageId || null,
      email_error: emailResult.error || null,
      trigger_reason: 'Recurring activation reminder (existing agent)',
      metadata: { timezone, state: user.state, token_expires_at: expiresAt.toISOString() },
    });

    if (emailResult.success) sentCount++;
    results.push({
      email: user.email,
      name,
      status: emailResult.success ? 'sent' : 'failed',
      reason: emailResult.success ? 'Sent AgentActivationEmail' : emailResult.error || 'Unknown error',
    });

    await new Promise(resolve => setTimeout(resolve, 200));
  }

  return { type: 'activation_reminder', checked: users.length, sent: sentCount, results };
}

// ============================================================================
// 2. Welcome Reminders (new agents - invited on or after portal launch)
// ============================================================================

async function sweepWelcomeReminders(
  supabase: ReturnType<typeof getSupabase>,
  dryRun: boolean
) {
  const results: Array<{ email: string; name: string; status: string; reason: string }> = [];

  // Get all invited users created ON or AFTER portal launch (new agents)
  const { data: users, error } = await supabase
    .from('users')
    .select('id, email, first_name, last_name, status, created_at, state')
    .eq('status', 'invited')
    .gte('created_at', PORTAL_LAUNCH_DATE);

  if (error || !users?.length) {
    return { type: 'welcome_reminder', checked: 0, sent: 0, results: [] };
  }

  let sentCount = 0;

  for (const user of users) {
    const name = `${user.first_name} ${user.last_name}`;
    const timezone = getTimezone(user.state);

    if (!isInSendWindow(timezone)) {
      results.push({ email: user.email, name, status: 'skipped', reason: `Not in send window (${timezone})` });
      continue;
    }

    // Check last send - welcome_reminder or initial welcome
    const { data: lastSend } = await supabase
      .from('notification_log')
      .select('created_at')
      .eq('user_id', user.id)
      .in('notification_type', ['welcome_reminder', 'welcome', 'manual_resend'])
      .eq('channel', 'email')
      .in('status', ['sent', 'dry_run'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (lastSend) {
      const daysSince = (Date.now() - new Date(lastSend.created_at).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < REPEAT_INTERVAL_DAYS) {
        results.push({ email: user.email, name, status: 'skipped', reason: `Last sent ${daysSince.toFixed(1)} days ago` });
        continue;
      }
    } else {
      // No previous send logged - check if at least 2 days since account creation
      const daysSinceCreated = (Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceCreated < REPEAT_INTERVAL_DAYS) {
        results.push({ email: user.email, name, status: 'skipped', reason: `Account only ${daysSinceCreated.toFixed(1)} days old` });
        continue;
      }
    }

    if (dryRun) {
      await supabase.from('notification_log').insert({
        user_id: user.id,
        user_email: user.email,
        notification_type: 'welcome_reminder',
        channel: 'email',
        status: 'dry_run',
        trigger_reason: 'Recurring welcome reminder (new agent)',
        metadata: { timezone, state: user.state },
      });
      results.push({ email: user.email, name, status: 'dry_run', reason: 'Would send WelcomeEmail' });
      continue;
    }

    // Generate fresh token - store hash in DB, send plaintext in email
    const newToken = randomBytes(32).toString('hex');
    const newTokenHash = createHash('sha256').update(newToken).digest('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);

    // Update or create invitation (match 'sent' or 'pending' status)
    const { data: existingInvite } = await supabase
      .from('user_invitations')
      .select('id')
      .eq('user_id', user.id)
      .in('status', ['pending', 'sent'])
      .limit(1)
      .single();

    if (existingInvite) {
      await supabase.from('user_invitations')
        .update({ token: newTokenHash, expires_at: expiresAt.toISOString(), status: 'sent' })
        .eq('id', existingInvite.id);
    } else {
      await supabase.from('user_invitations').insert({
        user_id: user.id,
        email: user.email,
        token: newTokenHash,
        status: 'sent',
        expires_at: expiresAt.toISOString(),
      });
    }

    const emailResult = await sendWelcomeEmail(
      user.email,
      user.first_name || 'there',
      newToken,
      48
    );

    await supabase.from('notification_log').insert({
      user_id: user.id,
      user_email: user.email,
      notification_type: 'welcome_reminder',
      channel: 'email',
      status: emailResult.success ? 'sent' : 'failed',
      email_message_id: emailResult.messageId || null,
      email_error: emailResult.error || null,
      trigger_reason: 'Recurring welcome reminder (new agent)',
      metadata: { timezone, state: user.state, token_expires_at: expiresAt.toISOString() },
    });

    if (emailResult.success) sentCount++;
    results.push({
      email: user.email,
      name,
      status: emailResult.success ? 'sent' : 'failed',
      reason: emailResult.success ? 'Sent WelcomeEmail' : emailResult.error || 'Unknown error',
    });

    await new Promise(resolve => setTimeout(resolve, 200));
  }

  return { type: 'welcome_reminder', checked: users.length, sent: sentCount, results };
}

// ============================================================================
// 3. Link Page Nudges
// ============================================================================

async function sweepLinkPageNudges(
  supabase: ReturnType<typeof getSupabase>,
  dryRun: boolean
) {
  const results: Array<{ email: string; name: string; status: string; reason: string }> = [];

  // Get active users with onboarding complete
  const { data: users, error } = await supabase
    .from('users')
    .select('id, email, first_name, last_name, onboarding_completed_at, state')
    .eq('status', 'active')
    .not('onboarding_completed_at', 'is', null);

  if (error || !users?.length) {
    return { type: 'link_page_nudge', checked: 0, sent: 0, results: [] };
  }

  let sentCount = 0;

  for (const user of users) {
    const name = `${user.first_name} ${user.last_name}`;
    const timezone = getTimezone(user.state);

    // Check if link page is already activated
    const { data: agentPage } = await supabase
      .from('agent_pages')
      .select('activated')
      .eq('user_id', user.id)
      .single();

    if (agentPage?.activated) {
      continue; // silently skip - already activated
    }

    if (!isInSendWindow(timezone)) {
      results.push({ email: user.email, name, status: 'skipped', reason: `Not in send window (${timezone})` });
      continue;
    }

    // Count previous nudges
    const { count: nudgeCount } = await supabase
      .from('notification_log')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('notification_type', 'link_page_nudge')
      .eq('channel', 'email')
      .in('status', ['sent', 'dry_run']);

    if ((nudgeCount || 0) >= MAX_LINK_PAGE_NUDGES) {
      results.push({ email: user.email, name, status: 'skipped', reason: `Max nudges reached (${nudgeCount})` });
      continue;
    }

    // Check last send date
    const { data: lastSend } = await supabase
      .from('notification_log')
      .select('created_at')
      .eq('user_id', user.id)
      .eq('notification_type', 'link_page_nudge')
      .eq('channel', 'email')
      .in('status', ['sent', 'dry_run'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (lastSend) {
      const daysSince = (Date.now() - new Date(lastSend.created_at).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < REPEAT_INTERVAL_DAYS) {
        results.push({ email: user.email, name, status: 'skipped', reason: `Last sent ${daysSince.toFixed(1)} days ago` });
        continue;
      }
    } else {
      // First nudge - check if at least 2 days since onboarding
      const daysSinceOnboarding = (Date.now() - new Date(user.onboarding_completed_at).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceOnboarding < REPEAT_INTERVAL_DAYS) {
        results.push({ email: user.email, name, status: 'skipped', reason: `Onboarding only ${daysSinceOnboarding.toFixed(1)} days ago` });
        continue;
      }
    }

    const portalLink = 'https://smartagentalliance.com/agent-portal';

    if (dryRun) {
      await supabase.from('notification_log').insert({
        user_id: user.id,
        user_email: user.email,
        notification_type: 'link_page_nudge',
        channel: 'email',
        status: 'dry_run',
        trigger_reason: `Link page nudge #${(nudgeCount || 0) + 1}`,
        metadata: { timezone, state: user.state, nudge_number: (nudgeCount || 0) + 1 },
      });
      results.push({ email: user.email, name, status: 'dry_run', reason: `Would send nudge #${(nudgeCount || 0) + 1}` });
      continue;
    }

    const emailResult = await sendEmail({
      to: user.email,
      subject: 'Your Link Page is Ready to Set Up - Smart Agent Alliance',
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
      trigger_reason: `Link page nudge #${(nudgeCount || 0) + 1}`,
      metadata: { timezone, state: user.state, nudge_number: (nudgeCount || 0) + 1 },
    });

    if (emailResult.success) sentCount++;
    results.push({
      email: user.email,
      name,
      status: emailResult.success ? 'sent' : 'failed',
      reason: emailResult.success ? `Sent nudge #${(nudgeCount || 0) + 1}` : emailResult.error || 'Unknown error',
    });

    await new Promise(resolve => setTimeout(resolve, 200));
  }

  return { type: 'link_page_nudge', checked: users.length, sent: sentCount, results };
}

// ============================================================================
// Summary Email to Doug
// ============================================================================

async function sendSummaryEmail(
  sweepResults: Array<{ type: string; checked: number; sent: number; results: any[] }>
) {
  const totalSent = sweepResults.reduce((sum, r) => sum + r.sent, 0);
  if (totalSent === 0) return; // Don't send summary if nothing was sent

  const lines = sweepResults.map(r => {
    const sentList = r.results
      .filter((x: any) => x.status === 'sent')
      .map((x: any) => `  - ${x.name} (${x.email})`)
      .join('\n');
    return `${r.type}: ${r.sent} sent of ${r.checked} checked${sentList ? '\n' + sentList : ''}`;
  }).join('\n\n');

  const summaryHtml = `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2>Notification Cron Summary</h2>
      <p><strong>Time:</strong> ${new Date().toISOString()}</p>
      <p><strong>Total emails sent:</strong> ${totalSent}</p>
      <pre style="background: #f5f5f5; padding: 15px; border-radius: 8px; white-space: pre-wrap;">${lines}</pre>
    </div>
  `;

  try {
    await sendEmail({
      to: 'doug@smartagentalliance.com',
      subject: `[SAA Cron] ${totalSent} notification${totalSent === 1 ? '' : 's'} sent`,
      react: null as any, // Will use html fallback
      tags: [{ name: 'category', value: 'cron_summary' }],
    });
  } catch {
    // Summary email failure shouldn't break the cron
    console.error('[Cron] Failed to send summary email');
  }
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

  const activationResults = await sweepActivationReminders(supabase, dryRun);
  const welcomeResults = await sweepWelcomeReminders(supabase, dryRun);
  const linkPageResults = await sweepLinkPageNudges(supabase, dryRun);

  const allResults = [activationResults, welcomeResults, linkPageResults];

  // Send summary email to Doug if any emails were actually sent
  if (!dryRun) {
    await sendSummaryEmail(allResults);
  }

  return NextResponse.json({
    success: true,
    mode: dryRun ? 'dry_run' : 'live',
    notifications_enabled: !dryRun,
    timestamp: new Date().toISOString(),
    activation_reminders: activationResults,
    welcome_reminders: welcomeResults,
    link_page_nudges: linkPageResults,
  });
}

/**
 * GET /api/notifications/cron - Status check with recent activity
 */
export async function GET(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabase();

  // Recent log entries
  const { data: recentLogs } = await supabase
    .from('notification_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(30);

  // Count by type and status
  const { data: allLogs } = await supabase
    .from('notification_log')
    .select('status, notification_type');

  const counts: Record<string, number> = {};
  allLogs?.forEach((row) => {
    const key = `${row.notification_type}:${row.status}`;
    counts[key] = (counts[key] || 0) + 1;
  });

  // Count pending (still invited) users
  const { count: invitedCount } = await supabase
    .from('users')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'invited');

  return NextResponse.json({
    notifications_enabled: isEnabled(),
    mode: isEnabled() ? 'live' : 'dry_run',
    pending_activations: invitedCount || 0,
    summary: counts,
    recent: recentLogs || [],
  });
}
