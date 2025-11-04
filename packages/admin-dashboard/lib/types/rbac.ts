/**
 * Role-Based Access Control (RBAC) Type Definitions
 *
 * Defines types for the two-tier role system:
 * - admin: Full access to all features
 * - team_member: Read-only Master Controller, no Token Vault access
 */

// ========================================
// Core Role Types
// ========================================

/**
 * User roles in the system
 * - admin: Full access including Token Vault
 * - team_member: Limited access, read-only Master Controller
 */
export type Role = 'admin' | 'team_member';

/**
 * Permissions that can be granted to users
 * Future: May expand to granular permissions
 */
export type Permission =
  | 'token_vault_access'
  | 'master_controller_edit'
  | 'master_controller_view'
  | 'component_edit'
  | 'template_create'
  | 'template_edit'
  | 'user_management'
  | 'audit_log_view';

// ========================================
// User Types
// ========================================

/**
 * Extended user type with role and permissions
 */
export interface UserWithRole {
  id: string;
  email: string;
  username?: string;
  full_name?: string;
  display_name?: string;
  avatar_url?: string;
  role: Role;
  permissions?: Permission[];
  is_active: boolean;
  created_at: string;
  last_login_at?: string;
  metadata?: Record<string, any>;
}

/**
 * User profile data (subset for display)
 */
export interface UserProfile {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
  role: Role;
}

// ========================================
// Role Change Types
// ========================================

/**
 * Role change audit log entry
 */
export interface RoleChangeLog {
  id: string;
  user_id: string;
  old_role: Role;
  new_role: Role;
  changed_by: string;
  reason?: string;
  ip_address?: string;
  timestamp: string;
}

/**
 * Request to change user role
 */
export interface ChangeRoleRequest {
  user_id: string;
  new_role: Role;
  reason?: string;
}

/**
 * Response from role change operation
 */
export interface ChangeRoleResponse {
  success: boolean;
  error?: 'PERMISSION_DENIED' | 'INVALID_ROLE' | 'USER_NOT_FOUND';
  message?: string;
  data?: {
    user_id: string;
    old_role: Role;
    new_role: Role;
  };
}

// ========================================
// Permission Checking Utilities
// ========================================

/**
 * Permission map: which permissions each role has
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    'token_vault_access',
    'master_controller_edit',
    'master_controller_view',
    'component_edit',
    'template_create',
    'template_edit',
    'user_management',
    'audit_log_view',
  ],
  team_member: [
    'master_controller_view',
  ],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

/**
 * Check if user is admin
 */
export function isAdmin(role: Role): boolean {
  return role === 'admin';
}

/**
 * Check if user is team member
 */
export function isTeamMember(role: Role): boolean {
  return role === 'team_member';
}

/**
 * Check if role can access Token Vault
 */
export function canAccessTokenVault(role: Role): boolean {
  return hasPermission(role, 'token_vault_access');
}

/**
 * Check if role can edit Master Controller
 */
export function canEditMasterController(role: Role): boolean {
  return hasPermission(role, 'master_controller_edit');
}

/**
 * Check if role can view Master Controller
 */
export function canViewMasterController(role: Role): boolean {
  return hasPermission(role, 'master_controller_view');
}

/**
 * Check if role can manage users
 */
export function canManageUsers(role: Role): boolean {
  return hasPermission(role, 'user_management');
}

/**
 * Get display name for role
 */
export function getRoleDisplayName(role: Role): string {
  const displayNames: Record<Role, string> = {
    admin: 'Admin',
    team_member: 'Team Member',
  };
  return displayNames[role];
}

/**
 * Get color for role badge
 */
export function getRoleBadgeColor(role: Role): string {
  const colors: Record<Role, string> = {
    admin: '#ffd700', // Gold
    team_member: '#00ff88', // Accent green
  };
  return colors[role];
}

/**
 * Get icon for role (lucide-react icon name)
 */
export function getRoleIcon(role: Role): string {
  const icons: Record<Role, string> = {
    admin: 'Shield',
    team_member: 'User',
  };
  return icons[role];
}

// ========================================
// Error Messages
// ========================================

/**
 * Permission error messages
 */
export const PERMISSION_ERRORS = {
  TOKEN_VAULT_ADMIN_ONLY: 'Token Vault requires admin privileges. Please contact an administrator for access.',
  MASTER_CONTROLLER_READ_ONLY: 'You have read-only access to Master Controller. Contact an admin to make changes.',
  USER_MANAGEMENT_ADMIN_ONLY: 'User management is only available to administrators.',
  AUDIT_LOG_ADMIN_ONLY: 'Audit logs are only accessible to administrators.',
} as const;

/**
 * Permission success messages
 */
export const PERMISSION_MESSAGES = {
  ROLE_CHANGED: 'User role has been successfully updated.',
  ACCESS_GRANTED: 'Access granted.',
  ADMIN_FULL_ACCESS: 'You have full admin access to all features.',
} as const;

// ========================================
// UI Helper Types
// ========================================

/**
 * Props for permission-aware components
 */
export interface PermissionAwareProps {
  role: Role;
  requiredPermission: Permission;
  showTooltip?: boolean;
  tooltipMessage?: string;
  fallbackComponent?: React.ReactNode;
}

/**
 * Role badge props
 */
export interface RoleBadgeProps {
  role: Role;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

/**
 * Permission tooltip props
 */
export interface PermissionTooltipProps {
  permission: Permission;
  userRole: Role;
  children: React.ReactNode;
}
