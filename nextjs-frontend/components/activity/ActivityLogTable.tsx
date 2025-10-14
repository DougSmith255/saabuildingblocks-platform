/**
 * Activity Log Table Component
 * Phase 3: Activity Log UI
 *
 * Main table component for displaying audit logs
 */

'use client';

import { ActivityLogRow } from './ActivityLogRow';
import type { AuditLog } from '@/lib/api/audit-logs';

interface ActivityLogTableProps {
  logs: AuditLog[];
  loading?: boolean;
}

export function ActivityLogTable({ logs, loading = false }: ActivityLogTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ffd700]"></div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#dcdbd5] text-lg">No activity logs found</p>
        <p className="text-[#dcdbd5]/60 text-sm mt-2">
          Try adjusting your filters or date range
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-[#404040]">
        <thead
          className="sticky top-0 z-10"
          style={{
            background: 'rgba(42, 42, 42, 0.95)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-[#ffd700] uppercase tracking-wider"
            >
              Timestamp
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-[#ffd700] uppercase tracking-wider"
            >
              User
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-[#ffd700] uppercase tracking-wider"
            >
              Action
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-[#ffd700] uppercase tracking-wider"
            >
              Category
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-[#ffd700] uppercase tracking-wider"
            >
              IP Address
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-[#ffd700] uppercase tracking-wider"
            >
              Details
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-center text-xs font-medium text-[#ffd700] uppercase tracking-wider"
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#404040]">
          {logs.map((log) => (
            <ActivityLogRow key={log.id} log={log} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
