/**
 * Send announcement email preview to doug@smartagentalliance.com
 * Run with: npx tsx scripts/send-announcement-preview.ts
 */

import { sendEmail } from '../lib/email/client';
import { AnnouncementEmail } from '../lib/email/templates/AnnouncementEmail';

async function main() {
  console.log('Sending announcement preview to doug@smartagentalliance.com...');

  const result = await sendEmail({
    to: 'doug@smartagentalliance.com',
    subject: 'Big Things Are Coming - Smart Agent Alliance',
    react: AnnouncementEmail({ recipientName: 'Doug' }),
    tags: [{ name: 'category', value: 'announcement_preview' }],
  });

  console.log('Result:', JSON.stringify(result, null, 2));
  process.exit(result.success ? 0 : 1);
}

main();
