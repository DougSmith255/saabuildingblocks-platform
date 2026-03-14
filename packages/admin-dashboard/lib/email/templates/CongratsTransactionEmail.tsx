/**
 * Congratulations Transaction Email Template
 *
 * Sent to agents when they close a real estate transaction.
 * Used by automations to celebrate wins and point agents to portal tools.
 */

import * as React from 'react';
import {
  EmailLayout,
  EmailGreeting,
  EmailHeading,
  EmailParagraph,
  EmailButton,
  EmailDivider,
  EmailSignature,
  BRAND_COLORS,
} from './components/Layout';

interface CongratsTransactionEmailProps {
  firstName: string;
  phoneNumber?: string;
}

export function CongratsTransactionEmail({
  firstName,
  phoneNumber = '415-320-5606',
}: CongratsTransactionEmailProps) {
  return (
    <EmailLayout preview={`Congratulations on your transaction, ${firstName}!`}>
      <EmailGreeting>Hey {firstName},</EmailGreeting>

      <EmailHeading>Congratulations on Your Transaction!</EmailHeading>

      <EmailParagraph>
        Just wanted to send a quick note to congratulate you on your recent real estate
        transaction. Closing deals is what it is all about, and we are glad you are part
        of the team.
      </EmailParagraph>

      <EmailParagraph>
        If there is a tool or system that would help you in your business, we would love
        to hear about it. You can submit suggestions anytime through the{' '}
        <strong style={{ color: '#ffffff' }}>Get Support</strong> section of your Agent
        Portal, or text me directly at{' '}
        <strong style={{ color: '#ffffff' }}>{phoneNumber}</strong> and I will give you a call.
      </EmailParagraph>

      <EmailButton href="https://smartagentalliance.com/agent-portal">
        Open Your Agent Portal
      </EmailButton>

      <EmailDivider />

      <EmailParagraph>
        Keep up the great work. Here is to many more closings ahead.
      </EmailParagraph>

      <EmailSignature />
    </EmailLayout>
  );
}

export default CongratsTransactionEmail;
