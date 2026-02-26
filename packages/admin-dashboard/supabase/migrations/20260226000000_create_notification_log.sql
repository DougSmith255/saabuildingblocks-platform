-- =============================================================================
-- Notification Log Table
-- Tracks all automated notifications (email + in-app) with dry-run support
-- =============================================================================

CREATE TABLE IF NOT EXISTS notification_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Who
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,

  -- What
  notification_type TEXT NOT NULL CHECK (notification_type IN (
    'activation_reminder',
    'link_page_nudge',
    'in_app_link_page'
  )),

  -- Channel
  channel TEXT NOT NULL CHECK (channel IN ('email', 'in_app')),

  -- Result
  status TEXT NOT NULL DEFAULT 'dry_run' CHECK (status IN (
    'dry_run',
    'sent',
    'failed',
    'skipped'
  )),

  -- Email details (null for in_app)
  email_message_id TEXT,
  email_error TEXT,

  -- Context
  trigger_reason TEXT,
  metadata JSONB DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Prevent duplicate sends per user per type per day
CREATE UNIQUE INDEX idx_notification_log_unique_per_day
  ON notification_log(user_id, notification_type, channel, ((created_at AT TIME ZONE 'UTC')::date));

-- Index for cron sweep queries
CREATE INDEX idx_notification_log_type_date ON notification_log(notification_type, created_at);
CREATE INDEX idx_notification_log_user ON notification_log(user_id);

-- RLS: Only service role can read/write
ALTER TABLE notification_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON notification_log
  FOR ALL USING (auth.role() = 'service_role');

COMMENT ON TABLE notification_log IS 'Tracks automated notification sends (email + in-app) with dry-run mode support';
