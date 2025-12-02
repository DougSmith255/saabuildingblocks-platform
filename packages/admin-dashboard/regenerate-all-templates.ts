/**
 * Regenerate All Holiday Email Templates
 *
 * This script regenerates all active holiday email templates by:
 * 1. Fetching the latest typography settings from the database
 * 2. For each template, reading the current email_html
 * 3. Re-applying inline typography styles using processElements function
 * 4. Saving the updated HTML back to the email_html column
 *
 * This ensures all templates use the new email-safe fonts (Impact + Lucida Sans Unicode)
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Apply typography settings to HTML element
 */
function injectInlineStyle(htmlElement: string, tag: string, settings: any): string {
  let styleToInject = '';

  // Build inline style from typography settings
  if (tag === 'h1') {
    styleToInject = `font-family: ${settings.h1_font_family}; font-size: ${settings.h1_font_size}; font-weight: ${settings.h1_font_weight}; color: ${settings.h1_color}; line-height: ${settings.h1_line_height}; letter-spacing: ${settings.h1_letter_spacing}; ${settings.h1_text_shadow ? `text-shadow: ${settings.h1_text_shadow};` : ''} margin-top: 0; margin-bottom: 20px;`;
  } else if (tag === 'h2') {
    styleToInject = `font-family: ${settings.h2_font_family}; font-size: ${settings.h2_font_size}; font-weight: ${settings.h2_font_weight}; color: ${settings.h2_color}; line-height: ${settings.h2_line_height}; letter-spacing: ${settings.h2_letter_spacing}; margin-top: 0; margin-bottom: 15px;`;
  } else if (tag === 'h3') {
    styleToInject = `font-family: ${settings.h3_font_family}; font-size: ${settings.h3_font_size}; font-weight: ${settings.h3_font_weight}; color: ${settings.h3_color}; line-height: ${settings.h3_line_height}; letter-spacing: ${settings.h3_letter_spacing}; margin-top: 20px; margin-bottom: 10px;`;
  } else if (tag === 'p') {
    styleToInject = `font-family: ${settings.body_font_family}; font-size: ${settings.body_font_size}; font-weight: ${settings.body_font_weight}; color: ${settings.body_color}; line-height: ${settings.body_line_height}; letter-spacing: ${settings.body_letter_spacing}; margin-top: 0; margin-bottom: 14px;`;
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
 * Apply typography to template HTML
 */
function applyTypographyToTemplate(html: string, settings: any): string {
  // Process each element type
  html = processElements(html, 'h1', settings);
  html = processElements(html, 'h2', settings);
  html = processElements(html, 'h3', settings);
  html = processElements(html, 'p', settings);
  return html;
}

async function regenerateAllTemplates() {
  try {
    console.log('=== REGENERATING ALL HOLIDAY EMAIL TEMPLATES ===\n');

    // Step 1: Fetch typography settings
    console.log('[1/3] Fetching typography settings...');
    const { data: typographySettings, error: typographyError } = await supabase
      .from('email_typography_settings')
      .select('*')
      .eq('is_active', true)
      .single();

    if (typographyError || !typographySettings) {
      console.error('❌ Failed to fetch typography settings:', typographyError);
      process.exit(1);
    }

    console.log('✅ Typography settings loaded');
    console.log(`   - H1 Font: ${typographySettings.h1_font_family}`);
    console.log(`   - Body Font: ${typographySettings.body_font_family}\n`);

    // Step 2: Fetch all active holiday templates
    console.log('[2/3] Fetching holiday email templates...');
    const { data: templates, error: templatesError } = await supabase
      .from('holiday_email_templates')
      .select('id, holiday_name, holiday_slug, email_html')
      .eq('is_active', true)
      .order('holiday_month', { ascending: true })
      .order('holiday_day', { ascending: true });

    if (templatesError || !templates) {
      console.error('❌ Failed to fetch templates:', templatesError);
      process.exit(1);
    }

    console.log(`✅ Found ${templates.length} active templates\n`);

    // Step 3: Regenerate each template
    console.log('[3/3] Regenerating templates with new fonts...\n');

    for (const template of templates) {
      console.log(`Processing: ${template.holiday_name} (${template.holiday_slug})`);

      if (!template.email_html) {
        console.log(`  ⚠️  No email_html found, skipping...\n`);
        continue;
      }

      // Apply typography settings to generate new email_html
      const updatedHtml = applyTypographyToTemplate(
        template.email_html,
        typographySettings
      );

      // Save updated HTML
      const { error: updateError } = await supabase
        .from('holiday_email_templates')
        .update({ email_html: updatedHtml })
        .eq('id', template.id);

      if (updateError) {
        console.error(`  ❌ Failed to update:`, updateError.message);
      } else {
        console.log(`  ✅ Regenerated successfully\n`);
      }
    }

    console.log('=== ALL TEMPLATES REGENERATED ===');
    console.log('\nAll holiday email templates now use email-safe fonts:');
    console.log('  - Impact for headings (H1/H2/H3)');
    console.log('  - Lucida Sans Unicode for body text');
    console.log('\nNext Step: Send a test email to verify the changes.');

  } catch (error) {
    console.error('\n❌ ERROR:', error);
    process.exit(1);
  }
}

regenerateAllTemplates();
