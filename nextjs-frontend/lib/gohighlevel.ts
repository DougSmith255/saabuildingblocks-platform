/**
 * GoHighLevel API Integration
 * Handles contact management, custom fields, and workflow triggers
 */

const GHL_API_KEY = process.env.GOHIGHLEVEL_API_KEY || 'pit-492db3c0-cdeb-4004-8de2-56e4491cd2e0';
const GHL_API_URL = 'https://rest.gohighlevel.com/v1';
const GHL_LOCATION_ID = process.env.GOHIGHLEVEL_LOCATION_ID || 'VCj23sLEqnBVOtWdyQv8';

export interface GHLContact {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  tags?: string[];
  customFields?: Record<string, string>;
}

export interface GHLUpdateContactParams {
  contactId: string;
  tags?: string[];
  customFields?: Record<string, string>;
  firstName?: string;
  lastName?: string;
}

/**
 * Create or update GoHighLevel contact
 */
export async function createOrUpdateGHLContact(contact: GHLContact): Promise<{ success: boolean; contactId?: string; error?: string }> {
  try {
    const response = await fetch(`${GHL_API_URL}/contacts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GHL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: contact.email,
        firstName: contact.firstName,
        lastName: contact.lastName,
        phone: contact.phone,
        tags: contact.tags || [],
        customFields: contact.customFields || {},
        locationId: GHL_LOCATION_ID,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[GHL] Error creating/updating contact:', errorData);
      return { success: false, error: errorData.message || 'Failed to create contact' };
    }

    const data = await response.json();
    return { success: true, contactId: data.contact?.id };
  } catch (error) {
    console.error('[GHL] Exception creating/updating contact:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Update GoHighLevel contact tags and custom fields
 */
export async function updateGHLContact(params: GHLUpdateContactParams): Promise<{ success: boolean; error?: string }> {
  try {
    const updateData: Record<string, any> = {};

    if (params.tags) {
      updateData.tags = params.tags;
    }

    if (params.customFields) {
      updateData.customFields = params.customFields;
    }

    if (params.firstName) {
      updateData.firstName = params.firstName;
    }

    if (params.lastName) {
      updateData.lastName = params.lastName;
    }

    const response = await fetch(`${GHL_API_URL}/contacts/${params.contactId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GHL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[GHL] Error updating contact:', errorData);
      return { success: false, error: errorData.message || 'Failed to update contact' };
    }

    return { success: true };
  } catch (error) {
    console.error('[GHL] Exception updating contact:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Add tag to GoHighLevel contact
 */
export async function addGHLTag(contactId: string, tag: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${GHL_API_URL}/contacts/${contactId}/tags`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GHL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tags: [tag] }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[GHL] Error adding tag:', errorData);
      return { success: false, error: errorData.message || 'Failed to add tag' };
    }

    return { success: true };
  } catch (error) {
    console.error('[GHL] Exception adding tag:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Update custom field on GoHighLevel contact
 */
export async function updateGHLCustomField(
  contactId: string,
  fieldName: string,
  fieldValue: string
): Promise<{ success: boolean; error?: string }> {
  return updateGHLContact({
    contactId,
    customFields: { [fieldName]: fieldValue },
  });
}

/**
 * Get GoHighLevel contact by email
 */
export async function getGHLContactByEmail(email: string): Promise<{ success: boolean; contact?: GHLContact; error?: string }> {
  try {
    const response = await fetch(
      `${GHL_API_URL}/contacts?email=${encodeURIComponent(email)}&locationId=${GHL_LOCATION_ID}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${GHL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[GHL] Error getting contact:', errorData);
      return { success: false, error: errorData.message || 'Failed to get contact' };
    }

    const data = await response.json();
    const contact = data.contacts?.[0];

    if (!contact) {
      return { success: false, error: 'Contact not found' };
    }

    return { success: true, contact };
  } catch (error) {
    console.error('[GHL] Exception getting contact:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Sync invitation sent event to GoHighLevel
 */
export async function syncInvitationSent(params: {
  email: string;
  inviterName: string;
  role: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('[GHL] Syncing invitation sent:', params);
    // Stub implementation - to be completed
    return { success: true };
  } catch (error) {
    console.error('[GHL] Exception syncing invitation sent:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Sync invitation accepted event to GoHighLevel
 */
export async function syncInvitationAccepted(params: {
  email: string;
  userName: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('[GHL] Syncing invitation accepted:', params);
    // Stub implementation - to be completed
    return { success: true };
  } catch (error) {
    console.error('[GHL] Exception syncing invitation accepted:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Get contact sync service instance
 */
export function getContactSyncService() {
  return {
    syncContact: async (contact: GHLContact) => {
      return createOrUpdateGHLContact(contact);
    },
    getContactByEmail: getGHLContactByEmail,
  };
}
