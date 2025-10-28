/**
 * GoHighLevel Service
 * Centralized service for all GHL CRM operations
 *
 * Features:
 * - Contact management (create, update, search)
 * - Tag management (add, remove)
 * - Custom field updates
 * - Workflow triggers
 * - Retry logic with exponential backoff
 * - Comprehensive error handling
 */

import { GoHighLevelClient, GHLApiResponse, GHLContact, CreateContactRequest, GHLAPIError } from '../gohighlevel-client';

// ============================================================================
// Types
// ============================================================================

export interface ContactSyncResult {
  success: boolean;
  contactId?: string;
  error?: string;
  action: 'created' | 'updated' | 'failed';
}

export interface TagUpdateResult {
  success: boolean;
  error?: string;
}

export interface InvitationSyncData {
  userId: string;
  email: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  invitationToken: string;
  invitationStatus: 'pending' | 'sent' | 'accepted' | 'expired' | 'failed';
}

export interface ActivationSyncData {
  userId: string;
  contactId: string;
  username: string;
  activatedAt: string;
}

// ============================================================================
// GoHighLevel Service Class
// ============================================================================

export class GoHighLevelService {
  private client: GoHighLevelClient;

  constructor(apiKey?: string, locationId?: string) {
    const key = apiKey || process.env['GOHIGHLEVEL_API_KEY'] || '';
    const location = locationId || process.env['GOHIGHLEVEL_LOCATION_ID'] || '';

    this.client = new GoHighLevelClient(key, location);
  }

  // ==========================================================================
  // Invitation Flow Integration
  // ==========================================================================

