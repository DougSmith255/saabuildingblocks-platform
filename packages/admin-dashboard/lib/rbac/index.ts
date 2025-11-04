/**
 * RBAC Module - Barrel Export
 *
 * Centralized exports for role-based access control utilities
 */

// Types
export * from '@/lib/types/rbac';

// Hooks
export { useUserRole } from './useUserRole';

// Components
export { RoleBadge } from './RoleBadge';
export type { RoleBadgeProps } from './RoleBadge';

export { PermissionGuard, withPermission } from './PermissionGuard';

export { PermissionTooltip } from './PermissionTooltip';
