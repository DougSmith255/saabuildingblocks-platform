/**
 * Invitation API Request Validation Schemas
 *
 * Zod schemas for validating invitation-related API requests
 */

import { z } from 'zod';

/**
 * Schema for creating a new invitation
 */
export const createInvitationSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .min(5, 'Email must be at least 5 characters')
    .max(255, 'Email must not exceed 255 characters'),
  name: z.string()
    .min(1, 'Name is required')
    .max(255, 'Name must not exceed 255 characters'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must not exceed 50 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
    .optional(),
  role: z.enum(['admin', 'user', 'agent']).default('user'),
  expiresInHours: z.number()
    .int('Expiration must be a whole number')
    .min(1, 'Expiration must be at least 1 hour')
    .max(168, 'Expiration cannot exceed 7 days (168 hours)')
    .default(24),
});

/**
 * Schema for updating an invitation
 */
export const updateInvitationSchema = z.object({
  action: z.enum(['resend', 'cancel'], {
    message: 'Action must be either "resend" or "cancel"',
  }),
});

/**
 * Schema for accepting an invitation
 */
export const acceptInvitationSchema = z.object({
  token: z.string()
    .min(1, 'Token is required')
    .length(64, 'Invalid token format'),
  first_name: z.string()
    .min(1, 'First name is required')
    .max(100, 'First name must not exceed 100 characters'),
  last_name: z.string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must not exceed 100 characters'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must not exceed 50 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
    .optional(),
});

/**
 * Schema for listing invitations with filters
 */
export const listInvitationsSchema = z.object({
  status: z.enum(['pending', 'accepted', 'expired', 'cancelled']).optional(),
  email: z.string().email().optional(),
  limit: z.coerce.number()
    .int('Limit must be a whole number')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .default(50),
  offset: z.coerce.number()
    .int('Offset must be a whole number')
    .min(0, 'Offset cannot be negative')
    .default(0),
});

/**
 * Schema for validating invitation token
 */
export const validateInvitationTokenSchema = z.object({
  token: z.string()
    .min(1, 'Token is required')
    .length(64, 'Token must be exactly 64 characters')
    .regex(/^[a-f0-9]{64}$/i, 'Token must be a valid hexadecimal string'),
});

/**
 * Type exports for use in API routes
 */
export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;
export type UpdateInvitationInput = z.infer<typeof updateInvitationSchema>;
export type AcceptInvitationInput = z.infer<typeof acceptInvitationSchema>;
export type ListInvitationsInput = z.infer<typeof listInvitationsSchema>;
export type ValidateInvitationTokenInput = z.infer<typeof validateInvitationTokenSchema>;
