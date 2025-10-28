/**
 * User Management API - CRUD Operations
 *
 * POST /api/users - Create new user with invitation flow
 *
 * Creates a user account with status 'invited' and sends an activation email.
 * User must activate their account via the email link to set their password.
 * No password is required at creation - this is handled during activation.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';
import { randomBytes, timingSafeEqual } from 'crypto';
import { syncInvitationSent } from '@/lib/gohighlevel/index';
import { sendInvitationEmail } from '@/lib/email/send';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/security/rate-limiter';

export const dynamic = 'force-dynamic';

const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  // Accept first_name + last_name (preferred)
  first_name: z.string().min(1, 'First name is required').optional(),
  last_name: z.string().min(1, 'Last name is required').optional(),
  // Backward compatibility: accept 'name' (from UI) or 'full_name' (from API)
  name: z.string().min(1, 'Name is required').optional(),
  full_name: z.string().min(1, 'Full name is required').optional(),
  username: z.string().optional(),
  role: z.enum(['admin', 'user']).default('user'),
}).refine(data => {
  // Require either first_name + last_name OR full_name OR name
  return (data.first_name && data.last_name) || data.full_name || data.name;
}, {
  message: 'Either first_name + last_name, full_name, or name is required',
});

/**
 * POST /api/users - Create new user with invitation flow
 *
 * Authentication: Basic Auth (credentials from environment variables)
 *
 * Request body:
 * - full_name (required): Full name of the user
 * - email (required): Email address (must be unique)
 * - username (optional): Username (defaults to email prefix)
 * - role (optional): User role (defaults to 'user')
 *
 * Response:
 * - 201: User created and invitation sent
 * - 400: Invalid input (missing fields, invalid email)
 * - 401: Unauthorized (missing or invalid auth header)
 * - 403: Invalid credentials
 * - 409: User with email already exists
 * - 500: Server error or invitation creation failed
 *
 * Flow:
 * 1. Validate authentication credentials
 * 2. Validate input (full_name, email format)
 * 3. Check if user already exists
 * 4. Create user with status 'invited' (no password)
 * 5. Generate secure invitation token
 * 6. Create invitation record in database
 * 7. Send invitation email with activation link
 * 8. Create GoHighLevel contact for CRM integration
 */
