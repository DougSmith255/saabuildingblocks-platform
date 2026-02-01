'use client';

import React from 'react';

export interface ConsentCheckboxProps {
  /** Whether the checkbox is checked */
  checked: boolean;
  /** Callback when toggled */
  onChange: (checked: boolean) => void;
  /** Accent color for the checked state (default: '#ffd700') */
  accentColor?: string;
  /** Link color for terms/privacy links (default: same as accentColor) */
  linkColor?: string;
  /** Text color for the label (default: 'rgba(220, 219, 213, 0.7)') */
  textColor?: string;
}

/**
 * ConsentCheckbox — Compliance checkbox with Terms & Privacy links.
 *
 * Uses circle icon styling matching the agent portal onboarding pattern:
 * filled circle when checked, empty circle when unchecked.
 */
export function ConsentCheckbox({
  checked,
  onChange,
  accentColor = '#ffd700',
  linkColor,
  textColor = 'rgba(220, 219, 213, 0.7)',
}: ConsentCheckboxProps) {
  const resolvedLinkColor = linkColor || accentColor;

  return (
    <div style={{ marginTop: '1.25rem' }}>
      <label
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem',
          cursor: 'pointer',
        }}
        onClick={(e) => {
          e.preventDefault();
          onChange(!checked);
        }}
      >
        {/* Circle icon — filled when checked, empty when unchecked */}
        <span
          style={{
            width: '22px',
            height: '22px',
            minWidth: '22px',
            marginTop: '1px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}
        >
          {checked ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill={accentColor} stroke={accentColor} strokeWidth="2" />
              <polyline
                points="8 12 11 15 16 9"
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="rgba(100,100,100,0.6)" strokeWidth="2" fill="none" />
            </svg>
          )}
        </span>

        <span
          style={{
            fontSize: '13px',
            color: textColor,
            lineHeight: 1.5,
          }}
        >
          I agree to the{' '}
          <a
            href="/terms-of-use/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{ color: resolvedLinkColor, textDecoration: 'underline' }}
          >
            Terms &amp; Conditions
          </a>
          {' '}and{' '}
          <a
            href="/privacy-policy/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{ color: resolvedLinkColor, textDecoration: 'underline' }}
          >
            Privacy Policy
          </a>
          {' '}and consent to receive emails.
        </span>
      </label>
    </div>
  );
}

export default ConsentCheckbox;
