/**
 * Username Reminder Email Template
 *
 * React Email template for username recovery.
 * This template structure can be used with @react-email/components
 *
 * To use this template:
 * 1. Install: npm install @react-email/components
 * 2. Import this component
 * 3. Render with your email service (SendGrid, AWS SES, etc.)
 */

import React from 'react';

interface UsernameReminderEmailProps {
  username: string;
  recipientEmail: string;
  loginUrl?: string;
}

/**
 * Username Reminder Email Template
 *
 * @param username - The user's username
 * @param recipientEmail - The recipient's email address
 * @param loginUrl - Optional login page URL
 */
export function UsernameReminderEmail({
  username,
  recipientEmail,
  loginUrl = 'https://your-domain.com/login',
}: UsernameReminderEmailProps) {
  return {
    subject: 'Your Agent Portal Username',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Username Reminder</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
            text-align: center;
            color: #ffffff;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
          }
          .content {
            padding: 40px 30px;
          }
          .username-box {
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 20px;
            margin: 30px 0;
            border-radius: 4px;
          }
          .username-box h2 {
            margin: 0 0 10px 0;
            font-size: 14px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .username-box p {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            color: #333;
            font-family: 'Courier New', Courier, monospace;
          }
          .cta-button {
            display: inline-block;
            padding: 14px 32px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
            transition: opacity 0.2s;
          }
          .cta-button:hover {
            opacity: 0.9;
          }
          .security-notice {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 30px 0;
            border-radius: 4px;
            font-size: 14px;
            color: #856404;
          }
          .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            font-size: 14px;
            color: #666;
            border-top: 1px solid #e9ecef;
          }
          .footer p {
            margin: 5px 0;
          }
          .footer a {
            color: #667eea;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <h1>Agent Portal</h1>
          </div>

          <!-- Content -->
          <div class="content">
            <h2 style="color: #333; margin-top: 0;">Username Reminder</h2>
            <p>Hello,</p>
            <p>You requested a username reminder for your Agent Portal account associated with <strong>${recipientEmail}</strong>.</p>

            <!-- Username Display -->
            <div class="username-box">
              <h2>Your Username</h2>
              <p>${username}</p>
            </div>

            <p>You can now use this username to log in to your Agent Portal account.</p>

            <center>
              <a href="${loginUrl}" class="cta-button">Go to Login Page</a>
            </center>

            <!-- Security Notice -->
            <div class="security-notice">
              <strong>⚠️ Security Notice:</strong><br>
              If you did not request this username reminder, please contact support immediately.
              Your account security may be at risk.
            </div>

            <p style="margin-top: 30px; color: #666; font-size: 14px;">
              <strong>Need help?</strong> If you're having trouble logging in or have forgotten your password,
              please visit our support page or contact our team.
            </p>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p><strong>Agent Portal</strong></p>
            <p>This is an automated message. Please do not reply to this email.</p>
            <p style="margin-top: 20px; font-size: 12px; color: #999;">
              © ${new Date().getFullYear()} Agent Portal. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Agent Portal - Username Reminder

Hello,

You requested a username reminder for your Agent Portal account associated with ${recipientEmail}.

YOUR USERNAME: ${username}

You can now use this username to log in to your Agent Portal account.

Login here: ${loginUrl}

SECURITY NOTICE:
If you did not request this username reminder, please contact support immediately. Your account security may be at risk.

Need help? If you're having trouble logging in or have forgotten your password, please visit our support page or contact our team.

---
Agent Portal
This is an automated message. Please do not reply to this email.
© ${new Date().getFullYear()} Agent Portal. All rights reserved.
    `.trim(),
  };
}

/**
 * Example usage:
 *
 * ```typescript
 * import { UsernameReminderEmail } from '@/lib/email/templates/username-reminder';
 * import { sendEmail } from '@/lib/email/service';
 *
 * const emailContent = UsernameReminderEmail({
 *   username: 'john_doe',
 *   recipientEmail: 'john@example.com',
 *   loginUrl: 'https://portal.example.com/login',
 * });
 *
 * await sendEmail({
 *   to: 'john@example.com',
 *   subject: emailContent.subject,
 *   html: emailContent.html,
 *   text: emailContent.text,
 * });
 * ```
 */

export default UsernameReminderEmail;
