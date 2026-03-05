'use client';

import { useState, useEffect, useCallback, useRef, Fragment } from 'react';
import {
  AlertTriangle, RefreshCw, ChevronLeft, ChevronRight,
  ChevronDown, ChevronUp, CheckCircle2, Eye, Filter,
  AlertOctagon, AlertCircle, Info,
} from 'lucide-react';

interface PlatformError {
  id: number;
  created_at: string;
  source: string;
  severity: 'warning' | 'error' | 'critical';
  error_code: string | null;
  error_message: string;
  stack_trace: string | null;
  user_id: string | null;
  request_path: string | null;
  request_method: string | null;
  user_agent: string | null;
  metadata: Record<string, unknown>;
  status: 'new' | 'reviewed' | 'resolved';
  reviewed_by: string | null;
  resolved_at: string | null;
}

interface Summary {
  errors_24h: number;
  critical_24h: number;
  unreviewed: number;
}

const SEVERITY_CONFIG = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', icon: AlertOctagon, label: 'Critical' },
  error: { color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30', icon: AlertCircle, label: 'Error' },
  warning: { color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30', icon: Info, label: 'Warning' },
};

const STATUS_CONFIG = {
  new: { color: 'text-[#ffd700]', bg: 'bg-[#ffd700]/10' },
  reviewed: { color: 'text-[#3b82f6]', bg: 'bg-[#3b82f6]/10' },
  resolved: { color: 'text-[#00ff88]', bg: 'bg-[#00ff88]/10' },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function ErrorLogTab() {
  const [errors, setErrors] = useState<PlatformError[]>([]);
  const [summary, setSummary] = useState<Summary>({ errors_24h: 0, critical_24h: 0, unreviewed: 0 });
  const [sources, setSources] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 50;

  // Filters
  const [severityFilter, setSeverityFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Expanded rows
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Auto-refresh
  const [autoRefresh, setAutoRefresh] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchErrors = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (severityFilter) params.set('severity', severityFilter);
      if (sourceFilter) params.set('source', sourceFilter);
      if (statusFilter) params.set('status', statusFilter);

      const res = await fetch(`/api/errors?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();

      setErrors(data.errors || []);
      setTotal(data.total || 0);
      setSummary(data.summary || { errors_24h: 0, critical_24h: 0, unreviewed: 0 });
      setSources(data.sources || []);
    } catch (err) {
      console.error('Failed to fetch errors:', err);
    } finally {
      setLoading(false);
    }
  }, [page, severityFilter, sourceFilter, statusFilter]);

  useEffect(() => {
    fetchErrors();
  }, [fetchErrors]);

  // Auto-refresh every 30s
  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(fetchErrors, 30000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoRefresh, fetchErrors]);

  const updateStatus = async (ids: number[], newStatus: 'reviewed' | 'resolved') => {
    try {
      const res = await fetch('/api/errors', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, status: newStatus }),
      });
      if (res.ok) {
        fetchErrors();
      }
    } catch (err) {
      console.error('Failed to update:', err);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border border-[#404040] p-4" style={{ background: 'rgba(64, 64, 64, 0.2)' }}>
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-[#dcdbd5]/60">Errors (24h)</span>
          </div>
          <p className="text-2xl font-bold text-[#e5e4dd]">{summary.errors_24h}</p>
        </div>
        <div className="rounded-lg border border-[#404040] p-4" style={{ background: 'rgba(64, 64, 64, 0.2)' }}>
          <div className="flex items-center gap-2 mb-1">
            <AlertOctagon className="w-4 h-4 text-red-400" />
            <span className="text-sm text-[#dcdbd5]/60">Critical (24h)</span>
          </div>
          <p className="text-2xl font-bold text-[#e5e4dd]">{summary.critical_24h}</p>
        </div>
        <div className="rounded-lg border border-[#404040] p-4" style={{ background: 'rgba(64, 64, 64, 0.2)' }}>
          <div className="flex items-center gap-2 mb-1">
            <Eye className="w-4 h-4 text-[#ffd700]" />
            <span className="text-sm text-[#dcdbd5]/60">Unreviewed</span>
          </div>
          <p className="text-2xl font-bold text-[#e5e4dd]">{summary.unreviewed}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#dcdbd5]/40" />
          <select
            value={severityFilter}
            onChange={e => { setSeverityFilter(e.target.value); setPage(1); }}
            className="bg-[#1a1a1a] border border-[#404040] rounded px-2 py-1.5 text-sm text-[#dcdbd5]"
          >
            <option value="">All Severity</option>
            <option value="critical">Critical</option>
            <option value="error">Error</option>
            <option value="warning">Warning</option>
          </select>
          <select
            value={sourceFilter}
            onChange={e => { setSourceFilter(e.target.value); setPage(1); }}
            className="bg-[#1a1a1a] border border-[#404040] rounded px-2 py-1.5 text-sm text-[#dcdbd5]"
          >
            <option value="">All Sources</option>
            {sources.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="bg-[#1a1a1a] border border-[#404040] rounded px-2 py-1.5 text-sm text-[#dcdbd5]"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="reviewed">Reviewed</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-[#dcdbd5]/60 cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={e => setAutoRefresh(e.target.checked)}
              className="accent-[#ffd700]"
            />
            Auto-refresh
          </label>
          <button
            onClick={fetchErrors}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#404040] text-sm text-[#dcdbd5] hover:bg-[#404040]/30 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-[#404040] overflow-hidden" style={{ background: 'rgba(64, 64, 64, 0.1)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#404040] text-[#dcdbd5]/60 text-left">
              <th className="px-4 py-3 font-medium w-36">Time</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium w-24">Severity</th>
              <th className="px-4 py-3 font-medium">Message</th>
              <th className="px-4 py-3 font-medium w-24">Status</th>
              <th className="px-4 py-3 font-medium w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && errors.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[#dcdbd5]/40">
                  Loading errors...
                </td>
              </tr>
            ) : errors.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[#dcdbd5]/40">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-[#00ff88]/50" />
                  No errors found
                </td>
              </tr>
            ) : (
              errors.map(err => {
                const sev = SEVERITY_CONFIG[err.severity];
                const stat = STATUS_CONFIG[err.status];
                const isExpanded = expandedId === err.id;

                return (
                  <Fragment key={err.id}>
                    <tr
                      className="border-b border-[#404040]/50 hover:bg-[#404040]/20 cursor-pointer transition-colors"
                      onClick={() => setExpandedId(isExpanded ? null : err.id)}
                    >
                      <td className="px-4 py-3 text-[#dcdbd5]/60 whitespace-nowrap">
                        <span title={new Date(err.created_at).toLocaleString()}>
                          {timeAgo(err.created_at)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#dcdbd5] font-mono text-xs">
                        {err.source}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border ${sev.bg}`}>
                          <sev.icon className={`w-3 h-3 ${sev.color}`} />
                          <span className={sev.color}>{sev.label}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#dcdbd5] max-w-xs truncate" title={err.error_message}>
                        {err.error_code && (
                          <span className="text-[#ffd700] font-mono text-xs mr-2">{err.error_code}</span>
                        )}
                        {err.error_message.slice(0, 120)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs capitalize ${stat.bg} ${stat.color}`}>
                          {err.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                          {err.status === 'new' && (
                            <button
                              onClick={() => updateStatus([err.id], 'reviewed')}
                              title="Mark reviewed"
                              className="p-1 rounded hover:bg-[#404040]/50 text-[#dcdbd5]/60 hover:text-[#3b82f6] transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          {err.status !== 'resolved' && (
                            <button
                              onClick={() => updateStatus([err.id], 'resolved')}
                              title="Mark resolved"
                              className="p-1 rounded hover:bg-[#404040]/50 text-[#dcdbd5]/60 hover:text-[#00ff88] transition-colors"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : err.id)}
                            className="p-1 rounded hover:bg-[#404040]/50 text-[#dcdbd5]/60 transition-colors"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="border-b border-[#404040]/50">
                        <td colSpan={6} className="px-4 py-4 bg-[#0a0a0a]/50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-[#dcdbd5]/40 text-xs mb-1">Full Message</p>
                              <p className="text-[#dcdbd5] whitespace-pre-wrap break-all">{err.error_message}</p>
                            </div>
                            <div className="space-y-3">
                              {err.request_path && (
                                <div>
                                  <p className="text-[#dcdbd5]/40 text-xs mb-1">Request</p>
                                  <p className="text-[#dcdbd5] font-mono text-xs">{err.request_method} {err.request_path}</p>
                                </div>
                              )}
                              {err.user_id && (
                                <div>
                                  <p className="text-[#dcdbd5]/40 text-xs mb-1">User ID</p>
                                  <p className="text-[#dcdbd5] font-mono text-xs">{err.user_id}</p>
                                </div>
                              )}
                              {err.user_agent && (
                                <div>
                                  <p className="text-[#dcdbd5]/40 text-xs mb-1">User Agent</p>
                                  <p className="text-[#dcdbd5]/60 text-xs truncate" title={err.user_agent}>{err.user_agent}</p>
                                </div>
                              )}
                              {err.reviewed_by && (
                                <div>
                                  <p className="text-[#dcdbd5]/40 text-xs mb-1">Reviewed by</p>
                                  <p className="text-[#dcdbd5] text-xs">{err.reviewed_by}</p>
                                </div>
                              )}
                              {err.resolved_at && (
                                <div>
                                  <p className="text-[#dcdbd5]/40 text-xs mb-1">Resolved at</p>
                                  <p className="text-[#dcdbd5] text-xs">{new Date(err.resolved_at).toLocaleString()}</p>
                                </div>
                              )}
                              <div>
                                <p className="text-[#dcdbd5]/40 text-xs mb-1">Timestamp</p>
                                <p className="text-[#dcdbd5] text-xs">{new Date(err.created_at).toLocaleString()}</p>
                              </div>
                            </div>
                            {err.stack_trace && (
                              <div className="md:col-span-2">
                                <p className="text-[#dcdbd5]/40 text-xs mb-1">Stack Trace</p>
                                <pre className="text-[#dcdbd5]/70 text-xs bg-[#1a1a1a] rounded p-3 overflow-x-auto max-h-48 whitespace-pre-wrap break-all">
                                  {err.stack_trace}
                                </pre>
                              </div>
                            )}
                            {err.metadata && Object.keys(err.metadata).length > 0 && (
                              <div className="md:col-span-2">
                                <p className="text-[#dcdbd5]/40 text-xs mb-1">Metadata</p>
                                <pre className="text-[#dcdbd5]/70 text-xs bg-[#1a1a1a] rounded p-3 overflow-x-auto">
                                  {JSON.stringify(err.metadata, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-[#dcdbd5]/60">
          <span>
            {total} error{total !== 1 ? 's' : ''} total - page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded border border-[#404040] hover:bg-[#404040]/30 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded border border-[#404040] hover:bg-[#404040]/30 disabled:opacity-30 transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

