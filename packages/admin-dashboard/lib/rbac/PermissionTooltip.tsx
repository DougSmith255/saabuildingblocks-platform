/**
 * PermissionTooltip Component
 *
 * Shows a tooltip explaining why a feature is disabled for users without permission
 * Wraps disabled buttons/controls to provide context
 */

'use client';

import React from 'react';
import type { Permission, Role } from '@/lib/types/rbac';
import { hasPermission, PERMISSION_ERRORS } from '@/lib/types/rbac';

interface PermissionTooltipProps {
  permission: Permission;
  userRole: Role;
  children: React.ReactNode;
  message?: string;
}

export function PermissionTooltip({ permission, userRole, children, message }: PermissionTooltipProps) {
  const hasAccess = hasPermission(userRole, permission);

  // If user has permission, just render children
  if (hasAccess) {
    return <>{children}</>;
  }

  // Get appropriate error message
  const getErrorMessage = (): string => {
    if (message) return message;

    switch (permission) {
      case 'token_vault_access':
        return PERMISSION_ERRORS.TOKEN_VAULT_ADMIN_ONLY;
      case 'master_controller_edit':
        return PERMISSION_ERRORS.MASTER_CONTROLLER_READ_ONLY;
      case 'user_management':
        return PERMISSION_ERRORS.USER_MANAGEMENT_ADMIN_ONLY;
      case 'audit_log_view':
        return PERMISSION_ERRORS.AUDIT_LOG_ADMIN_ONLY;
      default:
        return 'You do not have permission to access this feature.';
    }
  };

  return (
    <div className="group relative inline-block">
      {/* Wrapped content (disabled) */}
      <div className="opacity-50 cursor-not-allowed pointer-events-none">
        {children}
      </div>

      {/* Tooltip */}
      <div
        className="absolute z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap"
        style={{ maxWidth: '300px', whiteSpace: 'normal' }}
      >
        {getErrorMessage()}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900" />
      </div>
    </div>
  );
}
