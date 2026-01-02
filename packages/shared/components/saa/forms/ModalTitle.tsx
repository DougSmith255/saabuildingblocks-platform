'use client';

import React from 'react';

export interface ModalTitleProps {
  children: React.ReactNode;
  /** Optional subtitle text */
  subtitle?: string;
  /** Center the text (default: false) */
  centered?: boolean;
}

/**
 * ModalTitle - Consistent title styling for modals
 *
 * Uses Master Controller CSS variables for typography:
 * - Font family: --font-family-h3 (Amulya)
 * - Font size: Responsive clamp for modal context (smaller than page H3)
 * - Color: --text-color-h3 (#e5e4dd)
 *
 * @example
 * <ModalTitle subtitle="Take the first step">Join Smart Agent Alliance</ModalTitle>
 */
export function ModalTitle({ children, subtitle, centered = false }: ModalTitleProps) {
  return (
    <div style={{ textAlign: centered ? 'center' : 'left', marginBottom: subtitle ? '1.25rem' : '1rem' }}>
      <h3
        style={{
          fontFamily: 'var(--font-family-h3, var(--font-amulya), system-ui, sans-serif)',
          fontSize: 'clamp(1.25rem, calc(1.1rem + 0.5vw), 1.75rem)',
          fontWeight: 'var(--font-weight-h3, 700)',
          lineHeight: 1.3,
          color: 'var(--text-color-h3, #e5e4dd)',
          margin: 0,
          marginBottom: subtitle ? '0.35rem' : 0,
        }}
      >
        {children}
      </h3>
      {subtitle && (
        <p
          style={{
            fontFamily: 'var(--font-synonym, system-ui), sans-serif',
            fontSize: '0.9rem',
            color: 'rgba(255, 255, 255, 0.7)',
            margin: 0,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default ModalTitle;
