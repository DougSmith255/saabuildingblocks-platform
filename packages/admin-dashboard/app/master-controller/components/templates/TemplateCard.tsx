'use client';

import React from 'react';
import { Edit, Trash2, Star } from 'lucide-react';
import type { BlogTemplate } from '../../types/templates';
import { LAYOUT_NAMES, SPACING_DENSITY_NAMES } from '../../types/templates';

interface TemplateCardProps {
  template: BlogTemplate;
  isSelected: boolean;
  onSelect: () => void;
  onDelete?: () => void;
}

export function TemplateCard({ template, isSelected, onSelect, onDelete }: TemplateCardProps) {
  return (
    <article
      onClick={onSelect}
      className={`
        p-4 rounded-lg border cursor-pointer transition-all
        ${isSelected
          ? 'border-[#00ff88] bg-[#00ff88]/5'
          : 'border-[#404040] hover:border-[#606060]'
        }
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {template.isDefault && (
            <Star className="w-4 h-4 text-[#ffd700] fill-[#ffd700]" />
          )}
          <h3 className="text-[#e5e4dd] font-[var(--font-taskor)]">
            {template.name}
          </h3>
        </div>
        {!template.isDefault && onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('Are you sure you want to delete this template?')) {
                onDelete();
              }
            }}
            className="p-1 hover:bg-[#404040] rounded text-red-400 hover:text-red-300"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Description */}
      {template.description && (
        <p className="text-[#dcdbd5] text-sm opacity-70 mb-3 font-[var(--font-amulya)]">
          {template.description}
        </p>
      )}

      {/* Properties */}
      <div className="space-y-1 text-sm text-[#dcdbd5] mb-3 font-[var(--font-amulya)]">
        <div>Layout: <span className="text-[#e5e4dd]">{LAYOUT_NAMES[template.layout]}</span></div>
        <div>Spacing: <span className="text-[#e5e4dd]">{SPACING_DENSITY_NAMES[template.spacingDensity]}</span></div>
        {template.cardComponentId && (
          <div>Card: <span className="text-[#e5e4dd]">{template.cardComponentId}</span></div>
        )}
      </div>

      {/* Assignment count */}
      <div className="text-[#dcdbd5] text-sm opacity-70 mb-3 font-[var(--font-amulya)]">
        Applied to: {template.assignedCategories?.length || 0} categories
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#404040] text-[#dcdbd5] rounded text-sm font-[var(--font-amulya)] hover:bg-[#606060] transition-colors"
        >
          <Edit className="w-3 h-3" />
          Edit
        </button>
      </div>
    </article>
  );
}
