/**
 * Remove ALL Logo/Header Content from Email Templates
 *
 * This script removes all logo and header-related HTML from templates
 * so we can start fresh with a clean slate
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function removeAllHeaders() {
  try {
    console.log('=== REMOVING ALL LOGO/HEADER CONTENT ===\n');

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

    console.log(`Found ${templates.length} templates\n`);

    for (const template of templates) {
      console.log(`Processing: ${template.holiday_name}`);

      if (!template.email_html) {
        console.log(`  ⚠️  No email_html, skipping...\n`);
        continue;
      }

      let cleanedHtml = template.email_html;

      // Remove ALL logo-related divs with SAA Logo comments
      cleanedHtml = cleanedHtml.replace(
        /<!--\s*SAA Logo\s*-->[^]*?<\/div>/gi,
        ''
      );

      // Remove any remaining img tags with SAA in the src
      cleanedHtml = cleanedHtml.replace(
        /<img[^>]*src="[^"]*(?:SAA|assets\.saabuildingblocks|imagedelivery\.net)[^"]*"[^>]*>/gi,
        ''
      );

      // Remove any standalone tagline text
      cleanedHtml = cleanedHtml.replace(
        /<p[^>]*>\s*For Agents Who Want More\s*<\/p>/gi,
        ''
      );

      // Remove leftover $2 or other artifacts
      cleanedHtml = cleanedHtml.replace(/\$2/g, '');

      // Clean up multiple blank lines
      cleanedHtml = cleanedHtml.replace(/\n\s*\n\s*\n/g, '\n\n');

      // Save cleaned HTML
      const { error: updateError } = await supabase
        .from('holiday_email_templates')
        .update({ email_html: cleanedHtml })
        .eq('id', template.id);

      if (updateError) {
        console.error(`  ❌ Failed to update:`, updateError.message);
      } else {
        console.log(`  ✅ All headers removed\n`);
      }
    }

    console.log('=== ALL HEADERS REMOVED ===');
    console.log('\nTemplates are now clean and ready for fresh header insertion.');

  } catch (error) {
    console.error('\n❌ ERROR:', error);
    process.exit(1);
  }
}

removeAllHeaders();
