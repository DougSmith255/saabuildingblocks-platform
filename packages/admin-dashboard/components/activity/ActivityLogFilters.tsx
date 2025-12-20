/**
 * Activity Log Filters Component
 * Phase 3: Activity Log UI
 *
 * Filter controls for audit logs
 */

'use client';

import { Search, Calendar, Filter } from 'lucide-react';
import type { AuditLogFilters } from '@/lib/api/audit-logs';

interface ActivityLogFiltersProps {
  filters: AuditLogFilters;
  onFilterChange: (filters: AuditLogFilters) => void;
  onSearch: () => void;
  onReset: () => void;
}

export function ActivityLogFilters({
  filters,
  onFilterChange,
  onSearch,
  onReset,
}: ActivityLogFiltersProps) {
  const handleInputChange = (
    field: keyof AuditLogFilters,
    value: string | undefined
  ) => {
    onFilterChange({
      ...filters,
      [field]: value || undefined,
    });
  };

  return (
    <div
      className="p-6 rounded-xl border border-[#404040]/50 mb-6"
      style={{
        background: 'rgba(64, 64, 64, 0.5)',
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-[#ffd700]" />
        <h3 className="text-lg font-semibold text-[#e5e4dd]">Filters</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Action Type Filter */}
        <div>
          <label className="block text-sm font-medium text-[#dcdbd5] mb-2">
            Action Type
          </label>
          <select
            value={filters.action || ''}
            onChange={(e) => handleInputChange('action', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-[#404040] bg-[#2a2a2a] text-[#e5e4dd] focus:border-[#ffd700] focus:ring-1 focus:ring-[#ffd700] transition-colors"
          >
            <option value="">All Actions</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
            <option value="password_reset">Password Reset</option>
            <option value="register">Register</option>
          </select>
        </div>

        {/* Severity Filter */}
        <div>
          <label className="block text-sm font-medium text-[#dcdbd5] mb-2">
            Severity
          </label>
          <select
            value={filters.severity || ''}
            onChange={(e) => handleInputChange('severity', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-[#404040] bg-[#2a2a2a] text-[#e5e4dd] focus:border-[#ffd700] focus:ring-1 focus:ring-[#ffd700] transition-colors"
          >
            <option value="">All Severities</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-[#dcdbd5] mb-2">
            <Calendar className="inline w-4 h-4 mr-1" />
            Start Date
          </label>
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-[#404040] bg-[#2a2a2a] text-[#e5e4dd] focus:border-[#ffd700] focus:ring-1 focus:ring-[#ffd700] transition-colors"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-[#dcdbd5] mb-2">
            <Calendar className="inline w-4 h-4 mr-1" />
            End Date
          </label>
          <input
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => handleInputChange('endDate', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-[#404040] bg-[#2a2a2a] text-[#e5e4dd] focus:border-[#ffd700] focus:ring-1 focus:ring-[#ffd700] transition-colors"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={onSearch}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-lg font-medium bg-[#ffd700] text-[#1a1a1a] hover:bg-[#ffd700]/90 transition-colors"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
        <button
          onClick={onReset}
          className="px-6 py-2 rounded-lg font-medium border border-[#404040] text-[#dcdbd5] hover:bg-[#404040]/30 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
