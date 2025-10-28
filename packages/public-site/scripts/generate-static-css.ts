#!/usr/bin/env tsx
/**
 * Build-Time Static CSS Generator
 *
 * Generates static CSS file from Master Controller default settings.
 * This CSS can be included in static HTML exports.
 *
 * Usage:
 *   tsx scripts/generate-static-css.ts
 *   npm run generate:css
 *
 * Output:
 *   public/static-master-controller.css
 *
 * Features:
 * - Smart caching (skips write if content unchanged)
 * - Retry logic for Supabase connectivity
 * - Input validation
 * - Comprehensive error handling
 *
 * Note: This uses the default settings from the Master Controller stores.
 * For custom settings, users must configure them via the Master Controller UI,
 * which persists to localStorage and is injected via useLiveCSS hook.
 */

import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';

// Import the existing CSS generator infrastructure
import { CSSGenerator } from '../app/master-controller/lib/cssGenerator';
import type {
  TypographySettings,
  BrandColorsSettings,
  SpacingSettings,
  ClampConfig,
} from '../app/master-controller/types';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Output path
const OUTPUT_PATH = join(__dirname, '../public/static-master-controller.css');

/**
 * Calculates SHA-256 hash of content for cache comparison
 */
function calculateHash(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

/**
 * Checks if output file exists and matches content hash
 * Returns true if file unchanged (can skip write)
 *
 * Note: Excludes timestamp line from comparison to detect actual CSS changes
 */
function shouldSkipWrite(newContent: string): boolean {
  if (!existsSync(OUTPUT_PATH)) {
    return false; // File doesn't exist, must write
  }

  try {
    const existingContent = readFileSync(OUTPUT_PATH, 'utf-8');

    // Remove timestamp lines for comparison (starts with "Generated:")
    const normalizeForComparison = (content: string) => {
      return content
        .split('\n')
        .filter(line => !line.includes('Generated:'))
        .join('\n');
    };

    const normalizedExisting = normalizeForComparison(existingContent);
    const normalizedNew = normalizeForComparison(newContent);

    const existingHash = calculateHash(normalizedExisting);
    const newHash = calculateHash(normalizedNew);

    return existingHash === newHash;
  } catch (error) {
    return false; // Error reading file, write anyway
  }
}

/**
 * Validates settings structure
 */
function validateSettings(data: any): boolean {
  if (!data) return false;

  // Check required properties exist
  const hasTypography = data.typography && typeof data.typography === 'object';
  const hasColors = data.brand_colors && typeof data.brand_colors === 'object';
  const hasSpacing = data.spacing && typeof data.spacing === 'object';

  return hasTypography || hasColors || hasSpacing; // At least one required
}

/**
 * Retries async function with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxRetries) {
        const delay = initialDelay * Math.pow(2, attempt - 1);
        console.warn(`⚠️  Attempt ${attempt}/${maxRetries} failed, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

/**
 * Fetches Master Controller settings from Supabase database
 * Falls back to defaults if database unavailable
 * Includes retry logic for transient failures
 */
async function fetchSettingsFromDatabase() {
  try {
    // Check for Supabase credentials
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.warn('⚠️  Supabase credentials not found - using defaults');
      return null;
    }

    // Connect to Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch settings with retry logic
    const result = await retryWithBackoff(async () => {
      const { data, error } = await supabase
        .from('design_settings')
        .select('typography, brand_colors, spacing')
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    });

    if (!result) {
      console.warn('⚠️  No settings found in database - using defaults');
      return null;
    }

    // Validate settings structure
    if (!validateSettings(result)) {
      console.warn('⚠️  Invalid settings structure - using defaults');
      return null;
    }

    console.log('✅ Settings loaded from database (after validation)');
    return result;

  } catch (error) {
    console.warn('⚠️  Database fetch failed:', error instanceof Error ? error.message : String(error), '- using defaults');
    return null;
  }
}

/**
 * Default settings from Master Controller stores
 * These match the default values in:
 * - app/master-controller/stores/typographyStore.ts
 * - app/master-controller/stores/brandColorsStore.ts
 * - app/master-controller/stores/spacingStore.ts
 */

// Brand Colors (from brandColorsStore.ts)
const defaultColors: BrandColorsSettings = {
  accentGreen: '#00ff88',     // Bright green for links/accents
  headingText: '#ffd700',     // Gold for headings
  bodyText: '#dcdbd5',        // Off-white for body text
  brandGold: '#ffd700',       // Gold brand color
  darkGray: '#191818',        // Dark gray for containers
  mediumGray: '#404040',      // Medium gray for menus
};

