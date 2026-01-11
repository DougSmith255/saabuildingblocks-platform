/**
 * Account Locked Email Template
 *
 * Notifies users when their account has been locked due to security reasons.
 */

import * as React from 'react';
import {
  EmailLayout,
  EmailHeading,
  EmailGreeting,
  EmailParagraph,
  EmailButton,
  EmailHighlightBox,
  EmailAlert,
  EmailDivider,
  EmailNumberedStep,
  EmailLink,
  EmailSignature,
  BRAND_COLORS,
} from './components/Layout';
import { Text } from '@react-email/components';

interface AccountLockedEmailProps {
  username: string;
  unlockTime: Date;
  reason?: string;
  supportUrl?: string;
}

export function AccountLockedEmail({
  username,
  unlockTime,
  reason = 'multiple failed login attempts',
  supportUrl,
}: AccountLockedEmailProps) {
  const defaultSupportUrl = supportUrl || 'mailto:team@smartagentalliance.com';

  // Format unlock time
  const unlockTimeFormatted = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(unlockTime);

  // Calculate time remaining
  const now = new Date();
  const timeRemaining = Math.max(0, unlockTime.getTime() - now.getTime());
  const minutesRemaining = Math.ceil(timeRemaining / (1000 * 60));
  const hoursRemaining = Math.floor(minutesRemaining / 60);
  const remainingMinutesDisplay = minutesRemaining % 60;

  let timeRemainingText = '';
  if (hoursRemaining > 0) {
    timeRemainingText = `${hoursRemaining} hour${hoursRemaining > 1 ? 's' : ''} and ${remainingMinutesDisplay} minute${remainingMinutesDisplay !== 1 ? 's' : ''}`;
  } else {
    timeRemainingText = `${minutesRemaining} minute${minutesRemaining !== 1 ? 's' : ''}`;
  }

  return (
    <EmailLayout preview="Security Alert - Your account has been temporarily locked">
      <EmailGreeting>Hi {username},</EmailGreeting>

      <EmailHeading>Account Temporarily Locked</EmailHeading>

      <EmailAlert type="error">
        Your account has been temporarily locked due to {reason}.
      </EmailAlert>

      <EmailParagraph>
        For security reasons, your Smart Agent Alliance account has been temporarily
        locked to protect your information.
      </EmailParagraph>

      <EmailHighlightBox title="Lock Details">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tr>
            <td style={{ padding: '8px 0', color: BRAND_COLORS.textSecondary, width: '140px' }}>
              Account Status:
            </td>
            <td style={{ padding: '8px 0', color: '#ef4444', fontWeight: 600 }}>
              Temporarily Locked
            </td>
          </tr>
          <tr>
            <td style={{ padding: '8px 0', color: BRAND_COLORS.textSecondary }}>
              Reason:
            </td>
            <td style={{ padding: '8px 0', color: BRAND_COLORS.textPrimary }}>
              {reason}
            </td>
          </tr>
          <tr>
            <td style={{ padding: '8px 0', color: BRAND_COLORS.textSecondary }}>
              Unlock Time:
            </td>
            <td style={{ padding: '8px 0', color: BRAND_COLORS.textPrimary }}>
              {unlockTimeFormatted}
            </td>
          </tr>
          <tr>
            <td style={{ padding: '8px 0', color: BRAND_COLORS.textSecondary }}>
              Time Remaining:
            </td>
            <td style={{ padding: '8px 0', color: BRAND_COLORS.gold, fontWeight: 500 }}>
              ~{timeRemainingText}
            </td>
          </tr>
        </table>
      </EmailHighlightBox>

      <EmailAlert type="info">
        Your account will automatically unlock at the time shown above. No action is
        required from you.
      </EmailAlert>

      <EmailDivider />

      <Text
        style={{
          color: BRAND_COLORS.textPrimary,
          fontSize: '16px',
          fontWeight: 600,
          margin: '0 0 16px',
        }}
      >
        What Should You Do?
      </Text>

      <EmailNumberedStep number={1}>Wait for the automatic unlock time</EmailNumberedStep>
      <EmailNumberedStep number={2}>Review your recent account activity</EmailNumberedStep>
      <EmailNumberedStep number={3}>Change your password if you suspect unauthorized access</EmailNumberedStep>
      <EmailNumberedStep number={4}>Enable two-factor authentication for added security</EmailNumberedStep>

      <EmailAlert type="warning">
        Didn&apos;t trigger this? If you didn&apos;t attempt to access your account, someone else
        may be trying. Please change your password immediately after the unlock time and
        contact our support team.
      </EmailAlert>

      <EmailButton href={defaultSupportUrl}>Contact Support</EmailButton>

      <EmailDivider />

      <EmailParagraph style={{ fontSize: '14px', color: BRAND_COLORS.textMuted }}>
        If you need immediate assistance, please contact us at{' '}
        <EmailLink href="mailto:team@smartagentalliance.com">
          team@smartagentalliance.com
        </EmailLink>
      </EmailParagraph>

      <EmailSignature />
    </EmailLayout>
  );
}

export default AccountLockedEmail;
