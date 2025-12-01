'use client';

/**
 * Automations Tab
 *
 * Displays all system automations with their status (Active/Broken)
 * Each automation is shown as a tile with:
 * - Name
 * - Description
 * - Status indicator (green "Active" or red "Broken")
 * - Last run time
 * - Next scheduled run
 */

import { useState, useEffect } from 'react';
import { RefreshCw, Clock, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Automation {
  id: string;
  name: string;
  description: string;
  schedule: string;
  status: 'active' | 'broken';
  lastRun?: string;
  nextRun?: string;
  logFile?: string;
}

export function AutomationsTab() {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAutomations = async () => {
    try {
      const response = await fetch('/api/automations/status');
      const data = await response.json();
      setAutomations(data.automations || []);
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

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center">
          <RefreshCw className="w-6 h-6 animate-spin text-[#00ff88]" />
          <span className="ml-2 text-[#dcdbd5]">Loading automations...</span>
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
            Monitor all automated tasks and their current status
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

      {/* Automations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {automations.map((automation) => (
          <div
            key={automation.id}
            className="p-6 rounded-lg border"
            style={{
              background: 'rgba(64, 64, 64, 0.5)',
              backdropFilter: 'blur(8px)',
              borderColor: automation.status === 'active' ? 'rgba(0, 255, 136, 0.3)' : 'rgba(255, 0, 0, 0.3)',
            }}
          >
            {/* Status Badge */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#e5e4dd]">{automation.name}</h3>
              <div
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                  automation.status === 'active'
                    ? 'bg-[#00ff88] bg-opacity-20 text-[#00ff88]'
                    : 'bg-red-500 bg-opacity-20 text-red-500'
                }`}
              >
                {automation.status === 'active' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Active
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    Broken
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-[#bfbdb0] text-sm mb-4">{automation.description}</p>

            {/* Schedule */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-[#dcdbd5]">
                <Calendar className="w-4 h-4 text-[#ffd700]" />
                <span className="text-[#bfbdb0]">Schedule:</span>
                <span className="font-mono">{automation.schedule}</span>
              </div>

              {automation.lastRun && (
                <div className="flex items-center gap-2 text-[#dcdbd5]">
                  <Clock className="w-4 h-4 text-[#00ff88]" />
                  <span className="text-[#bfbdb0]">Last Run:</span>
                  <span>{new Date(automation.lastRun).toLocaleString()}</span>
                </div>
              )}

              {automation.nextRun && (
                <div className="flex items-center gap-2 text-[#dcdbd5]">
                  <Clock className="w-4 h-4 text-[#ffd700]" />
                  <span className="text-[#bfbdb0]">Next Run:</span>
                  <span>{new Date(automation.nextRun).toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Log File Link */}
            {automation.logFile && (
              <div className="mt-4 pt-4 border-t border-[#404040]">
                <a
                  href={`/api/automations/logs?file=${automation.logFile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#00ff88] hover:text-[#ffd700] transition-colors"
                >
                  View Logs →
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      {automations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#bfbdb0] text-lg">No automations configured yet.</p>
        </div>
      )}
    </div>
  );
}
