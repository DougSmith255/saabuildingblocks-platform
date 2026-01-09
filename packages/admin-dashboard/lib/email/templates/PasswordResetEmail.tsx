/**
 * Password Reset Email Template
 *
 * Sent when a user requests to reset their password.
 * Contains a secure time-limited reset link.
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
  EmailLink,
  BRAND_COLORS,
} from './components/Layout';
import { Text, Section } from '@react-email/components';

interface PasswordResetEmailProps {
  username: string;
  resetLink: string;
  expiresInMinutes?: number;
}

export function PasswordResetEmail({
  username,
  resetLink,
  expiresInMinutes = 15,
}: PasswordResetEmailProps) {
  return (
    <EmailLayout preview={`Reset your password - Link expires in ${expiresInMinutes} minutes`}>
      <EmailGreeting>Hi {username},</EmailGreeting>

      <EmailHeading>Reset Your Password</EmailHeading>

      <EmailParagraph>
        We received a request to reset the password for your Smart Agent Alliance account.
        Click the button below to create a new password.
      </EmailParagraph>

      <EmailButton href={resetLink}>Reset My Password</EmailButton>

      <EmailAlert type="warning">
        This link will expire in <strong>{expiresInMinutes} minutes</strong> for security reasons.
      </EmailAlert>

      <EmailDivider />

      <Section>
        <Text
          style={{
            color: BRAND_COLORS.textSecondary,
            fontSize: '14px',
            lineHeight: '22px',
            margin: '0 0 12px',
          }}
        >
          If the button doesn&apos;t work, copy and paste this link into your browser:
        </Text>
        <Text
          style={{
            color: BRAND_COLORS.gold,
            fontSize: '12px',
            wordBreak: 'break-all',
            backgroundColor: BRAND_COLORS.highlightStrong,
            padding: '12px',
            borderRadius: '6px',
            margin: '0',
          }}
        >
          {resetLink}
        </Text>
      </Section>

      <EmailDivider />

      <EmailParagraph style={{ fontSize: '14px', color: BRAND_COLORS.textMuted }}>
        If you didn&apos;t request a password reset, you can safely ignore this email.
        Your password will remain unchanged.
      </EmailParagraph>

      <EmailParagraph style={{ fontSize: '14px', color: BRAND_COLORS.textMuted }}>
        Need help? Contact us at{' '}
        <EmailLink href="mailto:team@smartagentalliance.com">
          team@smartagentalliance.com
        </EmailLink>
      </EmailParagraph>
    </EmailLayout>
  );
}

export default PasswordResetEmail;