  /**
   * Sync contact when invitation is sent
   * Creates or updates GHL contact with invitation data
   */
  async syncInvitationSent(data: InvitationSyncData): Promise<ContactSyncResult> {
    try {
      // Check if contact already exists
      const existingContact = await this.searchContactByEmail(data.email);

      if (existingContact) {
        // Update existing contact
        const updateResult = await this.client.updateContact(existingContact.id, {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          customFields: {
            portal_user_id: data.userId,
            invitation_status: data.invitationStatus,
            invitation_token: data.invitationToken.substring(0, 8) + '...',
            invitation_sent_at: new Date().toISOString(),
          },
        });

        if (!updateResult.success) {
          return {
            success: false,
            error: updateResult.error?.message || 'Failed to update contact',
            action: 'failed',
          };
        }

        // Add tags
        await this.client.addTags(existingContact.id, ['saa-portal-user', 'invitation-sent']);

        return {
          success: true,
          contactId: existingContact.id,
          action: 'updated',
        };
      } else {
        // Create new contact
        const createResult = await this.client.createContact({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          tags: ['saa-portal-user', 'invitation-sent'],
          customFields: {
            portal_user_id: data.userId,
            invitation_status: data.invitationStatus,
            invitation_token: data.invitationToken.substring(0, 8) + '...',
            invitation_sent_at: new Date().toISOString(),
            registration_source: 'SAA Portal - Admin Invitation',
          },
        });

        if (!createResult.success || !createResult.data) {
          return {
            success: false,
            error: createResult.error?.message || 'Failed to create contact',
            action: 'failed',
          };
        }

        return {
          success: true,
          contactId: createResult.data.id,
          action: 'created',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        action: 'failed',
      };
    }
  }

  /**
   * Sync contact when invitation is accepted
   * Updates GHL contact with activation data
   */
  async syncInvitationAccepted(data: ActivationSyncData): Promise<TagUpdateResult> {
    try {
      // Update contact custom fields
      const updateResult = await this.client.updateCustomFields(data.contactId, {
        account_status: 'active',
        username: data.username,
        activated_at: data.activatedAt,
        invitation_status: 'accepted',
      });

      if (!updateResult.success) {
        return {
          success: false,
          error: updateResult.error?.message || 'Failed to update contact',
        };
      }

      // Remove invitation-sent tag and add activated tag
      await this.client.removeTags(data.contactId, ['invitation-sent']).catch(() => {
        // Tag removal failed - non-critical, continue
      });

      await this.client.addTags(data.contactId, ['account-activated', 'active-user']);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // ==========================================================================
  // Contact Operations
  // ==========================================================================

  /**
   * Search for contact by email
   * Returns the first matching contact or undefined
   */
  async searchContactByEmail(email: string): Promise<GHLContact | undefined> {
    try {
      const result = await this.client.searchContactByEmail(email);

      if (!result.success || !result.data) {
        return undefined;
      }

      return result.data.contacts[0];
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Create or update contact
   * Idempotent operation that handles both cases
   */
  async createOrUpdateContact(
    email: string,
    contactData: CreateContactRequest
  ): Promise<ContactSyncResult> {
    try {
      const existingContact = await this.searchContactByEmail(email);

      if (existingContact) {
        const updateResult = await this.client.updateContact(existingContact.id, contactData);

        if (!updateResult.success) {
          return {
            success: false,
            error: updateResult.error?.message || 'Failed to update contact',
            action: 'failed',
          };
        }

        return {
          success: true,
          contactId: existingContact.id,
          action: 'updated',
        };
      } else {
        const createResult = await this.client.createContact(contactData);

        if (!createResult.success || !createResult.data) {
          return {
            success: false,
            error: createResult.error?.message || 'Failed to create contact',
            action: 'failed',
          };
        }

        return {
          success: true,
          contactId: createResult.data.id,
          action: 'created',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        action: 'failed',
      };
    }
  }

  /**
   * Add tags to contact by email
   * Finds contact and adds tags
   */
  async addTagsByEmail(email: string, tags: string[]): Promise<TagUpdateResult> {
    try {
      const contact = await this.searchContactByEmail(email);

      if (!contact) {
        return {
          success: false,
          error: 'Contact not found',
        };
      }

      const result = await this.client.addTags(contact.id, tags);

      if (!result.success) {
        return {
          success: false,
          error: result.error?.message || 'Failed to add tags',
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Remove tags from contact by email
   */
  async removeTagsByEmail(email: string, tags: string[]): Promise<TagUpdateResult> {
    try {
      const contact = await this.searchContactByEmail(email);

      if (!contact) {
        return {
          success: false,
          error: 'Contact not found',
        };
      }

      const result = await this.client.removeTags(contact.id, tags);

      if (!result.success) {
        return {
          success: false,
          error: result.error?.message || 'Failed to remove tags',
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Update custom fields by email
   */
  async updateCustomFieldsByEmail(
    email: string,
    customFields: Record<string, any>
  ): Promise<TagUpdateResult> {
    try {
      const contact = await this.searchContactByEmail(email);

      if (!contact) {
        return {
          success: false,
          error: 'Contact not found',
        };
      }

      const result = await this.client.updateCustomFields(contact.id, customFields);

      if (!result.success) {
        return {
          success: false,
          error: result.error?.message || 'Failed to update custom fields',
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // ==========================================================================
  // Workflow Operations
  // ==========================================================================

  /**
   * Trigger workflow for contact by email
   */
  async triggerWorkflowByEmail(email: string, workflowId: string): Promise<TagUpdateResult> {
    try {
      const contact = await this.searchContactByEmail(email);

      if (!contact) {
        return {
          success: false,
          error: 'Contact not found',
        };
      }

      const result = await this.client.triggerWorkflow(contact.id, workflowId);

      if (!result.success) {
        return {
          success: false,
          error: result.error?.message || 'Failed to trigger workflow',
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// ============================================================================
// Factory & Utilities
// ============================================================================

/**
 * Create GoHighLevel service instance
 * Uses environment variables by default
 */
export function createGHLService(apiKey?: string, locationId?: string): GoHighLevelService {
  return new GoHighLevelService(apiKey, locationId);
}

/**
 * Default service instance
 * Lazy-initialized singleton
 */
let defaultService: GoHighLevelService | null = null;

export function getGHLService(): GoHighLevelService {
  if (!defaultService) {
    defaultService = createGHLService();
  }
  return defaultService;
}
