/**
 * Welcome / Activate Account Email Template
 *
 * Sent to new users to activate their account.
 * User will create their own email and password during activation.
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
  EmailNumberedStep,
  EmailLink,
  EmailSignature,
  BRAND_COLORS,
} from './components/Layout';

interface WelcomeEmailProps {
  firstName: string;
  activationLink: string;
  expiresInHours?: number;
}

export function WelcomeEmail({
  firstName,
  activationLink,
  expiresInHours = 48,
}: WelcomeEmailProps) {
  return (
    <EmailLayout preview="Welcome to Smart Agent Alliance - Activate your account">
      <EmailGreeting>Welcome, {firstName}!</EmailGreeting>

      <EmailHeading>Activate Your Account</EmailHeading>

      <EmailParagraph>
        Congratulations on joining the Smart Agent Alliance! We&apos;re excited to have you
        as part of our community of elite real estate professionals.
      </EmailParagraph>

      <EmailParagraph>
        Click the button below to activate your account and set up your login credentials.
      </EmailParagraph>

      <EmailButton href={activationLink}>Activate My Account</EmailButton>

      <EmailAlert type="warning">
        This activation link will expire in <strong>{expiresInHours} hours</strong> for security reasons.
      </EmailAlert>

      <EmailDivider />

      <EmailParagraph style={{ fontWeight: 600, marginBottom: '12px' }}>
        What happens next:
      </EmailParagraph>

      <EmailNumberedStep number={1}>Click the activation button above</EmailNumberedStep>
      <EmailNumberedStep number={2}>Create your email and password</EmailNumberedStep>
      <EmailNumberedStep number={3}>Complete your profile setup</EmailNumberedStep>
      <EmailNumberedStep number={4}>Start exploring your Agent Portal!</EmailNumberedStep>

      <EmailDivider />

      <EmailParagraph style={{ fontSize: '14px', color: BRAND_COLORS.textMuted }}>
        If the button doesn&apos;t work, copy and paste this link into your browser:
      </EmailParagraph>
      <EmailParagraph style={{
        fontSize: '12px',
        color: BRAND_COLORS.gold,
        wordBreak: 'break-all',
        backgroundColor: BRAND_COLORS.highlightStrong,
        padding: '10px 12px',
        borderRadius: '6px',
      }}>
        {activationLink}
      </EmailParagraph>

      <EmailDivider />

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

export default WelcomeEmail;
