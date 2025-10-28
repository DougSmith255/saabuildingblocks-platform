import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Force dynamic rendering - exclude from static export
export const dynamic = 'force-dynamic';

/**
 * GET /api/master-controller/spacing
 * Fetch spacing settings from Supabase
 */
export async function GET() {
  try {
    // Lazy initialization - create client at runtime, not build time
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error} = await supabase
      .from('master_controller_settings')
      .select('setting_value')
      .eq('setting_key', 'spacing')
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
    console.error('[Spacing API] GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch spacing settings' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/master-controller/spacing
 * Save spacing settings to Supabase
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
        setting_key: 'spacing',
        setting_value: settings,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'setting_key',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Spacing settings saved successfully',
      data,
    });
  } catch (error) {
    console.error('[Spacing API] POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save spacing settings' },
      { status: 500 }
    );
  }
}
