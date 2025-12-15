-- Agent Attraction Pages Schema
-- Created: 2025-12-15
-- Purpose: Store agent page customization data for personalized landing pages

-- ========================================
-- STEP 1: Create agent_pages table
-- ========================================

CREATE TABLE IF NOT EXISTS agent_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Link to existing users table
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- URL slug (firstname-lastname format)
  slug TEXT UNIQUE NOT NULL,

  -- Display name (can differ from legal name)
  display_first_name TEXT NOT NULL,
  display_last_name TEXT NOT NULL,

  -- Contact info
  email TEXT NOT NULL,
  phone TEXT,
  show_phone BOOLEAN DEFAULT false,
  phone_text_only BOOLEAN DEFAULT false,

  -- Social links (optional - only shown if populated)
  facebook_url TEXT,
  instagram_url TEXT,
  twitter_url TEXT,
  youtube_url TEXT,
  tiktok_url TEXT,
  linkedin_url TEXT,

  -- Activation status
  activated BOOLEAN DEFAULT false,
  activated_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Constraint: one page per user
  CONSTRAINT unique_user_page UNIQUE (user_id)
);

-- ========================================
-- STEP 2: Create indexes for performance
-- ========================================

CREATE INDEX idx_agent_pages_slug ON agent_pages(slug) WHERE activated = true;
CREATE INDEX idx_agent_pages_user_id ON agent_pages(user_id);
CREATE INDEX idx_agent_pages_activated ON agent_pages(activated) WHERE activated = true;

-- ========================================
-- STEP 3: Enable Row Level Security
-- ========================================

ALTER TABLE agent_pages ENABLE ROW LEVEL SECURITY;

-- Users can read their own agent page
CREATE POLICY "Users can read own agent page"
  ON agent_pages FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own agent page
CREATE POLICY "Users can update own agent page"
  ON agent_pages FOR UPDATE
  USING (auth.uid() = user_id);

-- Public can read activated agent pages (for the public-facing pages)
CREATE POLICY "Public can read activated agent pages"
  ON agent_pages FOR SELECT
  USING (activated = true);

-- Service role can insert (for GHL webhook)
CREATE POLICY "Service role can insert agent pages"
  ON agent_pages FOR INSERT
  WITH CHECK (true);

-- Admins can read all agent pages (check role directly from users table)
CREATE POLICY "Admins can read all agent pages"
  ON agent_pages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
      AND users.status = 'active'
    )
  );

-- Admins can update all agent pages
CREATE POLICY "Admins can update all agent pages"
  ON agent_pages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
      AND users.status = 'active'
    )
  );

-- Admins can delete agent pages
CREATE POLICY "Admins can delete agent pages"
  ON agent_pages FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
      AND users.status = 'active'
    )
  );

-- ========================================
-- STEP 4: Create helper functions
-- ========================================

-- Function to generate slug from name
CREATE OR REPLACE FUNCTION generate_agent_slug(first_name TEXT, last_name TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Create base slug: lowercase, replace spaces with hyphens, remove special chars
  base_slug := lower(trim(first_name)) || '-' || lower(trim(last_name));
  base_slug := regexp_replace(base_slug, '[^a-z0-9-]', '', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g'); -- Remove multiple hyphens
  base_slug := trim(both '-' from base_slug); -- Remove leading/trailing hyphens

  final_slug := base_slug;

  -- Check for uniqueness and append number if needed
  WHILE EXISTS (SELECT 1 FROM agent_pages WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter::TEXT;
  END LOOP;

  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_agent_page_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update timestamps
CREATE TRIGGER agent_page_updated_at
  BEFORE UPDATE ON agent_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_agent_page_timestamp();

-- Function to activate agent page
CREATE OR REPLACE FUNCTION activate_agent_page(page_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  success BOOLEAN := false;
BEGIN
  UPDATE agent_pages
  SET activated = true,
      activated_at = now()
  WHERE id = page_id
    AND user_id = auth.uid()
    AND activated = false;

  GET DIAGNOSTICS success = ROW_COUNT;
  RETURN success > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to deactivate agent page
CREATE OR REPLACE FUNCTION deactivate_agent_page(page_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  success BOOLEAN := false;
BEGIN
  UPDATE agent_pages
  SET activated = false,
      activated_at = NULL
  WHERE id = page_id
    AND user_id = auth.uid()
    AND activated = true;

  GET DIAGNOSTICS success = ROW_COUNT;
  RETURN success > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- STEP 5: Add comments for documentation
-- ========================================

COMMENT ON TABLE agent_pages IS 'Agent attraction page customization data for personalized landing pages';
COMMENT ON COLUMN agent_pages.slug IS 'URL slug in firstname-lastname format';
COMMENT ON COLUMN agent_pages.display_first_name IS 'Display name (can differ from legal name if agent prefers)';
COMMENT ON COLUMN agent_pages.display_last_name IS 'Display last name (can differ from legal name if agent prefers)';
COMMENT ON COLUMN agent_pages.email IS 'Contact email from GHL Email Additional field';
COMMENT ON COLUMN agent_pages.show_phone IS 'Whether to display phone number on public page';
COMMENT ON COLUMN agent_pages.phone_text_only IS 'Show "text only" indicator next to phone';
COMMENT ON COLUMN agent_pages.activated IS 'Whether the agent page is live and publicly accessible';
COMMENT ON FUNCTION generate_agent_slug IS 'Generates unique URL slug from agent name';
COMMENT ON FUNCTION activate_agent_page IS 'Activates an agent page (makes it public)';
COMMENT ON FUNCTION deactivate_agent_page IS 'Deactivates an agent page (hides from public)';
