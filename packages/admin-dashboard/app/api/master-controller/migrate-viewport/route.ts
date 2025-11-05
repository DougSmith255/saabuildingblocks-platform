import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Migration endpoint to update all viewport ranges from 300-2050 to 250-3000
 * This covers mobile to large desktop in one clamp range for simpler builds
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[Viewport Migration] Starting migration...');

    // 1. Fetch all typography settings
    const { data: typographyData, error: typographyError } = await supabase
      .from('master_controller_typography')
      .select('*');

    if (typographyError) {
      console.error('[Viewport Migration] Error fetching typography:', typographyError);
      return NextResponse.json({ error: typographyError.message }, { status: 500 });
    }

    // 2. Update each typography text type
    let typographyUpdated = 0;
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
          console.error(`[Viewport Migration] Error updating ${row.text_type}:`, updateError);
        } else {
          console.log(`[Viewport Migration] ✓ Updated ${row.text_type}: 250-3000`);
          typographyUpdated++;
        }
      }
    }

    // 3. Fetch spacing settings
    const { data: spacingData, error: spacingError } = await supabase
      .from('master_controller_spacing')
      .select('*')
      .single();

    if (spacingError && spacingError.code !== 'PGRST116') {
      console.error('[Viewport Migration] Error fetching spacing:', spacingError);
      return NextResponse.json({ error: spacingError.message }, { status: 500 });
    }

    // 4. Update spacing viewport ranges
    let spacingUpdated = 0;
    if (spacingData) {
      let needsUpdate = false;
      const updates: any = {};

      // Update container padding
      if (spacingData.container_padding?.viewportMin === 300) {
        updates.container_padding = {
          ...spacingData.container_padding,
          viewportMin: 250,
          viewportMax: 3000
        };
        needsUpdate = true;
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
        spacingUpdated++;
      }

      if (needsUpdate) {
        const { error: updateError } = await supabase
          .from('master_controller_spacing')
          .update(updates)
          .eq('id', spacingData.id);

        if (updateError) {
          console.error('[Viewport Migration] Error updating spacing:', updateError);
        } else {
          console.log('[Viewport Migration] ✓ Updated spacing settings: 250-3000');
        }
      }
    }

    console.log('[Viewport Migration] Migration complete!');
    console.log(`[Viewport Migration] Typography: ${typographyUpdated} text types updated`);
    console.log(`[Viewport Migration] Spacing: ${spacingUpdated} properties updated`);

    return NextResponse.json({
      success: true,
      message: 'Viewport ranges migrated from 300-2050 to 250-3000',
      updated: {
        typography: typographyUpdated,
        spacing: spacingUpdated
      }
    });

  } catch (error: any) {
    console.error('[Viewport Migration] Unexpected error:', error);
    return NextResponse.json(
      { error: error.message || 'Migration failed' },
      { status: 500 }
    );
  }
}
