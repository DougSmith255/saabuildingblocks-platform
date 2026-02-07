/**
 * Email Sending Functions
 *
 * High-level functions to send specific email types with proper
 * error handling, logging, and retry logic.
 */

import { sendEmail, type EmailResult } from './client';
import { PasswordResetEmail } from './templates/PasswordResetEmail';
import { UsernameReminderEmail } from './templates/UsernameReminderEmail';
import { WelcomeEmail } from './templates/WelcomeEmail';
import { AccountLockedEmail } from './templates/AccountLockedEmail';
import { ApplyInstructionsEmail } from './templates/ApplyInstructionsEmail';

/**
 * Send password reset email with token link
 */
export async function sendPasswordResetEmail(
  email: string,
  username: string,
  resetToken: string,
  expiresInMinutes: number = 15
): Promise<EmailResult> {
  // Link goes to login page with reset_token param, which opens the reset password modal
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://saabuildingblocks.pages.dev';
  const resetLink = `${baseUrl}/agent-portal/login?reset_token=${resetToken}`;

  try {
    const result = await sendEmail({
      to: email,
      subject: 'Reset Your Password - Smart Agent Alliance',
      react: PasswordResetEmail({
        username,
        resetLink,
        expiresInMinutes,
      }),
      tags: [
        { name: 'category', value: 'password_reset' },
      ],
    });

    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Sanitize a string for use as a Resend tag value
 * Resend tags only allow ASCII letters, numbers, underscores, and dashes
 */
function sanitizeTagValue(value: string | null | undefined): string {
  if (!value || typeof value !== 'string') {
    return 'unknown';
  }
  // Replace any non-allowed characters with underscore, limit to 100 chars
  const sanitized = value.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 100);
  // Ensure we don't return empty string (Resend might reject it)
  return sanitized || 'unknown';
}

/**
 * Send username reminder email
 */
export async function sendUsernameReminderEmail(
  email: string,
  username: string
): Promise<EmailResult> {
  try {
    const result = await sendEmail({
      to: email,
      subject: 'Your Username - Smart Agent Alliance',
      react: UsernameReminderEmail({
        username,
        email,
      }),
      tags: [
        { name: 'category', value: 'username_reminder' },
      ],
    });

    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send welcome/activation email to new users
 */
export async function sendWelcomeEmail(
  email: string,
  firstName: string,
  activationToken: string,
  expiresInHours: number = 48
): Promise<EmailResult> {
  // Use Cloudflare Pages URL for activation (public-facing site)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://saabuildingblocks.pages.dev';
  const activationLink = `${baseUrl}/agent-portal/activate?token=${activationToken}`;

  try {
    const result = await sendEmail({
      to: email,
      subject: 'Welcome to Smart Agent Alliance - Activate Your Account',
      react: WelcomeEmail({
        firstName,
        activationLink,
        expiresInHours,
      }),
      tags: [
        { name: 'category', value: 'welcome_activation' },
      ],
    });

    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send account locked notification email
 */
export async function sendAccountLockedEmail(
  email: string,
  username: string,
  unlockTime: Date,
  reason?: string
): Promise<EmailResult> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://saabuildingblocks.pages.dev';
  const supportUrl = `${baseUrl}/contact`;

  try {
    const result = await sendEmail({
      to: email,
      subject: '🔒 Account Locked - Smart Agent Alliance',
      react: AccountLockedEmail({
        username,
        unlockTime,
        reason,
        supportUrl,
      }),
      tags: [
        { name: 'category', value: 'account_locked' },
      ],
    });

    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send email verification email (for future use)
 */
export async function sendEmailVerificationEmail(
  email: string,
  username: string,
  verificationToken: string
): Promise<EmailResult> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://saabuildingblocks.pages.dev';
  const verificationLink = `${baseUrl}/verify-email?token=${verificationToken}`;

  try {
    const result = await sendEmail({
      to: email,
      subject: 'Verify Your Email - Smart Agent Alliance',
      react: PasswordResetEmail({
        // Reusing template for now, can create dedicated one later
        username,
        resetLink: verificationLink,
        expiresInMinutes: 24 * 60, // 24 hours
      }),
      tags: [
        { name: 'category', value: 'email_verification' },
      ],
    });

    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send email change verification email
 */
export async function sendEmailChangeVerification(
  newEmail: string,
  username: string,
  oldEmail: string,
  verificationToken: string,
  expiresInHours: number = 24
): Promise<EmailResult> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://saabuildingblocks.pages.dev';
  const verificationLink = `${baseUrl}/verify-email-change/${verificationToken}`;

  try {
    const result = await sendEmail({
      to: newEmail,
      subject: 'Verify Your Email Change - Smart Agent Alliance',
      react: PasswordResetEmail({
        // Reusing template for now, can create dedicated one later
        username,
        resetLink: verificationLink,
        expiresInMinutes: expiresInHours * 60,
      }),
      tags: [
        { name: 'category', value: 'email_change_verification' },
      ],
    });

    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send email change confirmation to old email
 */
export async function sendEmailChangeConfirmation(
  oldEmail: string,
  username: string,
  newEmail: string
): Promise<EmailResult> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://saabuildingblocks.pages.dev';
  const supportUrl = `${baseUrl}/contact`;

  try {
    const result = await sendEmail({
      to: oldEmail,
      subject: '✅ Email Changed Successfully - Smart Agent Alliance',
      react: AccountLockedEmail({
        // Reusing template for now, can create dedicated one later
        username,
        unlockTime: new Date(),
        reason: `Your email has been changed to ${newEmail}. If you did not authorize this change, please contact support immediately.`,
        supportUrl,
      }),
      tags: [
        { name: 'category', value: 'email_change_confirmation' },
      ],
    });

    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Batch send emails (for future use - notifications, newsletters, etc.)
 */
export async function sendBatchEmails(
  emails: Array<{
    to: string;
    subject: string;
    react: React.ReactElement;
    tags?: { name: string; value: string }[];
  }>
): Promise<EmailResult[]> {
  const results = await Promise.all(
    emails.map(email => sendEmail(email))
  );

  return results;
}

/**
 * Email queue for rate limiting (basic implementation)
 */
class EmailQueue {
  private queue: Array<() => Promise<EmailResult>> = [];
  private processing = false;
  private readonly delayMs = 100; // 100ms between emails

  async add(emailFn: () => Promise<EmailResult>): Promise<EmailResult> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await emailFn();
          resolve(result);
          return result;
        } catch (error) {
          reject(error);
          throw error;
        }
      });

      if (!this.processing) {
        this.process();
      }
    });
  }

  private async process(): Promise<void> {
    this.processing = true;

    while (this.queue.length > 0) {
      const emailFn = this.queue.shift();
      if (emailFn) {
        try {
          await emailFn();
          await new Promise(resolve => setTimeout(resolve, this.delayMs));
        } catch (error) {
          console.error('Email queue processing error:', error);
        }
      }
    }

    this.processing = false;
  }
}

// Export singleton queue instance
export const emailQueue = new EmailQueue();

/**
 * Send Apply Instructions email to someone interested in joining eXp
 *
 * @param recipientEmail - Recipient's email address
 * @param recipientFirstName - Recipient's first name
 * @param agentName - Sponsoring agent's display name
 * @param agentEmail - Sponsoring agent's email (for application)
 */
export async function sendApplyInstructionsEmail({
  recipientEmail,
  recipientFirstName,
  agentName,
  agentEmail,
}: {
  recipientEmail: string;
  recipientFirstName: string;
  agentName: string;
  agentEmail: string;
}): Promise<EmailResult> {
  console.log('📧 [APPLY INSTRUCTIONS] Preparing to send:', {
    recipient: recipientEmail,
    recipientName: recipientFirstName,
    sponsorAgent: agentName,
    timestamp: new Date().toISOString(),
  });

  try {
    const result = await sendEmail({
      to: recipientEmail,
      subject: 'How to Join The Alliance at eXp',
      react: ApplyInstructionsEmail({
        recipientFirstName,
        agentName,
        agentEmail,
      }),
      tags: [
        { name: 'category', value: 'apply_instructions' },
      ],
    });

    if (result.success) {
      console.log('✅ [APPLY INSTRUCTIONS] Successfully sent:', {
        messageId: result.messageId,
        recipient: recipientEmail,
        timestamp: result.timestamp,
      });
    } else {
      console.error('❌ [APPLY INSTRUCTIONS] Failed to send:', {
        recipient: recipientEmail,
        error: result.error,
      });
    }

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ [APPLY INSTRUCTIONS] Exception during send:', {
      recipient: recipientEmail,
      error: errorMessage,
    });

    return {
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString(),
      recipient: recipientEmail,
    };
  }
}
