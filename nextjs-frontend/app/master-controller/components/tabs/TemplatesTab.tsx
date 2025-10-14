'use client';

import React, { useEffect } from 'react';
import { TemplateLibrary } from '../templates/TemplateLibrary';
import { TemplateEditor } from '../templates/TemplateEditor';
import { useTemplatesStore } from '../../stores/templatesStore';

/**
 * Templates Tab - Blog Category Template Management
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

  useEffect(() => {
    // Load templates and assignments on mount
    loadTemplates();
    loadCategoryAssignments();
  }, [loadTemplates, loadCategoryAssignments]);

  return (
    <div className="h-[calc(100vh-200px)] grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
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
  );
};
