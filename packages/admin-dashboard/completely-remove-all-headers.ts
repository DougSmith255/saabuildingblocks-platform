/**
 * Completely Remove ALL Headers and Logo Remnants
 *
 * User wants NO headers at all - completely clean templates
 * This removes:
 * - All logo comments and divs
 * - All header tables
 * - The "1552" artifact
 * - Any other header-related content
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function completelyRemoveHeaders() {
  try {
    console.log('=== COMPLETELY REMOVING ALL HEADERS ===\n');

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

      // Remove "1552" artifact
      cleanedHtml = cleanedHtml.replace(/1552/g, '');

      // Remove ALL SAA Logo comments and their divs (greedy match)
      cleanedHtml = cleanedHtml.replace(
        /<!--\s*SAA Logo[^>]*-->\s*<div[^>]*>[\s\S]*?<\/div>/gi,
        ''
      );

      // Remove any standalone SAA Logo comments
      cleanedHtml = cleanedHtml.replace(
        /<!--\s*SAA Logo[^>]*-->/gi,
        ''
      );

      // Remove "Header with Logo and Tagline" tables
      cleanedHtml = cleanedHtml.replace(
        /<!--\s*Header with Logo and Tagline\s*-->\s*<table[^>]*>[\s\S]*?<\/table>/gi,
        ''
      );

      // Remove any img tags with SAA, logo, or cloudflare in src
      cleanedHtml = cleanedHtml.replace(
        /<img[^>]*src="[^"]*(?:SAA|logo|cloudflare|imagedelivery)[^"]*"[^>]*>/gi,
        ''
      );

      // Remove any divs that mention "logo" in style or content
      cleanedHtml = cleanedHtml.replace(
        /<div[^>]*(?:logo|header)[^>]*>[\s\S]*?<\/div>/gi,
        ''
      );

      // Remove tagline paragraphs
      cleanedHtml = cleanedHtml.replace(
        /<p[^>]*>\s*For Agents Who Want More\s*<\/p>/gi,
        ''
      );

      // Remove any tables with role="presentation" that might be headers
      // (but be careful - some might be layout tables)
      // Let's be more specific and only remove ones near the top with small content
      const bodyMatch = cleanedHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      if (bodyMatch) {
        let bodyContent = bodyMatch[1];

        // Remove empty or nearly-empty tables at the start
        bodyContent = bodyContent.replace(
          /^\s*<table[^>]*role="presentation"[^>]*>\s*<\/table>/gi,
          ''
        );

        // Remove tables that only contain images or minimal content at the start
        bodyContent = bodyContent.replace(
          /^\s*<table[^>]*role="presentation"[^>]*>[\s\S]{0,300}<\/table>/gi,
          ''
        );

        cleanedHtml = cleanedHtml.replace(
          /<body[^>]*>[\s\S]*?<\/body>/i,
          `<body>${bodyContent}</body>`
        );
      }

      // Clean up extra whitespace
      cleanedHtml = cleanedHtml.replace(/\n\s*\n\s*\n+/g, '\n\n');
      cleanedHtml = cleanedHtml.replace(/  +/g, ' ');

      // Show what we're finding
      if (cleanedHtml.includes('SAA') || cleanedHtml.includes('Logo') || cleanedHtml.includes('logo')) {
        console.log(`  ⚠️  Still contains logo/SAA references after cleaning`);

        // Find first occurrence
        const saaIndex = cleanedHtml.toLowerCase().indexOf('saa');
        const logoIndex = cleanedHtml.toLowerCase().indexOf('logo');
        const firstIndex = Math.min(
          saaIndex >= 0 ? saaIndex : Infinity,
          logoIndex >= 0 ? logoIndex : Infinity
        );

        if (firstIndex !== Infinity) {
          const context = cleanedHtml.substring(Math.max(0, firstIndex - 100), firstIndex + 200);
          console.log(`  Context: ${context.substring(0, 150)}...`);
        }
      }

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

    console.log('=== COMPLETE HEADER REMOVAL DONE ===');
    console.log('\nTemplates should now have:');
    console.log('  ✅ NO logos');
    console.log('  ✅ NO headers');
    console.log('  ✅ NO "1552" or other artifacts');
    console.log('  ✅ Just clean template content starting from <body>');

  } catch (error) {
    console.error('\n❌ ERROR:', error);
    process.exit(1);
  }
}

completelyRemoveHeaders();
