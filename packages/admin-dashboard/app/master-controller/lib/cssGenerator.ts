import type { BrandColorsSettings, TypographySettings, SpacingSettings } from '../types';
import { generateClamp } from './clampCalculator';

/**
 * CSS Generator - Converts Zustand store settings into CSS custom properties
 * This is the CORE ENGINE that propagates design system changes to all components
 */
export class CSSGenerator {
  /**
   * Generate CSS custom properties for brand colors
   */
  static generateBrandColors(colors: BrandColorsSettings): string {
    return `
      --color-accentGreen: ${colors.accentGreen};
      --color-brandGold: ${colors.brandGold};
      --color-headingText: ${colors.headingText};
      --color-bodyText: ${colors.bodyText};
      --color-darkGray: ${colors.darkGray};
      --color-mediumGray: ${colors.mediumGray};
    `.trim();
  }

  /**
   * Generate CSS custom properties for typography
   */
  static generateTypography(typography: TypographySettings, colors: BrandColorsSettings): string {
    const entries = Object.entries(typography);
    const cssLines: string[] = [];

    entries.forEach(([key, settings]) => {
      // Safety check: ensure settings and size exist
      if (!settings || !settings.size) {
        console.warn(`[CSSGenerator] Missing or invalid settings for ${key}, skipping typography generation`);
        return;
      }

      const sizeClamp = generateClamp(settings.size);
      cssLines.push(`--font-size-${key}: ${sizeClamp};`);
      cssLines.push(`--line-height-${key}: ${settings.lineHeight};`);
      cssLines.push(`--letter-spacing-${key}: ${settings.letterSpacing}em;`);
      cssLines.push(`--font-weight-${key}: ${settings.fontWeight};`);

      // Handle CSS variables (var(--font-*)) without quotes, regular fonts with quotes
      const fontFamily = settings.fontFamily.startsWith('var(--')
        ? `${settings.fontFamily}, sans-serif`
        : `'${settings.fontFamily}', sans-serif`;
      cssLines.push(`--font-family-${key}: ${fontFamily};`);

      // Add font-style if specified
      if (settings.fontStyle && settings.fontStyle !== 'normal') {
        cssLines.push(`--font-style-${key}: ${settings.fontStyle};`);
      }

      // Add text color - use direct hex value to avoid race condition with CSS variables
      const validColors = ['accentGreen', 'brandGold', 'headingText', 'bodyText', 'darkGray', 'mediumGray'];
      const colorValue = validColors.includes(settings.color) ? settings.color : 'bodyText';

      if (!validColors.includes(settings.color)) {
        // Enhanced error message with debugging information
        console.warn(
          `[CSSGenerator] Invalid color '${settings.color}' for ${key}.\n` +
          `  Valid colors: ${validColors.join(', ')}\n` +
          `  Using fallback: 'bodyText'\n` +
          `  Tip: Check typographyTransformer.ts color mapping`
        );
      }

      // Use direct hex value from colors object instead of CSS variable reference
      const hexColor = colors[colorValue as keyof BrandColorsSettings] || '#dcdbd5';
      cssLines.push(`--text-color-${key}: ${hexColor};`);
    });

    return cssLines.join('\n      ');
  }

  /**
   * Generate CSS custom properties for spacing
   */
  static generateSpacing(spacing: SpacingSettings): string {
    // Validate spacing config before calling generateClamp
    if (!spacing?.containerPadding || !spacing?.gridGap || !spacing?.sectionMargin) {
      console.warn('[CSSGenerator] Invalid spacing settings, using safe defaults');
      return `
        --spacing-container-padding: clamp(16px, calc(-13.33px + 9.62vw), 80px);
        --spacing-grid-gap: clamp(16px, calc(12.57px + 1.14vw), 32px);
        --spacing-section-margin: clamp(32px, calc(-26.67px + 19.24vw), 120px);
        --grid-min-width: 300px;
      `.trim();
    }

    const containerPaddingClamp = generateClamp(spacing.containerPadding);
    const gridGapClamp = generateClamp(spacing.gridGap);
    const sectionMarginClamp = generateClamp(spacing.sectionMargin);

    return `
      --spacing-container-padding: ${containerPaddingClamp};
      --spacing-grid-gap: ${gridGapClamp};
      --spacing-section-margin: ${sectionMarginClamp};
      --grid-min-width: ${spacing.gridMinWidth}px;
    `.trim();
  }

