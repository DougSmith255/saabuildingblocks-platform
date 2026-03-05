-- Platform Errors
-- Centralized error log for all critical API routes and Cloudflare Functions.

CREATE TABLE IF NOT EXISTS platform_errors (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source TEXT NOT NULL,                -- API route path or 'cf:join-team'
  severity TEXT NOT NULL DEFAULT 'error' CHECK (severity IN ('warning', 'error', 'critical')),
  error_code TEXT,                     -- e.g. 'ACTIVATION_FAILED'
  error_message TEXT NOT NULL,
  stack_trace TEXT,
  user_id UUID,
  request_path TEXT,
  request_method TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'resolved')),
  reviewed_by TEXT,
  resolved_at TIMESTAMPTZ
);

-- Indexes for common query patterns
CREATE INDEX idx_platform_errors_created_at ON platform_errors (created_at DESC);
CREATE INDEX idx_platform_errors_status ON platform_errors (status);
CREATE INDEX idx_platform_errors_severity ON platform_errors (severity);
CREATE INDEX idx_platform_errors_source ON platform_errors (source);

-- RLS: Only service role can read/write
ALTER TABLE platform_errors ENABLE ROW LEVEL SECURITY;

-- Auto-purge entries older than 90 days (runs on insert to keep table lean)
CREATE OR REPLACE FUNCTION purge_old_platform_errors()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM platform_errors WHERE created_at < now() - INTERVAL '90 days';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fire purge on every 100th insert (not every insert, to avoid overhead)
-- We use a simple modulo check on the new row's id
CREATE OR REPLACE FUNCTION maybe_purge_platform_errors()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.id % 100 = 0 THEN
    DELETE FROM platform_errors WHERE created_at < now() - INTERVAL '90 days';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_purge_old_platform_errors
  AFTER INSERT ON platform_errors
  FOR EACH ROW
  EXECUTE FUNCTION maybe_purge_platform_errors();
