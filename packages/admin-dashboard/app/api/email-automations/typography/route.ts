import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/email-automations/typography
 * Fetch the active email typography settings
 */
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('email_typography_settings')
      .select('*')
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching typography settings:', error);
      console.error('Error code check:', error.code, 'Type:', typeof error.code);

      // If no settings exist or table doesn't exist, return defaults
      if (error.code === 'PGRST116' || error.code === 'PGRST205') {
        console.log('Returning default typography settings due to missing table');
        return NextResponse.json({
          h1_font_family: 'Taskor',
          h1_font_weight: 400,
          h1_font_size: '32px',
          h1_color: '#ffd700',
          h1_line_height: 1.2,
          h1_letter_spacing: '0',
          h1_text_shadow: '0 0 10px rgba(255, 215, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.3)',
          h2_font_family: 'Amulya',
          h2_font_weight: 700,
          h2_font_size: '24px',
          h2_color: '#e5e4dd',
          h2_line_height: 1.3,
          h2_letter_spacing: '0',
          h3_font_family: 'Amulya',
          h3_font_weight: 600,
          h3_font_size: '18px',
          h3_color: '#e5e4dd',
          h3_line_height: 1.4,
          h3_letter_spacing: '0',
          body_font_family: 'Synonym',
          body_font_weight: 300,
          body_font_size: '14px',
          body_color: '#bfbdb0',
          body_line_height: 1.7,
          body_letter_spacing: '0',
          link_color: '#00ff88',
          link_hover_color: '#ffd700',
          _tableNotCreated: true,
          _createTableSQL: `-- Run this in Supabase SQL Editor to create the table:
CREATE TABLE IF NOT EXISTS email_typography_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  h1_font_family VARCHAR(100) DEFAULT 'Taskor',
  h1_font_weight INTEGER DEFAULT 400,
  h1_font_size VARCHAR(20) DEFAULT '32px',
  h1_color VARCHAR(20) DEFAULT '#ffd700',
  h1_line_height DECIMAL(3,2) DEFAULT 1.2,
  h1_letter_spacing VARCHAR(20) DEFAULT '0',
  h1_text_shadow TEXT DEFAULT '0 0 10px rgba(255, 215, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.3)',
  h2_font_family VARCHAR(100) DEFAULT 'Amulya',
  h2_font_weight INTEGER DEFAULT 700,
  h2_font_size VARCHAR(20) DEFAULT '24px',
  h2_color VARCHAR(20) DEFAULT '#e5e4dd',
  h2_line_height DECIMAL(3,2) DEFAULT 1.3,
  h2_letter_spacing VARCHAR(20) DEFAULT '0',
  h3_font_family VARCHAR(100) DEFAULT 'Amulya',
  h3_font_weight INTEGER DEFAULT 600,
  h3_font_size VARCHAR(20) DEFAULT '18px',
  h3_color VARCHAR(20) DEFAULT '#e5e4dd',
  h3_line_height DECIMAL(3,2) DEFAULT 1.4,
  h3_letter_spacing VARCHAR(20) DEFAULT '0',
  body_font_family VARCHAR(100) DEFAULT 'Synonym',
  body_font_weight INTEGER DEFAULT 300,
  body_font_size VARCHAR(20) DEFAULT '14px',
  body_color VARCHAR(20) DEFAULT '#bfbdb0',
  body_line_height DECIMAL(3,2) DEFAULT 1.7,
  body_letter_spacing VARCHAR(20) DEFAULT '0',
  link_color VARCHAR(20) DEFAULT '#00ff88',
  link_hover_color VARCHAR(20) DEFAULT '#ffd700',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_typography_active ON email_typography_settings(is_active);

INSERT INTO email_typography_settings (is_active) VALUES (true);`
        });
      }

      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in typography GET:', error);
    return NextResponse.json(
      { error: 'Failed to fetch typography settings' },
      { status: 500 }
    );
  }
}

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

/**
 * PUT /api/email-automations/typography
 * Update email typography settings and regenerate all template HTML
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('=== TYPOGRAPHY UPDATE STARTED ===');
    console.log('New settings:', body);

    // First, get the existing active settings
    const { data: existingData } = await supabase
      .from('email_typography_settings')
      .select('id')
      .eq('is_active', true)
      .single();

    let result;

    if (existingData?.id) {
      // Update existing settings
      result = await supabase
        .from('email_typography_settings')
        .update({
          ...body,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingData.id)
        .select()
        .single();
    } else {
      // Insert new settings
      result = await supabase
        .from('email_typography_settings')
        .insert({
          ...body,
          is_active: true,
        })
        .select()
        .single();
    }

    if (result.error) {
      console.error('Error updating typography settings:', result.error);
      throw result.error;
    }

    console.log('Typography settings saved to database');

    // CRITICAL: Now update ALL templates with new inline styles
    console.log('Fetching all active templates to update...');

    const { data: templates, error: fetchError } = await supabase
      .from('holiday_email_templates')
      .select('id, holiday_name, email_html')
      .eq('is_active', true);

    if (fetchError) {
      console.error('Error fetching templates:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${templates?.length || 0} templates to update`);

    // Update each template with new typography
    let updatedCount = 0;
    const newSettings = result.data;

    for (const template of templates || []) {
      let updatedHtml = template.email_html;

      // Inject inline styles into each element type
      updatedHtml = processElements(updatedHtml, 'h1', newSettings);
      updatedHtml = processElements(updatedHtml, 'h2', newSettings);
      updatedHtml = processElements(updatedHtml, 'h3', newSettings);
      updatedHtml = processElements(updatedHtml, 'p', newSettings);

      // Update template in database
      const { error: updateError } = await supabase
        .from('holiday_email_templates')
        .update({ email_html: updatedHtml })
        .eq('id', template.id);

      if (updateError) {
        console.error(`Error updating template ${template.holiday_name}:`, updateError);
      } else {
        updatedCount++;
        console.log(`✓ Updated ${template.holiday_name}`);
      }
    }

    console.log(`=== TYPOGRAPHY UPDATE COMPLETE: ${updatedCount}/${templates?.length || 0} templates updated ===`);

    return NextResponse.json({
      ...result.data,
      _templatesUpdated: updatedCount,
      _message: `Typography settings saved and ${updatedCount} templates updated with new styles`,
    });
  } catch (error) {
    console.error('Error in typography PUT:', error);
    return NextResponse.json(
      { error: 'Failed to update typography settings' },
      { status: 500 }
    );
  }
}
