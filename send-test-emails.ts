/**
 * Send all email templates to test address
 * Run with: npx tsx send-test-emails.ts
 */

import {
  sendPasswordResetEmail,
  sendUsernameReminderEmail,
  sendWelcomeEmail,
  sendAccountLockedEmail,
  sendInvitationEmail,
  sendApplyInstructionsEmail,
} from './packages/admin-dashboard/lib/email/send';

const TEST_EMAIL = 'doug@smartagentalliance.com';

async function sendAllTestEmails() {
  console.log('📧 Sending all email templates to:', TEST_EMAIL);
  console.log('='.repeat(50));

  // 1. Password Reset Email
  console.log('\n1. Sending Password Reset Email...');
  const passwordResult = await sendPasswordResetEmail(
    TEST_EMAIL,
    'DougSmart',
    'test-reset-token-12345',
    15
  );
  console.log('   Result:', passwordResult.success ? '✅ Sent' : `❌ Failed: ${passwordResult.error}`);

  // 2. Username Reminder Email
  console.log('\n2. Sending Username Reminder Email...');
  const usernameResult = await sendUsernameReminderEmail(
    TEST_EMAIL,
    'DougSmart'
  );
  console.log('   Result:', usernameResult.success ? '✅ Sent' : `❌ Failed: ${usernameResult.error}`);

  // 3. Welcome/Activation Email
  console.log('\n3. Sending Welcome Email...');
  const welcomeResult = await sendWelcomeEmail(
    TEST_EMAIL,
    'Doug',
    'test-activation-token-12345',
    48
  );
  console.log('   Result:', welcomeResult.success ? '✅ Sent' : `❌ Failed: ${welcomeResult.error}`);

  // 4. Account Locked Email
  console.log('\n4. Sending Account Locked Email...');
  const lockedResult = await sendAccountLockedEmail(
    TEST_EMAIL,
    'DougSmart',
    new Date(Date.now() + 30 * 60 * 1000), // 30 mins from now
    'Too many failed login attempts'
  );
  console.log('   Result:', lockedResult.success ? '✅ Sent' : `❌ Failed: ${lockedResult.error}`);

  // 5. Invitation Email
  console.log('\n5. Sending Invitation Email...');
  const inviteResult = await sendInvitationEmail({
    to: TEST_EMAIL,
    first_name: 'Doug',
    last_name: 'Smart',
    activationToken: 'test-invite-token-12345',
    inviterName: 'Karrie Hill',
    role: 'user',
    expiresInDays: 7,
  });
  console.log('   Result:', inviteResult.success ? '✅ Sent' : `❌ Failed: ${inviteResult.error}`);

  // 6. Apply Instructions Email
  console.log('\n6. Sending Apply Instructions Email...');
  const applyResult = await sendApplyInstructionsEmail({
    recipientEmail: TEST_EMAIL,
    recipientFirstName: 'Doug',
    agentName: 'Karrie Hill',
    agentEmail: 'karrie@smartagentalliance.com',
  });
  console.log('   Result:', applyResult.success ? '✅ Sent' : `❌ Failed: ${applyResult.error}`);

  console.log('\n' + '='.repeat(50));
  console.log('📧 All test emails sent!');
  console.log('Check your inbox at:', TEST_EMAIL);
}

sendAllTestEmails().catch(console.error);
