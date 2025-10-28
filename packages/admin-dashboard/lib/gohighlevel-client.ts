/**
 * GoHighLevel API Client
 * Comprehensive wrapper for GHL API with error handling and retry logic
 */

import { z } from 'zod';

// ============================================================================
// Types & Schemas
// ============================================================================

export const ContactSchema = z.object({
  id: z.string().optional(),
  locationId: z.string(),
  firstName: z.string().min(1),
  lastName: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  tags: z.array(z.string()).optional(),
  customFields: z.record(z.string(), z.any()).optional(),
  source: z.string().optional(),
  dateAdded: z.string().optional(),
});

export type Contact = z.infer<typeof ContactSchema>;

export const CreateContactRequestSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  tags: z.array(z.string()).optional(),
  customFields: z.record(z.string(), z.any()).optional(),
});

export type CreateContactRequest = z.infer<typeof CreateContactRequestSchema>;

export interface GHLContact {
  id: string;
  locationId: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  tags?: string[];
  customFields?: Record<string, any>;
  dateAdded?: string;
  source?: string;
}

export interface GHLApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
}

export interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

// ============================================================================
// Error Classes
// ============================================================================

export class GHLAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'GHLAPIError';
  }
}

export class GHLValidationError extends GHLAPIError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'GHLValidationError';
  }
}

export class GHLAuthError extends GHLAPIError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, 'AUTH_ERROR');
    this.name = 'GHLAuthError';
  }
}

export class GHLRateLimitError extends GHLAPIError {
  constructor(message: string = 'Rate limit exceeded', public retryAfter?: number) {
    super(message, 429, 'RATE_LIMIT_ERROR');
    this.name = 'GHLRateLimitError';
  }
}

// ============================================================================
// GoHighLevel Client
// ============================================================================

export class GoHighLevelClient {
  private readonly apiKey: string;
  private readonly locationId: string;
  private readonly baseUrl: string = 'https://services.leadconnectorhq.com';
  private readonly version: string = '2021-07-28';

  private readonly retryConfig: RetryConfig = {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
  };

  constructor(apiKey: string, locationId: string) {
    if (!apiKey || !apiKey.startsWith('pit-')) {
      throw new GHLValidationError('Invalid API key format. Must start with "pit-"');
    }
    if (!locationId) {
      throw new GHLValidationError('Location ID is required');
    }

    this.apiKey = apiKey;
    this.locationId = locationId;
  }

