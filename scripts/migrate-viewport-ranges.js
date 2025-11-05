#!/usr/bin/env node

/**
 * Migration script to update all viewport ranges from 300-2050 to 250-3000
 * This covers mobile to large desktop in one clamp range for simpler builds
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '/home/claude-flow/packages/admin-dashboard/.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function migrateViewportRanges() {
  console.log('\n🔄 Starting viewport range migration (300-2050 → 250-3000)...\n');

  try {
    // 1. Fetch all typography settings
    console.log('📖 Fetching typography settings...');
    const { data: typographyData, error: typographyError } = await supabase
      .from('master_controller_typography')
      .select('*');

    if (typographyError) {
      throw new Error(`Failed to fetch typography: ${typographyError.message}`);
    }

    // 2. Update each typography text type
    let typographyUpdated = 0;
    console.log(`Found ${typographyData?.length || 0} typography entries\n`);

    for (const row of typographyData || []) {
      const settings = row.settings;

      // Check if this row has old viewport values
      if (settings?.size?.viewportMin === 300 && settings?.size?.viewportMax === 2050) {
        settings.size.viewportMin = 250;
        settings.size.viewportMax = 3000;

        const { error: updateError } = await supabase
          .from('master_controller_typography')
          .update({ settings })
          .eq('id', row.id);

        if (updateError) {
          console.error(`  ❌ Error updating ${row.text_type}:`, updateError.message);
        } else {
          console.log(`  ✓ Updated ${row.text_type}: 250-3000`);
          typographyUpdated++;
        }
      } else {
        console.log(`  → ${row.text_type}: Already updated or custom values`);
      }
    }

    // 3. Fetch spacing settings
    console.log('\n📖 Fetching spacing settings...');
    const { data: spacingData, error: spacingError } = await supabase
      .from('master_controller_spacing')
      .select('*')
      .single();

    if (spacingError && spacingError.code !== 'PGRST116') {
      throw new Error(`Failed to fetch spacing: ${spacingError.message}`);
    }

    // 4. Update spacing viewport ranges
    let spacingUpdated = 0;
    if (spacingData) {
      let needsUpdate = false;
      const updates = {};

      // Update container padding
      if (spacingData.container_padding?.viewportMin === 300) {
        updates.container_padding = {
          ...spacingData.container_padding,
          viewportMin: 250,
          viewportMax: 3000
        };
        needsUpdate = true;
        console.log('  ✓ Will update containerPadding: 250-3000');
        spacingUpdated++;
      }

      // Update grid gap
      if (spacingData.grid_gap?.viewportMin === 300) {
        updates.grid_gap = {
          ...spacingData.grid_gap,
          viewportMin: 250,
          viewportMax: 3000
        };
        needsUpdate = true;
        console.log('  ✓ Will update gridGap: 250-3000');
        spacingUpdated++;
      }

      // Update section margin
      if (spacingData.section_margin?.viewportMin === 300) {
        updates.section_margin = {
          ...spacingData.section_margin,
          viewportMin: 250,
          viewportMax: 3000
        };
        needsUpdate = true;
        console.log('  ✓ Will update sectionMargin: 250-3000');
        spacingUpdated++;
      }

      if (needsUpdate) {
        const { error: updateError } = await supabase
          .from('master_controller_spacing')
          .update(updates)
          .eq('id', spacingData.id);

        if (updateError) {
          console.error('\n  ❌ Error updating spacing:', updateError.message);
        } else {
          console.log('\n  ✓ Spacing settings updated successfully');
        }
      } else {
        console.log('\n  → Spacing: Already updated or custom values');
      }
    } else {
      console.log('\n  → No spacing settings found in database');
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('✅ Migration Complete!');
    console.log('='.repeat(60));
    console.log(`Typography text types updated: ${typographyUpdated}`);
    console.log(`Spacing properties updated: ${spacingUpdated}`);
    console.log(`\n💡 Refresh the Master Controller UI to see changes\n`);

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run migration
migrateViewportRanges();
