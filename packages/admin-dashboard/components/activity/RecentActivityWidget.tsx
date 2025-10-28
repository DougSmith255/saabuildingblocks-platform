/**
 * Recent Activity Widget Component
 * Phase 3: Activity Log UI
 *
 * Shows last 5 activities on dashboard
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, ExternalLink } from 'lucide-react';
import { ActionBadge } from './ActionBadge';
import { fetchAuditLogs } from '@/lib/api/audit-logs';
import type { AuditLog } from '@/lib/api/audit-logs';

export function RecentActivityWidget() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecentLogs = async () => {
      try {
        const response = await fetchAuditLogs({ limit: 5 });
        setLogs(response.logs);
      } catch (error) {
        console.error('Failed to load recent activity:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecentLogs();
  }, []);

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (loading) {
    return (
      <div
        className="p-6 rounded-xl border border-[#404040]/50"
        style={{
          background: 'rgba(64, 64, 64, 0.4)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#e5e4dd] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#ffd700]" />
            Recent Activity
          </h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#ffd700]"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-6 rounded-xl border border-[#404040]/50"
      style={{
        background: 'rgba(64, 64, 64, 0.4)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#e5e4dd] flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#ffd700]" />
          Recent Activity
        </h3>
        <Link
          href="/agent-portal/activity"
          className="text-sm text-[#ffd700] hover:text-[#ffd700]/80 transition-colors flex items-center gap-1"
        >
          View All
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {logs.length === 0 ? (
        <p className="text-[#dcdbd5]/70 text-sm text-center py-8">No recent activity</p>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-start justify-between gap-3 p-3 rounded-lg hover:bg-[#404040]/30 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <ActionBadge action={log.event_type} severity={log.severity} />
                  <span className="text-xs text-[#dcdbd5]/70">
                    {formatRelativeTime(log.created_at)}
                  </span>
                </div>
                <p className="text-sm text-[#e5e4dd]">
                  {log.user?.email || 'Unknown user'}
                </p>
                {log.description && (
                  <p className="text-xs text-[#dcdbd5]/70 truncate mt-1">
                    {log.description}
                  </p>
                )}
              </div>
              {!log.success && (
                <span className="text-xs text-red-400 font-medium">Failed</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
