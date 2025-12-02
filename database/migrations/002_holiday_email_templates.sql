-- ============================================================================
-- Holiday Email Templates Table
-- ============================================================================
-- Purpose: Store holiday email templates with personalization and branding
-- Created: 2025-11-22
-- ============================================================================

-- Create the table
CREATE TABLE IF NOT EXISTS holiday_email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES email_automation_categories(id) ON DELETE CASCADE,

  -- Holiday Information
  holiday_name VARCHAR(255) NOT NULL,
  holiday_slug VARCHAR(255) NOT NULL,
  holiday_date_type VARCHAR(50) DEFAULT 'fixed', -- 'fixed' or 'variable'
  holiday_month INTEGER, -- 1-12 for fixed dates
  holiday_day INTEGER, -- day of month for fixed dates

  -- Email Content
  subject_line TEXT NOT NULL,
  preview_text TEXT,
  email_html TEXT NOT NULL, -- Full HTML content
  email_json TEXT, -- JSON from email editor for future editing

  -- Personalization
  personalization_tokens JSONB DEFAULT '[]'::jsonb,

  -- Branding
  use_brand_theme BOOLEAN DEFAULT true,
  custom_colors JSONB,

  -- Status & Metadata
  is_active BOOLEAN DEFAULT true,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  last_edited_by UUID REFERENCES users(id) ON DELETE SET NULL,

  UNIQUE(category_id, holiday_slug)
);

-- ============================================================================
-- Indexes
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_holiday_templates_category
  ON holiday_email_templates(category_id);

CREATE INDEX IF NOT EXISTS idx_holiday_templates_slug
  ON holiday_email_templates(holiday_slug);

CREATE INDEX IF NOT EXISTS idx_holiday_templates_active
  ON holiday_email_templates(is_active);

CREATE INDEX IF NOT EXISTS idx_holiday_templates_date
  ON holiday_email_templates(holiday_month, holiday_day);

-- ============================================================================
-- Row-Level Security (RLS)
-- ============================================================================

-- Enable RLS
ALTER TABLE holiday_email_templates ENABLE ROW LEVEL SECURITY;

-- Policy: Admin full access (all operations)
CREATE POLICY "Admin full access to holiday templates"
  ON holiday_email_templates
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Policy: Authenticated users can view active templates
CREATE POLICY "Authenticated users can view active templates"
  ON holiday_email_templates
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND is_active = true
  );

-- ============================================================================
-- Trigger for updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_holiday_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER holiday_templates_updated_at
  BEFORE UPDATE ON holiday_email_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_holiday_templates_updated_at();

-- ============================================================================
-- Initial Seed Data (All US Federal Holidays + Halloween)
-- ============================================================================

