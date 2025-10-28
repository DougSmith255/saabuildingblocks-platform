/**
 * Activation & Signup Validation Schemas
 */

import { z } from 'zod';

/**
 * Username validation rules
 */
export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must not exceed 30 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores')
  .regex(/^[a-zA-Z]/, 'Username must start with a letter');

/**
 * Password validation rules
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must not exceed 128 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

/**
 * Signup/Activation request schema
 */
export const activationSchema = z.object({
  token: z.string().min(1, 'Activation token is required'),
  username: usernameSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

/**
 * Username check schema
 */
export const usernameCheckSchema = z.object({
  username: usernameSchema,
});

/**
 * Calculate password strength (0-4)
 */
export function calculatePasswordStrength(password: string): number {
  let strength = 0;

  // Length check
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;

  // Character diversity
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  return Math.min(strength, 4);
}

/**
 * Get password strength label
 */
export function getPasswordStrengthLabel(strength: number): string {
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  return labels[strength] || 'Very Weak';
}

/**
 * Get password strength color
 */
export function getPasswordStrengthColor(strength: number): string {
  const colors = ['#ef4444', '#f59e0b', '#eab308', '#84cc16', '#22c55e'];
  return colors[strength] || '#ef4444';
}

/**
 * Format Zod validation errors
 */
export function formatZodErrors(error: z.ZodError) {
  return {
    success: false,
    error: 'VALIDATION_ERROR',
    message: 'Validation failed',
    errors: error.issues.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    })),
  };
}
