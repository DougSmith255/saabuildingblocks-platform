/**
 * Send a single test email to check logo rendering
 */

import { sendWelcomeEmail } from './packages/admin-dashboard/lib/email/send';

const TEST_EMAIL = 'sheldontosmart@gmail.com';

async function sendTestEmail() {
  console.log('📧 Sending Welcome Email to:', TEST_EMAIL);
  
  const result = await sendWelcomeEmail(
    TEST_EMAIL,
    'Sheldon',
    'test-activation-token-12345',
    48
  );
  
  console.log('Result:', result.success ? '✅ Sent' : `❌ Failed: ${result.error}`);
}

sendTestEmail().catch(console.error);
