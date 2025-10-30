-- Migration: Create deployment_logs table
-- Description: Logs all deployment activities (CSS regeneration, Cloudflare deployments, WordPress webhooks)
-- Created: 2025-10-30

-- =============================================================================
-- TABLE: deployment_logs
-- =============================================================================

CREATE TABLE IF NOT EXISTS deployment_logs (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Trigger information
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('css', 'deploy', 'blog')),
  triggered_by TEXT, -- 'master-controller', 'wordpress', 'manual', etc.

  -- User information (optional - for admin-initiated deployments)
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Status tracking
  status TEXT NOT NULL CHECK (status IN ('triggered', 'running', 'success', 'error', 'cancelled')),

  -- Performance metrics
  duration INTEGER, -- Duration in milliseconds

  -- Additional metadata (JSON for flexibility)
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Error information (if status = 'error')
  error_message TEXT,
  error_stack TEXT
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Index for querying by trigger type
CREATE INDEX IF NOT EXISTS idx_deployment_logs_trigger_type
  ON deployment_logs(trigger_type);

-- Index for querying by status
CREATE INDEX IF NOT EXISTS idx_deployment_logs_status
  ON deployment_logs(status);

-- Index for querying by user
CREATE INDEX IF NOT EXISTS idx_deployment_logs_user_id
  ON deployment_logs(user_id);

-- Index for querying by created_at (most recent first)
CREATE INDEX IF NOT EXISTS idx_deployment_logs_created_at
  ON deployment_logs(created_at DESC);

-- Index for querying by triggered_by
CREATE INDEX IF NOT EXISTS idx_deployment_logs_triggered_by
  ON deployment_logs(triggered_by);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS
ALTER TABLE deployment_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Admin users can view all logs
CREATE POLICY "Admin users can view all deployment logs"
  ON deployment_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Policy: Admin users can insert logs
CREATE POLICY "Admin users can insert deployment logs"
  ON deployment_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Policy: Service role can do everything (for API routes)
CREATE POLICY "Service role can manage deployment logs"
  ON deployment_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_deployment_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-update updated_at
CREATE TRIGGER trigger_update_deployment_logs_updated_at
  BEFORE UPDATE ON deployment_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_deployment_logs_updated_at();

-- =============================================================================
-- SAMPLE QUERIES (for reference)
-- =============================================================================

-- Get recent deployments
-- SELECT * FROM deployment_logs ORDER BY created_at DESC LIMIT 10;

-- Get deployments by type
-- SELECT * FROM deployment_logs WHERE trigger_type = 'blog' ORDER BY created_at DESC;

-- Get failed deployments
-- SELECT * FROM deployment_logs WHERE status = 'error' ORDER BY created_at DESC;

-- Get deployment statistics
-- SELECT
--   trigger_type,
--   status,
--   COUNT(*) as count,
--   AVG(duration) as avg_duration_ms,
--   MAX(duration) as max_duration_ms
-- FROM deployment_logs
-- GROUP BY trigger_type, status;

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE deployment_logs IS 'Logs all deployment activities including CSS regeneration, Cloudflare deployments, and WordPress webhook triggers';
COMMENT ON COLUMN deployment_logs.trigger_type IS 'Type of deployment: css (CSS regeneration), deploy (manual Cloudflare deployment), blog (WordPress webhook)';
COMMENT ON COLUMN deployment_logs.triggered_by IS 'Source of trigger: master-controller, wordpress, manual, etc.';
COMMENT ON COLUMN deployment_logs.status IS 'Deployment status: triggered, running, success, error, cancelled';
COMMENT ON COLUMN deployment_logs.duration IS 'Duration of operation in milliseconds';
COMMENT ON COLUMN deployment_logs.metadata IS 'Additional context as JSON (e.g., post_id, deployment_type, GitHub workflow info)';
