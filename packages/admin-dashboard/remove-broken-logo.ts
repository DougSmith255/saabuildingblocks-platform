/**
 * Remove Broken Cloudflare Logo
 * The Cloudflare image URL returns 403 Forbidden
 * Removing it for now until we have a working logo URL
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function removeBrokenLogo() {
  try {
    console.log('=== REMOVING BROKEN CLOUDFLARE LOGO ===\n');

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

      // Check if template has the broken logo
      if (!template.email_html.includes('imagedelivery.net')) {
        console.log(`  ✅ No logo found, skipping...\n`);
        continue;
      }

      // Remove the entire logo div
      const updatedHtml = template.email_html.replace(
        /<div[^>]*>\s*<!-- SAA Logo \(PNG from Cloudflare\)[^>]*>[\s\S]*?imagedelivery\.net[\s\S]*?<\/div>/gi,
        ''
      );

      const { error: updateError } = await supabase
        .from('holiday_email_templates')
        .update({ email_html: updatedHtml })
        .eq('id', template.id);

      if (updateError) {
        console.error(`  ❌ Failed to update:`, updateError.message);
      } else {
        console.log(`  ✅ Logo removed\n`);
      }
    }

    console.log('=== BROKEN LOGO REMOVED FROM ALL TEMPLATES ===');
    console.log('\nNext: Send test email to verify Impact/Lucida fonts work correctly');

  } catch (error) {
    console.error('\n❌ ERROR:', error);
    process.exit(1);
  }
}

removeBrokenLogo();
