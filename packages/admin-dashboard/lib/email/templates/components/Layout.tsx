/**
 * Email Layout Component - Brand Themed
 *
 * Shared layout for all email templates with Smart Agent Alliance
 * dark/gold brand styling, responsive design, and consistent branding.
 *
 * Brand Colors:
 * - Primary Gold: #ffd700
 * - Off-Black Background: #0a0a0a
 * - Container Background: #1a1a1a
 * - Primary Text: #e5e4dd
 * - Secondary Text: #bfbdb0
 * - Muted Text: #888888
 */

import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

// Brand Colors
export const BRAND_COLORS = {
  gold: '#ffd700',
  goldDark: '#d4af37',
  offBlack: '#0a0a0a',
  containerBg: '#1a1a1a',
  textPrimary: '#e5e4dd',
  textSecondary: '#bfbdb0',
  textMuted: '#888888',
  textDark: '#1a1a1a',
  border: 'rgba(255, 215, 0, 0.2)',
  borderLight: 'rgba(255, 255, 255, 0.1)',
  highlight: 'rgba(255, 215, 0, 0.05)',
  highlightStrong: 'rgba(255, 215, 0, 0.1)',
};

interface EmailLayoutProps {
  preview: string;
  children: React.ReactNode;
  showFooter?: boolean;
}

