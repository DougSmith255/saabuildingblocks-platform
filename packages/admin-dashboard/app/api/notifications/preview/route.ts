// Force dynamic rendering - exclude from static export
export const dynamic = 'force-dynamic';

/**
 * Email Template Preview
 * GET /api/notifications/preview?template=link_page_nudge
 * GET /api/notifications/preview?template=welcome
 *
 * Returns rendered HTML of email templates for visual review.
 * Requires AUTOMATION_SECRET header.
 */

import { NextRequest, NextResponse } from 'next/server';
import { render } from '@react-email/render';
import { LinkPageNudgeEmail } from '@/lib/email/templates/LinkPageNudgeEmail';
import { WelcomeEmail } from '@/lib/email/templates/WelcomeEmail';
import { AgentActivationEmail } from '@/lib/email/templates/AgentActivationEmail';

function verifyAuth(request: NextRequest): boolean {
  const secret = request.headers.get('x-automation-secret');
  if (secret && secret === process.env.AUTOMATION_SECRET) {
    return true;
  }
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return true;
  }
  return false;
}

export async function GET(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const template = request.nextUrl.searchParams.get('template');

  if (!template) {
    return NextResponse.json({
      available_templates: ['welcome', 'agent_activation', 'link_page_nudge'],
      usage: 'GET /api/notifications/preview?template=agent_activation',
    });
  }

  let html: string;

  switch (template) {
    case 'welcome':
      html = await render(
        WelcomeEmail({
          firstName: 'Doug',
          activationLink: 'https://saabuildingblocks.com/activate-account?token=preview-test-token',
          expiresInHours: 168,
        })
      );
      break;

    case 'agent_activation':
      html = await render(
        AgentActivationEmail({
          firstName: 'Doug',
          activationLink: 'https://saabuildingblocks.com/activate-account?token=preview-test-token',
          expiresInHours: 48,
        })
      );
      break;

    case 'link_page_nudge':
      html = await render(
        LinkPageNudgeEmail({
          firstName: 'Doug',
          portalLink: 'https://smartagentalliance.com/agent-portal',
        })
      );
      break;

    default:
      return NextResponse.json(
        { error: `Unknown template: ${template}`, available: ['welcome', 'agent_activation', 'link_page_nudge'] },
        { status: 400 }
      );
  }

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
