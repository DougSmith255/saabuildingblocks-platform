import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - exclude from static export
export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/master-controller/brand-colors
 * Fetch brand colors from Supabase
 */
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('master_controller_settings')
      .select('setting_value')
      .eq('setting_key', 'brand_colors')
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
    console.error('[Brand Colors API] GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch brand colors' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/master-controller/brand-colors
 * Save brand colors to Supabase
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { colors } = body;

    if (!colors) {
      return NextResponse.json(
        { success: false, error: 'Missing colors data' },
        { status: 400 }
      );
    }

    // Upsert using setting_key as conflict key
    const { data, error } = await supabase
      .from('master_controller_settings')
      .upsert({
        setting_key: 'brand_colors',
        setting_value: colors,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'setting_key',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Brand colors saved successfully',
      data,
    });
  } catch (error) {
    console.error('[Brand Colors API] POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save brand colors' },
      { status: 500 }
    );
  }
}
