// Force dynamic rendering - exclude from static export
export const dynamic = 'error';

/**
 * GoHighLevel Webhook Handler
 *
 * Handles webhook events from GoHighLevel CRM:
 * - ContactCreate: New contact created
 * - ContactUpdate: Contact information updated
 * - ContactTagUpdate: Contact tags changed
 *
 * Security:
 * - Verifies webhook signature using RSA public key
 * - Logs all events to database for audit trail
 * - Updates Supabase when contact status changes
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { sendInvitationEmail } from '@/lib/email/send';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// GoHighLevel webhook verification public key
// This should be obtained from GoHighLevel dashboard
const GHL_PUBLIC_KEY = process.env.GHL_WEBHOOK_PUBLIC_KEY || '';

interface WebhookEvent {
  type: 'ContactCreate' | 'ContactUpdate' | 'ContactTagUpdate';
  locationId: string;
  id: string;
  contact: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    tags?: string[];
    customFields?: Record<string, any>;
    source?: string;
    dateAdded: string;
    dateUpdated?: string;
  };
  timestamp: string;
}

/**
 * Verify webhook signature using RSA-SHA256
 */
function verifyWebhookSignature(
  payload: string,
  signature: string,
  publicKey: string
): boolean {
  try {
    // If no public key is configured, log warning but allow in development
    if (!publicKey) {
      console.warn('⚠️ GHL webhook signature verification disabled - no public key configured');
      if (process.env.NODE_ENV === 'production') {
        return false;
      }
      return true; // Allow in development
    }

    const verify = crypto.createVerify('RSA-SHA256');
    verify.update(payload);
    verify.end();

    const isValid = verify.verify(publicKey, signature, 'base64');
    return isValid;
  } catch (error) {
    console.error('❌ Webhook signature verification failed:', error);
    return false;
  }
}

/**
 * Log webhook event to database
 */
