/**
 * useUserRole Hook
 *
 * Custom React hook to fetch and manage user role state
 * Uses API route to bypass RLS issues on users table
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Role, UserWithRole } from '@/lib/types/rbac';

interface UseUserRoleReturn {
  role: Role | null;
  user: UserWithRole | null;
  isLoading: boolean;
  error: string | null;
  isAdmin: boolean;
  isTeamMember: boolean;
  refetch: () => Promise<void>;
}

/**
 * Hook to get current user's role
 * Uses /api/auth/user-role endpoint which bypasses RLS
 */
export function useUserRole(): UseUserRoleReturn {
  const [role, setRole] = useState<Role | null>(null);
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserRole = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const supabase = createClient();

      // Get the current session to get the access token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        throw new Error('Not authenticated');
      }

      // Call API route with the access token
      const response = await fetch('/api/auth/user-role', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch user role');
      }

      const userData = result.data;

      const userWithRole: UserWithRole = {
        id: userData.id,
        email: userData.email,
        username: userData.email, // Use email as username fallback
        full_name: userData.fullName,
        display_name: userData.fullName,
        avatar_url: userData.profilePictureUrl,
        role: userData.role as Role,
        permissions: [],
        is_active: userData.isActive,
        created_at: new Date().toISOString(), // Not provided by API
        last_login_at: undefined,
        metadata: {},
      };

      setUser(userWithRole);
      setRole(userData.role as Role);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to fetch user role:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch user role');
      setRole(null);
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserRole();

    // Subscribe to auth state changes
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        fetchUserRole();
      } else if (event === 'SIGNED_OUT') {
        setRole(null);
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserRole]);

  return {
    role,
    user,
    isLoading,
    error,
    isAdmin: role === 'admin',
    isTeamMember: role === 'team_member',
    refetch: fetchUserRole,
  };
}
