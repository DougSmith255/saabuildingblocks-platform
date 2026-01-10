// Force dynamic rendering - exclude from static export
export const dynamic = 'force-dynamic';

/**
 * Email Testing API
 *
 * Test endpoint for manually testing email templates and delivery.
 * Only available in development mode.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  sendPasswordResetEmail,
  sendUsernameReminderEmail,
  sendWelcomeEmail,
  sendAccountLockedEmail,
} from '@/lib/email/send';
import { validateEmailConfig, getEmailClientStatus } from '@/lib/email/client';

// Only allow in development
const isDevelopment = process.env.NODE_ENV === 'development';

export async function GET(request: NextRequest) {
  if (!isDevelopment) {
    return NextResponse.json(
      { error: 'This endpoint is only available in development mode' },
      { status: 403 }
    );
  }

  // Return email service status (now async)
  const config = await validateEmailConfig();
  const status = await getEmailClientStatus();

  return NextResponse.json({
    status: 'Email Test Endpoint',
    environment: process.env.NODE_ENV,
    emailService: {
      errors: config.errors,
      source: config.source,
      ...status,
    },
    availableTemplates: [
      'password-reset',
      'username-reminder',
      'welcome',
      'account-locked',
    ],
    usage: {
      method: 'POST',
      body: {
        template: 'password-reset | username-reminder | welcome | account-locked',
        email: 'recipient@example.com',
        data: '{ /* template-specific data */ }',
      },
    },
    examples: {
      passwordReset: {
        template: 'password-reset',
        email: 'user@example.com',
        data: {
          username: 'testuser',
          resetToken: 'test-token-123',
        },
      },
      usernameReminder: {
        template: 'username-reminder',
        email: 'user@example.com',
        data: {
          username: 'testuser',
        },
      },
      welcome: {
        template: 'welcome',
        email: 'newuser@example.com',
        data: {
          username: 'newuser',
          temporaryPassword: 'TempPass123!',
        },
      },
      accountLocked: {
        template: 'account-locked',
        email: 'locked@example.com',
        data: {
          username: 'lockeduser',
          unlockTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
          reason: 'Too many failed login attempts',
        },
      },
    },
  });
}

export async function POST(request: NextRequest) {
  if (!isDevelopment) {
    return NextResponse.json(
      { error: 'This endpoint is only available in development mode' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { template, email, data } = body;

    if (!template || !email) {
      return NextResponse.json(
        { error: 'template and email are required' },
        { status: 400 }
      );
    }

    let result;

    switch (template) {
      case 'password-reset':
        if (!data?.username || !data?.resetToken) {
          return NextResponse.json(
            { error: 'username and resetToken are required for password-reset template' },
            { status: 400 }
          );
        }
        result = await sendPasswordResetEmail(
          email,
          data.username,
          data.resetToken,
          data.expiresInMinutes || 15
        );
        break;

      case 'username-reminder':
        if (!data?.username) {
          return NextResponse.json(
            { error: 'username is required for username-reminder template' },
            { status: 400 }
          );
        }
        result = await sendUsernameReminderEmail(email, data.username);
        break;

      case 'welcome':
        if (!data?.username || !data?.temporaryPassword) {
          return NextResponse.json(
            { error: 'username and temporaryPassword are required for welcome template' },
            { status: 400 }
          );
        }
        result = await sendWelcomeEmail(
          email,
          data.username,
          data.temporaryPassword
        );
        break;

      case 'account-locked':
        if (!data?.username || !data?.unlockTime) {
          return NextResponse.json(
            { error: 'username and unlockTime are required for account-locked template' },
            { status: 400 }
          );
        }
        result = await sendAccountLockedEmail(
          email,
          data.username,
          new Date(data.unlockTime),
          data.reason
        );
        break;

      default:
        return NextResponse.json(
          { error: `Unknown template: ${template}` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: result.success,
      message: result.success ? 'Email sent successfully' : 'Email sending failed',
      messageId: result.messageId,
      error: result.error,
      template,
      recipient: email,
    });
  } catch (error) {
    console.error('Email test error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
