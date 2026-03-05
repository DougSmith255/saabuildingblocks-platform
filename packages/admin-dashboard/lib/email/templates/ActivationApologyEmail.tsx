/**
 * Activation Apology Email Template
 *
 * Personal email from Doug to agents who received broken activation links.
 * Simple, honest, with a fresh working activation button.
 */

import * as React from 'react';
import {
  EmailLayout,
  EmailGreeting,
  EmailParagraph,
  EmailButton,
  EmailDivider,
  EmailLink,
  BRAND_COLORS,
} from './components/Layout';
import { Text, Section, Img, Link } from '@react-email/components';

interface ActivationApologyEmailProps {
  firstName: string;
  activationLink: string;
  expiresInHours?: number;
}

export function ActivationApologyEmail({
  firstName,
  activationLink,
  expiresInHours = 168,
}: ActivationApologyEmailProps) {
  return (
    <EmailLayout preview={`${firstName}, your fresh activation link is here - sorry for the trouble`}>
      <EmailGreeting>Hi {firstName},</EmailGreeting>

      <EmailParagraph>
        I owe you an apology. Over the past week, some of the activation links I sent out
        weren't working properly. That's on me, and I'm sorry for the hassle.
      </EmailParagraph>

      <EmailParagraph>
        I've since upgraded our login system to a more reliable setup, and this
        fresh link below is good to go.
      </EmailParagraph>

      <EmailButton href={activationLink}>Activate My Account</EmailButton>

      <EmailParagraph style={{ fontSize: '14px', color: BRAND_COLORS.textMuted }}>
        This link is valid for <strong>7 days</strong>. A new one will be sent automatically if it expires.
      </EmailParagraph>

      <EmailParagraph>
        If you run into anything at all, just reply to this email. I'm here to help.
      </EmailParagraph>

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

      {/* Personal sign-off from Doug */}
      <Section style={{ marginTop: '32px' }}>
        <Text style={{
          color: BRAND_COLORS.textPrimary,
          fontSize: '16px',
          lineHeight: '24px',
          margin: '0 0 4px',
        }}>
          Best,
        </Text>
        <Text style={{
          color: BRAND_COLORS.textPrimary,
          fontSize: '16px',
          lineHeight: '24px',
          margin: '0 0 14px',
        }}>
          Doug
        </Text>
      </Section>

      {/* Signature Card */}
      <table
        cellPadding="0"
        cellSpacing="0"
        width="500"
        style={{
          borderCollapse: 'separate' as const,
          borderSpacing: '0',
          border: '2px solid #888888',
          borderRadius: '10px',
          overflow: 'hidden',
          fontFamily: "'Century Gothic', Futura, 'Trebuchet MS', Arial, sans-serif",
        }}
      >
        <tr>
          <td style={{ backgroundColor: '#0d0d0d', fontSize: '0', lineHeight: '0' }}>
            <Img
              src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-gold-bar/public"
              width={500}
              height={4}
              alt=""
              style={{ display: 'block', border: '0', width: '100%', height: '4px' }}
            />
          </td>
        </tr>
        <tr>
          <td style={{ backgroundColor: '#0d0d0d', padding: '24px 28px 20px', verticalAlign: 'top' }}>
            <table cellPadding="0" cellSpacing="0" style={{ width: '100%' }}>
              <tr>
                <td style={{ width: '160px', verticalAlign: 'middle', paddingRight: '22px' }}>
                  <Link href="https://smartagentalliance.com" style={{ textDecoration: 'none' }}>
                    <Img
                      src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-logo-gold/public"
                      width={140}
                      alt="Smart Agent Alliance"
                      style={{ display: 'block', border: '0' }}
                    />
                  </Link>
                </td>
                <td style={{ verticalAlign: 'top' }}>
                  <table cellPadding="0" cellSpacing="0">
                    <tr>
                      <td style={{ fontSize: '17px', fontWeight: 'bold', color: '#ffffff', letterSpacing: '2px', textTransform: 'uppercase' as const, paddingBottom: '4px' }}>
                        Smart Agent Alliance
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontSize: '10px', color: '#777777', letterSpacing: '2px', textTransform: 'uppercase' as const, paddingBottom: '14px' }}>
                        For Agents Who Want More
                      </td>
                    </tr>
                    <tr>
                      <td style={{ paddingBottom: '10px' }}>
                        <Link href="mailto:team@smartagentalliance.com" style={{ fontSize: '12px', color: '#ffd700', textDecoration: 'none' }}>
                          team@smartagentalliance.com
                        </Link>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontSize: '11px' }}>
                        <Link href="https://smartagentalliance.com" style={{ color: '#888888', textDecoration: 'none' }}>Website</Link>
                        <span style={{ color: '#444444', padding: '0 6px' }}>//</span>
                        <Link href="https://www.youtube.com/@SmartAgentAlliance" style={{ color: '#888888', textDecoration: 'none' }}>YouTube</Link>
                        <span style={{ color: '#444444', padding: '0 6px' }}>//</span>
                        <Link href="https://www.linkedin.com/company/smart-agent-alliance" style={{ color: '#888888', textDecoration: 'none' }}>LinkedIn</Link>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style={{ backgroundColor: '#0d0d0d', padding: '0 28px' }}>
            <table cellPadding="0" cellSpacing="0" style={{ width: '100%' }}>
              <tr>
                <td style={{ height: '1px', backgroundColor: '#888888', fontSize: '1px', lineHeight: '1px' }}>&nbsp;</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style={{ backgroundColor: '#0d0d0d', padding: '16px 28px 20px' }}>
            <Link href="https://smartagentalliance.com" style={{ fontSize: '11px', color: '#ffd700', letterSpacing: '3px', textTransform: 'uppercase' as const, textDecoration: 'none' }}>
              Smart Agent Alliance
            </Link>
          </td>
        </tr>
      </table>
    </EmailLayout>
  );
}

export default ActivationApologyEmail;
