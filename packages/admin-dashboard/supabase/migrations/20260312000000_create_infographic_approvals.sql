-- Tracks approval status for infographics
-- When approved, the infographic gets auto-placed into its mapped WordPress blog post
-- When unapproved, it gets removed
CREATE TABLE IF NOT EXISTS infographic_approvals (
  id TEXT PRIMARY KEY,                    -- matches infographic ID from InfographicsTab
  approved BOOLEAN NOT NULL DEFAULT false,
  approved_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE infographic_approvals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for service role"
  ON infographic_approvals FOR ALL USING (true);
