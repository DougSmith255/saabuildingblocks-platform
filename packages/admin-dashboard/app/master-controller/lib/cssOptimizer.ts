/**
 * CSS Optimizer - Minification, deduplication, and validation
 * Optimizes generated CSS before injection into the DOM
 */

/**
 * Minify CSS by removing unnecessary whitespace and comments
 */
export function minifyCSS(css: string): string {
  return css
    // Remove comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove leading/trailing whitespace
    .trim()
    // Collapse multiple spaces into one
    .replace(/\s+/g, ' ')
    // Remove spaces around special characters
    .replace(/\s*([{}:;,])\s*/g, '$1')
    // Remove trailing semicolons before closing braces
    .replace(/;}/g, '}')
    // Remove empty rules
    .replace(/[^}]+\{\s*\}/g, '');
}

/**
 * Deduplicate CSS rules (remove exact duplicates)
 */
export function deduplicateRules(css: string): string {
  // Split into individual rules
  const rules = css.split('}').filter((rule) => rule.trim());

  // Track seen rules
  const seen = new Set<string>();
  const unique: string[] = [];

  for (const rule of rules) {
    const normalized = rule.trim();
    if (normalized && !seen.has(normalized)) {
      seen.add(normalized);
      unique.push(normalized);
    }
  }

  return unique.join('}\n') + (unique.length > 0 ? '}' : '');
}

/**
 * Validate CSS for basic syntax errors
 * Returns array of errors (empty if valid)
 */
export function validateCSS(css: string): string[] {
  const errors: string[] = [];

  // Check for balanced braces
  const openBraces = (css.match(/{/g) || []).length;
  const closeBraces = (css.match(/}/g) || []).length;
  if (openBraces !== closeBraces) {
    errors.push(`Unbalanced braces: ${openBraces} open, ${closeBraces} close`);
  }

  // Check for empty selectors
  if (/\s*{\s*}/.test(css)) {
    errors.push('Empty CSS rules detected');
  }

  // Check for invalid characters in property names
  // Allow CSS custom properties (--*) and standard properties (lowercase-with-hyphens)
  const propertyMatches = css.matchAll(/([a-zA-Z-]+)\s*:/gi);
  for (const match of propertyMatches) {
    const property = match[1];
    // Valid patterns:
    // 1. CSS custom properties: --property-name (can have uppercase, numbers, hyphens)
    // 2. Standard properties: property-name (lowercase with hyphens only)
    const isCustomProperty = property.startsWith('--');
    const isStandardProperty = /^[a-z-]+$/.test(property);

    if (property && !isCustomProperty && !isStandardProperty) {
      errors.push(`Invalid property name: ${property}`);
    }
  }

  // Check for missing semicolons (not after last property in rule)
  const missingSemicolons = css.match(/[^;{}]\s*}/g);
  if (missingSemicolons && missingSemicolons.length > 0) {
    // This is actually valid CSS, but good practice to warn
    errors.push('Missing semicolons detected (non-critical)');
  }

  return errors;
}

/**
 * Full optimization pipeline
 * Minifies, deduplicates, and validates CSS
 */
export function optimizeCSS(css: string): {
  optimized: string;
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
  errors: string[];
} {
  const originalSize = new Blob([css]).size;

  // Step 1: Validate
  const errors = validateCSS(css);

  // Step 2: Minify
  let optimized = minifyCSS(css);

  // Step 3: Deduplicate
  optimized = deduplicateRules(optimized);

  const optimizedSize = new Blob([optimized]).size;
  const compressionRatio = originalSize > 0 ? optimizedSize / originalSize : 1;

  return {
    optimized,
    originalSize,
    optimizedSize,
    compressionRatio,
    errors,
  };
}

/**
 * Calculate CSS complexity score
 */
export function calculateComplexity(css: string): {
  ruleCount: number;
  selectorCount: number;
  propertyCount: number;
  complexityScore: number;
} {
  const ruleCount = (css.match(/{/g) || []).length;
  const selectorCount = (css.match(/[^{}]+(?={)/g) || []).length;
  const propertyCount = (css.match(/:/g) || []).length;

  // Complexity score: higher = more complex
  const complexityScore = ruleCount + selectorCount * 2 + propertyCount * 0.5;

  return {
    ruleCount,
    selectorCount,
    propertyCount,
    complexityScore,
  };
}
