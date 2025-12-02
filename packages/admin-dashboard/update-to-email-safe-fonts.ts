/**
 * Update Typography Settings to Email-Safe Fonts
 * Switches from custom web fonts (Taskor, Amulya, Synonym) to email-safe system fonts
 *
 * Font Selections:
 * - Impact for headings (H1/H2/H3) - bold, futuristic look
 * - Lucida Sans Unicode for body - clean, modern, cross-platform
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function updateTypographySettings() {
  try {
    console.log('=== UPDATING TYPOGRAPHY SETTINGS TO EMAIL-SAFE FONTS ===\n');

    // Define email-safe font stacks with fallbacks
    const emailSafeFonts = {
      // Impact for headings - bold, modern, futuristic
      h1_font_family: "Impact, 'Arial Black', Arial, sans-serif",
      h2_font_family: "Impact, 'Lucida Sans Unicode', 'Lucida Grande', sans-serif",
      h3_font_family: "Impact, 'Lucida Sans Unicode', 'Lucida Grande', sans-serif",

      // Lucida Sans Unicode for body - clean, readable, universal
      body_font_family: "'Lucida Sans Unicode', 'Lucida Grande', Arial, sans-serif",
    };

    console.log('New Font Settings:');
    console.log('- H1:', emailSafeFonts.h1_font_family);
    console.log('- H2:', emailSafeFonts.h2_font_family);
    console.log('- H3:', emailSafeFonts.h3_font_family);
    console.log('- Body:', emailSafeFonts.body_font_family);
    console.log('');

    // Update typography settings
    const { data, error } = await supabase
      .from('email_typography_settings')
      .update(emailSafeFonts)
      .eq('is_active', true)
      .select();

    if (error) {
      console.error('❌ Failed to update typography settings:', error);
      process.exit(1);
    }

    console.log('✅ Typography settings updated successfully!');
    console.log(`Updated ${data?.length || 0} row(s)`);
    console.log('\nNext Step: Regenerate all holiday email templates to apply these fonts.');
    console.log('Run: npx tsx regenerate-all-templates.ts');

  } catch (error) {
    console.error('\n❌ ERROR:', error);
    process.exit(1);
  }
}

updateTypographySettings();
