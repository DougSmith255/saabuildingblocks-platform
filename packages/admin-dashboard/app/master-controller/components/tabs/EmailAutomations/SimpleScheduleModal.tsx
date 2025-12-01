'use client';

/**
 * Simple Schedule Modal (Current Schema)
 *
 * Create or edit email schedules with current database schema:
 * - Select template
 * - Set year, date, time
 * - Configure GoHighLevel tag filter
 */

import { useState, useEffect } from 'react';
import { X, Save, Calendar } from 'lucide-react';

interface Template {
  id: string;
  holiday_name: string;
  category_id: string;
}

interface Schedule {
  id?: string;
  template_id: string;
  schedule_name: string;
  schedule_year: number;
  send_date?: string;
  send_time: string;
  timezone: string;
  ghl_tag_filter: string;
  auto_calculate_date?: boolean;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

interface SimpleScheduleModalProps {
  schedule?: Schedule | null;
  templates: Template[];
  onClose: () => void;
  onSave: (schedule: Schedule) => Promise<void>;
}

export function SimpleScheduleModal({ schedule, templates, onClose, onSave }: SimpleScheduleModalProps) {
  const [scheduleName, setScheduleName] = useState(schedule?.schedule_name || '');
  const [templateId, setTemplateId] = useState(schedule?.template_id || '');
  const [scheduleYear, setScheduleYear] = useState(schedule?.schedule_year || new Date().getFullYear());
  const [sendDate, setSendDate] = useState(schedule?.send_date || '');
  const [sendTime, setSendTime] = useState(schedule?.send_time || '09:00:00');
  const [timezone, setTimezone] = useState(schedule?.timezone || 'America/New_York');
  const [ghlTagFilter, setGhlTagFilter] = useState(schedule?.ghl_tag_filter || 'active-downline');
  const [autoCalculateDate, setAutoCalculateDate] = useState(schedule?.auto_calculate_date ?? true);
  const [saving, setSaving] = useState(false);

  const isEditMode = !!schedule?.id;

  // Auto-generate schedule name from template
  useEffect(() => {
    if (!isEditMode && templateId && !scheduleName) {
      const selectedTemplate = templates.find(t => t.id === templateId);
      if (selectedTemplate) {
        setScheduleName(`${selectedTemplate.holiday_name} ${scheduleYear}`);
      }
    }
  }, [templateId, scheduleYear, templates, isEditMode, scheduleName]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const scheduleData: Schedule = {
        ...(schedule?.id && { id: schedule.id }),
        template_id: templateId,
        schedule_name: scheduleName,
        schedule_year: scheduleYear,
        send_date: !autoCalculateDate ? sendDate : undefined,
        send_time: sendTime,
        timezone: timezone,
        ghl_tag_filter: ghlTagFilter,
        auto_calculate_date: autoCalculateDate,
      };

      await onSave(scheduleData);
      onClose();
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert('Failed to save schedule. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a1a] border border-[#404040] rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#404040]">
          <div>
            <h2 className="text-2xl font-bold text-[#ffd700] flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              {isEditMode ? 'Edit Schedule' : 'Create Schedule'}
            </h2>
            <p className="text-sm text-[#dcdbd5] mt-1">
              {isEditMode ? 'Update schedule details' : 'Schedule automated email send'}
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Schedule Name */}
          <div>
            <label className="block text-sm font-medium text-[#e5e4dd] mb-2">
              Schedule Name *
            </label>
            <input
              type="text"
              value={scheduleName}
              onChange={(e) => setScheduleName(e.target.value)}
              className="w-full px-4 py-2 bg-[rgba(64,64,64,0.5)] border border-[#404040] rounded-lg text-[#e5e4dd] focus:outline-none focus:border-[#ffd700]"
              placeholder="e.g., Christmas 2025"
            />
          </div>

          {/* Template Selection */}
          <div>
            <label className="block text-sm font-medium text-[#e5e4dd] mb-2">
              Email Template *
            </label>
            <select
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              className="w-full px-4 py-2 bg-[rgba(64,64,64,0.5)] border border-[#404040] rounded-lg text-[#e5e4dd] focus:outline-none focus:border-[#ffd700]"
            >
              <option value="">Select a template...</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.holiday_name}
                </option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm font-medium text-[#e5e4dd] mb-2">
              Year *
            </label>
            <input
              type="number"
              value={scheduleYear}
              onChange={(e) => setScheduleYear(parseInt(e.target.value) || new Date().getFullYear())}
              min="2024"
              max="2100"
              className="w-full px-4 py-2 bg-[rgba(64,64,64,0.5)] border border-[#404040] rounded-lg text-[#e5e4dd] focus:outline-none focus:border-[#ffd700]"
            />
          </div>

          {/* Auto-calculate Date Toggle */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={autoCalculateDate}
                onChange={(e) => setAutoCalculateDate(e.target.checked)}
                className="w-5 h-5 rounded border-[#404040] bg-[rgba(64,64,64,0.5)] text-[#00ff88] focus:ring-[#00ff88] focus:ring-offset-0"
              />
              <div>
                <div className="text-sm font-medium text-[#e5e4dd]">Auto-calculate Date</div>
                <div className="text-xs text-[#7a7a7a]">
                  Automatically calculate send date from template holiday info
                </div>
              </div>
            </label>
          </div>

          {/* Manual Date (if not auto-calculating) */}
          {!autoCalculateDate && (
            <div>
              <label className="block text-sm font-medium text-[#e5e4dd] mb-2">
                Send Date *
              </label>
              <input
                type="date"
                value={sendDate}
                onChange={(e) => setSendDate(e.target.value)}
                className="w-full px-4 py-2 bg-[rgba(64,64,64,0.5)] border border-[#404040] rounded-lg text-[#e5e4dd] focus:outline-none focus:border-[#ffd700]"
              />
            </div>
          )}

          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-[#e5e4dd] mb-2">
              Send Time *
            </label>
            <input
              type="time"
              value={sendTime.substring(0, 5)}
              onChange={(e) => setSendTime(`${e.target.value}:00`)}
              className="w-full px-4 py-2 bg-[rgba(64,64,64,0.5)] border border-[#404040] rounded-lg text-[#e5e4dd] focus:outline-none focus:border-[#ffd700]"
            />
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-sm font-medium text-[#e5e4dd] mb-2">
              Timezone
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-4 py-2 bg-[rgba(64,64,64,0.5)] border border-[#404040] rounded-lg text-[#e5e4dd] focus:outline-none focus:border-[#ffd700]"
            >
              <option value="America/New_York">Eastern (ET)</option>
              <option value="America/Chicago">Central (CT)</option>
              <option value="America/Denver">Mountain (MT)</option>
              <option value="America/Los_Angeles">Pacific (PT)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>

          {/* GoHighLevel Tag Filter */}
          <div>
            <label className="block text-sm font-medium text-[#e5e4dd] mb-2">
              GoHighLevel Tag Filter
            </label>
            <input
              type="text"
              value={ghlTagFilter}
              onChange={(e) => setGhlTagFilter(e.target.value)}
              className="w-full px-4 py-2 bg-[rgba(64,64,64,0.5)] border border-[#404040] rounded-lg text-[#e5e4dd] focus:outline-none focus:border-[#ffd700]"
              placeholder="active-downline"
            />
            <p className="text-xs text-[#7a7a7a] mt-1">
              Only send to contacts with this tag in GoHighLevel
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[#404040]">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] rounded-lg transition-colors text-[#dcdbd5] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !scheduleName.trim() || !templateId}
            className="flex items-center gap-2 px-4 py-2 bg-[rgba(0,255,136,0.1)] hover:bg-[rgba(0,255,136,0.2)] border border-[rgba(0,255,136,0.3)] rounded-lg transition-colors text-[#00ff88] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : isEditMode ? 'Update Schedule' : 'Create Schedule'}
          </button>
        </div>
      </div>
    </div>
  );
}
