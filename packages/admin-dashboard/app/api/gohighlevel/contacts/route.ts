// Force dynamic rendering - exclude from static export
export const dynamic = 'force-dynamic';

/**
 * GoHighLevel Contact API Route
 * POST /api/gohighlevel/contacts - Create contact with activation workflow
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createGHLClient, GHLAPIError, validateContactData } from '@/lib/gohighlevel-client';
import { randomBytes } from 'crypto';

// ============================================================================
// Request Validation
// ============================================================================

const CreateContactBodySchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  profileType: z.enum(['individual', 'organization']).optional(),
  includeActivationEmail: z.boolean().default(true),
});

type CreateContactBody = z.infer<typeof CreateContactBodySchema>;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Generate secure activation token
 */
function generateActivationToken(): string {
  return randomBytes(32).toString('base64url');
}

/**
 * Calculate activation expiry (24 hours from now)
 */
function getActivationExpiry(): string {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 24);
  return expiry.toISOString();
}

// ============================================================================
// Route Handlers
// ============================================================================

/**
 * POST /api/gohighlevel/contacts
 * Create contact in GoHighLevel with activation workflow
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body: unknown = await request.json();
    const validation = CreateContactBodySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Invalid request data',
            code: 'VALIDATION_ERROR',
            details: validation.error.issues,
          },
        },
        { status: 400 }
      );
    }

    const contactData = validation.data;

    // Generate activation token
    const activationToken = generateActivationToken();
    const activationExpiry = getActivationExpiry();

    // Prepare tags based on activation email preference
    const tags = ['saa_user'];
    if (contactData.includeActivationEmail) {
      tags.push('pending_activation');
    }

    // Prepare custom fields for GoHighLevel
    const customFields: Record<string, any> = {
      activation_token: activationToken,
      activation_expiry: activationExpiry,
      profile_status: 'pending',
      registration_source: 'SAA Portal',
      registration_date: new Date().toISOString(),
    };

    if (contactData.profileType) {
      customFields['profile_type'] = contactData.profileType;
    }

    // Create GoHighLevel client
    const ghlClient = createGHLClient();

    // Check if contact already exists
    const existingContact = await ghlClient.searchContactByEmail(contactData.email);

    if (existingContact.success && existingContact.data && (existingContact.data.contacts?.length || 0) > 0) {
      const contact = existingContact.data.contacts[0];

      // Update existing contact with new activation token
      const updateResult = await ghlClient.updateContact(contact.id, {
        tags,
        customFields,
      });

      if (!updateResult.success) {
        return NextResponse.json(
          {
            success: false,
            error: {
              message: updateResult.error?.message || 'Failed to update existing contact',
              code: 'UPDATE_ERROR',
              details: updateResult.error?.details,
            },
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          contactId: contact.id,
          activationToken,
          activationExpiry,
          isExisting: true,
          message: 'Existing contact updated with new activation token',
        },
      });
    }

    // Create new contact
    const createResult = await ghlClient.createContact({
      firstName: contactData.firstName,
      lastName: contactData.lastName,
      email: contactData.email,
      phone: contactData.phone,
      tags,
      customFields,
    });

    if (!createResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: createResult.error?.message || 'Failed to create contact',
            code: 'CREATE_ERROR',
            details: createResult.error?.details,
          },
        },
        { status: 500 }
      );
    }

    // Return success response with contact ID and activation token
    return NextResponse.json({
      success: true,
      data: {
        contactId: createResult.data!.id,
        activationToken,
        activationExpiry,
        isExisting: false,
        message: contactData.includeActivationEmail
          ? 'Contact created. Activation email will be sent automatically.'
          : 'Contact created without activation email.',
      },
    });
  } catch (error) {
    console.error('GoHighLevel contact creation error:', error);

    // Handle specific GHL errors
    if (error instanceof GHLAPIError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: error.message,
            code: error.code || 'GHL_ERROR',
            details: error.details,
          },
        },
        { status: error.statusCode || 500 }
      );
    }

    // Handle unknown errors
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Internal server error',
          code: 'INTERNAL_ERROR',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/gohighlevel/contacts?email=user@example.com
 * Search for contact by email
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Email parameter is required',
            code: 'VALIDATION_ERROR',
          },
        },
        { status: 400 }
      );
    }

    // Create GoHighLevel client
    const ghlClient = createGHLClient();

    // Search for contact
    const result = await ghlClient.searchContactByEmail(email);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: result.error?.message || 'Failed to search contact',
            code: 'SEARCH_ERROR',
            details: result.error?.details,
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error('GoHighLevel contact search error:', error);

    if (error instanceof GHLAPIError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: error.message,
            code: error.code || 'GHL_ERROR',
            details: error.details,
          },
        },
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Internal server error',
          code: 'INTERNAL_ERROR',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}
