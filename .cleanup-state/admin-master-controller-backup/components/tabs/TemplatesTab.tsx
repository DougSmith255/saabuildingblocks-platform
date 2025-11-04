'use client';

import React, { useEffect, useState } from 'react';
import { LayoutGrid, Layers } from 'lucide-react';
import { TemplateLibrary } from '../templates/TemplateLibrary';
import { TemplateEditor } from '../templates/TemplateEditor';
import { CategoryTemplateSection } from '../templates/CategoryTemplateSection';
import { useTemplatesStore } from '../../stores/templatesStore';

/**
 * Templates Tab - Blog Category Template Management
 *
 * Two sections:
 * 1. Custom Templates (database-driven, user-created)
 * 2. Category Templates (pre-built, code-driven)
 *
 * Allows users to create, edit, and assign templates to blog categories.
 * Templates control the layout, spacing, and components used for blog posts.
 */
export const TemplatesTab: React.FC = () => {
  const {
    selectedTemplate,
    setSelectedTemplate,
    loadTemplates,
    loadCategoryAssignments,
  } = useTemplatesStore();

  const [activeSection, setActiveSection] = useState<'custom' | 'category'>('custom');

  useEffect(() => {
    // Load templates and assignments on mount
    loadTemplates();
    loadCategoryAssignments();
  }, [loadTemplates, loadCategoryAssignments]);

  return (
    <div className="space-y-6">
      {/* Section Switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveSection('custom')}
          className={`flex items-center gap-2 px-6 py-3 rounded font-[var(--font-taskor)] transition-colors ${
            activeSection === 'custom'
              ? 'bg-[#00ff88] text-[#191818]'
              : 'bg-[#404040] text-[#dcdbd5] hover:bg-[#505050]'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          Custom Templates
        </button>
        <button
          onClick={() => setActiveSection('category')}
          className={`flex items-center gap-2 px-6 py-3 rounded font-[var(--font-taskor)] transition-colors ${
            activeSection === 'category'
              ? 'bg-[#00ff88] text-[#191818]'
              : 'bg-[#404040] text-[#dcdbd5] hover:bg-[#505050]'
          }`}
        >
          <Layers className="w-4 h-4" />
          Category Templates (12)
        </button>
      </div>

      {/* Section Content */}
      {activeSection === 'custom' && (
        <div className="h-[calc(100vh-280px)] grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
          {/* Left: Template Library */}
          <TemplateLibrary onSelect={setSelectedTemplate} />

          {/* Right: Template Editor or Empty State */}
          {selectedTemplate ? (
            <TemplateEditor
              template={selectedTemplate}
              onClose={() => setSelectedTemplate(null)}
            />
          ) : (
            <div className="bg-[#242424] rounded-lg p-6 flex items-center justify-center">
              <div className="text-center space-y-4">
                <p className="text-[#dcdbd5] opacity-70 font-[var(--font-amulya)] text-lg">
                  Select a template to edit, or create a new one
                </p>
                <p className="text-[#dcdbd5] opacity-50 font-[var(--font-amulya)] text-sm">
                  Templates control how blog posts are displayed for different categories
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {activeSection === 'category' && (
        <div className="h-[calc(100vh-280px)]">
          <CategoryTemplateSection />
        </div>
      )}
    </div>
  );
};
