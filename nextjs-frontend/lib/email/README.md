# Email System Documentation

## Overview

The email system provides a robust, production-ready email service with:

- **React Email Templates** - Type-safe, component-based email templates
- **Resend Integration** - Primary email delivery via Resend API
- **n8n Webhook Fallback** - Automatic fallback to n8n workflows
- **Queue Management** - Rate limiting and batch processing
- **Retry Logic** - Exponential backoff for failed sends
- **Email Tracking** - Delivery status and monitoring
- **API Routes** - RESTful endpoints for backend integration

## Quick Start

### 1. Send an Invitation Email

```typescript
import { sendInvitationEmail } from '@/lib/email/send';

const result = await sendInvitationEmail({
  to: 'user@example.com',
  firstName: 'John',
  activationToken: 'secure-token-123',
  inviterName: 'Jane Smith', // Optional
  role: 'user', // Optional: 'user' or 'admin'
  expiresInDays: 7, // Optional: default 7
});

if (result.success) {
  console.log('Email sent:', result.messageId);
} else {
  console.error('Email failed:', result.error);
}
```

### 2. Use Email Service with Advanced Features

```typescript
import { emailService } from '@/lib/email/email-service';

// Send with queue and retry
const result = await emailService.send({
  to: 'user@example.com',
  subject: 'Welcome to SAA',
  react: <InvitationEmail {...props} />,
  tags: [{ name: 'category', value: 'invitation' }],
});

// Send batch emails
const results = await emailService.sendBatch([
  { to: 'user1@example.com', subject: 'Hello', react: <Email1 /> },
  { to: 'user2@example.com', subject: 'Hello', react: <Email2 /> },
]);

// Check delivery status
const status = emailService.getStatus(trackingId);
console.log('Email status:', status);
```

### 3. Call Email API from Backend

```bash
curl -X POST https://saabuildingblocks.com/api/email/send-invitation \
  -H "Content-Type: application/json" \
  -d '{
    "to": "user@example.com",
    "firstName": "John",
    "activationToken": "secure-token-123",
    "inviterName": "Jane Smith",
    "role": "user",
    "expiresInDays": 7
  }'
```

## Configuration

### Environment Variables

```bash
# Required for production
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Email sender configuration
EMAIL_FROM="Agent Portal <noreply@smartagentalliance.com>"
EMAIL_REPLY_TO="support@smartagentalliance.com"

# App URL for links
NEXT_PUBLIC_APP_URL=https://saabuildingblocks.com

# Optional: n8n webhook fallback
N8N_EMAIL_WEBHOOK_URL=https://n8n.saabuildingblocks.com/webhook/email

# Test email for development
TEST_EMAIL=your@email.com
```

### Email Service Configuration

```typescript
import { EmailService } from '@/lib/email/email-service';

const emailService = new EmailService({
  useQueue: true, // Enable queue (default: true)
  useN8nFallback: true, // Enable n8n fallback (default: if configured)
  maxRetries: 3, // Max retry attempts (default: 3)
  retryDelay: 1000, // Initial retry delay in ms (default: 1000)
  batchSize: 10, // Batch size for bulk sends (default: 10)
});
```

## Email Templates

### Invitation Email

**Location:** `lib/email/templates/InvitationEmail.tsx`

**Props:**
```typescript
interface InvitationEmailProps {
  firstName: string;         // Required: Recipient's first name
  activationLink: string;     // Required: Activation URL with token
  expiresIn: string;          // Required: Expiration time (e.g., "7 days")
  inviterName?: string;       // Optional: Name of person who invited
  role?: string;              // Optional: User role ('user' or 'admin')
}
```

**Features:**
- Professional SAA Building Blocks branding
- Personalized greeting with invitee name
- Optional inviter attribution
- Clear "Accept Invitation" CTA button
- Security information and expiration notice
- Support contact information
- Footer with company info and links

**Template Structure:**
```tsx
<EmailLayout preview={`${firstName}, you're invited to join SAA Building Blocks`}>
  <EmailHeading>You're Invited! 🎉</EmailHeading>

  <EmailParagraph>Hello {firstName},</EmailParagraph>

  {inviterName && (
    <EmailParagraph>
      <strong>{inviterName}</strong> has invited you...
    </EmailParagraph>
  )}

  <EmailButton href={activationLink}>Accept Invitation</EmailButton>

  <EmailAlert type="warning">
    <strong>⏰ Time-Sensitive:</strong> This invitation expires in {expiresIn}
  </EmailAlert>

  <EmailAlert type="info">
    <strong>🔒 Security Note:</strong> This link is unique and secure
  </EmailAlert>

  <EmailAlert type="success">
    <strong>💡 Need Help?</strong> Contact support@saabuildingblocks.com
  </EmailAlert>
