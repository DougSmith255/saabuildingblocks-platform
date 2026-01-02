'use client';

import React from 'react';

export interface FormGroupProps {
  /** Label text */
  label: string;
  /** HTML for attribute (should match input id) */
  htmlFor?: string;
  /** Whether field is required (shows asterisk) */
  required?: boolean;
  /** Form control (input, select, etc.) */
  children: React.ReactNode;
  /** Visual style variant */
  variant?: 'dark' | 'cyber';
}

// Label styles per variant
const labelStyles: Record<string, React.CSSProperties> = {
  dark: {
    display: 'block',
    fontFamily: 'var(--font-synonym, system-ui), sans-serif',
    fontSize: '0.875rem',
    color: '#fff',
    marginBottom: '0.5rem',
  },
  cyber: {
    display: 'block',
    fontFamily: 'var(--font-synonym, system-ui), sans-serif',
    fontSize: '0.75rem',
    color: '#ffd700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.5rem',
  },
};

const groupStyles: React.CSSProperties = {
  marginBottom: '1rem',
};

/**
 * FormGroup - Label + input wrapper for forms
 *
 * @example
 * <FormGroup label="Email" htmlFor="email" required>
 *   <FormInput type="email" id="email" />
 * </FormGroup>
 */
export function FormGroup({
  label,
  htmlFor,
  required = false,
  children,
  variant = 'dark',
}: FormGroupProps) {
  return (
    <div style={groupStyles}>
      <label htmlFor={htmlFor} style={labelStyles[variant]}>
        {label}
        {required && ' *'}
      </label>
      {children}
    </div>
  );
}

export default FormGroup;
