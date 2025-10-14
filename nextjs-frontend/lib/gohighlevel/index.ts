/**
 * GoHighLevel Integration
 * Barrel export for all GHL services
 */

// Core service
export { GoHighLevelService, createGHLService, getGHLService } from './ghl-service';
export type {
  ContactSyncResult,
  TagUpdateResult,
  InvitationSyncData,
  ActivationSyncData,
} from './ghl-service';

// Contact sync
export {
  ContactSyncService,
  getContactSyncService,
  syncInvitationSent,
  syncInvitationAccepted,
} from './contact-sync';
export type {
  SyncResult,
  UserData,
  InvitationEvent,
  ActivationEvent,
} from './contact-sync';

// Re-export client types for convenience
export type {
  GHLContact,
  GHLApiResponse,
  CreateContactRequest,
} from '@/lib/gohighlevel-client';

export {
  GHLAPIError,
  GHLValidationError,
  GHLAuthError,
  GHLRateLimitError,
} from '@/lib/gohighlevel-client';
