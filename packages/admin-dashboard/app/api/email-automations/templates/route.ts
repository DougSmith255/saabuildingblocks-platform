// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * Holiday Email Templates API
 *
 * Endpoints:
 * - GET /api/email-automations/templates - List all templates
 * - POST /api/email-automations/templates - Create new template (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// ============================================================================
// Validation Schemas
// ============================================================================

const CreateTemplateSchema = z.object({
  category_id: z.string().uuid('Valid category ID required'),
  holiday_name: z.string().min(1, 'Holiday name is required').max(255),
  holiday_slug: z.string().min(1, 'Holiday slug is required').max(255).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  holiday_date_type: z.enum(['fixed', 'variable']).default('fixed'),
  holiday_month: z.number().int().min(1).max(12).optional(),
  holiday_day: z.number().int().min(1).max(31).optional(),
  subject_line: z.string().min(1, 'Subject line is required'),
  preview_text: z.string().optional(),
  email_html: z.string().min(1, 'Email HTML content is required'),
  email_json: z.string().optional(),
  personalization_tokens: z.array(z.string()).optional(),
  use_brand_theme: z.boolean().default(true),
  custom_colors: z.record(z.string(), z.string()).optional(),
  is_active: z.boolean().default(true),
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
// GET - List all templates
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = request.nextUrl;

    // Optional filters
    const categoryId = searchParams.get('category_id');
    const activeOnly = searchParams.get('active_only') === 'true';
    const month = searchParams.get('month'); // Filter by holiday month

    let query = supabase
      .from('holiday_email_templates')
      .select(`
        *,
        category:email_automation_categories(id, name, slug, icon)
      `)
      .order('holiday_month', { ascending: true })
      .order('holiday_day', { ascending: true });

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    if (month) {
      query = query.eq('holiday_month', parseInt(month));
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching templates:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      count: data?.length || 0,
    });
  } catch (error) {
    console.error('Templates GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST - Create new template (admin only)
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();

    // Parse and validate request body
    const body = await request.json();
    const validation = CreateTemplateSchema.safeParse(body);

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

    const templateData = validation.data;

    // Verify category exists
    const { data: category, error: categoryError } = await supabase
      .from('email_automation_categories')
      .select('id')
      .eq('id', templateData.category_id)
      .single();

    if (categoryError || !category) {
      return NextResponse.json(
        { success: false, error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    // Insert template
    const { data, error } = await supabase
      .from('holiday_email_templates')
      .insert([{
        category_id: templateData.category_id,
        holiday_name: templateData.holiday_name,
        holiday_slug: templateData.holiday_slug,
        holiday_date_type: templateData.holiday_date_type,
        holiday_month: templateData.holiday_month,
        holiday_day: templateData.holiday_day,
        subject_line: templateData.subject_line,
        preview_text: templateData.preview_text,
        email_html: templateData.email_html,
        email_json: templateData.email_json,
        personalization_tokens: templateData.personalization_tokens || [],
        use_brand_theme: templateData.use_brand_theme,
        custom_colors: templateData.custom_colors,
        is_active: templateData.is_active,
      }])
      .select(`
        *,
        category:email_automation_categories(id, name, slug, icon)
      `)
      .single();

    if (error) {
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

      console.error('Error creating template:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data,
        message: 'Template created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Templates POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
