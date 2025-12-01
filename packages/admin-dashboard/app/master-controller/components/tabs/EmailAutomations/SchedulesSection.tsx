'use client';

/**
 * Schedules Section
 *
 * Manage automated email schedules:
 * - View upcoming/past schedules
 * - Create schedules for holiday templates
 * - Manual trigger execution
 * - Monitor send progress
 */

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Calendar, Plus, Play, Pause, CheckCircle, XCircle, Clock, Users, Edit2, Trash2 } from 'lucide-react';

// Dynamically import the schedule modal
const ScheduleModal = dynamic(() => import('./SimpleScheduleModal').then(mod => ({ default: mod.SimpleScheduleModal })), {
  ssr: false,
});

interface Schedule {
  id: string;
  template_id: string;
  schedule_name: string;
  schedule_year: number;
  send_date: string;
  send_time: string;
  timezone: string;
  ghl_tag_filter: string;
  status: 'scheduled' | 'processing' | 'completed' | 'failed' | 'cancelled';
  contacts_count: number;
  emails_sent: number;
  emails_failed: number;
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
  template?: {
    id: string;
    holiday_name: string;
    holiday_slug: string;
    subject_line: string;
    category?: {
      id: string;
      name: string;
      slug: string;
      icon: string | null;
    };
  };
}

const STATUS_CONFIG = {
  scheduled: { label: 'Scheduled', color: '#ffd700', icon: Clock },
  processing: { label: 'Processing', color: '#00ff88', icon: Play },
  completed: { label: 'Completed', color: '#00ff88', icon: CheckCircle },
  failed: { label: 'Failed', color: '#ff4444', icon: XCircle },
  cancelled: { label: 'Cancelled', color: '#7a7a7a', icon: Pause },
};

interface Template {
  id: string;
  holiday_name: string;
  category_id: string;
}

