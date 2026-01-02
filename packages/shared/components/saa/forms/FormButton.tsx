'use client';

import React from 'react';

export interface FormButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: 'gold' | 'cyber';
  /** Whether the button is in loading state */
  isLoading?: boolean;
  /** Loading text to display */
  loadingText?: string;
  /** Full width button */
  fullWidth?: boolean;
}

// Base button styles
const baseStyles: React.CSSProperties = {
  padding: '1rem',
  fontFamily: 'var(--font-taskor, system-ui), sans-serif',
  fontWeight: 600,
  fontSize: '1rem',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'all 0.2s',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
};

// Variant-specific styles
const variantStyles: Record<string, React.CSSProperties> = {
  gold: {
    background: 'linear-gradient(135deg, #ffd700, #e6c200)',
    color: '#2a2a2a',
  },
  cyber: {
    background: 'rgba(255, 215, 0, 0.2)',
    border: '2px solid #ffd700',
    color: '#ffd700',
  },
};

const disabledStyles: React.CSSProperties = {
  opacity: 0.7,
  cursor: 'not-allowed',
};

const spinnerStyles: React.CSSProperties = {
  width: '20px',
  height: '20px',
  border: '2px solid rgba(255, 255, 255, 0.3)',
  borderTopColor: 'currentColor',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
};

/**
 * FormButton - Styled submit button for forms
 *
 * Variants:
 * - gold: Solid gold gradient background (default, for modals)
 * - cyber: Transparent with gold border (for cyber/portal forms)
 *
 * @example
 * <FormButton isLoading={isSubmitting} loadingText="Submitting...">
 *   Submit
 * </FormButton>
 */
export function FormButton({
  variant = 'gold',
  isLoading = false,
  loadingText = 'Loading...',
  fullWidth = true,
  disabled,
  children,
  style,
  ...props
}: FormButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <>
      {/* Inject keyframes for spinner */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <button
        type="submit"
        disabled={isDisabled}
        style={{
          ...baseStyles,
          ...variantStyles[variant],
          ...(fullWidth ? { width: '100%' } : {}),
          ...(isDisabled ? disabledStyles : {}),
          ...style,
        }}
        {...props}
      >
        {isLoading ? (
          <>
            <span style={spinnerStyles} />
            {loadingText}
          </>
        ) : (
          children
        )}
      </button>
    </>
  );
}

export default FormButton;
