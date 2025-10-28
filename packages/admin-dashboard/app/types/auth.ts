/**
 * Authentication Types
 */

export interface User {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: 'admin' | 'user';
  status: 'active' | 'invited' | 'pending_activation' | 'suspended';
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
  isFirstLogin?: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  username?: string;
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
  sub: string; // User ID
  email: string;
  username?: string;
  role?: string;
  exp: number; // Expiration timestamp
  iat: number; // Issued at timestamp
}
