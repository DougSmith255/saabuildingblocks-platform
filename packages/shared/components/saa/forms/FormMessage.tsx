'use client';

import React from 'react';

export interface FormMessageProps {
  /** Message type */
  type: 'success' | 'error';
  /** Message content */
  children: React.ReactNode;
}

const baseStyles: React.CSSProperties = {
  marginTop: '1rem',
  padding: '0.75rem',
  borderRadius: '8px',
  textAlign: 'center',
  fontSize: '0.9rem',
};

const typeStyles: Record<string, React.CSSProperties> = {
  success: {
    background: 'rgba(0, 255, 136, 0.1)',
    color: '#00ff88',
  },
  error: {
    background: 'rgba(255, 68, 68, 0.1)',
    color: '#ff4444',
  },
};

/**
 * FormMessage - Success/error message display for forms
 *
 * @example
 * {message && (
 *   <FormMessage type={message.type}>{message.text}</FormMessage>
 * )}
 */
export function FormMessage({ type, children }: FormMessageProps) {
  return (
    <div style={{ ...baseStyles, ...typeStyles[type] }}>
      {children}
    </div>
  );
}

export default FormMessage;
