/**
 * Role-Based Access Control (RBAC) Utilities
 *
 * Provides client-side and server-side role checking utilities
 * for the two-tier role system (admin/team_member)
 */

import { createClient } from '@/lib/supabase/client';

export type UserRole = 'admin' | 'team_member';

export interface RoleCheckResult {
  hasAccess: boolean;
  role: UserRole | null;
  error?: string;
}

/**
 * Check if current user is an admin
 * Client-side only - use this in React components
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const supabase = createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return false;
    }

    // Call database function to check admin status
    const { data, error } = await supabase.rpc('is_admin');

    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }

    return data === true;
  } catch (error) {
    console.error('Error in isAdmin:', error);
    return false;
  }
}

/**
 * Check if current user has a specific role
 * Client-side only
 */
export async function hasRole(requiredRole: UserRole): Promise<boolean> {
  try {
    const supabase = createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return false;
    }

    // Call database function to check role
    const { data, error } = await supabase.rpc('has_role', {
      required_role: requiredRole
    });

    if (error) {
      console.error('Error checking role:', error);
      return false;
    }

    return data === true;
  } catch (error) {
    console.error('Error in hasRole:', error);
    return false;
  }
}

/**
 * Get current user's role
 * Client-side only
 */
export async function getUserRole(): Promise<UserRole | null> {
  try {
    const supabase = createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return null;
    }

    // Call database function to get role
    const { data, error } = await supabase.rpc('get_user_role');

    if (error) {
      console.error('Error getting user role:', error);
      return null;
    }

    return data as UserRole;
  } catch (error) {
    console.error('Error in getUserRole:', error);
    return null;
  }
}

/**
 * Check if user has access to Token Vault
 * Token Vault is admin-only
 */
export async function canAccessTokenVault(): Promise<RoleCheckResult> {
  const role = await getUserRole();
  const hasAccess = role === 'admin';

  return {
    hasAccess,
    role,
    error: hasAccess ? undefined : 'Token Vault access requires admin role'
  };
}

/**
 * Check if user can modify Master Controller settings
 * Only admins can modify, team members can view
 */
export async function canModifyMasterController(): Promise<RoleCheckResult> {
  const role = await getUserRole();
  const hasAccess = role === 'admin';

  return {
    hasAccess,
    role,
    error: hasAccess ? undefined : 'Modifying Master Controller requires admin role'
  };
}

/**
 * Check if user can view Master Controller settings
 * Both admins and team members can view
 */
export async function canViewMasterController(): Promise<RoleCheckResult> {
  const role = await getUserRole();
  const hasAccess = role !== null;

  return {
    hasAccess,
    role,
    error: hasAccess ? undefined : 'Authentication required'
  };
}

/**
 * Change a user's role (admin only)
 * Server-side only - use in API routes
 */
export async function changeUserRole(
  userId: string,
  newRole: UserRole,
  reason?: string
): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    const supabase = createClient();

    // Check if current user is admin
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin) {
      return {
        success: false,
        error: 'Only admins can change user roles'
      };
    }

    // Call database function to change role
    const { data, error } = await supabase.rpc('change_user_role', {
      p_user_id: userId,
      p_new_role: newRole,
      p_reason: reason
    });

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    if (data && typeof data === 'object' && 'success' in data) {
      return data;
    }

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error changing user role:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to change user role'
    };
  }
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    admin: 'Administrator',
    team_member: 'Team Member'
  };
  return roleNames[role];
}

/**
 * Get role description
 */
export function getRoleDescription(role: UserRole): string {
  const descriptions: Record<UserRole, string> = {
    admin: 'Full access to all features including Token Vault and settings management',
    team_member: 'Read-only access to Master Controller. No Token Vault access.'
  };
  return descriptions[role];
}

/**
 * Get role permissions
 */
export function getRolePermissions(role: UserRole): string[] {
  const permissions: Record<UserRole, string[]> = {
    admin: [
      'Full Token Vault access',
      'Modify Master Controller settings',
      'View Master Controller settings',
      'Manage user roles',
      'Access all features'
    ],
    team_member: [
      'View Master Controller settings',
      'Read-only access'
    ]
  };
  return permissions[role];
}