// Typography (from typographyStore.ts)
const defaultTypography: TypographySettings = {
  h1: {
    size: { min: 48, max: 120, viewportMin: 300, viewportMax: 2050, unit: 'px' },
    lineHeight: 1.2,
    letterSpacing: -0.02,
    fontWeight: 700,
    fontFamily: 'var(--font-amulya)',
    color: 'headingText',
  },
  h2: {
    size: { min: 40, max: 96, viewportMin: 300, viewportMax: 2050, unit: 'px' },
    lineHeight: 1.2,
    letterSpacing: -0.01,
    fontWeight: 700,
    fontFamily: 'var(--font-amulya)',
    color: 'headingText',
  },
  h3: {
    size: { min: 32, max: 72, viewportMin: 300, viewportMax: 2050, unit: 'px' },
    lineHeight: 1.3,
    letterSpacing: 0,
    fontWeight: 700,
    fontFamily: 'var(--font-amulya)',
    color: 'headingText',
  },
  h4: {
    size: { min: 26, max: 56, viewportMin: 300, viewportMax: 2050, unit: 'px' },
    lineHeight: 1.3,
    letterSpacing: 0,
    fontWeight: 700,
    fontFamily: 'var(--font-amulya)',
    color: 'headingText',
  },
  h5: {
    size: { min: 22, max: 44, viewportMin: 300, viewportMax: 2050, unit: 'px' },
    lineHeight: 1.4,
    letterSpacing: 0,
    fontWeight: 700,
    fontFamily: 'var(--font-amulya)',
    color: 'headingText',
  },
  h6: {
    size: { min: 18, max: 32, viewportMin: 300, viewportMax: 2050, unit: 'px' },
    lineHeight: 1.4,
    letterSpacing: 0,
    fontWeight: 700,
    fontFamily: 'var(--font-amulya)',
    color: 'headingText',
  },
  body: {
    size: { min: 16, max: 28, viewportMin: 300, viewportMax: 2050, unit: 'px' },
    lineHeight: 1.6,
    letterSpacing: 0,
    fontWeight: 400,
    fontFamily: 'var(--font-synonym)',
    color: 'bodyText',
  },
  quote: {
    size: { min: 18, max: 32, viewportMin: 300, viewportMax: 2050, unit: 'px' },
    lineHeight: 1.5,
    letterSpacing: 0,
    fontWeight: 400,
    fontFamily: 'var(--font-amulya)',
    fontStyle: 'italic',
    color: 'bodyText',
  },
  link: {
    size: { min: 16, max: 28, viewportMin: 300, viewportMax: 2050, unit: 'px' },
    lineHeight: 1.6,
    letterSpacing: 0,
    fontWeight: 400,
    fontFamily: 'var(--font-synonym)',
    color: 'accentGreen',
  },
  button: {
    size: { min: 14, max: 20, viewportMin: 300, viewportMax: 2050, unit: 'px' },
    lineHeight: 1,
    letterSpacing: 0.01,
    fontWeight: 600,
    fontFamily: 'var(--font-taskor)',
    color: 'bodyText',
  },
  tagline: {
    size: { min: 16, max: 21, viewportMin: 300, viewportMax: 2050, unit: 'px' },
    lineHeight: 1.4,
    letterSpacing: 0.05,
    fontWeight: 500,
    fontFamily: 'var(--font-taskor)',
    color: 'headingText',
  },
  caption: {
    size: { min: 12, max: 16, viewportMin: 300, viewportMax: 2050, unit: 'px' },
    lineHeight: 1.4,
    letterSpacing: 0,
    fontWeight: 400,
    fontFamily: 'var(--font-synonym)',
    color: 'mediumGray',
  },
};

// Spacing (from spacingStore.ts)
const defaultSpacing: SpacingSettings = {
  containerPadding: { min: 16, max: 48, viewportMin: 300, viewportMax: 2050, unit: 'px' },
  gridGap: { min: 16, max: 32, viewportMin: 300, viewportMax: 2050, unit: 'px' },
  sectionMargin: { min: 48, max: 120, viewportMin: 300, viewportMax: 2050, unit: 'px' },
  gridMinWidth: 300,
};

/**
 * Generates CSS and writes to file
 */
