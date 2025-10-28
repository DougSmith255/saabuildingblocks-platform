/**
 * Account Locked Email Template
 *
 * Notifies users when their account has been locked due to security reasons.
 */

import * as React from 'react';
import {
  EmailLayout,
  EmailHeading,
  EmailParagraph,
  EmailButton,
  EmailAlert,
} from './components/Layout';

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
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://saabuildingblocks.com';
  const defaultSupportUrl = supportUrl || `${baseUrl}/contact`;

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
    timeRemainingText = `approximately ${hoursRemaining} hour${hoursRemaining > 1 ? 's' : ''} and ${remainingMinutesDisplay} minute${remainingMinutesDisplay !== 1 ? 's' : ''}`;
  } else {
    timeRemainingText = `approximately ${minutesRemaining} minute${minutesRemaining !== 1 ? 's' : ''}`;
  }

  return (
    <EmailLayout preview="Account Security Alert - Account Locked">
      <EmailHeading>⚠️ Account Locked for Security</EmailHeading>

      <EmailParagraph>Hello {username},</EmailParagraph>

      <EmailAlert type="error">
        <strong>Your account has been temporarily locked</strong> due to {reason}.
      </EmailAlert>

      <EmailParagraph>
        For security reasons, your Smart Agent Alliance account has been temporarily
        locked to protect your information.
      </EmailParagraph>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          margin: '24px 0',
          backgroundColor: '#f4f4f5',
          borderRadius: '6px',
        }}
      >
        <tr>
          <td
            style={{
              padding: '16px',
              borderBottom: '1px solid #e4e4e7',
              fontWeight: 'bold',
            }}
          >
            Account Status:
          </td>
          <td
            style={{
              padding: '16px',
              borderBottom: '1px solid #e4e4e7',
              color: '#dc2626',
            }}
          >
            Locked
          </td>
        </tr>
        <tr>
          <td
            style={{
              padding: '16px',
              borderBottom: '1px solid #e4e4e7',
              fontWeight: 'bold',
            }}
          >
            Reason:
          </td>
          <td style={{ padding: '16px', borderBottom: '1px solid #e4e4e7' }}>
            {reason}
          </td>
        </tr>
        <tr>
          <td
            style={{
              padding: '16px',
              borderBottom: '1px solid #e4e4e7',
              fontWeight: 'bold',
            }}
          >
            Unlock Time:
          </td>
          <td style={{ padding: '16px', borderBottom: '1px solid #e4e4e7' }}>
            {unlockTimeFormatted}
          </td>
        </tr>
        <tr>
          <td style={{ padding: '16px', fontWeight: 'bold' }}>Time Remaining:</td>
          <td style={{ padding: '16px' }}>{timeRemainingText}</td>
        </tr>
      </table>

      <EmailAlert type="info">
        <strong>Your account will automatically unlock</strong> at the time shown above.
        No action is required from you.
      </EmailAlert>

      <EmailParagraph style={{ marginTop: '32px' }}>
        <strong>What Happened?</strong>
      </EmailParagraph>

      <EmailParagraph>
        This security measure was triggered to protect your account. Common reasons
        include:
      </EmailParagraph>

      <ul style={{ color: '#525252', fontSize: '14px', lineHeight: '20px' }}>
        <li>Multiple failed login attempts</li>
        <li>Suspicious activity detected</li>
        <li>Attempted access from unusual location</li>
        <li>Potential security breach detected</li>
      </ul>

      <EmailParagraph style={{ marginTop: '24px' }}>
        <strong>What Should You Do?</strong>
      </EmailParagraph>

      <ol style={{ color: '#525252', fontSize: '14px', lineHeight: '20px' }}>
        <li>Wait for the automatic unlock time</li>
        <li>Review your recent account activity</li>
        <li>Change your password if you suspect unauthorized access</li>
        <li>Enable two-factor authentication for added security</li>
        <li>Contact support if you believe this was an error</li>
      </ol>

      <EmailAlert type="warning">
        <strong>Didn't Trigger This?</strong> If you didn't attempt to access your
        account, someone else may be trying to. Please change your password immediately
        after the unlock time and contact our support team.
      </EmailAlert>

      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <EmailButton href={defaultSupportUrl}>Contact Support</EmailButton>
      </div>

      <EmailParagraph>
        If you need immediate assistance or believe this lock was in error, please
        contact our support team right away.
      </EmailParagraph>

      <EmailParagraph>
        Best regards,
        <br />
        Smart Agent Alliance Security Team
      </EmailParagraph>
    </EmailLayout>
  );
}

export default AccountLockedEmail;
