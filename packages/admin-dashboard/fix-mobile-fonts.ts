/**
 * Fix Mobile Font Rendering
 *
 * Mobile email clients (Gmail, iOS Mail, Outlook Mobile) are more restrictive than desktop.
 * This script adds:
 * 1. !important declarations to override mobile client defaults
 * 2. Better fallback font stacks for universal support
 * 3. Inline styles that mobile clients can't strip
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Mobile-optimized font stacks with universal fallbacks
 */
const MOBILE_FONT_STACKS = {
  h1: "Impact, 'Arial Black', 'Helvetica Bold', Arial, sans-serif",
  h2: "Impact, 'Arial Black', 'Helvetica Bold', Arial, sans-serif",
  h3: "Impact, 'Arial Black', 'Helvetica Bold', Arial, sans-serif",
  body: "'Lucida Sans Unicode', 'Lucida Grande', 'Helvetica Neue', Helvetica, Arial, sans-serif",
};

/**
 * Apply mobile-safe typography to HTML element with !important
 */
function injectMobileSafeStyle(htmlElement: string, tag: string, settings: any): string {
  let styleToInject = '';

  // Build inline style with !important for mobile override
  if (tag === 'h1') {
    styleToInject = `font-family: ${MOBILE_FONT_STACKS.h1} !important; font-size: ${settings.h1_font_size} !important; font-weight: ${settings.h1_font_weight} !important; color: ${settings.h1_color} !important; line-height: ${settings.h1_line_height} !important; letter-spacing: ${settings.h1_letter_spacing} !important; ${settings.h1_text_shadow ? `text-shadow: ${settings.h1_text_shadow};` : ''} margin-top: 0 !important; margin-bottom: 20px !important;`;
  } else if (tag === 'h2') {
    styleToInject = `font-family: ${MOBILE_FONT_STACKS.h2} !important; font-size: ${settings.h2_font_size} !important; font-weight: ${settings.h2_font_weight} !important; color: ${settings.h2_color} !important; line-height: ${settings.h2_line_height} !important; letter-spacing: ${settings.h2_letter_spacing} !important; margin-top: 0 !important; margin-bottom: 15px !important;`;
  } else if (tag === 'h3') {
    styleToInject = `font-family: ${MOBILE_FONT_STACKS.h3} !important; font-size: ${settings.h3_font_size} !important; font-weight: ${settings.h3_font_weight} !important; color: ${settings.h3_color} !important; line-height: ${settings.h3_line_height} !important; letter-spacing: ${settings.h3_letter_spacing} !important; margin-top: 20px !important; margin-bottom: 10px !important;`;
  } else if (tag === 'p') {
    styleToInject = `font-family: ${MOBILE_FONT_STACKS.body} !important; font-size: ${settings.body_font_size} !important; font-weight: ${settings.body_font_weight} !important; color: ${settings.body_color} !important; line-height: ${settings.body_line_height} !important; letter-spacing: ${settings.body_letter_spacing} !important; margin-top: 0 !important; margin-bottom: 14px !important;`;
  }

  // Replace existing style attribute
  if (htmlElement.includes('style="')) {
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
  return html.replace(regex, (match) => injectMobileSafeStyle(match, tag, settings));
}

/**
 * Apply mobile-safe typography to template HTML
 */
function applyMobileSafeTypography(html: string, settings: any): string {
  // Process each element type
  html = processElements(html, 'h1', settings);
  html = processElements(html, 'h2', settings);
  html = processElements(html, 'h3', settings);
  html = processElements(html, 'p', settings);
  return html;
}

async function fixMobileFonts() {
  try {
    console.log('=== FIXING MOBILE FONT RENDERING ===\n');

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

    console.log('✅ Typography settings loaded\n');

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

    // Step 3: Re-apply typography with mobile-safe styles
    console.log('[3/3] Applying mobile-safe font styles...\n');

    for (const template of templates) {
      console.log(`Processing: ${template.holiday_name} (${template.holiday_slug})`);

      if (!template.email_html) {
        console.log(`  ⚠️  No email_html found, skipping...\n`);
        continue;
      }

      // Apply mobile-safe typography
      const updatedHtml = applyMobileSafeTypography(
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
        console.log(`  ✅ Mobile-safe styles applied\n`);
      }
    }

    console.log('=== MOBILE FONT FIX COMPLETE ===');
    console.log('\nAll templates now use mobile-optimized font styles:');
    console.log('  - !important declarations to override mobile defaults');
    console.log('  - Better fallback stacks (Arial Black, Helvetica)');
    console.log('  - Inline styles that mobile clients can\'t strip');
    console.log('\nNext: Send a test email and check on mobile device');

  } catch (error) {
    console.error('\n❌ ERROR:', error);
    process.exit(1);
  }
}

fixMobileFonts();
