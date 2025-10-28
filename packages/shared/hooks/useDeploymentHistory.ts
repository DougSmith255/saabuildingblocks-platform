/**
 * useDeploymentHistory Hook
 * Fetches and manages deployment job history with filtering
 */

import { useState, useEffect, useCallback } from 'react';
import type { DeploymentStatus, TriggeredBy } from '@/types/deployment-jobs';

interface DeploymentJobSummary {
  id: string;
  status: DeploymentStatus;
  post_id: string | null;
  post_slug: string | null;
  post_title: string | null;
  deployment_type: string;
  triggered_by: TriggeredBy | null;
  github_run_id: string | null;
  github_run_url: string | null;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
  duration_seconds: number | null;
}

interface DeploymentHistoryResponse {
  success: boolean;
  jobs: DeploymentJobSummary[];
  count: number;
  message?: string;
}

interface UseDeploymentHistoryOptions {
  status?: DeploymentStatus;
  triggered_by?: TriggeredBy;
  limit?: number;
  autoRefresh?: boolean;
  refreshInterval?: number; // milliseconds, default 30000 (30 seconds)
}

export function useDeploymentHistory({
  status,
  triggered_by,
  limit = 20,
  autoRefresh = false,
  refreshInterval = 30000,
}: UseDeploymentHistoryOptions = {}) {
  const [jobs, setJobs] = useState<DeploymentJobSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (triggered_by) params.append('triggered_by', triggered_by);
      if (limit) params.append('limit', limit.toString());

      const response = await fetch(`/api/deployments/list?${params.toString()}`);
      const data: DeploymentHistoryResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch deployment history');
      }

      setJobs(data.jobs);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  }, [status, triggered_by, limit]);

  // Initial fetch
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) {
      return;
    }

    const intervalId = setInterval(fetchHistory, refreshInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [autoRefresh, refreshInterval, fetchHistory]);

  const refresh = useCallback(() => {
    fetchHistory();
  }, [fetchHistory]);

  const retryJob = useCallback(async (jobId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/deployments/retry/${jobId}`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to retry deployment');
      }

      // Refresh list after retry
      await fetchHistory();
      return true;
    } catch (err) {
      console.error('Failed to retry deployment:', err);
      return false;
    }
  }, [fetchHistory]);

  return {
    jobs,
    isLoading,
    error,
    refresh,
    retryJob,
  };
}
