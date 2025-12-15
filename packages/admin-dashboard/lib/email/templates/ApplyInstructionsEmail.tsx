/**
 * Apply Instructions Email Template
 *
 * Sent when someone clicks "Email me these instructions" on an agent's attraction page.
 * Contains step-by-step instructions for joining eXp through their sponsor agent.
 */

import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Link,
  Hr,
  Img,
} from '@react-email/components';

interface ApplyInstructionsEmailProps {
  recipientFirstName: string;
  agentName: string;
  agentEmail: string;
}

export function ApplyInstructionsEmail({
  recipientFirstName,
  agentName,
  agentEmail,
}: ApplyInstructionsEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header */}
          <Section style={headerStyle}>
            <Img
              src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-logo-gold/public"
              alt="Smart Agent Alliance"
              width={180}
              height={64}
              style={{ margin: '0 auto' }}
            />
          </Section>

          {/* Main Content */}
          <Section style={contentStyle}>
            <Text style={greetingStyle}>Hi {recipientFirstName},</Text>

            <Text style={paragraphStyle}>
              This is a great time to join eXp and Smart Agent Alliance. We&apos;re here to make the
              process simple and support you from start to finish.
            </Text>

            <Heading as="h2" style={headingStyle}>
              How to Apply to Join Smart Agent Alliance
            </Heading>

            {/* Step 1 */}
            <Section style={stepStyle}>
              <Text style={stepNumberStyle}>1</Text>
              <Text style={stepTextStyle}>
                Go to{' '}
                <Link href="https://join.exprealty.com" style={linkStyle}>
                  join.exprealty.com
                </Link>
              </Text>
            </Section>

            {/* Step 2 */}
            <Section style={stepStyle}>
              <Text style={stepNumberStyle}>2</Text>
              <Text style={stepTextStyle}>
                Click &quot;Join Us&quot; or &quot;I&apos;m Ready&quot;
              </Text>
            </Section>

            {/* Step 3 */}
            <Section style={stepStyle}>
              <Text style={stepNumberStyle}>3</Text>
              <Text style={stepTextStyle}>
                Select U.S. or Canada
                <br />
                <span style={subTextStyle}>For other countries, email us</span>
              </Text>
            </Section>

            {/* Step 4 */}
            <Section style={stepStyle}>
              <Text style={stepNumberStyle}>4</Text>
              <Text style={stepTextStyle}>
                <strong>Residential Agents:</strong> Complete the form and click Create Account
                <br />
                <strong>Commercial or Referral Agents:</strong> Use the links at the bottom of the page
              </Text>
            </Section>

            {/* Sponsor Section - Highlighted */}
            <Section style={highlightBoxStyle}>
              <Heading as="h3" style={highlightHeadingStyle}>
                Naming Your Sponsor
              </Heading>
              <Text style={highlightTextStyle}>
                When prompted in the application:
              </Text>
              <Text style={sponsorDetailStyle}>
                Enter: <span style={goldTextStyle}>{agentEmail}</span>
              </Text>
              <Text style={sponsorDetailStyle}>
                Hit search, then select: <span style={goldTextStyle}>{agentName}</span>
              </Text>
              <Text style={highlightTextStyle}>That&apos;s it.</Text>
            </Section>

            <Hr style={dividerStyle} />

            {/* Licensing Notes */}
            <Heading as="h3" style={subHeadingStyle}>
              Licensing Notes (If Applicable)
            </Heading>
            <Text style={paragraphStyle}>
              If your location requires a broker choice before licensing:
            </Text>
            <ul style={listStyle}>
              <li>Join eXp first</li>
              <li>When asked for your license number, enter all zeros</li>
              <li>eXp will guide you through the rest</li>
            </ul>

            {/* Paused Application */}
            <Heading as="h3" style={subHeadingStyle}>
              If You Pause Your Application
            </Heading>
            <Text style={paragraphStyle}>
              If you don&apos;t finish, eXp may contact you. You can resume your application using
              the link in their email.
            </Text>

            <Hr style={dividerStyle} />

            {/* Need Help */}
            <Heading as="h3" style={subHeadingStyle}>
              Need Help?
            </Heading>
            <Text style={contactStyle}>
              <strong>eXp Expert Care</strong>
              <br />
              833-303-0610 |{' '}
              <Link href="mailto:expertcare@exprealty.com" style={linkStyle}>
                expertcare@exprealty.com
              </Link>
            </Text>
            <Text style={contactStyle}>
              <strong>Doug Smart</strong>
              <br />
              Text only: 415-320-5606
              <br />
              <Link href="mailto:doug@smartagentalliance.com" style={linkStyle}>
                doug@smartagentalliance.com
              </Link>
            </Text>
            <Text style={contactStyle}>
              <strong>Karrie Hill</strong>
              <br />
              415-238-0922
              <br />
              <Link href="mailto:karrie@smartagentalliance.com" style={linkStyle}>
                karrie@smartagentalliance.com
              </Link>
            </Text>

            <Hr style={dividerStyle} />

            <Text style={closingStyle}>
              Looking forward to working with you,
              <br />
              <br />
              <strong>Doug & Karrie</strong>
              <br />
              Team Leaders, Smart Agent Alliance
              <br />
              <Link href="mailto:team@smartagentalliance.com" style={linkStyle}>
                team@smartagentalliance.com
              </Link>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              © {new Date().getFullYear()} Smart Agent Alliance. All rights reserved.
            </Text>
            <Text style={footerTextStyle}>
              <Link href="https://smartagentalliance.com/privacy-policy" style={footerLinkStyle}>
                Privacy Policy
              </Link>{' '}
              |{' '}
              <Link href="https://smartagentalliance.com/terms-of-use" style={footerLinkStyle}>
                Terms of Use
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const bodyStyle: React.CSSProperties = {
  backgroundColor: '#0a0a0a',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  margin: 0,
  padding: '20px 0',
};

