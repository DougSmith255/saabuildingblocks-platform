CREATE TABLE video_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id TEXT NOT NULL,
  session_id TEXT NOT NULL UNIQUE,
  visitor_id TEXT,
  page_url TEXT,
  slug TEXT,
  watch_time_seconds NUMERIC DEFAULT 0,
  video_duration_seconds NUMERIC,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_video_views_video_created ON video_views(video_id, created_at);
CREATE INDEX idx_video_views_session ON video_views(session_id);

ALTER TABLE video_views ENABLE ROW LEVEL SECURITY;
-- Service role only (API uses getSupabaseServiceClient)
CREATE POLICY "Service role full access" ON video_views
  FOR ALL USING (auth.role() = 'service_role');

-- Upsert function: uses GREATEST so watch_time only increases
CREATE OR REPLACE FUNCTION upsert_video_view(
  p_video_id TEXT,
  p_session_id TEXT,
  p_visitor_id TEXT,
  p_page_url TEXT,
  p_slug TEXT,
  p_watch_time_seconds NUMERIC,
  p_video_duration_seconds NUMERIC,
  p_completed BOOLEAN
) RETURNS void AS $$
BEGIN
  INSERT INTO video_views (video_id, session_id, visitor_id, page_url, slug, watch_time_seconds, video_duration_seconds, completed)
  VALUES (p_video_id, p_session_id, p_visitor_id, p_page_url, p_slug, p_watch_time_seconds, p_video_duration_seconds, p_completed)
  ON CONFLICT (session_id) DO UPDATE SET
    watch_time_seconds = GREATEST(video_views.watch_time_seconds, EXCLUDED.watch_time_seconds),
    video_duration_seconds = COALESCE(EXCLUDED.video_duration_seconds, video_views.video_duration_seconds),
    completed = video_views.completed OR EXCLUDED.completed,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
