/**
 * Join Team API Endpoint
 *
 * Receives lead form submissions from agent attraction and linktree pages,
 * creates/updates contact in GoHighLevel with referral tag.
 * Also sends welcome email with instructions via Resend.
 *
 * POST /api/join-team
 * Body: { firstName, lastName, email, sponsorName }
 */

// GoHighLevel API configuration
const GHL_API_BASE = 'https://services.leadconnectorhq.com';
const GHL_API_VERSION = '2021-07-28';

// Resend API configuration
const RESEND_API_BASE = 'https://api.resend.com';

/**
 * Send welcome/instructions email via Resend
 */
async function sendWelcomeEmail(firstName, email, sponsorName, resendApiKey) {
  const fromEmail = 'Smart Agent Alliance <noreply@smartagentalliance.com>';
  const sponsorDisplay = sponsorName || 'the Smart Agent Alliance team';

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Smart Agent Alliance</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0c; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0c; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #151517; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 24px 20px; text-align: center;">
              <table width="60" height="60" cellpadding="0" cellspacing="0" style="margin: 0 auto 20px; background: rgba(0, 255, 136, 0.25); border-radius: 50%;">
                <tr>
                  <td align="center" valign="middle" style="color: #00ff88; font-size: 30px; line-height: 60px;">✓</td>
                </tr>
              </table>
              <h1 style="color: #ffffff; font-size: 28px; margin: 0 0 10px; font-weight: 700;">Welcome, ${firstName}!</h1>
              <p style="color: rgba(255,255,255,0.7); font-size: 16px; margin: 0; line-height: 1.5;">
                You're on your way to joining Smart Agent Alliance at eXp Realty.
              </p>
            </td>
          </tr>

          <!-- Instructions -->
          <tr>
            <td style="padding: 20px 24px 40px;">
              <h2 style="color: #ffd700; font-size: 18px; margin: 0 0 20px; text-transform: uppercase; letter-spacing: 0.05em;">How to Join eXp Realty</h2>

              <!-- Step 1 -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <tr>
                  <td width="40" valign="top">
                    <table width="32" height="32" cellpadding="0" cellspacing="0" style="background-color: #ffd700; border-radius: 50%;">
                      <tr>
                        <td align="center" valign="middle" style="color: #1a1a1a; font-size: 14px; font-weight: 700; line-height: 32px;">1</td>
                      </tr>
                    </table>
                  </td>
                  <td style="padding-left: 12px;">
                    <strong style="color: #ffffff; display: block; margin-bottom: 4px;">Start Your Application</strong>
                    <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin: 0; line-height: 1.5;">
                      Visit <a href="https://joinapp.exprealty.com/" style="color: #ffd700; text-decoration: none;">joinapp.exprealty.com</a> to begin your eXp Realty application.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Step 2 -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <tr>
                  <td width="40" valign="top">
                    <table width="32" height="32" cellpadding="0" cellspacing="0" style="background-color: #ffd700; border-radius: 50%;">
                      <tr>
                        <td align="center" valign="middle" style="color: #1a1a1a; font-size: 14px; font-weight: 700; line-height: 32px;">2</td>
                      </tr>
                    </table>
                  </td>
                  <td style="padding-left: 12px;">
                    <strong style="color: #ffffff; display: block; margin-bottom: 4px;">Search for Your Sponsor</strong>
                    <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin: 0; line-height: 1.5;">
                      Enter <strong style="color: #ffffff;">doug.smart@expreferral.com</strong> and click Search. Select <strong style="color: #ffffff;">Sheldon Douglas Smart</strong> as your sponsor.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Step 3 -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <tr>
                  <td width="40" valign="top">
                    <table width="32" height="32" cellpadding="0" cellspacing="0" style="background-color: #ffd700; border-radius: 50%;">
                      <tr>
                        <td align="center" valign="middle" style="color: #1a1a1a; font-size: 14px; font-weight: 700; line-height: 32px;">3</td>
                      </tr>
                    </table>
                  </td>
                  <td style="padding-left: 12px;">
                    <strong style="color: #ffffff; display: block; margin-bottom: 4px;">Complete Your Application</strong>
                    <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin: 0; line-height: 1.5;">
                      Fill out the application form and submit. You'll receive a confirmation email from eXp.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Step 4 -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <tr>
                  <td width="40" valign="top">
                    <table width="32" height="32" cellpadding="0" cellspacing="0" style="background-color: #ffd700; border-radius: 50%;">
                      <tr>
                        <td align="center" valign="middle" style="color: #1a1a1a; font-size: 14px; font-weight: 700; line-height: 32px;">4</td>
                      </tr>
                    </table>
                  </td>
                  <td style="padding-left: 12px;">
                    <strong style="color: #ffffff; display: block; margin-bottom: 4px;">Activate Your Agent Portal</strong>
                    <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin: 0; line-height: 1.5;">
                      Once your license transfers, you'll receive an email to activate your Smart Agent Alliance portal with all your onboarding materials and resources.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Step 5 -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td width="40" valign="top">
                    <table width="32" height="32" cellpadding="0" cellspacing="0" style="background-color: #ffd700; border-radius: 50%;">
                      <tr>
                        <td align="center" valign="middle" style="color: #1a1a1a; font-size: 14px; font-weight: 700; line-height: 32px;">5</td>
                      </tr>
                    </table>
                  </td>
                  <td style="padding-left: 12px;">
                    <strong style="color: #ffffff; display: block; margin-bottom: 4px;">eXp Realty Support</strong>
                    <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin: 0; line-height: 1.5;">
                      For application issues, call <strong style="color: #ffffff;">833-303-0610</strong> or email <a href="mailto:expertcare@exprealty.com" style="color: #ffd700; text-decoration: none;">expertcare@exprealty.com</a>.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://joinapp.exprealty.com/"
                       style="display: inline-block; padding: 16px 32px; background-color: #ffd700; color: #1a1a1a; text-decoration: none; font-weight: 600; font-size: 14px; letter-spacing: 0.05em; text-transform: uppercase; border-radius: 8px;">
                      Join eXp with SAA
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 24px 30px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center;">
              <p style="color: rgba(255,255,255,0.5); font-size: 13px; margin: 0; line-height: 1.5;">
                Questions? Reply to this email or contact us at<br>
                <a href="mailto:team@smartagentalliance.com" style="color: #ffd700; text-decoration: none;">team@smartagentalliance.com</a>
              </p>
            </td>
          </tr>
        </table>

        <!-- Legal Footer -->
        <table width="100%" style="max-width: 600px; margin-top: 20px;">
          <tr>
            <td style="text-align: center;">
              <p style="color: rgba(255,255,255,0.3); font-size: 11px; margin: 0;">
                © ${new Date().getFullYear()} Smart Agent Alliance. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  try {
    const response = await fetch(`${RESEND_API_BASE}/emails`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [email],
        subject: `Welcome to Smart Agent Alliance, ${firstName}!`,
        html: htmlContent,
        tags: [
          { name: 'category', value: 'welcome-instructions' },
        ],
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('[join-team] Resend email error:', result);
      return { success: false, error: result.message || 'Failed to send email' };
    }

    console.log('[join-team] Welcome email sent:', { messageId: result.id, email });
    return { success: true, messageId: result.id };
  } catch (error) {
    console.error('[join-team] Email send exception:', error);
    return { success: false, error: error.message };
  }
}

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
      console.error('[join-team] Failed to add note:', errorData);
      return { success: false, error: errorData };
    }

    const result = await response.json();
    console.log('[join-team] Note added successfully:', { contactId, noteId: result.note?.id });
    return { success: true, noteId: result.note?.id };
  } catch (error) {
    console.error('[join-team] Note exception:', error);
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

    // Build the referral tag - "Agent Referred" for agent pages, "Website Lead" for main site
    const referralTag = sponsorName ? 'Agent Referred' : 'Website Lead';

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

      // Add note with referring agent's name (only for agent attraction pages)
      if (sponsorName) {
        const noteBody = `Lead referred by agent: ${sponsorName}\nSubmitted via agent attraction page.`;
        await addContactNote(contactId, noteBody, ghlHeaders);
      }

      // Send welcome email for existing contact
      const resendApiKey = env.RESEND_API_KEY;
      if (resendApiKey) {
        const emailResult = await sendWelcomeEmail(firstName, email, sponsorName, resendApiKey);
        console.log('[join-team] Email result (existing contact):', emailResult);
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
              // Add note with referring agent's name (only for agent attraction pages)
              if (sponsorName) {
                const noteBody = `Lead referred by agent: ${sponsorName}\nSubmitted via agent attraction page.`;
                await addContactNote(existingContactId, noteBody, ghlHeaders);
              }

              // Send welcome email
              const resendApiKey = env.RESEND_API_KEY;
              if (resendApiKey) {
                const emailResult = await sendWelcomeEmail(firstName, email, sponsorName, resendApiKey);
                console.log('[join-team] Email result (duplicate contact update):', emailResult);
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
          } else {
            // Tag already exists - still add note if from agent page and send welcome email
            if (sponsorName) {
              const noteBody = `Lead referred by agent: ${sponsorName}\nSubmitted via agent attraction page.`;
              await addContactNote(existingContactId, noteBody, ghlHeaders);
            }

            const resendApiKey = env.RESEND_API_KEY;
            if (resendApiKey) {
              const emailResult = await sendWelcomeEmail(firstName, email, sponsorName, resendApiKey);
              console.log('[join-team] Email result (tag already exists):', emailResult);
            }

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
    const newContactId = createData.contact?.id;

    // Add note with referring agent's name (only for agent attraction pages)
    if (sponsorName && newContactId) {
      const noteBody = `Lead referred by agent: ${sponsorName}\nSubmitted via agent attraction page.`;
      await addContactNote(newContactId, noteBody, ghlHeaders);
    }

    // Send welcome email
    const resendApiKey = env.RESEND_API_KEY;
    if (resendApiKey) {
      const emailResult = await sendWelcomeEmail(firstName, email, sponsorName, resendApiKey);
      console.log('[join-team] Email result:', emailResult);
    } else {
      console.warn('[join-team] RESEND_API_KEY not configured, skipping welcome email');
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
