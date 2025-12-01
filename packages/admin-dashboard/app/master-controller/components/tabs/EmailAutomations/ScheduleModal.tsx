'use client';

/**
 * Schedule Modal
 *
 * Create or edit email automation schedules
 * - Select template to send
 * - Choose trigger type (scheduled date or event-based)
 * - Set date/time for scheduled sends
 * - Configure recurrence pattern
 * - Define target audience
 * - Active/Inactive status
 */

import { useState, useEffect } from 'react';
import { X, Save, Calendar, Clock } from 'lucide-react';

interface Template {
  id: string;
  holiday_name: string;
  category_id: string;
}

interface Schedule {
  id?: string;
  template_id: string;
  schedule_name: string;
  trigger_type: 'scheduled' | 'event';
  scheduled_date?: string | null;
  scheduled_time?: string | null;
  event_type?: string | null;
  days_offset?: number | null;
  recurrence_pattern?: string | null;
  target_audience?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface ScheduleModalProps {
  schedule?: Schedule | null;
  templates: Template[];
  onClose: () => void;
  onSave: (schedule: Schedule) => Promise<void>;
}

export function ScheduleModal({ schedule, templates, onClose, onSave }: ScheduleModalProps) {
  const [scheduleName, setScheduleName] = useState(schedule?.schedule_name || '');
  const [templateId, setTemplateId] = useState(schedule?.template_id || '');
  const [triggerType, setTriggerType] = useState<'scheduled' | 'event'>(schedule?.trigger_type || 'scheduled');
  const [scheduledDate, setScheduledDate] = useState(schedule?.scheduled_date || '');
  const [scheduledTime, setScheduledTime] = useState(schedule?.scheduled_time || '09:00');
  const [eventType, setEventType] = useState(schedule?.event_type || 'birthday');
  const [daysOffset, setDaysOffset] = useState(schedule?.days_offset || 0);
  const [recurrencePattern, setRecurrencePattern] = useState(schedule?.recurrence_pattern || 'none');
  const [targetAudience, setTargetAudience] = useState(schedule?.target_audience || 'all');
  const [isActive, setIsActive] = useState(schedule?.is_active ?? true);
  const [saving, setSaving] = useState(false);

  const isEditMode = !!schedule?.id;

  // Auto-generate schedule name from template when creating
  useEffect(() => {
    if (!isEditMode && templateId && !scheduleName) {
      const selectedTemplate = templates.find(t => t.id === templateId);
      if (selectedTemplate) {
        const triggerLabel = triggerType === 'scheduled' ? 'Scheduled' : 'Event-based';
        setScheduleName(`${selectedTemplate.holiday_name} - ${triggerLabel}`);
      }
    }
  }, [templateId, triggerType, templates, isEditMode, scheduleName]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const scheduleData: Schedule = {
        ...(schedule?.id && { id: schedule.id }),
        template_id: templateId,
        schedule_name: scheduleName,
        trigger_type: triggerType,
        scheduled_date: triggerType === 'scheduled' ? scheduledDate : null,
        scheduled_time: triggerType === 'scheduled' ? scheduledTime : null,
        event_type: triggerType === 'event' ? eventType : null,
        days_offset: triggerType === 'event' ? daysOffset : null,
        recurrence_pattern: recurrencePattern !== 'none' ? recurrencePattern : null,
        target_audience: targetAudience !== 'all' ? targetAudience : null,
        is_active: isActive,
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
        className="bg-[#1a1a1a] border border-[#404040] rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
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
              {isEditMode ? 'Update schedule details' : 'Configure when and how to send emails'}
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
              placeholder="e.g., Christmas Email - Annual Send"
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
            <p className="text-xs text-[#7a7a7a] mt-1">
              Choose which email template to send
            </p>
          </div>

          {/* Trigger Type */}
          <div>
            <label className="block text-sm font-medium text-[#e5e4dd] mb-2">
              Trigger Type *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTriggerType('scheduled')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  triggerType === 'scheduled'
                    ? 'border-[#ffd700] bg-[rgba(255,215,0,0.1)]'
                    : 'border-[#404040] bg-[rgba(64,64,64,0.3)] hover:border-[#606060]'
                }`}
              >
                <Calendar className={`w-6 h-6 mb-2 ${triggerType === 'scheduled' ? 'text-[#ffd700]' : 'text-[#dcdbd5]'}`} />
                <div className={`text-sm font-medium ${triggerType === 'scheduled' ? 'text-[#ffd700]' : 'text-[#dcdbd5]'}`}>
                  Scheduled Date
                </div>
                <div className="text-xs text-[#7a7a7a] mt-1">
                  Send on specific date/time
                </div>
              </button>
              <button
                onClick={() => setTriggerType('event')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  triggerType === 'event'
                    ? 'border-[#ffd700] bg-[rgba(255,215,0,0.1)]'
                    : 'border-[#404040] bg-[rgba(64,64,64,0.3)] hover:border-[#606060]'
                }`}
              >
                <Clock className={`w-6 h-6 mb-2 ${triggerType === 'event' ? 'text-[#ffd700]' : 'text-[#dcdbd5]'}`} />
                <div className={`text-sm font-medium ${triggerType === 'event' ? 'text-[#ffd700]' : 'text-[#dcdbd5]'}`}>
                  Event-Based
                </div>
                <div className="text-xs text-[#7a7a7a] mt-1">
                  Trigger on contact events
                </div>
              </button>
            </div>
          </div>

          {/* Scheduled Date/Time Fields */}
          {triggerType === 'scheduled' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#e5e4dd] mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-4 py-2 bg-[rgba(64,64,64,0.5)] border border-[#404040] rounded-lg text-[#e5e4dd] focus:outline-none focus:border-[#ffd700]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#e5e4dd] mb-2">
                  Time *
                </label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full px-4 py-2 bg-[rgba(64,64,64,0.5)] border border-[#404040] rounded-lg text-[#e5e4dd] focus:outline-none focus:border-[#ffd700]"
                />
              </div>
            </div>
          )}

          {/* Event-Based Fields */}
          {triggerType === 'event' && (
            <>
              <div>
                <label className="block text-sm font-medium text-[#e5e4dd] mb-2">
                  Event Type *
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full px-4 py-2 bg-[rgba(64,64,64,0.5)] border border-[#404040] rounded-lg text-[#e5e4dd] focus:outline-none focus:border-[#ffd700]"
                >
                  <option value="birthday">Birthday</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="signup">Signup Date</option>
                  <option value="custom">Custom Date Field</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#e5e4dd] mb-2">
                  Days Offset
                </label>
                <input
                  type="number"
                  value={daysOffset}
                  onChange={(e) => setDaysOffset(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 bg-[rgba(64,64,64,0.5)] border border-[#404040] rounded-lg text-[#e5e4dd] focus:outline-none focus:border-[#ffd700]"
                  placeholder="0"
                />
                <p className="text-xs text-[#7a7a7a] mt-1">
                  Negative = days before, Positive = days after (e.g., -3 sends 3 days before birthday)
                </p>
              </div>
            </>
          )}

          {/* Recurrence Pattern */}
          <div>
            <label className="block text-sm font-medium text-[#e5e4dd] mb-2">
              Recurrence Pattern
            </label>
            <select
              value={recurrencePattern}
              onChange={(e) => setRecurrencePattern(e.target.value)}
              className="w-full px-4 py-2 bg-[rgba(64,64,64,0.5)] border border-[#404040] rounded-lg text-[#e5e4dd] focus:outline-none focus:border-[#ffd700]"
            >
              <option value="none">No Recurrence (One-time)</option>
              <option value="yearly">Yearly</option>
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="daily">Daily</option>
            </select>
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-sm font-medium text-[#e5e4dd] mb-2">
              Target Audience
            </label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full px-4 py-2 bg-[rgba(64,64,64,0.5)] border border-[#404040] rounded-lg text-[#e5e4dd] focus:outline-none focus:border-[#ffd700]"
            >
              <option value="all">All Contacts</option>
              <option value="tagged">Contacts with Specific Tags (Future)</option>
              <option value="segment">Custom Segment (Future)</option>
            </select>
            <p className="text-xs text-[#7a7a7a] mt-1">
              Define who receives this email
            </p>
          </div>

          {/* Active Status */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-5 h-5 rounded border-[#404040] bg-[rgba(64,64,64,0.5)] text-[#00ff88] focus:ring-[#00ff88] focus:ring-offset-0"
              />
              <div>
                <div className="text-sm font-medium text-[#e5e4dd]">Active</div>
                <div className="text-xs text-[#7a7a7a]">
                  Inactive schedules will not trigger email sends
                </div>
              </div>
            </label>
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
