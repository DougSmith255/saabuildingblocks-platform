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
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        `}</style>
      </Head>
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo */}
          {/* Logo uses Cloudflare Images CDN for reliable display in email clients */}
          <Section style={header}>
            <Img
              src="data:image/png;base64,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"
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
      </Body>
    </Html>
  );
}

// Base Styles
const main: React.CSSProperties = {
  backgroundColor: BRAND_COLORS.offBlack,
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  margin: 0,
  padding: '20px 0',
};

const container: React.CSSProperties = {
  backgroundColor: BRAND_COLORS.containerBg,
  margin: '0 auto',
  maxWidth: '600px',
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
      color: BRAND_COLORS.gold,
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
      <td>
        <Link
          href={href}
          style={{
            backgroundColor: BRAND_COLORS.gold,
            borderRadius: '8px',
            color: BRAND_COLORS.textDark,
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
 * Email Signature - Closing signature block
 */
export const EmailSignature = ({
  name,
  title,
  email,
}: {
  name: string;
  title?: string;
  email?: string;
}) => (
  <Section style={{ marginTop: '32px' }}>
    <Text
      style={{
        color: BRAND_COLORS.textPrimary,
        fontSize: '16px',
        lineHeight: '24px',
        margin: '0 0 4px',
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
        margin: '8px 0 4px',
      }}
    >
      {name}
    </Text>
    {title && (
      <Text
        style={{
          color: BRAND_COLORS.textSecondary,
          fontSize: '14px',
          lineHeight: '20px',
          margin: '0',
        }}
      >
        {title}
      </Text>
    )}
    {email && (
      <Link
        href={`mailto:${email}`}
        style={{
          color: BRAND_COLORS.gold,
          fontSize: '14px',
          textDecoration: 'underline',
        }}
      >
        {email}
      </Link>
    )}
  </Section>
);

export default EmailLayout;
