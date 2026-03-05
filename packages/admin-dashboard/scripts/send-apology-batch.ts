/**
 * Send apology activation email to all invited agents.
 * For each agent:
 *   1. Delete existing Supabase auth user (if any)
 *   2. Generate fresh Supabase invite link (7-day token)
 *   3. Update invitation record
 *   4. Send apology email
 *   5. Reset notification_log so the 7-day resend timer starts fresh
 *
 * Usage:
 *   npx tsx scripts/send-apology-batch.ts --dry-run
 *   npx tsx scripts/send-apology-batch.ts --send
 */

import { createClient } from '@supabase/supabase-js';
import { sendApologyActivationEmail } from '../lib/email/send';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const mode = process.argv[2] || '--dry-run';

// Skip test accounts
const SKIP_EMAILS = [
  'wilmeth.hudon@inboxorigin.com',  // Doug Testing555
  'jotero2955@7novels.com',          // Doug TestActivation
];

async function main() {
  // Get all invited users
  const { data: users, error } = await supabase
    .from('users')
    .select('id, email, full_name, first_name, auth_user_id')
    .eq('status', 'invited')
    .order('full_name');

  if (error || !users) {
    console.error('Failed to fetch users:', error?.message);
    return;
  }

  const targets = users.filter(u => !SKIP_EMAILS.includes(u.email));
  console.log(`Mode: ${mode}`);
  console.log(`Found ${users.length} invited users, ${targets.length} real agents to process\n`);

  let sent = 0;
  let failed = 0;

  for (const user of targets) {
    const firstName = user.first_name || user.full_name?.split(' ')[0] || 'Agent';
    console.log(`--- ${user.full_name} (${user.email}) ---`);

    if (mode === '--dry-run') {
      console.log(`  [DRY RUN] Would generate token, send apology email, reset timer\n`);
      continue;
    }

    try {
      // 1. Delete existing auth user if any
      if (user.auth_user_id) {
        await supabase.auth.admin.deleteUser(user.auth_user_id);
        await supabase.from('users').update({ auth_user_id: null }).eq('id', user.id);
        console.log(`  Deleted old auth user`);
      }

      // 2. Generate fresh Supabase invite link
      const { data: linkData, error: linkErr } = await supabase.auth.admin.generateLink({
        type: 'invite',
        email: user.email,
        options: { redirectTo: 'https://smartagentalliance.com/agent-portal/activate' },
      });

      if (linkErr || !linkData?.properties?.hashed_token) {
        console.error(`  FAILED to generate token: ${linkErr?.message}`);
        failed++;
        continue;
      }

      const hashedToken = linkData.properties.hashed_token;

      // Link new auth user
      if (linkData.user?.id) {
        await supabase.from('users').update({ auth_user_id: linkData.user.id }).eq('id', user.id);
      }

      // 3. Update invitation record
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      const now = new Date().toISOString();

      await supabase.from('user_invitations').update({
        token_hash: hashedToken,
        status: 'pending',
        expires_at: expiresAt,
        sent_at: now,
      }).eq('user_id', user.id);

      // 4. Send apology email
      const result = await sendApologyActivationEmail(user.email, firstName, hashedToken, 168);

      if (result.success) {
        sent++;
        console.log(`  SENT (${result.messageId})`);

        // 5. Log to notification_log so cron's 7-day timer resets from NOW
        await supabase.from('notification_log').insert({
          user_id: user.id,
          user_email: user.email,
          notification_type: 'activation_apology',
          channel: 'email',
          status: 'sent',
          email_message_id: result.messageId || null,
          trigger_reason: 'Apology email - system upgrade, fresh activation link',
          metadata: { batch: true },
        });
      } else {
        failed++;
        console.error(`  FAILED: ${result.error}`);
      }

      // Rate limit - 200ms between emails
      await new Promise(r => setTimeout(r, 200));

    } catch (err) {
      failed++;
      console.error(`  ERROR:`, err instanceof Error ? err.message : err);
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Total: ${targets.length}, Sent: ${sent}, Failed: ${failed}`);
}

main().catch(console.error);
