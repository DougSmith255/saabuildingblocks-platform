/**
 * Master Controller Shared Module
 *
 * Single source of truth for Master Controller utilities
 * used across admin-dashboard and public-site packages
 */

// CSS Generation (runtime - used by admin dashboard)
export { CSSGenerator } from './lib/cssGenerator';

// Build-time CSS (static export - used by public-site)
export { generateStaticCSS, generatePageCSS } from './lib/buildTimeCSS';

// Utilities
export { generateClamp } from './lib/clampCalculator';

// Types
export type {
  ClampConfig,
  TextTypeSettings,
  TypographySettings,
  ColorName,
  TextType,
  BrandColorsSettings,
  SpacingToken,
  SpacingSettings,
  SAAComponent,
  SAAComponentCategory,
  ShadCNComponent,
  UIComponent,
} from './types';
