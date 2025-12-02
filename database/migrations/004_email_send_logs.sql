-- ============================================================================
-- Email Send Logs Table
-- ============================================================================
-- Purpose: Track individual email sends for auditing and delivery status
-- Created: 2025-11-22
-- ============================================================================

-- Create the table
CREATE TABLE IF NOT EXISTS email_send_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID REFERENCES email_automation_schedules(id) ON DELETE CASCADE,
  template_id UUID REFERENCES holiday_email_templates(id) ON DELETE SET NULL,

  -- Recipient Information
  ghl_contact_id VARCHAR(255) NOT NULL,
  recipient_email VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(255),

  -- Email Details
  subject_line TEXT NOT NULL,
  personalized_content TEXT, -- Content after token replacement

  -- Delivery Status
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'bounced', 'failed'
  email_provider VARCHAR(50), -- 'wordpress-smtp', 'resend', 'n8n-fallback'
  message_id VARCHAR(255), -- Provider's message ID

  -- Timestamps
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  bounced_at TIMESTAMPTZ,

  -- Error Tracking
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,

  -- Audit Fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Indexes
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_send_logs_schedule
  ON email_send_logs(schedule_id);

CREATE INDEX IF NOT EXISTS idx_send_logs_template
  ON email_send_logs(template_id);

CREATE INDEX IF NOT EXISTS idx_send_logs_contact
  ON email_send_logs(ghl_contact_id);

CREATE INDEX IF NOT EXISTS idx_send_logs_email
  ON email_send_logs(recipient_email);

CREATE INDEX IF NOT EXISTS idx_send_logs_status
  ON email_send_logs(status);

CREATE INDEX IF NOT EXISTS idx_send_logs_sent_at
  ON email_send_logs(sent_at);

CREATE INDEX IF NOT EXISTS idx_send_logs_created_at
  ON email_send_logs(created_at);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_send_logs_schedule_status
  ON email_send_logs(schedule_id, status);

-- ============================================================================
-- Row-Level Security (RLS)
-- ============================================================================

-- Enable RLS
ALTER TABLE email_send_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Admin can view all logs
CREATE POLICY "Admin view all email send logs"
  ON email_send_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Policy: Admin can insert logs (for system use)
CREATE POLICY "Admin insert email send logs"
  ON email_send_logs
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Policy: Admin can update logs (status changes)
CREATE POLICY "Admin update email send logs"
  ON email_send_logs
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- ============================================================================
-- Trigger for updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_send_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER send_logs_updated_at
  BEFORE UPDATE ON email_send_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_send_logs_updated_at();

-- ============================================================================
-- Statistics View for Dashboard
-- ============================================================================

CREATE OR REPLACE VIEW email_send_stats AS
SELECT
  schedule_id,
  COUNT(*) AS total_emails,
  COUNT(*) FILTER (WHERE status = 'sent') AS sent_count,
  COUNT(*) FILTER (WHERE status = 'delivered') AS delivered_count,
  COUNT(*) FILTER (WHERE status = 'bounced') AS bounced_count,
  COUNT(*) FILTER (WHERE status = 'failed') AS failed_count,
  COUNT(*) FILTER (WHERE status = 'pending') AS pending_count,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE status IN ('sent', 'delivered')) / NULLIF(COUNT(*), 0),
    2
  ) AS success_rate,
  MIN(sent_at) AS first_sent_at,
  MAX(sent_at) AS last_sent_at
FROM email_send_logs
GROUP BY schedule_id;

-- Grant access to the view
GRANT SELECT ON email_send_stats TO authenticated;

-- ============================================================================
-- Helper Function: Get Send Logs Summary
-- ============================================================================

CREATE OR REPLACE FUNCTION get_send_logs_summary(
  p_schedule_id UUID DEFAULT NULL,
  p_start_date TIMESTAMPTZ DEFAULT NULL,
  p_end_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE (
  total_emails BIGINT,
  sent_count BIGINT,
  delivered_count BIGINT,
  bounced_count BIGINT,
  failed_count BIGINT,
  pending_count BIGINT,
  success_rate NUMERIC,
  avg_retry_count NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) AS total_emails,
    COUNT(*) FILTER (WHERE status = 'sent') AS sent_count,
    COUNT(*) FILTER (WHERE status = 'delivered') AS delivered_count,
    COUNT(*) FILTER (WHERE status = 'bounced') AS bounced_count,
    COUNT(*) FILTER (WHERE status = 'failed') AS failed_count,
    COUNT(*) FILTER (WHERE status = 'pending') AS pending_count,
    ROUND(
      100.0 * COUNT(*) FILTER (WHERE status IN ('sent', 'delivered')) / NULLIF(COUNT(*), 0),
      2
    ) AS success_rate,
    ROUND(AVG(retry_count), 2) AS avg_retry_count
  FROM email_send_logs
  WHERE
    (p_schedule_id IS NULL OR schedule_id = p_schedule_id)
    AND (p_start_date IS NULL OR created_at >= p_start_date)
    AND (p_end_date IS NULL OR created_at <= p_end_date);
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- Verification Query
-- ============================================================================

-- Run this to verify the table was created successfully:
-- SELECT * FROM email_send_logs LIMIT 10;

-- Test the statistics view:
-- SELECT * FROM email_send_stats;

-- Test the summary function:
-- SELECT * FROM get_send_logs_summary();
