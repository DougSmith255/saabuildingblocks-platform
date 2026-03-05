/**
 * Reset accounts to invited status and generate fresh activation tokens.
 *
 * Usage:
 *   npx tsx scripts/reset-and-resend-activation.ts --dry-run     # Preview only
 *   npx tsx scripts/reset-and-resend-activation.ts --send-test    # Reset + send to test account only
 *   npx tsx scripts/reset-and-resend-activation.ts --send-all     # Reset + send to all targets
 */

import { createClient } from '@supabase/supabase-js';
import { sendApologyActivationEmail } from '../lib/email/send';
import dotenv from 'dotenv';

// Load env
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const mode = process.argv[2] || '--dry-run';

// Target accounts to reset
const TARGET_EMAILS = [
  'tasha@tashalocks.com',
  'wilmeth.hudon@inboxorigin.com', // Doug Testing555
];

// Only send test email to this account
const TEST_EMAIL = 'wilmeth.hudon@inboxorigin.com';

async function resetAccount(email: string) {
  console.log(`\n--- Processing: ${email} ---`);

  // 1. Find the user
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, email, full_name, first_name, status, auth_user_id, activated_at')
    .eq('email', email)
    .single();

  if (userError || !user) {
    console.error(`  User not found: ${email}`, userError?.message);
    return null;
  }

  console.log(`  Found user: ${user.full_name || user.name} (${user.id})`);
  console.log(`  Current status: ${user.status}, activated_at: ${user.activated_at}`);

  if (mode === '--dry-run') {
    console.log('  [DRY RUN] Would reset to invited status');
    console.log('  [DRY RUN] Would generate fresh Supabase invite token');
    console.log('  [DRY RUN] Would update invitation record');
    return { user, tokenHash: 'DRY_RUN_TOKEN' };
  }

  // 2. Reset user status to invited
  const { error: updateError } = await supabase
    .from('users')
    .update({
      status: 'invited',
      activated_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (updateError) {
    console.error(`  Failed to reset user status:`, updateError.message);
    return null;
  }
  console.log(`  User status reset to 'invited'`);

  // 3. If user has a Supabase auth account, delete it so a fresh invite can be generated
  if (user.auth_user_id) {
    console.log(`  Deleting existing Supabase auth user: ${user.auth_user_id}`);
    const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(user.auth_user_id);
    if (deleteAuthError) {
      console.error(`  Warning: Could not delete auth user:`, deleteAuthError.message);
    } else {
      console.log(`  Supabase auth user deleted`);
    }
    // Clear the auth_user_id reference
    await supabase.from('users').update({ auth_user_id: null }).eq('id', user.id);
  }

  // 4. Generate fresh Supabase invite link
  const activationBaseUrl = 'https://smartagentalliance.com';
  const redirectTo = `${activationBaseUrl}/agent-portal/activate`;

  const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
    type: 'invite',
    email: email,
    options: { redirectTo },
  });

  if (linkError || !linkData?.properties?.hashed_token) {
    console.error(`  Failed to generate invite link:`, linkError?.message);
    return null;
  }

  const hashedToken = linkData.properties.hashed_token;
  console.log(`  Fresh invite token generated (${hashedToken.substring(0, 12)}...)`);

  // Link new auth user to our users table
  if (linkData.user?.id) {
    await supabase.from('users').update({ auth_user_id: linkData.user.id }).eq('id', user.id);
    console.log(`  Linked new auth user: ${linkData.user.id}`);
  }

  // 5. Update or create invitation record
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  // Check for existing invitation
  const { data: existingInvitation } = await supabase
    .from('user_invitations')
    .select('id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (existingInvitation) {
    // Update existing invitation
    const { error: invUpdateError } = await supabase
      .from('user_invitations')
      .update({
        token_hash: hashedToken,
        status: 'pending',
        expires_at: expiresAt,
        sent_at: new Date().toISOString(),
      })
      .eq('id', existingInvitation.id);

    if (invUpdateError) {
      console.error(`  Failed to update invitation:`, invUpdateError.message);
    } else {
      console.log(`  Invitation record updated (${existingInvitation.id})`);
    }
  } else {
    // Create new invitation
    const { error: invCreateError } = await supabase
      .from('user_invitations')
      .insert({
        user_id: user.id,
        email: email,
        token_hash: hashedToken,
        status: 'pending',
        expires_at: expiresAt,
        sent_at: new Date().toISOString(),
      });

    if (invCreateError) {
      console.error(`  Failed to create invitation:`, invCreateError.message);
    } else {
      console.log(`  New invitation record created`);
    }
  }

  return { user, tokenHash: hashedToken };
}

async function main() {
  console.log(`Mode: ${mode}`);
  console.log(`Targets: ${TARGET_EMAILS.join(', ')}`);

  const results: Array<{ email: string; firstName: string; tokenHash: string } | null> = [];

  for (const email of TARGET_EMAILS) {
    const result = await resetAccount(email);
    if (result) {
      const firstName = result.user.first_name || result.user.full_name?.split(' ')[0] || 'Agent';
      results.push({ email, firstName, tokenHash: result.tokenHash });
    } else {
      results.push(null);
    }
  }

  // Send emails
  if (mode === '--send-test') {
    const testResult = results.find(r => r?.email === TEST_EMAIL);
    if (testResult) {
      console.log(`\nSending test email to ${TEST_EMAIL}...`);
      const emailResult = await sendApologyActivationEmail(
        testResult.email,
        testResult.firstName,
        testResult.tokenHash,
        48
      );
      console.log(`  Email result:`, emailResult.success ? 'SENT' : `FAILED: ${emailResult.error}`);
      if (emailResult.messageId) console.log(`  Message ID: ${emailResult.messageId}`);
    } else {
      console.log(`\nTest account not found or failed to reset.`);
    }
  } else if (mode === '--send-all') {
    console.log(`\nSending apology emails to all targets...`);
    for (const result of results) {
      if (!result) continue;
      console.log(`  Sending to ${result.email}...`);
      const emailResult = await sendApologyActivationEmail(
        result.email,
        result.firstName,
        result.tokenHash,
        48
      );
      console.log(`    Result:`, emailResult.success ? 'SENT' : `FAILED: ${emailResult.error}`);
      // Rate limit
      await new Promise(r => setTimeout(r, 200));
    }
  } else {
    console.log(`\n[DRY RUN] No emails sent. Use --send-test or --send-all to send.`);
  }

  console.log('\nDone.');
}

main().catch(console.error);
