/**
 * Username Recovery Validation Schema
 * Authentication API - Username Recovery Feature
 *
 * Zod schemas for username recovery flow
 */

import { z } from 'zod';

/**
 * Username Recovery Request Schema
 * Simple email input for username reminder
 */
export const usernameRecoveryRequestSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .min(1, 'Email is required')
    .max(255, 'Email must be less than 255 characters')
    .toLowerCase()
    .trim(),
});

export type UsernameRecoveryRequest = z.infer<typeof usernameRecoveryRequestSchema>;

/**
 * Username Recovery Response Schema
 */
export const usernameRecoveryResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  // Never indicate if email exists or not for security
  data: z.object({
    email: z.string().email(),
  }).optional(),
  error: z.string().optional(),
  resetAt: z.string().optional(), // When rate limit resets
});

export type UsernameRecoveryResponse = z.infer<typeof usernameRecoveryResponseSchema>;

/**
 * Mask email for audit logs
 * Examples:
 * - john.doe@example.com → j***@example.com
 * - a@test.com → a***@test.com
 * - admin@company.org → a***@company.org
 */
export function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@');

  if (!localPart || !domain) {
    return '***@***';
  }

  // Show first character only, mask the rest
  const maskedLocal = localPart.charAt(0) + '***';

  return `${maskedLocal}@${domain}`;
}

/**
 * Generic success message to prevent email enumeration
 */
export const GENERIC_SUCCESS_MESSAGE =
  'If an account exists with that email address, we have sent a username reminder. ' +
  'Please check your inbox and spam folder.';

/**
 * Generic error message (no details)
 */
export const GENERIC_ERROR_MESSAGE =
  'Unable to process your request at this time. Please try again later.';

/**
 * Rate limit configuration
 */
export const USERNAME_RECOVERY_RATE_LIMIT = {
  MAX_ATTEMPTS: 3,                    // 3 requests per window
  WINDOW_MS: 60 * 60 * 1000,          // 1 hour window
  IDENTIFIER_PREFIX: 'username-recovery:', // Key prefix
};
