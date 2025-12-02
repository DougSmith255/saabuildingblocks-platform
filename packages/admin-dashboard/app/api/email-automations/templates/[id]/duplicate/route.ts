// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * Holiday Email Template Duplication API
 *
 * Endpoints:
 * - POST /api/email-automations/templates/[id]/duplicate - Duplicate a template
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// ============================================================================
// Validation Schemas
// ============================================================================

const DuplicateTemplateSchema = z.object({
  new_name: z.string().min(1, 'New template name is required').max(255).optional(),
  new_slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/).optional(),
  category_id: z.string().uuid('Valid category ID required').optional(),
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
// POST - Duplicate template
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
    const validation = DuplicateTemplateSchema.safeParse(body);

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

    const options = validation.data;

    // Fetch original template
    const { data: originalTemplate, error: fetchError } = await supabase
      .from('holiday_email_templates')
      .select('*')
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

    // Generate new name and slug if not provided
    const newName = options.new_name || `${originalTemplate.holiday_name} (Copy)`;
    const baseSlug = options.new_slug || `${originalTemplate.holiday_slug}-copy`;

    // Check if slug exists and generate unique one
    let newSlug = baseSlug;
    let counter = 1;
    let slugExists = true;

    while (slugExists) {
      const { data: existing } = await supabase
        .from('holiday_email_templates')
        .select('id')
        .eq('holiday_slug', newSlug)
        .eq('category_id', options.category_id || originalTemplate.category_id)
        .single();

      if (!existing) {
        slugExists = false;
      } else {
        newSlug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    // Create duplicate template
    const { data, error } = await supabase
      .from('holiday_email_templates')
      .insert([{
        category_id: options.category_id || originalTemplate.category_id,
        holiday_name: newName,
        holiday_slug: newSlug,
        holiday_date_type: originalTemplate.holiday_date_type,
        holiday_month: originalTemplate.holiday_month,
        holiday_day: originalTemplate.holiday_day,
        subject_line: originalTemplate.subject_line,
        preview_text: originalTemplate.preview_text,
        email_html: originalTemplate.email_html,
        email_json: originalTemplate.email_json,
        personalization_tokens: originalTemplate.personalization_tokens,
        use_brand_theme: originalTemplate.use_brand_theme,
        custom_colors: originalTemplate.custom_colors,
        is_active: false, // Set duplicate as inactive by default
        version: 1, // Reset version
      }])
      .select(`
        *,
        category:email_automation_categories(id, name, slug, icon)
      `)
      .single();

    if (error) {
      console.error('Error duplicating template:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data,
        message: 'Template duplicated successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Template duplicate error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