export function EmailLayout({
  preview,
  children,
  showFooter = true,
}: EmailLayoutProps) {
  const baseUrl = 'https://smartagentalliance.com';

  return (
    <Html>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="x-apple-disable-message-reformatting" />
        <meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

          /* Reset for email clients */
          body, table, td, p, a, li, blockquote {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
          }

          /* Prevent background color bleeding on mobile */
          @media only screen and (max-width: 620px) {
            .email-container {
              width: 100% !important;
              max-width: 100% !important;
            }
            .email-body-wrapper {
              padding: 16px !important;
            }
          }
        `}</style>
      </Head>
      <Preview>{preview}</Preview>
      <Body style={main}>
        {/* Outer wrapper table for consistent background */}
        <table
          role="presentation"
          cellPadding="0"
          cellSpacing="0"
          width="100%"
          style={{ backgroundColor: BRAND_COLORS.offBlack }}
        >
          <tr>
            <td align="center" className="email-body-wrapper" style={{ padding: '20px 16px' }}>
              <Container style={container} className="email-container">
          {/* Header with Logo */}
          {/* Logo uses Cloudflare Images CDN for reliable display in email clients */}
          <Section style={header}>
            <Img
              src="https://saabuildingblocks.pages.dev/images/saa-logo-gold.png"
              alt="Smart Agent Alliance"
              width={180}
              height={64}
              style={{ display: 'block', margin: '0 auto' }}
            />
          </Section>

          {/* Content */}
          <Section style={content}>{children}</Section>

          {/* Footer */}
          {showFooter && (
            <Section style={footer}>
              <Hr style={footerDivider} />
              <Text style={footerText}>
                © {new Date().getFullYear()} Smart Agent Alliance. All rights reserved.
              </Text>
              <Text style={footerLinks}>
                <Link href={`${baseUrl}/privacy-policy`} style={footerLink}>
                  Privacy Policy
                </Link>
                {' | '}
                <Link href={`${baseUrl}/terms-of-use`} style={footerLink}>
                  Terms of Use
                </Link>
                {' | '}
                <Link href="mailto:team@smartagentalliance.com" style={footerLink}>
                  Contact Us
                </Link>
              </Text>
            </Section>
          )}
              </Container>
            </td>
          </tr>
        </table>
      </Body>
    </Html>
  );
}

// Base Styles
const main: React.CSSProperties = {
  backgroundColor: BRAND_COLORS.offBlack,
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  margin: 0,
  padding: '20px 16px', // Added horizontal padding for mobile
  width: '100%',
  minWidth: '100%',
};

const container: React.CSSProperties = {
  backgroundColor: BRAND_COLORS.containerBg,
  margin: '0 auto',
  maxWidth: '600px',
  width: '100%', // Ensure container takes full width up to max
  borderRadius: '12px',
  border: `1px solid ${BRAND_COLORS.border}`,
  overflow: 'hidden',
};

const header: React.CSSProperties = {
  padding: '20px 24px 16px',
  backgroundColor: BRAND_COLORS.offBlack,
  textAlign: 'center' as const,
  borderBottom: `1px solid ${BRAND_COLORS.border}`,
};

const headerBrandText: React.CSSProperties = {
  color: BRAND_COLORS.gold,
  fontSize: '20px',
  fontWeight: 700,
  margin: 0,
  letterSpacing: '0.5px',
};

const content: React.CSSProperties = {
  padding: '24px 24px 28px',
};

const footer: React.CSSProperties = {
  padding: '24px',
  backgroundColor: BRAND_COLORS.offBlack,
  textAlign: 'center' as const,
};

const footerDivider: React.CSSProperties = {
  borderColor: BRAND_COLORS.borderLight,
  margin: '0 0 20px 0',
};

const footerText: React.CSSProperties = {
  color: BRAND_COLORS.textMuted,
  fontSize: '12px',
  lineHeight: '16px',
  margin: '0 0 8px 0',
};

const footerLinks: React.CSSProperties = {
  color: BRAND_COLORS.textMuted,
  fontSize: '12px',
  lineHeight: '16px',
  margin: '0',
};

const footerLink: React.CSSProperties = {
  color: BRAND_COLORS.textMuted,
  textDecoration: 'underline',
};

// =============================================================================
// UTILITY COMPONENTS
// =============================================================================

/**
 * Email Heading - Large centered gold heading
 */
export const EmailHeading = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <Text
    style={{
      color: BRAND_COLORS.gold,
      fontSize: '22px',
      fontWeight: 700,
      lineHeight: '30px',
      margin: '0 0 16px',
      textAlign: 'center' as const,
      ...style,
    }}
  >
    {children}
  </Text>
);

/**
 * Email Subheading - Secondary heading in off-white
 */
export const EmailSubheading = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <Text
    style={{
      color: BRAND_COLORS.textPrimary,
      fontSize: '17px',
      fontWeight: 600,
      lineHeight: '24px',
      margin: '18px 0 10px',
      ...style,
    }}
  >
    {children}
  </Text>
);

/**
 * Email Paragraph - Standard body text
 */
export const EmailParagraph = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <Text
    style={{
      color: BRAND_COLORS.textSecondary,
      fontSize: '16px',
      lineHeight: '26px',
      margin: '0 0 16px',
      ...style,
    }}
  >
    {children}
  </Text>
);

/**
 * Email Greeting - Gold colored greeting text
 */
export const EmailGreeting = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <Text
    style={{
      color: "#ffffff",
      fontSize: '20px',
      fontWeight: 600,
      margin: '0 0 16px',
      ...style,
    }}
  >
    {children}
  </Text>
);

/**
 * Email Button - Brand yellow button with off-black text
 */
export const EmailButton = ({
  href,
  children,
  style,
}: {
  href: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <table cellPadding="0" cellSpacing="0" style={{ margin: '18px auto', ...style }}>
    <tr>
      <td style={{ backgroundColor: '#ffd700', borderRadius: '8px' }}>
        <Link
          href={href}
          style={{
            backgroundColor: '#ffd700',
            borderRadius: '8px',
            color: '#1a1a1a',
            display: 'inline-block',
            fontSize: '15px',
            fontWeight: 700,
            lineHeight: '22px',
            padding: '12px 28px',
            textDecoration: 'none',
            textAlign: 'center' as const,
          }}
        >
          {children}
        </Link>
      </td>
    </tr>
  </table>
);

/**
 * Email Secondary Button - Outlined style
 */
export const EmailSecondaryButton = ({
  href,
  children,
  style,
}: {
  href: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <table cellPadding="0" cellSpacing="0" style={{ margin: '24px auto', ...style }}>
    <tr>
      <td>
        <Link
          href={href}
          style={{
            backgroundColor: 'transparent',
            border: `2px solid ${BRAND_COLORS.gold}`,
            borderRadius: '8px',
            color: BRAND_COLORS.gold,
            display: 'inline-block',
            fontSize: '16px',
            fontWeight: 600,
            lineHeight: '24px',
            padding: '12px 28px',
            textDecoration: 'none',
            textAlign: 'center' as const,
          }}
        >
          {children}
        </Link>
      </td>
    </tr>
  </table>
);

/**
 * Email Code Block - For displaying credentials, codes, etc.
 */
export const EmailCode = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <Text
    style={{
      backgroundColor: BRAND_COLORS.highlightStrong,
      border: `1px solid ${BRAND_COLORS.border}`,
      borderRadius: '8px',
      color: BRAND_COLORS.gold,
      fontFamily: '"SF Mono", Monaco, Consolas, monospace',
      fontSize: '18px',
      fontWeight: 600,
      padding: '16px 20px',
      margin: '16px 0',
      textAlign: 'center' as const,
      letterSpacing: '1px',
      ...style,
    }}
  >
    {children}
  </Text>
);

/**
 * Email Highlight Box - For important callouts
 */
export const EmailHighlightBox = ({
  children,
  title,
  style,
}: {
  children: React.ReactNode;
  title?: string;
  style?: React.CSSProperties;
}) => (
  <Section
    style={{
      backgroundColor: BRAND_COLORS.highlight,
      border: `1px solid ${BRAND_COLORS.border}`,
      borderRadius: '8px',
      padding: '16px 18px',
      margin: '16px 0',
      ...style,
    }}
  >
    {title && (
      <Text
        style={{
          color: BRAND_COLORS.gold,
          fontSize: '15px',
          fontWeight: 600,
          margin: '0 0 10px',
        }}
      >
        {title}
      </Text>
    )}
    {children}
  </Section>
);

/**
 * Email Alert - Contextual alerts with different severity levels
 */
export const EmailAlert = ({
  children,
  type = 'info',
  style,
}: {
  children: React.ReactNode;
  type?: 'info' | 'warning' | 'error' | 'success';
  style?: React.CSSProperties;
}) => {
  const alertStyles = {
    info: {
      bg: 'rgba(59, 130, 246, 0.1)',
      border: 'rgba(59, 130, 246, 0.3)',
      text: '#93c5fd',
      icon: 'ℹ️',
    },
    warning: {
      bg: 'rgba(245, 158, 11, 0.1)',
      border: 'rgba(245, 158, 11, 0.3)',
      text: '#fcd34d',
      icon: '⚠️',
    },
    error: {
      bg: 'rgba(239, 68, 68, 0.1)',
      border: 'rgba(239, 68, 68, 0.3)',
      text: '#fca5a5',
      icon: '❌',
    },
    success: {
      bg: 'rgba(16, 185, 129, 0.1)',
      border: 'rgba(16, 185, 129, 0.3)',
      text: '#6ee7b7',
      icon: '✅',
    },
  };

  const alertStyle = alertStyles[type];

  return (
    <Section
      style={{
        backgroundColor: alertStyle.bg,
        border: `1px solid ${alertStyle.border}`,
        borderRadius: '8px',
        padding: '16px',
        margin: '16px 0',
        ...style,
      }}
    >
      <Text
        style={{
          color: alertStyle.text,
          fontSize: '14px',
          lineHeight: '22px',
          margin: 0,
        }}
      >
        {alertStyle.icon} {children}
      </Text>
    </Section>
  );
};

/**
 * Email Link - Styled link in brand gold
 */
export const EmailLink = ({
  href,
  children,
  style,
}: {
  href: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <Link
    href={href}
    style={{
      color: BRAND_COLORS.gold,
      textDecoration: 'underline',
      ...style,
    }}
  >
    {children}
  </Link>
);

/**
 * Email Divider - Styled horizontal rule
 */
export const EmailDivider = ({ style }: { style?: React.CSSProperties }) => (
  <Hr
    style={{
      borderColor: BRAND_COLORS.borderLight,
      margin: '18px 0',
      ...style,
    }}
  />
);

/**
 * Email List Item - For styled list items
 */
export const EmailListItem = ({
  children,
  bullet = '•',
  style,
}: {
  children: React.ReactNode;
  bullet?: string;
  style?: React.CSSProperties;
}) => (
  <Text
    style={{
      color: BRAND_COLORS.textSecondary,
      fontSize: '15px',
      lineHeight: '24px',
      margin: '0 0 8px',
      paddingLeft: '0',
      ...style,
    }}
  >
    <span style={{ color: BRAND_COLORS.gold, marginRight: '8px' }}>{bullet}</span>
    {children}
  </Text>
);

/**
 * Email Numbered Step - For numbered lists with styled circles
 */
export const EmailNumberedStep = ({
  number,
  children,
  style,
}: {
  number: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <table cellPadding="0" cellSpacing="0" style={{ width: '100%', marginBottom: '10px', ...style }}>
    <tr>
      <td style={{ width: '32px', verticalAlign: 'top', paddingTop: '2px' }}>
        <div
          style={{
            color: BRAND_COLORS.gold,
            fontSize: '13px',
            fontWeight: 700,
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 215, 0, 0.15)',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            textAlign: 'center' as const,
            lineHeight: '22px',
            display: 'block',
          }}
        >
          {number}
        </div>
      </td>
      <td
        style={{
          color: BRAND_COLORS.textSecondary,
          fontSize: '15px',
          lineHeight: '1.5',
          verticalAlign: 'top',
          paddingTop: '3px',
        }}
      >
        {children}
      </td>
    </tr>
  </table>
);

/**
 * Email Signature - Standardized closing signature block
 */
export const EmailSignature = () => (
  <Section style={{ marginTop: '32px' }}>
    <Text
      style={{
        color: BRAND_COLORS.textPrimary,
        fontSize: '16px',
        lineHeight: '24px',
        margin: '0 0 8px',
      }}
    >
      Best regards,
    </Text>
    <Text
      style={{
        color: BRAND_COLORS.gold,
        fontSize: '16px',
        fontWeight: 600,
        lineHeight: '24px',
        margin: '0 0 4px',
      }}
    >
      Smart Agent Alliance
    </Text>
    <Link
      href="mailto:team@smartagentalliance.com"
      style={{
        color: BRAND_COLORS.gold,
        fontSize: '14px',
        textDecoration: 'underline',
      }}
    >
      team@smartagentalliance.com
    </Link>
  </Section>
);

export default EmailLayout;