  // ==========================================================================
  // Private Helper Methods
  // ==========================================================================

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<GHLApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers = new Headers({
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'Version': this.version,
      ...options.headers,
    });

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle rate limiting with retry
      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('Retry-After') || '60');

        if (retryCount < this.retryConfig.maxRetries) {
          const delay = Math.min(
            this.retryConfig.initialDelay * Math.pow(this.retryConfig.backoffMultiplier, retryCount),
            this.retryConfig.maxDelay
          );

          await this.sleep(delay);
          return this.makeRequest<T>(endpoint, options, retryCount + 1);
        }

        throw new GHLRateLimitError('Rate limit exceeded', retryAfter);
      }

      // Handle authentication errors
      if (response.status === 401 || response.status === 403) {
        throw new GHLAuthError('Invalid API key or insufficient permissions');
      }

      const data = await response.json();

      // Handle successful response
      if (response.ok) {
        return {
          success: true,
          data: data as T,
        };
      }

      // Handle error response
      return {
        success: false,
        error: {
          message: data.message || 'Unknown error occurred',
          code: data.code,
          details: data,
        },
      };
    } catch (error) {
      if (error instanceof GHLAPIError) {
        throw error;
      }

      // Network or unknown errors with retry
      if (retryCount < this.retryConfig.maxRetries) {
        const delay = Math.min(
          this.retryConfig.initialDelay * Math.pow(this.retryConfig.backoffMultiplier, retryCount),
          this.retryConfig.maxDelay
        );

        await this.sleep(delay);
        return this.makeRequest<T>(endpoint, options, retryCount + 1);
      }

      throw new GHLAPIError(
        error instanceof Error ? error.message : 'Unknown error',
        undefined,
        'NETWORK_ERROR',
        error
      );
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ==========================================================================
  // Contact Management
  // ==========================================================================

  /**
   * Create a new contact in GoHighLevel
   */
  async createContact(contact: CreateContactRequest): Promise<GHLApiResponse<GHLContact>> {
    // Validate input
    const validation = CreateContactRequestSchema.safeParse(contact);
    if (!validation.success) {
      throw new GHLValidationError('Invalid contact data', validation.error.format());
    }

    const payload = {
      locationId: this.locationId,
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
      tags: contact.tags || [],
      customFields: contact.customFields || {},
      source: 'SAA Registration Portal',
    };

    return this.makeRequest<GHLContact>('/contacts/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /**
   * Get contact by ID
   */
  async getContact(contactId: string): Promise<GHLApiResponse<GHLContact>> {
    if (!contactId) {
      throw new GHLValidationError('Contact ID is required');
    }

    return this.makeRequest<GHLContact>(`/contacts/${contactId}`);
  }

  /**
   * Update contact
   */
  async updateContact(
    contactId: string,
    updates: Partial<CreateContactRequest>
  ): Promise<GHLApiResponse<GHLContact>> {
    if (!contactId) {
      throw new GHLValidationError('Contact ID is required');
    }

    return this.makeRequest<GHLContact>(`/contacts/${contactId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  /**
   * Delete contact
   */
  async deleteContact(contactId: string): Promise<GHLApiResponse<void>> {
    if (!contactId) {
      throw new GHLValidationError('Contact ID is required');
    }

    return this.makeRequest<void>(`/contacts/${contactId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Search contacts by email
   */
  async searchContactByEmail(email: string): Promise<GHLApiResponse<{ contacts: GHLContact[] }>> {
    if (!email) {
      throw new GHLValidationError('Email is required');
    }

    const params = new URLSearchParams({
      locationId: this.locationId,
      email,
    });

    return this.makeRequest<{ contacts: GHLContact[] }>(`/contacts/search?${params}`);
  }

  /**
   * Add tags to contact
   */
  async addTags(contactId: string, tags: string[]): Promise<GHLApiResponse<GHLContact>> {
    if (!contactId) {
      throw new GHLValidationError('Contact ID is required');
    }
    if (!tags || tags.length === 0) {
      throw new GHLValidationError('At least one tag is required');
    }

    return this.makeRequest<GHLContact>(`/contacts/${contactId}/tags`, {
      method: 'POST',
      body: JSON.stringify({ tags }),
    });
  }

  /**
   * Remove tags from contact
   */
  async removeTags(contactId: string, tags: string[]): Promise<GHLApiResponse<GHLContact>> {
    if (!contactId) {
      throw new GHLValidationError('Contact ID is required');
    }
    if (!tags || tags.length === 0) {
      throw new GHLValidationError('At least one tag is required');
    }

    return this.makeRequest<GHLContact>(`/contacts/${contactId}/tags`, {
      method: 'DELETE',
      body: JSON.stringify({ tags }),
    });
  }

  // ==========================================================================
  // Custom Fields
  // ==========================================================================

  /**
   * Update custom fields for a contact
   */
  async updateCustomFields(
    contactId: string,
    customFields: Record<string, any>
  ): Promise<GHLApiResponse<GHLContact>> {
    if (!contactId) {
      throw new GHLValidationError('Contact ID is required');
    }
    if (!customFields || Object.keys(customFields).length === 0) {
      throw new GHLValidationError('Custom fields cannot be empty');
    }

    return this.updateContact(contactId, { customFields });
  }

  // ==========================================================================
  // Workflow Triggers
  // ==========================================================================

  /**
   * Trigger a workflow for a contact
   */
  async triggerWorkflow(contactId: string, workflowId: string): Promise<GHLApiResponse<void>> {
    if (!contactId) {
      throw new GHLValidationError('Contact ID is required');
    }
    if (!workflowId) {
      throw new GHLValidationError('Workflow ID is required');
    }

    return this.makeRequest<void>(`/workflows/${workflowId}/trigger`, {
      method: 'POST',
      body: JSON.stringify({
        contactId,
        locationId: this.locationId,
      }),
    });
  }
}

// ============================================================================
// Factory & Utilities
// ============================================================================

/**
 * Create GoHighLevel client instance
 */
export function createGHLClient(): GoHighLevelClient {
  const apiKey = process.env['GOHIGHLEVEL_API_KEY'];
  const locationId = process.env['GOHIGHLEVEL_LOCATION_ID'];

  if (!apiKey) {
    throw new GHLValidationError('GOHIGHLEVEL_API_KEY environment variable is required');
  }
  if (!locationId) {
    throw new GHLValidationError('GOHIGHLEVEL_LOCATION_ID environment variable is required');
  }

  return new GoHighLevelClient(apiKey, locationId);
}

/**
 * Validate contact data before creation
 */
export function validateContactData(data: unknown): CreateContactRequest {
  const result = CreateContactRequestSchema.safeParse(data);
  if (!result.success) {
    throw new GHLValidationError('Invalid contact data', result.error.format());
  }
  return result.data;
}
