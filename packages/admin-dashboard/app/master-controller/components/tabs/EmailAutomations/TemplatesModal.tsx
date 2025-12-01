'use client';

/**
 * Templates Modal
 *
 * Modal popup showing templates for a specific category
 * - Filter templates by category
 * - Preview, edit, duplicate templates
 * - 12 US federal holidays + Halloween
 */

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { FileText, X, Edit2, Copy, Eye, Calendar, Tag } from 'lucide-react';

// Dynamically import the edit and preview modals
const EditTemplateModal = dynamic(() => import('./EditTemplateModal').then(mod => ({ default: mod.EditTemplateModal })), {
  ssr: false,
});

const PreviewTemplateModal = dynamic(() => import('./PreviewTemplateModal').then(mod => ({ default: mod.PreviewTemplateModal })), {
  ssr: false,
});

interface Category {
  id?: string;
  name: string;
  slug: string;
}

interface Template {
  id: string;
  category_id: string;
  holiday_name: string;
  holiday_slug: string;
  holiday_date_type: 'fixed' | 'variable';
  holiday_month: number;
  holiday_day: number | null;
  subject_line: string;
  preview_text: string | null;
  email_html: string;
  personalization_tokens: string[];
  use_brand_theme: boolean;
  is_active: boolean;
  created_at: string;
  category?: {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
  };
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface TemplatesModalProps {
  category: Category;
  onClose: () => void;
}

export function TemplatesModal({ category, onClose }: TemplatesModalProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [previewingTemplate, setPreviewingTemplate] = useState<Template | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, [category.id]);

  const fetchTemplates = async () => {
    if (!category.id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/email-automations/templates?category_id=${category.id}`);
      const result = await response.json();

      if (result.success) {
        setTemplates(result.data);
      } else {
        setError(result.error || 'Failed to load templates');
      }
    } catch (err) {
      setError('Network error loading templates');
      console.error('Error fetching templates:', err);
    } finally {
      setLoading(false);
    }
  };

  const getHolidayDate = (template: Template) => {
    if (template.holiday_date_type === 'fixed' && template.holiday_day) {
      return `${MONTH_NAMES[template.holiday_month - 1]} ${template.holiday_day}`;
    } else {
      return `${MONTH_NAMES[template.holiday_month - 1]} (Variable)`;
    }
  };

  const getHolidayEmoji = (slug: string): string => {
    const emojiMap: Record<string, string> = {
      'new-years-day': '🎉',
      'martin-luther-king-jr-day': '✊',
      'presidents-day': '🇺🇸',
      'memorial-day': '🇺🇸',
      'juneteenth': '✊',
      'independence-day': '🎆',
      'labor-day': '⚒️',
      'indigenous-peoples-day': '🪶',
      'halloween': '🎃',
      'veterans-day': '🎖️',
      'thanksgiving': '🦃',
      'christmas-day': '🎄',
    };
    return emojiMap[slug] || '📧';
  };

  const handleSaveTemplate = async (templateId: string, updates: Partial<Template>) => {
    try {
      // Filter out undefined values to prevent sending them to the API
      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, value]) => value !== undefined)
      );

      const response = await fetch(`/api/email-automations/templates/${templateId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanUpdates),
      });

      const result = await response.json();

