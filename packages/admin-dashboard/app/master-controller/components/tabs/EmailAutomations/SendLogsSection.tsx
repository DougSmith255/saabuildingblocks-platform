'use client';

/**
 * Send Logs Section
 *
 * Email delivery tracking and statistics dashboard:
 * - Aggregated statistics (success rate, totals)
 * - Individual send logs with status
 * - Filter by status, schedule, contact
 * - Pagination support
 */

import { useState, useEffect } from 'react';
import { BarChart3, Mail, CheckCircle, XCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react';

interface SendLog {
  id: string;
  schedule_id: string | null;
  template_id: string | null;
  ghl_contact_id: string;
  recipient_email: string;
  recipient_name: string | null;
  subject_line: string;
  status: 'pending' | 'sent' | 'delivered' | 'bounced' | 'failed';
  email_provider: string | null;
  sent_at: string | null;
  delivered_at: string | null;
  bounced_at: string | null;
  error_message: string | null;
  retry_count: number;
  created_at: string;
}

interface Statistics {
  summary: {
    total_emails: number;
    sent_count: number;
    delivered_count: number;
    bounced_count: number;
    failed_count: number;
    pending_count: number;
    success_rate: number;
    avg_retry_count: number;
  };
  status_breakdown: Record<string, number>;
  provider_breakdown: Record<string, { total: number; sent: number; failed: number }>;
}

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: '#7a7a7a', icon: Clock },
  sent: { label: 'Sent', color: '#00ff88', icon: Mail },
  delivered: { label: 'Delivered', color: '#00ff88', icon: CheckCircle },
  bounced: { label: 'Bounced', color: '#ff9900', icon: AlertCircle },
  failed: { label: 'Failed', color: '#ff4444', icon: XCircle },
};

