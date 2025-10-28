/**
 * Deployment Service
 * Handles CRUD operations for deployment jobs
 */

import { createClient } from '@supabase/supabase-js';
import type {
  DeploymentJob,
  CreateDeploymentJobParams,
  UpdateDeploymentJobStatusParams,
  DeploymentJobFilter,
  DeploymentJobStats,
} from '@/app/types/deployment-jobs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Service client with elevated permissions
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export class DeploymentService {
  /**
   * Create a new deployment job
   */
  static async createJob(params: CreateDeploymentJobParams): Promise<DeploymentJob> {
    const { data, error } = await supabase
      .from('deployment_jobs')
      .insert({
        post_id: params.post_id || null,
        post_slug: params.post_slug || null,
        post_title: params.post_title || null,
        deployment_type: params.deployment_type || 'incremental',
        triggered_by: params.triggered_by || 'api',
        metadata: params.metadata || {},
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create deployment job: ${error.message}`);
    }

    return data as DeploymentJob;
  }

  /**
   * Get deployment job by ID
   */
  static async getJob(id: string): Promise<DeploymentJob | null> {
    const { data, error } = await supabase
      .from('deployment_jobs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Job not found
      }
      throw new Error(`Failed to get deployment job: ${error.message}`);
    }

    return data as DeploymentJob;
  }

  /**
   * List deployment jobs with filters
   */
  static async listJobs(filter: DeploymentJobFilter = {}): Promise<DeploymentJob[]> {
    let query = supabase
      .from('deployment_jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter.status) {
      query = query.eq('status', filter.status);
    }

    if (filter.post_id) {
      query = query.eq('post_id', filter.post_id);
    }

    if (filter.triggered_by) {
      query = query.eq('triggered_by', filter.triggered_by);
    }

    if (filter.created_after) {
      query = query.gte('created_at', filter.created_after);
    }

    if (filter.created_before) {
      query = query.lte('created_at', filter.created_before);
    }

    if (filter.limit) {
      query = query.limit(filter.limit);
    }

    if (filter.offset) {
      query = query.range(filter.offset, filter.offset + (filter.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to list deployment jobs: ${error.message}`);
    }

    return data as DeploymentJob[];
  }

  /**
   * Update deployment job status
   */
  static async updateJobStatus(params: UpdateDeploymentJobStatusParams): Promise<DeploymentJob> {
    const { data, error } = await supabase.rpc('update_deployment_job_status', {
      job_id: params.job_id,
      new_status: params.new_status,
      run_id: params.run_id || null,
      run_url: params.run_url || null,
      error_msg: params.error_msg || null,
      build_hash_val: params.build_hash_val || null,
      deployment_url_val: params.deployment_url_val || null,
    });

    if (error) {
      throw new Error(`Failed to update deployment job status: ${error.message}`);
    }

    return data as DeploymentJob;
  }

  /**
   * Get pending deployment jobs
   */
  static async getPendingJobs(limit: number = 10): Promise<DeploymentJob[]> {
    const { data, error } = await supabase.rpc('get_pending_deployment_jobs', {
      limit_count: limit,
    });

    if (error) {
      throw new Error(`Failed to get pending jobs: ${error.message}`);
    }

    return data as DeploymentJob[];
  }

  /**
   * Retry failed deployment job
   */
  static async retryJob(jobId: string): Promise<DeploymentJob> {
    const { data, error } = await supabase.rpc('retry_deployment_job', {
      job_id: jobId,
    });

    if (error) {
      throw new Error(`Failed to retry deployment job: ${error.message}`);
    }

    return data as DeploymentJob;
  }

  /**
   * Get deployment statistics
   */
  static async getStats(): Promise<DeploymentJobStats[]> {
    const { data, error } = await supabase
      .from('deployment_job_stats')
      .select('*');

    if (error) {
      throw new Error(`Failed to get deployment stats: ${error.message}`);
    }

    return data as DeploymentJobStats[];
  }

  /**
   * Delete old completed jobs (cleanup)
   */
  static async cleanupOldJobs(daysToKeep: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const { data, error } = await supabase
      .from('deployment_jobs')
      .delete()
      .in('status', ['completed', 'failed', 'cancelled'])
      .lt('created_at', cutoffDate.toISOString())
      .select('id');

    if (error) {
      throw new Error(`Failed to cleanup old jobs: ${error.message}`);
    }

    return data?.length || 0;
  }
}
