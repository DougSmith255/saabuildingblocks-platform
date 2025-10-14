/**
 * Password Validation Schemas
 * Phase 3: Password Recovery
 *
 * Provides Zod schemas for password validation with comprehensive
 * security requirements and password strength checks.
 */

import { z } from 'zod';

/**
 * Password requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export const passwordRequirements = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true,
};

/**
 * Password strength validation schema
 */
export const passwordSchema = z
  .string()
  .min(passwordRequirements.minLength, `Password must be at least ${passwordRequirements.minLength} characters`)
  .max(passwordRequirements.maxLength, `Password must not exceed ${passwordRequirements.maxLength} characters`)
  .refine(
    (password) => /[A-Z]/.test(password),
    { message: 'Password must contain at least one uppercase letter' }
  )
  .refine(
    (password) => /[a-z]/.test(password),
    { message: 'Password must contain at least one lowercase letter' }
  )
  .refine(
    (password) => /[0-9]/.test(password),
    { message: 'Password must contain at least one number' }
  )
  .refine(
    (password) => /[^A-Za-z0-9]/.test(password),
    { message: 'Password must contain at least one special character' }
  );

/**
 * Password reset request schema
 */
export const passwordResetRequestSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Email is too long'),
});

/**
 * Password reset confirmation schema
 */
export const passwordResetConfirmSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

/**
 * Change password schema (for authenticated users)
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

/**
 * Email token verification schema
 */
export const tokenVerificationSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

/**
 * Validate password strength using zxcvbn
 * Returns a score from 0-4 and feedback
 */
export function validatePasswordStrength(password: string): {
  score: number;
  feedback: string[];
  warning: string;
} {
  // Dynamic import to avoid SSR issues
  let zxcvbn: any;
  try {
    zxcvbn = require('zxcvbn');
  } catch (error) {
    // Fallback if zxcvbn is not available
    return {
      score: 0,
      feedback: ['Password strength checker unavailable'],
      warning: '',
    };
  }

  const result = zxcvbn(password);

  return {
    score: result.score,
    feedback: result.feedback.suggestions || [],
    warning: result.feedback.warning || '',
  };
}

/**
 * Get password strength label
 */
export function getPasswordStrengthLabel(score: number): string {
  const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  return labels[score] || 'Unknown';
}

/**
 * Get password strength color
 */
export function getPasswordStrengthColor(score: number): string {
  const colors = [
    'bg-red-500',      // Very Weak
    'bg-orange-500',   // Weak
    'bg-yellow-500',   // Fair
    'bg-blue-500',     // Strong
    'bg-green-500',    // Very Strong
  ];
  return colors[score] || 'bg-gray-500';
}

/**
 * Format Zod validation errors
 */
export function formatZodErrors(error: z.ZodError): {
  success: false;
  error: string;
  message: string;
  errors: Record<string, string[]>;
} {
  const errors: Record<string, string[]> = {};

  error.errors.forEach((err) => {
    const path = err.path.join('.');
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(err.message);
  });

  return {
    success: false,
    error: 'VALIDATION_ERROR',
    message: 'Validation failed',
    errors,
  };
}

/**
 * Type exports for convenience
 */
export type PasswordResetRequest = z.infer<typeof passwordResetRequestSchema>;
export type PasswordResetConfirm = z.infer<typeof passwordResetConfirmSchema>;
export type ChangePassword = z.infer<typeof changePasswordSchema>;
export type TokenVerification = z.infer<typeof tokenVerificationSchema>;
