/**
 * Email Client - Resend API Wrapper
 *
 * Handles email sending with Resend API, including error handling,
 * retry logic, and development mode fallbacks.
 */

import { Resend } from 'resend';

// Initialize Resend client
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Email configuration
export const EMAIL_CONFIG = {
  from: process.env.EMAIL_FROM || 'Agent Portal <noreply@smartagentalliance.com>',
  replyTo: process.env.EMAIL_REPLY_TO || 'support@smartagentalliance.com',
  maxRetries: 3,
  retryDelay: 1000, // 1 second
};

/**
 * Email sending options
 */
export interface EmailOptions {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
  replyTo?: string;
  tags?: { name: string; value: string }[];
}

/**
 * Email sending result with detailed status tracking
 */
export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  timestamp?: string;
  recipient?: string | string[];
  serviceProvider?: string;
  attempts?: number;
  responseData?: any;
}

/**
 * Send email with retry logic
 */
export async function sendEmail(
  options: EmailOptions,
  retryCount = 0
): Promise<EmailResult> {
  const timestamp = new Date().toISOString();
  const recipient = options.to;

  // Development mode - log to console instead of sending
  if (!resend || process.env.NODE_ENV === 'development') {
    console.log('📧 [DEV MODE] Email would be sent:', {
      to: options.to,
      subject: options.subject,
      from: EMAIL_CONFIG.from,
      timestamp,
    });

    return {
      success: true,
      messageId: `dev-${Date.now()}`,
      timestamp,
      recipient,
      serviceProvider: 'development',
      attempts: 1,
    };
  }

  try {
    const result = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      react: options.react,
      replyTo: options.replyTo || EMAIL_CONFIG.replyTo,
      tags: options.tags,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    console.log('✅ Email sent successfully:', {
      messageId: result.data?.id,
      to: options.to,
      subject: options.subject,
      timestamp,
      attempts: retryCount + 1,
    });

    return {
      success: true,
      messageId: result.data?.id,
      timestamp,
      recipient,
      serviceProvider: 'resend',
      attempts: retryCount + 1,
      responseData: result.data,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    console.error('❌ Email sending failed:', {
      error: errorMessage,
      attempt: retryCount + 1,
      to: options.to,
      subject: options.subject,
      timestamp,
    });

    // Retry logic
    if (retryCount < EMAIL_CONFIG.maxRetries) {
      console.log(`🔄 Retrying email send (attempt ${retryCount + 2}/${EMAIL_CONFIG.maxRetries + 1})...`);

      // Wait before retrying
      await new Promise(resolve =>
        setTimeout(resolve, EMAIL_CONFIG.retryDelay * (retryCount + 1))
      );

      return sendEmail(options, retryCount + 1);
    }

    return {
      success: false,
      error: errorMessage,
      timestamp,
      recipient,
      serviceProvider: 'resend',
      attempts: retryCount + 1,
    };
  }
}

/**
 * Validate email configuration
 */
export function validateEmailConfig(): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!process.env.RESEND_API_KEY) {
    errors.push('RESEND_API_KEY is not configured');
  }

  if (!process.env.EMAIL_FROM) {
    errors.push('EMAIL_FROM is not configured');
  }

  if (!process.env.NEXT_PUBLIC_APP_URL) {
    errors.push('NEXT_PUBLIC_APP_URL is not configured');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get email client status
 */
export function getEmailClientStatus() {
  return {
    configured: !!resend,
    isDevelopment: process.env.NODE_ENV === 'development',
    from: EMAIL_CONFIG.from,
    replyTo: EMAIL_CONFIG.replyTo,
  };
}
