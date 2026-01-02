'use client';

import React from 'react';

export interface FormCardProps {
  /** Card content */
  children: React.ReactNode;
  /** Optional className for additional styling */
  className?: string;
  /** Max width of the card */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

// Max width configurations
const MAX_WIDTH_CONFIG = {
  sm: '400px',
  md: '500px',
  lg: '640px',
  xl: '800px',
} as const;

// Card styles matching the base Modal panel design
const cardStyles: React.CSSProperties = {
  background: '#151517',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '16px',
  padding: '2rem',
  width: '100%',
};

/**
 * FormCard - Card container for forms, matching the base Modal panel design
 *
 * Use this for standalone forms on pages (login, activate, etc.)
 * to maintain consistent styling with modal forms.
 *
 * @example
 * <FormCard maxWidth="md">
 *   <ModalTitle>Login</ModalTitle>
 *   <form>...</form>
 * </FormCard>
 */
export function FormCard({
  children,
  className = '',
  maxWidth = 'md',
}: FormCardProps) {
  return (
    <div
      style={{
        ...cardStyles,
        maxWidth: MAX_WIDTH_CONFIG[maxWidth],
      }}
      className={className}
    >
      {children}
    </div>
  );
}

export default FormCard;
