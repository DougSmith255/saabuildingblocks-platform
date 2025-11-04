/**
 * useUserRole Hook
 *
 * Custom React hook to fetch and manage user role state
 * Integrates with Supabase auth to get current user's role
 */

'use client';

import { useEffect, useState } from 'react';
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
 */
export function useUserRole(): UseUserRoleReturn {
  const [role, setRole] = useState<Role | null>(null);
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserRole = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const supabase = createClient();

      // Get authenticated user
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

      if (authError || !authUser) {
        throw new Error('Not authenticated');
      }

      // Get user role from users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (userError) {
        throw new Error('Failed to fetch user role');
      }

      if (!userData) {
        throw new Error('User not found');
      }

      const userWithRole: UserWithRole = {
        id: userData.id,
        email: userData.email,
        username: userData.username,
        full_name: userData.full_name,
        display_name: userData.display_name,
        avatar_url: userData.avatar_url,
        role: userData.role as Role,
        permissions: userData.permissions,
        is_active: userData.is_active,
        created_at: userData.created_at,
        last_login_at: userData.last_login_at,
        metadata: userData.metadata,
      };

      setUser(userWithRole);
      setRole(userData.role as Role);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to fetch user role:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch user role');
      setIsLoading(false);
    }
  };

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
  }, []);

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
