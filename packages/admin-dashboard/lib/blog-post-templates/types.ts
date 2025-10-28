/**
 * Blog Post Template Types
 *
 * Shared TypeScript types for blog post template system.
 * Similar to category templates but for individual blog posts.
 *
 * @module blog-post-templates/types
 * @version 1.0.0
 */

import type { ComponentType } from 'react';
import type { BlogPost } from '@/lib/wordpress/types';

/**
 * Post Template Props Interface
 * All post template components receive these props
 */
export interface PostTemplateProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
  settings: TemplateSettings;
}

/**
 * Template Settings (from Master Controller)
 * Inherited from category templates for consistency
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
 * Post Template Component Type
 */
export type PostTemplateComponent = ComponentType<PostTemplateProps>;

/**
 * Post Template Metadata
 */
export interface PostTemplate {
  /** Unique template identifier */
  id: string;
  /** Human-readable template name */
  name: string;
  /** Template description */
  description: string;
  /** Array of WordPress category slugs this template applies to */
  categories: string[];
  /** React component for rendering the template */
  component: PostTemplateComponent;
  /** Template metadata */
  meta: {
    /** Template status */
    status: 'active' | 'draft' | 'archived';
    /** Creation date */
    createdAt: string;
    /** Last update date */
    updatedAt: string;
    /** Template version */
    version: string;
  };
}
