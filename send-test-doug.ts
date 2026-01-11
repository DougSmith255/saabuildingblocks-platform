/**
 * Send all email templates to doug@smartagentalliance.com
 */

import {
  sendPasswordResetEmail,
  sendUsernameReminderEmail,
  sendWelcomeEmail,
  sendAccountLockedEmail,
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
    'Doug',  // First name only
    'test-reset-token-12345',
    15
  );
  console.log('   Result:', passwordResult.success ? '✅ Sent' : `❌ Failed: ${passwordResult.error}`);

  await new Promise(r => setTimeout(r, 600));

  // 2. Username Reminder Email
  console.log('\n2. Sending Username Reminder Email...');
  const usernameResult = await sendUsernameReminderEmail(
    TEST_EMAIL,
    'DougSmart'
  );
  console.log('   Result:', usernameResult.success ? '✅ Sent' : `❌ Failed: ${usernameResult.error}`);

  await new Promise(r => setTimeout(r, 600));

  // 3. Welcome/Activation Email
  console.log('\n3. Sending Welcome Email...');
  const welcomeResult = await sendWelcomeEmail(
    TEST_EMAIL,
    'Doug',  // First name only
    'test-activation-token-12345',
    48
  );
  console.log('   Result:', welcomeResult.success ? '✅ Sent' : `❌ Failed: ${welcomeResult.error}`);

  await new Promise(r => setTimeout(r, 600));

  // 4. Account Locked Email
  console.log('\n4. Sending Account Locked Email...');
  const lockedResult = await sendAccountLockedEmail(
    TEST_EMAIL,
    'Doug',  // First name only
    new Date(Date.now() + 30 * 60 * 1000),
    'Too many failed login attempts'
  );
  console.log('   Result:', lockedResult.success ? '✅ Sent' : `❌ Failed: ${lockedResult.error}`);

  await new Promise(r => setTimeout(r, 600));

  // 5. Apply Instructions Email
  console.log('\n5. Sending Apply Instructions Email...');
  const applyResult = await sendApplyInstructionsEmail({
    recipientEmail: TEST_EMAIL,
    recipientFirstName: 'Doug',
    agentName: 'Sheldon "Doug" Smart',
    agentEmail: 'doug.smart@expreferral.com',
  });
  console.log('   Result:', applyResult.success ? '✅ Sent' : `❌ Failed: ${applyResult.error}`);

  console.log('\n' + '='.repeat(50));
  console.log('📧 All test emails sent!');
  console.log('Check your inbox at:', TEST_EMAIL);
}

sendAllTestEmails().catch(console.error);