      if (result.success) {
        // Update local state with saved template
        setTemplates(prev =>
          prev.map(t => (t.id === templateId ? { ...t, ...cleanUpdates } : t))
        );
        setEditingTemplate(null);
      } else {
        throw new Error(result.error || 'Failed to save template');
      }
    } catch (err) {
      console.error('Error saving template:', err);
      throw err;
    }
  };

  const handleDuplicateTemplate = async (templateId: string) => {
    try {
      const response = await fetch(`/api/email-automations/templates/${templateId}/duplicate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();

      if (result.success) {
        // Add duplicated template to local state
        setTemplates(prev => [...prev, result.data]);
        alert(`Template duplicated successfully as "${result.data.holiday_name}"`);
      } else {
        throw new Error(result.error || 'Failed to duplicate template');
      }
    } catch (err) {
      console.error('Error duplicating template:', err);
      alert('Failed to duplicate template. Please try again.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a1a] border border-[#404040] rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#404040]">
          <div>
            <h2 className="text-2xl font-bold text-[#ffd700] flex items-center gap-2">
              <FileText className="w-6 h-6" />
              {category.name} Templates
            </h2>
            <p className="text-sm text-[#dcdbd5] mt-1">
              {templates.length} {templates.length === 1 ? 'template' : 'templates'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[rgba(255,255,255,0.1)] rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-[#dcdbd5]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00ff88]"></div>
            </div>
          ) : error ? (
            <div className="p-6 rounded-lg border border-red-500/20 bg-red-500/5">
              <p className="text-red-400">Error: {error}</p>
              <button
                onClick={fetchTemplates}
                className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded transition-colors"
              >
                Retry
              </button>
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-[#404040] rounded-lg">
              <FileText className="w-12 h-12 mx-auto mb-4 text-[#404040]" />
              <p className="text-[#dcdbd5]">No templates found for this category</p>
              <p className="text-sm text-[#7a7a7a] mt-2">Create your first template to get started</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="p-4 rounded-lg border transition-all hover:border-[rgba(0,255,136,0.3)]"
                  style={{
                    background: 'rgba(64, 64, 64, 0.5)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {/* Template Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{getHolidayEmoji(template.holiday_slug)}</span>
                        <h4 className="text-base font-semibold text-[#e5e4dd]">
                          {template.holiday_name}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#7a7a7a]">
                        <Calendar className="w-3 h-3" />
                        <span>{getHolidayDate(template)}</span>
                      </div>
                    </div>
                    {!template.is_active && (
                      <span className="px-2 py-1 text-xs bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded">
                        Inactive
                      </span>
                    )}
                  </div>

                  {/* Subject Line */}
                  <p className="text-sm text-[#dcdbd5] mb-3 line-clamp-2" title={template.subject_line}>
                    {template.subject_line}
                  </p>

                  {/* Personalization Tokens */}
                  {template.personalization_tokens && template.personalization_tokens.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.personalization_tokens.map((token, idx) => (
                        <span
                          key={`${template.id}-token-${idx}`}
                          className="px-2 py-0.5 text-xs bg-[rgba(255,215,0,0.1)] border border-[rgba(255,215,0,0.3)] rounded text-[#ffd700]"
                        >
                          {'{{'}
                          {typeof token === 'string' ? token : String(token)}
                          {'}}'}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-[rgba(255,255,255,0.1)]">
                    <button
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs bg-[rgba(0,255,136,0.1)] hover:bg-[rgba(0,255,136,0.2)] border border-[rgba(0,255,136,0.3)] rounded transition-colors text-[#00ff88]"
                      onClick={() => setPreviewingTemplate(template)}
                    >
                      <Eye className="w-3 h-3" />
                      Preview
                    </button>
                    <button
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] rounded transition-colors text-[#dcdbd5]"
                      onClick={() => setEditingTemplate(template)}
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      className="p-1.5 hover:bg-[rgba(255,255,255,0.1)] rounded transition-colors"
                      onClick={() => handleDuplicateTemplate(template.id)}
                      title="Duplicate"
                    >
                      <Copy className="w-3 h-3 text-[#dcdbd5]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[#404040]">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] rounded-lg transition-colors text-[#dcdbd5]"
          >
            Close
          </button>
        </div>
      </div>

      {/* Edit Template Modal */}
      {editingTemplate && (
        <EditTemplateModal
          template={editingTemplate}
          onClose={() => setEditingTemplate(null)}
          onSave={(updates) => handleSaveTemplate(editingTemplate.id, updates)}
        />
      )}

      {/* Preview Template Modal */}
      {previewingTemplate && (
        <PreviewTemplateModal
          template={previewingTemplate}
          onClose={() => setPreviewingTemplate(null)}
        />
      )}
    </div>
  );
}
