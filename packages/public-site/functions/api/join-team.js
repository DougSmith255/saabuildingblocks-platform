/**
 * Join Team API Endpoint
 *
 * Receives lead form submissions from agent attraction and linktree pages,
 * creates/updates contact in GoHighLevel with referral tag.
 *
 * POST /api/join-team
 * Body: { firstName, lastName, email, sponsorName }
 */

// GoHighLevel API configuration
const GHL_API_BASE = 'https://services.leadconnectorhq.com';
const GHL_API_VERSION = '2021-07-28';

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
    const { firstName, lastName, email, country, sponsorName } = body;

    console.log('[join-team] Request received:', { firstName, lastName, email, country, sponsorName });

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

    console.log('[join-team] Env check:', {
      hasApiKey: !!apiKey,
      hasLocationId: !!locationId,
      envKeys: Object.keys(env || {})
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

    // Build the referral tag
    const referralTag = sponsorName ? `Referred by ${sponsorName}` : 'Website Lead';

    // Headers for GHL API
    const ghlHeaders = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Version': GHL_API_VERSION,
    };

    // First, check if contact already exists by email using the lookup endpoint
    console.log('[join-team] Looking up contact by email...');
    const lookupResponse = await fetch(
      `${GHL_API_BASE}/contacts/lookup?locationId=${locationId}&email=${encodeURIComponent(email)}`,
      { headers: ghlHeaders }
    );

    const lookupData = await lookupResponse.json();
    console.log('[join-team] Lookup response:', { status: lookupResponse.status, ok: lookupResponse.ok, contacts: lookupData.contacts?.length || 0 });

    // Use lookup results
    const searchResponse = lookupResponse;
    const searchData = lookupData;

    if (searchResponse.ok && searchData.contacts && searchData.contacts.length > 0) {
      // Contact exists - add the tag
      const contactId = searchData.contacts[0].id;
      const existingTags = searchData.contacts[0].tags || [];

      // Only add tag if not already present
      if (!existingTags.includes(referralTag)) {
        const updateResponse = await fetch(
          `${GHL_API_BASE}/contacts/${contactId}`,
          {
            method: 'PUT',
            headers: ghlHeaders,
            body: JSON.stringify({
              tags: [...existingTags, referralTag],
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

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Contact updated with referral tag',
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
      tags: [referralTag, 'agent_page_lead'],
      source: sponsorName || 'Agent Page',
    };

    // Add country if provided
    if (country) {
      createPayload.country = country;
    }

    console.log('[join-team] Creating contact with payload:', JSON.stringify(createPayload));

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
        console.log('[join-team] Contact exists (from error), updating with tag...');
        const existingContactId = errorData.meta.contactId;

        // Get existing contact to preserve tags
        const getContactResponse = await fetch(
          `${GHL_API_BASE}/contacts/${existingContactId}`,
          { headers: ghlHeaders }
        );

        if (getContactResponse.ok) {
          const contactData = await getContactResponse.json();
          const existingTags = contactData.contact?.tags || [];

          if (!existingTags.includes(referralTag)) {
            const updateResponse = await fetch(
              `${GHL_API_BASE}/contacts/${existingContactId}`,
              {
                method: 'PUT',
                headers: ghlHeaders,
                body: JSON.stringify({
                  tags: [...existingTags, referralTag],
                }),
              }
            );

            if (updateResponse.ok) {
              return new Response(
                JSON.stringify({
                  success: true,
                  message: 'Contact updated with referral tag',
                  isExisting: true,
                }),
                { status: 200, headers: corsHeaders }
              );
            }
          } else {
            // Tag already exists
            return new Response(
              JSON.stringify({
                success: true,
                message: 'Contact already has referral tag',
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
    console.error('Join team API error:', error);
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
