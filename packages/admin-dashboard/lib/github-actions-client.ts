/**
 * GitHub Actions Client
 * Triggers GitHub Actions workflows via repository_dispatch
 */

export interface TriggerDeploymentParams {
  post_id?: string;
  post_slug?: string;
  post_title?: string;
  paths?: string[];
  deployment_type?: 'incremental' | 'full';
}

export interface GitHubActionsResponse {
  success: boolean;
  message: string;
  run_id?: string;
  run_url?: string;
}

export class GitHubActionsClient {
  private readonly token: string;
  private readonly owner: string;
  private readonly repo: string;

  constructor() {
    this.token = process.env.GITHUB_TOKEN || process.env.GITHUB_PAT || '';
    this.owner = process.env.GITHUB_OWNER || 'DougSmith255';
    this.repo = process.env.GITHUB_REPO || 'saabuildingblocks-platform';

    if (!this.token) {
      console.warn('GITHUB_TOKEN not configured - GitHub Actions triggering will fail');
    }
  }

  /**
   * Trigger WordPress content update workflow
   */
  async triggerDeployment(params: TriggerDeploymentParams): Promise<GitHubActionsResponse> {
    try {
      const payload = {
        event_type: 'wordpress_content_update',
        client_payload: {
          post_id: params.post_id || '',
          post_slug: params.post_slug || '',
          post_title: params.post_title || '',
          paths: params.paths || ['/blog'],
          deployment_type: params.deployment_type || 'incremental',
          timestamp: new Date().toISOString(),
        },
      };

      const response = await fetch(
        `https://api.github.com/repos/${this.owner}/${this.repo}/dispatches`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/vnd.github+json',
            'Authorization': `Bearer ${this.token}`,
            'X-GitHub-Api-Version': '2022-11-28',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`GitHub API error (${response.status}): ${errorText}`);
      }

      // repository_dispatch returns 204 No Content on success
      // We can't get the run ID immediately, need to poll for it
      const runId = await this.getLatestWorkflowRun();

      return {
        success: true,
        message: 'Deployment workflow triggered successfully',
        run_id: runId || undefined,
        run_url: runId
          ? `https://github.com/${this.owner}/${this.repo}/actions/runs/${runId}`
          : undefined,
      };
    } catch (error) {
      console.error('Failed to trigger GitHub Actions:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get latest workflow run for wordpress-content-update
   */
  private async getLatestWorkflowRun(): Promise<string | null> {
    try {
      // Wait a moment for the workflow to be created
      await new Promise(resolve => setTimeout(resolve, 2000));

      const response = await fetch(
        `https://api.github.com/repos/${this.owner}/${this.repo}/actions/workflows/wordpress-content-update.yml/runs?per_page=1`,
        {
          headers: {
            'Accept': 'application/vnd.github+json',
            'Authorization': `Bearer ${this.token}`,
            'X-GitHub-Api-Version': '2022-11-28',
          },
        }
      );

      if (!response.ok) {
        console.error('Failed to fetch workflow runs:', response.status);
        return null;
      }

      const data = await response.json();
      return data.workflow_runs?.[0]?.id?.toString() || null;
    } catch (error) {
      console.error('Error fetching workflow run:', error);
      return null;
    }
  }

  /**
   * Get workflow run status
   */
  async getWorkflowRunStatus(runId: string): Promise<{
    status: string;
    conclusion: string | null;
    html_url: string;
  } | null> {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${this.owner}/${this.repo}/actions/runs/${runId}`,
        {
          headers: {
            'Accept': 'application/vnd.github+json',
            'Authorization': `Bearer ${this.token}`,
            'X-GitHub-Api-Version': '2022-11-28',
          },
        }
      );

      if (!response.ok) {
        console.error('Failed to fetch workflow run status:', response.status);
        return null;
      }

      const data = await response.json();
      return {
        status: data.status, // queued, in_progress, completed
        conclusion: data.conclusion, // success, failure, cancelled, skipped
        html_url: data.html_url,
      };
    } catch (error) {
      console.error('Error fetching workflow run status:', error);
      return null;
    }
  }

  /**
   * Cancel workflow run
   */
  async cancelWorkflowRun(runId: string): Promise<boolean> {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${this.owner}/${this.repo}/actions/runs/${runId}/cancel`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/vnd.github+json',
            'Authorization': `Bearer ${this.token}`,
            'X-GitHub-Api-Version': '2022-11-28',
          },
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Error cancelling workflow run:', error);
      return false;
    }
  }
}
