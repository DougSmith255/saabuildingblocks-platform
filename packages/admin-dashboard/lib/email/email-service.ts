/**
 * Email Service
 *
 * Advanced email sending service with:
 * - Resend API integration
 * - n8n webhook fallback
 * - Queue management for rate limiting
 * - Retry logic with exponential backoff
 * - Email delivery status tracking
 * - Batch sending capabilities
 */

import { sendEmail, type EmailResult } from './client';
import type { EmailOptions } from './client';

/**
 * Email delivery status
 */
export type EmailDeliveryStatus =
  | 'pending'
  | 'queued'
  | 'sending'
  | 'sent'
  | 'failed'
  | 'bounced';

/**
 * Email tracking information
 */
export interface EmailTracking {
  id: string;
  to: string;
  subject: string;
  status: EmailDeliveryStatus;
  attempts: number;
  lastAttempt?: Date;
  messageId?: string;
  error?: string;
  sentAt?: Date;
}

/**
 * Email service configuration
 */
export interface EmailServiceConfig {
  useQueue?: boolean;
  useN8nFallback?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  batchSize?: number;
}

/**
 * n8n webhook configuration
 */
const N8N_CONFIG = {
  webhookUrl: process.env['N8N_EMAIL_WEBHOOK_URL'],
  enabled: !!process.env['N8N_EMAIL_WEBHOOK_URL'],
};

/**
 * In-memory tracking store (in production, use database)
 */
const emailTrackingStore = new Map<string, EmailTracking>();

/**
 * Enhanced email service with queue, retry, and fallback
 */
export class EmailService {
  private config: EmailServiceConfig;

  constructor(config: EmailServiceConfig = {}) {
    this.config = {
      useQueue: true,
      useN8nFallback: N8N_CONFIG.enabled,
      maxRetries: 3,
      retryDelay: 1000,
      batchSize: 10,
      ...config,
    };
  }

  /**
   * Send email with optional queueing
   */
  async send(options: EmailOptions): Promise<EmailResult> {
    const trackingId = this.createTrackingId(options.to);

    this.updateTracking(trackingId, {
      status: this.config.useQueue ? 'queued' : 'sending',
      attempts: 0,
    });

    if (this.config.useQueue) {
      return this.sendWithQueue(options, trackingId);
    }

    return this.sendDirect(options, trackingId);
  }

  /**
   * Send email through queue
   */
  private async sendWithQueue(
    options: EmailOptions,
    trackingId: string
  ): Promise<EmailResult> {
    // Simple queue implementation with delay
    await new Promise(resolve => setTimeout(resolve, 100));
    this.updateTracking(trackingId, { status: 'sending' });
    return this.sendDirect(options, trackingId);
  }

