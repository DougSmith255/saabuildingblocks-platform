/**
 * Master Controller Type Definitions
 * Re-exports types from category template system for consistency
 */

export type {
  TypographySettings,
  TextTypeSettings,
  ClampConfig,
  BrandColorsSettings,
  SpacingSettings,
} from '@/app/category/types';

/**
 * Color name union type for Master Controller
 */
export type ColorName = keyof BrandColorsSettings;

/**
 * Spacing token union type for Master Controller
 */
export type SpacingToken = keyof SpacingSettings;

// Import to enable type-only re-exports
import type { BrandColorsSettings, SpacingSettings } from '@/app/category/types';
