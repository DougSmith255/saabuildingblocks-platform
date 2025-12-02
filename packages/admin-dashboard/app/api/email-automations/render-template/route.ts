import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { injectTypographyIntoTemplate } from '@/lib/email-typography-generator';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/email-automations/render-template
 *
 * Renders an email template with dynamic typography settings applied
 *
 * Request body:
 * {
 *   baseTemplate: 'team' | 'external',
 *   emailBody: 'HTML content for email body',
 *   emailTitle: 'Email subject/title',
 *   unsubscribeUrl?: 'URL for unsubscribe link (external only)'
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { baseTemplate, emailBody, emailTitle, unsubscribeUrl } = body;

    if (!baseTemplate || !emailBody || !emailTitle) {
      return NextResponse.json(
        { error: 'Missing required fields: baseTemplate, emailBody, emailTitle' },
        { status: 400 }
      );
    }

    // Validate baseTemplate
    if (!['team', 'external'].includes(baseTemplate)) {
      return NextResponse.json(
        { error: 'baseTemplate must be "team" or "external"' },
        { status: 400 }
      );
    }

    // Load base template file
    const templateFileName = baseTemplate === 'team'
      ? 'base-email-template-team.html'
      : 'base-email-template-external.html';

    const templatePath = path.join(process.cwd(), 'templates', templateFileName);

    if (!fs.existsSync(templatePath)) {
      return NextResponse.json(
        { error: 'Template file not found' },
        { status: 404 }
      );
    }

    let templateHtml = fs.readFileSync(templatePath, 'utf-8');

    // Fetch active typography settings
    const { data: typographySettings, error: typographyError } = await supabase
      .from('email_typography_settings')
      .select('*')
      .eq('is_active', true)
      .single();

    if (typographyError) {
      console.error('Error fetching typography settings:', typographyError);
      // Continue with template without typography injection
    } else if (typographySettings) {
      // Inject dynamic typography CSS
      templateHtml = injectTypographyIntoTemplate(templateHtml, typographySettings);
    }

    // Replace placeholders
    templateHtml = templateHtml.replace(/\{\{emailTitle\}\}/g, emailTitle);
    templateHtml = templateHtml.replace(/\{\{emailBody\}\}/g, emailBody);

    if (baseTemplate === 'external' && unsubscribeUrl) {
      templateHtml = templateHtml.replace(/\{\{unsubscribeUrl\}\}/g, unsubscribeUrl);
    }

    return NextResponse.json({
      html: templateHtml,
      success: true,
    });

  } catch (error) {
    console.error('Error rendering template:', error);
    return NextResponse.json(
      { error: 'Failed to render template' },
      { status: 500 }
    );
  }
}
