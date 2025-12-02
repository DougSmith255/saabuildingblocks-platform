/**
 * Remove Leftover Logo Text from Previous Insertion Attempts
 *
 * The previous logo insertion script left "$2" text and extra logo-related text
 * This script cleans up those artifacts
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function removeLeftoverText() {
  try {
    console.log('=== CLEANING UP LEFTOVER LOGO TEXT ===\n');

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

      let updatedHtml = template.email_html;
      let changed = false;

      // Remove "$2" text that appears after logo
      if (updatedHtml.includes('$2')) {
        updatedHtml = updatedHtml.replace(/\$2\s*/g, '');
        changed = true;
        console.log(`  ✅ Removed $2 text`);
      }

      // Remove leftover "Smart Agent Alliance Logo" text that's outside of img alt
      // This matches standalone text, not the alt attribute
      updatedHtml = updatedHtml.replace(
        /(?<!alt=")Smart Agent Alliance Logo(?!")/g,
        ''
      );

      // Remove "For Agents Who Want More" text if it appears right after logo
      updatedHtml = updatedHtml.replace(
        /For Agents Who Want More\s*/g,
        ''
      );

      // Clean up any extra whitespace left behind
      updatedHtml = updatedHtml.replace(/\n\s*\n\s*\n/g, '\n\n');

      if (!changed && updatedHtml === template.email_html) {
        console.log(`  ✅ Already clean\n`);
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
        console.log(`  ✅ Cleaned up leftover text\n`);
      }
    }

    console.log('=== CLEANUP COMPLETE ===');

  } catch (error) {
    console.error('\n❌ ERROR:', error);
    process.exit(1);
  }
}

removeLeftoverText();
