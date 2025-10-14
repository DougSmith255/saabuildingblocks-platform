/**
 * Build-Time CSS Generator
 *
 * Reads Master Controller settings from database at build time
 * and generates CSS that can be inlined into static HTML.
 *
 * This is used for static site generation where we need to bake
 * the design settings into the HTML instead of injecting them
 * dynamically via JavaScript.
 */

import { createClient } from '@supabase/supabase-js';
import { CSSGenerator } from './cssGenerator';
import type { TypographySettings, BrandColorsSettings, SpacingSettings } from '../types';

const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL'] || '';
const supabaseServiceKey = process.env['SUPABASE_SERVICE_ROLE_KEY'] || '';

/**
 * Fetches Master Controller settings from Supabase database
 * Uses service role key for server-side access during build
 */
async function fetchSettings() {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('⚠️ Supabase credentials not found, using default settings');
    return null;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Fetch typography settings
    const { data: typographyData } = await supabase
      .from('typography_settings')
      .select('settings')
      .single();

    // Fetch brand colors
    const { data: colorsData } = await supabase
      .from('brand_colors')
      .select('settings')
      .single();

    // Fetch spacing settings
    const { data: spacingData } = await supabase
      .from('spacing_settings')
      .select('settings')
      .single();

    return {
      typography: typographyData?.settings as TypographySettings | null,
      colors: colorsData?.settings as BrandColorsSettings | null,
      spacing: spacingData?.settings as SpacingSettings | null,
    };
  } catch (error) {
    console.error('❌ Failed to fetch Master Controller settings:', error);
    return null;
  }
}

/**
 * Generates static CSS from Master Controller settings
 * This CSS will be inlined into the HTML <head> at build time
 *
 * @returns Minified CSS string ready to be inlined
 */
export async function generateStaticCSS(): Promise<string> {
  console.log('🎨 Generating static CSS from Master Controller settings...');

  const settings = await fetchSettings();

  if (!settings || !settings.typography || !settings.colors || !settings.spacing) {
    console.warn('⚠️ Using default Master Controller settings');
    // Return empty string - default CSS from critical.css will be used
    return '';
  }

  // Generate CSS using the same generator as the live system
  const css = CSSGenerator.generateComplete(
    settings.colors,
    settings.typography,
    settings.spacing
  );

  console.log(`✅ Generated ${(css.length / 1024).toFixed(2)}KB of static CSS`);

  return css;
}

/**
 * Generates CSS for a specific page (optional future enhancement)
 * Allows per-page CSS customization if needed
 */
export async function generatePageCSS(pageId: string): Promise<string> {
  // Future: Could fetch page-specific overrides from database
  // For now, just return the global CSS
  return generateStaticCSS();
}
