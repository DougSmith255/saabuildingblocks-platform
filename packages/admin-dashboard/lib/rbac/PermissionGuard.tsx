/**
 * PermissionGuard Component
 *
 * Wrapper component that conditionally renders children based on user permissions
 * Shows fallback or nothing if user doesn't have required permission
 */

'use client';

import React from 'react';
import type { Permission } from '@/lib/types/rbac';
import { hasPermission } from '@/lib/types/rbac';
import { useUserRole } from './useUserRole';

interface PermissionGuardProps {
  permission: Permission;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function PermissionGuard({ permission, fallback = null, children }: PermissionGuardProps) {
  const { role, isLoading } = useUserRole();

  if (isLoading) {
    return null;
  }

  if (!role || !hasPermission(role, permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Higher-order component version
 */
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  permission: Permission,
  fallback?: React.ReactNode
) {
  return function PermissionWrappedComponent(props: P) {
    return (
      <PermissionGuard permission={permission} fallback={fallback}>
        <Component {...props} />
      </PermissionGuard>
    );
  };
}
