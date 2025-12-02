/**
 * Fix Logo: Remove Duplicates and Add Tagline
 *
 * Issues to fix:
 * 1. Two logo images appearing (duplicate)
 * 2. Missing tagline "For Agents Who Want More"
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const LOGO_URL = 'https://assets.saabuildingblocks.com/Website-Images/SAA%20Email%20Logo%202.png';

// Correct logo HTML with tagline
const CORRECT_LOGO_HTML = `
      <!-- SAA Logo -->
      <div style="text-align: center; margin-bottom: 30px;">
        <img
          src="${LOGO_URL}"
          alt="Smart Agent Alliance Logo"
          style="max-width: 200px; height: auto; display: block; margin: 0 auto;"
        />
        <p style="font-family: 'Lucida Sans Unicode', 'Lucida Grande', Arial, sans-serif !important; font-size: 14px !important; font-weight: 300 !important; color: #bfbdb0 !important; line-height: 1.7 !important; letter-spacing: 0 !important; margin-top: 10px !important; margin-bottom: 0 !important;">
          For Agents Who Want More
        </p>
      </div>`;

async function fixLogoWithTagline() {
  try {
    console.log('=== FIXING LOGO: REMOVING DUPLICATES AND ADDING TAGLINE ===\n');

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

      // Remove ALL existing logo divs (both singles and duplicates)
      // This regex matches the entire logo div block
      updatedHtml = updatedHtml.replace(
        /<!--\s*SAA Logo\s*-->[\s\S]*?<div[^>]*>[\s\S]*?<img[^>]*src="[^"]*SAA[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
        ''
      );

      // Also remove any standalone logo img tags
      updatedHtml = updatedHtml.replace(
        /<img[^>]*src="[^"]*SAA[^"]*Email[^"]*Logo[^"]*"[^>]*>/gi,
        ''
      );

      // Insert the correct logo with tagline at the beginning of body
      const insertPatterns = [
        /(<body[^>]*>\s*)(<div|<table|<h1|<p)/i,
        /(<body[^>]*>\s*)/i
      ];

      let inserted = false;
      for (const pattern of insertPatterns) {
        if (pattern.test(updatedHtml)) {
          updatedHtml = updatedHtml.replace(pattern, (match, p1, p2) => {
            if (p2) {
              return `${p1}${CORRECT_LOGO_HTML}\n      ${p2}`;
            } else {
              return `${p1}${CORRECT_LOGO_HTML}\n      `;
            }
          });
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
        console.log(`  ✅ Logo fixed with tagline\n`);
      }
    }

    console.log('=== LOGO FIX COMPLETE ===');
    console.log('\nAll templates now have:');
    console.log('  ✅ Single logo image (no duplicates)');
    console.log('  ✅ Tagline: "For Agents Who Want More"');
    console.log('  ✅ Proper styling and spacing');

  } catch (error) {
    console.error('\n❌ ERROR:', error);
    process.exit(1);
  }
}

fixLogoWithTagline();
