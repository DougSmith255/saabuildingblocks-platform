'use client';

import React from 'react';
import { GenericCard } from '@saa/shared/components/saa';
import type { BlogTemplate, TemplateSamplePost } from '../../types/templates';
import { SPACING_MULTIPLIERS, SAMPLE_BLOG_POST } from '../../types/templates';

interface TemplatePreviewProps {
  template: BlogTemplate;
  samplePost?: TemplateSamplePost;
}

export function TemplatePreview({
  template,
  samplePost = SAMPLE_BLOG_POST
}: TemplatePreviewProps) {
  const multiplier = SPACING_MULTIPLIERS[template.spacingDensity];

  // Render single-column layout
  if (template.layout === 'single-column') {
    return (
      <div
        className="template-preview"
        style={{
          padding: `calc(var(--spacing-container, 2rem) * ${multiplier})`,
        }}
      >
        {template.cardComponentId === 'generic-card' ? (
          <GenericCard>
            <article className="space-y-4">
              {/* Featured Image */}
              {samplePost.featuredImage && (
                <div className="w-full h-48 bg-[#404040] rounded overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-[#dcdbd5] text-sm">
                    Featured Image
                  </div>
                </div>
              )}

              {/* Title */}
              <h2 className="text-2xl font-bold text-[var(--color-heading-text,#e5e4dd)] font-[var(--font-taskor)]">
                {samplePost.title}
              </h2>

              {/* Meta */}
              <div className="flex items-center gap-4 text-sm text-[var(--color-body-text,#dcdbd5)] opacity-80 font-[var(--font-amulya)]">
                <span>By {samplePost.author}</span>
                <span>•</span>
                <span>{samplePost.publishDate}</span>
                <span>•</span>
                <span>{samplePost.readTime}</span>
              </div>

              {/* Excerpt */}
              <p className="text-[var(--color-body-text,#dcdbd5)] font-[var(--font-amulya)] leading-relaxed">
                {samplePost.excerpt}
              </p>

              {/* CTA */}
              <button className="px-6 py-3 bg-[var(--color-accent-green,#00ff88)] text-[#191818] rounded font-[var(--font-taskor)] hover:opacity-90 transition-opacity">
                Read More →
              </button>
            </article>
          </GenericCard>
        ) : (
          <article
            className="p-6 rounded-lg border border-[#404040] space-y-4"
            style={{
              gap: `calc(var(--spacing-grid-gap, 1.5rem) * ${multiplier})`,
            }}
          >
            {samplePost.featuredImage && (
              <div className="w-full h-48 bg-[#404040] rounded overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-[#dcdbd5] text-sm">
                  Featured Image
                </div>
              </div>
            )}

            <h2 className="text-2xl font-bold text-[var(--color-heading-text,#e5e4dd)] font-[var(--font-taskor)]">
              {samplePost.title}
            </h2>

            <div className="flex items-center gap-4 text-sm text-[var(--color-body-text,#dcdbd5)] opacity-80 font-[var(--font-amulya)]">
              <span>By {samplePost.author}</span>
              <span>•</span>
              <span>{samplePost.publishDate}</span>
              <span>•</span>
              <span>{samplePost.readTime}</span>
            </div>

            <p className="text-[var(--color-body-text,#dcdbd5)] font-[var(--font-amulya)] leading-relaxed">
              {samplePost.excerpt}
            </p>

            <button className="px-6 py-3 bg-[var(--color-accent-green,#00ff88)] text-[#191818] rounded font-[var(--font-taskor)] hover:opacity-90 transition-opacity">
              Read More →
            </button>
          </article>
        )}
      </div>
    );
  }

  // Two-column layout
  if (template.layout === 'two-column') {
    return (
      <div
        className="template-preview grid grid-cols-2 gap-6"
        style={{
          padding: `calc(var(--spacing-container, 2rem) * ${multiplier})`,
          gap: `calc(var(--spacing-grid-gap, 1.5rem) * ${multiplier})`,
        }}
      >
        {/* Left: Image */}
        <div className="w-full h-64 bg-[#404040] rounded overflow-hidden">
          <div className="w-full h-full flex items-center justify-center text-[#dcdbd5] text-sm">
            Featured Image
          </div>
        </div>

        {/* Right: Content */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[var(--color-heading-text,#e5e4dd)] font-[var(--font-taskor)]">
            {samplePost.title}
          </h2>

          <div className="flex items-center gap-4 text-sm text-[var(--color-body-text,#dcdbd5)] opacity-80 font-[var(--font-amulya)]">
            <span>By {samplePost.author}</span>
            <span>•</span>
            <span>{samplePost.readTime}</span>
          </div>

          <p className="text-[var(--color-body-text,#dcdbd5)] font-[var(--font-amulya)] leading-relaxed">
            {samplePost.excerpt}
          </p>

          <button className="px-6 py-3 bg-[var(--color-accent-green,#00ff88)] text-[#191818] rounded font-[var(--font-taskor)] hover:opacity-90 transition-opacity">
            Read More →
          </button>
        </div>
      </div>
    );
  }

  // Grid masonry layout
  return (
    <div
      className="template-preview grid grid-cols-3 gap-4"
      style={{
        padding: `calc(var(--spacing-container, 2rem) * ${multiplier})`,
        gap: `calc(var(--spacing-grid-gap, 1.5rem) * ${multiplier})`,
      }}
    >
      {/* Repeat 6 cards in masonry */}
      {[...Array(6)].map((_, i) => (
        <article key={i} className="p-4 rounded border border-[#404040] space-y-3">
          <div className="w-full h-32 bg-[#404040] rounded flex items-center justify-center text-[#dcdbd5] text-xs">
            Image
          </div>
          <h3 className="text-sm font-bold text-[var(--color-heading-text,#e5e4dd)] font-[var(--font-taskor)]">
            {samplePost.title}
          </h3>
          <p className="text-xs text-[var(--color-body-text,#dcdbd5)] font-[var(--font-amulya)]">
            {samplePost.excerpt.substring(0, 80)}...
          </p>
          <button className="text-xs text-[var(--color-accent-green,#00ff88)] font-[var(--font-taskor)]">
            Read →
          </button>
        </article>
      ))}
    </div>
  );
}