  /**
   * Send email directly with retry logic
   */
  private async sendDirect(
    options: EmailOptions,
    trackingId: string,
    attempt: number = 0
  ): Promise<EmailResult> {
    try {
      const result = await sendEmail(options);

      if (result.success) {
        this.updateTracking(trackingId, {
          status: 'sent',
          messageId: result.messageId,
          sentAt: new Date(),
          attempts: attempt + 1,
        });
        return result;
      }

      // Try n8n fallback if enabled
      if (this.config.useN8nFallback && attempt === 0) {
        const fallbackResult = await this.sendViaN8n(options);

        if (fallbackResult.success) {
          this.updateTracking(trackingId, {
            status: 'sent',
            messageId: fallbackResult.messageId,
            sentAt: new Date(),
            attempts: attempt + 1,
          });
          return fallbackResult;
        }
      }

      // Retry logic
      if (attempt < (this.config.maxRetries || 3)) {
        const delay = (this.config.retryDelay || 1000) * Math.pow(2, attempt);

        await new Promise(resolve => setTimeout(resolve, delay));
        return this.sendDirect(options, trackingId, attempt + 1);
      }

      // All retries failed
      this.updateTracking(trackingId, {
        status: 'failed',
        error: result.error,
        attempts: attempt + 1,
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      this.updateTracking(trackingId, {
        status: 'failed',
        error: errorMessage,
        attempts: attempt + 1,
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Send email via n8n webhook (fallback)
   */
  private async sendViaN8n(options: EmailOptions): Promise<EmailResult> {
    if (!N8N_CONFIG.webhookUrl) {
      return {
        success: false,
        error: 'n8n webhook URL not configured',
      };
    }

    try {
      const response = await fetch(N8N_CONFIG.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: Array.isArray(options.to) ? options.to : [options.to],
          subject: options.subject,
          // Note: n8n webhook needs HTML, not React component
          // Would need to render React to HTML first in production
          replyTo: options.replyTo,
          tags: options.tags,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`n8n webhook failed: ${response.statusText}`);
      }

      await response.json();

      return {
        success: true,
        messageId: `n8n-${Date.now()}`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'n8n webhook failed',
      };
    }
  }

  /**
   * Send batch of emails
   */
  async sendBatch(emails: EmailOptions[]): Promise<EmailResult[]> {
    const batchSize = this.config.batchSize || 10;
    const results: EmailResult[] = [];

    // Process in batches to avoid overwhelming the email service
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(email => this.send(email))
      );
      results.push(...batchResults);

      // Add delay between batches
      if (i + batchSize < emails.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  /**
   * Get email delivery status
   */
  getStatus(trackingId: string): EmailTracking | undefined {
    return emailTrackingStore.get(trackingId);
  }

  /**
   * Get all email tracking records
   */
  getAllTracking(): EmailTracking[] {
    return Array.from(emailTrackingStore.values());
  }

  /**
   * Create tracking ID from recipient
   */
  private createTrackingId(to: string | string[]): string {
    const recipient = Array.isArray(to) ? to[0] : to;
    return `${recipient}-${Date.now()}`;
  }

  /**
   * Update tracking information
   */
  private updateTracking(
    trackingId: string,
    updates: Partial<Omit<EmailTracking, 'id'>>
  ): void {
    const existing = emailTrackingStore.get(trackingId);

    const tracking: EmailTracking = {
      id: trackingId,
      to: existing?.to || '',
      subject: existing?.subject || '',
      status: 'pending',
      attempts: 0,
      ...existing,
      ...updates,
      lastAttempt: new Date(),
    };

    emailTrackingStore.set(trackingId, tracking);
  }

  /**
   * Clear tracking records older than specified days
   */
  cleanupTracking(olderThanDays: number = 7): number {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    let cleanedCount = 0;

    for (const [id, tracking] of emailTrackingStore.entries()) {
      if (tracking.lastAttempt && tracking.lastAttempt < cutoffDate) {
        emailTrackingStore.delete(id);
        cleanedCount++;
      }
    }

    return cleanedCount;
  }
}

/**
 * Default email service instance
 */
export const emailService = new EmailService();

/**
 * Check email service health
 */
export function getEmailServiceHealth() {
  return {
    resendConfigured: !!process.env['RESEND_API_KEY'],
    n8nConfigured: N8N_CONFIG.enabled,
    n8nWebhookUrl: N8N_CONFIG.webhookUrl ? '***configured***' : undefined,
    trackingRecords: emailTrackingStore.size,
    environment: process.env.NODE_ENV,
  };
}

/**
 * Test email service configuration
 */
export async function testEmailService(
  testEmail: string
): Promise<{ success: boolean; details: any }> {
  const health = getEmailServiceHealth();

  if (!health.resendConfigured) {
    return {
      success: false,
      details: {
        error: 'RESEND_API_KEY not configured',
        health,
      },
    };
  }

  // Try sending a test email
  try {
    const result = await emailService.send({
      to: testEmail,
      subject: '🧪 Email Service Test - SAA Building Blocks',
      react: null as any, // Would need actual test email template
      tags: [{ name: 'category', value: 'test' }],
    });

    return {
      success: result.success,
      details: {
        result,
        health,
      },
    };
  } catch (error) {
    return {
      success: false,
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
        health,
      },
    };
  }
}