async function logWebhookEvent(
  event: WebhookEvent,
  status: 'success' | 'failed',
  error?: string
): Promise<void> {
  try {
    await supabase.from('webhook_logs').insert({
      source: 'gohighlevel',
      event_type: event.type,
      event_id: event.id,
      contact_id: event.contact.id,
      payload: event,
      status,
      error_message: error,
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error('❌ Failed to log webhook event:', err);
  }
}

/**
 * Handle ContactCreate event
 */
async function handleContactCreate(event: WebhookEvent): Promise<void> {
  const { contact } = event;

  // Check if user invitation exists
  const { data: invitation } = await supabase
    .from('user_invitations')
    .select('*')
    .eq('email', contact.email)
    .single();

  if (invitation) {
    // Update invitation status
    await supabase
      .from('user_invitations')
      .update({
        ghl_contact_id: contact.id,
        status: 'contact_created',
        updated_at: new Date().toISOString(),
      })
      .eq('id', invitation.id);

    console.log(`✅ Updated invitation ${invitation.id} with GHL contact ${contact.id}`);
  } else {
    // Create new user invitation from GHL contact
    await supabase.from('user_invitations').insert({
      email: contact.email,
      name: `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || contact.email,
      ghl_contact_id: contact.id,
      status: 'contact_created',
      created_at: new Date().toISOString(),
    });

    console.log(`✅ Created invitation for GHL contact ${contact.id}`);
  }
}

/**
 * Handle ContactUpdate event
 */
async function handleContactUpdate(event: WebhookEvent): Promise<void> {
  const { contact } = event;

  // Update user invitation if exists
  const { data: invitation } = await supabase
    .from('user_invitations')
    .select('*')
    .eq('ghl_contact_id', contact.id)
    .single();

  if (invitation) {
    await supabase
      .from('user_invitations')
      .update({
        name: `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || contact.email,
        updated_at: new Date().toISOString(),
      })
      .eq('id', invitation.id);

    console.log(`✅ Updated invitation ${invitation.id} from GHL contact update`);
  }

  // Update user profile if exists
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('ghl_contact_id', contact.id)
    .single();

  if (profile) {
    await supabase
      .from('user_profiles')
      .update({
        full_name: `${contact.firstName || ''} ${contact.lastName || ''}`.trim(),
        phone: contact.phone,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profile.id);

    console.log(`✅ Updated user profile ${profile.id} from GHL contact update`);
  }
}

/**
 * Handle ContactTagUpdate event
 */
async function handleContactTagUpdate(event: WebhookEvent): Promise<void> {
  const { contact } = event;
  const tags = contact.tags || [];

  // Check for Active Downline tag - create user invitation
  if (tags.includes('Active Downline') || tags.includes('active-downline')) {
    console.log('🎯 Active Downline tag detected - creating user invitation');

    // Extract contact data
    const email = contact.email;
    const firstName = contact.firstName || '';
    const lastName = contact.lastName || '';
    const name = `${firstName} ${lastName}`.trim();

    if (!email) {
      console.error('❌ Cannot create user: email missing from GHL contact');
      return;
    }

    // Check if user invitation already exists
    const { data: existingInvitation } = await supabase
      .from('user_invitations')
      .select('id, status')
      .eq('email', email)
      .single();

    if (existingInvitation) {
      console.log('ℹ️  User invitation already exists:', {
        email,
        invitationId: existingInvitation.id,
        status: existingInvitation.status,
      });

      // Update with GHL contact ID if not set
      if (existingInvitation) {
        await supabase
          .from('user_invitations')
          .update({
            ghl_contact_id: contact.id,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingInvitation.id);
      }
      return;
    }

    // Create invitation token
    const invitationToken = crypto.randomBytes(32).toString('hex');

    // Create user invitation
    const { data: newInvitation, error: invitationError } = await supabase
      .from('user_invitations')
      .insert({
        email,
        name: name || email,
        ghl_contact_id: contact.id,
        token: invitationToken,
        status: 'pending',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single();

    if (invitationError) {
      console.error('❌ Failed to create user invitation:', invitationError);
      throw invitationError;
    }

    console.log('✅ User invitation created:', {
      invitationId: newInvitation.id,
      email,
      name,
    });

    // Send invitation email
    try {
      await sendInvitationEmail({
        to: email,
        full_name: name || email,
        activationToken: invitationToken,
      });

      console.log('✅ Invitation email sent successfully to:', email);
    } catch (emailError) {
      console.error('❌ Failed to send invitation email:', emailError);
      // Don't throw - invitation is created, email can be retried
    }
  }

  // Check for account activation tag
  if (tags.includes('account-activated')) {
    const { data: invitation } = await supabase
      .from('user_invitations')
      .select('*')
      .eq('ghl_contact_id', contact.id)
      .single();

    if (invitation && invitation.status !== 'activated') {
      await supabase
        .from('user_invitations')
        .update({
          status: 'activated',
          activated_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', invitation.id);

      console.log(`✅ Activated user invitation ${invitation.id} from tag update`);
    }
  }

  // Check for account suspension tag
  if (tags.includes('account-suspended')) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('ghl_contact_id', contact.id)
      .single();

    if (profile && profile.status !== 'suspended') {
      await supabase
        .from('user_profiles')
        .update({
          status: 'suspended',
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      console.log(`✅ Suspended user profile ${profile.id} from tag update`);
    }
  }
}

/**
 * POST /api/webhooks/gohighlevel
 *
 * Webhook endpoint for GoHighLevel events
 */
export async function POST(request: NextRequest) {
  try {
    // Get webhook signature from headers
    const signature = request.headers.get('x-ghl-signature') || '';

    // Get raw body for signature verification
    const rawBody = await request.text();

    // Verify signature
    if (!verifyWebhookSignature(rawBody, signature, GHL_PUBLIC_KEY)) {
      console.error('❌ Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse webhook event
    const event: WebhookEvent = JSON.parse(rawBody);

    console.log(`📩 Received webhook: ${event.type} for contact ${event.contact.id}`);

    // Handle different event types
    try {
      switch (event.type) {
        case 'ContactCreate':
          await handleContactCreate(event);
          break;

        case 'ContactUpdate':
          await handleContactUpdate(event);
          break;

        case 'ContactTagUpdate':
          await handleContactTagUpdate(event);
          break;

        default:
          console.warn(`⚠️ Unknown event type: ${event.type}`);
      }

      // Log success
      await logWebhookEvent(event, 'success');

      return NextResponse.json({ success: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Error processing webhook:`, error);

      // Log failure
      await logWebhookEvent(event, 'failed', errorMessage);

      return NextResponse.json(
        { error: 'Processing failed', details: errorMessage },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}

/**
 * GET /api/webhooks/gohighlevel
 *
 * Webhook verification endpoint (optional)
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    webhook: 'gohighlevel',
    timestamp: new Date().toISOString(),
  });
}