export function SendLogsSection() {
  const [logs, setLogs] = useState<SendLog[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 20;

  useEffect(() => {
    fetchLogs();
  }, [filterStatus, currentPage]);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = '/api/email-automations/send-logs';
      const params = new URLSearchParams();

      params.append('limit', limit.toString());
      params.append('offset', (currentPage * limit).toString());

      if (filterStatus) params.append('status', filterStatus);

      url += `?${params}`;

      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        setLogs(result.data);
        setTotalCount(result.count || 0);
      } else {
        setError(result.error || 'Failed to load send logs');
      }
    } catch (err) {
      setError('Network error loading send logs');
      console.error('Error fetching send logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      setStatsLoading(true);

      const response = await fetch('/api/email-automations/send-logs/statistics');
      const result = await response.json();

      if (result.success) {
        setStatistics(result.data);
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      {!statsLoading && statistics?.summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div
            className="p-4 rounded-lg border"
            style={{
              background: 'rgba(64, 64, 64, 0.5)',
              borderColor: 'rgba(255, 215, 0, 0.2)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#dcdbd5]">Total Emails</span>
              <Mail className="w-4 h-4 text-[#ffd700]" />
            </div>
            <div className="text-2xl font-bold text-[#ffd700]">
              {(statistics.summary.total_emails || 0).toLocaleString()}
            </div>
          </div>

          <div
            className="p-4 rounded-lg border"
            style={{
              background: 'rgba(64, 64, 64, 0.5)',
              borderColor: 'rgba(0, 255, 136, 0.2)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#dcdbd5]">Delivered</span>
              <CheckCircle className="w-4 h-4 text-[#00ff88]" />
            </div>
            <div className="text-2xl font-bold text-[#00ff88]">
              {(statistics.summary.delivered_count || 0).toLocaleString()}
            </div>
          </div>

          <div
            className="p-4 rounded-lg border"
            style={{
              background: 'rgba(64, 64, 64, 0.5)',
              borderColor: 'rgba(255, 68, 68, 0.2)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#dcdbd5]">Failed/Bounced</span>
              <XCircle className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-2xl font-bold text-red-400">
              {((statistics.summary.failed_count || 0) + (statistics.summary.bounced_count || 0)).toLocaleString()}
            </div>
          </div>

          <div
            className="p-4 rounded-lg border"
            style={{
              background: 'rgba(64, 64, 64, 0.5)',
              borderColor: 'rgba(255, 215, 0, 0.2)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#dcdbd5]">Success Rate</span>
              <TrendingUp className="w-4 h-4 text-[#ffd700]" />
            </div>
            <div className="text-2xl font-bold text-[#ffd700]">
              {(statistics.summary.success_rate || 0).toFixed(1)}%
            </div>
          </div>
        </div>
      )}

      {/* Header & Filters */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-lg font-semibold text-[#e5e4dd]">Send Logs</h3>
          <p className="text-sm text-[#dcdbd5]">
            {totalCount.toLocaleString()} {totalCount === 1 ? 'log' : 'logs'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(0); // Reset to first page
            }}
            className="px-3 py-2 bg-[rgba(64,64,64,0.5)] border border-[rgba(255,255,255,0.1)] rounded-lg text-[#e5e4dd] text-sm"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="sent">Sent</option>
            <option value="delivered">Delivered</option>
            <option value="bounced">Bounced</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00ff88]"></div>
        </div>
      ) : error ? (
        <div className="p-6 rounded-lg border border-red-500/20 bg-red-500/5">
          <p className="text-red-400">Error: {error}</p>
          <button
            onClick={fetchLogs}
            className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded transition-colors"
          >
            Retry
          </button>
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-[#404040] rounded-lg">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 text-[#404040]" />
          <p className="text-[#dcdbd5]">No send logs found</p>
          <p className="text-sm text-[#7a7a7a] mt-2">
            {filterStatus ? 'No logs with this status' : 'Logs will appear here after emails are sent'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#404040]">
                <th className="text-left py-3 px-4 text-sm font-medium text-[#dcdbd5]">Recipient</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#dcdbd5]">Subject</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#dcdbd5]">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#dcdbd5]">Provider</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#dcdbd5]">Sent At</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#dcdbd5]">Retries</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const statusConfig = STATUS_CONFIG[log.status];
                const StatusIcon = statusConfig.icon;

                return (
                  <tr key={log.id} className="border-b border-[#404040]/50 hover:bg-[rgba(255,255,255,0.02)]">
                    <td className="py-3 px-4">
                      <div>
                        <div className="text-sm text-[#e5e4dd]">
                          {log.recipient_name || 'Unknown'}
                        </div>
                        <div className="text-xs text-[#7a7a7a]">{log.recipient_email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-[#dcdbd5] max-w-xs truncate" title={log.subject_line}>
                        {log.subject_line}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          background: `rgba(${
                            statusConfig.color === '#00ff88' ? '0, 255, 136' :
                            statusConfig.color === '#ff4444' ? '255, 68, 68' :
                            statusConfig.color === '#ff9900' ? '255, 153, 0' :
                            '122, 122, 122'
                          }, 0.1)`,
                          color: statusConfig.color,
                        }}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig.label}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-[#dcdbd5]">
                      {log.email_provider || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-sm text-[#7a7a7a]">
                      {formatDate(log.sent_at)}
                    </td>
                    <td className="py-3 px-4 text-sm text-[#7a7a7a]">
                      {log.retry_count > 0 ? (
                        <span className="text-[#ff9900]">{log.retry_count}</span>
                      ) : (
                        '0'
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-[#404040]">
          <div className="text-sm text-[#7a7a7a]">
            Page {currentPage + 1} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="px-3 py-1.5 text-sm bg-[rgba(64,64,64,0.5)] hover:bg-[rgba(64,64,64,0.8)] disabled:opacity-30 disabled:cursor-not-allowed border border-[rgba(255,255,255,0.1)] rounded transition-colors text-[#dcdbd5]"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage >= totalPages - 1}
              className="px-3 py-1.5 text-sm bg-[rgba(64,64,64,0.5)] hover:bg-[rgba(64,64,64,0.8)] disabled:opacity-30 disabled:cursor-not-allowed border border-[rgba(255,255,255,0.1)] rounded transition-colors text-[#dcdbd5]"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
