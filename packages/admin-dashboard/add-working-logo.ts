/**
 * Add Working Logo to Email Templates
 *
 * Uses the current logo URL from assets.saabuildingblocks.com
 * This can be easily updated later when the domain changes to smartagentalliance.com
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Current logo URL - will change to smartagentalliance.com later
const LOGO_URL = 'https://assets.saabuildingblocks.com/Website-Images/SAA%20Email%20Logo%202.png';

const LOGO_HTML = `
      <!-- SAA Logo -->
      <div style="text-align: center; margin-bottom: 30px;">
        <img
          src="${LOGO_URL}"
          alt="Smart Agent Alliance Logo"
          style="max-width: 200px; height: auto; display: block; margin: 0 auto;"
        />
      </div>`;

async function addWorkingLogo() {
  try {
    console.log('=== ADDING WORKING LOGO TO TEMPLATES ===\n');
    console.log(`Logo URL: ${LOGO_URL}\n`);

    // Fetch all active holiday templates
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

      // Check if logo already exists
      if (template.email_html.includes('assets.saabuildingblocks.com/Website-Images/SAA')) {
        console.log(`  ✅ Logo already exists, skipping...\n`);
        continue;
      }

      // Insert logo at the beginning of the body content
      // Look for common starting patterns after opening body tag
      const insertPatterns = [
        /(<body[^>]*>\s*)(<div|<table|<h1|<p)/i,
        /(<body[^>]*>\s*)/i
      ];

      let updatedHtml = template.email_html;
      let inserted = false;

      for (const pattern of insertPatterns) {
        if (pattern.test(updatedHtml)) {
          updatedHtml = updatedHtml.replace(pattern, `$1${LOGO_HTML}\n      $2`);
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
        console.log(`  ✅ Logo added\n`);
      }
    }

    console.log('=== LOGO ADDED TO ALL TEMPLATES ===');
    console.log('\nLogo Details:');
    console.log(`  - Current URL: ${LOGO_URL}`);
    console.log('  - Max Width: 200px');
    console.log('  - Centered with auto margins');
    console.log('\nNote: When the domain changes to smartagentalliance.com,');
    console.log('run this script again with the new URL to update all templates.');

  } catch (error) {
    console.error('\n❌ ERROR:', error);
    process.exit(1);
  }
}

addWorkingLogo();
