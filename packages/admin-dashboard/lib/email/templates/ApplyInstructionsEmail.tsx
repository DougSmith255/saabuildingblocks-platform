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
import { EmailNumberedStep } from './components/Layout';

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
              src="https://saabuildingblocks.pages.dev/images/saa-logo-gold.png"
              alt="Smart Agent Alliance"
              width={180}
              height={64}
              style={{ display: 'block', margin: '0 auto' }}
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
              How to Join Smart Agent Alliance at eXp
            </Heading>

            <EmailNumberedStep number={1}>
              <strong style={{color: '#e5e4dd'}}>Start Your Application</strong>
              <br />
              <span style={subTextStyle}>
                Visit{' '}
                <Link href="https://joinapp.exprealty.com/" style={linkStyle}>
                  joinapp.exprealty.com
                </Link>{' '}
                to begin your eXp Realty application.
              </span>
            </EmailNumberedStep>

            <EmailNumberedStep number={2}>
              <strong style={{color: '#e5e4dd'}}>Search for Your Sponsor</strong>
              <br />
              <span style={subTextStyle}>
                Enter <strong style={{color: '#ffd700'}}>{agentEmail}</strong> and click Search.
                Select <strong style={{color: '#ffd700'}}>{agentName}</strong> as your sponsor.
              </span>
            </EmailNumberedStep>

            <EmailNumberedStep number={3}>
              <strong style={{color: '#e5e4dd'}}>Complete Your Application</strong>
              <br />
              <span style={subTextStyle}>
                Fill out the application form and submit. You&apos;ll receive a confirmation email from eXp.
              </span>
            </EmailNumberedStep>

            <EmailNumberedStep number={4}>
              <strong style={{color: '#e5e4dd'}}>eXp Realty Support</strong>
              <br />
              <span style={subTextStyle}>
                For application issues, call <strong style={{color: '#e5e4dd'}}>833-303-0610</strong> or email{' '}
                <Link href="mailto:expertcare@exprealty.com" style={linkStyle}>
                  expertcare@exprealty.com
                </Link>
              </span>
            </EmailNumberedStep>

            <Hr style={dividerStyle} />

            <Text style={closingStyle}>
              Best regards,
            </Text>
            <Text style={{...goldTextStyle, marginTop: '8px'}}>
              The SAA Team
            </Text>
            <Text style={{...paragraphStyle, margin: '4px 0'}}>
              Smart Agent Alliance
            </Text>
            <Link href="mailto:team@smartagentalliance.com" style={linkStyle}>
              team@smartagentalliance.com
            </Link>
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
  padding: '20px 24px 16px',
  backgroundColor: '#0a0a0a',
  textAlign: 'center',
  borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
};

const headerBrandTextStyle: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '20px',
  fontWeight: 700,
  margin: 0,
  letterSpacing: '0.5px',
};

const contentStyle: React.CSSProperties = {
  padding: '24px 24px 28px',
};

const greetingStyle: React.CSSProperties = {
  color: '#ffffff',
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
  fontSize: '22px',
  fontWeight: 700,
  margin: '20px 0 14px 0',
};

const subHeadingStyle: React.CSSProperties = {
  color: '#e5e4dd',
  fontSize: '17px',
  fontWeight: 600,
  margin: '20px 0 10px 0',
};

const stepTableStyle: React.CSSProperties = {
  width: '100%',
  marginBottom: '12px',
};

const stepNumberCellStyle: React.CSSProperties = {
  width: '36px',
  verticalAlign: 'top',
  paddingTop: '2px',
};

const stepNumberStyle: React.CSSProperties = {
  color: '#1a1a1a',
  fontSize: '14px',
  fontWeight: 700,
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  backgroundColor: '#ffd700',
  textAlign: 'center',
  lineHeight: '28px',
  display: 'block',
};

const stepTextCellStyle: React.CSSProperties = {
  color: '#e5e4dd',
  fontSize: '15px',
  lineHeight: '1.5',
  verticalAlign: 'top',
  paddingTop: '4px',
};

const subTextStyle: React.CSSProperties = {
  color: '#bfbdb0',
  fontSize: '14px',
};

const highlightBoxStyle: React.CSSProperties = {
  backgroundColor: 'rgba(255, 215, 0, 0.05)',
  border: '1px solid rgba(255, 215, 0, 0.2)',
  borderRadius: '8px',
  padding: '16px 18px',
  margin: '18px 0',
};

const highlightHeadingStyle: React.CSSProperties = {
  color: '#ffffff',
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
  margin: '18px 0',
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
