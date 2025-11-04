/**
 * Build-Time CSS Generator
 *
 * Reads pre-generated Master Controller CSS from static file at build time
 * and inlines it into static HTML.
 *
 * This is used for static site generation where we need to bake
 * the design settings into the HTML instead of injecting them
 * dynamically via JavaScript.
 *
 * The static CSS file is generated via: npm run generate:css
 * Location: public/static-master-controller.css
 */

import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Generates static CSS from pre-generated Master Controller settings file
 * This CSS will be inlined into the HTML <head> at build time
 *
 * @returns CSS string ready to be inlined (with comments stripped for production)
 */
export async function generateStaticCSS(): Promise<string> {
  console.log('🎨 Loading pre-generated Master Controller CSS...');

  try {
    // Read the pre-generated CSS file from public directory
    const cssPath = join(process.cwd(), 'public', 'static-master-controller.css');
    const css = readFileSync(cssPath, 'utf-8');

    // Strip comments and extra whitespace for production
    const minified = css
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove /* */ comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/\s*([{}:;,])\s*/g, '$1') // Remove spaces around CSS syntax
      .trim();

    console.log(`✅ Loaded ${(minified.length / 1024).toFixed(2)}KB of static CSS from pre-generated file`);

    return minified;
  } catch (error) {
    console.error('❌ Failed to load static-master-controller.css:', error);
    console.warn('⚠️  Make sure to run: npm run generate:css');
    // Return empty string to allow build to continue
    return '';
  }
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
