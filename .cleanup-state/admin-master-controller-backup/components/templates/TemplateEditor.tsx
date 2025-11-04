'use client';

import React, { useState } from 'react';
import type { BlogTemplate } from '../../types/templates';
import { TemplatePreview } from './TemplatePreview';
import { useTemplatesStore } from '../../stores/templatesStore';
import { LAYOUT_NAMES, HEADER_POSITION_NAMES, SPACING_DENSITY_NAMES } from '../../types/templates';

interface TemplateEditorProps {
  template: BlogTemplate;
  onClose: () => void;
}

export function TemplateEditor({ template: initialTemplate, onClose }: TemplateEditorProps) {
  const { updateTemplate, isSaving } = useTemplatesStore();
  const [template, setTemplate] = useState(initialTemplate);

  const handleSave = async () => {
    try {
      await updateTemplate(template.id, {
        name: template.name,
        description: template.description,
        layout: template.layout,
        cardComponentId: template.cardComponentId,
        headerPosition: template.headerPosition,
        spacingDensity: template.spacingDensity,
      });
      alert('Template saved successfully!');
    } catch (error) {
      console.error('Failed to save template:', error);
      alert('Failed to save template. Please try again.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 h-full">
      {/* Left: Preview */}
      <div className="bg-[#242424] rounded-lg p-6 overflow-auto">
        <h3 className="text-[#e5e4dd] font-[var(--font-taskor)] text-lg mb-4">
          Live Preview
        </h3>
        <div className="bg-[#191818] rounded-lg">
          <TemplatePreview template={template} />
        </div>
      </div>

      {/* Right: Properties */}
      <div className="bg-[#242424] rounded-lg p-6 space-y-6 overflow-auto">
        <h3 className="text-[#e5e4dd] font-[var(--font-taskor)] text-lg">
          Template Properties
        </h3>

        {/* Name */}
        <div>
          <label className="block text-[#dcdbd5] text-sm mb-2 font-[var(--font-amulya)]">
            Template Name
          </label>
          <input
            type="text"
            value={template.name}
            onChange={(e) => setTemplate({ ...template, name: e.target.value })}
            className="w-full px-4 py-2 bg-[#191818] border border-[#404040] rounded text-[#e5e4dd] font-[var(--font-amulya)] focus:border-[#00ff88] focus:outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-[#dcdbd5] text-sm mb-2 font-[var(--font-amulya)]">
            Description (optional)
          </label>
          <textarea
            value={template.description || ''}
            onChange={(e) => setTemplate({ ...template, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 bg-[#191818] border border-[#404040] rounded text-[#e5e4dd] font-[var(--font-amulya)] focus:border-[#00ff88] focus:outline-none resize-none"
          />
        </div>

        {/* Layout */}
        <div>
          <label className="block text-[#dcdbd5] text-sm mb-2 font-[var(--font-amulya)]">
            Layout Structure
          </label>
          <div className="space-y-2">
            {(['single-column', 'two-column', 'grid-masonry'] as const).map((option) => (
              <label key={option} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="layout"
                  value={option}
                  checked={template.layout === option}
                  onChange={(e) => setTemplate({ ...template, layout: e.target.value as any })}
                  className="w-4 h-4 text-[#00ff88] focus:ring-[#00ff88]"
                />
                <span className="text-[#dcdbd5] font-[var(--font-amulya)]">{LAYOUT_NAMES[option]}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Card Component */}
        <div>
          <label className="block text-[#dcdbd5] text-sm mb-2 font-[var(--font-amulya)]">
            Card Component
          </label>
          <select
            value={template.cardComponentId || ''}
            onChange={(e) => setTemplate({ ...template, cardComponentId: e.target.value })}
            className="w-full px-4 py-2 bg-[#191818] border border-[#404040] rounded text-[#e5e4dd] font-[var(--font-amulya)] focus:border-[#00ff88] focus:outline-none"
          >
            <option value="">None (Default Card)</option>
            <option value="cyber-card-holographic">Cyber Card Holographic</option>
            <option value="cyber-card-prismatic-glass">Cyber Card Prismatic Glass</option>
            <option value="cyber-card-radar-interface">Cyber Card Radar Interface</option>
          </select>
        </div>

        {/* Header Position */}
        <div>
          <label className="block text-[#dcdbd5] text-sm mb-2 font-[var(--font-amulya)]">
            Header Position
          </label>
          <div className="space-y-2">
            {(['top', 'left', 'overlay'] as const).map((option) => (
              <label key={option} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="headerPosition"
                  value={option}
                  checked={template.headerPosition === option}
                  onChange={(e) => setTemplate({ ...template, headerPosition: e.target.value as any })}
                  className="w-4 h-4 text-[#00ff88] focus:ring-[#00ff88]"
                />
                <span className="text-[#dcdbd5] font-[var(--font-amulya)]">{HEADER_POSITION_NAMES[option]}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Spacing Density */}
        <div>
          <label className="block text-[#dcdbd5] text-sm mb-2 font-[var(--font-amulya)]">
            Spacing Density
          </label>
          <div className="space-y-2">
            {(['compact', 'default', 'wide', 'extra-wide'] as const).map((option) => (
              <label key={option} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="spacingDensity"
                  value={option}
                  checked={template.spacingDensity === option}
                  onChange={(e) => setTemplate({ ...template, spacingDensity: e.target.value as any })}
                  className="w-4 h-4 text-[#00ff88] focus:ring-[#00ff88]"
                />
                <span className="text-[#dcdbd5] font-[var(--font-amulya)]">{SPACING_DENSITY_NAMES[option]}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 px-6 py-3 bg-[#00ff88] text-[#191818] rounded font-[var(--font-taskor)] hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {isSaving ? 'Saving...' : 'Save Template'}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 border border-[#404040] text-[#dcdbd5] rounded font-[var(--font-amulya)] hover:bg-[#404040] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
