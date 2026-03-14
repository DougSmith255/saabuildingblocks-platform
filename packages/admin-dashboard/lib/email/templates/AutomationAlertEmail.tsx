/**
 * Automation Health Alert Email
 *
 * Sent when automations break or recover. Uses the shared EmailLayout
 * for consistent SAA branding.
 */

import * as React from 'react';
import {
  EmailLayout,
  EmailHeading,
  EmailParagraph,
  EmailDivider,
  EmailSignature,
  BRAND_COLORS,
} from './components/Layout';
import { Section, Text } from '@react-email/components';

interface AutomationInfo {
  id: string;
  name: string;
  category: string;
  description: string;
  statusDetail?: string;
}

interface AutomationAlertEmailProps {
  newlyBroken: AutomationInfo[];
  newlyRecovered: AutomationInfo[];
  totalActive: number;
  totalBroken: number;
  totalAutomations: number;
  timestamp: string;
}

export function AutomationAlertEmail({
  newlyBroken,
  newlyRecovered,
  totalActive,
  totalBroken,
  totalAutomations,
  timestamp,
}: AutomationAlertEmailProps) {
  const hasBroken = newlyBroken.length > 0;
  const hasRecovered = newlyRecovered.length > 0;
  const allRecovered = !hasBroken && hasRecovered;

  const preview = allRecovered
    ? `All automations recovered - ${totalActive}/${totalAutomations} active`
    : `${newlyBroken.length} automation(s) broke - ${totalBroken} total broken`;

  return (
    <EmailLayout preview={preview}>
      <EmailHeading>
        {allRecovered ? 'All Automations Recovered' : 'Automation Health Alert'}
      </EmailHeading>

      {/* Summary line */}
      <Section style={{ marginBottom: '20px' }}>
        <Text style={{
          color: BRAND_COLORS.textSecondary,
          fontSize: '14px',
          lineHeight: '22px',
          margin: 0,
        }}>
          {totalActive} active / {totalBroken} broken / {totalAutomations} total
        </Text>
        <Text style={{
          color: BRAND_COLORS.textMuted,
          fontSize: '12px',
          margin: '4px 0 0 0',
        }}>
          Checked at {new Date(timestamp).toLocaleString('en-US', { timeZone: 'America/New_York' })} ET
        </Text>
      </Section>

      {/* Newly broken section */}
      {hasBroken && (
        <Section style={{
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '16px',
        }}>
          <Text style={{
            color: '#ef4444',
            fontSize: '14px',
            fontWeight: 'bold',
            margin: '0 0 12px 0',
          }}>
            Newly Broken ({newlyBroken.length})
          </Text>
          {newlyBroken.map((auto) => (
            <Section key={auto.id} style={{ marginBottom: '12px' }}>
              <Text style={{
                color: BRAND_COLORS.textPrimary,
                fontSize: '14px',
                fontWeight: 'bold',
                margin: '0 0 2px 0',
              }}>
                {auto.name}
              </Text>
              <Text style={{
                color: BRAND_COLORS.textMuted,
                fontSize: '12px',
                margin: '0 0 2px 0',
              }}>
                {auto.category} - {auto.description}
              </Text>
              {auto.statusDetail && (
                <Text style={{
                  color: '#ef4444',
                  fontSize: '12px',
                  margin: '2px 0 0 0',
                }}>
                  Detail: {auto.statusDetail}
                </Text>
              )}
            </Section>
          ))}
        </Section>
      )}

      {/* Newly recovered section */}
      {hasRecovered && (
        <Section style={{
          background: 'rgba(0, 255, 136, 0.05)',
          border: '1px solid rgba(0, 255, 136, 0.2)',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '16px',
        }}>
          <Text style={{
            color: '#00ff88',
            fontSize: '14px',
            fontWeight: 'bold',
            margin: '0 0 12px 0',
          }}>
            Recovered ({newlyRecovered.length})
          </Text>
          {newlyRecovered.map((auto) => (
            <Section key={auto.id} style={{ marginBottom: '8px' }}>
              <Text style={{
                color: BRAND_COLORS.textPrimary,
                fontSize: '14px',
                margin: '0',
              }}>
                {auto.name} ({auto.category})
              </Text>
            </Section>
          ))}
        </Section>
      )}

      <EmailDivider />

      <EmailParagraph>
        View full status at{' '}
        <a href="https://saabuildingblocks.com/master-controller?tab=automations" style={{ color: BRAND_COLORS.gold }}>
          Master Controller - Automations
        </a>
      </EmailParagraph>

      <EmailSignature />
    </EmailLayout>
  );
}
