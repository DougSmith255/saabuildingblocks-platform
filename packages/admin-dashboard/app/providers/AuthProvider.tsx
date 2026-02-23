'use client';

/**
 * Authentication Provider
 * Phase 1: Agent Portal Authentication
 *
 * Manages authentication state and provides auth functions to entire app
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User, AuthState, LoginCredentials, AuthContextType } from '@/app/types/auth';
import {
  getAccessToken,
  setAccessToken,
  clearTokens,
  refreshAccessToken,
  setupTokenRefresh,
  isTokenExpired,
  decodeToken,
} from '@/lib/auth/tokens';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  /**
   * Fetch user data from API using access token
   */
  const fetchUser = useCallback(async (token: string): Promise<User | null> => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error('Failed to fetch user:', response.status);
        return null;
      }

      const result = await response.json();
      // /api/auth/me returns { success, data: { user fields } }
      const userData = result.data || result;
      return userData as User;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }, []);

  /**
   * Initialize auth state on mount
   * First checks for in-memory access token (set during login on same page session)
   * Falls back to cookie-based refresh token for page reloads
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Set a maximum time for initialization (10 seconds)
        const initTimeout = setTimeout(() => {
          console.warn('Auth initialization timed out, proceeding with no session');
          setAuthState({ user: null, isAuthenticated: false, isLoading: false, error: null });
        }, 10000);

        let token: string | null = null;

        // First: check if we already have a valid access token in memory
        // This happens after login when navigating from /login to /agent-portal
        const existingToken = getAccessToken();
        if (existingToken && !isTokenExpired(existingToken)) {
          token = existingToken;
        } else {
          // Fall back: try to get new access token from refresh token cookie
          token = await refreshAccessToken();
        }

        clearTimeout(initTimeout);

        if (token) {
          const user = await fetchUser(token);

          if (user) {
            setAuthState({ user, isAuthenticated: true, isLoading: false, error: null });

            // Setup auto-refresh
            setupTokenRefresh(token, async (newToken) => {
              const updatedUser = await fetchUser(newToken);
              if (updatedUser) {
                setAuthState({ user: updatedUser, isAuthenticated: true, isLoading: false, error: null });
              }
            });

            return;
          }
        }

        // No valid session
        setAuthState({ user: null, isAuthenticated: false, isLoading: false, error: null });
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Always set loading to false even on error
        setAuthState({ user: null, isAuthenticated: false, isLoading: false, error: null });
      }
    };

    initAuth();
  }, [fetchUser]);

  /**
   * Login user with credentials
   */
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setAuthState((prev: AuthState) => ({ ...prev, isLoading: true, error: null }));

      try {
        // Transform emailOrUsername to identifier for API
        const apiCredentials = {
          identifier: credentials.emailOrUsername,
          password: credentials.password,
          rememberMe: credentials.rememberMe,
        };

        const response = await fetch('/api/auth/login', {
          method: 'POST',
          credentials: 'include', // Allow setting HttpOnly refresh token cookie
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(apiCredentials),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Login failed');
        }

        const data = await response.json();
        const { access_token, user } = data;

        // Store access token in memory
        setAccessToken(access_token);

        // Update auth state
        setAuthState({ user, isAuthenticated: true, isLoading: false, error: null });

        // Setup auto-refresh
        setupTokenRefresh(access_token, async (newToken) => {
          const updatedUser = await fetchUser(newToken);
          if (updatedUser) {
            setAuthState({ user: updatedUser, isAuthenticated: true, isLoading: false, error: null });
          }
        });

        // Redirect to agent portal after login
        router.push('/agent-portal');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        setAuthState({ user: null, isAuthenticated: false, isLoading: false, error: errorMessage });
        throw error;
      }
    },
    [router, fetchUser]
  );

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    setAuthState((prev: AuthState) => ({ ...prev, isLoading: true }));

    try {
      // Call logout API to clear refresh token cookie
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout API error:', error);
    }

    // Clear tokens and state
    clearTokens();
    setAuthState({ user: null, isAuthenticated: false, isLoading: false, error: null });

    // Redirect to login
    router.push('/login');
  }, [router]);

  /**
   * Refresh user data
   */
  const refreshUser = useCallback(async () => {
    const token = await refreshAccessToken();

    if (token) {
      const user = await fetchUser(token);
      if (user) {
        setAuthState({ user, isAuthenticated: true, isLoading: false, error: null });
      }
    } else {
      // Refresh failed, logout
      await logout();
    }
  }, [fetchUser, logout]);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setAuthState((prev: AuthState) => ({ ...prev, error: null }));
  }, []);

  const value: AuthContextType = {
    user: authState.user,
    isLoading: authState.isLoading,
    error: authState.error,
    login,
    logout,
    refreshUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 * Must be used within AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
