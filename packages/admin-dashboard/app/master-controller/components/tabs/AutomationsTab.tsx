'use client';

/**
 * Automations Tab
 *
 * Displays ALL system automations grouped by category with status indicators.
 * Categories: Cron Jobs, Systemd Timers, GitHub Actions, Infrastructure,
 *             Webhooks, Cloudflare Functions, Analytics, Email, Build Pipelines
 *
 * Each automation shows:
 * - Name + status badge (green Active / red Broken)
 * - Description + optional status detail
 * - Schedule
 * - Last run / next run times
 * - View Logs link (when available)
 *
 * Summary bar at top: total count, active count, broken count
 */

import { useState, useEffect } from 'react';
import {
  RefreshCw,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Timer,
  GitBranch,
  Server,
  Webhook,
  Cloud,
  BarChart3,
  Mail,
  Bell,
  Wrench,
  Share2,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

interface Automation {
  id: string;
  name: string;
  description: string;
  category: string;
  schedule: string;
  status: 'active' | 'broken';
  lastRun?: string;
  nextRun?: string;
  logFile?: string;
  statusDetail?: string;
}

interface Summary {
  total: number;
  active: number;
  broken: number;
}

const CATEGORY_CONFIG: Record<string, { icon: typeof Clock; label: string; order: number }> = {
  'Infrastructure': { icon: Server, label: 'Infrastructure Services', order: 0 },
  'Cron Jobs': { icon: Timer, label: 'Cron Jobs', order: 1 },
  'Systemd Timers': { icon: Clock, label: 'Systemd Timers', order: 2 },
  'GitHub Actions': { icon: GitBranch, label: 'GitHub Actions', order: 3 },
  'Webhooks': { icon: Webhook, label: 'Webhook Handlers', order: 4 },
  'Cloudflare Functions': { icon: Cloud, label: 'Cloudflare Functions', order: 5 },
  'Analytics': { icon: BarChart3, label: 'Analytics & Tracking', order: 6 },
  'Email': { icon: Mail, label: 'Email System', order: 7 },
  'Notification Automations': { icon: Bell, label: 'Notification Automations', order: 8 },
  'Build Pipelines': { icon: Wrench, label: 'Build Pipelines', order: 9 },
  'Social Media': { icon: Share2, label: 'Social Media', order: 10 },
};

function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const absDiff = Math.abs(diffMs);
  const isFuture = diffMs < 0;

  if (absDiff < 60000) return isFuture ? 'in < 1 min' : '< 1 min ago';
  if (absDiff < 3600000) {
    const mins = Math.floor(absDiff / 60000);
    return isFuture ? `in ${mins}m` : `${mins}m ago`;
  }
  if (absDiff < 86400000) {
    const hours = Math.floor(absDiff / 3600000);
    return isFuture ? `in ${hours}h` : `${hours}h ago`;
  }
  const days = Math.floor(absDiff / 86400000);
  return isFuture ? `in ${days}d` : `${days}d ago`;
}

