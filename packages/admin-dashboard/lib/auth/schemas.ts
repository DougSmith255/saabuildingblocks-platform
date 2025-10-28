/**
 * Zod Validation Schemas
 * Authentication API - Phase 1: Agent Portal
 *
 * Input validation schemas for authentication endpoints
 */

import { z } from 'zod';

/**
 * Login Request Schema
 * Accepts either email or username as identifier
 */
export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Email or username is required')
    .max(255, 'Identifier is too long'),
  password: z
    .string()
    .min(1, 'Password is required'),
  rememberMe: z
    .boolean()
    .optional()
    .default(false),
});

export type LoginRequest = z.infer<typeof loginSchema>;

/**
 * Legacy Login Request Schema (for backward compatibility)
 * @deprecated Use loginSchema with identifier instead
 */
export const loginSchemaLegacy = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .min(1, 'Email is required'),
  password: z
    .string()
    .min(1, 'Password is required'),
  rememberMe: z
    .boolean()
    .optional()
    .default(false),
});

/**
 * Refresh Token Request Schema
 * Token comes from cookie, but we validate the request
 */
export const refreshTokenSchema = z.object({
  // No body needed - token is in HttpOnly cookie
});

/**
 * Change Password Schema
 */
export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(12, 'Password must be at least 12 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

export type ChangePasswordRequest = z.infer<typeof changePasswordSchema>;

/**
 * Login Response Schema
 */
export const loginResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.object({
    user: z.object({
      id: z.string().uuid(),
      username: z.string(),
      email: z.string().email(),
      fullName: z.string().optional(),
      role: z.enum(['user', 'agent', 'admin', 'super_admin']),
      emailVerified: z.boolean(),
      lastLoginAt: z.string().datetime(),
    }),
    accessToken: z.string(),
    refreshToken: z.string().optional(), // Not returned in body, set as cookie
    expiresIn: z.number(),
  }).optional(),
  error: z.string().optional(),
  remainingAttempts: z.number().optional(),
});

/**
 * Refresh Response Schema
 */
export const refreshResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    accessToken: z.string(),
    expiresIn: z.number(),
  }).optional(),
  error: z.string().optional(),
});

/**
 * Error Response Schema
 */
export const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  message: z.string(),
  details: z.record(z.string(), z.any()).optional(),
  timestamp: z.string().datetime().optional(),
  requestId: z.string().optional(),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;

/**
 * User Info Response Schema (for /api/auth/me)
 */
export const userInfoSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  email: z.string().email(),
  fullName: z.string().optional(),
  displayName: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  bio: z.string().optional(),
  role: z.enum(['user', 'agent', 'admin', 'super_admin']),
  permissions: z.array(z.string()).optional(),
  emailVerified: z.boolean(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  lastLoginAt: z.string().datetime().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type UserInfo = z.infer<typeof userInfoSchema>;

/**
 * Validate request with Zod schema
 * Returns parsed data or throws validation error
 */
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  try {
    const parsed = schema.parse(data);
    return { success: true, data: parsed };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}

/**
 * Format Zod errors for API response
 */
export function formatZodErrors(errors: z.ZodError): ErrorResponse {
  const firstError = errors.issues[0];

  return {
    success: false,
    error: 'VALIDATION_ERROR',
    message: firstError?.message || 'Validation failed',
    details: {
      field: firstError?.path.join('.'),
      code: firstError?.code,
      errors: errors.issues.map(err => ({
        path: err.path.join('.'),
        message: err.message,
      })),
    },
    timestamp: new Date().toISOString(),
  };
}
