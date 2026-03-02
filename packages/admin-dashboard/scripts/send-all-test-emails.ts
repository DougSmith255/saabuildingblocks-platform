/**
 * Send test emails for ALL 10 email templates to doug@smartagentalliance.com
 * Run with: npx tsx scripts/send-all-test-emails.ts
 */

import { sendEmail } from '../lib/email/client';
import { AgentActivationEmail } from '../lib/email/templates/AgentActivationEmail';
import { WelcomeEmail } from '../lib/email/templates/WelcomeEmail';
import { PasswordResetEmail } from '../lib/email/templates/PasswordResetEmail';
import { AccountLockedEmail } from '../lib/email/templates/AccountLockedEmail';
import { UsernameReminderEmail } from '../lib/email/templates/UsernameReminderEmail';
import { AnnouncementEmail } from '../lib/email/templates/AnnouncementEmail';
import { LinkPageNudgeEmail } from '../lib/email/templates/LinkPageNudgeEmail';
import { BookingReferralNotification } from '../lib/email/templates/BookingReferralNotification';
import { ApplyInstructionsEmail } from '../lib/email/templates/ApplyInstructionsEmail';
import { PortalPromoEmail } from '../lib/email/templates/PortalPromoEmail';

const TO = 'doug@smartagentalliance.com';

const templates = [
  {
    name: '1. Agent Activation',
    subject: '[TEST] Agent Activation Email',
    react: AgentActivationEmail({
      firstName: 'Doug',
      activationLink: 'https://saabuildingblocks.com/activate-account?token=test-token-123',
      expiresInHours: 48,
    }),
  },
  {
    name: '2. Welcome',
    subject: '[TEST] Welcome Email',
    react: WelcomeEmail({
      firstName: 'Doug',
      activationLink: 'https://saabuildingblocks.com/activate-account?token=test-token-123',
      expiresInHours: 48,
    }),
  },
  {
    name: '3. Password Reset',
    subject: '[TEST] Password Reset Email',
    react: PasswordResetEmail({
      username: 'doug.smart',
      resetLink: 'https://smartagentalliance.com/agent-portal/login?reset_token=test-token-123',
      expiresInMinutes: 15,
    }),
  },
  {
    name: '4. Account Locked',
    subject: '[TEST] Account Locked Email',
    react: AccountLockedEmail({
      username: 'doug.smart',
      unlockTime: new Date(Date.now() + 30 * 60 * 1000),
      reason: 'Too many failed login attempts',
      supportUrl: 'https://smartagentalliance.com/contact',
    }),
  },
  {
    name: '5. Username Reminder',
    subject: '[TEST] Username Reminder Email',
    react: UsernameReminderEmail({
      username: 'doug.smart',
      email: 'doug@smartagentalliance.com',
    }),
  },
  {
    name: '6. Announcement',
    subject: '[TEST] Announcement Email',
    react: AnnouncementEmail({
      recipientName: 'Doug',
    }),
  },
  {
    name: '7. Link Page Nudge',
    subject: '[TEST] Link Page Nudge Email',
    react: LinkPageNudgeEmail({
      firstName: 'Doug',
      portalLink: 'https://smartagentalliance.com/agent-portal?section=linktree',
    }),
  },
  {
    name: '8. Booking Referral Notification',
    subject: '[TEST] Booking Referral Notification',
    react: BookingReferralNotification({
      agentFirstName: 'Doug',
      visitorName: 'Jane Smith',
      visitorEmail: 'jane@example.com',
      visitorPhone: '(555) 123-4567',
      bookingTime: 'Friday, February 28 at 2:00 PM EST',
      meetingLink: 'https://zoom.us/j/123456789',
      appointmentTitle: 'Discovery Call',
    }),
  },
  {
    name: '9. Apply Instructions',
    subject: '[TEST] Apply Instructions Email',
    react: ApplyInstructionsEmail({
      recipientFirstName: 'Doug',
      agentName: 'Karrie Hill',
      agentEmail: 'karrie@smartagentalliance.com',
    }),
  },
  {
    name: '10. Portal Promo',
    subject: '[TEST] Portal Promo Email',
    react: PortalPromoEmail({
      firstName: 'Doug',
    }),
  },
];

async function main() {
  console.log(`Sending ${templates.length} test emails to ${TO}...\n`);

  let successes = 0;
  let failures = 0;

  for (const template of templates) {
    process.stdout.write(`  ${template.name}... `);
    try {
      const result = await sendEmail({
        to: TO,
        subject: template.subject,
        react: template.react,
        tags: [{ name: 'category', value: 'test_all_templates' }],
      });

      if (result.success) {
        console.log(`OK (${result.messageId})`);
        successes++;
      } else {
        console.log(`FAILED: ${result.error}`);
        failures++;
      }
    } catch (err) {
      console.log(`ERROR: ${err instanceof Error ? err.message : err}`);
      failures++;
    }

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\nDone! ${successes} sent, ${failures} failed.`);
  process.exit(failures > 0 ? 1 : 0);
}

main();
