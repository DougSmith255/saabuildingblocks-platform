/**
 * Blog Post Template System - Public API
 *
 * Exports all public types and functions for the blog post template system.
 *
 * @module blog-post-templates
 * @version 1.0.0
 */

// Export types
export type {
  PostTemplateProps,
  TemplateSettings,
  TypographySettings,
  BrandColorsSettings,
  SpacingSettings,
  PostTemplateComponent,
  PostTemplate,
} from './types';

// Export registry functions
export {
  POST_TEMPLATES,
  getAllPostTemplates,
  getActivePostTemplates,
  getPostTemplateById,
  getTemplateForPost,
  hasCustomTemplate,
  getCoveredCategories,
  validatePostCoverage,
} from './registry';

// Export template components
export { RegularPostTemplate } from './RegularPostTemplate';
