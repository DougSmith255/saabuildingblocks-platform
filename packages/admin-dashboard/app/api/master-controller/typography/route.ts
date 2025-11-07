import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

// Force dynamic rendering - exclude from static export
export const dynamic = 'force-dynamic';

/**
 * GET /api/master-controller/typography
 * Fetch typography settings from Supabase
 */
export async function GET() {
  try {
    // Lazy initialization - create client at runtime, not build time
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
      .from('master_controller_settings')
      .select('setting_value')
      .eq('setting_key', 'typography')
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows found, which is okay for first time
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: data?.setting_value || null,
    });
  } catch (error) {
    console.error('[Typography API] GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch typography settings' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/master-controller/typography
 * Save typography settings to Supabase
 */
export async function POST(request: NextRequest) {
  try {
    // Lazy initialization - create client at runtime, not build time
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await request.json();
    const { settings } = body;

    if (!settings) {
      return NextResponse.json(
        { success: false, error: 'Missing settings data' },
        { status: 400 }
      );
    }

    // Upsert using setting_key as conflict key
    const { data, error } = await supabase
      .from('master_controller_settings')
      .upsert({
        setting_key: 'typography',
        setting_value: settings,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'setting_key',
      })
      .select()
      .single();

    if (error) throw error;

    // Auto-sync: Update clampCalculator.ts with the saved settings
    try {
      await syncClampCalculator(settings);
    } catch (syncError) {
      console.error('[Typography API] Failed to sync clampCalculator:', syncError);
      // Don't fail the whole request, just log the error
    }

    return NextResponse.json({
      success: true,
      message: 'Typography settings saved successfully',
      data,
    });
  } catch (error) {
    console.error('[Typography API] POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save typography settings' },
      { status: 500 }
    );
  }
}

/**
 * Auto-sync clampCalculator.ts with saved typography settings
 * This ensures DEFAULT_TYPOGRAPHY_CLAMPS always matches the Master Controller UI
 */
async function syncClampCalculator(settings: any) {
  const clampCalculatorPath = join(process.cwd(), 'app/master-controller/lib/clampCalculator.ts');

  // Read current file
  const fileContent = readFileSync(clampCalculatorPath, 'utf-8');

  // Build the new DEFAULT_TYPOGRAPHY_CLAMPS object
  const clampEntries: string[] = [];

  const textTypes = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body', 'quote', 'link', 'button', 'caption', 'tagline', 'menuSubItem', 'menuMainItem'];

  for (const textType of textTypes) {
    if (settings[textType]?.size) {
      const { min, max, viewportMin, viewportMax, unit } = settings[textType].size;
      clampEntries.push(`  ${textType}: { min: ${min}, max: ${max}, viewportMin: ${viewportMin}, viewportMax: ${viewportMax}, unit: '${unit}' }`);
    }
  }

  const newClampObject = `export const DEFAULT_TYPOGRAPHY_CLAMPS: Record<string, ClampConfig> = {\n${clampEntries.join(',\n')},\n};`;

  // Replace the DEFAULT_TYPOGRAPHY_CLAMPS object in the file
  const updatedContent = fileContent.replace(
    /export const DEFAULT_TYPOGRAPHY_CLAMPS: Record<string, ClampConfig> = \{[^}]+\};/s,
    newClampObject
  );

  // Write back to file
  writeFileSync(clampCalculatorPath, updatedContent, 'utf-8');

  console.log('[Typography API] Successfully synced clampCalculator.ts with saved settings');
}
