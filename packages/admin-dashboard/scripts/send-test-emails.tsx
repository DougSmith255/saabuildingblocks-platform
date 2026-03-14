/**
 * Send test emails for all templates to verify styling
 * Usage: npx tsx scripts/send-test-emails.tsx
 */

import { render } from '@react-email/render';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const resend = new Resend(process.env.RESEND_API_KEY);
const TO = 'doug@smartagentalliance.com';
const FROM = 'Smart Agent Alliance <team@smartagentalliance.com>';

// Import all templates
import { PasswordResetEmail } from '../lib/email/templates/PasswordResetEmail';
import { UsernameReminderEmail } from '../lib/email/templates/UsernameReminderEmail';
import { WelcomeEmail } from '../lib/email/templates/WelcomeEmail';
import { AccountLockedEmail } from '../lib/email/templates/AccountLockedEmail';
import { ApplyInstructionsEmail } from '../lib/email/templates/ApplyInstructionsEmail';
import { AgentActivationEmail } from '../lib/email/templates/AgentActivationEmail';
import { ActivationApologyEmail } from '../lib/email/templates/ActivationApologyEmail';
import { AnnouncementEmail } from '../lib/email/templates/AnnouncementEmail';
import { LinkPageNudgeEmail } from '../lib/email/templates/LinkPageNudgeEmail';
import { BookingReferralNotification } from '../lib/email/templates/BookingReferralNotification';
import { PortalPromoEmail } from '../lib/email/templates/PortalPromoEmail';
import { AutomationAlertEmail } from '../lib/email/templates/AutomationAlertEmail';

async function sendTest(name: string, subject: string, element: React.ReactElement) {
  try {
    const html = await render(element);
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: TO,
      subject: `[TEST] ${subject}`,
      html,
      tags: [{ name: 'category', value: 'test_styling' }],
    });
    if (error) {
      console.error(`  FAIL ${name}:`, error.message);
    } else {
      console.log(`  OK   ${name} (${data?.id})`);
    }
  } catch (err: any) {
    console.error(`  ERR  ${name}:`, err.message);
  }
}

async function main() {
  console.log('Sending 12 test emails to', TO, '(updated styling)...\n');

  // Resend rate limit: 2 requests/sec, so 600ms between sends
  const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

  await sendTest('PasswordResetEmail', 'Password Reset',
    PasswordResetEmail({
      username: 'dougsmith',
      resetLink: 'https://smartagentalliance.com/agent-portal/login?reset_token=test123',
      expiresInMinutes: 15,
    })
  );
  await delay(600);

  await sendTest('UsernameReminderEmail', 'Username Reminder',
    UsernameReminderEmail({
      username: 'dougsmith',
      email: 'doug@smartagentalliance.com',
    })
  );
  await delay(600);

  await sendTest('WelcomeEmail', 'Welcome / Activation',
    WelcomeEmail({
      firstName: 'Doug',
      activationLink: 'https://smartagentalliance.com/agent-portal/activate?token_hash=test123&type=invite',
      expiresInHours: 168,
    })
  );
  await delay(600);

  await sendTest('AgentActivationEmail', 'Agent Activation',
    AgentActivationEmail({
      firstName: 'Doug',
      activationLink: 'https://smartagentalliance.com/agent-portal/activate?token_hash=test123&type=invite',
      expiresInHours: 168,
    })
  );
  await delay(600);

  await sendTest('ActivationApologyEmail', 'Activation Apology',
    ActivationApologyEmail({
      firstName: 'Doug',
      activationLink: 'https://smartagentalliance.com/agent-portal/activate?token_hash=test123&type=invite',
      expiresInHours: 168,
    })
  );
  await delay(600);

  await sendTest('AccountLockedEmail', 'Account Locked',
    AccountLockedEmail({
      username: 'dougsmith',
      unlockTime: new Date(Date.now() + 30 * 60 * 1000),
      reason: 'Too many failed login attempts',
      supportUrl: 'https://smartagentalliance.com/contact',
    })
  );
  await delay(600);

  await sendTest('AnnouncementEmail', 'Announcement',
    AnnouncementEmail({
      recipientName: 'Doug',
    })
  );
  await delay(600);

  await sendTest('ApplyInstructionsEmail', 'Apply Instructions',
    ApplyInstructionsEmail({
      recipientFirstName: 'Doug',
      agentName: 'Sarah Johnson',
      agentEmail: 'sarah@example.com',
    })
  );
  await delay(600);

  await sendTest('LinkPageNudgeEmail', 'Link Page Nudge',
    LinkPageNudgeEmail({
      firstName: 'Doug',
      portalLink: 'https://smartagentalliance.com/agent-portal',
    })
  );
  await delay(600);

  await sendTest('BookingReferralNotification', 'Booking Referral',
    BookingReferralNotification({
      agentFirstName: 'Doug',
      visitorName: 'Jane Smith',
      visitorEmail: 'jane@example.com',
      visitorPhone: '(555) 123-4567',
      bookingTime: 'March 15, 2026 at 2:00 PM EST',
      appointmentTitle: 'Real Estate Consultation',
      portalUrl: 'https://smartagentalliance.com/agent-portal',
    })
  );
  await delay(600);

  await sendTest('PortalPromoEmail', 'Portal Promo',
    PortalPromoEmail({
      firstName: 'Doug',
    })
  );
  await delay(600);

  await sendTest('AutomationAlertEmail', 'Automation Alert',
    AutomationAlertEmail({
      newlyBroken: [
        { id: '1', name: 'Weekly Newsletter', category: 'Email', description: 'Automated weekly digest', statusDetail: 'SMTP timeout' },
      ],
      newlyRecovered: [
        { id: '2', name: 'Welcome Sequence', category: 'Onboarding', description: 'New agent welcome emails' },
      ],
      totalActive: 8,
      totalBroken: 1,
      totalAutomations: 10,
      timestamp: new Date().toISOString(),
    })
  );

  console.log('\nDone! Check your inbox.');
}

main().catch(console.error);
