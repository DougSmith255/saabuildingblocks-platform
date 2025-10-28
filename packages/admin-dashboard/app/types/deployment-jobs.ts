/**
 * Deployment Job Types
 */

export type DeploymentStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

export type TriggeredBy = 'wordpress' | 'manual' | 'api';

export interface DeploymentJob {
  id: string;
  status: DeploymentStatus;
  type: 'static-export' | 'full-deploy' | 'wordpress-sync';
  started_at: string | null;
  completed_at: string | null;
  error?: string;
  logs?: string[];
  metadata?: Record<string, unknown>;
}

export interface DeploymentHistory {
  jobs: DeploymentJob[];
  total: number;
  page: number;
}

export interface CreateDeploymentJobParams {
  type: DeploymentJob['type'];
  post_id?: string;
  post_slug?: string;
  post_title?: string;
  deployment_type?: 'incremental' | 'full';
  triggered_by?: TriggeredBy;
  metadata?: Record<string, unknown>;
}

export interface UpdateDeploymentJobStatusParams {
  job_id: string;
  new_status: DeploymentStatus;
  run_id?: string | null;
  run_url?: string | null;
  error_msg?: string | null;
  build_hash_val?: string | null;
  deployment_url_val?: string | null;
}

export interface DeploymentJobFilter {
  status?: DeploymentJob['status'];
  type?: DeploymentJob['type'];
  post_id?: string;
  triggered_by?: TriggeredBy;
  created_after?: string;
  created_before?: string;
  limit?: number;
  offset?: number;
}

export interface DeploymentJobStats {
  total: number;
  pending: number;
  running: number;
  completed: number;
  failed: number;
}
