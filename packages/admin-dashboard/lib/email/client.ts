/**
 * Email Client - Resend API Wrapper
 *
 * Handles email sending with Resend API, including error handling,
 * retry logic, and development mode fallbacks.
 *
 * Now integrated with Infisical for secure secret management.
 */

import { Resend } from 'resend';
import {
  getResendApiKey,
  getEmailFrom,
  getEmailReplyTo,
} from '../infisical';

// Lazy-loaded Resend client (will be initialized on first use)
let resendClient: Resend | null = null;
let emailConfigCache: {
  from: string;
  replyTo: string;
  initialized: boolean;
} = {
  from: 'Smart Agent Alliance <team@smartagentalliance.com>',
  replyTo: 'team@smartagentalliance.com',
  initialized: false,
};

/**
 * Initialize the Resend client with secrets from Infisical
 */
async function initializeResendClient(): Promise<Resend | null> {
  if (resendClient) {
    return resendClient;
  }

  try {
    const apiKey = await getResendApiKey();
    if (apiKey) {
      resendClient = new Resend(apiKey);
      console.log('[Email] Resend client initialized with Infisical secrets');
    } else if (process.env.RESEND_API_KEY) {
      // Fallback to environment variable
      resendClient = new Resend(process.env.RESEND_API_KEY);
      console.log('[Email] Resend client initialized with environment variable');
    }
  } catch (error) {
    console.error('[Email] Failed to initialize Resend client:', error);
    // Try environment variable fallback
    if (process.env.RESEND_API_KEY) {
      resendClient = new Resend(process.env.RESEND_API_KEY);
      console.log('[Email] Resend client initialized with environment variable (fallback)');
    }
  }

  return resendClient;
}

/**
 * Load email configuration from Infisical
 */
async function loadEmailConfig(): Promise<typeof emailConfigCache> {
  if (emailConfigCache.initialized) {
    return emailConfigCache;
  }

  try {
    const [from, replyTo] = await Promise.all([
      getEmailFrom(),
      getEmailReplyTo(),
    ]);

    emailConfigCache = {
      from: from || process.env.EMAIL_FROM || 'Smart Agent Alliance <team@smartagentalliance.com>',
      replyTo: replyTo || process.env.EMAIL_REPLY_TO || 'team@smartagentalliance.com',
      initialized: true,
    };
    console.log('[Email] Email config loaded from Infisical');
  } catch (error) {
    console.warn('[Email] Failed to load config from Infisical, using defaults:', error);
    emailConfigCache = {
      from: process.env.EMAIL_FROM || 'Smart Agent Alliance <team@smartagentalliance.com>',
      replyTo: process.env.EMAIL_REPLY_TO || 'team@smartagentalliance.com',
      initialized: true,
    };
  }

  return emailConfigCache;
}

// Email configuration (now async, with sync fallback for backwards compatibility)
export const EMAIL_CONFIG = {
  get from() { return emailConfigCache.from; },
  get replyTo() { return emailConfigCache.replyTo; },
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

  // Ensure config is loaded
  await loadEmailConfig();

  // Initialize Resend client from Infisical
  const resend = await initializeResendClient();

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
    // Sanitize tags — Resend only allows ASCII letters, numbers, underscores, dashes
    const sanitizedTags = options.tags?.map(tag => ({
      name: tag.name.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 100) || 'unknown',
      value: tag.value.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 100) || 'unknown',
    }));

    const result = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      react: options.react,
      replyTo: options.replyTo || EMAIL_CONFIG.replyTo,
      tags: sanitizedTags,
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
export async function validateEmailConfig(): Promise<{
  isValid: boolean;
  errors: string[];
  source: 'infisical' | 'environment' | 'none';
}> {
  const errors: string[] = [];
  let source: 'infisical' | 'environment' | 'none' = 'none';

  // Try to load from Infisical first
  try {
    const apiKey = await getResendApiKey();
    if (apiKey) {
      source = 'infisical';
    } else if (process.env.RESEND_API_KEY) {
      source = 'environment';
    } else {
      errors.push('RESEND_API_KEY is not configured in Infisical or environment');
    }
  } catch {
    if (process.env.RESEND_API_KEY) {
      source = 'environment';
    } else {
      errors.push('RESEND_API_KEY is not configured');
    }
  }

  await loadEmailConfig();

  if (!EMAIL_CONFIG.from) {
    errors.push('EMAIL_FROM is not configured');
  }

  if (!process.env.NEXT_PUBLIC_APP_URL) {
    errors.push('NEXT_PUBLIC_APP_URL is not configured');
  }

  return {
    isValid: errors.length === 0,
    errors,
    source,
  };
}

/**
 * Get email client status
 */
export async function getEmailClientStatus() {
  await loadEmailConfig();
  const resend = await initializeResendClient();

  return {
    configured: !!resend,
    isDevelopment: process.env.NODE_ENV === 'development',
    from: EMAIL_CONFIG.from,
    replyTo: EMAIL_CONFIG.replyTo,
    secretSource: resendClient ? 'initialized' : 'pending',
  };
}
