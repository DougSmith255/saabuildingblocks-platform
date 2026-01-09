/**
 * Email Preview Generator
 *
 * Generates HTML previews of all email templates for review.
 * Run with: npx tsx lib/email/generate-previews.tsx
 */

import * as React from 'react';
import { render } from '@react-email/render';
import * as fs from 'fs';
import * as path from 'path';

// Import all email templates
import { PasswordResetEmail } from './templates/PasswordResetEmail';
import { WelcomeEmail } from './templates/WelcomeEmail';
import { InvitationEmail } from './templates/InvitationEmail';
import { AccountLockedEmail } from './templates/AccountLockedEmail';
import { UsernameReminderEmail } from './templates/UsernameReminderEmail';
import { ApplyInstructionsEmail } from './templates/ApplyInstructionsEmail';

const outputDir = path.join(process.cwd(), 'email-previews');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate all email previews
async function generatePreviews() {
  console.log('🎨 Generating email template previews...\n');

  const templates = [
    {
      name: 'password-reset',
      component: PasswordResetEmail({
        username: 'JohnDoe',
        resetLink: 'https://smartagentalliance.com/reset-password/abc123xyz',
        expiresInMinutes: 15,
      }),
    },
    {
      name: 'welcome',
      component: WelcomeEmail({
        firstName: 'John',
        activationLink: 'https://smartagentalliance.com/agent-portal/activate?token=abc123',
        expiresInHours: 24,
      }),
    },
    {
      name: 'invitation',
      component: InvitationEmail({
        full_name: 'John Doe',
        activationLink: 'https://smartagentalliance.com/agent-portal/activate?token=abc123',
        expiresIn: '7 days',
        inviterName: 'Doug Smith',
        role: 'user',
      }),
    },
    {
      name: 'account-locked',
      component: AccountLockedEmail({
        username: 'JohnDoe',
        unlockTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
        reason: 'multiple failed login attempts',
      }),
    },
    {
      name: 'username-reminder',
      component: UsernameReminderEmail({
        username: 'JohnDoe',
        email: 'john.doe@example.com',
      }),
    },
    {
      name: 'apply-instructions',
      component: ApplyInstructionsEmail({
        recipientFirstName: 'John',
        agentName: 'Doug Smith',
        agentEmail: 'doug@smartagentalliance.com',
      }),
    },
  ];

  for (const template of templates) {
    try {
      const html = await render(template.component);
      const outputPath = path.join(outputDir, `${template.name}.html`);
      fs.writeFileSync(outputPath, html);
      console.log(`✅ ${template.name}.html`);
    } catch (error) {
      console.error(`❌ ${template.name}: ${error}`);
    }
  }

  console.log(`\n📁 Previews saved to: ${outputDir}`);
  console.log('\nOpen the HTML files in a browser to see the email templates.');
}

generatePreviews();
