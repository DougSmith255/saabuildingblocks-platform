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
  fontSize?: ClampConfig;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
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
  tagline: TextTypeSettings;
  caption: TextTypeSettings;
  menuMainItem: TextTypeSettings;
  menuSubItem: TextTypeSettings;
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
 * Text type names for typography settings
 */
export type TextType =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body'
  | 'quote'
  | 'link'
  | 'tagline'
  | 'caption'
  | 'menuMainItem'
  | 'menuSubItem';

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
  green: string;
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

/**
 * Component types for Component Editor
 */

// SAA Component (from data/saa-component-registry.ts)
export interface SAAComponent {
  id: string;
  name: string;
  category: string;
  description: string;
  previewPath?: string;
  reactPath?: string;
  converted: boolean;
  source: 'wordpress' | 'custom';
  tags?: string[];
  dependencies?: string[];
}

// SAA Component Category
export type SAAComponentCategory =
  | 'buttons'
  | 'cards'
  | 'gallery'
  | 'effects'
  | 'interactive'
  | 'navigation'
  | 'layouts'
  | 'forms';

// ShadCN Component
export interface ShadCNComponent {
  id: string;
  name: string;
  description: string;
  installed: boolean;
  category?: string;
  tags?: string[];
}

// Union type for all UI components
export type UIComponent = SAAComponent | ShadCNComponent;
