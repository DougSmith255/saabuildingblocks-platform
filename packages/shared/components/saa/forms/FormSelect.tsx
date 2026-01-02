'use client';

import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface FormSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  /** Options for the select */
  options: SelectOption[];
  /** Placeholder text for empty state */
  placeholder?: string;
  /** Visual style variant */
  variant?: 'dark' | 'cyber';
}

// Base select styles
const baseStyles: React.CSSProperties = {
  width: '100%',
  padding: '0.5rem 0.75rem',
  paddingRight: '2rem',
  borderRadius: '6px',
  fontFamily: 'var(--font-synonym, system-ui), sans-serif',
  fontSize: '0.9rem',
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 0.75rem center',
  cursor: 'pointer',
};

// Variant-specific styles
const variantStyles: Record<string, React.CSSProperties> = {
  dark: {
    background: '#1a1a1c',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    color: '#fff',
  },
  cyber: {
    background: 'rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(255, 215, 0, 0.3)',
    color: '#e5e4dd',
  },
};

const optionStyle: React.CSSProperties = {
  background: '#1a1a1c',
  color: '#fff',
};

/**
 * FormSelect - Styled select component for forms
 *
 * @example
 * <FormSelect
 *   options={[
 *     { value: 'US', label: 'United States' },
 *     { value: 'CA', label: 'Canada' },
 *   ]}
 *   placeholder="Select country"
 *   value={country}
 *   onChange={(e) => setCountry(e.target.value)}
 * />
 */
export function FormSelect({
  options,
  placeholder = 'Select...',
  variant = 'dark',
  style,
  ...props
}: FormSelectProps) {
  return (
    <select
      style={{
        ...baseStyles,
        ...variantStyles[variant],
        ...style,
      }}
      {...props}
    >
      <option value="" style={optionStyle}>
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value} style={optionStyle}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default FormSelect;
