/**
 * Category Template Registry
 *
 * Source of truth for mapping WordPress category slugs to template components.
 * This registry enables the dynamic rendering of category-specific page layouts.
 *
 * @module category-templates/registry
 * @version 1.0.0
 */

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

/**
 * Template Props Interface
 * All template components receive these props
 */
export interface TemplateProps {
  category: WordPressCategory;
  posts: WordPressPost[];
  settings: TemplateSettings;
}

/**
 * WordPress Category Data
 */
export interface WordPressCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  count: number;
}

/**
 * WordPress Post Data
 */
export interface WordPressPost {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  author?: string;
  date: string;
  categories: string[];
}

/**
 * Template Settings (from Master Controller)
 */
export interface TemplateSettings {
  typography: TypographySettings;
  colors: BrandColorsSettings;
  spacing: SpacingSettings;
}

/**
 * Typography Settings (from Master Controller)
 */
export interface TypographySettings {
  displayFont: string;
  bodyFont: string;
  h1Size: string;
  h2Size: string;
  bodySize: string;
  lineHeight: string;
  letterSpacing: string;
}

/**
 * Brand Colors Settings (from Master Controller)
 */
export interface BrandColorsSettings {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

/**
 * Spacing Settings (from Master Controller)
 */
export interface SpacingSettings {
  sectionPadding: string;
  containerMaxWidth: string;
  gridGap: string;
}

/**
 * Animation Configuration
 */
export interface AnimationConfig {
  enableScrollAnimations: boolean;
  animationPreset: 'subtle' | 'moderate' | 'dramatic';
  staggerDelay: number; // milliseconds
  transitionDuration: number; // milliseconds
}

/**
 * Template Section Configuration
 */
export interface TemplateSectionConfig {
  id: string;
  component: string; // Component name from shared/
  props: Record<string, unknown>;
  animateOnScroll: boolean;
  animationVariant: string;
  order: number;
}

/**
 * Category Template Component Type
 */
export type CategoryTemplateComponent = ComponentType<TemplateProps>;

/**
 * Category Template Metadata
 */
export interface CategoryTemplate {
  id: string;
  name: string;
  description: string;
  categorySlug: string;
  categoryId: number | null; // null until WordPress category created
  component: CategoryTemplateComponent;
  layout: 'single' | 'two-column' | 'grid';
  animations: AnimationConfig;
  sections: TemplateSectionConfig[];
  meta: {
    phase: 1 | 2 | 3;
    priority: 'high' | 'medium' | 'low';
    status: 'active' | 'draft' | 'archived';
    createdAt: string;
    updatedAt: string;
  };
}

/**
 * Lazy-loaded Template Components
 * Using Next.js dynamic() for code splitting
 */

// Templates will be added here as needed

/**
 * TEMPLATE REGISTRY
 *
 * Maps category slugs to template components and metadata.
 * This is the single source of truth for the template system.
 *
 * @example
 * const template = CATEGORY_TEMPLATES['category-slug'];
 * const Component = template.component;
 * <Component category={...} posts={...} settings={...} />
 */
export const CATEGORY_TEMPLATES: Record<string, CategoryTemplate> = {
  // Templates will be added here
};

/**
 * Get all templates in the registry
 */
export function getAllTemplates(): CategoryTemplate[] {
  return Object.values(CATEGORY_TEMPLATES);
}

/**
 * Get all active templates (status: 'active')
 */
export function getActiveTemplates(): CategoryTemplate[] {
  return getAllTemplates().filter(
    (template) => template.meta.status === 'active'
  );
}

/**
 * Get templates by phase (1, 2, or 3)
 */
export function getTemplatesByPhase(phase: 1 | 2 | 3): CategoryTemplate[] {
  return getAllTemplates().filter(
    (template) => template.meta.phase === phase
  );
}

/**
 * Get template by category slug
 *
 * @param slug - WordPress category slug
 * @returns Template configuration or null if not found
 */
export function getTemplateBySlug(slug: string): CategoryTemplate | null {
  return CATEGORY_TEMPLATES[slug] || null;
}

/**
 * Get template by WordPress category ID
 *
 * @param id - WordPress category ID
 * @returns Template configuration or null if not found
 */
export function getTemplateByCategoryId(id: number): CategoryTemplate | null {
  return getAllTemplates().find(
    (template) => template.categoryId === id
  ) || null;
}

/**
 * Check if a category has a template
 *
 * @param slug - WordPress category slug
 * @returns True if template exists
 */
export function hasTemplate(slug: string): boolean {
  return slug in CATEGORY_TEMPLATES;
}

/**
 * Get template slugs for all active templates
 * Useful for generating static routes
 */
export function getActiveTemplateSlugs(): string[] {
  return getActiveTemplates().map((template) => template.categorySlug);
}

/**
 * Get fallback template (used when no category match found)
 * Returns null if no templates exist
 */
export function getFallbackTemplate(): CategoryTemplate | null {
  const templates = getAllTemplates();
  return templates.length > 0 ? templates[0] : null;
}
