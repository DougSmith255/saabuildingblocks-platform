/**
 * Welcome Email Template
 *
 * Sends a welcome email to new users with temporary password and setup instructions.
 */

import * as React from 'react';
import {
  EmailLayout,
  EmailHeading,
  EmailParagraph,
  EmailButton,
  EmailCode,
  EmailAlert,
} from './components/Layout';

interface WelcomeEmailProps {
  username: string;
  email: string;
  temporaryPassword: string;
  loginUrl: string;
}

export function WelcomeEmail({
  username,
  email,
  temporaryPassword,
  loginUrl,
}: WelcomeEmailProps) {
  return (
    <EmailLayout preview="Welcome to Smart Agent Alliance">
      <EmailHeading>Welcome to Smart Agent Alliance! 🎉</EmailHeading>

      <EmailParagraph>Hello {username},</EmailParagraph>

      <EmailParagraph>
        Welcome aboard! Your account has been successfully created. We're excited to
        have you join the Smart Agent Alliance community.
      </EmailParagraph>

      <EmailParagraph style={{ marginTop: '24px' }}>
        <strong>Your Login Credentials:</strong>
      </EmailParagraph>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          margin: '16px 0',
        }}
      >
        <tr>
          <td
            style={{
              padding: '12px',
              backgroundColor: '#f4f4f5',
              borderBottom: '1px solid #e4e4e7',
              fontWeight: 'bold',
            }}
          >
            Email:
          </td>
          <td
            style={{
              padding: '12px',
              backgroundColor: '#f4f4f5',
              borderBottom: '1px solid #e4e4e7',
            }}
          >
            {email}
          </td>
        </tr>
        <tr>
          <td
            style={{
              padding: '12px',
              backgroundColor: '#f4f4f5',
              borderBottom: '1px solid #e4e4e7',
              fontWeight: 'bold',
            }}
          >
            Username:
          </td>
          <td
            style={{
              padding: '12px',
              backgroundColor: '#f4f4f5',
              borderBottom: '1px solid #e4e4e7',
            }}
          >
            {username}
          </td>
        </tr>
        <tr>
          <td
            style={{
              padding: '12px',
              backgroundColor: '#f4f4f5',
              fontWeight: 'bold',
            }}
          >
            Temporary Password:
          </td>
          <td
            style={{
              padding: '12px',
              backgroundColor: '#f4f4f5',
            }}
          >
            <code style={{ fontFamily: 'monospace' }}>{temporaryPassword}</code>
          </td>
        </tr>
      </table>

      <EmailAlert type="warning">
        <strong>Important:</strong> You must change your password on first login for
        security reasons. This temporary password will expire after your first
        successful login.
      </EmailAlert>

      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <EmailButton href={loginUrl}>Login to Your Account</EmailButton>
      </div>

      <EmailParagraph style={{ marginTop: '32px' }}>
        <strong>Getting Started:</strong>
      </EmailParagraph>

      <ol style={{ color: '#525252', fontSize: '14px', lineHeight: '20px' }}>
        <li>Click the login button above or visit {loginUrl}</li>
        <li>Enter your username and temporary password</li>
        <li>You'll be prompted to create a new secure password</li>
        <li>Complete your profile setup</li>
        <li>Start exploring the platform!</li>
      </ol>

      <EmailAlert type="info">
        <strong>Security Best Practices:</strong>
        <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
          <li>Choose a strong, unique password (at least 12 characters)</li>
          <li>Enable two-factor authentication in your account settings</li>
          <li>Never share your password with anyone</li>
          <li>Use a password manager to securely store your credentials</li>
        </ul>
      </EmailAlert>

      <EmailParagraph>
        If you encounter any issues or have questions, our support team is here to
        help. Feel free to reach out at any time.
      </EmailParagraph>

      <EmailParagraph>
        We're thrilled to have you with us!
      </EmailParagraph>

      <EmailParagraph>
        Best regards,
        <br />
        Smart Agent Alliance Team
      </EmailParagraph>
    </EmailLayout>
  );
}

export default WelcomeEmail;