</EmailLayout>
```

### Shared Components

All templates use these shared components from `templates/components/Layout.tsx`:

- `EmailLayout` - Main layout with header, footer, and responsive design
- `EmailHeading` - Styled heading component
- `EmailParagraph` - Body text component
- `EmailButton` - CTA button component
- `EmailCode` - Monospace code display
- `EmailAlert` - Alert boxes (info, warning, error, success)

## API Routes

### POST /api/email/send-invitation

Send an invitation email.

**Request:**
```json
{
  "to": "user@example.com",
  "firstName": "John",
  "activationToken": "secure-token-123",
  "inviterName": "Jane Smith",  // Optional
  "role": "user",                 // Optional: 'user' or 'admin'
  "expiresInDays": 7             // Optional: default 7
}
```

**Response (Success):**
```json
{
  "success": true,
  "messageId": "msg_xxxxx"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Error message"
}
```

**Rate Limiting:**
- 10 emails per minute per IP address
- Returns 429 status if exceeded

**Validation:**
- All required fields must be provided
- Email must be valid format
- Token must be non-empty

### GET /api/email/send-invitation

Health check for email service.

**Response:**
```json
{
  "status": "ok",
  "endpoint": "/api/email/send-invitation",
  "health": {
    "resendConfigured": true,
    "n8nConfigured": true,
    "trackingRecords": 42,
    "environment": "production"
  },
  "rateLimit": {
    "limit": 10,
    "window": "60s"
  }
}
```

## Testing

### Run Test Script

Preview email templates in browser:

```bash
# Render templates to HTML files
npx tsx scripts/test-invitation-email.tsx

# Send test email (requires RESEND_API_KEY)
TEST_EMAIL=your@email.com npx tsx scripts/test-invitation-email.tsx
```

### Run Unit Tests

```bash
# Run all email tests
npm test lib/email/__tests__

# Run specific test
npm test lib/email/__tests__/invitation-email.test.tsx
```

### Manual Testing Checklist

- [ ] Basic invitation renders correctly
- [ ] Invitation with inviter name shows attribution
- [ ] Admin role shows different content
- [ ] Activation link is correct
- [ ] Expiration notice is visible
- [ ] Security information is included
- [ ] Support email is present
- [ ] Footer has correct company info
- [ ] Responsive design works on mobile
- [ ] Dark mode is handled properly
- [ ] All links are clickable
- [ ] Email delivers successfully
- [ ] Rate limiting works

## Email Delivery Flow

```mermaid
graph TD
    A[Backend API] -->|POST request| B[/api/email/send-invitation]
    B -->|Validate| C{Valid?}
    C -->|No| D[Return 400 Error]
    C -->|Yes| E{Rate Limit OK?}
    E -->|No| F[Return 429 Error]
    E -->|Yes| G[sendInvitationEmail]
    G --> H{Use Queue?}
    H -->|Yes| I[Add to Queue]
    H -->|No| J[Send Directly]
    I --> J
    J --> K{Resend API}
    K -->|Success| L[Return Success]
    K -->|Failure| M{n8n Fallback?}
    M -->|Yes| N[Try n8n Webhook]
    M -->|No| O{Retry?}
    N -->|Success| L
    N -->|Failure| O
    O -->|Yes| P[Exponential Backoff]
    O -->|No| Q[Return Failure]
    P --> J
```

## Error Handling

### Automatic Retry Logic

The email service automatically retries failed sends:

1. **First Attempt** - Try Resend API
2. **n8n Fallback** - If enabled, try n8n webhook
3. **Retry with Backoff** - Exponential backoff (1s, 2s, 4s)
4. **Max Retries** - Stop after 3 attempts
5. **Return Error** - Log error and return failure

### Error Codes

| Code | Description | Action |
|------|-------------|--------|
| 400 | Invalid request | Fix request parameters |
| 429 | Rate limit exceeded | Wait and retry |
| 500 | Email service error | Check configuration |
| 503 | Service unavailable | Check Resend status |

### Common Issues

**RESEND_API_KEY not configured:**
```bash
# Add to .env.local
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

**Email not delivering:**
```bash
# Check Resend dashboard
https://resend.com/emails

# Check email service health
curl https://saabuildingblocks.com/api/email/send-invitation
```

**Rate limiting issues:**
```bash
# Increase rate limit in route.ts
const RATE_LIMIT = 20; // 20 emails per minute
```

## Production Checklist

Before deploying email system to production:

- [ ] Configure RESEND_API_KEY
- [ ] Set EMAIL_FROM domain (must be verified in Resend)
- [ ] Set EMAIL_REPLY_TO to support email
- [ ] Configure NEXT_PUBLIC_APP_URL
- [ ] Test email delivery end-to-end
- [ ] Verify rate limiting works
- [ ] Set up n8n webhook fallback (optional)
- [ ] Monitor email delivery rates
- [ ] Set up error alerting
- [ ] Document email templates for team
- [ ] Add email tracking to database (optional)

## Best Practices

1. **Always use queue in production** - Prevents overwhelming email service
2. **Enable n8n fallback** - Ensures delivery even if Resend fails
3. **Log partial tokens only** - Don't log full activation tokens
4. **Monitor delivery rates** - Track success/failure rates
5. **Clean up tracking data** - Remove old tracking records periodically
6. **Test before deploying** - Use test script to verify templates
7. **Use tags for categorization** - Makes email analytics easier
8. **Handle errors gracefully** - Always return proper error messages
9. **Validate inputs** - Check email format and required fields
10. **Rate limit API endpoints** - Prevent abuse and spam

## Support

For issues with the email system:

1. Check service health: `GET /api/email/send-invitation`
2. Review logs for error messages
3. Test with test script: `npx tsx scripts/test-invitation-email.tsx`
4. Contact DevOps team if Resend issues
5. Check n8n workflows if fallback enabled

## Future Enhancements

- [ ] Email template editor in Master Controller
- [ ] Email analytics dashboard
- [ ] A/B testing for templates
- [ ] Email scheduling
- [ ] Unsubscribe management
- [ ] Email verification tracking
- [ ] Webhooks for delivery status
- [ ] Multi-language support
- [ ] Custom branding per organization
- [ ] Email preview before sending