export function SchedulesSection() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  useEffect(() => {
    fetchSchedules();
    fetchTemplates();
  }, [filterStatus, showUpcoming]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = '/api/email-automations/schedules';
      const params = new URLSearchParams();

      if (filterStatus) params.append('status', filterStatus);
      if (showUpcoming) params.append('upcoming', 'true');

      if (params.toString()) url += `?${params}`;

      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        setSchedules(result.data);
      } else {
        setError(result.error || 'Failed to load schedules');
      }
    } catch (err) {
      setError('Network error loading schedules');
      console.error('Error fetching schedules:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/email-automations/templates');
      const result = await response.json();

      if (result.success) {
        setTemplates(result.data);
      }
    } catch (err) {
      console.error('Error fetching templates:', err);
    }
  };

  const handleSaveSchedule = async (scheduleData: {
    template_id: string;
    schedule_name: string;
    schedule_year: number;
    send_date?: string;
    send_time: string;
    timezone: string;
    ghl_tag_filter: string;
    auto_calculate_date?: boolean;
  }) => {
    try {
      const isEdit = !!editingSchedule?.id;
      const url = isEdit
        ? `/api/email-automations/schedules/${editingSchedule.id}`
        : '/api/email-automations/schedules';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scheduleData),
      });

      const result = await response.json();

      if (result.success) {
        if (isEdit) {
          // Update existing schedule
          setSchedules(prev =>
            prev.map(s => (s.id === editingSchedule.id ? { ...s, ...result.data } : s))
          );
        } else {
          // Add new schedule
          setSchedules(prev => [...prev, result.data]);
        }
        setShowScheduleModal(false);
        setEditingSchedule(null);
      } else {
        throw new Error(result.error || 'Failed to save schedule');
      }
    } catch (err) {
      console.error('Error saving schedule:', err);
      throw err;
    }
  };

  const handleDeleteSchedule = async (id: string, scheduleName: string) => {
    if (!confirm(`Delete schedule "${scheduleName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/email-automations/schedules/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setSchedules(prev => prev.filter(s => s.id !== id));
      } else {
        throw new Error(result.error || 'Failed to delete schedule');
      }
    } catch (err) {
      console.error('Error deleting schedule:', err);
      alert('Failed to delete schedule. Please try again.');
    }
  };

  const triggerSchedule = async (id: string, scheduleName: string) => {
    if (!confirm(`Trigger "${scheduleName}" now? This will send emails to all active-downline contacts.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/email-automations/schedules/${id}/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test_mode: false }),
      });

      const result = await response.json();

      if (result.success) {
        alert('Schedule triggered successfully! Check Send Logs for progress.');
        fetchSchedules(); // Refresh list
      } else {
        alert(`Failed to trigger schedule: ${result.error}`);
      }
    } catch (err) {
      console.error('Error triggering schedule:', err);
      alert('Network error triggering schedule');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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
          onClick={fetchSchedules}
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
          <h3 className="text-lg font-semibold text-[#e5e4dd]">Email Schedules</h3>
          <p className="text-sm text-[#dcdbd5]">
            {schedules.length} {schedules.length === 1 ? 'schedule' : 'schedules'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-[rgba(64,64,64,0.5)] border border-[rgba(255,255,255,0.1)] rounded-lg text-[#e5e4dd] text-sm"
          >
            <option value="">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Upcoming Toggle */}
          <button
            onClick={() => setShowUpcoming(!showUpcoming)}
            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
              showUpcoming
                ? 'bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.3)] text-[#00ff88]'
                : 'bg-[rgba(64,64,64,0.5)] border border-[rgba(255,255,255,0.1)] text-[#dcdbd5]'
            }`}
          >
            {showUpcoming ? 'Upcoming Only' : 'All Dates'}
          </button>

          <button
            className="flex items-center gap-2 px-4 py-2 bg-[rgba(0,255,136,0.1)] hover:bg-[rgba(0,255,136,0.2)] border border-[rgba(0,255,136,0.3)] rounded-lg transition-colors text-[#00ff88]"
            onClick={() => {
              setEditingSchedule(null);
              setShowScheduleModal(true);
            }}
          >
            <Plus className="w-4 h-4" />
            New Schedule
          </button>
        </div>
      </div>

      {/* Schedules List */}
      <div className="space-y-4">
        {schedules.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-[#404040] rounded-lg">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-[#404040]" />
            <p className="text-[#dcdbd5]">No schedules found</p>
            <p className="text-sm text-[#7a7a7a] mt-2">
              {showUpcoming ? 'No upcoming schedules' : 'Create your first schedule to automate email sends'}
            </p>
          </div>
        ) : (
          schedules.map((schedule) => {
            const statusConfig = STATUS_CONFIG[schedule.status];
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={schedule.id}
                className="p-4 rounded-lg border transition-all"
                style={{
                  background: 'rgba(64, 64, 64, 0.5)',
                  borderColor: `rgba(${
                    schedule.status === 'completed' ? '0, 255, 136' :
                    schedule.status === 'failed' ? '255, 68, 68' :
                    schedule.status === 'processing' ? '0, 255, 136' :
                    '255, 255, 255'
                  }, 0.2)`,
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Template Name */}
                    <h4 className="text-lg font-semibold text-[#e5e4dd] mb-1">
                      {schedule.schedule_name}
                    </h4>

                    {/* Template & Category */}
                    {schedule.template && (
                      <p className="text-sm text-[#dcdbd5] mb-2">
                        Template: {schedule.template.holiday_name}
                        {schedule.template.category && (
                          <span className="text-[#7a7a7a]"> • {schedule.template.category.name}</span>
                        )}
                      </p>
                    )}

                    {/* Schedule Details */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-[#7a7a7a] mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(schedule.send_date)} at {schedule.send_time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>Tag: {schedule.ghl_tag_filter}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    {schedule.contacts_count > 0 && (
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-[#dcdbd5]">
                          Contacts: <strong>{schedule.contacts_count}</strong>
                        </span>
                        <span className="text-[#00ff88]">
                          Sent: <strong>{schedule.emails_sent}</strong>
                        </span>
                        {schedule.emails_failed > 0 && (
                          <span className="text-red-400">
                            Failed: <strong>{schedule.emails_failed}</strong>
                          </span>
                        )}
                      </div>
                    )}

                    {/* Error Message */}
                    {schedule.error_message && (
                      <p className="mt-2 text-sm text-red-400">
                        Error: {schedule.error_message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {/* Status Badge */}
                    <div
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: `rgba(${
                          statusConfig.color === '#ffd700' ? '255, 215, 0' :
                          statusConfig.color === '#00ff88' ? '0, 255, 136' :
                          statusConfig.color === '#ff4444' ? '255, 68, 68' :
                          '122, 122, 122'
                        }, 0.1)`,
                        color: statusConfig.color,
                      }}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig.label}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {/* Trigger Button */}
                      {schedule.status === 'scheduled' && (
                        <button
                          onClick={() => triggerSchedule(schedule.id, schedule.schedule_name)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs bg-[rgba(0,255,136,0.1)] hover:bg-[rgba(0,255,136,0.2)] border border-[rgba(0,255,136,0.3)] rounded transition-colors text-[#00ff88]"
                        >
                          <Play className="w-3 h-3" />
                          Trigger Now
                        </button>
                      )}
                      {/* Edit Button */}
                      <button
                        onClick={() => {
                          setEditingSchedule(schedule);
                          setShowScheduleModal(true);
                        }}
                        className="p-1.5 hover:bg-[rgba(255,255,255,0.1)] rounded transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3 h-3 text-[#dcdbd5]" />
                      </button>
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteSchedule(schedule.id, schedule.schedule_name)}
                        className="p-1.5 hover:bg-[rgba(255,0,0,0.1)] rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
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
          <strong className="text-[#ffd700]">About Schedules:</strong> Schedules automatically send emails on specific dates.
          For variable holidays (Thanksgiving, MLK Day, etc.), dates are calculated automatically. You can also trigger schedules manually.
        </p>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <ScheduleModal
          schedule={editingSchedule}
          templates={templates}
          onClose={() => {
            setShowScheduleModal(false);
            setEditingSchedule(null);
          }}
          onSave={handleSaveSchedule}
        />
      )}
    </div>
  );
}
