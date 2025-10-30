'use client';

import React from 'react';

export interface BlogHeaderProps {
  title?: string;
  description?: string;
  showCategoryFilter?: boolean;
}

/**
 * BlogHeader - Page header for blog listing
 *
 * PROTOCOL COMPLIANCE:
 * ✅ H1 auto-applies display font (Taskor) - NO className needed
 * ✅ Description uses font-amulya via CSS variable
 * ✅ Brand colors ONLY (#e5e4dd, #dcdbd5)
 * ✅ Fluid typography (clamp)
 *
 * Features:
 * - H1 auto-applies display font from Master Controller
 * - Description paragraph uses body font (Amulya)
 * - Optional category filter slot
 * - Fully responsive with fluid typography
 * - WCAG AA compliant colors
 *
 * @example
 * ```tsx
 * <BlogHeader
 *   title="Blog"
 *   description="Insights and updates from SAA Building Blocks"
 * />
 * ```
 */
export function BlogHeader({
  title = 'Blog',
  description = 'Insights, updates, and industry news from SAA Building Blocks',
  showCategoryFilter = false,
}: BlogHeaderProps) {
  return (
    <header className="mb-16 text-center">
      {/* H1 auto-applies display font (Taskor) - Protocol Section 2.1 */}
      <h1 className="text-h1 mb-6 text-[#e5e4dd]">
        {title}
      </h1>

      {/* Description uses font-amulya via CSS variable - Protocol Section 2.1 */}
      {description && (
        <p className="text-body text-[#dcdbd5] max-w-2xl mx-auto font-[var(--font-amulya)]">
          {description}
        </p>
      )}

      {/* Optional category filter slot */}
      {showCategoryFilter && (
        <div className="mt-8">
          {/* CategoryFilter component can be added here when implemented */}
        </div>
      )}
    </header>
  );
}
