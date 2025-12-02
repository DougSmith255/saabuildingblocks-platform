/**
 * Strip All Web Font References and Use Only Email-Safe Fonts
 *
 * Problem: The HTML templates have:
 * 1. @font-face declarations loading Taskor/Amulya/Synonym from R2
 * 2. CSS rules with those font families
 * 3. These load BEFORE email-safe fallbacks, causing the wrong fonts to display
 *
 * Solution: Remove ALL web font references and use ONLY email-safe system fonts
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Remove all @font-face declarations and replace font-family with email-safe fonts
 */
function stripWebFonts(html: string): string {
  // Remove ALL @font-face declarations
  html = html.replace(/@font-face\s*{[^}]*}/g, '');

  // Replace Taskor with Impact (email-safe)
  html = html.replace(/font-family:\s*['"]?Taskor['"]?[^;!]*/g, "font-family: Impact, 'Arial Black', Arial, sans-serif");

  // Replace Amulya with Impact (email-safe)
  html = html.replace(/font-family:\s*['"]?Amulya['"]?[^;!]*/g, "font-family: Impact, 'Lucida Sans Unicode', 'Lucida Grande', sans-serif");

  // Replace Synonym with Lucida Sans Unicode (email-safe)
  html = html.replace(/font-family:\s*['"]?Synonym['"]?[^;!]*/g, "font-family: 'Lucida Sans Unicode', 'Lucida Grande', Arial, sans-serif");

  // Clean up empty style tags
  html = html.replace(/<style>\s*<\/style>/g, '');

  return html;
}

async function stripAllWebFonts() {
  try {
    console.log('=== STRIPPING ALL WEB FONT REFERENCES ===\n');

    // Fetch all active holiday templates
    console.log('[1/2] Fetching templates...');
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

    console.log(`✅ Found ${templates.length} templates\n`);

    // Strip web fonts from each template
    console.log('[2/2] Removing web fonts...\n');

    for (const template of templates) {
      console.log(`Processing: ${template.holiday_name} (${template.holiday_slug})`);

      if (!template.email_html) {
        console.log(`  ⚠️  No email_html found, skipping...\n`);
        continue;
      }

      // Check if template has web fonts
      const hasWebFonts = template.email_html.includes('@font-face') ||
                          template.email_html.includes('Taskor') ||
                          template.email_html.includes('Amulya') ||
                          template.email_html.includes('Synonym');

      if (!hasWebFonts) {
        console.log(`  ✅ Already clean, skipping...\n`);
        continue;
      }

      // Strip web fonts
      const cleanedHtml = stripWebFonts(template.email_html);

      // Save updated HTML
      const { error: updateError } = await supabase
        .from('holiday_email_templates')
        .update({ email_html: cleanedHtml })
        .eq('id', template.id);

      if (updateError) {
        console.error(`  ❌ Failed to update:`, updateError.message);
      } else {
        console.log(`  ✅ Web fonts stripped\n`);
      }
    }

    console.log('=== WEB FONTS COMPLETELY REMOVED ===');
    console.log('\nAll templates now use ONLY email-safe fonts:');
    console.log('  - Impact for headings');
    console.log('  - Lucida Sans Unicode for body');
    console.log('  - No @font-face declarations');
    console.log('  - No web font URLs');
    console.log('\nNext: Send test email to verify correct fonts display');

  } catch (error) {
    console.error('\n❌ ERROR:', error);
    process.exit(1);
  }
}

stripAllWebFonts();
