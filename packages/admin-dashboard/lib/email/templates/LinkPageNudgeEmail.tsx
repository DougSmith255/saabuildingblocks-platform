/**
 * Link Page Nudge Email Template
 *
 * Sent 2 days after onboarding completion if the agent
 * hasn't activated their link page yet.
 */

import * as React from 'react';
import {
  EmailLayout,
  EmailHeading,
  EmailGreeting,
  EmailParagraph,
  EmailButton,
  EmailDivider,
  EmailNumberedStep,
  EmailLink,
  EmailSignature,
  BRAND_COLORS,
} from './components/Layout';

interface LinkPageNudgeEmailProps {
  firstName: string;
  portalLink: string;
}

export function LinkPageNudgeEmail({
  firstName,
  portalLink,
}: LinkPageNudgeEmailProps) {
  return (
    <EmailLayout preview="Your Link Page + Agent Attraction Page are ready">
      <EmailGreeting>Hey {firstName},</EmailGreeting>

      <EmailHeading>Your Pages Are Ready to Go Live</EmailHeading>

      <EmailParagraph>
        You have two pages waiting for you. Your <strong>Link Page</strong> is
        your personal hub for socials, listings, booking, and contact info.
        Your <strong>Agent Attraction Page</strong> is a full landing page
        branded to you that captures leads and helps you grow your downline
        through eXp revenue share. When you activate your Link Page,
        your Attraction Page gets built and goes live automatically.
      </EmailParagraph>

      <EmailParagraph>
        When someone books a call from your Attraction Page, that call is
        with Doug and Karrie and you get notified with the date, time, and
        a link to join. Leads from the join form are tagged to you automatically.
      </EmailParagraph>

      <EmailButton href={portalLink}>Set Up My Pages</EmailButton>

      <EmailParagraph style={{ fontSize: '13px', color: BRAND_COLORS.textMuted, marginTop: '4px' }}>
        Takes about 2 minutes. Go to Link Page, add your photo and links,
        hit Activate.
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

export default LinkPageNudgeEmail;
