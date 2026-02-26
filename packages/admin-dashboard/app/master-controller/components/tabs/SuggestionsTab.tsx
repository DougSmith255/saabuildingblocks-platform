'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Lightbulb, RefreshCw, Search, ChevronLeft, ChevronRight,
  AlertTriangle, CheckCircle2, Eye, X, MessageSquare, Trash2,
} from 'lucide-react';

interface Suggestion {
  id: string;
  user_id: string;
  username: string;
  category: string;
  suggestion: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

interface Stats {
  total: number;
  new: number;
  reviewed: number;
  implemented: number;
  dismissed: number;
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-[#ffd700]/10 text-[#ffd700]',
  reviewed: 'bg-[#3b82f6]/10 text-[#3b82f6]',
  implemented: 'bg-[#00ff88]/10 text-[#00ff88]',
  dismissed: 'bg-red-500/10 text-red-400',
};

const CATEGORY_LABELS: Record<string, string> = {
  'portal-features': 'Portal Features',
  'training': 'Training',
  'templates': 'Templates',
  'general': 'General',
};

export function SuggestionsTab() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, new: 0, reviewed: 0, implemented: 0, dismissed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState('new');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 25;

  // Detail modal
  const [detailModal, setDetailModal] = useState<Suggestion | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/suggestions/stats');
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch {
      // Stats are non-critical
    }
  }, []);

  const fetchSuggestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        status: statusFilter,
        category: categoryFilter,
        search: searchQuery,
        sortBy,
        sortDir,
      });

      const res = await fetch(`/api/suggestions?${params}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to fetch');

      setSuggestions(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotal(data.pagination?.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load suggestions');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, categoryFilter, searchQuery, sortBy, sortDir]);

  useEffect(() => {
    fetchSuggestions();
    fetchStats();
  }, [fetchSuggestions, fetchStats]);

  const handleRefresh = () => {
    fetchSuggestions();
    fetchStats();
  };

  const handleStatusChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setPage(1);
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategoryFilter(newCategory);
    setPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/suggestions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update');
      fetchSuggestions();
      fetchStats();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update suggestion');
    }
  };

  const saveNotes = async () => {
    if (!detailModal) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/suggestions/${detailModal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_notes: adminNotes }),
      });
      if (!res.ok) throw new Error('Failed to save notes');
      setDetailModal({ ...detailModal, admin_notes: adminNotes });
      fetchSuggestions();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save notes');
    } finally {
      setSaving(false);
    }
  };

  const deleteSuggestion = async (id: string) => {
    try {
      const res = await fetch(`/api/suggestions/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setDeleteConfirm(null);
      if (detailModal?.id === id) setDetailModal(null);
      fetchSuggestions();
      fetchStats();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete suggestion');
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
    if (days < 30) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#ffd700]">Agent Suggestions</h1>
          <p className="text-[#dcdbd5] mt-2">Review and manage suggestions from your agents</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-[#404040]/30 border border-[#404040] text-[#dcdbd5] rounded-lg hover:border-[#ffd700]/30 hover:text-[#ffd700] transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-[#404040]/30 border border-[#404040] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb className="w-4 h-4 text-[#ffd700]" />
            <span className="text-sm text-[#dcdbd5]">New</span>
          </div>
          <p className="text-2xl font-bold text-[#ffd700]">{stats.new}</p>
        </div>
        <div className="bg-[#404040]/30 border border-[#404040] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="w-4 h-4 text-[#3b82f6]" />
            <span className="text-sm text-[#dcdbd5]">Reviewed</span>
          </div>
          <p className="text-2xl font-bold text-[#3b82f6]">{stats.reviewed}</p>
        </div>
        <div className="bg-[#404040]/30 border border-[#404040] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 text-[#00ff88]" />
            <span className="text-sm text-[#dcdbd5]">Implemented</span>
          </div>
          <p className="text-2xl font-bold text-[#00ff88]">{stats.implemented}</p>
        </div>
        <div className="bg-[#404040]/30 border border-[#404040] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <X className="w-4 h-4 text-red-400" />
            <span className="text-sm text-[#dcdbd5]">Dismissed</span>
          </div>
          <p className="text-2xl font-bold text-red-400">{stats.dismissed}</p>
        </div>
        <div className="bg-[#404040]/30 border border-[#404040] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-4 h-4 text-[#dcdbd5]" />
            <span className="text-sm text-[#dcdbd5]">Total</span>
          </div>
          <p className="text-2xl font-bold text-[#dcdbd5]">{stats.total}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="px-3 py-2 bg-[#404040]/30 border border-[#404040] rounded-lg text-[#dcdbd5] text-sm focus:border-[#ffd700] focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="new">New</option>
          <option value="reviewed">Reviewed</option>
          <option value="implemented">Implemented</option>
          <option value="dismissed">Dismissed</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="px-3 py-2 bg-[#404040]/30 border border-[#404040] rounded-lg text-[#dcdbd5] text-sm focus:border-[#ffd700] focus:outline-none"
        >
          <option value="all">All Categories</option>
          <option value="portal-features">Portal Features</option>
          <option value="training">Training</option>
          <option value="templates">Templates</option>
          <option value="general">General</option>
        </select>

        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#dcdbd5]/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search suggestions..."
            className="w-full pl-10 pr-4 py-2 bg-[#404040]/30 border border-[#404040] rounded-lg text-[#dcdbd5] text-sm placeholder-[#dcdbd5]/40 focus:border-[#ffd700] focus:outline-none"
          />
        </div>
      </div>

      {/* Error */}
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
        ) : suggestions.length === 0 ? (
          <div className="text-center py-12">
            <Lightbulb className="w-12 h-12 text-[#dcdbd5]/30 mx-auto mb-4" />
            <p className="text-[#dcdbd5]/60">No suggestions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#404040]">
                  <th className="py-3 px-4 text-left text-sm font-medium text-[#dcdbd5]/60">Agent</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-[#dcdbd5]/60">Category</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-[#dcdbd5]/60">Suggestion</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-[#dcdbd5]/60">Status</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-[#dcdbd5]/60">Submitted</th>
                  <th className="py-3 px-4 text-right text-sm font-medium text-[#dcdbd5]/60">Actions</th>
                </tr>
              </thead>
              <tbody>
                {suggestions.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-[#404040]/50 hover:bg-[#191818]/30 cursor-pointer"
                    onClick={() => { setDetailModal(item); setAdminNotes(item.admin_notes || ''); }}
                  >
                    <td className="py-3 px-4">
                      <span className="text-[#dcdbd5] text-sm font-medium">{item.username}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[#dcdbd5]/70 text-sm">{CATEGORY_LABELS[item.category] || item.category}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[#dcdbd5] text-sm">
                        {item.suggestion.length > 80 ? item.suggestion.slice(0, 80) + '...' : item.suggestion}
                      </span>
                      {item.admin_notes && (
                        <span className="block text-xs text-[#ffd700]/50 mt-0.5">Has admin notes</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize ${STATUS_COLORS[item.status] || ''}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[#dcdbd5]/60 text-sm" title={new Date(item.created_at).toLocaleString()}>
                        {formatTimeAgo(item.created_at)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        {item.status === 'new' && (
                          <button
                            onClick={() => updateStatus(item.id, 'reviewed')}
                            className="px-2.5 py-1.5 text-xs text-[#3b82f6] hover:bg-[#3b82f6]/10 rounded transition-colors"
                          >
                            Review
                          </button>
                        )}
                        {(item.status === 'new' || item.status === 'reviewed') && (
                          <button
                            onClick={() => updateStatus(item.id, 'implemented')}
                            className="px-2.5 py-1.5 text-xs text-[#00ff88] hover:bg-[#00ff88]/10 rounded transition-colors"
                          >
                            Implement
                          </button>
                        )}
                        {item.status !== 'dismissed' && (
                          <button
                            onClick={() => updateStatus(item.id, 'dismissed')}
                            className="px-2.5 py-1.5 text-xs text-red-400 hover:bg-red-500/10 rounded transition-colors"
                          >
                            Dismiss
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteConfirm(item.id)}
                          className="px-2 py-1.5 text-xs text-[#dcdbd5]/40 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && suggestions.length > 0 && (
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
              <span className="text-sm text-[#dcdbd5]">Page {page} of {totalPages}</span>
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

      {/* Detail Modal */}
      {detailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setDetailModal(null)}>
          <div className="bg-[#191818] border border-[#404040] rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#ffd700]">Suggestion Detail</h2>
              <button onClick={() => setDetailModal(null)} className="text-[#dcdbd5]/60 hover:text-[#dcdbd5] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Agent & Meta */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#dcdbd5]">
                  <span className="text-[#ffd700] font-medium">{detailModal.username}</span>
                  <span className="text-[#dcdbd5]/40 mx-2">·</span>
                  <span className="text-[#dcdbd5]/60">{CATEGORY_LABELS[detailModal.category]}</span>
                </span>
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize ${STATUS_COLORS[detailModal.status]}`}>
                  {detailModal.status}
                </span>
              </div>

              <div className="text-xs text-[#dcdbd5]/40">
                {new Date(detailModal.created_at).toLocaleString()}
              </div>

              {/* Suggestion Text */}
              <div className="p-4 bg-[#404040]/30 border border-[#404040] rounded-lg">
                <p className="text-[#dcdbd5] text-sm leading-relaxed whitespace-pre-wrap">{detailModal.suggestion}</p>
              </div>

              {/* Status Actions */}
              <div>
                <label className="block text-sm font-medium text-[#dcdbd5] mb-2">Update Status</label>
                <div className="flex flex-wrap gap-2">
                  {['new', 'reviewed', 'implemented', 'dismissed'].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        updateStatus(detailModal.id, s);
                        setDetailModal({ ...detailModal, status: s });
                      }}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full capitalize transition-colors ${
                        detailModal.status === s
                          ? STATUS_COLORS[s]
                          : 'bg-[#404040]/30 text-[#dcdbd5]/60 hover:text-[#dcdbd5]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-sm font-medium text-[#dcdbd5] mb-2">Admin Notes</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  placeholder="Internal notes about this suggestion..."
                  className="w-full px-4 py-2 bg-[#404040]/30 border border-[#404040] rounded-lg text-[#dcdbd5] text-sm placeholder-[#dcdbd5]/40 focus:border-[#ffd700] focus:outline-none resize-none"
                />
                <button
                  onClick={saveNotes}
                  disabled={saving || adminNotes === (detailModal.admin_notes || '')}
                  className="mt-2 px-4 py-1.5 text-sm bg-[#ffd700] text-[#191818] font-semibold rounded-lg hover:bg-[#ffe55c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Notes'}
                </button>
              </div>

              {/* Delete */}
              <div className="pt-2 border-t border-[#404040]">
                <button
                  onClick={() => setDeleteConfirm(detailModal.id)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Suggestion
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-[#191818] border border-red-500/30 rounded-lg p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-red-400 mb-2">Delete Suggestion?</h3>
            <p className="text-sm text-[#dcdbd5]/70 mb-4">This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-[#404040]/30 border border-[#404040] text-[#dcdbd5] rounded-lg hover:border-[#dcdbd5]/30 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteSuggestion(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
