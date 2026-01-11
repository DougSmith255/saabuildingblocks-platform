/**
 * Username Reminder Email Template
 *
 * Sends a username reminder with security tips.
 */

import * as React from 'react';
import {
  EmailLayout,
  EmailHeading,
  EmailGreeting,
  EmailParagraph,
  EmailCode,
  EmailHighlightBox,
  EmailAlert,
  EmailDivider,
  EmailLink,
  EmailSignature,
  BRAND_COLORS,
} from './components/Layout';

interface UsernameReminderEmailProps {
  username: string;
  email: string;
}

export function UsernameReminderEmail({
  username,
  email,
}: UsernameReminderEmailProps) {
  return (
    <EmailLayout preview="Your username reminder - Smart Agent Alliance">
      <EmailGreeting>Hi there,</EmailGreeting>

      <EmailHeading>Username Reminder</EmailHeading>

      <EmailParagraph>
        We received a request to remind you of your username for the Smart Agent
        Alliance account associated with <strong>{email}</strong>.
      </EmailParagraph>

      <EmailHighlightBox title="Your Username">
        <EmailCode>{username}</EmailCode>
      </EmailHighlightBox>

      <EmailAlert type="info">
        Keep this information secure. Save your username in a secure location for
        future reference.
      </EmailAlert>

      <EmailDivider />

      <EmailAlert type="warning">
        Didn&apos;t request this? If you didn&apos;t request a username reminder, someone may be
        trying to access your account. Please consider changing your password and
        enabling two-factor authentication.
      </EmailAlert>

      <EmailDivider />

      <EmailParagraph style={{ fontSize: '14px', color: BRAND_COLORS.textMuted }}>
        If you&apos;re having trouble logging in or need assistance, please contact us at{' '}
        <EmailLink href="mailto:team@smartagentalliance.com">
          team@smartagentalliance.com
        </EmailLink>
      </EmailParagraph>

      <EmailSignature />
    </EmailLayout>
  );
}

export default UsernameReminderEmail;
