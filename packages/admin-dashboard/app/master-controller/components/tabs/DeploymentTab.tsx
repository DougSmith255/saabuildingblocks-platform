'use client';

import React, { useState, useEffect } from 'react';
import { Rocket, RefreshCw, Cloud, CheckCircle, XCircle, Clock, FileCode, AlertCircle, GitBranch, GitCommit } from 'lucide-react';

interface DeploymentHistory {
  id: string;
  timestamp: string;
  status: 'success' | 'failed' | 'pending';
  url?: string;
  duration?: number;
  error?: string;
}

interface CSSGenerationStats {
  filePath: string;
  fileSize: string;
  fileSizeBytes: number;
  source: 'database' | 'defaults';
  timestamp: string;
  duration: string;
  generatedAt: string;
}

interface GitStatus {
  branch: string;
  hasChanges: boolean;
  modifiedFiles: string[];
  untrackedFiles: string[];
  lastCommit: {
    sha: string;
    message: string;
    author: string;
    date: string;
  };
}

export function DeploymentTab() {
  const [isUpdatingStaticFiles, setIsUpdatingStaticFiles] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [cssStats, setCSSStats] = useState<CSSGenerationStats | null>(null);
  const [lastDeployment, setLastDeployment] = useState<DeploymentHistory | null>(null);
  const [deploymentHistory, setDeploymentHistory] = useState<DeploymentHistory[]>([]);
  const [gitStatus, setGitStatus] = useState<GitStatus | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Load deployment history on mount
  useEffect(() => {
    loadDeploymentHistory();
    loadCSSStats();
    loadGitStatus();
  }, []);

  const loadDeploymentHistory = async () => {
    try {
      const response = await fetch('/api/master-controller/deploy');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data.recentDeployments) {
          // Transform Supabase deployment_logs to our format
          const history = result.data.recentDeployments.map((log: any) => ({
            id: log.id,
            timestamp: log.created_at,
            status: log.status === 'triggered' ? 'pending' : log.status === 'error' ? 'failed' : 'success',
            url: 'https://saabuildingblocks.pages.dev',
            duration: log.duration,
            error: log.metadata?.error,
          }));
          setDeploymentHistory(history);
          if (history.length > 0) {
            setLastDeployment(history[0]);
          }
        }
      }
    } catch (error) {
      console.error('[Deployment] Failed to load history:', error);
    }
  };

  const loadCSSStats = async () => {
    try {
      const response = await fetch('/api/master-controller/regenerate-css');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setCSSStats(result.data);
        }
      }
    } catch (error) {
      console.error('[Deployment] Failed to load CSS stats:', error);
    }
  };

  const loadGitStatus = async () => {
    try {
      const response = await fetch('/api/master-controller/git-status');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setGitStatus(result.data);
        }
      }
    } catch (error) {
      console.error('[Deployment] Failed to load git status:', error);
    }
  };

  const handleCommit = async () => {
    setIsCommitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/master-controller/commit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        setMessage({
          type: 'success',
          text: `✓ Committed successfully! SHA: ${result.data.commitSha.substring(0, 7)}`,
        });
        loadGitStatus(); // Reload git status
        // Auto-clear message after 5 seconds
        setTimeout(() => setMessage(null), 5000);
      } else {
        throw new Error(result.error || result.details || 'Failed to commit changes');
      }
    } catch (error) {
      console.error('[Deployment] Commit error:', error);
      setMessage({
        type: 'error',
        text: `❌ Error: ${error instanceof Error ? error.message : 'Failed to commit'}`,
      });
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setIsCommitting(false);
    }
  };

  const handleUpdateStaticFiles = async () => {
    setIsUpdatingStaticFiles(true);
    setMessage(null);

    try {
      const response = await fetch('/api/master-controller/regenerate-css', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        setMessage({
          type: 'success',
          text: `✓ Static files updated successfully! ${result.data.fileSize} CSS + components from ${result.data.source}`,
        });
        setCSSStats(result.data);
        loadCSSStats(); // Reload stats
        // Auto-clear message after 5 seconds
        setTimeout(() => setMessage(null), 5000);
      } else {
        throw new Error(result.error || result.details || 'Failed to update static files');
      }
    } catch (error) {
      console.error('[Deployment] Static files update error:', error);
      setMessage({
        type: 'error',
        text: `❌ Error: ${error instanceof Error ? error.message : 'Failed to update static files'}`,
      });
      setTimeout(() => setMessage(null), 7000);
    } finally {
      setIsUpdatingStaticFiles(false);
    }
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    setMessage(null);

    try {
      const response = await fetch('/api/master-controller/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        setMessage({
          type: 'success',
          text: `✓ Deployment triggered! ${result.data.note}`,
        });

        // Show workflow URL
        if (result.data.workflowUrl) {
          setMessage({
            type: 'info',
            text: `Deployment triggered! View progress at: ${result.data.workflowUrl}`,
          });
        }

        // Reload deployment history after delay
        setTimeout(() => {
          loadDeploymentHistory();
        }, 3000);
      } else {
        throw new Error(result.error || result.details || 'Failed to start deployment');
      }
    } catch (error) {
      console.error('[Deployment] Deployment error:', error);
      setMessage({
        type: 'error',
        text: `❌ Error: ${error instanceof Error ? error.message : 'Failed to deploy'}`,
      });
      setTimeout(() => setMessage(null), 7000);
    } finally {
      setIsDeploying(false);
    }
  };

  // Note: GitHub Actions workflow doesn't provide immediate status
  // We rely on deployment_logs table in Supabase instead

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return 'N/A';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#404040]">
        <div>
          <h2 className="text-[clamp(1.5rem,1.5vw+0.5rem,1.875rem)] leading-[1.3] font-semibold text-[#e5e4dd]">
            Deployment Controls
          </h2>
          <p className="text-[clamp(0.8125rem,0.125vw+0.75rem,0.875rem)] leading-[1.75] text-[#dcdbd5] mt-1">
            Update static files and deploy to Cloudflare Pages
          </p>
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <div
          className={`p-4 rounded-lg border ${
            message.type === 'success'
              ? 'bg-[#00ff88]/10 border-[#00ff88]/30 text-[#00ff88]'
              : message.type === 'error'
              ? 'bg-red-500/10 border-red-500/30 text-red-400'
              : 'bg-[#ffd700]/10 border-[#ffd700]/30 text-[#ffd700]'
          }`}
        >
          <div className="flex items-start gap-3">
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            ) : message.type === 'error' ? (
              <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            )}
            <p className="text-sm">{message.text}</p>
          </div>
        </div>
      )}

      {/* Static Files Generation Section */}
      <div
        className="p-6 rounded-lg border"
        style={{
          background: 'rgba(64, 64, 64, 0.5)',
          backdropFilter: 'blur(8px)',
          borderColor: 'rgba(255, 215, 0, 0.2)',
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-[#ffd700] flex items-center gap-2">
              <FileCode className="w-5 h-5" />
              Static Files Generation
            </h3>
            <p className="text-sm text-[#dcdbd5] mt-1">
              Generate static CSS + component files from Master Controller settings stored in Supabase
            </p>
          </div>
          <button
            onClick={handleUpdateStaticFiles}
            disabled={isUpdatingStaticFiles}
            className={`px-4 py-2 rounded-md font-medium text-sm leading-[1.5] tracking-[0.01em] transition-all flex items-center gap-2 ${
              isUpdatingStaticFiles
                ? 'bg-[#404040] text-[#dcdbd5] border border-[#404040] opacity-50 cursor-not-allowed'
                : 'bg-[#ffd700] text-[#191818] border border-[#ffd700] hover:bg-[#ffd700]/90 hover:shadow-lg hover:shadow-[#ffd700]/30'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isUpdatingStaticFiles ? 'animate-spin' : ''}`} />
            {isUpdatingStaticFiles ? 'Updating...' : 'Update Static Files'}
          </button>
        </div>

        {/* CSS Stats */}
        {cssStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="p-3 rounded-md bg-[#191818]/50 border border-[#404040]">
              <div className="text-xs text-[#dcdbd5] mb-1">Last Generated</div>
              <div className="text-sm font-medium text-[#e5e4dd]">
                {formatDate(cssStats.timestamp)}
              </div>
            </div>
            <div className="p-3 rounded-md bg-[#191818]/50 border border-[#404040]">
              <div className="text-xs text-[#dcdbd5] mb-1">File Size</div>
              <div className="text-sm font-medium text-[#e5e4dd]">
                {cssStats.fileSize}
              </div>
            </div>
            <div className="p-3 rounded-md bg-[#191818]/50 border border-[#404040]">
              <div className="text-xs text-[#dcdbd5] mb-1">Source</div>
              <div className="text-sm font-medium text-[#e5e4dd] capitalize">
                {cssStats.source}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Git Commit Section */}
      <div
        className="p-6 rounded-lg border"
        style={{
          background: 'rgba(64, 64, 64, 0.5)',
          backdropFilter: 'blur(8px)',
          borderColor: 'rgba(255, 136, 0, 0.2)',
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-[#ff8800] flex items-center gap-2">
              <GitBranch className="w-5 h-5" />
              Commit Changes
            </h3>
            <p className="text-sm text-[#dcdbd5] mt-1">
              Commit and push changes to GitHub before deploying
            </p>
          </div>
          <button
            onClick={handleCommit}
            disabled={isCommitting || !gitStatus?.hasChanges}
            className={`px-4 py-2 rounded-md font-medium text-sm leading-[1.5] tracking-[0.01em] transition-all flex items-center gap-2 ${
              isCommitting || !gitStatus?.hasChanges
                ? 'bg-[#404040] text-[#dcdbd5] border border-[#404040] opacity-50 cursor-not-allowed'
                : 'bg-[#ff8800] text-[#191818] border border-[#ff8800] hover:bg-[#ff8800]/90 hover:shadow-lg hover:shadow-[#ff8800]/30'
            }`}
          >
            <GitCommit className={`w-4 h-4 ${isCommitting ? 'animate-pulse' : ''}`} />
            {isCommitting ? 'Committing...' : 'Commit & Push'}
          </button>
        </div>

        {/* Git Status Display */}
        {gitStatus && (
          <div className={`grid grid-cols-1 ${gitStatus.hasChanges ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4 mt-4`}>
            <div className="p-3 rounded-md bg-[#191818]/50 border border-[#404040]">
              <div className="text-xs text-[#dcdbd5] mb-1">Branch</div>
              <div className="text-sm font-medium text-[#e5e4dd]">
                {gitStatus.branch}
              </div>
            </div>
            {gitStatus.hasChanges && (
              <div className="p-3 rounded-md bg-[#191818]/50 border border-[#404040]">
                <div className="text-xs text-[#dcdbd5] mb-1">Files Changed</div>
                <div className="text-sm font-medium text-[#e5e4dd]">
                  {gitStatus.modifiedFiles.length + gitStatus.untrackedFiles.length}
                </div>
              </div>
            )}
            <div className="p-3 rounded-md bg-[#191818]/50 border border-[#404040]">
              <div className="text-xs text-[#dcdbd5] mb-1">Last Commit</div>
              <div className="text-sm font-medium text-[#e5e4dd]">
                {gitStatus.lastCommit.message.substring(0, 30)}...
              </div>
            </div>
          </div>
        )}

        {/* File list (collapsible) */}
        {gitStatus?.hasChanges && (
          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-[#dcdbd5]">
              Files to commit ({gitStatus.modifiedFiles.length + gitStatus.untrackedFiles.length})
            </summary>
            <ul className="mt-2 text-xs text-[#dcdbd5] space-y-1 ml-4">
              {gitStatus.modifiedFiles.slice(0, 10).map(file => (
                <li key={file}>• {file}</li>
              ))}
              {gitStatus.untrackedFiles.slice(0, 10).map(file => (
                <li key={file}>• {file} (new)</li>
              ))}
            </ul>
          </details>
        )}
      </div>

      {/* Deployment Section */}
      <div
        className="p-6 rounded-lg border"
        style={{
          background: 'rgba(64, 64, 64, 0.5)',
          backdropFilter: 'blur(8px)',
          borderColor: 'rgba(0, 255, 136, 0.2)',
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-[#00ff88] flex items-center gap-2">
              <Cloud className="w-5 h-5" />
              Cloudflare Pages Deployment
            </h3>
            <p className="text-sm text-[#dcdbd5] mt-1">
              Deploy static site to Cloudflare's global CDN (300+ edge locations)
            </p>
          </div>
          <button
            onClick={handleDeploy}
            disabled={isDeploying}
            className={`px-4 py-2 rounded-md font-medium text-sm leading-[1.5] tracking-[0.01em] transition-all flex items-center gap-2 ${
              isDeploying
                ? 'bg-[#404040] text-[#dcdbd5] border border-[#404040] opacity-50 cursor-not-allowed'
                : 'bg-[#00ff88] text-[#191818] border border-[#00ff88] hover:bg-[#00ff88]/90 hover:shadow-lg hover:shadow-[#00ff88]/30'
            }`}
          >
            <Rocket className={`w-4 h-4 ${isDeploying ? 'animate-pulse' : ''}`} />
            {isDeploying ? 'Deploying...' : 'Deploy to Cloudflare'}
          </button>
        </div>

        {/* Last Deployment */}
        {lastDeployment && (
          <div className="p-4 rounded-md bg-[#191818]/50 border border-[#404040] mt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-[#e5e4dd]">Last Deployment</div>
              <div className={`flex items-center gap-2 text-sm ${
                lastDeployment.status === 'success'
                  ? 'text-[#00ff88]'
                  : lastDeployment.status === 'failed'
                  ? 'text-red-400'
                  : 'text-[#ffd700]'
              }`}>
                {lastDeployment.status === 'success' ? (
                  <CheckCircle className="w-4 h-4" />
                ) : lastDeployment.status === 'failed' ? (
                  <XCircle className="w-4 h-4" />
                ) : (
                  <Clock className="w-4 h-4 animate-pulse" />
                )}
                <span className="capitalize">{lastDeployment.status}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div>
                <div className="text-xs text-[#dcdbd5]">Timestamp</div>
                <div className="text-[#e5e4dd] font-medium">
                  {formatDate(lastDeployment.timestamp)}
                </div>
              </div>
              <div>
                <div className="text-xs text-[#dcdbd5]">Duration</div>
                <div className="text-[#e5e4dd] font-medium">
                  {formatDuration(lastDeployment.duration)}
                </div>
              </div>
              {lastDeployment.url && (
                <div>
                  <div className="text-xs text-[#dcdbd5]">URL</div>
                  <a
                    href={lastDeployment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00ff88] hover:underline font-medium"
                  >
                    View Site
                  </a>
                </div>
              )}
            </div>
            {lastDeployment.error && (
              <div className="mt-3 p-2 rounded bg-red-500/10 border border-red-500/30">
                <div className="text-xs text-red-400">{lastDeployment.error}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Deployment History */}
      {deploymentHistory.length > 0 && (
        <div
          className="p-6 rounded-lg border"
          style={{
            background: 'rgba(64, 64, 64, 0.3)',
            backdropFilter: 'blur(8px)',
            borderColor: 'rgba(64, 64, 64, 0.5)',
          }}
        >
          <h3 className="text-lg font-semibold text-[#e5e4dd] mb-4">Deployment History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#404040]">
                  <th className="text-left py-2 px-3 text-[#dcdbd5] font-medium">Timestamp</th>
                  <th className="text-left py-2 px-3 text-[#dcdbd5] font-medium">Status</th>
                  <th className="text-left py-2 px-3 text-[#dcdbd5] font-medium">Duration</th>
                  <th className="text-left py-2 px-3 text-[#dcdbd5] font-medium">URL</th>
                </tr>
              </thead>
              <tbody>
                {deploymentHistory.slice(0, 5).map((deployment) => (
                  <tr key={deployment.id} className="border-b border-[#404040]/50 hover:bg-[#404040]/20">
                    <td className="py-2 px-3 text-[#e5e4dd]">
                      {formatDate(deployment.timestamp)}
                    </td>
                    <td className="py-2 px-3">
                      <span className={`inline-flex items-center gap-1 ${
                        deployment.status === 'success'
                          ? 'text-[#00ff88]'
                          : deployment.status === 'failed'
                          ? 'text-red-400'
                          : 'text-[#ffd700]'
                      }`}>
                        {deployment.status === 'success' ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : deployment.status === 'failed' ? (
                          <XCircle className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        <span className="capitalize">{deployment.status}</span>
                      </span>
                    </td>
                    <td className="py-2 px-3 text-[#e5e4dd]">
                      {formatDuration(deployment.duration)}
                    </td>
                    <td className="py-2 px-3">
                      {deployment.url ? (
                        <a
                          href={deployment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#00ff88] hover:underline"
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-[#dcdbd5]">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info Footer */}
      <div className="p-4 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/30">
        <p className="text-[clamp(0.8125rem,0.125vw+0.75rem,0.875rem)] leading-[1.75] text-[#dcdbd5]">
          <strong className="text-[#ffd700] font-medium">💡 Deployment Flow:</strong>
          "Update Static Files" generates CSS tokens + copies SAA components from @saa/shared to public/.
          "Deploy to Cloudflare" triggers GitHub Actions which builds Next.js static export (public/ → out/)
          and deploys to Cloudflare Pages global CDN (300+ edge locations, 20-50ms TTFB worldwide).
        </p>
      </div>
    </div>
  );
}
