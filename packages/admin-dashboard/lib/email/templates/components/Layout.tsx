/**
 * Email Layout Component
 *
 * Shared layout for all email templates with responsive design,
 * dark mode support, and consistent branding.
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
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://smartagentalliance.com';

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header - spacing only, logo moved to footer/signature */}
          <Section style={header}>
            <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a1a', margin: 0 }}>
              Smart Agent Alliance
            </Text>
          </Section>

          {/* Content */}
          <Section style={content}>{children}</Section>

          {/* Footer with logo in signature */}
          {showFooter && (
            <>
              <Hr style={hr} />
              <Section style={footer}>
                {/* Logo in signature area - email clients typically show these */}
                <Img
                  src="https://smartagentalliance.com/apple-touch-icon.png"
                  width="60"
                  height="60"
                  alt="Smart Agent Alliance"
                  style={{ margin: '0 auto 16px', borderRadius: '12px' }}
                />
                <Text style={footerText}>
                  This email was sent by Smart Agent Alliance
                </Text>
                <Text style={footerText}>
                  <Link href={`${baseUrl}/privacy`} style={footerLink}>
                    Privacy Policy
                  </Link>
                  {' | '}
                  <Link href={`${baseUrl}/terms`} style={footerLink}>
                    Terms of Service
                  </Link>
                  {' | '}
                  <Link href={`${baseUrl}/contact`} style={footerLink}>
                    Contact Us
                  </Link>
                </Text>
                <Text style={footerText}>
                  © {new Date().getFullYear()} Smart Agent Alliance. All rights reserved.
                </Text>
              </Section>
            </>
          )}
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const header = {
  padding: '32px 20px 20px',
  textAlign: 'center' as const,
};

const logo = {
  margin: '0 auto',
};

const content = {
  padding: '0 20px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  padding: '0 20px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '4px 0',
};

const footerLink = {
  color: '#556cd6',
  textDecoration: 'none',
};

// Export utility components for reuse in templates
export const EmailHeading = ({ children }: { children: React.ReactNode }) => (
  <Text
    style={{
      color: '#1a1a1a',
      fontSize: '24px',
      fontWeight: 'bold',
      lineHeight: '32px',
      margin: '0 0 20px',
      textAlign: 'center',
    }}
  >
    {children}
  </Text>
);

export const EmailParagraph = ({
  children,
  style
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <Text
    style={{
      color: '#525252',
      fontSize: '16px',
      lineHeight: '24px',
      margin: '0 0 16px',
      ...style,
    }}
  >
    {children}
  </Text>
);

export const EmailButton = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    style={{
      backgroundColor: '#556cd6',
      borderRadius: '6px',
      color: '#fff',
      display: 'inline-block',
      fontSize: '16px',
      fontWeight: 'bold',
      lineHeight: '24px',
      padding: '12px 24px',
      textDecoration: 'none',
      textAlign: 'center' as const,
      margin: '20px 0',
    }}
  >
    {children}
  </Link>
);

export const EmailCode = ({ children }: { children: React.ReactNode }) => (
  <Text
    style={{
      backgroundColor: '#f4f4f5',
      border: '1px solid #e4e4e7',
      borderRadius: '4px',
      color: '#18181b',
      fontFamily: 'monospace',
      fontSize: '14px',
      padding: '12px 16px',
      margin: '16px 0',
      textAlign: 'center' as const,
    }}
  >
    {children}
  </Text>
);

export const EmailAlert = ({
  children,
  type = 'info',
  style,
}: {
  children: React.ReactNode;
  type?: 'info' | 'warning' | 'error' | 'success';
  style?: React.CSSProperties;
}) => {
  const colors = {
    info: { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af' },
    warning: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' },
    error: { bg: '#fee2e2', border: '#ef4444', text: '#991b1b' },
    success: { bg: '#d1fae5', border: '#10b981', text: '#065f46' },
  };

  const color = colors[type];

  return (
    <Section
      style={{
        backgroundColor: color.bg,
        border: `1px solid ${color.border}`,
        borderRadius: '6px',
        padding: '16px',
        margin: '16px 0',
        ...style,
      }}
    >
      <Text
        style={{
          color: color.text,
          fontSize: '14px',
          lineHeight: '20px',
          margin: 0,
        }}
      >
        {children}
      </Text>
    </Section>
  );
};
