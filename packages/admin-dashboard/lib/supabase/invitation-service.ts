/**
 * Invitation Service - Database Operations
 *
 * Service layer for invitation management with Supabase
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { createHash, randomBytes } from 'crypto';

/**
 * Invitation database record
 */
export interface Invitation {
  id: string;
  user_id: string;
  email: string;
  token: string;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  expires_at: string;
  sent_at: string | null;
  accepted_at: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
}

/**
 * User record (for invitation context)
 */
export interface InvitationUser {
  id: string;
  email: string;
  name: string;
  username: string;
  role: string;
  status: string;
}

/**
 * Generate a secure invitation token using SHA-256
 */
export function generateInvitationToken(): string {
  // Generate 32 random bytes (256 bits)
  const randomToken = randomBytes(32);

  // Hash with SHA-256 to create a 64-character hex string
  const hash = createHash('sha256')
    .update(randomToken)
    .digest('hex');

  return hash;
}

/**
 * Create a new invitation
 */
export async function createInvitation(
  supabase: SupabaseClient,
  data: {
    userId: string;
    email: string;
    expiresInHours: number;
    createdBy: string;
  }
): Promise<{ data: Invitation | null; error: Error | null }> {
  try {
    const token = generateInvitationToken();
    const expiresAt = new Date(Date.now() + data.expiresInHours * 60 * 60 * 1000);
    const now = new Date().toISOString();

    // Store hashed token in database
    const tokenHash = hashToken(token);

    const { data: invitation, error } = await supabase
      .from('user_invitations')
      .insert({
        user_id: data.userId,
        email: data.email,
        token: tokenHash,
        status: 'pending',
        expires_at: expiresAt.toISOString(),
        sent_at: now,
        created_at: now,
        updated_at: now,
        created_by: data.createdBy,
      })
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    // Return invitation with original unhashed token for email sending
    return { data: { ...invitation, token }, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

/**
 * Get invitation by ID
 */
export async function getInvitationById(
  supabase: SupabaseClient,
  id: string
): Promise<{ data: Invitation | null; error: Error | null }> {
  try {
    const { data: invitation, error } = await supabase
      .from('user_invitations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: invitation, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

/**
 * Hash a token using SHA-256
 */
export function hashToken(token: string): string {
  return createHash('sha256')
    .update(token)
    .digest('hex');
}

/**
 * Get invitation by token (hashes token first)
 */
export async function getInvitationByToken(
  supabase: SupabaseClient,
  token: string
): Promise<{ data: Invitation | null; error: Error | null }> {
  try {
    // Hash the token for lookup
    const tokenHash = hashToken(token);

    const { data: invitation, error } = await supabase
      .from('user_invitations')
      .select('*')
      .eq('token', tokenHash)
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: invitation, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

/**
 * List invitations with optional filters
 */
export async function listInvitations(
  supabase: SupabaseClient,
  filters: {
    status?: string;
    email?: string;
    limit?: number;
    offset?: number;
  }
): Promise<{ data: Invitation[]; count: number; error: Error | null }> {
  try {
    let query = supabase
      .from('user_invitations')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.email) {
      query = query.ilike('email', `%${filters.email}%`);
    }

    // Apply pagination
    const limit = filters.limit || 50;
    const offset = filters.offset || 0;
    query = query.range(offset, offset + limit - 1);

    const { data: invitations, error, count } = await query;

    if (error) {
      return { data: [], count: 0, error: new Error(error.message) };
    }

    return { data: invitations || [], count: count || 0, error: null };
  } catch (error) {
    return {
      data: [],
      count: 0,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

/**
 * Update invitation status
 */
export async function updateInvitationStatus(
  supabase: SupabaseClient,
  id: string,
  status: 'pending' | 'accepted' | 'expired' | 'cancelled',
  additionalData?: Partial<Invitation>
): Promise<{ data: Invitation | null; error: Error | null }> {
  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
      ...additionalData,
    };

    const { data: invitation, error } = await supabase
      .from('user_invitations')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: invitation, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

/**
 * Delete invitation
 */
export async function deleteInvitation(
  supabase: SupabaseClient,
  id: string
): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabase
      .from('user_invitations')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: new Error(error.message) };
    }

    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

/**
 * Check if invitation is valid (not expired, not used, status is pending)
 */
export function isInvitationValid(invitation: Invitation): {
  valid: boolean;
  reason?: string;
} {
  // Check status
  if (invitation.status !== 'pending') {
    return {
      valid: false,
      reason: `Invitation is ${invitation.status}`,
    };
  }

  // Check expiration
  const now = new Date();
  const expiresAt = new Date(invitation.expires_at);

  if (now > expiresAt) {
    return {
      valid: false,
      reason: 'Invitation has expired',
    };
  }

  return { valid: true };
}

/**
 * Get user by ID
 */
export async function getUserById(
  supabase: SupabaseClient,
  userId: string
): Promise<{ data: InvitationUser | null; error: Error | null }> {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, username, role, status')
      .eq('id', userId)
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: user, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

/**
 * Create audit log entry
 */
export async function createAuditLog(
  supabase: SupabaseClient,
  data: {
    userId: string;
    action: string;
    resourceType: string;
    resourceId: string;
    details?: any;
    ipAddress?: string;
    userAgent?: string;
  }
): Promise<void> {
  try {
    const { error } = await supabase.from('audit_logs').insert({
      user_id: data.userId,
      event_type: data.action,
      resource_type: data.resourceType,
      resource_id: data.resourceId,
      event_data: data.details || {},
      ip_address: data.ipAddress,
      user_agent: data.userAgent,
      severity: 'info',
      created_at: new Date().toISOString(),
    });

    if (error) {
    }
  } catch (error) {
  }
}
