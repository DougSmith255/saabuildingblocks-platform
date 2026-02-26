-- =============================================================================
-- FIX: RLS + Missing Indexes across all public tables
-- Addresses performance + security warnings from Supabase Lint
-- Run date: 2026-02-26
-- =============================================================================

-- =============================================
-- PART 1: ENABLE RLS ON TABLES MISSING IT
-- =============================================

ALTER TABLE blog_templates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access" ON blog_templates;
CREATE POLICY "Service role full access" ON blog_templates
  FOR ALL USING (auth.role() = 'service_role');

ALTER TABLE dino_high_scores ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read high scores" ON dino_high_scores;
CREATE POLICY "Public read high scores" ON dino_high_scores
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "Service role full access" ON dino_high_scores;
CREATE POLICY "Service role full access" ON dino_high_scores
  FOR ALL USING (auth.role() = 'service_role');

ALTER TABLE email_typography_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access" ON email_typography_settings;
CREATE POLICY "Service role full access" ON email_typography_settings
  FOR ALL USING (auth.role() = 'service_role');

ALTER TABLE master_controller_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access" ON master_controller_settings;
CREATE POLICY "Service role full access" ON master_controller_settings
  FOR ALL USING (auth.role() = 'service_role');

ALTER TABLE page_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access" ON page_events;
CREATE POLICY "Service role full access" ON page_events
  FOR ALL USING (auth.role() = 'service_role');

ALTER TABLE agent_suggestions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access" ON agent_suggestions;
CREATE POLICY "Service role full access" ON agent_suggestions
  FOR ALL USING (auth.role() = 'service_role');

ALTER TABLE blog_template_assignments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access" ON blog_template_assignments;
CREATE POLICY "Service role full access" ON blog_template_assignments
  FOR ALL USING (auth.role() = 'service_role');

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access" ON user_profiles;
CREATE POLICY "Service role full access" ON user_profiles
  FOR ALL USING (auth.role() = 'service_role');

ALTER TABLE youtube_oauth_tokens ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access" ON youtube_oauth_tokens;
CREATE POLICY "Service role full access" ON youtube_oauth_tokens
  FOR ALL USING (auth.role() = 'service_role');

-- =============================================
-- PART 2: FIX RECURSIVE RLS POLICIES (42P17)
-- =============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'users' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON users', pol.policyname);
  END LOOP;
END $$;
CREATE POLICY "Service role full access" ON users
  FOR ALL USING (auth.role() = 'service_role');

DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'audit_logs' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON audit_logs', pol.policyname);
  END LOOP;
END $$;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON audit_logs
  FOR ALL USING (auth.role() = 'service_role');

DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'email_automation_categories' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON email_automation_categories', pol.policyname);
  END LOOP;
END $$;
ALTER TABLE email_automation_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON email_automation_categories
  FOR ALL USING (auth.role() = 'service_role');

DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'email_automation_schedules' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON email_automation_schedules', pol.policyname);
  END LOOP;
END $$;
ALTER TABLE email_automation_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON email_automation_schedules
  FOR ALL USING (auth.role() = 'service_role');

DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'email_send_logs' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON email_send_logs', pol.policyname);
  END LOOP;
END $$;
ALTER TABLE email_send_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON email_send_logs
  FOR ALL USING (auth.role() = 'service_role');

DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'user_invitations' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON user_invitations', pol.policyname);
  END LOOP;
END $$;
ALTER TABLE user_invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON user_invitations
  FOR ALL USING (auth.role() = 'service_role');

DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'agent_pages' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON agent_pages', pol.policyname);
  END LOOP;
END $$;
CREATE POLICY "Public read activated pages" ON agent_pages
  FOR SELECT USING (activated = true);
CREATE POLICY "Service role full access" ON agent_pages
  FOR ALL USING (auth.role() = 'service_role');

-- =============================================
-- PART 3: FIX MIGRATION TABLES WITH BROKEN RLS
-- =============================================

DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'exp_guest_pass_logs' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON exp_guest_pass_logs', pol.policyname);
  END LOOP;
END $$;
ALTER TABLE exp_guest_pass_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON exp_guest_pass_logs
  FOR ALL USING (auth.role() = 'service_role');

DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'http_404_paths' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON http_404_paths', pol.policyname);
  END LOOP;
END $$;
ALTER TABLE http_404_paths ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON http_404_paths
  FOR ALL USING (auth.role() = 'service_role');

DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'master_controller_tokens' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON master_controller_tokens', pol.policyname);
  END LOOP;
END $$;
ALTER TABLE master_controller_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON master_controller_tokens
  FOR ALL USING (auth.role() = 'service_role');

-- =============================================
-- PART 4: ADD MISSING FK INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_token_vault_settings_user_id
  ON token_vault_settings(user_id);

CREATE INDEX IF NOT EXISTS idx_mc_tokens_deleted_by
  ON master_controller_tokens(deleted_by) WHERE deleted_by IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id
  ON refresh_tokens(user_id);

CREATE INDEX IF NOT EXISTS idx_user_invitations_user_id
  ON user_invitations(user_id);

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id
  ON user_profiles(user_id);

CREATE INDEX IF NOT EXISTS idx_youtube_oauth_tokens_user_id
  ON youtube_oauth_tokens(user_id);

CREATE INDEX IF NOT EXISTS idx_agent_suggestions_user_id
  ON agent_suggestions(user_id);

CREATE INDEX IF NOT EXISTS idx_blog_templates_created_by
  ON blog_templates(created_by) WHERE created_by IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_email_auto_categories_created_by
  ON email_automation_categories(created_by) WHERE created_by IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_email_auto_schedules_created_by
  ON email_automation_schedules(created_by) WHERE created_by IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_email_auto_schedules_template_id
  ON email_automation_schedules(template_id);

CREATE INDEX IF NOT EXISTS idx_email_send_logs_schedule_id
  ON email_send_logs(schedule_id) WHERE schedule_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_email_send_logs_template_id
  ON email_send_logs(template_id) WHERE template_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_page_events_agent_page_id
  ON page_events(agent_page_id) WHERE agent_page_id IS NOT NULL;

-- NOTE: email_send_stats is a VIEW, not a table — cannot enable RLS on views
-- NOTE: holiday_email_templates excluded — will be rebuilt later