async function generateAndWriteCSS() {
  console.log('\n🎨 Master Controller Static CSS Generator\n');
  console.log('=' .repeat(60));

  // Fetch from database (with fallback to defaults)
  const dbSettings = await fetchSettingsFromDatabase();

  const typography = dbSettings?.typography || defaultTypography;
  const colors = dbSettings?.brand_colors || defaultColors;
  const spacing = dbSettings?.spacing || defaultSpacing;

  console.log('📊 Settings source:');
  console.log(`   Typography: ${dbSettings?.typography ? 'DATABASE' : 'DEFAULTS'}`);
  console.log(`   Colors: ${dbSettings?.brand_colors ? 'DATABASE' : 'DEFAULTS'}`);
  console.log(`   Spacing: ${dbSettings?.spacing ? 'DATABASE' : 'DEFAULTS'}`);
  console.log('');
  console.log('📊 Settings details:');
  console.log(`   Typography: ${Object.keys(typography).length} text types`);
  console.log(`   Colors: ${Object.keys(colors).length} brand colors`);
  console.log(`   Spacing: ${Object.keys(spacing).length} tokens`);

  // Generate CSS using existing CSSGenerator
  console.log('\n🔨 Generating CSS...');
  const css = CSSGenerator.generateComplete(
    colors,
    typography,
    spacing
  );

  // Add header comment
  const settingsSource = dbSettings ? 'database (Supabase)' : 'default Master Controller settings';
  const header = `/**
 * Master Controller Static CSS
 * Auto-generated from ${settingsSource}
 * Generated: ${new Date().toISOString()}
 *
 * This file contains design system tokens from the Master Controller.
 * Include this in your static HTML exports to apply typography, colors,
 * and spacing settings without requiring dynamic JavaScript.
 *
 * Settings source:
 * - Typography: ${dbSettings?.typography ? 'DATABASE' : 'DEFAULTS'}
 * - Colors: ${dbSettings?.brand_colors ? 'DATABASE' : 'DEFAULTS'}
 * - Spacing: ${dbSettings?.spacing ? 'DATABASE' : 'DEFAULTS'}
 *
 * For custom settings:
 * 1. Use the Master Controller UI (https://saabuildingblocks.com/master-controller)
 * 2. Settings persist to Supabase database and are injected via useLiveCSS hook
 * 3. Regenerate this file to bake database settings into static export
 *
 * DO NOT EDIT MANUALLY - Regenerate with: npm run generate:css
 */

`;

  const finalCSS = header + css;

  // Check if content changed (smart caching)
  if (shouldSkipWrite(finalCSS)) {
    console.log('\n⚡ CSS unchanged - skipping write (cache hit)');
    console.log(`   Output: ${OUTPUT_PATH}`);
    console.log('\n✅ Static CSS generation complete (cached)!\n');
    return;
  }

  // Ensure public directory exists
  try {
    mkdirSync(join(__dirname, '../public'), { recursive: true });
  } catch (error) {
    // Directory might already exist, ignore
  }

  // Write to file
  console.log(`\n📝 Writing CSS to: ${OUTPUT_PATH}`);
  try {
    writeFileSync(OUTPUT_PATH, finalCSS, 'utf-8');
    console.log('✅ CSS file written successfully');
  } catch (error) {
    console.error('❌ Failed to write CSS file:', error);
    process.exit(1);
  }

  // Report statistics
  const sizeKB = (finalCSS.length / 1024).toFixed(2);
  const lines = finalCSS.split('\n').length;

  console.log('\n📊 Generation Statistics:');
  console.log('   ' + '-'.repeat(50));
  console.log(`   File Size: ${sizeKB} KB`);
  console.log(`   Lines: ${lines}`);
  console.log(`   Output: ${OUTPUT_PATH}`);
  console.log('   ' + '-'.repeat(50));

  console.log('\n✅ Static CSS generation complete!\n');
  console.log('💡 Usage in HTML:');
  console.log('   <link rel="stylesheet" href="/static-master-controller.css">');
  console.log('\n💡 Dynamic site (recommended):');
  console.log('   Settings managed via Master Controller UI');
  console.log('   CSS injected dynamically via useLiveCSS hook');
  console.log('   Changes apply instantly without rebuild\n');
}

// Run the generator
generateAndWriteCSS().catch((error) => {
  console.error('\n💥 Fatal error:', error);
  process.exit(1);
});
