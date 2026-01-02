'use client';

import React from 'react';

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Visual style variant */
  variant?: 'dark' | 'cyber';
}

// Base input styles shared across variants
const baseStyles: React.CSSProperties = {
  width: '100%',
  padding: '0.5rem 0.75rem',
  borderRadius: '6px',
  fontFamily: 'var(--font-synonym, system-ui), sans-serif',
  fontSize: '0.9rem',
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

// Variant-specific styles
const variantStyles: Record<string, React.CSSProperties> = {
  dark: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    color: '#fff',
  },
  cyber: {
    background: 'rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(255, 215, 0, 0.3)',
    color: '#e5e4dd',
  },
};

/**
 * FormInput - Styled input component for forms
 *
 * Variants:
 * - dark: Dark background with subtle white border (default, for modals)
 * - cyber: Black background with gold border (for cyber/portal forms)
 *
 * @example
 * <FormInput
 *   type="email"
 *   placeholder="agent@example.com"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 * />
 */
export function FormInput({
  variant = 'dark',
  style,
  ...props
}: FormInputProps) {
  return (
    <input
      style={{
        ...baseStyles,
        ...variantStyles[variant],
        ...style,
      }}
      {...props}
    />
  );
}

export default FormInput;
