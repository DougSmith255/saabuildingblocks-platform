/**
 * Announcement Email Template
 *
 * Used for team-wide announcements and updates.
 */

import * as React from 'react';
import {
  EmailLayout,
  EmailHeading,
  EmailGreeting,
  EmailParagraph,
  EmailButton,
  EmailDivider,
  EmailHighlightBox,
  EmailListItem,
  EmailSignature,
  BRAND_COLORS,
} from './components/Layout';

interface AnnouncementEmailProps {
  recipientName?: string;
}

export function AnnouncementEmail({
  recipientName,
}: AnnouncementEmailProps) {
  const greeting = recipientName ? `Hey ${recipientName},` : 'Hey Team,';

  return (
    <EmailLayout preview="Big things are coming to Smart Agent Alliance - new website is live!">
      <EmailGreeting>{greeting}</EmailGreeting>

      <EmailHeading>Big Things Are Coming</EmailHeading>

      <EmailParagraph>
        We wanted to reach out personally to give you a quick update on what&apos;s happening
        with Smart Agent Alliance. If you haven&apos;t seen it yet, our{' '}
        <strong style={{ color: BRAND_COLORS.gold }}>brand new website is live</strong> at{' '}
        <a href="https://smartagentalliance.com" style={{ color: BRAND_COLORS.gold, textDecoration: 'underline' }}>
          smartagentalliance.com
        </a>.
        Take a look around - it gives you a pretty clear picture of what&apos;s coming.
      </EmailParagraph>

      <EmailButton href="https://smartagentalliance.com">Check Out The New Site</EmailButton>

      <EmailDivider />

      <EmailParagraph>
        Just a heads up - the Members Only section and team assets won&apos;t be available
        during this transition. Everything will be accessible again through the new portal
        once it&apos;s ready.
      </EmailParagraph>

      <EmailHighlightBox title="What's Coming">
        <EmailParagraph style={{ margin: '0 0 8px', fontSize: '15px' }}>
          We&apos;re rolling out a completely rebuilt{' '}
          <strong style={{ color: BRAND_COLORS.gold }}>Agent Portal</strong> with new systems
          and tools designed to help you grow your business. We&apos;re finishing up the final
          details right now to make sure everything works properly before you get access.
        </EmailParagraph>
      </EmailHighlightBox>

      <EmailParagraph style={{ fontWeight: 600, color: BRAND_COLORS.textPrimary, marginBottom: '10px' }}>
        Here&apos;s what you need to know:
      </EmailParagraph>

      <EmailListItem>The new systems should be ready within the next <strong style={{ color: '#ffffff' }}>few days</strong> (up to 3 days)</EmailListItem>
      <EmailListItem>You&apos;ll receive an <strong style={{ color: BRAND_COLORS.gold }}>Agent Portal account activation email</strong> once everything is set</EmailListItem>
      <EmailListItem>All your team resources and assets will be accessible again through the new portal</EmailListItem>
      <EmailListItem>What&apos;s coming is <strong style={{ color: '#ffffff' }}>well worth the wait</strong></EmailListItem>

      <EmailDivider />

      <EmailParagraph>
        Keep an eye on your inbox over the next couple days for your activation email.
        We&apos;re excited to get this in your hands - we think you&apos;re going to love it.
      </EmailParagraph>

      <EmailParagraph>
        Thanks for being part of the team. Talk soon.
      </EmailParagraph>

      <EmailSignature />
    </EmailLayout>
  );
}

export default AnnouncementEmail;
