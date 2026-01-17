/**
 * Freebie Download API Endpoint
 *
 * Receives freebie download form submissions,
 * creates/updates contact in GoHighLevel with "Downloaded Freebies" tag.
 * No email is sent - just CRM contact creation.
 *
 * POST /api/freebie-download
 * Body: { firstName, lastName, email, freebieTitle }
 */

// GoHighLevel API configuration
const GHL_API_BASE = 'https://services.leadconnectorhq.com';
const GHL_API_VERSION = '2021-07-28';

/**
 * Add a note to a contact in GoHighLevel
 */
async function addContactNote(contactId, noteBody, ghlHeaders) {
  try {
    const response = await fetch(
      `${GHL_API_BASE}/contacts/${contactId}/notes`,
      {
        method: 'POST',
        headers: ghlHeaders,
        body: JSON.stringify({ body: noteBody }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[freebie-download] Failed to add note:', errorData);
      return { success: false, error: errorData };
    }

    const result = await response.json();
    console.log('[freebie-download] Note added successfully:', { contactId, noteId: result.note?.id });
    return { success: true, noteId: result.note?.id };
  } catch (error) {
    console.error('[freebie-download] Note exception:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Handle POST request to create/update contact in GoHighLevel
 */
export async function onRequestPost(context) {
  const { request, env } = context;

  // CORS headers for cross-origin requests
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  try {
    // Parse request body
    const body = await request.json();
    const { firstName, lastName, email, freebieTitle } = body;

    console.log('[freebie-download] Request received:', { firstName, lastName, email, freebieTitle });

    // Validate required fields
    if (!firstName || !email) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'First name and email are required'
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid email format'
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Get GHL credentials from environment
    const apiKey = env.GOHIGHLEVEL_API_KEY;
    const locationId = env.GOHIGHLEVEL_LOCATION_ID;

    console.log('[freebie-download] Env check:', {
      hasApiKey: !!apiKey,
      hasLocationId: !!locationId,
    });

    if (!apiKey || !locationId) {
      console.error('GoHighLevel credentials not configured');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Service configuration error'
        }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Tag for freebie downloads
    const freebieTag = 'Downloaded Freebies';

    // Headers for GHL API
    const ghlHeaders = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Version': GHL_API_VERSION,
    };

    // First, check if contact already exists by email using the lookup endpoint
    console.log('[freebie-download] Looking up contact by email...');
    const lookupResponse = await fetch(
      `${GHL_API_BASE}/contacts/lookup?locationId=${locationId}&email=${encodeURIComponent(email)}`,
      { headers: ghlHeaders }
    );

    const lookupData = await lookupResponse.json();
    console.log('[freebie-download] Lookup response:', { status: lookupResponse.status, ok: lookupResponse.ok, contacts: lookupData.contacts?.length || 0 });

    if (lookupResponse.ok && lookupData.contacts && lookupData.contacts.length > 0) {
      // Contact exists - add the tag and note
      const contactId = lookupData.contacts[0].id;
      const existingTags = lookupData.contacts[0].tags || [];

      // Only add tag if not already present
      if (!existingTags.includes(freebieTag)) {
        const updateResponse = await fetch(
          `${GHL_API_BASE}/contacts/${contactId}`,
          {
            method: 'PUT',
            headers: ghlHeaders,
            body: JSON.stringify({
              tags: [...existingTags, freebieTag],
            }),
          }
        );

        if (!updateResponse.ok) {
          const errorData = await updateResponse.json();
          console.error('GHL update error:', errorData);
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Failed to update contact'
            }),
            { status: 500, headers: corsHeaders }
          );
        }
      }

      // Add note with which freebie was downloaded
      if (freebieTitle) {
        const noteBody = `Downloaded freebie: ${freebieTitle}\nDownloaded from Smart Agent Alliance website.`;
        await addContactNote(contactId, noteBody, ghlHeaders);
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Contact updated with freebie tag',
          isExisting: true,
        }),
        { status: 200, headers: corsHeaders }
      );
    }

    // Contact doesn't exist - create new contact with tag
    const createPayload = {
      locationId,
      firstName,
      lastName: lastName || '',
      email,
      tags: [freebieTag],
      source: 'Freebie Download',
    };

    console.log('[freebie-download] Creating contact with payload:', JSON.stringify(createPayload));

    const createResponse = await fetch(
      `${GHL_API_BASE}/contacts/`,
      {
        method: 'POST',
        headers: ghlHeaders,
        body: JSON.stringify(createPayload),
      }
    );

    if (!createResponse.ok) {
      const errorData = await createResponse.json();
      console.error('GHL create error:', JSON.stringify(errorData));

      // Handle duplicate contact error - extract contactId and update instead
      if (errorData.statusCode === 400 && errorData.meta?.contactId) {
        console.log('[freebie-download] Contact exists (from error), updating with tag...');
        const existingContactId = errorData.meta.contactId;

        // Get existing contact to preserve tags
        const getContactResponse = await fetch(
          `${GHL_API_BASE}/contacts/${existingContactId}`,
          { headers: ghlHeaders }
        );

        if (getContactResponse.ok) {
          const contactData = await getContactResponse.json();
          const existingTags = contactData.contact?.tags || [];

          if (!existingTags.includes(freebieTag)) {
            const updateResponse = await fetch(
              `${GHL_API_BASE}/contacts/${existingContactId}`,
              {
                method: 'PUT',
                headers: ghlHeaders,
                body: JSON.stringify({
                  tags: [...existingTags, freebieTag],
                }),
              }
            );

            if (updateResponse.ok) {
              // Add note with which freebie was downloaded
              if (freebieTitle) {
                const noteBody = `Downloaded freebie: ${freebieTitle}\nDownloaded from Smart Agent Alliance website.`;
                await addContactNote(existingContactId, noteBody, ghlHeaders);
              }

              return new Response(
                JSON.stringify({
                  success: true,
                  message: 'Contact updated with freebie tag',
                  isExisting: true,
                }),
                { status: 200, headers: corsHeaders }
              );
            }
          } else {
            // Tag already exists - still add note
            if (freebieTitle) {
              const noteBody = `Downloaded freebie: ${freebieTitle}\nDownloaded from Smart Agent Alliance website.`;
              await addContactNote(existingContactId, noteBody, ghlHeaders);
            }

            return new Response(
              JSON.stringify({
                success: true,
                message: 'Contact already has freebie tag',
                isExisting: true,
              }),
              { status: 200, headers: corsHeaders }
            );
          }
        }
      }

      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to create contact',
          details: errorData
        }),
        { status: 500, headers: corsHeaders }
      );
    }

    const createData = await createResponse.json();
    const newContactId = createData.contact?.id;

    // Add note with which freebie was downloaded
    if (freebieTitle && newContactId) {
      const noteBody = `Downloaded freebie: ${freebieTitle}\nDownloaded from Smart Agent Alliance website.`;
      await addContactNote(newContactId, noteBody, ghlHeaders);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Contact created successfully',
        contactId: createData.contact?.id,
        isExisting: false,
      }),
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error('Freebie download API error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error'
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}

/**
 * Handle OPTIONS request for CORS preflight
 */
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}
