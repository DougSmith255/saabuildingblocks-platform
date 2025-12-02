// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * Holiday Email Template Preview API
 *
 * Endpoints:
 * - POST /api/email-automations/templates/[id]/preview - Generate preview with sample data
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// ============================================================================
// Validation Schemas
// ============================================================================

const PreviewDataSchema = z.object({
  firstName: z.string().default('John'),
  lastName: z.string().default('Doe'),
  email: z.string().email().default('john.doe@example.com'),
  customTokens: z.record(z.string(), z.string()).optional(),
});

// ============================================================================
// Supabase Client
// ============================================================================

function getSupabaseClient() {
  const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL'];
  const supabaseKey = process.env['SUPABASE_SERVICE_ROLE_KEY'];

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase configuration');
  }

  return createClient(supabaseUrl, supabaseKey);
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Replace personalization tokens in HTML content
 */
function replaceTokens(html: string, data: Record<string, string>): string {
  let result = html;

  // Replace standard tokens
  Object.entries(data).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, value);
  });

  // Replace any remaining unreplaced tokens with empty string
  result = result.replace(/{{[^}]+}}/g, '');

  return result;
}

// ============================================================================
// POST - Generate preview
// ============================================================================

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabaseClient();
    const { id } = await params;

    // Parse and validate request body
    const body = await request.json();
    const validation = PreviewDataSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const previewData = validation.data;

    // Fetch template
    const { data: template, error: fetchError } = await supabase
      .from('holiday_email_templates')
      .select(`
        *,
        category:email_automation_categories(id, name, slug, icon)
      `)
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Template not found' },
          { status: 404 }
        );
      }

      console.error('Error fetching template:', fetchError);
      return NextResponse.json(
        { success: false, error: fetchError.message },
        { status: 500 }
      );
    }

    // Prepare token replacement data
    const tokenData: Record<string, string> = {
      firstName: previewData.firstName,
      lastName: previewData.lastName,
      email: previewData.email,
      ...previewData.customTokens,
    };

    // Generate preview HTML
    const previewHtml = replaceTokens(template.email_html, tokenData);
    const previewSubject = replaceTokens(template.subject_line, tokenData);
    const previewText = template.preview_text
      ? replaceTokens(template.preview_text, tokenData)
      : '';

    return NextResponse.json({
      success: true,
      data: {
        template: {
          id: template.id,
          holiday_name: template.holiday_name,
          category: template.category,
        },
        preview: {
          subject_line: previewSubject,
          preview_text: previewText,
          html: previewHtml,
        },
        sample_data: tokenData,
        available_tokens: template.personalization_tokens || ['firstName', 'lastName', 'email'],
      },
    });
  } catch (error) {
    console.error('Template preview error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
