-- Automation Health State
-- Tracks last known status per automation so health-check alerts only fire on NEW state changes.
-- One row per automation (~30 rows total).

CREATE TABLE IF NOT EXISTS automation_health_state (
  automation_id TEXT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'broken')),
  last_checked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  broke_at TIMESTAMPTZ,
  alert_sent_at TIMESTAMPTZ
);

-- RLS: Only service role can read/write (machine-to-machine route)
ALTER TABLE automation_health_state ENABLE ROW LEVEL SECURITY;
