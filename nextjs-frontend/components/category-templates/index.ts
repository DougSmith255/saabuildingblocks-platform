/**
 * Category Template Components
 *
 * Reusable components for building consistent category template pages.
 * All components support scroll-triggered animations, responsive design,
 * and integration with Master Controller typography/color settings.
 *
 * @example
 * ```tsx
 * import {
 *   TemplateSection,
 *   TemplateHero,
 *   TemplateFeatureGrid,
 *   TemplateCTA
 * } from '@/components/category-templates';
 *
 * export default function MarketingPage() {
 *   return (
 *     <>
 *       <TemplateSection>
 *         <TemplateHero
 *           title="Marketing Solutions"
 *           subtitle="AI-powered tools for modern marketers"
 *           ctaText="Get Started"
 *           ctaLink="/contact"
 *         />
 *       </TemplateSection>
 *
 *       <TemplateSection variant="dark">
 *         <TemplateFeatureGrid
 *           features={features}
 *           columns={3}
 *         />
 *       </TemplateSection>
 *
 *       <TemplateSection>
 *         <TemplateCTA
 *           heading="Ready to Get Started?"
 *           description="Join thousands of teams already using our platform"
 *           ctaText="Start Free Trial"
 *           ctaLink="/sign-up"
 *           variant="gradient"
 *         />
 *       </TemplateSection>
 *     </>
 *   );
 * }
 * ```
 */

export { TemplateSection } from './TemplateSection';
export { TemplateHero } from './TemplateHero';
export { TemplateFeatureGrid } from './TemplateFeatureGrid';
export { TemplateCTA } from './TemplateCTA';
