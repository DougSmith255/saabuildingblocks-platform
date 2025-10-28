/**
 * User Type Definitions
 *
 * Defines TypeScript interfaces for user-related data structures
 */

/**
 * User database record
 */
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string; // Computed field for backward compatibility
  username: string;
  password_hash?: string; // Only present in database queries, never returned to client
  role: 'admin' | 'user';
  status: 'invited' | 'pending_activation' | 'active' | 'suspended';
  is_active?: boolean;
  email_verified?: boolean;
  email_verified_at?: string;
  activation_token?: string;
  gohighlevel_contact_id?: string;
  created_at: string;
  updated_at: string;
  lastLogin?: string; // Last login timestamp
}

/**
 * User creation request (API)
 */
export interface CreateUserRequest {
  email: string;
  // Preferred: use first_name + last_name
  first_name?: string;
  last_name?: string;
  // Backward compatibility: accept full_name or name
  full_name?: string;
  name?: string;
  username?: string;
  password?: string;
  role?: 'admin' | 'user';
}

/**
 * User update request (API)
 */
export interface UpdateUserRequest {
  // Preferred: use first_name + last_name
  first_name?: string;
  last_name?: string;
  // Backward compatibility: accept full_name or name
  full_name?: string;
  name?: string;
  email?: string;
  username?: string;
  password?: string;
  role?: 'admin' | 'user';
  status?: 'invited' | 'pending_activation' | 'active' | 'suspended';
}

/**
 * User response (API)
 */
export interface UserResponse {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  username: string;
  role: 'admin' | 'user';
  status: 'invited' | 'pending_activation' | 'active' | 'suspended';
  is_active?: boolean;
  email_verified?: boolean;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
  lastLogin?: string; // Last login timestamp
}

/**
 * User invitation record
 */
export interface UserInvitation {
  id: string;
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string; // For backward compatibility
  token: string;
  status: 'pending' | 'accepted' | 'expired' | 'failed';
  expires_at: string;
  created_at: string;
  accepted_at?: string;
}

/**
 * Invitation email parameters
 */
export interface InvitationEmailParams {
  to: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  activationToken: string;
  inviterName?: string;
  role?: string;
  expiresInDays?: number;
}

/**
 * User activation request
 */
export interface ActivationRequest {
  token: string;
  username: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}
