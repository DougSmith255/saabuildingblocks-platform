/**
 * Password Reset Email Template
 * Phase 3: Password Recovery
 *
 * React Email template structure for password reset emails.
 * Ready for React Email integration (to be implemented by email service agent).
 *
 * Template Variables:
 * - username: User's display name
 * - resetLink: Password reset URL with token
 * - expiresIn: Token expiry time in minutes
 */

import * as React from 'react';

interface PasswordResetEmailProps {
  username: string;
  resetLink: string;
  expiresIn: number;
}

/**
 * Password Reset Email Template
 *
 * This is a structure template for React Email.
 * When React Email is integrated, this will be used to generate
 * the actual HTML email.
 */
export const PasswordResetEmail = ({
  username,
  resetLink,
  expiresIn,
}: Readonly<PasswordResetEmailProps>): {
  subject: string;
  previewText: string;
  html: string;
  text: string;
} => {
  return {
    subject: 'Reset Your Password - Agent Portal',
    previewText: 'Reset your Agent Portal password',
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

          <!-- Header -->
          <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #4F46E5;">
            <h1 style="color: #4F46E5; margin: 0;">Agent Portal</h1>
            <p style="color: #6B7280; margin: 5px 0;">Password Reset Request</p>
          </div>

          <!-- Main Content -->
          <div style="padding: 30px 0;">
            <p style="font-size: 16px;">Hello ${username},</p>

            <p style="font-size: 16px;">
              We received a request to reset your password for your Agent Portal account.
              Click the button below to create a new password:
            </p>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}"
                 style="background: linear-gradient(to right, #3B82F6, #8B5CF6);
                        color: white;
                        padding: 14px 30px;
                        text-decoration: none;
                        border-radius: 8px;
                        font-weight: 600;
                        display: inline-block;
                        font-size: 16px;">
                Reset Password
              </a>
            </div>

            <p style="font-size: 14px; color: #6B7280;">
              Or copy and paste this link into your browser:
            </p>
            <p style="background: #F3F4F6; padding: 12px; border-radius: 6px; word-break: break-all; font-size: 14px; font-family: monospace;">
              ${resetLink}
            </p>

            <!-- Security Info -->
            <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; font-size: 14px; color: #92400E;">
                ⚠️ <strong>Important Security Information:</strong>
              </p>
              <ul style="margin: 10px 0 0 0; padding-left: 20px; font-size: 14px; color: #92400E;">
                <li>This link will expire in ${expiresIn} minutes</li>
                <li>This is a one-time use link</li>
                <li>If you didn't request this, please ignore this email</li>
              </ul>
            </div>

            <!-- Additional Info -->
            <p style="font-size: 14px; color: #6B7280;">
              If you didn't request a password reset, your account is still secure.
              No changes have been made to your account.
            </p>

            <p style="font-size: 14px; color: #6B7280;">
              Need help? Contact our support team at
              <a href="mailto:support@example.com" style="color: #4F46E5; text-decoration: none;">
                support@example.com
              </a>
            </p>
          </div>

          <!-- Footer -->
          <div style="border-top: 2px solid #E5E7EB; padding-top: 20px; text-align: center;">
            <p style="font-size: 12px; color: #9CA3AF; margin: 5px 0;">
              This is an automated message from Agent Portal
            </p>
            <p style="font-size: 12px; color: #9CA3AF; margin: 5px 0;">
              © ${new Date().getFullYear()} Agent Portal. All rights reserved.
            </p>
            <p style="font-size: 12px; color: #9CA3AF; margin: 5px 0;">
              🔒 This email contains sensitive information. Please do not forward.
            </p>
          </div>

        </body>
      </html>
    `,
    text: `
      Hello ${username},

      We received a request to reset your password for your Agent Portal account.

      Reset your password by visiting this link:
      ${resetLink}

      IMPORTANT SECURITY INFORMATION:
      - This link will expire in ${expiresIn} minutes
      - This is a one-time use link
      - If you didn't request this, please ignore this email

      If you didn't request a password reset, your account is still secure.
      No changes have been made to your account.

      Need help? Contact our support team at support@example.com

      ---
      This is an automated message from Agent Portal
      © ${new Date().getFullYear()} Agent Portal. All rights reserved.
      🔒 This email contains sensitive information. Please do not forward.
    `,
  };
};

/**
 * Generate email content for password reset
 * This function can be used directly until React Email is integrated
 */
export function generatePasswordResetEmail(
  username: string,
  resetLink: string,
  expiresIn: number
): { subject: string; html: string; text: string; previewText: string } {
  const result = PasswordResetEmail({ username, resetLink, expiresIn });
  return {
    subject: result.subject,
    html: result.html,
    text: result.text,
    previewText: result.previewText,
  };
}

/**
 * Email template metadata for queue processing
 */
export const passwordResetEmailMetadata = {
  templateName: 'password-reset',
  category: 'security',
  priority: 'high',
  estimatedSize: '15kb',
  requiredVariables: ['username', 'resetLink', 'expiresIn'],
};

/**
 * Type exports for email service integration
 */
export type PasswordResetEmailData = {
  to: string;
  username: string;
  resetLink: string;
  expiresIn: number;
};
