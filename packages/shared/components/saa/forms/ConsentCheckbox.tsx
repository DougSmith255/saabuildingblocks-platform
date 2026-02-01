'use client';

import React from 'react';

export interface ConsentCheckboxProps {
  /** Whether the checkbox is checked */
  checked: boolean;
  /** Callback when toggled */
  onChange: (checked: boolean) => void;
  /** Accent color for the checked gradient start (default: '#22c55e') */
  accentColor?: string;
  /** Accent color for the checked gradient end (default: '#16a34a') */
  accentColorEnd?: string;
  /** Link color for terms/privacy links (default: same as accentColor) */
  linkColor?: string;
  /** Text color for the label (default: 'rgba(220, 219, 213, 0.7)') */
  textColor?: string;
}

/**
 * ConsentCheckbox — Compliance checkbox with Terms & Privacy links.
 *
 * Matches the agent portal onboarding checkbox design exactly:
 * - 24×24 rounded-md square (not circle)
 * - Unchecked: solid #bfbdb0 fill with inset shadow
 * - Checked: gradient fill with glow + white checkmark
 */
export function ConsentCheckbox({
  checked,
  onChange,
  accentColor = '#22c55e',
  accentColorEnd = '#16a34a',
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
        {/* Checkbox — rounded-md square matching agent portal onboarding */}
        <div
          style={{
            width: '24px',
            height: '24px',
            minWidth: '24px',
            marginTop: '1px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            background: checked
              ? `linear-gradient(135deg, ${accentColor} 0%, ${accentColorEnd} 100%)`
              : '#bfbdb0',
            border: checked
              ? `1px solid ${accentColor}80`
              : '1px solid rgba(255,255,255,0.15)',
            boxShadow: checked
              ? `0 0 10px ${accentColor}4D, inset 0 1px 0 rgba(255,255,255,0.1)`
              : 'inset 0 1px 2px rgba(0,0,0,0.2)',
          }}
        >
          {checked && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>

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
