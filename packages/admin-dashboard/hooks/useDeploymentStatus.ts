/**
 * useDeploymentStatus Hook
 * Polls deployment job status with automatic refresh
 */

import { useState, useEffect, useCallback } from 'react';
import type { DeploymentJob } from '@/app/types/deployment-jobs';

interface DeploymentStatusResponse {
  success: boolean;
  job?: DeploymentJob & {
    duration_seconds: number | null;
  };
  message?: string;
}

interface UseDeploymentStatusOptions {
  jobId: string | null;
  pollInterval?: number; // milliseconds, default 5000 (5 seconds)
  autoRefresh?: boolean; // default true
}

export function useDeploymentStatus({
  jobId,
  pollInterval = 5000,
  autoRefresh = true,
}: UseDeploymentStatusOptions) {
  const [job, setJob] = useState<DeploymentStatusResponse['job'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!jobId) {
      setJob(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/deployments/status/${jobId}`);
      const data: DeploymentStatusResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch deployment status');
      }

      setJob(data.job || null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setJob(null);
    } finally {
      setIsLoading(false);
    }
  }, [jobId]);

  // Initial fetch
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Auto-refresh polling
  useEffect(() => {
    if (!autoRefresh || !jobId || !job) {
      return;
    }

    // Stop polling if job is in terminal state
    const isTerminal = job.status === 'completed' || job.status === 'failed' || job.status === 'cancelled';
    if (isTerminal) {
      return;
    }

    const intervalId = setInterval(fetchStatus, pollInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [autoRefresh, jobId, job, pollInterval, fetchStatus]);

  const refresh = useCallback(() => {
    fetchStatus();
  }, [fetchStatus]);

  return {
    job,
    isLoading,
    error,
    refresh,
  };
}
