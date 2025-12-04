/**
 * Category Blog Templates Barrel Export
 *
 * Export all category-specific templates and configuration
 */

export {
  CategoryBlogPostTemplate,
  type CategoryBlogPostTemplateProps,
} from './CategoryBlogPostTemplate';

export {
  categoryTemplates,
  getTemplateConfig,
  categoryToSlug,
  type CategorySlug,
  type CategoryTemplateConfig,
} from './templateConfig';
