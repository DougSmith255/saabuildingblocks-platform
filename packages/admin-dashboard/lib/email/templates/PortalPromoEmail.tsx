/**
 * Agent Portal Promotional Email Template
 *
 * Sent to GHL contacts who are NOT active team members
 * to promote the Agent Portal as a reason to join the team.
 * Premium visual design with feature cards and gold accents.
 */

import * as React from 'react';
import { Img, Link, Text } from '@react-email/components';
import {
  EmailLayout,
  EmailHeading,
  EmailGreeting,
  EmailParagraph,
  EmailButton,
  EmailDivider,
  EmailLink,
  EmailSignature,
  BRAND_COLORS,
} from './components/Layout';

const VIDEO_PAGE_URL = 'https://smartagentalliance.com/exp-realty-sponsor/#agent-portal-walkthrough';
const BOOK_A_CALL_URL = 'https://smartagentalliance.com/book-a-call/';

interface PortalPromoEmailProps {
  firstName: string;
}

/** Reusable feature card with gold left border and icon */
function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <table cellPadding="0" cellSpacing="0" width="100%" style={{ marginBottom: '12px' }}>
      <tr>
        <td style={{
          backgroundColor: BRAND_COLORS.highlightStrong,
          borderLeft: `3px solid ${BRAND_COLORS.gold}`,
          borderRadius: '0 8px 8px 0',
          padding: '16px 18px',
        }}>
          <table cellPadding="0" cellSpacing="0" width="100%">
            <tr>
              <td width="36" valign="top" style={{ paddingRight: '12px' }}>
                <Text style={{
                  fontSize: '22px',
                  lineHeight: '1',
                  margin: '0',
                }}>
                  {icon}
                </Text>
              </td>
              <td valign="top">
                <Text style={{
                  color: BRAND_COLORS.gold,
                  fontSize: '15px',
                  fontWeight: 700,
                  margin: '0 0 4px 0',
                  fontFamily: "'Inter', Arial, sans-serif",
                }}>
                  {title}
                </Text>
                <Text style={{
                  color: BRAND_COLORS.textSecondary,
                  fontSize: '14px',
                  lineHeight: '1.5',
                  margin: '0',
                  fontFamily: "'Inter', Arial, sans-serif",
                }}>
                  {description}
                </Text>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  );
}

export function PortalPromoEmail({
  firstName,
}: PortalPromoEmailProps) {
  return (
    <EmailLayout preview="We just built something for our agents - take a look inside">
      <EmailGreeting>Hi {firstName},</EmailGreeting>

      <EmailHeading>We Just Built Something for Our Agents</EmailHeading>

      <EmailParagraph>
        We just launched the Smart Agent Alliance Agent Portal - a private hub built
        exclusively for agents on our team.
      </EmailParagraph>

      <EmailParagraph style={{ color: BRAND_COLORS.textSecondary }}>
        Nothing like this exists at other teams. Here&apos;s what&apos;s inside:
      </EmailParagraph>

      {/* Spacer */}
      <table cellPadding="0" cellSpacing="0" width="100%"><tr><td style={{ height: '8px' }} /></tr></table>

      {/* Feature Cards */}
      <FeatureCard
        icon="🎯"
        title="Your Own Agent Attraction Page"
        description="A personalized page with your name, photo, and story that helps you attract agents and build your own revenue share organization. We build it for you."
      />
      <FeatureCard
        icon="🎓"
        title="Elite Training Courses"
        description="Step-by-step video courses on building your business at eXp - from your first 90 days to maximizing revenue share."
      />
      <FeatureCard
        icon="🔗"
        title="Personal Link Page"
        description="A branded page with all your important links in one place. Share it on social media, business cards, anywhere."
      />
      <FeatureCard
        icon="🎨"
        title="Marketing Templates &amp; Freebies"
        description="Ready-to-use social media templates, checklists, and resources you can put your name on."
      />
      <FeatureCard
        icon="🤝"
        title="Team Calls &amp; Community"
        description="Weekly team calls, direct access to leadership, and a community of agents who actually help each other."
      />

      {/* Spacer */}
      <table cellPadding="0" cellSpacing="0" width="100%"><tr><td style={{ height: '4px' }} /></tr></table>

      <EmailDivider />

      {/* Callout box */}
      <table cellPadding="0" cellSpacing="0" width="100%" style={{ margin: '8px 0 20px' }}>
        <tr>
          <td style={{
            backgroundColor: 'rgba(255, 215, 0, 0.06)',
            border: `1px solid ${BRAND_COLORS.border}`,
            borderRadius: '10px',
            padding: '20px 24px',
            textAlign: 'center' as const,
          }}>
            <Text style={{
              color: BRAND_COLORS.textPrimary,
              fontSize: '15px',
              fontWeight: 600,
              lineHeight: '1.6',
              margin: '0',
              fontFamily: "'Inter', Arial, sans-serif",
            }}>
              This isn&apos;t something eXp provides.<br />
              We built it because the team you join matters more than the brokerage.
            </Text>
          </td>
        </tr>
      </table>

      <EmailParagraph>
        Watch the quick walkthrough to see it in action:
      </EmailParagraph>

      {/* Video Thumbnail */}
      <table cellPadding="0" cellSpacing="0" style={{ width: '100%', margin: '16px 0' }}>
        <tr>
          <td align="center">
            <Link href={VIDEO_PAGE_URL} style={{ textDecoration: 'none' }}>
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
                href={VIDEO_PAGE_URL}
                style={{ color: BRAND_COLORS.gold, textDecoration: 'underline' }}
              >
                Watch the Agent Portal Walkthrough
              </Link>
            </Text>
          </td>
        </tr>
      </table>

      <EmailDivider />

      <EmailParagraph>
        If you&apos;ve been thinking about making a move, or you&apos;re already at eXp but
        don&apos;t have this kind of support from your sponsor - let&apos;s talk.
      </EmailParagraph>

      <EmailButton href={BOOK_A_CALL_URL}>Book a Call</EmailButton>

      <EmailDivider />

      <EmailParagraph style={{ fontSize: '14px', color: BRAND_COLORS.textMuted }}>
        Questions? Reply to this email or reach out at{' '}
        <EmailLink href="mailto:team@smartagentalliance.com">
          team@smartagentalliance.com
        </EmailLink>
      </EmailParagraph>

      <EmailSignature />
    </EmailLayout>
  );
}

export default PortalPromoEmail;
