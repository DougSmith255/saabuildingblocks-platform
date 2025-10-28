/**
 * useDeployment Hook
 * Manages deployment job creation and triggering
 */

import { useState } from 'react';
import type { DeploymentJob } from '@/app/types/deployment-jobs';

interface TriggerDeploymentParams {
  post_id?: string;
  post_slug?: string;
  post_title?: string;
  deployment_type?: 'incremental' | 'full';
  triggered_by?: 'wordpress' | 'manual' | 'api';
}

interface TriggerDeploymentResult {
  success: boolean;
  message: string;
  job?: {
    id: string;
    status: string;
    post_id: string | null;
    post_slug: string | null;
    created_at: string;
  };
}

export function useDeployment() {
  const [isTriggering, setIsTriggering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastJob, setLastJob] = useState<TriggerDeploymentResult['job'] | null>(null);

  const triggerDeployment = async (params: TriggerDeploymentParams = {}): Promise<TriggerDeploymentResult> => {
    setIsTriggering(true);
    setError(null);

    try {
      const response = await fetch('/api/deployments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to trigger deployment');
      }

      setLastJob(data.job);

      // Optionally trigger queue processing immediately
      if (process.env.NEXT_PUBLIC_AUTO_PROCESS_QUEUE === 'true') {
        await fetch('/api/cron/process-deployments', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET || ''}`,
          },
        }).catch(err => {
          console.warn('Failed to auto-process queue:', err);
        });
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsTriggering(false);
    }
  };

  const triggerFullDeployment = () => {
    return triggerDeployment({
      deployment_type: 'full',
      triggered_by: 'manual',
    });
  };

  const triggerIncrementalDeployment = (post_id?: string, post_slug?: string, post_title?: string) => {
    return triggerDeployment({
      post_id,
      post_slug,
      post_title,
      deployment_type: 'incremental',
      triggered_by: 'manual',
    });
  };

  return {
    triggerDeployment,
    triggerFullDeployment,
    triggerIncrementalDeployment,
    isTriggering,
    error,
    lastJob,
  };
}
