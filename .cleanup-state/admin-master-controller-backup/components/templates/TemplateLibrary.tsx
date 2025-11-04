'use client';

import React from 'react';
import { Plus, FileText } from 'lucide-react';
import { TemplateCard } from './TemplateCard';
import { useTemplatesStore } from '../../stores/templatesStore';
import type { BlogTemplate } from '../../types/templates';
import { DEFAULT_TEMPLATE } from '../../types/templates';

interface TemplateLibraryProps {
  onSelect: (template: BlogTemplate) => void;
}

export function TemplateLibrary({ onSelect }: TemplateLibraryProps) {
  const { templates, selectedTemplate, createTemplate, deleteTemplate, isLoading } = useTemplatesStore();

  const handleCreateNew = async () => {
    const name = prompt('Enter template name:', 'New Template');
    if (!name) return;

    const newTemplate = await createTemplate({
      ...DEFAULT_TEMPLATE,
      name,
    });

    if (newTemplate) {
      onSelect(newTemplate);
    }
  };

  return (
    <div className="bg-[#242424] rounded-lg p-6 h-full overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[#e5e4dd] font-[var(--font-taskor)] text-xl">
          Template Library
        </h2>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-4 py-2 bg-[#00ff88] text-[#191818] rounded font-[var(--font-taskor)] text-sm hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          New Template
        </button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-12">
          <p className="text-[#dcdbd5] font-[var(--font-amulya)]">Loading templates...</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && templates.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#404040] flex items-center justify-center">
            <FileText className="w-8 h-8 text-[#dcdbd5]" />
          </div>
          <p className="text-[#dcdbd5] mb-4 font-[var(--font-amulya)]">No templates created yet</p>
          <p className="text-[#dcdbd5] opacity-70 text-sm font-[var(--font-amulya)]">
            Templates let you customize how blog posts appear for different categories.
          </p>
        </div>
      )}

      {/* Template list */}
      <div className="space-y-4">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedTemplate?.id === template.id}
            onSelect={() => onSelect(template)}
            onDelete={() => deleteTemplate(template.id)}
          />
        ))}
      </div>
    </div>
  );
}