-- Helper function to get category ID
DO $$
DECLARE
  v_category_id UUID;
  v_default_tokens JSONB := '[
    {"token": "{{firstName}}", "description": "Contact first name", "default": "Friend"},
    {"token": "{{lastName}}", "description": "Contact last name", "default": ""},
    {"token": "{{email}}", "description": "Contact email address", "default": ""}
  ]'::jsonb;
  v_default_html TEXT := '<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background-color: #1a1a1a; color: #e5e4dd; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; margin-bottom: 30px; }
    .header h1 { color: #ffd700; font-size: 32px; margin: 0; }
    .content { background: rgba(64, 64, 64, 0.5); border: 1px solid rgba(255, 215, 0, 0.2); border-radius: 8px; padding: 30px; }
    .content p { line-height: 1.6; color: #dcdbd5; }
    .greeting { color: #00ff88; font-size: 18px; font-weight: bold; }
    .footer { text-align: center; margin-top: 30px; color: #8a8a8a; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>HOLIDAY_TITLE</h1>
    </div>
    <div class="content">
      <p class="greeting">Hello {{firstName}},</p>
      <p>HOLIDAY_MESSAGE</p>
      <p>To your continued success,<br>The Smart Agent Alliance Team</p>
    </div>
    <div class="footer">
      <p>Smart Agent Alliance | Building the Future of AI Collaboration</p>
    </div>
  </div>
</body>
</html>';
BEGIN
  -- Get the greeting-emails category ID
  SELECT id INTO v_category_id FROM email_automation_categories WHERE slug = 'greeting-emails';

  -- 1. New Year's Day – January 1
  INSERT INTO holiday_email_templates (category_id, holiday_name, holiday_slug, holiday_date_type, holiday_month, holiday_day, subject_line, preview_text, email_html, personalization_tokens, use_brand_theme, is_active)
  VALUES (v_category_id, 'New Year''s Day', 'new-years-day', 'fixed', 1, 1, 'Happy New Year from Smart Agent Alliance! 🎉', 'Wishing you success and prosperity in the new year',
    REPLACE(REPLACE(v_default_html, 'HOLIDAY_TITLE', '🎉 Happy New Year! 🎉'), 'HOLIDAY_MESSAGE', 'As we step into a brand new year, I wanted to thank you for being part of the Smart Agent Alliance family. This year brings incredible opportunities for growth and success!'),
    v_default_tokens, true, true)
  ON CONFLICT (category_id, holiday_slug) DO NOTHING;

  -- 2. Martin Luther King Jr. Day – Third Monday in January
  INSERT INTO holiday_email_templates (category_id, holiday_name, holiday_slug, holiday_date_type, holiday_month, holiday_day, subject_line, preview_text, email_html, personalization_tokens, use_brand_theme, is_active)
  VALUES (v_category_id, 'Martin Luther King Jr. Day', 'mlk-day', 'variable', 1, NULL, 'Honoring Dr. King''s Legacy - Smart Agent Alliance', 'Reflecting on leadership, unity, and positive change',
    REPLACE(REPLACE(v_default_html, 'HOLIDAY_TITLE', '✊ Martin Luther King Jr. Day'), 'HOLIDAY_MESSAGE', 'Today we honor Dr. Martin Luther King Jr. and his legacy of leadership, equality, and positive change. His vision reminds us of the power of unity and purpose in building a better future together.'),
    v_default_tokens, true, true)
  ON CONFLICT (category_id, holiday_slug) DO NOTHING;

  -- 3. Presidents' Day – Third Monday in February
  INSERT INTO holiday_email_templates (category_id, holiday_name, holiday_slug, holiday_date_type, holiday_month, holiday_day, subject_line, preview_text, email_html, personalization_tokens, use_brand_theme, is_active)
  VALUES (v_category_id, 'Presidents'' Day', 'presidents-day', 'variable', 2, NULL, 'Presidents'' Day Greetings from SAA 🇺🇸', 'Celebrating leadership and dedication',
    REPLACE(REPLACE(v_default_html, 'HOLIDAY_TITLE', '🇺🇸 Happy Presidents'' Day'), 'HOLIDAY_MESSAGE', 'On this Presidents'' Day, we celebrate the spirit of leadership and dedication. As we build the future with AI, these values guide our mission at Smart Agent Alliance.'),
    v_default_tokens, true, true)
  ON CONFLICT (category_id, holiday_slug) DO NOTHING;

  -- 4. Memorial Day – Last Monday in May
  INSERT INTO holiday_email_templates (category_id, holiday_name, holiday_slug, holiday_date_type, holiday_month, holiday_day, subject_line, preview_text, email_html, personalization_tokens, use_brand_theme, is_active)
  VALUES (v_category_id, 'Memorial Day', 'memorial-day', 'variable', 5, NULL, 'Honoring Those Who Served - Memorial Day 🇺🇸', 'Remembering the brave heroes',
    REPLACE(REPLACE(v_default_html, 'HOLIDAY_TITLE', '🇺🇸 Memorial Day'), 'HOLIDAY_MESSAGE', 'Today we honor and remember the brave men and women who made the ultimate sacrifice for our freedom. Their courage and dedication will never be forgotten.'),
    v_default_tokens, true, true)
  ON CONFLICT (category_id, holiday_slug) DO NOTHING;

  -- 5. Juneteenth – June 19
  INSERT INTO holiday_email_templates (category_id, holiday_name, holiday_slug, holiday_date_type, holiday_month, holiday_day, subject_line, preview_text, email_html, personalization_tokens, use_brand_theme, is_active)
  VALUES (v_category_id, 'Juneteenth National Independence Day', 'juneteenth', 'fixed', 6, 19, 'Celebrating Juneteenth - Freedom & Unity', 'Honoring freedom and progress',
    REPLACE(REPLACE(v_default_html, 'HOLIDAY_TITLE', '✊ Happy Juneteenth'), 'HOLIDAY_MESSAGE', 'Today we celebrate Juneteenth, commemorating the end of slavery and honoring the ongoing journey toward freedom, equality, and unity for all.'),
    v_default_tokens, true, true)
  ON CONFLICT (category_id, holiday_slug) DO NOTHING;

  -- 6. Independence Day – July 4
  INSERT INTO holiday_email_templates (category_id, holiday_name, holiday_slug, holiday_date_type, holiday_month, holiday_day, subject_line, preview_text, email_html, personalization_tokens, use_brand_theme, is_active)
  VALUES (v_category_id, 'Independence Day', 'independence-day', 'fixed', 7, 4, 'Happy 4th of July from Smart Agent Alliance! 🎆', 'Celebrating freedom and independence',
    REPLACE(REPLACE(v_default_html, 'HOLIDAY_TITLE', '🎆 Happy Independence Day! 🇺🇸'), 'HOLIDAY_MESSAGE', 'Happy 4th of July! Today we celebrate freedom, independence, and the innovative spirit that drives us forward. Here''s to building the future together!'),
    v_default_tokens, true, true)
  ON CONFLICT (category_id, holiday_slug) DO NOTHING;

  -- 7. Labor Day – First Monday in September
  INSERT INTO holiday_email_templates (category_id, holiday_name, holiday_slug, holiday_date_type, holiday_month, holiday_day, subject_line, preview_text, email_html, personalization_tokens, use_brand_theme, is_active)
  VALUES (v_category_id, 'Labor Day', 'labor-day', 'variable', 9, NULL, 'Happy Labor Day from Smart Agent Alliance! 💪', 'Celebrating hard work and dedication',
    REPLACE(REPLACE(v_default_html, 'HOLIDAY_TITLE', '💪 Happy Labor Day'), 'HOLIDAY_MESSAGE', 'Happy Labor Day! Today we celebrate the hard work and dedication that drives innovation and success. Thank you for being part of our journey!'),
    v_default_tokens, true, true)
  ON CONFLICT (category_id, holiday_slug) DO NOTHING;

  -- 8. Columbus Day / Indigenous Peoples' Day – Second Monday in October
  INSERT INTO holiday_email_templates (category_id, holiday_name, holiday_slug, holiday_date_type, holiday_month, holiday_day, subject_line, preview_text, email_html, personalization_tokens, use_brand_theme, is_active)
  VALUES (v_category_id, 'Indigenous Peoples'' Day', 'indigenous-peoples-day', 'variable', 10, NULL, 'Honoring Indigenous Peoples'' Day', 'Celebrating heritage and resilience',
    REPLACE(REPLACE(v_default_html, 'HOLIDAY_TITLE', '🌎 Indigenous Peoples'' Day'), 'HOLIDAY_MESSAGE', 'Today we honor the rich heritage, culture, and resilience of Indigenous peoples. We celebrate their contributions and recognize the importance of diversity and inclusion.'),
    v_default_tokens, true, true)
  ON CONFLICT (category_id, holiday_slug) DO NOTHING;

  -- 9. Halloween – October 31
  INSERT INTO holiday_email_templates (category_id, holiday_name, holiday_slug, holiday_date_type, holiday_month, holiday_day, subject_line, preview_text, email_html, personalization_tokens, use_brand_theme, is_active)
  VALUES (v_category_id, 'Halloween', 'halloween', 'fixed', 10, 31, 'Happy Halloween from Smart Agent Alliance! 🎃', 'Wishing you a spook-tacular celebration',
    REPLACE(REPLACE(v_default_html, 'HOLIDAY_TITLE', '🎃 Happy Halloween! 👻'), 'HOLIDAY_MESSAGE', 'Happy Halloween! May your day be filled with treats (not tricks!) and spooky fun. Here''s to a frightfully good time!'),
    v_default_tokens, true, true)
  ON CONFLICT (category_id, holiday_slug) DO NOTHING;

  -- 10. Veterans Day – November 11
  INSERT INTO holiday_email_templates (category_id, holiday_name, holiday_slug, holiday_date_type, holiday_month, holiday_day, subject_line, preview_text, email_html, personalization_tokens, use_brand_theme, is_active)
  VALUES (v_category_id, 'Veterans Day', 'veterans-day', 'fixed', 11, 11, 'Honoring Our Veterans - Thank You for Your Service 🇺🇸', 'Gratitude for those who served',
    REPLACE(REPLACE(v_default_html, 'HOLIDAY_TITLE', '🇺🇸 Veterans Day'), 'HOLIDAY_MESSAGE', 'On Veterans Day, we honor all who have served in our armed forces. Thank you for your courage, sacrifice, and dedication to protecting our freedom.'),
    v_default_tokens, true, true)
  ON CONFLICT (category_id, holiday_slug) DO NOTHING;

  -- 11. Thanksgiving – Fourth Thursday in November
  INSERT INTO holiday_email_templates (category_id, holiday_name, holiday_slug, holiday_date_type, holiday_month, holiday_day, subject_line, preview_text, email_html, personalization_tokens, use_brand_theme, is_active)
  VALUES (v_category_id, 'Thanksgiving Day', 'thanksgiving', 'variable', 11, NULL, 'Happy Thanksgiving from Smart Agent Alliance! 🦃', 'Grateful for you and our community',
    REPLACE(REPLACE(v_default_html, 'HOLIDAY_TITLE', '🦃 Happy Thanksgiving! 🍂'), 'HOLIDAY_MESSAGE', 'Happy Thanksgiving! We''re grateful for you and the incredible community we''re building together. May your day be filled with warmth, joy, and wonderful memories.'),
    v_default_tokens, true, true)
  ON CONFLICT (category_id, holiday_slug) DO NOTHING;

  -- 12. Christmas Day – December 25
  INSERT INTO holiday_email_templates (category_id, holiday_name, holiday_slug, holiday_date_type, holiday_month, holiday_day, subject_line, preview_text, email_html, personalization_tokens, use_brand_theme, is_active)
  VALUES (v_category_id, 'Christmas Day', 'christmas', 'fixed', 12, 25, 'Merry Christmas from Smart Agent Alliance! 🎄', 'Wishing you joy and celebration',
    REPLACE(REPLACE(v_default_html, 'HOLIDAY_TITLE', '🎄 Merry Christmas! 🎅'), 'HOLIDAY_MESSAGE', 'Merry Christmas! May your holiday season be filled with joy, love, and the warmth of family and friends. Here''s to a wonderful celebration and a bright new year ahead!'),
    v_default_tokens, true, true)
  ON CONFLICT (category_id, holiday_slug) DO NOTHING;

END $$;

-- ============================================================================
-- Verification Query
-- ============================================================================

-- Run this to verify the table was created successfully:
-- SELECT holiday_name, holiday_slug, subject_line, is_active FROM holiday_email_templates;
