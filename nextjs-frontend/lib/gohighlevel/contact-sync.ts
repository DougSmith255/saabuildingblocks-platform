/**
 * Contact Sync Service
 * Bi-directional sync between Supabase and GoHighLevel
 *
 * Features:
 * - Automatic sync on invitation events
 * - Stores gohighlevel_contact_id in Supabase
 * - Error handling with detailed logging
 * - Retry logic for failed syncs
 * - Background sync for non-critical updates
 */

import { createClient } from '@supabase/supabase-js';
import { GoHighLevelService, InvitationSyncData, ActivationSyncData } from './ghl-service';

// ============================================================================
// Types
// ============================================================================

export interface SyncResult {
  success: boolean;
  contactId?: string;
  error?: string;
  synced: boolean;
}

export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  username?: string;
  phone?: string;
  gohighlevel_contact_id?: string;
}

export interface InvitationEvent {
  userId: string;
  email: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  invitationToken: string;
  status: 'pending' | 'sent' | 'failed';
}

export interface ActivationEvent {
  userId: string;
  email: string;
  username: string;
  gohighlevel_contact_id?: string;
}

// ============================================================================
// Contact Sync Service
// ============================================================================

export class ContactSyncService {
  private ghlService: GoHighLevelService;
  private supabase: ReturnType<typeof createClient<any>>;

  constructor() {
    this.ghlService = new GoHighLevelService();

    // Initialize Supabase client with service role key
    const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL'] || '';
    const supabaseKey = process.env['SUPABASE_SERVICE_ROLE_KEY'] || '';

    this.supabase = createClient<any>(supabaseUrl, supabaseKey);
  }

  // ==========================================================================
  // Invitation Flow Sync
  // ==========================================================================

