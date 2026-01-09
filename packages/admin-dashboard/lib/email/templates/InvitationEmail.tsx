/**
 * Invitation Email Template
 *
 * Sent to new users with activation link.
 * Token expires in 7 days (168 hours).
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
  EmailListItem,
  EmailLink,
  EmailSignature,
  BRAND_COLORS,
} from './components/Layout';
import { Text } from '@react-email/components';

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
      <EmailGreeting>Hi {full_name},</EmailGreeting>

      <EmailHeading>You&apos;re Invited to The Alliance!</EmailHeading>

      {inviterName ? (
        <EmailParagraph>
          <Text style={{ color: BRAND_COLORS.gold, fontWeight: 600 }}>{inviterName}</Text> has
          invited you to join the Smart Agent Alliance, a community of elite real estate
          professionals collaborating to achieve extraordinary results.
        </EmailParagraph>
      ) : (
        <EmailParagraph>
          You&apos;ve been invited to join The Alliance! We&apos;re excited to welcome you to our
          community of elite real estate professionals working together to achieve
          extraordinary results.
        </EmailParagraph>
      )}

      <EmailButton href={activationLink}>Accept Invitation</EmailButton>

      <EmailAlert type="warning">
        This invitation link will expire in <strong>{expiresIn}</strong>. Please activate
        your account before the link expires.
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
        Getting Started:
      </Text>

      <EmailListItem bullet="1.">Click the &quot;Accept Invitation&quot; button above</EmailListItem>
      <EmailListItem bullet="2.">Set up your secure password</EmailListItem>
      <EmailListItem bullet="3.">
        {role === 'admin'
          ? 'Access the admin dashboard and configure settings'
          : 'Access your Agent Portal and explore the resources'}
      </EmailListItem>

      <EmailHighlightBox title="Security Note">
        <EmailParagraph style={{ margin: 0, fontSize: '14px' }}>
          This invitation link is unique and secure. For your protection, it can only be
          used once and will expire automatically after {expiresIn}.
        </EmailParagraph>
      </EmailHighlightBox>

      <EmailDivider />

      <EmailParagraph style={{ fontSize: '14px', color: BRAND_COLORS.textMuted }}>
        Didn&apos;t request this invitation? If you didn&apos;t expect this email or believe you
        received it by mistake, you can safely ignore it. The invitation will expire
        automatically and no account will be created.
      </EmailParagraph>

      <EmailParagraph style={{ fontSize: '14px', color: BRAND_COLORS.textMuted }}>
        Need help? Contact us at{' '}
        <EmailLink href="mailto:team@smartagentalliance.com">
          team@smartagentalliance.com
        </EmailLink>
      </EmailParagraph>

      <EmailSignature
        name="The SAA Team"
        title="Smart Agent Alliance"
        email="team@smartagentalliance.com"
      />
    </EmailLayout>
  );
}

export default InvitationEmail;
