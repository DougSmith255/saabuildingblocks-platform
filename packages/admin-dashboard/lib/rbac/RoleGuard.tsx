/**
 * Role Guard Component
 *
 * Wraps content that should only be visible to users with specific roles.
 * Shows fallback content for users without required permissions.
 */

'use client';

import { useEffect, useState } from 'react';
import { getUserRole, type UserRole } from './roleCheck';

interface RoleGuardProps {
  /**
   * Required role to view the content
   */
  requiredRole: UserRole | UserRole[];

  /**
   * Content to show when user has required role
   */
  children: React.ReactNode;

  /**
   * Fallback content to show when user doesn't have required role
   * If not provided, shows a default access denied message
   */
  fallback?: React.ReactNode;

  /**
   * Loading content to show while checking role
   */
  loading?: React.ReactNode;

  /**
   * Callback when access is denied
   */
  onAccessDenied?: (userRole: UserRole | null) => void;
}

/**
 * Default access denied component
 */
function DefaultAccessDenied({ requiredRole }: { requiredRole: string }) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-8">
      <div className="text-center max-w-md">
        <div className="mb-4">
          <svg
            className="w-16 h-16 mx-auto text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-[#e5e4dd] mb-2">
          Access Denied
        </h2>
        <p className="text-[#dcdbd5] mb-4">
          This feature requires <span className="font-semibold">{requiredRole}</span> role.
        </p>
        <p className="text-sm text-[#dcdbd5]/70">
          Contact your administrator if you need access to this feature.
        </p>
      </div>
    </div>
  );
}

/**
 * Default loading component
 */
function DefaultLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00ff88]"></div>
        <p className="mt-4 text-[#dcdbd5]">Checking permissions...</p>
      </div>
    </div>
  );
}

/**
 * RoleGuard Component
 *
 * Usage:
 * ```tsx
 * <RoleGuard requiredRole="admin">
 *   <AdminOnlyContent />
 * </RoleGuard>
 * ```
 *
 * Or with multiple roles:
 * ```tsx
 * <RoleGuard requiredRole={['admin', 'team_member']}>
 *   <SharedContent />
 * </RoleGuard>
 * ```
 */
export function RoleGuard({
  requiredRole,
  children,
  fallback,
  loading,
  onAccessDenied
}: RoleGuardProps) {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    async function checkRole() {
      setIsLoading(true);
      try {
        const role = await getUserRole();
        setUserRole(role);

        // Check if user has required role
        const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        const access = role !== null && requiredRoles.includes(role);
        setHasAccess(access);

        // Call onAccessDenied callback if access is denied
        if (!access && onAccessDenied) {
          onAccessDenied(role);
        }
      } catch (error) {
        console.error('Error checking role:', error);
        setHasAccess(false);
        if (onAccessDenied) {
          onAccessDenied(null);
        }
      } finally {
        setIsLoading(false);
      }
    }

    checkRole();
  }, [requiredRole, onAccessDenied]);

  // Show loading state
  if (isLoading) {
    return <>{loading || <DefaultLoading />}</>;
  }

  // Show content if user has access
  if (hasAccess) {
    return <>{children}</>;
  }

  // Show fallback or default access denied
  const requiredRoleDisplay = Array.isArray(requiredRole)
    ? requiredRole.join(' or ')
    : requiredRole;

  return (
    <>
      {fallback || <DefaultAccessDenied requiredRole={requiredRoleDisplay} />}
    </>
  );
}

/**
 * Admin-only guard (convenience wrapper)
 */
export function AdminOnly({
  children,
  fallback,
  loading
}: Omit<RoleGuardProps, 'requiredRole'>) {
  return (
    <RoleGuard
      requiredRole="admin"
      fallback={fallback}
      loading={loading}
    >
      {children}
    </RoleGuard>
  );
}

/**
 * Hook to check if user has required role
 */
export function useRole() {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRole() {
      setIsLoading(true);
      try {
        const role = await getUserRole();
        setUserRole(role);
      } catch (error) {
        console.error('Error fetching role:', error);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRole();
  }, []);

  return {
    role: userRole,
    isLoading,
    isAdmin: userRole === 'admin',
    isTeamMember: userRole === 'team_member'
  };
}
