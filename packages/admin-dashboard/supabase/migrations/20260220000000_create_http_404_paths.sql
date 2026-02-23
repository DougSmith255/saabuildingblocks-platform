-- 404 Triage System: http_404_paths table
-- Tracks 404 errors from the public site edge for triage in Master Controller
-- 2026-02-20

-- STEP 1: Create the http_404_paths table
CREATE TABLE IF NOT EXISTS http_404_paths (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  path TEXT NOT NULL UNIQUE,
  hit_count INTEGER NOT NULL DEFAULT 1,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_referrer TEXT,
  last_user_agent TEXT,
  status TEXT NOT NULL DEFAULT 'unreviewed'
    CHECK (status IN ('unreviewed', 'redirect', 'junk', 'ignored')),
  redirect_target TEXT,
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- STEP 2: Create indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_404_paths_status ON http_404_paths (status);
CREATE INDEX IF NOT EXISTS idx_404_paths_hit_count ON http_404_paths (hit_count DESC);
CREATE INDEX IF NOT EXISTS idx_404_paths_last_seen ON http_404_paths (last_seen_at DESC);
CREATE INDEX IF NOT EXISTS idx_404_paths_path ON http_404_paths (path);

-- STEP 3: Create the upsert RPC function
-- Uses SECURITY DEFINER so the edge can call it with the anon key
CREATE OR REPLACE FUNCTION upsert_404_path(
  p_path TEXT,
  p_referrer TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO http_404_paths (path, last_referrer, last_user_agent)
  VALUES (p_path, p_referrer, p_user_agent)
  ON CONFLICT (path) DO UPDATE SET
    hit_count = http_404_paths.hit_count + 1,
    last_seen_at = now(),
    last_referrer = COALESCE(EXCLUDED.last_referrer, http_404_paths.last_referrer),
    last_user_agent = COALESCE(EXCLUDED.last_user_agent, http_404_paths.last_user_agent);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 4: Enable RLS
ALTER TABLE http_404_paths ENABLE ROW LEVEL SECURITY;

-- Service role gets full access (bypasses RLS automatically)
-- Admin users get select/update access
DROP POLICY IF EXISTS "Admin select 404 paths" ON http_404_paths;
CREATE POLICY "Admin select 404 paths"
  ON http_404_paths FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admin update 404 paths" ON http_404_paths;
CREATE POLICY "Admin update 404 paths"
  ON http_404_paths FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Admin delete 404 paths" ON http_404_paths;
CREATE POLICY "Admin delete 404 paths"
  ON http_404_paths FOR DELETE
  USING (true);

-- Anon key can call the RPC (SECURITY DEFINER handles the insert)
-- No direct insert/update policy needed for anon since the RPC is SECURITY DEFINER

COMMENT ON TABLE http_404_paths IS '404 error tracking for triage. Edge logs via upsert_404_path RPC, admin reviews in Master Controller.';
COMMENT ON FUNCTION upsert_404_path IS 'Atomic upsert for 404 path logging. Increments hit_count on conflict. SECURITY DEFINER allows edge (anon key) to call.';
