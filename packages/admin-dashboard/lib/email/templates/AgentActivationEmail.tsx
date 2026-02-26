/**
 * Agent Activation Email Template
 *
 * Sent to existing agents (already onboarded in person) to activate
 * their portal account. Includes video walkthrough thumbnail and
 * activation CTA.
 */

import * as React from 'react';
import { Img, Link, Text } from '@react-email/components';
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

const WALKTHROUGH_VIDEO_URL = 'https://customer-2twfsluc6inah5at.cloudflarestream.com/14ba82ce03943a64ef90e3c9771a0d56/watch';

interface AgentActivationEmailProps {
  firstName: string;
  activationLink: string;
  expiresInHours?: number;
}

export function AgentActivationEmail({
  firstName,
  activationLink,
  expiresInHours = 48,
}: AgentActivationEmailProps) {
  return (
    <EmailLayout preview="Your Smart Agent Alliance Portal is Ready!">
      <EmailGreeting>Hi {firstName},</EmailGreeting>

      <EmailHeading>Introducing Your New Agent Portal</EmailHeading>

      <EmailParagraph>
        We&apos;re excited to roll out something brand new - the Smart Agent Alliance
        Agent Portal. This is your new hub for everything SAA and Wolf Pack: your
        personal link page, Agent Attraction Page, Elite Courses, marketing templates,
        team call schedules, analytics, and more - all in one place.
      </EmailParagraph>

      <EmailParagraph>
        Before you activate your account, watch this quick walkthrough to see
        what&apos;s inside:
      </EmailParagraph>

      {/* Video Thumbnail */}
      <table cellPadding="0" cellSpacing="0" style={{ width: '100%', margin: '20px 0' }}>
        <tr>
          <td align="center">
            <Link href={WALKTHROUGH_VIDEO_URL} style={{ textDecoration: 'none' }}>
              <Img
                src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/agent-portal-walkthrough-thumbnail/desktop"
                alt="Watch the Agent Portal Walkthrough"
                width={520}
                style={{
                  display: 'block',
                  maxWidth: '100%',
                  borderRadius: '10px',
                  border: `2px solid ${BRAND_COLORS.gold}`,
                }}
              />
            </Link>
            <Text style={{
              color: BRAND_COLORS.gold,
              fontSize: '14px',
              fontWeight: 600,
              textAlign: 'center' as const,
              margin: '10px 0 0',
            }}>
              <Link
                href={WALKTHROUGH_VIDEO_URL}
                style={{ color: BRAND_COLORS.gold, textDecoration: 'underline' }}
              >
                Watch the Agent Portal Walkthrough
              </Link>
            </Text>
          </td>
        </tr>
      </table>

      <EmailDivider />

      <EmailButton href={activationLink}>Activate My Account</EmailButton>

      <EmailAlert type="warning">
        This activation link will expire in <strong>{expiresInHours} hours</strong> for security reasons.
      </EmailAlert>

      <EmailDivider />

      <EmailParagraph style={{ fontWeight: 600, marginBottom: '12px' }}>
        Here&apos;s how to get started:
      </EmailParagraph>

      <EmailNumberedStep number={1}>
        Watch the portal walkthrough video above
      </EmailNumberedStep>
      <EmailNumberedStep number={2}>
        Click &ldquo;Activate My Account&rdquo; to set up your login
      </EmailNumberedStep>
      <EmailNumberedStep number={3}>
        Create your password
      </EmailNumberedStep>
      <EmailNumberedStep number={4}>
        Explore your Agent Portal - customize your link page, set up your Agent Attraction Page, access Elite Courses, and more
      </EmailNumberedStep>

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

      <EmailSignature />
    </EmailLayout>
  );
}

export default AgentActivationEmail;
