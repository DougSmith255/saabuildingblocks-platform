/**
 * Invitation Email Template
 *
 * Sends an invitation email to new users with activation link.
 * Token expires in 7 days (168 hours).
 *
 * Features:
 * - Personalized greeting with invitee name
 * - Optional inviter name for personal touch
 * - Professional Smart Agent Alliance branding
 * - Clear CTA with secure activation link
 * - Expiration notice and security information
 */

import * as React from 'react';
import {
  EmailLayout,
  EmailHeading,
  EmailParagraph,
  EmailButton,
  EmailAlert,
} from './components/Layout';

interface InvitationEmailProps {
  full_name: string;
  activationLink: string;
  expiresIn: string;
  inviterName?: string;
  role?: string;
}

export function InvitationEmail({
  full_name,
  activationLink,
  expiresIn,
  inviterName,
  role = 'user',
}: InvitationEmailProps) {
  return (
    <EmailLayout preview={`${full_name}, you're invited to join The Alliance!`}>
      <EmailHeading>You're Invited to The Alliance!</EmailHeading>

      <EmailParagraph>Hello {full_name},</EmailParagraph>

      {inviterName && (
        <EmailParagraph>
          <strong>{inviterName}</strong> has invited you to join the Smart Agent Alliance,
          a community of elite real estate professionals collaborating to achieve extraordinary results.
        </EmailParagraph>
      )}

      {!inviterName && (
        <EmailParagraph>
          You've been invited to join The Alliance! We're excited to welcome you
          to our community of elite real estate professionals working together to achieve extraordinary results.
        </EmailParagraph>
      )}

      <EmailParagraph>
        To complete your registration and join the team, simply click the
        button below:
      </EmailParagraph>

      <div style={{ textAlign: 'center', marginTop: '24px', marginBottom: '24px' }}>
        <EmailButton href={activationLink}>Accept Invitation</EmailButton>
      </div>

      <EmailAlert type="warning">
        <strong>Time-Sensitive:</strong> This invitation link will expire in{' '}
        <strong>{expiresIn}</strong>. Please activate your account before the link expires.
      </EmailAlert>

      <EmailParagraph style={{ marginTop: '32px' }}>
        <strong>Getting Started:</strong>
      </EmailParagraph>

      <ol style={{ color: '#525252', fontSize: '14px', lineHeight: '24px', paddingLeft: '20px' }}>
        <li style={{ marginBottom: '8px' }}>
          Click the "Accept Invitation" button above
        </li>
        <li style={{ marginBottom: '8px' }}>
          Set up your secure access code
        </li>
        <li style={{ marginBottom: '8px' }}>
          {role === 'admin' ? 'Access the admin dashboard and configure settings' :
           'Access your Agent Portal and explore the resources'}
        </li>
      </ol>

      <EmailAlert type="info">
        <strong>Security Note:</strong>
        <br />
        This invitation link is unique and secure. For your protection, it can only be
        used once and will expire automatically after {expiresIn}.
      </EmailAlert>

      <EmailAlert type="success" style={{ marginTop: '16px' }}>
        <strong>Need Help?</strong>
        <br />
        If you have any questions or encounter issues during activation, our support
        team is ready to assist. Contact us at{' '}
        <a
          href="mailto:support@smartagentalliance.com"
          style={{ color: '#10b981', textDecoration: 'none', fontWeight: 'bold' }}
        >
          support@smartagentalliance.com
        </a>
      </EmailAlert>

      <EmailParagraph style={{ marginTop: '32px', fontSize: '14px', color: '#6b7280' }}>
        <strong>Didn't request this invitation?</strong> If you didn't expect this email
        or believe you received it by mistake, you can safely ignore it. The invitation
        will expire automatically and no account will be created.
      </EmailParagraph>

      <EmailParagraph style={{ marginTop: '32px' }}>
        We look forward to having you as part of the Smart Agent Alliance community!
      </EmailParagraph>

      <EmailParagraph>
        Best regards,
        <br />
        <strong>The SAA Team</strong>
      </EmailParagraph>
    </EmailLayout>
  );
}

export default InvitationEmail;
