/**
 * Render all 10 email templates to HTML files for visual review
 * Run with: npx tsx scripts/render-all-emails.ts
 */

import { render } from '@react-email/render';
import * as fs from 'fs';
import * as path from 'path';
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

const outDir = '/tmp/email-previews';

const templates = [
  { name: '01-agent-activation', el: AgentActivationEmail({ firstName: 'Doug', activationLink: 'https://smartagentalliance.com/agent-portal/activate?token_hash=test&type=invite', expiresInHours: 168 }) },
  { name: '02-welcome', el: WelcomeEmail({ firstName: 'Doug', activationLink: 'https://smartagentalliance.com/agent-portal/activate?token_hash=test&type=invite', expiresInHours: 168 }) },
  { name: '03-password-reset', el: PasswordResetEmail({ username: 'doug.smart', resetLink: 'https://smartagentalliance.com/agent-portal/login?reset_token=test', expiresInMinutes: 15 }) },
  { name: '04-account-locked', el: AccountLockedEmail({ username: 'doug.smart', unlockTime: new Date(Date.now() + 30 * 60 * 1000), reason: 'Too many failed login attempts', supportUrl: 'https://smartagentalliance.com/contact' }) },
  { name: '05-username-reminder', el: UsernameReminderEmail({ username: 'doug.smart', email: 'doug@smartagentalliance.com' }) },
  { name: '06-announcement', el: AnnouncementEmail({ recipientName: 'Doug' }) },
  { name: '07-link-page-nudge', el: LinkPageNudgeEmail({ firstName: 'Doug', portalLink: 'https://smartagentalliance.com/agent-portal?section=linktree' }) },
  { name: '08-booking-referral', el: BookingReferralNotification({ agentFirstName: 'Doug', visitorName: 'Jane Smith', visitorEmail: 'jane@example.com', visitorPhone: '(555) 123-4567', bookingTime: 'Friday, February 28 at 2:00 PM EST', meetingLink: 'https://zoom.us/j/123456789', appointmentTitle: 'Discovery Call' }) },
  { name: '09-apply-instructions', el: ApplyInstructionsEmail({ recipientFirstName: 'Doug', agentName: 'Karrie Hill', agentEmail: 'karrie@smartagentalliance.com' }) },
  { name: '10-portal-promo', el: PortalPromoEmail({ firstName: 'Doug' }) },
];

async function main() {
  fs.mkdirSync(outDir, { recursive: true });

  for (const t of templates) {
    const html = await render(t.el);
    const filePath = path.join(outDir, `${t.name}.html`);
    fs.writeFileSync(filePath, html);
    console.log(`Wrote ${filePath}`);
  }

  // Write an index page for easy browsing
  const index = `<!DOCTYPE html><html><head><title>Email Previews</title>
<style>body{background:#111;color:#eee;font-family:sans-serif;padding:20px}
a{color:#ffd700;display:block;padding:8px 0;font-size:18px}</style></head>
<body><h1>Email Template Previews</h1>
${templates.map(t => `<a href="${t.name}.html" target="_blank">${t.name}</a>`).join('\n')}
</body></html>`;
  fs.writeFileSync(path.join(outDir, 'index.html'), index);
  console.log(`\nIndex: ${outDir}/index.html`);
}

main();