const containerStyle: React.CSSProperties = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: '#1a1a1a',
  borderRadius: '12px',
  border: '1px solid rgba(255, 215, 0, 0.2)',
  overflow: 'hidden',
};

const headerStyle: React.CSSProperties = {
  padding: '32px 24px',
  backgroundColor: '#0a0a0a',
  textAlign: 'center',
};

const contentStyle: React.CSSProperties = {
  padding: '32px 24px',
};

const greetingStyle: React.CSSProperties = {
  color: '#ffd700',
  fontSize: '20px',
  fontWeight: 600,
  margin: '0 0 16px 0',
};

const paragraphStyle: React.CSSProperties = {
  color: '#bfbdb0',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
};

const headingStyle: React.CSSProperties = {
  color: '#ffd700',
  fontSize: '24px',
  fontWeight: 700,
  margin: '24px 0 16px 0',
};

const subHeadingStyle: React.CSSProperties = {
  color: '#e5e4dd',
  fontSize: '18px',
  fontWeight: 600,
  margin: '24px 0 12px 0',
};

const stepStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: '16px',
};

const stepNumberStyle: React.CSSProperties = {
  color: '#ffd700',
  fontSize: '16px',
  fontWeight: 700,
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 215, 0, 0.1)',
  textAlign: 'center',
  lineHeight: '28px',
  marginRight: '12px',
  flexShrink: 0,
};

const stepTextStyle: React.CSSProperties = {
  color: '#e5e4dd',
  fontSize: '16px',
  lineHeight: '1.5',
  margin: '2px 0 0 0',
};

const subTextStyle: React.CSSProperties = {
  color: '#bfbdb0',
  fontSize: '14px',
};

const highlightBoxStyle: React.CSSProperties = {
  backgroundColor: 'rgba(255, 215, 0, 0.05)',
  border: '1px solid rgba(255, 215, 0, 0.2)',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const highlightHeadingStyle: React.CSSProperties = {
  color: '#ffd700',
  fontSize: '18px',
  fontWeight: 600,
  margin: '0 0 12px 0',
};

const highlightTextStyle: React.CSSProperties = {
  color: '#e5e4dd',
  fontSize: '15px',
  margin: '0 0 8px 0',
};

const sponsorDetailStyle: React.CSSProperties = {
  color: '#e5e4dd',
  fontSize: '15px',
  margin: '8px 0',
  paddingLeft: '12px',
};

const goldTextStyle: React.CSSProperties = {
  color: '#ffd700',
  fontWeight: 600,
};

const linkStyle: React.CSSProperties = {
  color: '#ffd700',
  textDecoration: 'underline',
};

const dividerStyle: React.CSSProperties = {
  borderColor: 'rgba(255, 255, 255, 0.1)',
  margin: '24px 0',
};

const listStyle: React.CSSProperties = {
  color: '#bfbdb0',
  fontSize: '15px',
  lineHeight: '1.8',
  paddingLeft: '20px',
  margin: '0 0 16px 0',
};

const contactStyle: React.CSSProperties = {
  color: '#bfbdb0',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
};

const closingStyle: React.CSSProperties = {
  color: '#e5e4dd',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '24px 0 0 0',
};

const footerStyle: React.CSSProperties = {
  padding: '24px',
  backgroundColor: '#0a0a0a',
  textAlign: 'center',
};

const footerTextStyle: React.CSSProperties = {
  color: '#666',
  fontSize: '12px',
  margin: '0 0 8px 0',
};

const footerLinkStyle: React.CSSProperties = {
  color: '#888',
  textDecoration: 'underline',
};

export default ApplyInstructionsEmail;
