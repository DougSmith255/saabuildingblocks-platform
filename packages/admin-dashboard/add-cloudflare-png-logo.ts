/**
 * Add Cloudflare PNG Logo to Email Templates
 *
 * Replaces or supplements the SVG logo with the Cloudflare-hosted PNG image.
 * Cloudflare Image URL: https://api.cloudflare.com/client/v4/accounts/a1ae4bb5913a89fea98821d7ba1ac304/images/v1/5acbe747-c915-48ab-1817-14f622160c00
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Cloudflare delivers images at a different URL format
// The direct delivery URL uses this pattern:
const CLOUDFLARE_IMAGE_URL = 'https://imagedelivery.net/a1ae4bb5913a89fea98821d7ba1ac304/5acbe747-c915-48ab-1817-14f622160c00/public';

const PNG_LOGO_HTML = `
      <!-- SAA Logo (PNG from Cloudflare) -->
      <div style="text-align: center; margin-bottom: 30px;">
        <img
          src="${CLOUDFLARE_IMAGE_URL}"
          alt="Smart Agent Alliance Logo"
          style="max-width: 200px; height: auto; display: block; margin: 0 auto;"
        />
      </div>`;

async function addCloudflareLogoToTemplates() {
  try {
    console.log('=== ADDING CLOUDFLARE PNG LOGO TO TEMPLATES ===\n');

    // Fetch all active holiday templates
    console.log('[1/2] Fetching holiday email templates...');
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

    // Add PNG logo to each template
    console.log('[2/2] Adding Cloudflare PNG logo...\n');

    for (const template of templates) {
      console.log(`Processing: ${template.holiday_name} (${template.holiday_slug})`);

      if (!template.email_html) {
        console.log(`  ⚠️  No email_html found, skipping...\n`);
        continue;
      }

      let updatedHtml = template.email_html;

      // Check if SVG logo exists and remove it
      if (updatedHtml.includes('emailLogoGradient')) {
        console.log(`  🔄 Removing old SVG logo...`);
        // Remove the entire SVG logo section
        updatedHtml = updatedHtml.replace(
          /<div[^>]*>\s*<!-- SAA Logo[^>]*>[\s\S]*?<\/svg>\s*<\/div>/i,
          ''
        );
      }

      // Check if PNG logo already exists
      if (updatedHtml.includes(CLOUDFLARE_IMAGE_URL)) {
        console.log(`  ⏭️  PNG logo already exists, skipping...\n`);
        continue;
      }

      // Insert PNG logo at the beginning of the body content
      // Look for common starting patterns after opening body tag
      const insertPatterns = [
        /(<body[^>]*>\s*)(<div|<table|<h1|<p)/i,
        /(<body[^>]*>\s*)/i
      ];

      let inserted = false;
      for (const pattern of insertPatterns) {
        if (pattern.test(updatedHtml)) {
          updatedHtml = updatedHtml.replace(pattern, `$1${PNG_LOGO_HTML}\n      $2`);
          inserted = true;
          break;
        }
      }

      if (!inserted) {
        console.log(`  ⚠️  Could not find insertion point, skipping...\n`);
        continue;
      }

      // Save updated HTML
      const { error: updateError } = await supabase
        .from('holiday_email_templates')
        .update({ email_html: updatedHtml })
        .eq('id', template.id);

      if (updateError) {
        console.error(`  ❌ Failed to update:`, updateError.message);
      } else {
        console.log(`  ✅ Cloudflare PNG logo added\n`);
      }
    }

    console.log('=== CLOUDFLARE PNG LOGO ADDED TO ALL TEMPLATES ===');
    console.log('\nLogo Details:');
    console.log(`  - URL: ${CLOUDFLARE_IMAGE_URL}`);
    console.log('  - Max Width: 200px');
    console.log('  - Centered with auto margins');
    console.log('\nNext: Send test email to verify logo appears correctly');

  } catch (error) {
    console.error('\n❌ ERROR:', error);
    process.exit(1);
  }
}

addCloudflareLogoToTemplates();