  /**
   * Generate complete CSS with all custom properties
   * This is injected into <head> via useLiveCSS hook
   */
  static generateComplete(
    colors: BrandColorsSettings,
    typography: TypographySettings,
    spacing: SpacingSettings
  ): string {
    return `
:root {
  /* Brand Colors */
  ${this.generateBrandColors(colors)}

  /* Typography */
  ${this.generateTypography(typography, colors)}

  /* Spacing */
  ${this.generateSpacing(spacing)}
}

/* Typography Classes - Apply to components */
.text-h1 {
  color: var(--text-color-h1);
  font-size: var(--font-size-h1);
  line-height: var(--line-height-h1);
  letter-spacing: var(--letter-spacing-h1);
  font-weight: var(--font-weight-h1);
  font-family: var(--font-family-h1);
  font-style: var(--font-style-h1, normal);
}

.text-h2 {
  color: var(--text-color-h2);
  font-size: var(--font-size-h2);
  line-height: var(--line-height-h2);
  letter-spacing: var(--letter-spacing-h2);
  font-weight: var(--font-weight-h2);
  font-family: var(--font-family-h2);
  font-style: var(--font-style-h2, normal);
}

.text-h3 {
  color: var(--text-color-h3);
  font-size: var(--font-size-h3);
  line-height: var(--line-height-h3);
  letter-spacing: var(--letter-spacing-h3);
  font-weight: var(--font-weight-h3);
  font-family: var(--font-family-h3);
  font-style: var(--font-style-h3, normal);
}

.text-h4 {
  color: var(--text-color-h4);
  font-size: var(--font-size-h4);
  line-height: var(--line-height-h4);
  letter-spacing: var(--letter-spacing-h4);
  font-weight: var(--font-weight-h4);
  font-family: var(--font-family-h4);
  font-style: var(--font-style-h4, normal);
}

.text-h5 {
  color: var(--text-color-h5);
  font-size: var(--font-size-h5);
  line-height: var(--line-height-h5);
  letter-spacing: var(--letter-spacing-h5);
  font-weight: var(--font-weight-h5);
  font-family: var(--font-family-h5);
  font-style: var(--font-style-h5, normal);
}

.text-h6 {
  color: var(--text-color-h6);
  font-size: var(--font-size-h6);
  line-height: var(--line-height-h6);
  letter-spacing: var(--letter-spacing-h6);
  font-weight: var(--font-weight-h6);
  font-family: var(--font-family-h6);
  font-style: var(--font-style-h6, normal);
}

.text-body {
  color: var(--text-color-body);
  font-size: var(--font-size-body);
  line-height: var(--line-height-body);
  letter-spacing: var(--letter-spacing-body);
  font-weight: var(--font-weight-body);
  font-family: var(--font-family-body);
  font-style: var(--font-style-body, normal);
}

.text-quote {
  color: var(--text-color-quote);
  font-size: var(--font-size-quote);
  line-height: var(--line-height-quote);
  letter-spacing: var(--letter-spacing-quote);
  font-weight: var(--font-weight-quote);
  font-family: var(--font-family-quote);
  font-style: var(--font-style-quote, normal);
}

/* Link styles - only apply to links inside paragraphs, not headings or buttons */
p a,
.text-body a,
article a:not(button a):not(h1 a):not(h2 a):not(h3 a):not(h4 a):not(h5 a):not(h6 a) {
  color: var(--text-color-link);
  font-size: var(--font-size-link);
  line-height: var(--line-height-link);
  letter-spacing: var(--letter-spacing-link);
  font-weight: var(--font-weight-link);
  font-family: var(--font-family-link);
  font-style: var(--font-style-link, normal);
}

/* Keep .text-link class for manual application when needed */
.text-link {
  color: var(--text-color-link);
  font-size: var(--font-size-link);
  line-height: var(--line-height-link);
  letter-spacing: var(--letter-spacing-link);
  font-weight: var(--font-weight-link);
  font-family: var(--font-family-link);
  font-style: var(--font-style-link, normal);
}

.text-tagline {
  color: var(--text-color-tagline);
  font-size: var(--font-size-tagline);
  line-height: var(--line-height-tagline);
  letter-spacing: var(--letter-spacing-tagline);
  font-weight: var(--font-weight-tagline);
  font-family: var(--font-family-tagline);
  font-style: var(--font-style-tagline, normal);
}

/* Grid Utilities */
.grid-responsive {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(var(--grid-min-width), 1fr));
  gap: var(--spacing-grid-gap);
}

.container-responsive {
  padding: var(--spacing-container-padding);
}

.section-spacing {
  margin-top: var(--spacing-section-margin);
  margin-bottom: var(--spacing-section-margin);
}
    `.trim();
  }
}

/**
 * Main export function for generating Master Controller CSS
 * Wraps CSSGenerator.generateComplete for convenience
 */
export function generateMasterControllerCSS(params: {
  typography: TypographySettings;
  brandColors: BrandColorsSettings;
  spacing: SpacingSettings;
}): string {
  return CSSGenerator.generateComplete(
    params.brandColors,
    params.typography,
    params.spacing
  );
}
