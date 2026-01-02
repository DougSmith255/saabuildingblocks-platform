'use client';

import React from 'react';

export interface FormRowProps {
  /** Form groups to display in a row */
  children: React.ReactNode;
  /** Number of columns (default 2) */
  columns?: 2 | 3 | 4;
}

/**
 * FormRow - Horizontal row layout for form groups
 *
 * @example
 * <FormRow>
 *   <FormGroup label="First Name" htmlFor="firstName">
 *     <FormInput id="firstName" />
 *   </FormGroup>
 *   <FormGroup label="Last Name" htmlFor="lastName">
 *     <FormInput id="lastName" />
 *   </FormGroup>
 * </FormRow>
 */
export function FormRow({ children, columns = 2 }: FormRowProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '1rem',
      }}
    >
      {children}
    </div>
  );
}

export default FormRow;
