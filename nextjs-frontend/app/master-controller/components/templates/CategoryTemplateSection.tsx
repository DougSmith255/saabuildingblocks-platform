'use client';

import React, { useState } from 'react';
import { FileText, Eye, Code, ExternalLink } from 'lucide-react';
import { CATEGORY_CONFIGS, getAllCategoryConfigs } from '@/app/category/configs/category-configs';
import type { CategoryConfig } from '@/app/category/types';

/**
 * CategoryTemplateSection Component
 *
 * Displays the 12 pre-built category templates with:
 * - Visual preview of configuration
 * - Metadata (slug, tagline, background)
 * - Quick access to edit/view
 * - Links to live category pages
 */

interface CategoryTemplateCardProps {
  config: CategoryConfig;
  onView: (config: CategoryConfig) => void;
}

function CategoryTemplateCard({ config, onView }: CategoryTemplateCardProps) {
  return (
    <div className="bg-[#2a2a2a] rounded-lg overflow-hidden border border-[#404040] hover:border-[#00ff88] transition-colors group">
      {/* Background Image Preview */}
      <div
        className="h-32 relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(${config.background.gradient.direction}, ${config.background.gradient.from} 0%, ${config.background.gradient.to} 100%), url(${config.background.image})`,
          backgroundSize: 'cover',
          backgroundPosition: config.background.position,
        }}
      >
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          <button
            onClick={() => onView(config)}
            className="p-2 bg-[#00ff88] text-[#191818] rounded hover:opacity-90 transition-opacity"
            title="View details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <a
            href={`/category/${config.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-[#00ff88] text-[#191818] rounded hover:opacity-90 transition-opacity"
            title="Open live page"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 space-y-2">
        <h3 className="text-[#e5e4dd] font-[var(--font-taskor)] text-lg">
          {config.title}
        </h3>

        <p className="text-[#dcdbd5] opacity-70 font-[var(--font-amulya)] text-sm line-clamp-2">
          {config.tagline}
        </p>

        {/* Metadata */}
        <div className="pt-2 flex items-center justify-between text-xs">
          <span className="text-[#dcdbd5] opacity-50 font-[var(--font-amulya)]">
            ID: {config.id}
          </span>
          <span className="text-[#dcdbd5] opacity-50 font-[var(--font-amulya)]">
            /{config.slug}
          </span>
        </div>
      </div>
    </div>
  );
}

interface CategoryTemplateDetailsProps {
  config: CategoryConfig;
  onClose: () => void;
}

function CategoryTemplateDetails({ config, onClose }: CategoryTemplateDetailsProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'config'>('preview');

  return (
    <div className="bg-[#242424] rounded-lg p-6 h-full overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[#e5e4dd] font-[var(--font-taskor)] text-xl mb-1">
            {config.title}
          </h2>
          <p className="text-[#dcdbd5] opacity-70 font-[var(--font-amulya)] text-sm">
            WordPress ID: {config.id} | Slug: {config.slug}
          </p>
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-[#404040] text-[#dcdbd5] rounded font-[var(--font-taskor)] text-sm hover:bg-[#505050] transition-colors"
        >
          Close
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2 rounded font-[var(--font-taskor)] text-sm transition-colors ${
            activeTab === 'preview'
              ? 'bg-[#00ff88] text-[#191818]'
              : 'bg-[#404040] text-[#dcdbd5] hover:bg-[#505050]'
          }`}
        >
          <Eye className="w-4 h-4 inline mr-2" />
          Preview
        </button>
        <button
          onClick={() => setActiveTab('config')}
          className={`px-4 py-2 rounded font-[var(--font-taskor)] text-sm transition-colors ${
            activeTab === 'config'
              ? 'bg-[#00ff88] text-[#191818]'
              : 'bg-[#404040] text-[#dcdbd5] hover:bg-[#505050]'
          }`}
        >
          <Code className="w-4 h-4 inline mr-2" />
          Configuration
        </button>
      </div>

      {/* Content */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          {/* Background Preview */}
          <div>
            <h3 className="text-[#e5e4dd] font-[var(--font-taskor)] text-sm mb-3">
              Background Image
            </h3>
            <div
              className="h-64 rounded-lg overflow-hidden"
              style={{
                backgroundImage: `linear-gradient(${config.background.gradient.direction}, ${config.background.gradient.from} 0%, ${config.background.gradient.to} 100%), url(${config.background.image})`,
                backgroundSize: 'cover',
                backgroundPosition: config.background.position,
              }}
            />
          </div>

          {/* Tagline */}
          <div>
            <h3 className="text-[#e5e4dd] font-[var(--font-taskor)] text-sm mb-3">
              Tagline
            </h3>
            <p className="text-[#dcdbd5] font-[var(--font-amulya)] text-lg leading-relaxed">
              {config.tagline}
            </p>
          </div>

          {/* SEO Information */}
          {config.seo && (
            <div>
              <h3 className="text-[#e5e4dd] font-[var(--font-taskor)] text-sm mb-3">
                SEO Configuration
              </h3>
              <div className="space-y-2 bg-[#2a2a2a] rounded p-4">
                <div>
                  <span className="text-[#dcdbd5] opacity-70 font-[var(--font-amulya)] text-xs">
                    Description:
                  </span>
                  <p className="text-[#dcdbd5] font-[var(--font-amulya)] text-sm mt-1">
                    {config.seo.description}
                  </p>
                </div>
                <div>
                  <span className="text-[#dcdbd5] opacity-70 font-[var(--font-amulya)] text-xs">
                    Keywords:
                  </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {config.seo.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="px-2 py-1 bg-[#404040] text-[#dcdbd5] rounded text-xs font-[var(--font-amulya)]"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="pt-4 border-t border-[#404040]">
            <a
              href={`/category/${config.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#00ff88] text-[#191818] rounded font-[var(--font-taskor)] hover:opacity-90 transition-opacity"
            >
              <ExternalLink className="w-4 h-4" />
              View Live Category Page
            </a>
          </div>
        </div>
      )}

      {activeTab === 'config' && (
        <div>
          <h3 className="text-[#e5e4dd] font-[var(--font-taskor)] text-sm mb-3">
            TypeScript Configuration
          </h3>
          <pre className="bg-[#191818] rounded-lg p-4 overflow-x-auto text-xs font-[var(--font-synonym)]">
            <code className="text-[#dcdbd5]">
              {JSON.stringify(config, null, 2)}
            </code>
          </pre>

          <div className="mt-4 p-4 bg-[#2a2a2a] rounded border border-[#404040]">
            <h4 className="text-[#e5e4dd] font-[var(--font-taskor)] text-sm mb-2">
              Usage Example
            </h4>
            <pre className="text-xs font-[var(--font-synonym)] text-[#dcdbd5]">
              <code>{`import { getCategoryConfig } from '@/app/category/configs/category-configs';

const config = getCategoryConfig('${config.slug}');

// Use in your component
<CategoryTemplate
  config={config}
  initialPosts={posts}
/>`}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export function CategoryTemplateSection() {
  const [selectedConfig, setSelectedConfig] = useState<CategoryConfig | null>(null);
  const categoryConfigs = getAllCategoryConfigs();

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[#e5e4dd] font-[var(--font-taskor)] text-xl mb-1">
            Category Templates
          </h2>
          <p className="text-[#dcdbd5] opacity-70 font-[var(--font-amulya)] text-sm">
            Pre-built templates for blog category pages ({categoryConfigs.length} total)
          </p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Category Template Grid */}
        <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-auto pr-2">
          <div className="grid grid-cols-1 gap-4">
            {categoryConfigs.map((config) => (
              <CategoryTemplateCard
                key={config.slug}
                config={config}
                onView={setSelectedConfig}
              />
            ))}
          </div>
        </div>

        {/* Right: Details Panel */}
        <div className="max-h-[calc(100vh-300px)]">
          {selectedConfig ? (
            <CategoryTemplateDetails
              config={selectedConfig}
              onClose={() => setSelectedConfig(null)}
            />
          ) : (
            <div className="bg-[#242424] rounded-lg p-6 h-full flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#404040] flex items-center justify-center">
                  <FileText className="w-8 h-8 text-[#dcdbd5]" />
                </div>
                <p className="text-[#dcdbd5] opacity-70 font-[var(--font-amulya)]">
                  Select a category template to view details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-[#2a2a2a] rounded-lg p-4 border border-[#404040]">
        <h3 className="text-[#e5e4dd] font-[var(--font-taskor)] text-sm mb-2">
          About Category Templates
        </h3>
        <p className="text-[#dcdbd5] opacity-70 font-[var(--font-amulya)] text-sm leading-relaxed">
          These templates define the visual appearance of blog category pages. Each template includes:
          background image, gradient overlay, tagline, and SEO metadata. They are stored in{' '}
          <code className="px-1.5 py-0.5 bg-[#191818] rounded text-xs font-[var(--font-synonym)]">
            /app/category/configs/category-configs.ts
          </code>
        </p>
      </div>
    </div>
  );
}
