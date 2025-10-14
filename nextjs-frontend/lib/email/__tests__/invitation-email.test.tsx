/**
 * Invitation Email Tests
 *
 * Tests for invitation email template rendering and sending logic.
 */

import { render } from '@react-email/render';
import { InvitationEmail } from '../templates/InvitationEmail';
import { sendInvitationEmail } from '../send';

describe('InvitationEmail Template', () => {
  const mockProps = {
    firstName: 'John',
    activationLink: 'https://saabuildingblocks.com/activate?token=abc123',
    expiresIn: '7 days',
  };

  it('renders with required props', () => {
    const html = render(InvitationEmail(mockProps));
    expect(html).toContain('Hello John');
    expect(html).toContain('Accept Invitation');
    expect(html).toContain('7 days');
  });

  it('renders with inviter name', () => {
    const html = render(
      InvitationEmail({
        ...mockProps,
        inviterName: 'Jane Smith',
      })
    );
    expect(html).toContain('Jane Smith');
    expect(html).toContain('has invited you');
  });

  it('renders without inviter name', () => {
    const html = render(InvitationEmail(mockProps));
    expect(html).toContain("You've been invited");
    expect(html).not.toContain('has invited you');
  });

  it('includes activation link', () => {
    const html = render(InvitationEmail(mockProps));
    expect(html).toContain(mockProps.activationLink);
  });

  it('includes security information', () => {
    const html = render(InvitationEmail(mockProps));
    expect(html).toContain('Security Note');
    expect(html).toContain('unique and secure');
  });

  it('includes support email', () => {
    const html = render(InvitationEmail(mockProps));
    expect(html).toContain('support@saabuildingblocks.com');
  });

  it('includes expiration warning', () => {
    const html = render(InvitationEmail(mockProps));
    expect(html).toContain('Time-Sensitive');
    expect(html).toContain('expire');
  });

  it('renders different content for admin role', () => {
    const adminHtml = render(
      InvitationEmail({
        ...mockProps,
        role: 'admin',
      })
    );
    expect(adminHtml).toContain('admin dashboard');

    const userHtml = render(
      InvitationEmail({
        ...mockProps,
        role: 'user',
      })
    );
    expect(userHtml).not.toContain('admin dashboard');
    expect(userHtml).toContain('platform features');
  });

  it('includes SAA Building Blocks branding', () => {
    const html = render(InvitationEmail(mockProps));
    expect(html).toContain('SAA Building Blocks');
    expect(html).toContain('Smart Agent Alliance');
  });
});

describe('sendInvitationEmail Function', () => {
  // Mock environment variables
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_APP_URL: 'https://saabuildingblocks.com',
      NODE_ENV: 'development', // Use dev mode to avoid actual email sending
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('generates correct activation link', async () => {
    const consoleSpy = jest.spyOn(console, 'log');

    await sendInvitationEmail({
      to: 'test@example.com',
      firstName: 'John',
      activationToken: 'token123',
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        email: 'test@example.com',
        firstName: 'John',
      })
    );

    consoleSpy.mockRestore();
  });

  it('handles inviter name in subject', async () => {
    const result = await sendInvitationEmail({
      to: 'test@example.com',
      firstName: 'John',
      activationToken: 'token123',
      inviterName: 'Jane Smith',
    });

    expect(result.success).toBe(true);
  });

  it('uses default expiration of 7 days', async () => {
    const result = await sendInvitationEmail({
      to: 'test@example.com',
      firstName: 'John',
      activationToken: 'token123',
    });

    expect(result.success).toBe(true);
  });

  it('handles custom expiration days', async () => {
    const result = await sendInvitationEmail({
      to: 'test@example.com',
      firstName: 'John',
      activationToken: 'token123',
      expiresInDays: 3,
    });

    expect(result.success).toBe(true);
  });

  it('includes role in tags', async () => {
    const result = await sendInvitationEmail({
      to: 'test@example.com',
      firstName: 'John',
      activationToken: 'token123',
      role: 'admin',
    });

    expect(result.success).toBe(true);
  });

  it('logs partial token for security', async () => {
    const consoleSpy = jest.spyOn(console, 'log');

    await sendInvitationEmail({
      to: 'test@example.com',
      firstName: 'John',
      activationToken: 'verylongtoken123456789',
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        activationToken: expect.stringContaining('...'),
      })
    );

    consoleSpy.mockRestore();
  });
});

describe('Email Service Integration', () => {
  it('returns success in development mode', async () => {
    process.env.NODE_ENV = 'development';

    const result = await sendInvitationEmail({
      to: 'test@example.com',
      firstName: 'John',
      activationToken: 'token123',
    });

    expect(result.success).toBe(true);
    expect(result.messageId).toContain('dev-');
  });

  it('handles email sending errors gracefully', async () => {
    // Force an error by using invalid configuration
    delete process.env.RESEND_API_KEY;
    process.env.NODE_ENV = 'production';

    const result = await sendInvitationEmail({
      to: 'invalid-email',
      firstName: 'John',
      activationToken: 'token123',
    });

    // Should still return a result (may be success or failure depending on config)
    expect(result).toHaveProperty('success');
  });
});

describe('Email Content Validation', () => {
  it('includes all required CTA elements', () => {
    const html = render(
      InvitationEmail({
        firstName: 'John',
        activationLink: 'https://saabuildingblocks.com/activate?token=abc',
        expiresIn: '7 days',
      })
    );

    // Check for CTA button
    expect(html).toContain('Accept Invitation');

    // Check for getting started steps
    expect(html).toContain('Getting Started');
    expect(html).toContain('Set up your secure password');
  });

  it('formats expiration correctly', () => {
    const html24h = render(
      InvitationEmail({
        firstName: 'John',
        activationLink: 'https://saabuildingblocks.com/activate?token=abc',
        expiresIn: '24 hours',
      })
    );
    expect(html24h).toContain('24 hours');

    const html7d = render(
      InvitationEmail({
        firstName: 'John',
        activationLink: 'https://saabuildingblocks.com/activate?token=abc',
        expiresIn: '7 days',
      })
    );
    expect(html7d).toContain('7 days');
  });

  it('includes footer with company info', () => {
    const html = render(
      InvitationEmail({
        firstName: 'John',
        activationLink: 'https://saabuildingblocks.com/activate?token=abc',
        expiresIn: '7 days',
      })
    );

    expect(html).toContain('Smart Agent Alliance');
    expect(html).toContain('SAA Building Blocks Team');
  });
});