  /**
   * Sync when invitation is sent
   * Creates/updates GHL contact and stores contact_id in Supabase
   */
  async syncInvitationSent(event: InvitationEvent): Promise<SyncResult> {
    try {
      // Sync to GoHighLevel with first and last name
      const syncData: InvitationSyncData = {
        userId: event.userId,
        email: event.email,
        firstName: event.firstName,
        lastName: event.lastName,
        phone: event.phone,
        invitationToken: event.invitationToken,
        invitationStatus: event.status === 'sent' ? 'sent' : 'pending',
      };

      const ghlResult = await this.ghlService.syncInvitationSent(syncData);

      if (!ghlResult.success) {
        return {
          success: false,
          error: ghlResult.error,
          synced: false,
        };
      }

      // Store contact_id in Supabase
      if (ghlResult.contactId) {
        const { error: updateError } = await this.supabase
          .from('users')
          .update({
            gohighlevel_contact_id: ghlResult.contactId,
            updated_at: new Date().toISOString(),
          })
          .eq('id', event.userId);

        if (updateError) {
          return {
            success: true, // GHL sync succeeded
            contactId: ghlResult.contactId,
            error: 'Failed to update Supabase',
            synced: true,
          };
        }

        // Also update user_invitations table
        await this.supabase
          .from('user_invitations')
          .update({
            gohighlevel_contact_id: ghlResult.contactId,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', event.userId);
      }

      return {
        success: true,
        contactId: ghlResult.contactId,
        synced: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        synced: false,
      };
    }
  }

  /**
   * Sync when invitation is accepted (user activates account)
   * Updates GHL contact with activation data
   */
  async syncInvitationAccepted(event: ActivationEvent): Promise<SyncResult> {
    try {
      // Get contact_id from user if not provided
      let contactId = event.gohighlevel_contact_id;

      if (!contactId) {
        const { data: user } = await this.supabase
          .from('users')
          .select('gohighlevel_contact_id')
          .eq('id', event.userId)
          .single();

        contactId = user?.gohighlevel_contact_id;
      }

      if (!contactId) {
        return {
          success: false,
          error: 'Contact ID not found',
          synced: false,
        };
      }

      // Sync to GoHighLevel
      const syncData: ActivationSyncData = {
        userId: event.userId,
        contactId,
        username: event.username,
        activatedAt: new Date().toISOString(),
      };

      const ghlResult = await this.ghlService.syncInvitationAccepted(syncData);

      if (!ghlResult.success) {
        return {
          success: false,
          error: ghlResult.error,
          synced: false,
        };
      }

      // Update user_invitations status
      await this.supabase
        .from('user_invitations')
        .update({
          status: 'accepted',
          activated_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', event.userId);

      return {
        success: true,
        contactId,
        synced: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        synced: false,
      };
    }
  }

  // ==========================================================================
  // Background Sync Operations
  // ==========================================================================

  /**
   * Retry failed syncs
   * Finds users without gohighlevel_contact_id and attempts sync
   */
  async retryFailedSyncs(limit: number = 10): Promise<{ attempted: number; succeeded: number }> {
    try {
      // Find users without GHL contact_id
      const { data: users, error } = await this.supabase
        .from('users')
        .select('id, email, first_name, last_name, phone, gohighlevel_contact_id')
        .is('gohighlevel_contact_id', null)
        .eq('status', 'invited')
        .limit(limit);

      if (error || !users) {
        return { attempted: 0, succeeded: 0 };
      }

      let succeeded = 0;

      for (const user of users) {
        // Get invitation data
        const { data: invitation } = await this.supabase
          .from('user_invitations')
          .select('token, status')
          .eq('user_id', user.id)
          .single();

        if (!invitation) continue;

        const result = await this.syncInvitationSent({
          userId: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone,
          invitationToken: invitation.token,
          status: invitation.status === 'sent' ? 'sent' : 'pending',
        });

        if (result.success) {
          succeeded++;
        }
      }

      return {
        attempted: users.length,
        succeeded,
      };
    } catch (error) {
      return { attempted: 0, succeeded: 0 };
    }
  }

  /**
   * Bulk sync existing users to GoHighLevel
   * Used for initial migration or data recovery
   */
  async bulkSyncUsers(batchSize: number = 50): Promise<{ total: number; synced: number }> {
    try {
      let offset = 0;
      let totalSynced = 0;
      let hasMore = true;

      while (hasMore) {
        // Fetch batch of users
        const { data: users, error } = await this.supabase
          .from('users')
          .select('id, email, first_name, last_name, phone, gohighlevel_contact_id, status')
          .is('gohighlevel_contact_id', null)
          .range(offset, offset + batchSize - 1);

        if (error || !users || users.length === 0) {
          hasMore = false;
          break;
        }

        // Process batch
        for (const user of users) {
          const { data: invitation } = await this.supabase
            .from('user_invitations')
            .select('token, status')
            .eq('user_id', user.id)
            .single();

          if (!invitation) continue;

          const result = await this.syncInvitationSent({
            userId: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            phone: user.phone,
            invitationToken: invitation.token,
            status: invitation.status === 'sent' ? 'sent' : 'pending',
          });

          if (result.success) {
            totalSynced++;
          }

          // Rate limiting: wait 100ms between requests
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        offset += batchSize;

        if (users.length < batchSize) {
          hasMore = false;
        }
      }

      return {
        total: offset,
        synced: totalSynced,
      };
    } catch (error) {
      return { total: 0, synced: 0 };
    }
  }
}

// ============================================================================
// Factory & Utilities
// ============================================================================

/**
 * Default sync service instance
 */
let defaultSyncService: ContactSyncService | null = null;

export function getContactSyncService(): ContactSyncService {
  if (!defaultSyncService) {
    defaultSyncService = new ContactSyncService();
  }
  return defaultSyncService;
}

/**
 * Helper: Sync invitation sent
 * Convenience function for common use case
 */
export async function syncInvitationSent(event: InvitationEvent): Promise<SyncResult> {
  const service = getContactSyncService();
  return service.syncInvitationSent(event);
}

/**
 * Helper: Sync invitation accepted
 * Convenience function for common use case
 */
export async function syncInvitationAccepted(event: ActivationEvent): Promise<SyncResult> {
  const service = getContactSyncService();
  return service.syncInvitationAccepted(event);
}
