/**
 * Remove "1552" Artifact from Email Templates
 *
 * The "1552" text appears before logo comments and needs to be removed
 * This was accidentally inserted during a previous logo update
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function remove1552Artifact() {
  try {
    console.log('=== REMOVING "1552" ARTIFACT FROM TEMPLATES ===\n');

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

    let updatedCount = 0;
    let skippedCount = 0;

    for (const template of templates) {
      console.log(`Processing: ${template.holiday_name}`);

      if (!template.email_html) {
        console.log(`  ⚠️  No email_html, skipping...\n`);
        skippedCount++;
        continue;
      }

      // Check if "1552" exists
      if (!template.email_html.includes('1552')) {
        console.log(`  ✅ Already clean (no "1552")\n`);
        skippedCount++;
        continue;
      }

      let cleanedHtml = template.email_html;

      // Remove "1552" text - it appears standalone and before logo comments
      cleanedHtml = cleanedHtml.replace(/1552/g, '');

      // Also clean up any double spaces or newlines that might be left behind
      cleanedHtml = cleanedHtml.replace(/  +/g, ' ');
      cleanedHtml = cleanedHtml.replace(/\n\n\n+/g, '\n\n');

      // Save updated HTML
      const { error: updateError } = await supabase
        .from('holiday_email_templates')
        .update({ email_html: cleanedHtml })
        .eq('id', template.id);

      if (updateError) {
        console.error(`  ❌ Failed to update:`, updateError.message);
      } else {
        console.log(`  ✅ "1552" removed\n`);
        updatedCount++;
      }
    }

    console.log('=== CLEANUP COMPLETE ===');
    console.log(`\nTemplates updated: ${updatedCount}`);
    console.log(`Templates skipped: ${skippedCount}`);
    console.log(`Total templates: ${templates.length}`);

  } catch (error) {
    console.error('\n❌ ERROR:', error);
    process.exit(1);
  }
}

remove1552Artifact();
