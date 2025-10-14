/**
 * Invitation Management Types
 * Used across Master Controller invitation system
 */

export type InvitationStatus = 'pending' | 'sent' | 'accepted' | 'expired' | 'cancelled';

/**
 * Invitation database record (snake_case from backend)
 */
export interface InvitationDBRecord {
  id: string;
  user_id: string;
  email: string;
  token: string;
  status: InvitationStatus;
  expires_at: string;
  sent_at: string | null;
  accepted_at: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
}

/**
 * User data embedded in invitation response
 */
export interface InvitationUser {
  id: string;
  email: string;
  name: string;
  username: string;
  role: string;
  status: string;
}

/**
 * Enriched invitation (returned from API)
 */
export interface Invitation {
  id: string;
  user_id: string;
  email: string;
  token: string;
  status: InvitationStatus;
  expires_at: string;
  sent_at: string | null;
  accepted_at: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
  user: InvitationUser | null;
}

/**
 * Invitation statistics
 */
export interface InvitationStats {
  total: number;
  pending: number;
  sent: number;
  accepted: number;
  expired: number;
  cancelled: number;
}

/**
 * Request to send a new invitation
 */
export interface SendInvitationRequest {
  email: string;
  name: string;
  username?: string;
  role: string;
  expiresInHours: number;
  message?: string;
}

/**
 * Filter options for listing invitations
 */
export interface InvitationFilters {
  status?: InvitationStatus | 'all';
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * API response for listing invitations
 */
export interface InvitationsListResponse {
  success: boolean;
  data: Invitation[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

/**
 * API response for creating an invitation
 */
export interface CreateInvitationResponse {
  success: boolean;
  data: {
    id: string;
    email: string;
    status: InvitationStatus;
    expiresAt: string;
    user: InvitationUser;
  };
  message: string;
}
