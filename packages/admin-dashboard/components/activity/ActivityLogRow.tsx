/**
 * Activity Log Row Component
 * Phase 3: Activity Log UI
 *
 * Expandable row showing audit log details
 */

'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ActionBadge } from './ActionBadge';
import type { AuditLog } from '@/lib/api/audit-logs';

interface ActivityLogRowProps {
  log: AuditLog;
}

export function ActivityLogRow({ log }: ActivityLogRowProps) {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  return (
    <>
      <tr
        className="border-b border-[#404040] hover:bg-[#404040]/30 transition-colors cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center gap-2">
            {expanded ? (
              <ChevronDown className="w-4 h-4 text-[#dcdbd5]" />
            ) : (
              <ChevronRight className="w-4 h-4 text-[#dcdbd5]" />
            )}
            <span className="text-sm text-[#dcdbd5]">{formatDate(log.created_at)}</span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm">
            <div className="font-medium text-[#e5e4dd]">
              {log.user?.email || 'Unknown'}
            </div>
            {log.user?.full_name && (
              <div className="text-[#dcdbd5]/70">{log.user.full_name}</div>
            )}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <ActionBadge action={log.event_type} severity={log.severity} />
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="text-sm text-[#dcdbd5]">{log.event_category}</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="text-sm text-[#dcdbd5]">{log.ip_address || 'N/A'}</span>
        </td>
        <td className="px-6 py-4">
          <div className="text-sm text-[#dcdbd5] truncate max-w-xs">
            {log.description || 'No description'}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-center">
          {log.success ? (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
              Success
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
              Failed
            </span>
          )}
        </td>
      </tr>

      {/* Expanded Details Row */}
      {expanded && (
        <tr className="bg-[#404040]/20 border-b border-[#404040]">
          <td colSpan={7} className="px-6 py-4">
            <div className="space-y-4">
              {/* Request Information */}
              <div>
                <h4 className="text-sm font-semibold text-[#ffd700] mb-2">
                  Request Details
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[#dcdbd5]/70">Method:</span>{' '}
                    <span className="text-[#e5e4dd]">{log.request_method || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[#dcdbd5]/70">Path:</span>{' '}
                    <span className="text-[#e5e4dd] break-all">
                      {log.request_path || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#dcdbd5]/70">User Agent:</span>{' '}
                    <span className="text-[#e5e4dd] break-all">
                      {log.user_agent || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {!log.success && log.error_message && (
                <div>
                  <h4 className="text-sm font-semibold text-red-400 mb-2">Error</h4>
                  <p className="text-sm text-[#e5e4dd] bg-red-500/10 border border-red-500/20 rounded px-3 py-2">
                    {log.error_message}
                  </p>
                </div>
              )}

              {/* Metadata */}
              {log.metadata && Object.keys(log.metadata).length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-[#ffd700] mb-2">Metadata</h4>
                  <pre className="text-xs text-[#e5e4dd] bg-[#2a2a2a] border border-[#404040] rounded px-3 py-2 overflow-x-auto">
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
