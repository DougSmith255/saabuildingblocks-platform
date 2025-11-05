#!/usr/bin/env tsx
/**
 * Build-Time Static Files Generator
 *
 * Generates static CSS and component files from Master Controller settings.
 * These files can be included in static HTML exports.
 *
 * Usage:
 *   tsx scripts/generate-static-css.ts
 *   npm run generate:css
 *
 * Output:
 *   public/static-master-controller.css
 *   public/components/ (all SAA components)
 *
 * Features:
 * - Smart caching (skips write if content unchanged)
 * - Retry logic for Supabase connectivity
 * - Input validation
 * - Comprehensive error handling
 * - Component file copying from shared package
 *
 * Note: This uses the default settings from the Master Controller stores.
 * For custom settings, users must configure them via the Master Controller UI,
 * which persists to localStorage and is injected via useLiveCSS hook.
 */

import { writeFileSync, mkdirSync, readFileSync, existsSync, cpSync, readdirSync, statSync } from 'fs';
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

  // Check required properties exist (with _settings suffix)
  const hasTypography = data.typography_settings && typeof data.typography_settings === 'object';
  const hasColors = data.brand_colors_settings && typeof data.brand_colors_settings === 'object';
  const hasSpacing = data.spacing_settings && typeof data.spacing_settings === 'object';

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

    // Fetch settings with retry logic (key-value structure)
    const result = await retryWithBackoff(async () => {
      const { data, error } = await supabase
        .from('master_controller_settings')
        .select('setting_key, setting_value');

      if (error) {
        throw new Error(error.message);
      }

      return data;
    });

    if (!result || result.length === 0) {
      console.warn('⚠️  No settings found in database - using defaults');
      return null;
    }

    // Convert key-value array to object structure
    const settings: any = {};
    for (const row of result) {
      if (row.setting_key === 'typography') {
        settings.typography_settings = row.setting_value;
      } else if (row.setting_key === 'brand_colors') {
        settings.brand_colors_settings = row.setting_value;
      } else if (row.setting_key === 'spacing') {
        settings.spacing_settings = row.setting_value;
      }
    }

    // Validate settings structure
    if (!validateSettings(settings)) {
      console.warn('⚠️  Invalid settings structure - using defaults');
      return null;
    }

    console.log('✅ Settings loaded from database (after validation)');
    return settings;

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
 * Copy component files from shared package to public directory
 * Excludes Prismatic Glass and Stacked Animation Cards components
 */
function copyComponentFiles() {
  console.log('\n📦 Copying Component Files\n');
  console.log('=' .repeat(60));

  const sharedComponentsPath = join(__dirname, '../../shared/components/saa');
  const publicComponentsPath = join(__dirname, '../public/components');

  // Components to exclude (deprecated)
  const excludedComponents = [
    'CyberCardPrismaticGlass.tsx',
    'CyberCardStackedAnimation.tsx',
    'cyber-card-prismatic-glass',
    'stacked-animation-cards'
  ];

  try {
    // Ensure public/components directory exists
    mkdirSync(publicComponentsPath, { recursive: true });

    // Check if shared components exist
    if (!existsSync(sharedComponentsPath)) {
      console.warn(`⚠️  Shared components not found at: ${sharedComponentsPath}`);
      console.warn('   Skipping component copy');
      return 0;
    }

    let copiedCount = 0;
    let skippedCount = 0;

    // Recursively copy components
    function copyDirectory(src: string, dest: string, relativePath: string = '') {
      if (!existsSync(src)) return;

      const entries = readdirSync(src);

      for (const entry of entries) {
        const srcPath = join(src, entry);
        const destPath = join(dest, entry);
        const fullRelativePath = relativePath ? `${relativePath}/${entry}` : entry;

        // Skip if in excluded list
        if (excludedComponents.some(excluded => fullRelativePath.includes(excluded) || entry.includes(excluded))) {
          console.log(`   ⏭️  Skipped (deprecated): ${fullRelativePath}`);
          skippedCount++;
          continue;
        }

        const stat = statSync(srcPath);

        if (stat.isDirectory()) {
          mkdirSync(destPath, { recursive: true });
          copyDirectory(srcPath, destPath, fullRelativePath);
        } else {
          // Copy file
          cpSync(srcPath, destPath);
          console.log(`   ✓ Copied: ${fullRelativePath}`);
          copiedCount++;
        }
      }
    }

    copyDirectory(sharedComponentsPath, publicComponentsPath);

    console.log('\n📊 Component Copy Statistics:');
    console.log('   ' + '-'.repeat(50));
    console.log(`   Files Copied: ${copiedCount}`);
    console.log(`   Files Skipped (deprecated): ${skippedCount}`);
    console.log(`   Output: ${publicComponentsPath}`);
    console.log('   ' + '-'.repeat(50));

    return copiedCount;

  } catch (error) {
    console.error('❌ Failed to copy component files:', error);
    return 0;
  }
}

/**
 * Generates CSS and writes to file
 */
async function generateAndWriteCSS() {
  console.log('\n🎨 Master Controller Static Files Generator\n');
  console.log('=' .repeat(60));

  // Fetch from database (with fallback to defaults)
  const dbSettings = await fetchSettingsFromDatabase();

  const typography = dbSettings?.typography_settings || defaultTypography;
  const colors = dbSettings?.brand_colors_settings || defaultColors;
  const spacing = dbSettings?.spacing_settings || defaultSpacing;

  console.log('📊 Settings source:');
  console.log(`   Typography: ${dbSettings?.typography_settings ? 'DATABASE' : 'DEFAULTS'}`);
  console.log(`   Colors: ${dbSettings?.brand_colors_settings ? 'DATABASE' : 'DEFAULTS'}`);
  console.log(`   Spacing: ${dbSettings?.spacing_settings ? 'DATABASE' : 'DEFAULTS'}`);
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

  // Copy component files
  const componentsCopied = copyComponentFiles();

  if (componentsCopied > 0) {
    console.log('\n✅ Component files copied successfully!\n');
    console.log('💡 Components available at:');
    console.log('   /components/ (in static export)');
    console.log('\n💡 Import in your app:');
    console.log('   import { CTAButton } from "@/components/buttons/CTAButton"');
  } else {
    console.log('\n⚠️  No components copied (source not found or all excluded)\n');
  }
}

// Run the generator
generateAndWriteCSS().catch((error) => {
  console.error('\n💥 Fatal error:', error);
  process.exit(1);
});
