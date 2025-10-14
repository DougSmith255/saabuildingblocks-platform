/**
 * Master Controller Type Definitions
 * These match the actual store implementations in master-controller/stores/
 */

/**
 * Clamp configuration for responsive sizing
 */
export interface ClampConfig {
  min: number;
  max: number;
  viewportMin: number;
  viewportMax: number;
  unit: 'px' | 'rem' | 'em';
}

/**
 * Text type settings for each typography element
 */
export interface TextTypeSettings {
  size: ClampConfig;
  lineHeight: number;
  letterSpacing: number;
  fontWeight: number;
  fontFamily: string;
  color: ColorName;
  fontStyle?: 'normal' | 'italic';
}

/**
 * Complete typography settings for all text elements
 */
export interface TypographySettings {
  h1: TextTypeSettings;
  h2: TextTypeSettings;
  h3: TextTypeSettings;
  h4: TextTypeSettings;
  h5: TextTypeSettings;
  h6: TextTypeSettings;
  body: TextTypeSettings;
  quote: TextTypeSettings;
  link: TextTypeSettings;
  button: TextTypeSettings;
  tagline: TextTypeSettings;
  caption: TextTypeSettings;
}

/**
 * Brand color names (Master Controller)
 */
export type ColorName =
  | 'accentGreen'
  | 'headingText'
  | 'bodyText'
  | 'brandGold'
  | 'darkGray'
  | 'mediumGray';

/**
 * Brand colors settings
 */
export interface BrandColorsSettings {
  accentGreen: string;
  headingText: string;
  bodyText: string;
  brandGold: string;
  darkGray: string;
  mediumGray: string;
}

/**
 * Spacing token names
 */
export type SpacingToken =
  | 'containerPadding'
  | 'gridGap'
  | 'sectionMargin';

/**
 * Spacing settings with clamp configs
 */
export interface SpacingSettings {
  containerPadding: ClampConfig;
  gridGap: ClampConfig;
  sectionMargin: ClampConfig;
  gridMinWidth: number;
}
