/**
 * Booking Referral Notification Email Template
 *
 * Sent to agents when a visitor books a call from their attraction page.
 * Pure notification — no RSVP needed. Includes meeting details and join link.
 */

import * as React from 'react';
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

interface BookingReferralNotificationProps {
  agentFirstName: string;
  visitorName?: string;
  visitorEmail?: string;
  visitorPhone?: string;
  bookingTime?: string;
  meetingLink?: string;
  appointmentTitle?: string;
  portalUrl?: string;
}

export function BookingReferralNotification({
  agentFirstName,
  visitorName,
  visitorEmail,
  visitorPhone,
  bookingTime,
  meetingLink,
  appointmentTitle,
  portalUrl = 'https://smartagentalliance.com/agent-portal?section=agent-page',
}: BookingReferralNotificationProps) {
  const displayVisitor = visitorName || visitorEmail || 'A visitor';

  return (
    <EmailLayout preview={`${displayVisitor} booked a call from your attraction page!`}>
      <EmailGreeting>Hi {agentFirstName},</EmailGreeting>

      <EmailHeading>New Booking from Your Attraction Page</EmailHeading>

      <EmailParagraph>
        Great news! <strong>{displayVisitor}</strong> booked a call from your attraction page.
        The meeting is confirmed — here are the details:
      </EmailParagraph>

      {(visitorName || visitorEmail || bookingTime) && (
        <table cellPadding="0" cellSpacing="0" width="100%" style={{ marginBottom: '24px' }}>
          <tr>
            <td style={{
              backgroundColor: BRAND_COLORS.highlightStrong,
              border: `1px solid ${BRAND_COLORS.border}`,
              borderRadius: '8px',
              padding: '16px 20px',
            }}>
              {appointmentTitle && (
                <EmailParagraph style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: 600, color: BRAND_COLORS.gold }}>
                  {appointmentTitle}
                </EmailParagraph>
              )}
              {visitorName && (
                <EmailParagraph style={{ margin: '0 0 4px 0', fontSize: '14px' }}>
                  <strong style={{ color: BRAND_COLORS.gold }}>Name:</strong>{' '}
                  {visitorName}
                </EmailParagraph>
              )}
              {visitorEmail && (
                <EmailParagraph style={{ margin: '0 0 4px 0', fontSize: '14px' }}>
                  <strong style={{ color: BRAND_COLORS.gold }}>Email:</strong>{' '}
                  {visitorEmail}
                </EmailParagraph>
              )}
              {visitorPhone && (
                <EmailParagraph style={{ margin: '0 0 4px 0', fontSize: '14px' }}>
                  <strong style={{ color: BRAND_COLORS.gold }}>Phone:</strong>{' '}
                  {visitorPhone}
                </EmailParagraph>
              )}
              {bookingTime && (
                <EmailParagraph style={{ margin: '0 0 4px 0', fontSize: '14px' }}>
                  <strong style={{ color: BRAND_COLORS.gold }}>Scheduled:</strong>{' '}
                  {bookingTime}
                </EmailParagraph>
              )}
              {meetingLink && (
                <EmailParagraph style={{ margin: '0', fontSize: '14px' }}>
                  <strong style={{ color: BRAND_COLORS.gold }}>Meeting Link:</strong>{' '}
                  <EmailLink href={meetingLink}>{meetingLink}</EmailLink>
                </EmailParagraph>
              )}
            </td>
          </tr>
        </table>
      )}

      <table cellPadding="0" cellSpacing="0" width="100%" style={{ marginBottom: '24px' }}>
        <tr>
          <td align="center">
            <EmailButton href={portalUrl}>View in Agent Portal</EmailButton>
          </td>
        </tr>
      </table>

      <EmailParagraph style={{ fontSize: '13px', color: BRAND_COLORS.textMuted, textAlign: 'center' }}>
        This link will sign you in automatically.
      </EmailParagraph>

      <EmailSignature />
    </EmailLayout>
  );
}

export default BookingReferralNotification;
