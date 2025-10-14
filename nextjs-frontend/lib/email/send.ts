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
import { InvitationEmail } from './templates/InvitationEmail';

/**
 * Send password reset email with token link
 */
export async function sendPasswordResetEmail(
  email: string,
  username: string,
  resetToken: string,
  expiresInMinutes: number = 15
): Promise<EmailResult> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://saabuildingblocks.com';
  const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

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
        { name: 'category', value: 'password-reset' },
        { name: 'username', value: username },
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
        { name: 'category', value: 'username-reminder' },
        { name: 'username', value: username },
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
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(
  email: string,
  username: string,
  temporaryPassword: string
): Promise<EmailResult> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://saabuildingblocks.com';
  const loginUrl = `${baseUrl}/login`;

  try {
    const result = await sendEmail({
      to: email,
      subject: 'Welcome to Smart Agent Alliance! 🎉',
      react: WelcomeEmail({
        username,
        email,
        temporaryPassword,
        loginUrl,
      }),
      tags: [
        { name: 'category', value: 'welcome' },
        { name: 'username', value: username },
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
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://saabuildingblocks.com';
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
        { name: 'category', value: 'account-locked' },
        { name: 'username', value: username },
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
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://saabuildingblocks.com';
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
        { name: 'category', value: 'email-verification' },
        { name: 'username', value: username },
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
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://saabuildingblocks.com';
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
        { name: 'category', value: 'email-change-verification' },
        { name: 'username', value: username },
        { name: 'old_email', value: oldEmail },
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
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://saabuildingblocks.com';
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
        { name: 'category', value: 'email-change-confirmation' },
        { name: 'username', value: username },
        { name: 'new_email', value: newEmail },
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
 * Send invitation email to new user with activation link
 *
 * @param to - Recipient email address
 * @param first_name - Invitee's first name (preferred)
 * @param last_name - Invitee's last name (preferred)
 * @param full_name - Invitee's full name (backward compatibility)
 * @param activationToken - Secure activation token
 * @param inviterName - Optional name of person who sent invitation
 * @param role - User role (for customized messaging)
 * @param expiresInDays - Days until invitation expires (default: 7)
 */
export async function sendInvitationEmail({
  to,
  first_name,
  last_name,
  full_name,
  activationToken,
  inviterName,
  role = 'user',
  expiresInDays = 7,
}: {
  to: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  activationToken: string;
  inviterName?: string;
  role?: string;
  expiresInDays?: number;
}): Promise<EmailResult> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://saabuildingblocks.com';
  const activationLink = `${baseUrl}/activate?token=${activationToken}`;
  const expiresIn = expiresInDays === 1 ? '24 hours' : `${expiresInDays} days`;

  // Determine full name for email template
  const recipientFullName = full_name || (first_name && last_name ? `${first_name} ${last_name}` : first_name || 'User');

  // Comprehensive logging before sending
  console.log('📧 [INVITATION EMAIL] Preparing to send invitation:', {
    recipient: to,
    recipientName: recipientFullName,
    role,
    inviterName: inviterName || 'System',
    expiresInDays,
    timestamp: new Date().toISOString(),
  });

  try {
    const result = await sendEmail({
      to,
      subject: inviterName
        ? `${inviterName} invited you to SAA Building Blocks`
        : 'Your SAA Building Blocks Invitation',
      react: InvitationEmail({
        full_name: recipientFullName,
        activationLink,
        expiresIn,
        inviterName,
        role,
      }),
      tags: [
        { name: 'category', value: 'invitation' },
        { name: 'role', value: role },
        // Note: Removed name-based tags as they can contain spaces/special chars
        // which violate Resend's tag constraint (ASCII letters, numbers, _, - only)
      ],
    });

    // Log detailed success information
    if (result.success) {
      console.log('✅ [INVITATION EMAIL] Successfully sent:', {
        messageId: result.messageId,
        recipient: to,
        recipientName: recipientFullName,
        timestamp: result.timestamp,
        serviceProvider: result.serviceProvider,
        attempts: result.attempts,
      });
    } else {
      console.error('❌ [INVITATION EMAIL] Failed to send:', {
        recipient: to,
        error: result.error,
        timestamp: result.timestamp,
        attempts: result.attempts,
      });
    }

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ [INVITATION EMAIL] Exception during send:', {
      recipient: to,
      error: errorMessage,
      timestamp: new Date().toISOString(),
    });

    return {
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString(),
      recipient: to,
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
