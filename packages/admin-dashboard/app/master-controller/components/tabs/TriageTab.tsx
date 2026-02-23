'use client';

import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, Search, RefreshCw, ExternalLink, Trash2, X, ArrowUpDown, ChevronLeft, ChevronRight, Eye, EyeOff, ArrowRight } from 'lucide-react';

interface Path404 {
  id: number;
  path: string;
  hit_count: number;
  first_seen_at: string;
  last_seen_at: string;
  last_referrer: string | null;
  last_user_agent: string | null;
  status: 'unreviewed' | 'redirect' | 'junk';
  redirect_target: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  notes: string | null;
}

interface Stats {
  unreviewed: number;
  total: number;
  resolvedToday: number;
  activeRedirects: number;
}

const STATUS_COLORS: Record<string, string> = {
  unreviewed: 'bg-[#ffd700]/10 text-[#ffd700]',
  redirect: 'bg-[#00ff88]/10 text-[#00ff88]',
  junk: 'bg-red-500/10 text-red-400',
};

export function TriageTab() {
  const [paths, setPaths] = useState<Path404[]>([]);
  const [stats, setStats] = useState<Stats>({ unreviewed: 0, total: 0, resolvedToday: 0, activeRedirects: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('unreviewed');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('last_seen_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 25;

  // Selection
  const [selected, setSelected] = useState<Set<number>>(new Set());

  // Redirect modal
  const [redirectModal, setRedirectModal] = useState<Path404 | null>(null);
  const [redirectTarget, setRedirectTarget] = useState('');
  const [deploying, setDeploying] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/404-paths/stats');
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch {
      // Stats are non-critical
    }
  }, []);

  const fetchPaths = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        status: statusFilter,
        search: searchQuery,
        sortBy,
        sortDir,
      });

      const res = await fetch(`/api/404-paths?${params}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to fetch');

      setPaths(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotal(data.pagination?.total || 0);
      setSelected(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load 404 paths');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, searchQuery, sortBy, sortDir]);

  useEffect(() => {
    fetchPaths();
    fetchStats();
  }, [fetchPaths, fetchStats]);

  const handleRefresh = () => {
    fetchPaths();
    fetchStats();
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDir('desc');
    }
    setPage(1);
  };

  const handleStatusChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const updatePathStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/404-paths/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update');
      fetchPaths();
      fetchStats();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update path');
    }
  };

  const handleBulkAction = async (status: string) => {
    if (selected.size === 0) return;

    try {
      await Promise.all(
        Array.from(selected).map(id =>
          fetch(`/api/404-paths/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
          })
        )
      );
      fetchPaths();
      fetchStats();
    } catch {
      alert('Some updates failed');
    }
  };

  const handleDeployRedirect = async () => {
    if (!redirectModal || !redirectTarget.trim()) return;

    setDeploying(true);
    try {
      const res = await fetch('/api/404-paths/deploy-redirect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: redirectModal.id,
          path: redirectModal.path,
          target: redirectTarget.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Deploy failed');

      setRedirectModal(null);
      setRedirectTarget('');
      fetchPaths();
      fetchStats();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to deploy redirect');
    } finally {
      setDeploying(false);
    }
  };

  const toggleSelect = (id: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === paths.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paths.map(p => p.id)));
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const truncate = (str: string, max: number) =>
    str.length > max ? str.slice(0, max) + '...' : str;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#ffd700]">404 Watch</h1>
          <p className="text-[#dcdbd5] mt-2">
            Triage 404 errors, deploy redirects to the edge instantly
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#404040]/30 border border-[#404040] text-[#dcdbd5] rounded-lg hover:border-[#ffd700]/30 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#404040]/30 border border-[#404040] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-[#ffd700]" />
            <span className="text-sm text-[#dcdbd5]">Unreviewed</span>
          </div>
          <p className="text-2xl font-bold text-[#ffd700]">{stats.unreviewed}</p>
        </div>
        <div className="bg-[#404040]/30 border border-[#404040] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="w-4 h-4 text-[#e5e4dd]" />
            <span className="text-sm text-[#dcdbd5]">Total Paths</span>
          </div>
          <p className="text-2xl font-bold text-[#e5e4dd]">{stats.total}</p>
        </div>
        <div className="bg-[#404040]/30 border border-[#404040] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <ArrowRight className="w-4 h-4 text-[#00ff88]" />
            <span className="text-sm text-[#dcdbd5]">Resolved Today</span>
          </div>
          <p className="text-2xl font-bold text-[#00ff88]">{stats.resolvedToday}</p>
        </div>
        <div className="bg-[#404040]/30 border border-[#404040] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <ExternalLink className="w-4 h-4 text-[#00ff88]" />
            <span className="text-sm text-[#dcdbd5]">Active Redirects</span>
          </div>
          <p className="text-2xl font-bold text-[#00ff88]">{stats.activeRedirects}</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="px-3 py-2 bg-[#2a2a2a] border border-[#404040] rounded-lg text-[#e5e4dd] focus:border-[#ffd700] focus:outline-none"
          style={{ colorScheme: 'dark' }}
        >
          <option value="all" className="bg-[#2a2a2a] text-[#e5e4dd]">All Statuses</option>
          <option value="unreviewed" className="bg-[#2a2a2a] text-[#e5e4dd]">Unreviewed</option>
          <option value="redirect" className="bg-[#2a2a2a] text-[#e5e4dd]">Redirect</option>
          <option value="junk" className="bg-[#2a2a2a] text-[#e5e4dd]">Junk</option>
        </select>

        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#dcdbd5]/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search paths..."
            className="w-full pl-10 pr-4 py-2 bg-[#404040]/30 border border-[#404040] rounded-lg text-[#dcdbd5] placeholder-[#dcdbd5]/40 focus:border-[#ffd700] focus:outline-none"
          />
        </div>
      </div>

      {/* Bulk Actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 p-3 bg-[#ffd700]/5 border border-[#ffd700]/20 rounded-lg">
          <span className="text-sm text-[#ffd700] font-medium">{selected.size} selected</span>
          <button
            onClick={() => handleBulkAction('junk')}
            className="px-3 py-1.5 text-sm bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-colors"
          >
            Mark Junk
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="ml-auto text-sm text-[#dcdbd5]/60 hover:text-[#dcdbd5] transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
          <AlertTriangle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#404040]/30 border border-[#404040] rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ffd700]"></div>
          </div>
        ) : paths.length === 0 ? (
          <div className="text-center py-12">
            <EyeOff className="w-12 h-12 text-[#dcdbd5]/30 mx-auto mb-4" />
            <p className="text-[#dcdbd5]/60">No 404 paths found</p>
            <p className="text-sm text-[#dcdbd5]/40 mt-1">
              {statusFilter !== 'all' ? 'Try changing the status filter' : 'Paths will appear here as 404 errors are logged'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#404040]">
                  <th className="py-3 px-4 text-left w-10">
                    <input
                      type="checkbox"
                      checked={selected.size === paths.length && paths.length > 0}
                      onChange={toggleSelectAll}
                      className="accent-[#ffd700]"
                    />
                  </th>
                  <th className="py-3 px-4 text-left">
                    <button onClick={() => handleSort('path')} className="flex items-center gap-1 text-sm font-medium text-[#dcdbd5]/60 hover:text-[#dcdbd5]">
                      Path <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-3 px-4 text-right">
                    <button onClick={() => handleSort('hit_count')} className="flex items-center gap-1 text-sm font-medium text-[#dcdbd5]/60 hover:text-[#dcdbd5] ml-auto">
                      Hits <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-3 px-4 text-left">
                    <button onClick={() => handleSort('last_seen_at')} className="flex items-center gap-1 text-sm font-medium text-[#dcdbd5]/60 hover:text-[#dcdbd5]">
                      Last Seen <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-[#dcdbd5]/60 hidden lg:table-cell">Referrer</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-[#dcdbd5]/60">Status</th>
                  <th className="py-3 px-4 text-right text-sm font-medium text-[#dcdbd5]/60">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paths.map((item) => (
                  <tr key={item.id} className="border-b border-[#404040]/50 hover:bg-[#191818]/30">
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selected.has(item.id)}
                        onChange={() => toggleSelect(item.id)}
                        className="accent-[#ffd700]"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[#dcdbd5] font-mono text-sm" title={item.path}>
                        {truncate(item.path, 50)}
                      </span>
                      {item.redirect_target && (
                        <span className="block text-xs text-[#00ff88]/60 mt-0.5">
                          → {item.redirect_target}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-[#ffd700] font-bold">{item.hit_count}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-[#dcdbd5]/80">{formatTimeAgo(item.last_seen_at)}</span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <span className="text-sm text-[#dcdbd5]/60" title={item.last_referrer || ''}>
                        {item.last_referrer ? truncate(item.last_referrer, 30) : '-'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize ${STATUS_COLORS[item.status] || ''}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setRedirectModal(item);
                            setRedirectTarget(item.redirect_target || '');
                          }}
                          className="px-2.5 py-1.5 text-xs text-[#00ff88] hover:bg-[#00ff88]/10 rounded transition-colors"
                          title="Set redirect"
                        >
                          Redirect
                        </button>
                        {item.status !== 'junk' && (
                          <button
                            onClick={() => updatePathStatus(item.id, 'junk')}
                            className="px-2.5 py-1.5 text-xs text-red-400 hover:bg-red-500/10 rounded transition-colors"
                            title="Mark as junk"
                          >
                            Junk
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && paths.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#404040]">
            <span className="text-sm text-[#dcdbd5]/60">
              Showing {((page - 1) * limit) + 1}-{Math.min(page * limit, total)} of {total}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 text-[#dcdbd5] hover:bg-[#404040]/30 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-[#dcdbd5]">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 text-[#dcdbd5] hover:bg-[#404040]/30 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Redirect Modal */}
      {redirectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#191818] border border-[#404040] rounded-lg p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#ffd700]">Deploy Redirect</h2>
              <button
                onClick={() => { setRedirectModal(null); setRedirectTarget(''); }}
                className="text-[#dcdbd5]/60 hover:text-[#dcdbd5] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#dcdbd5] mb-2">From Path</label>
                <div className="px-4 py-2 bg-[#404040]/30 border border-[#404040] rounded-lg text-[#dcdbd5] font-mono text-sm">
                  {redirectModal.path}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#dcdbd5] mb-2">Redirect To</label>
                <input
                  type="text"
                  value={redirectTarget}
                  onChange={(e) => setRedirectTarget(e.target.value)}
                  placeholder="/new-path or https://example.com/page"
                  className="w-full px-4 py-2 bg-[#404040]/30 border border-[#404040] rounded-lg text-[#dcdbd5] placeholder-[#dcdbd5]/40 focus:border-[#ffd700] focus:outline-none"
                  disabled={deploying}
                  autoFocus
                />
              </div>

              <div className="p-3 bg-[#00ff88]/5 border border-[#00ff88]/20 rounded-lg">
                <p className="text-xs text-[#00ff88]/80">
                  This deploys a 301 redirect to Cloudflare KV. It takes effect at all edge locations within ~60 seconds. No site deploy needed.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setRedirectModal(null); setRedirectTarget(''); }}
                  className="flex-1 px-4 py-2 bg-[#404040]/30 border border-[#404040] text-[#dcdbd5] rounded-lg hover:border-[#dcdbd5]/30 transition-colors"
                  disabled={deploying}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeployRedirect}
                  disabled={deploying || !redirectTarget.trim()}
                  className="flex-1 px-4 py-2 bg-[#00ff88] text-[#191818] font-semibold rounded-lg hover:bg-[#ffd700] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deploying ? 'Deploying...' : 'Deploy Redirect to Edge'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
