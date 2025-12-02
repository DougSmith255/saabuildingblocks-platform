// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * Holiday Email Template API (Individual)
 *
 * Endpoints:
 * - GET /api/email-automations/templates/[id] - Get single template
 * - PUT /api/email-automations/templates/[id] - Update template (admin only)
 * - DELETE /api/email-automations/templates/[id] - Delete template (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// ============================================================================
// Validation Schemas
// ============================================================================

const UpdateTemplateSchema = z.object({
  category_id: z.string().uuid().optional(),
  holiday_name: z.string().min(1).max(255).optional(),
  holiday_slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/).optional(),
  holiday_date_type: z.enum(['fixed', 'variable']).optional(),
  holiday_month: z.number().int().min(1).max(12).optional(),
  holiday_day: z.number().int().min(1).max(31).optional(),
  subject_line: z.string().min(1).optional(),
  preview_text: z.string().optional(),
  email_html: z.string().min(1).optional(),
  email_json: z.string().optional(),
  personalization_tokens: z.array(z.string()).optional(),
  use_brand_theme: z.boolean().optional(),
  custom_colors: z.record(z.string(), z.string()).optional(),
  is_active: z.boolean().optional(),
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
// Typography Helper Functions (shared with typography route)
// ============================================================================

/**
 * Apply typography settings to HTML element
 */
function injectInlineStyle(htmlElement: string, tag: string, settings: any): string {
  let styleToInject = '';

  // Build inline style from typography settings
  if (tag === 'h1') {
    styleToInject = `font-family: '${settings.h1_font_family}', Georgia, serif; font-size: ${settings.h1_font_size}; font-weight: ${settings.h1_font_weight}; color: ${settings.h1_color}; line-height: ${settings.h1_line_height}; letter-spacing: ${settings.h1_letter_spacing}; ${settings.h1_text_shadow ? `text-shadow: ${settings.h1_text_shadow};` : ''} margin-top: 0; margin-bottom: 20px;`;
  } else if (tag === 'h2') {
    styleToInject = `font-family: '${settings.h2_font_family}', Georgia, serif; font-size: ${settings.h2_font_size}; font-weight: ${settings.h2_font_weight}; color: ${settings.h2_color}; line-height: ${settings.h2_line_height}; letter-spacing: ${settings.h2_letter_spacing}; margin-top: 0; margin-bottom: 15px;`;
  } else if (tag === 'h3') {
    styleToInject = `font-family: '${settings.h3_font_family}', Georgia, serif; font-size: ${settings.h3_font_size}; font-weight: ${settings.h3_font_weight}; color: ${settings.h3_color}; line-height: ${settings.h3_line_height}; letter-spacing: ${settings.h3_letter_spacing}; margin-top: 20px; margin-bottom: 10px;`;
  } else if (tag === 'p') {
    styleToInject = `font-family: '${settings.body_font_family}', 'Helvetica Neue', Arial, sans-serif; font-size: ${settings.body_font_size}; font-weight: ${settings.body_font_weight}; color: ${settings.body_color}; line-height: ${settings.body_line_height}; letter-spacing: ${settings.body_letter_spacing}; margin-top: 0; margin-bottom: 14px;`;
  }

  // Check if element already has a style attribute
  if (htmlElement.includes('style="')) {
    // Replace existing style
    return htmlElement.replace(/style="[^"]*"/, `style="${styleToInject}"`);
  } else {
    // Add style attribute after the opening tag
    return htmlElement.replace(new RegExp(`<${tag}([\\s>])`), `<${tag} style="${styleToInject}"$1`);
  }
}

/**
 * Process all elements of a specific tag type
 */
function processElements(html: string, tag: string, settings: any): string {
  const regex = new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>`, 'gi');
  return html.replace(regex, (match) => injectInlineStyle(match, tag, settings));
}

// ============================================================================
// GET - Get single template
// ============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabaseClient();
    const { id } = await params;

    const { data, error } = await supabase
      .from('holiday_email_templates')
      .select(`
        *,
        category:email_automation_categories(id, name, slug, icon)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Template not found' },
          { status: 404 }
        );
      }

      console.error('Error fetching template:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Template GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================================
// PUT - Update template (admin only)
// ============================================================================

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabaseClient();
    const { id } = await params;

    // Parse and validate request body
    const body = await request.json();

    // Debug logging
    console.log('Template update request body:', JSON.stringify(body, null, 2));

    const validation = UpdateTemplateSchema.safeParse(body);

    if (!validation.success) {
      console.error('Validation failed:', validation.error.issues);
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const updates = validation.data;

    // Debug: Log updates to see what's being sent
    console.log('Validated updates:', JSON.stringify(updates, null, 2));
    console.log('Updates keys:', Object.keys(updates));
    console.log('Updates values:', Object.values(updates));

    // If category_id is being updated, verify it exists
    if (updates.category_id) {
      const { data: category, error: categoryError } = await supabase
        .from('email_automation_categories')
        .select('id')
        .eq('id', updates.category_id)
        .single();

      if (categoryError || !category) {
        return NextResponse.json(
          { success: false, error: 'Invalid category ID' },
          { status: 400 }
        );
      }
    }

    // CRITICAL: If email_html is being updated, apply typography settings
    if (updates.email_html) {
      console.log('=== APPLYING TYPOGRAPHY TO TEMPLATE SAVE ===');

      // Fetch current typography settings
      const { data: typographySettings, error: typographyError } = await supabase
        .from('email_typography_settings')
        .select('*')
        .eq('is_active', true)
        .single();

      if (typographySettings && !typographyError) {
        console.log('Fetched typography settings, applying to HTML...');

        let styledHtml = updates.email_html;

        // Apply typography to all elements
        styledHtml = processElements(styledHtml, 'h1', typographySettings);
        styledHtml = processElements(styledHtml, 'h2', typographySettings);
        styledHtml = processElements(styledHtml, 'h3', typographySettings);
        styledHtml = processElements(styledHtml, 'p', typographySettings);

        updates.email_html = styledHtml;
        console.log('Typography applied to template HTML');
      } else {
        console.log('No typography settings found, using HTML as-is');
      }
    }

    // Update template - don't select after to avoid any join/lookup issues
    console.log('About to update with:', updates);
    const { error: updateError } = await supabase
      .from('holiday_email_templates')
      .update(updates)
      .eq('id', id);

    if (updateError) {
      console.error('Supabase update error:', JSON.stringify(updateError, null, 2));
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 500 }
      );
    }

    // Fetch the updated template separately
    const { data, error } = await supabase
      .from('holiday_email_templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Template not found' },
          { status: 404 }
        );
      }

      // Check for unique constraint violation
      if (error.code === '23505') {
        return NextResponse.json(
          {
            success: false,
            error: 'Template with this holiday slug already exists in this category',
          },
          { status: 409 }
        );
      }

      console.error('Error updating template:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Template updated successfully',
    });
  } catch (error) {
    console.error('Template PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================================
// DELETE - Delete template (admin only)
// ============================================================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabaseClient();
    const { id } = await params;

    // Check if template has schedules
    const { count } = await supabase
      .from('email_automation_schedules')
      .select('*', { count: 'exact', head: true })
      .eq('template_id', id);

    if (count && count > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete template with ${count} schedule(s). Delete schedules first.`,
        },
        { status: 409 }
      );
    }

    // Delete template
    const { error } = await supabase
      .from('holiday_email_templates')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting template:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Template deleted successfully',
    });
  } catch (error) {
    console.error('Template DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
