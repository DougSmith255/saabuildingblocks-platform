/**
 * Find "1552" Text in Email Templates
 *
 * Searches for the source of "1552" that appears at the top of emails
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function find1552Text() {
  try {
    console.log('=== SEARCHING FOR "1552" TEXT ===\n');

    // Search New Year's Day template first (the one that was tested)
    const { data: template, error: templateError } = await supabase
      .from('holiday_email_templates')
      .select('id, holiday_name, email_html')
      .eq('holiday_slug', 'new-years-day')
      .single();

    if (templateError || !template) {
      console.error('❌ Failed to fetch template:', templateError);
      process.exit(1);
    }

    console.log(`Template: ${template.holiday_name}`);

    // Check if "1552" exists in the HTML
    if (template.email_html?.includes('1552')) {
      console.log('\n✅ FOUND "1552" in the template!\n');

      // Find the position
      const position = template.email_html.indexOf('1552');
      console.log(`Position: Character ${position}\n`);

      // Show context around the "1552"
      const start = Math.max(0, position - 200);
      const end = Math.min(template.email_html.length, position + 200);
      const context = template.email_html.substring(start, end);

      console.log('=== CONTEXT (200 chars before and after) ===');
      console.log(context);
      console.log('\n=== END CONTEXT ===\n');

      // Show the first 500 characters of the template
      console.log('=== FIRST 500 CHARACTERS OF TEMPLATE ===');
      console.log(template.email_html.substring(0, 500));
      console.log('\n=== END FIRST 500 ===');

    } else {
      console.log('\n❌ "1552" NOT FOUND in email_html');

      // Show the first 500 characters anyway
      console.log('\n=== FIRST 500 CHARACTERS OF TEMPLATE ===');
      console.log(template.email_html?.substring(0, 500) || 'EMPTY');
      console.log('\n=== END FIRST 500 ===');
    }

    // Also search all templates to see if any have "1552"
    console.log('\n=== SEARCHING ALL TEMPLATES ===\n');

    const { data: allTemplates, error: allError } = await supabase
      .from('holiday_email_templates')
      .select('id, holiday_name, holiday_slug, email_html')
      .eq('is_active', true);

    if (allError || !allTemplates) {
      console.error('❌ Failed to fetch all templates:', allError);
      process.exit(1);
    }

    let foundCount = 0;
    for (const t of allTemplates) {
      if (t.email_html?.includes('1552')) {
        foundCount++;
        console.log(`✅ Found in: ${t.holiday_name} (${t.holiday_slug})`);
      }
    }

    if (foundCount === 0) {
      console.log('❌ "1552" NOT FOUND in any active templates');
    } else {
      console.log(`\n✅ Total templates with "1552": ${foundCount}/${allTemplates.length}`);
    }

  } catch (error) {
    console.error('\n❌ ERROR:', error);
    process.exit(1);
  }
}

find1552Text();
