/**
 * Blog Post Template Registry
 *
 * Source of truth for mapping WordPress blog posts to template components.
 * This registry enables dynamic rendering of post-specific page layouts
 * based on post categories.
 *
 * @module blog-post-templates/registry
 * @version 1.0.0
 */

import dynamic from 'next/dynamic';
import type { BlogPost } from '@/lib/wordpress/types';
import type { PostTemplate, PostTemplateComponent } from './types';

/**
 * Lazy-loaded Template Components
 * Using Next.js dynamic() for code splitting and performance optimization
 */

// Regular Blog Post Template - Build Agent 2 Implementation
const RegularPostTemplate = dynamic(
  () => import('./RegularPostTemplate').then(mod => ({ default: mod.RegularPostTemplate })),
  { ssr: true, loading: () => null }
);

/**
 * POST TEMPLATES REGISTRY
 *
 * Maps template IDs to template components and metadata.
 * Posts are assigned templates based on their categories.
 *
 * Template Selection Logic:
 * 1. Check post's categories against template.categories array
 * 2. Use first matching template found
 * 3. Fallback to 'regular' template if no match
 *
 * @example
 * const template = getTemplateForPost(post);
 * const Component = template.component;
 * <Component post={post} relatedPosts={[]} settings={...} />
 */
export const POST_TEMPLATES: Record<string, PostTemplate> = {
  regular: {
    id: 'regular',
    name: 'Regular Blog Post',
    description: 'Standard blog post layout with featured image, content, and related posts',
    categories: [
      // All 12 allowed categories
      'agent-career-info',
      'about-exp',
      'getting-license',
      'best-school',
      'best-brokerage',
      'become-an-agent',
      'brokerage-comparison',
      'industry-trends',
      'marketing-mastery',
      'winning-clients',
      'fun-for-agents',
      'exp-realty-sponsor',
    ],
    // Production-ready component by Build Agent 2
    component: RegularPostTemplate as PostTemplateComponent,
    meta: {
      status: 'active', // ✅ ACTIVE - Production ready
      createdAt: '2025-10-19T23:08:00Z',
      updatedAt: '2025-10-19T23:08:00Z',
      version: '1.0.0',
    },
  },
  // Additional templates can be added here in the future
  // Example:
  // 'video-post': {
  //   id: 'video-post',
  //   name: 'Video Blog Post',
  //   description: 'Blog post with embedded video player',
  //   categories: ['video-content'],
  //   component: VideoPostTemplate,
  //   meta: { ... }
  // }
};

/**
 * Get all templates in the registry
 * @returns Array of all post templates
 */
export function getAllPostTemplates(): PostTemplate[] {
  return Object.values(POST_TEMPLATES);
}

/**
 * Get all active templates (status: 'active')
 * @returns Array of active post templates
 */
export function getActivePostTemplates(): PostTemplate[] {
  return getAllPostTemplates().filter(
    (template) => template.meta.status === 'active'
  );
}

/**
 * Get template by ID
 *
 * @param id - Template ID
 * @returns Template configuration or null if not found
 */
export function getPostTemplateById(id: string): PostTemplate | null {
  return POST_TEMPLATES[id] || null;
}

/**
 * Get template for a specific blog post
 *
 * Selection algorithm:
 * 1. Iterate through all active templates
 * 2. Check if post's categories intersect with template.categories
 * 3. Return first matching template
 * 4. Fallback to 'regular' template if no match found
 *
 * @param post - WordPress blog post
 * @returns Matching template or fallback template
 *
 * @example
 * const post = await fetchPostBySlug('my-post');
 * const template = getTemplateForPost(post);
 * // Returns template object with component and metadata
 */
export function getTemplateForPost(post: BlogPost): PostTemplate {
  // Get all active templates (excluding drafts and archived)
  const activeTemplates = getActivePostTemplates();

  // Find first template where post categories match template categories
  const matchingTemplate = activeTemplates.find((template) => {
    // Check if any of the post's categories are in the template's categories
    return post.categories.some((postCategory) =>
      template.categories.includes(postCategory)
    );
  });

  // Return matching template or fallback to 'regular' template
  if (matchingTemplate) {
    return matchingTemplate;
  }

  // Fallback to regular template (always exists)
  const regularTemplate = POST_TEMPLATES['regular'];
  if (!regularTemplate) {
    throw new Error('Regular template not found in registry. This should never happen.');
  }

  return regularTemplate;
}

/**
 * Check if a post has a custom template (non-regular)
 *
 * @param post - WordPress blog post
 * @returns True if post uses a custom template
 */
export function hasCustomTemplate(post: BlogPost): boolean {
  const template = getTemplateForPost(post);
  return template.id !== 'regular';
}

/**
 * Get template categories (all categories covered by templates)
 * Useful for validation and debugging
 *
 * @returns Array of all category slugs covered by templates
 */
export function getCoveredCategories(): string[] {
  const allCategories = getAllPostTemplates().flatMap(
    (template) => template.categories
  );
  // Remove duplicates
  return Array.from(new Set(allCategories));
}

/**
 * Validate post categories against template coverage
 * Helps identify posts that might not have template coverage
 *
 * @param post - WordPress blog post
 * @returns Validation result with coverage status
 */
export function validatePostCoverage(post: BlogPost): {
  hasCoverage: boolean;
  uncoveredCategories: string[];
  template: PostTemplate | null;
} {
  const coveredCategories = getCoveredCategories();
  const uncoveredCategories = post.categories.filter(
    (cat) => !coveredCategories.includes(cat)
  );

  const template = getTemplateForPost(post);

  return {
    hasCoverage: uncoveredCategories.length === 0,
    uncoveredCategories,
    template,
  };
}