export async function POST(request: NextRequest) {
  try {
    // Basic authentication validation
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Basic ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString();
    const [username, authPassword] = credentials.split(':');

    // Load credentials from environment variables
    const envUser = process.env.API_BASIC_AUTH_USER;
    const envPass = process.env.API_BASIC_AUTH_PASSWORD;

    // CRITICAL: Ensure environment variables are configured
    if (!envUser || !envPass) {
      console.error('[AUTH ERROR] API_BASIC_AUTH_USER or API_BASIC_AUTH_PASSWORD not configured');
      return NextResponse.json({
        error: 'Server configuration error - authentication not configured'
      }, { status: 500 });
    }

    // Timing-safe comparison to prevent timing attacks
    const userMatch = username.length === envUser.length &&
      timingSafeEqual(Buffer.from(username), Buffer.from(envUser));
    const passMatch = authPassword.length === envPass.length &&
      timingSafeEqual(Buffer.from(authPassword), Buffer.from(envPass));

    if (!userMatch || !passMatch) {
      console.warn('[AUTH FAILED] Invalid credentials attempt', {
        providedUser: username,
        providedPassword: authPassword,
        expectedUser: envUser,
        expectedPassword: envPass,
        userLengthMatch: username.length === envUser.length,
        passLengthMatch: authPassword.length === envPass.length,
        userMatch,
        passMatch,
        timestamp: new Date().toISOString()
      });
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 403 });
    }

    console.log('[AUTH SUCCESS] Valid credentials provided');

    // Rate limiting - 5 requests per minute per IP for user creation
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('cf-connecting-ip') ||
               request.headers.get('x-real-ip') ||
               'unknown';
    const rateLimitResult = checkRateLimit({
      maxRequests: 5,
      windowMs: 60000, // 1 minute
      identifier: `user-creation:${ip}`,
    });

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          retryAfter: rateLimitResult.retryAfter
        },
        { status: 429 }
      );
    }

    const supabase = getSupabaseServiceClient();

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection unavailable' },
        { status: 503 }
      );
    }

    const body = await request.json();

    // Validate request body with Zod
    const validationResult = createUserSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.format()
        },
        { status: 400 }
      );
    }

    const {
      email,
      password: userPassword,
      first_name,
      last_name,
      full_name,
      name,
      username: requestedUsername,
      role
    } = validationResult.data;

    // Determine first_name and last_name with backward compatibility
    let firstName: string;
    let lastName: string;
    let fullName: string;

    if (first_name && last_name) {
      // Preferred: use first_name + last_name directly
      firstName = first_name;
      lastName = last_name;
      fullName = `${first_name} ${last_name}`;
    } else {
      // Backward compatibility: split full_name or name
      const nameToSplit = full_name || name || '';
      const nameParts = nameToSplit.split(' ');
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
      fullName = nameToSplit;
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Generate secure invitation token
    const invitationToken = randomBytes(32).toString('hex');

    // Create user with 'invited' status (no password yet)
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        first_name: firstName,
        last_name: lastName,
        full_name: fullName, // Store for backward compatibility
        email,
        username: requestedUsername || email.split('@')[0],
        role,
        status: 'invited', // User must activate account via email
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (createError) {
      return NextResponse.json(
        { error: 'Failed to create user', details: createError.message },
        { status: 500 }
      );
    }

    // Create invitation record
    const { error: invitationError } = await supabase
      .from('user_invitations')
      .insert({
        user_id: newUser.id,
        email: email,
        first_name: firstName,
        last_name: lastName,
        full_name: fullName, // Store for backward compatibility
        token: invitationToken,
        status: 'pending',
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        created_at: new Date().toISOString(),
      });

    if (invitationError) {
      // Rollback user creation if invitation fails
      await supabase.from('users').delete().eq('id', newUser.id);
      return NextResponse.json(
        { error: 'Failed to create invitation', details: invitationError.message },
        { status: 500 }
      );
    }

    // Send invitation email (non-blocking - failure doesn't prevent user creation)
    let emailStatus = {
      sent: false,
      messageId: null as string | null,
      error: null as string | null,
      timestamp: null as string | null,
      serviceProvider: null as string | null,
      attempts: 0,
    };

    try {
      const emailResult = await sendInvitationEmail({
        to: email,
        first_name: firstName,
        last_name: lastName,
        full_name: fullName, // Include for backward compatibility
        activationToken: invitationToken,
      });

      // Track email status for response
      emailStatus = {
        sent: emailResult.success,
        messageId: emailResult.messageId || null,
        error: emailResult.error || null,
        timestamp: emailResult.timestamp || null,
        serviceProvider: emailResult.serviceProvider || null,
        attempts: emailResult.attempts || 0,
      };

      if (!emailResult.success) {
        // Mark invitation as failed but don't rollback user
        await supabase
          .from('user_invitations')
          .update({
            status: 'failed',
            email_error: emailResult.error,
            email_attempts: emailResult.attempts,
          })
          .eq('token', invitationToken);

        console.error('❌ [USER API] Email send failed:', {
          userId: newUser.id,
          email,
          error: emailResult.error,
          attempts: emailResult.attempts,
        });
      } else {
        // Update invitation with email metadata
        await supabase
          .from('user_invitations')
          .update({
            email_message_id: emailResult.messageId,
            email_sent_at: emailResult.timestamp,
            email_provider: emailResult.serviceProvider,
            email_attempts: emailResult.attempts,
            status: 'sent', // Update status to 'sent' when email succeeds
          })
          .eq('token', invitationToken);

        console.log('✅ [USER API] Email sent successfully:', {
          userId: newUser.id,
          email,
          messageId: emailResult.messageId,
          timestamp: emailResult.timestamp,
          provider: emailResult.serviceProvider,
          attempts: emailResult.attempts,
        });
      }
    } catch (emailError) {
      // Log email error but don't fail the request
      const errorMessage = emailError instanceof Error ? emailError.message : 'Unknown error';
      console.error('❌ [USER API] Email send exception:', {
        userId: newUser.id,
        email,
        error: errorMessage,
      });

      emailStatus.error = errorMessage;
    }

    // Sync to GoHighLevel CRM (non-blocking - failure doesn't prevent user creation)
    try {
      await syncInvitationSent({
        userId: newUser.id,
        email,
        firstName: firstName,
        lastName: lastName,
        phone: undefined, // Phone not collected during invitation
        invitationToken,
        status: 'sent',
      });
    } catch (ghlError) {
      // Silently continue - GHL sync failure is not critical
    }

    return NextResponse.json({
      success: true,
      data: {
        id: newUser.id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        full_name: newUser.full_name,
        username: newUser.username,
        role: newUser.role,
        status: newUser.status,
      },
      emailStatus,
      message: emailStatus.sent
        ? 'Invitation sent successfully. User must activate their account via email.'
        : 'User created but email delivery failed. Please manually resend invitation.',
    }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
