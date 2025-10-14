/**
 * Password Reset Email Template
 *
 * Sends a password reset link with token that expires in 15 minutes.
 */

import * as React from 'react';
import {
  EmailLayout,
  EmailHeading,
  EmailParagraph,
  EmailButton,
  EmailAlert,
} from './components/Layout';

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
    <EmailLayout preview="Reset your password - Smart Agent Alliance">
      <EmailHeading>Password Reset Request</EmailHeading>

      <EmailParagraph>Hello {username},</EmailParagraph>

      <EmailParagraph>
        We received a request to reset your password for your Smart Agent Alliance
        account. Click the button below to create a new password:
      </EmailParagraph>

      <div style={{ textAlign: 'center' }}>
        <EmailButton href={resetLink}>Reset Password</EmailButton>
      </div>

      <EmailAlert type="warning">
        <strong>Important:</strong> This link will expire in {expiresInMinutes} minutes
        for security reasons.
      </EmailAlert>

      <EmailParagraph>
        If the button doesn't work, copy and paste this link into your browser:
      </EmailParagraph>

      <EmailParagraph style={{ wordBreak: 'break-all', color: '#556cd6' }}>
        {resetLink}
      </EmailParagraph>

      <EmailAlert type="info">
        <strong>Didn't request this?</strong> If you didn't request a password reset,
        you can safely ignore this email. Your password will remain unchanged.
      </EmailAlert>

      <EmailParagraph style={{ marginTop: '32px' }}>
        <strong>Security Tips:</strong>
      </EmailParagraph>

      <ul style={{ color: '#525252', fontSize: '14px', lineHeight: '20px' }}>
        <li>Never share your password with anyone</li>
        <li>Use a unique password for each account</li>
        <li>Enable two-factor authentication when available</li>
        <li>Be cautious of phishing attempts</li>
      </ul>

      <EmailParagraph>
        If you're having trouble or need assistance, please contact our support team.
      </EmailParagraph>

      <EmailParagraph>
        Best regards,
        <br />
        Smart Agent Alliance Team
      </EmailParagraph>
    </EmailLayout>
  );
}

export default PasswordResetEmail;
