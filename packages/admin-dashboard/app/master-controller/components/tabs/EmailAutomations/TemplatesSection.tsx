'use client';

/**
 * Templates Section
 *
 * Manage holiday email templates:
 * - 12 US federal holidays + Halloween
 * - HTML email content with personalization tokens
 * - Preview functionality
 * - Template duplication
 */

import { useState, useEffect } from 'react';
import { FileText, Plus, Edit2, Copy, Eye, Calendar, Tag } from 'lucide-react';

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

export function TemplatesSection() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterMonth, setFilterMonth] = useState<number | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, [filterMonth]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = '/api/email-automations/templates';
      if (filterMonth) {
        url += `?month=${filterMonth}`;
      }

      const response = await fetch(url);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00ff88]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-lg border border-red-500/20 bg-red-500/5">
        <p className="text-red-400">Error: {error}</p>
        <button
          onClick={fetchTemplates}
          className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-lg font-semibold text-[#e5e4dd]">Holiday Email Templates</h3>
          <p className="text-sm text-[#dcdbd5]">
            {templates.length} {templates.length === 1 ? 'template' : 'templates'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Month Filter */}
          <select
            value={filterMonth || ''}
            onChange={(e) => setFilterMonth(e.target.value ? parseInt(e.target.value) : null)}
            className="px-3 py-2 bg-[rgba(64,64,64,0.5)] border border-[rgba(255,255,255,0.1)] rounded-lg text-[#e5e4dd] text-sm"
          >
            <option value="">All Months</option>
            {MONTH_NAMES.map((month, index) => (
              <option key={month} value={index + 1}>
                {month}
              </option>
            ))}
          </select>

          <button
            className="flex items-center gap-2 px-4 py-2 bg-[rgba(0,255,136,0.1)] hover:bg-[rgba(0,255,136,0.2)] border border-[rgba(0,255,136,0.3)] rounded-lg transition-colors text-[#00ff88]"
            onClick={() => alert('Create template modal - coming soon')}
          >
            <Plus className="w-4 h-4" />
            New Template
          </button>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.length === 0 ? (
          <div className="col-span-full text-center py-12 border border-dashed border-[#404040] rounded-lg">
            <FileText className="w-12 h-12 mx-auto mb-4 text-[#404040]" />
            <p className="text-[#dcdbd5]">No templates found</p>
            {filterMonth && (
              <button
                onClick={() => setFilterMonth(null)}
                className="mt-4 text-sm text-[#00ff88] hover:underline"
              >
                Clear filter
              </button>
            )}
          </div>
        ) : (
          templates.map((template) => (
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

              {/* Category Badge */}
              {template.category && (
                <div className="flex items-center gap-2 mb-3 text-xs text-[#7a7a7a]">
                  <Tag className="w-3 h-3" />
                  <span>{template.category.name}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-[rgba(255,255,255,0.1)]">
                <button
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs bg-[rgba(0,255,136,0.1)] hover:bg-[rgba(0,255,136,0.2)] border border-[rgba(0,255,136,0.3)] rounded transition-colors text-[#00ff88]"
                  onClick={() => alert(`Preview template: ${template.holiday_name}`)}
                >
                  <Eye className="w-3 h-3" />
                  Preview
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] rounded transition-colors text-[#dcdbd5]"
                  onClick={() => alert(`Edit template: ${template.holiday_name}`)}
                >
                  <Edit2 className="w-3 h-3" />
                  Edit
                </button>
                <button
                  className="p-1.5 hover:bg-[rgba(255,255,255,0.1)] rounded transition-colors"
                  onClick={() => alert(`Duplicate template: ${template.holiday_name}`)}
                  title="Duplicate"
                >
                  <Copy className="w-3 h-3 text-[#dcdbd5]" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info Note */}
      <div
        className="p-4 rounded-lg border"
        style={{
          background: 'rgba(255, 215, 0, 0.05)',
          borderColor: 'rgba(255, 215, 0, 0.2)',
        }}
      >
        <p className="text-sm text-[#dcdbd5]">
          <strong className="text-[#ffd700]">Personalization Tokens:</strong> Use {'{'}
          {'{'} firstName {'}'}{'}'},  {'{'}{'{'} lastName {'}'}{'}'},  {'{'}{'{'} email {'}'}{'}'}  in your templates.
          These will be automatically replaced with contact data from GoHighLevel.
        </p>
      </div>
    </div>
  );
}
