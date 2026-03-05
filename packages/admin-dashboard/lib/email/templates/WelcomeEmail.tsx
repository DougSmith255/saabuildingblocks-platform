/**
 * Welcome / Activate Account Email Template
 *
 * Sent to new users to activate their account.
 * User will create their own email and password during activation.
 */

import * as React from 'react';
import {
  EmailLayout,
  EmailHeading,
  EmailGreeting,
  EmailParagraph,
  EmailButton,
  EmailAlert,
  EmailDivider,
  EmailListItem,
  EmailLink,
  EmailSignature,
  BRAND_COLORS,
} from './components/Layout';

interface WelcomeEmailProps {
  firstName: string;
  activationLink: string;
  expiresInHours?: number;
}

export function WelcomeEmail({
  firstName,
  activationLink,
  expiresInHours = 168,
}: WelcomeEmailProps) {
  return (
    <EmailLayout preview="Welcome to Smart Agent Alliance - activate your portal to get started">
      <EmailGreeting>Hi {firstName},</EmailGreeting>

      <EmailHeading>Welcome to the Team</EmailHeading>

      <EmailParagraph>
        Your Smart Agent Alliance Agent Portal is ready. Inside you&apos;ll find a step-by-step
        onboarding checklist that walks you through everything you need to do - faster
        and easier than figuring it out on your own.
      </EmailParagraph>

      <EmailButton href={activationLink}>Activate My Portal</EmailButton>

      <EmailAlert type="warning">
        This link expires in <strong>{expiresInHours >= 24 && expiresInHours % 24 === 0 ? `${expiresInHours / 24} days` : `${expiresInHours} hours`}</strong>. A new one will be sent if it expires.
      </EmailAlert>

      <EmailDivider />

      <EmailParagraph style={{ fontWeight: 600, marginBottom: '12px', color: BRAND_COLORS.textPrimary }}>
        What you get inside:
      </EmailParagraph>

      <EmailListItem bullet="✓">Onboarding checklist - every setup step in order, check them off as you go</EmailListItem>
      <EmailListItem bullet="✓">Your personal Link Page and Agent Attraction Page</EmailListItem>
      <EmailListItem bullet="✓">Marketing templates, team call schedule, and elite courses</EmailListItem>
      <EmailListItem bullet="✓">Production tracking and analytics</EmailListItem>

      <EmailDivider />

      <EmailParagraph style={{ fontSize: '14px', color: BRAND_COLORS.textMuted }}>
        If the button doesn&apos;t work, copy and paste this link into your browser:
      </EmailParagraph>
      <EmailParagraph style={{
        fontSize: '12px',
        color: BRAND_COLORS.gold,
        wordBreak: 'break-all',
        backgroundColor: BRAND_COLORS.highlightStrong,
        padding: '10px 12px',
        borderRadius: '6px',
      }}>
        {activationLink}
      </EmailParagraph>

      <EmailDivider />

      <EmailParagraph style={{ fontSize: '14px', color: BRAND_COLORS.textMuted }}>
        Need help? Contact us at{' '}
        <EmailLink href="mailto:team@smartagentalliance.com">
          team@smartagentalliance.com
        </EmailLink>
      </EmailParagraph>

      <EmailSignature />
    </EmailLayout>
  );
}

export default WelcomeEmail;
