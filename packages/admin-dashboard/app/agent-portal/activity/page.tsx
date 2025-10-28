'use client';

/**
 * Activity Log Page
 * Phase 3: Activity Log UI
 *
 * /agent-portal/activity - Activity log viewer
 *
 * STATIC EXPORT: This route is excluded from static export
 * Requires authentication and dynamic activity data
 */

/**
 * Route segment config for static export
 * Conditional dynamic export - allows static export to skip this page
 * VPS deployment: force-dynamic (requires auth and dynamic data)
 * Cloudflare Pages: undefined (page excluded from build)
 */
export const dynamic = 'error';

import { useState, useEffect } from 'react';
import { ActivityLogTable } from '@/components/activity/ActivityLogTable';
import { ActivityLogFilters } from '@/components/activity/ActivityLogFilters';
import { ExportButton } from '@/components/activity/ExportButton';
import { fetchAuditLogs } from '@/lib/api/audit-logs';
import type { AuditLog, AuditLogFilters } from '@/lib/api/audit-logs';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

export default function ActivityLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AuditLogFilters>({
    limit: 50,
    offset: 0,
  });
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const response = await fetchAuditLogs(filters);
      setLogs(response.logs);
      setTotal(response.total);
      setCurrentPage(response.page);
      setHasMore(response.hasMore);
    } catch (error) {
      console.error('Failed to load audit logs:', error);
      alert('Failed to load activity logs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [filters.offset]); // Reload when pagination changes

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadLogs();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, filters]);

  const handleSearch = () => {
    setFilters({ ...filters, offset: 0 });
    loadLogs();
  };

  const handleReset = () => {
    setFilters({ limit: 50, offset: 0 });
    loadLogs();
  };

  const handleNextPage = () => {
    if (hasMore) {
      setFilters({ ...filters, offset: (filters.offset || 0) + (filters.limit || 50) });
    }
  };

  const handlePreviousPage = () => {
    if ((filters.offset || 0) > 0) {
      setFilters({
        ...filters,
        offset: Math.max(0, (filters.offset || 0) - (filters.limit || 50)),
      });
    }
  };

  const totalPages = Math.ceil(total / (filters.limit || 50));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#e5e4dd] mb-2">Activity Log</h1>
        <p className="text-[#dcdbd5]/70">
          View and analyze system audit logs and user activities
        </p>
      </div>

      {/* Filters */}
      <ActivityLogFilters
        filters={filters}
        onFilterChange={setFilters}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {/* Controls Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={loadLogs}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#404040] text-[#dcdbd5] hover:bg-[#404040]/30 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <label className="inline-flex items-center gap-2 text-[#dcdbd5] cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-4 h-4 rounded border-[#404040] bg-[#2a2a2a] text-[#ffd700] focus:ring-[#ffd700]"
            />
            <span className="text-sm">Auto-refresh (30s)</span>
          </label>

          <div className="text-sm text-[#dcdbd5]/70">
            Total: <span className="font-semibold text-[#e5e4dd]">{total}</span> logs
          </div>
        </div>

        <ExportButton logs={logs} disabled={loading} />
      </div>

      {/* Table */}
      <div
        className="rounded-xl border border-[#404040]/50 overflow-hidden"
        style={{
          background: 'rgba(42, 42, 42, 0.4)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <ActivityLogTable logs={logs} loading={loading} />
      </div>

      {/* Pagination */}
      {total > (filters.limit || 50) && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-[#dcdbd5]/70">
            Page {currentPage} of {totalPages}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#404040] text-[#dcdbd5] hover:bg-[#404040]/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={!hasMore}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#404040] text-[#dcdbd5] hover:bg-[#404040]/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="text-sm text-[#dcdbd5]/70">
            Showing {(filters.offset || 0) + 1} -{' '}
            {Math.min((filters.offset || 0) + (filters.limit || 50), total)} of {total}
          </div>
        </div>
      )}
    </div>
  );
}
