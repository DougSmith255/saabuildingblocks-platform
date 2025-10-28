/**
 * Authentication Types
 * Phase 1: Agent Portal Authentication
 */

export interface User {
  id: string;
  email: string;
  username: string;
  role: 'admin' | 'user' | 'viewer';
  first_name?: string;
  last_name?: string;
  fullName?: string; // Computed from first_name + last_name
  full_name?: string; // Keep for backward compatibility
  avatar_url?: string;
  status: 'active' | 'inactive' | 'pending';
  isFirstLogin?: boolean;
  emailVerificationPending?: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  emailOrUsername: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

export interface TokenPayload {
  sub: string; // user ID
  email: string;
  username: string;
  role: string;
  exp: number; // expiration timestamp
  iat: number; // issued at timestamp
}

export interface RefreshTokenResponse {
  access_token: string;
  expires_in: number;
}
