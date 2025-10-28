/**
 * Username Reminder Email Template
 *
 * Sends a username reminder with security tips.
 */

import * as React from 'react';
import {
  EmailLayout,
  EmailHeading,
  EmailParagraph,
  EmailCode,
  EmailAlert,
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
    <EmailLayout preview="Your username - Smart Agent Alliance">
      <EmailHeading>Username Reminder</EmailHeading>

      <EmailParagraph>Hello,</EmailParagraph>

      <EmailParagraph>
        We received a request to remind you of your username for the Smart Agent
        Alliance account associated with this email address ({email}).
      </EmailParagraph>

      <EmailParagraph style={{ textAlign: 'center', marginTop: '24px' }}>
        Your username is:
      </EmailParagraph>

      <EmailCode>{username}</EmailCode>

      <EmailAlert type="info">
        <strong>Keep this information secure.</strong> Save your username in a secure
        location for future reference.
      </EmailAlert>

      <EmailParagraph style={{ marginTop: '32px' }}>
        <strong>Security Tips:</strong>
      </EmailParagraph>

      <ul style={{ color: '#525252', fontSize: '14px', lineHeight: '20px' }}>
        <li>Never share your username and password together in the same message</li>
        <li>Be cautious of phishing emails asking for login credentials</li>
        <li>Use a password manager to securely store login information</li>
        <li>Enable two-factor authentication for added security</li>
        <li>Verify the sender's email address before responding to account-related emails</li>
      </ul>

      <EmailAlert type="warning">
        <strong>Didn't request this?</strong> If you didn't request a username reminder,
        someone may be trying to access your account. Please consider changing your
        password immediately and enable two-factor authentication.
      </EmailAlert>

      <EmailParagraph>
        If you're having trouble logging in or need assistance, please contact our
        support team.
      </EmailParagraph>

      <EmailParagraph>
        Best regards,
        <br />
        Smart Agent Alliance Team
      </EmailParagraph>
    </EmailLayout>
  );
}

export default UsernameReminderEmail;
