'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  fullName?: string;
  role: 'admin' | 'user';
  profile_picture_url?: string;
  status: 'active' | 'pending' | 'suspended';
  gender?: 'male' | 'female' | null;
  isLeader?: boolean | null;
  state?: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || 'https://staging.smartagentalliance.com';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedUser = localStorage.getItem('agent_portal_user');
        const accessToken = localStorage.getItem('agent_portal_token');

        if (storedUser && accessToken) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Error checking session:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${AUTH_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed');
        return false;
      }

      // Store tokens and user data
      const userData: User = {
        id: data.data.user.id,
        email: data.data.user.email,
        username: data.data.user.username,
        first_name: data.data.user.first_name,
        last_name: data.data.user.last_name,
        fullName: data.data.user.fullName || `${data.data.user.first_name || ''} ${data.data.user.last_name || ''}`.trim(),
        role: data.data.user.role,
        profile_picture_url: data.data.user.profile_picture_url,
        status: 'active',
        state: data.data.user.state || null,
      };

      localStorage.setItem('agent_portal_user', JSON.stringify(userData));
      localStorage.setItem('agent_portal_token', data.data.accessToken);

      setUser(userData);
      return true;
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Login error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('agent_portal_user');
    localStorage.removeItem('agent_portal_token');
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('agent_portal_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
