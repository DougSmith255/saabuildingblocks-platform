/**
 * GoHighLevel Webhook: Active Downline Tag Added
 *
 * POST /api/webhooks/ghl-active-downline
 *
 * Triggered when the "active downline" tag is added to a contact in GHL.
 * Creates a user record and sends activation email.
 *
 * When the user activates their account, the agent_pages record will be created
 * by the /api/invitations/complete-activation endpoint.
 *
 * GHL Webhook Payload (example):
 * {
 *   contact: {
 *     id: string;
 *     firstName: string;
 *     lastName: string;
 *     email: string;
 *     phone: string;
 *     customFields: {
 *       "Email Additional": string;  // The email to use for the agent page
 *     };
 *   };
 *   tag: string;  // The tag that was added
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';
import { sendWelcomeEmail } from '@/lib/email/send';
import { AGENT_PAGE_DEFAULTS } from '@/lib/agent-page-defaults';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  console.log('🔔 [GHL WEBHOOK] Received active downline webhook');

  // Security: All traffic reaches this endpoint via Cloudflare Tunnel only.
  // Port 3002 is denied by UFW — no direct public access is possible.
  // Verify the request came through Cloudflare as an additional safeguard.
  const cfRay = request.headers.get('cf-ray');
  if (!cfRay) {
    console.error('[GHL WEBHOOK] Request did not come through Cloudflare');
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const supabase = getSupabaseServiceClient();

    if (!supabase) {
      console.error('❌ [GHL WEBHOOK] Database connection unavailable');
      return NextResponse.json(
        { error: 'Database connection unavailable' },
        { status: 503 }
      );
    }

    // Parse the webhook payload
    const payload = await request.json();
    console.log('📦 [GHL WEBHOOK] Payload:', JSON.stringify(payload, null, 2));

    // Extract contact data - handle different GHL webhook formats
    // GHL sends custom data fields at the root level of the payload
    // along with standard data like attributionSource

    // Log full payload structure for debugging
    console.log('🔍 [GHL WEBHOOK] Payload keys:', Object.keys(payload));

    // First check root level (custom data from GHL workflow)
    // Then check nested contact object (standard GHL format)
    const contact = payload.contact || payload.data?.contact || payload.data || {};

    // Handle various GHL field naming conventions
    // Check root payload first (custom data), then contact object (standard data)
    const firstName = payload.firstName || payload.first_name ||
                      contact.firstName || contact.first_name ||
                      contact.name?.split(' ')[0] || '';
    const lastName = payload.lastName || payload.last_name ||
                     contact.lastName || contact.last_name ||
                     contact.name?.split(' ').slice(1).join(' ') || '';
    const ghlContactId = payload.contactId || payload.contact_id || payload.id ||
                         contact.id || contact.contactId || contact.contact_id || null;

    // Get email - check root level first, then contact object
    const customFields = contact.customFields || contact.custom_fields || {};
    const emailAdditional = customFields['Email Additional'] || customFields['email_additional'];
    const email = payload.email || payload.Email ||
                  emailAdditional || contact.email || contact.Email || '';

    const phone = payload.phone || payload.phoneNumber ||
                  contact.phone || contact.phoneNumber || '';

    // Validate required fields
    if (!firstName || !lastName) {
      console.error('❌ [GHL WEBHOOK] Missing required name fields. Full payload:', JSON.stringify(payload, null, 2));
      return NextResponse.json(
        {
          error: 'Missing required fields: firstName, lastName',
          receivedPayloadKeys: Object.keys(payload),
          receivedContactKeys: Object.keys(contact),
          hint: 'Check GHL webhook configuration to ensure contact firstName and lastName are included'
        },
        { status: 400 }
      );
    }

    if (!email) {
      console.error('❌ [GHL WEBHOOK] Missing email');
      return NextResponse.json(
        { error: 'Missing required field: email (or Email Additional custom field)' },
        { status: 400 }
      );
    }

    console.log('👤 [GHL WEBHOOK] Processing contact:', {
      firstName,
      lastName,
      email,
      ghlContactId,
      phone: phone ? '***' : 'not provided',
    });

    // Check if user with this email already exists (case-insensitive)
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id, email, status, gohighlevel_contact_id')
      .ilike('email', email)
      .single();

    if (existingUser) {
      // User already exists
      if (existingUser.status === 'active') {
        console.log('✅ [GHL WEBHOOK] User already active, checking for agent page');

        // Check if they already have an agent page
        const { data: existingPage } = await supabase
          .from('agent_pages')
          .select('id, slug')
          .eq('user_id', existingUser.id)
          .single();

        if (existingPage) {
          return NextResponse.json({
            success: true,
            message: 'User already active with agent page',
            userId: existingUser.id,
            pageSlug: existingPage.slug,
          });
        }

        // Create agent page for existing active user
        const slug = await generateUniqueSlug(supabase, firstName, lastName);
        const { data: newPage, error: pageError } = await supabase
          .from('agent_pages')
          .insert({
            user_id: existingUser.id,
            slug,
            display_first_name: firstName,
            display_last_name: lastName,
            email,
            ...AGENT_PAGE_DEFAULTS,
          })
          .select()
          .single();

        if (pageError) {
          console.error('❌ [GHL WEBHOOK] Error creating agent page:', pageError);
        } else {
          console.log('✅ [GHL WEBHOOK] Created agent page for existing user:', newPage.slug);
        }

        return NextResponse.json({
          success: true,
          message: 'Agent page created for existing active user',
          userId: existingUser.id,
          pageSlug: newPage?.slug,
        });
      }

      if (existingUser.status === 'invited') {
        console.log('⚠️ [GHL WEBHOOK] User already invited, pending activation');
        return NextResponse.json({
          success: true,
          message: 'User already has pending invitation',
          userId: existingUser.id,
        });
      }
    }

    // Create new user with 'invited' status
    const fullName = `${firstName} ${lastName}`;
    const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');

    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({
        first_name: firstName,
        last_name: lastName,
        full_name: fullName,
        email,
        username,
        role: 'user',
        status: 'invited',
        gohighlevel_contact_id: ghlContactId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (userError) {
      console.error('❌ [GHL WEBHOOK] Error creating user:', userError);
      return NextResponse.json(
        { error: 'Failed to create user', details: userError.message },
        { status: 500 }
      );
    }

    console.log('✅ [GHL WEBHOOK] Created user:', newUser.id);

    // Generate Supabase native invite link
    const activationBaseUrl = 'https://smartagentalliance.com';
    const redirectTo = `${activationBaseUrl}/agent-portal/activate`;

    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'invite',
      email,
      options: { redirectTo },
    });

    if (linkError || !linkData?.properties?.hashed_token) {
      console.error('❌ [GHL WEBHOOK] Error generating invite link:', linkError);
      return NextResponse.json({
        success: true,
        message: 'User created but invitation link generation failed.',
        userId: newUser.id,
        error: linkError?.message,
      });
    }

    const hashedToken = linkData.properties.hashed_token;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    // Create invitation record
    const { data: invitation, error: invitationError } = await supabase
      .from('user_invitations')
      .insert({
        user_id: newUser.id,
        email,
        token_hash: hashedToken,
        status: 'pending',
        expires_at: expiresAt,
        invited_by: newUser.id,
        sent_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (invitationError || !invitation) {
      console.error('❌ [GHL WEBHOOK] Error creating invitation:', invitationError);
      return NextResponse.json({
        success: true,
        message: 'User created but invitation record failed.',
        userId: newUser.id,
        invitationError: invitationError?.message,
      });
    }

    // Link Supabase auth user
    if (linkData.user?.id) {
      await supabase
        .from('users')
        .update({ auth_user_id: linkData.user.id })
        .eq('id', newUser.id);
    }

    console.log('✅ [GHL WEBHOOK] Created invitation:', invitation.id);

    // Send activation email
    try {
      const emailResult = await sendWelcomeEmail(
        email,
        firstName,
        hashedToken,
        168 // 7 days in hours
      );

      if (emailResult.success) {
        console.log('✅ [GHL WEBHOOK] Activation email sent:', emailResult.messageId);
      } else {
        console.error('❌ [GHL WEBHOOK] Failed to send activation email:', emailResult.error);
      }
    } catch (emailError) {
      console.error('❌ [GHL WEBHOOK] Email error:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'User created and activation email sent',
      userId: newUser.id,
      invitationId: invitation.id,
    });

  } catch (error) {
    console.error('❌ [GHL WEBHOOK] Error processing webhook:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Generate unique slug from name
 */
async function generateUniqueSlug(
  supabase: ReturnType<typeof getSupabaseServiceClient>,
  firstName: string,
  lastName: string
): Promise<string> {
  const base = `${firstName}-${lastName}`
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  let slug = base;
  let counter = 0;

  while (true) {
    const checkSlug = counter === 0 ? slug : `${slug}-${counter}`;
    const { data: existing } = await supabase!
      .from('agent_pages')
      .select('id')
      .eq('slug', checkSlug)
      .single();

    if (!existing) {
      return checkSlug;
    }
    counter++;
  }
}

/**
 * GET /api/webhooks/ghl-active-downline - Health check / info
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/webhooks/ghl-active-downline',
    description: 'GoHighLevel webhook for "active downline" tag - creates user and sends activation email',
    flow: [
      '1. GHL fires webhook when "active downline" tag is added',
      '2. Webhook creates user with status=invited',
      '3. Activation email is sent to the agent',
      '4. Agent clicks link and activates account',
      '5. On activation, agent_pages record is created',
    ],
    requiredFields: {
      contact: {
        firstName: 'required',
        lastName: 'required',
        email: 'required (or customFields["Email Additional"])',
        phone: 'optional',
      },
    },
  });
}
