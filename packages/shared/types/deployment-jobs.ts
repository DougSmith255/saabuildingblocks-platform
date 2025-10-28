/**
 * TypeScript types for deployment_jobs table
 * Auto-generated from Supabase migration: 20251018_create_deployment_jobs.sql
 */

export type DeploymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export type DeploymentType = 'incremental' | 'full';

export type TriggeredBy = 'wordpress' | 'manual' | 'api';

export interface DeploymentJob {
  id: string;

  // WordPress context
  post_id: string | null;
  post_slug: string | null;
  post_title: string | null;

  // Deployment details
  status: DeploymentStatus;
  deployment_type: DeploymentType;

  // Execution tracking
  triggered_by: TriggeredBy | null;
  github_run_id: string | null;
  github_run_url: string | null;

  // Timing
  created_at: string;
  started_at: string | null;
  completed_at: string | null;

  // Results
  error_message: string | null;
  build_hash: string | null;
  deployment_url: string | null;

  // Metadata
  metadata: Record<string, unknown>;
}

export interface CreateDeploymentJobParams {
  post_id?: string;
  post_slug?: string;
  post_title?: string;
  deployment_type?: DeploymentType;
  triggered_by?: TriggeredBy;
  metadata?: Record<string, unknown>;
}

export interface UpdateDeploymentJobStatusParams {
  job_id: string;
  new_status: DeploymentStatus;
  run_id?: string;
  run_url?: string;
  error_msg?: string;
  build_hash_val?: string;
  deployment_url_val?: string;
}

export interface DeploymentJobStats {
  status: DeploymentStatus;
  count: number;
  avg_duration_seconds: number | null;
  last_created_at: string | null;
}

export interface DeploymentJobFilter {
  status?: DeploymentStatus;
  post_id?: string;
  triggered_by?: TriggeredBy;
  created_after?: string;
  created_before?: string;
  limit?: number;
  offset?: number;
}