export function AutomationsTab() {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [summary, setSummary] = useState<Summary>({ total: 0, active: 0, broken: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  const fetchAutomations = async () => {
    try {
      const response = await fetch('/api/automations/status');
      const data = await response.json();
      setAutomations(data.automations || []);
      setSummary(data.summary || { total: 0, active: 0, broken: 0 });
    } catch (error) {
      console.error('Failed to fetch automations:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAutomations();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAutomations();
  };

  const toggleCategory = (category: string) => {
    setCollapsedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  // Group automations by category
  const grouped = automations.reduce<Record<string, Automation[]>>((acc, automation) => {
    const cat = automation.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(automation);
    return acc;
  }, {});

  // Sort categories by configured order
  const sortedCategories = Object.keys(grouped).sort((a, b) => {
    const orderA = CATEGORY_CONFIG[a]?.order ?? 99;
    const orderB = CATEGORY_CONFIG[b]?.order ?? 99;
    return orderA - orderB;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-6 h-6 animate-spin text-[#00ff88]" />
          <span className="ml-2 text-[#dcdbd5]">Checking all automations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#e5e4dd] mb-2">System Automations</h2>
          <p className="text-[#bfbdb0]">
            All automated processes across the platform
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-[#404040] hover:bg-[#4a4a4a] text-[#e5e4dd] rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div
          className="p-4 rounded-lg border text-center"
          style={{ background: 'rgba(64, 64, 64, 0.5)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
        >
          <div className="text-3xl font-bold text-[#e5e4dd]">{summary.total}</div>
          <div className="text-sm text-[#bfbdb0]">Total</div>
        </div>
        <div
          className="p-4 rounded-lg border text-center"
          style={{ background: 'rgba(0, 255, 136, 0.05)', borderColor: 'rgba(0, 255, 136, 0.3)' }}
        >
          <div className="text-3xl font-bold text-[#00ff88]">{summary.active}</div>
          <div className="text-sm text-[#00ff88]">Active</div>
        </div>
        <div
          className="p-4 rounded-lg border text-center"
          style={{
            background: summary.broken > 0 ? 'rgba(255, 0, 0, 0.05)' : 'rgba(64, 64, 64, 0.5)',
            borderColor: summary.broken > 0 ? 'rgba(255, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className={`text-3xl font-bold ${summary.broken > 0 ? 'text-red-500' : 'text-[#e5e4dd]'}`}>
            {summary.broken}
          </div>
          <div className={`text-sm ${summary.broken > 0 ? 'text-red-400' : 'text-[#bfbdb0]'}`}>Broken</div>
        </div>
      </div>

      {/* Category Sections */}
      <div className="space-y-6">
        {sortedCategories.map(category => {
          const config = CATEGORY_CONFIG[category] || { icon: Clock, label: category, order: 99 };
          const CategoryIcon = config.icon;
          const items = grouped[category];
          const isCollapsed = collapsedCategories.has(category);
          const categoryActive = items.filter(a => a.status === 'active').length;
          const categoryBroken = items.filter(a => a.status === 'broken').length;

          return (
            <div key={category}>
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center gap-3 mb-3 group cursor-pointer"
              >
                {isCollapsed ? (
                  <ChevronRight className="w-4 h-4 text-[#bfbdb0] group-hover:text-[#e5e4dd] transition-colors" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#bfbdb0] group-hover:text-[#e5e4dd] transition-colors" />
                )}
                <CategoryIcon className="w-5 h-5 text-[#ffd700]" />
                <h3 className="text-lg font-semibold text-[#e5e4dd] group-hover:text-white transition-colors">
                  {config.label}
                </h3>
                <span className="text-sm text-[#bfbdb0]">
                  ({items.length})
                </span>
                {/* Mini status indicators */}
                <div className="flex items-center gap-2 ml-auto">
                  {categoryBroken > 0 && (
                    <span className="flex items-center gap-1 text-xs text-red-400">
                      <AlertCircle className="w-3 h-3" />
                      {categoryBroken} broken
                    </span>
                  )}
                  {categoryActive > 0 && (
                    <span className="flex items-center gap-1 text-xs text-[#00ff88]">
                      <CheckCircle2 className="w-3 h-3" />
                      {categoryActive} active
                    </span>
                  )}
                </div>
              </button>

              {/* Category Items */}
              {!isCollapsed && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 ml-7">
                  {items.map(automation => (
                    <div
                      key={automation.id}
                      className="p-5 rounded-lg border"
                      style={{
                        background: 'rgba(64, 64, 64, 0.5)',
                        backdropFilter: 'blur(8px)',
                        borderColor: automation.status === 'active'
                          ? 'rgba(0, 255, 136, 0.2)'
                          : 'rgba(255, 0, 0, 0.3)',
                      }}
                    >
                      {/* Header Row: Name + Status */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h4 className="text-sm font-bold text-[#e5e4dd] leading-tight">{automation.name}</h4>
                        <div
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                            automation.status === 'active'
                              ? 'bg-[#00ff88] bg-opacity-20 text-[#00ff88]'
                              : 'bg-red-500 bg-opacity-20 text-red-500'
                          }`}
                        >
                          {automation.status === 'active' ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <AlertCircle className="w-3 h-3" />
                          )}
                          {automation.status === 'active' ? 'Active' : 'Broken'}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-[#bfbdb0] text-xs mb-3 leading-relaxed">{automation.description}</p>

                      {/* Status Detail (if broken or has extra info) */}
                      {automation.statusDetail && (
                        <div
                          className={`text-xs px-2 py-1 rounded mb-3 ${
                            automation.status === 'broken'
                              ? 'bg-red-500 bg-opacity-10 text-red-400'
                              : 'bg-[#ffd700] bg-opacity-10 text-[#ffd700]'
                          }`}
                        >
                          {automation.statusDetail}
                        </div>
                      )}

                      {/* Schedule + Timing */}
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center gap-2 text-[#dcdbd5]">
                          <Calendar className="w-3 h-3 text-[#ffd700] flex-shrink-0" />
                          <span className="text-[#bfbdb0]">Schedule:</span>
                          <span className="font-mono truncate">{automation.schedule}</span>
                        </div>

                        {automation.lastRun && (
                          <div className="flex items-center gap-2 text-[#dcdbd5]">
                            <Clock className="w-3 h-3 text-[#00ff88] flex-shrink-0" />
                            <span className="text-[#bfbdb0]">Last:</span>
                            <span title={new Date(automation.lastRun).toLocaleString()}>
                              {formatRelativeTime(automation.lastRun)}
                            </span>
                          </div>
                        )}

                        {automation.nextRun && (
                          <div className="flex items-center gap-2 text-[#dcdbd5]">
                            <Clock className="w-3 h-3 text-[#ffd700] flex-shrink-0" />
                            <span className="text-[#bfbdb0]">Next:</span>
                            <span title={new Date(automation.nextRun).toLocaleString()}>
                              {formatRelativeTime(automation.nextRun)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Log File Link */}
                      {automation.logFile && (
                        <div className="mt-3 pt-3 border-t border-[#404040]">
                          <a
                            href={`/api/automations/logs?file=${automation.logFile}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#00ff88] hover:text-[#ffd700] transition-colors"
                          >
                            View Logs →
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {automations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#bfbdb0] text-lg">No automations found.</p>
        </div>
      )}
    </div>
  );
}
