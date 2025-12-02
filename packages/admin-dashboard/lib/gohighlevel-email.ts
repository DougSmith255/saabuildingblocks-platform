/**
 * GoHighLevel Email Sending Library
 *
 * Handles sending emails via GoHighLevel API with:
 * - Personalization token replacement
 * - OAuth token management
 * - Contact data fetching
 */

import { createClient } from '@supabase/supabase-js';

// ============================================================================
// Types
// ============================================================================

export interface PersonalizationToken {
  token: string;
  default: string;
  description: string;
}

export interface GHLContact {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  [key: string]: any;
}

export interface SendEmailOptions {
  recipientEmail: string;
  subject: string;
  htmlContent: string;
  personalizationTokens?: PersonalizationToken[];
}

// ============================================================================
// GoHighLevel Token Management
// ============================================================================

// Configuration from environment variables
const GHL_CLIENT_ID = process.env['GHL_CLIENT_ID'] || '657a970643f68f6ed3b86244-lq4sb5tt';
const GHL_CLIENT_SECRET = process.env['GHL_CLIENT_SECRET'] || '1ac6e171-1771-4a63-9f92-71364d8987bf';
const GHL_LOCATION_ID = process.env['GHL_LOCATION_ID'] || 'wmYRsn57bNL8Z2tMlIZ7';
const GHL_REFRESH_TOKEN = process.env['GHL_REFRESH_TOKEN'];
const GHL_API_KEY = process.env['GHL_API_KEY']; // Private Integration Token

let cachedAccessToken: string | null = null;
let tokenExpiry: number | null = null;

async function getGHLAccessToken(): Promise<string> {
  // If using Private Integration Token (API Key), return it directly
  if (GHL_API_KEY) {
    return GHL_API_KEY;
  }

  // Return cached OAuth token if still valid (with 5 minute buffer)
  if (cachedAccessToken && tokenExpiry && Date.now() < tokenExpiry - 300000) {
    return cachedAccessToken;
  }

  if (!GHL_REFRESH_TOKEN) {
    throw new Error(
      'Either GHL_API_KEY or GHL_REFRESH_TOKEN environment variable must be set. Please add one to .env.local'
    );
  }

  // Refresh the OAuth access token
  const refreshResponse = await fetch(
    'https://services.leadconnectorhq.com/oauth/token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: GHL_CLIENT_ID,
        client_secret: GHL_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: GHL_REFRESH_TOKEN,
      }),
    }
  );

  if (!refreshResponse.ok) {
    const errorText = await refreshResponse.text();
    throw new Error(
      `Failed to refresh GHL access token: ${refreshResponse.status} ${errorText}`
    );
  }

  const tokenData = await refreshResponse.json();
  cachedAccessToken = tokenData.access_token;
  tokenExpiry = Date.now() + (tokenData.expires_in || 86400) * 1000;

  if (!cachedAccessToken) {
    throw new Error('Failed to get access token from refresh response');
  }

  return cachedAccessToken;
}

// ============================================================================
// Contact Fetching
// ============================================================================

export async function getContactByEmail(
  email: string
): Promise<GHLContact | null> {
  const accessToken = await getGHLAccessToken();

  const response = await fetch(
    `https://services.leadconnectorhq.com/contacts/search/duplicate?locationId=${GHL_LOCATION_ID}&email=${encodeURIComponent(email)}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Version: '2021-07-28',
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to fetch contact: ${response.status} ${errorText}`
    );
  }

  const data = await response.json();
  return data.contact || null;
}

// ============================================================================
// Personalization Token Replacement
// ============================================================================

export function replacePersonalizationTokens(
  content: string,
  contact: GHLContact,
  tokens: PersonalizationToken[]
): string {
  let processedContent = content;

  tokens.forEach((tokenConfig) => {
    const tokenRegex = new RegExp(
      tokenConfig.token.replace(/[{}]/g, '\\$&'),
      'g'
    );

    // Extract the field name from the token (e.g., {{firstName}} -> firstName)
    const fieldName = tokenConfig.token.replace(/[{}]/g, '');

    // Get value from contact or use default
    const value = contact[fieldName] || tokenConfig.default || '';

    processedContent = processedContent.replace(tokenRegex, value);
  });

  return processedContent;
}

// ============================================================================
// Email Sending via GoHighLevel
// ============================================================================

export async function sendEmailViaGoHighLevel(
  options: SendEmailOptions
): Promise<{
  success: boolean;
  messageId?: string;
  conversationId?: string;
  error?: string;
}> {
  try {
    const accessToken = await getGHLAccessToken();

    // Fetch contact data for personalization
    const contact = await getContactByEmail(options.recipientEmail);

    if (!contact) {
      return {
        success: false,
        error: `Contact not found: ${options.recipientEmail}`,
      };
    }

    // Replace personalization tokens if provided
    let processedHtml = options.htmlContent;
    let processedSubject = options.subject;

    if (options.personalizationTokens) {
      processedHtml = replacePersonalizationTokens(
        processedHtml,
        contact,
        options.personalizationTokens
      );
      processedSubject = replacePersonalizationTokens(
        processedSubject,
        contact,
        options.personalizationTokens
      );
    }

    console.log('Sending email via GoHighLevel:', {
      contactId: contact.id,
      subject: processedSubject,
      emailFrom: 'doug@smartagentalliance.com',
    });

    // Send email via GoHighLevel Conversations/Messages API
    const response = await fetch(
      `https://services.leadconnectorhq.com/conversations/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Version: '2021-07-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'Email',
          contactId: contact.id,
          subject: processedSubject,
          html: processedHtml,
          emailFrom: 'doug@smartagentalliance.com',
          bcc: ['sheldontosmart@gmail.com'],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GoHighLevel API error response:', errorText);
      return {
        success: false,
        error: `GoHighLevel API error: ${response.status} ${errorText}`,
      };
    }

    const data = await response.json();
    console.log('GoHighLevel API success response:', data);

    return {
      success: true,
      messageId: data.messageId,
      conversationId: data.conversationId,
    };
  } catch (error) {
    console.error('Error sending email via GoHighLevel:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
