-- ============================================================================
-- Email Automation Categories Table
-- ============================================================================
-- Purpose: Store categories for email automations (e.g., "Greeting Emails")
-- Created: 2025-11-22
-- ============================================================================

-- Create the table
CREATE TABLE IF NOT EXISTS email_automation_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Category Information
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50), -- lucide-react icon name (e.g., 'Mail', 'Heart', 'Gift')

  -- Display & Status
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,

  -- Audit Fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================================
-- Indexes
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_email_categories_slug
  ON email_automation_categories(slug);

CREATE INDEX IF NOT EXISTS idx_email_categories_active
  ON email_automation_categories(is_active);

CREATE INDEX IF NOT EXISTS idx_email_categories_display_order
  ON email_automation_categories(display_order);

-- ============================================================================
-- Row-Level Security (RLS)
-- ============================================================================

-- Enable RLS
ALTER TABLE email_automation_categories ENABLE ROW LEVEL SECURITY;

-- Policy: Admin full access (all operations)
CREATE POLICY "Admin full access to email categories"
  ON email_automation_categories
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Policy: Authenticated users can view active categories
CREATE POLICY "Authenticated users can view active categories"
  ON email_automation_categories
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND is_active = true
  );

-- ============================================================================
-- Trigger for updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_email_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER email_categories_updated_at
  BEFORE UPDATE ON email_automation_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_email_categories_updated_at();

-- ============================================================================
-- Initial Seed Data
-- ============================================================================

INSERT INTO email_automation_categories (name, slug, description, icon, display_order, is_active)
VALUES
  ('Greeting Emails', 'greeting-emails', 'Holiday and special occasion greeting emails for your downline', 'Mail', 1, true)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- Verification Query
-- ============================================================================

-- Run this to verify the table was created successfully:
-- SELECT * FROM email_automation_categories;
