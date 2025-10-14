'use client';

/**
 * useRequireAuth Hook
 * Phase 1: Agent Portal Authentication
 *
 * Requires authentication for a component/page
 * Redirects to /login if not authenticated
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';

export interface UseRequireAuthOptions {
  redirectTo?: string;
  requiredRole?: 'admin' | 'user' | 'viewer';
}

/**
 * Hook to require authentication
 * @param options - Configuration options
 * @returns Auth context
 */
export function useRequireAuth(options: UseRequireAuthOptions = {}) {
  const { redirectTo = '/login', requiredRole } = options;
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for loading to complete
    if (auth.isLoading) return;

    // Redirect if not authenticated
    if (!auth.user) {
      const currentPath = window.location.pathname;
      router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    // Check role requirement if specified
    if (requiredRole && auth.user.role !== requiredRole) {
      // User doesn't have required role
      console.warn(`User role "${auth.user.role}" does not match required role "${requiredRole}"`);
      router.push('/unauthorized');
    }
  }, [auth.user, auth.isLoading, router, redirectTo, requiredRole]);

  return auth;
}
