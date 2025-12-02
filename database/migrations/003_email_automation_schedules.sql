-- ============================================================================
-- Email Automation Schedules Table
-- ============================================================================
-- Purpose: Store scheduled email sends for specific holidays/dates
-- Created: 2025-11-22
-- ============================================================================

-- Create the table
CREATE TABLE IF NOT EXISTS email_automation_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES holiday_email_templates(id) ON DELETE CASCADE,

  -- Scheduling Configuration
  schedule_name VARCHAR(255) NOT NULL,
  schedule_year INTEGER NOT NULL, -- Year to send (e.g., 2025)
  send_date DATE NOT NULL, -- Calculated send date
  send_time TIME DEFAULT '09:00:00', -- Time to send (user's timezone)
  timezone VARCHAR(50) DEFAULT 'America/New_York',

  -- GoHighLevel Tag Filter
  ghl_tag_filter VARCHAR(255) DEFAULT 'active-downline', -- Tag to filter contacts

  -- Execution Status
  status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'processing', 'completed', 'failed', 'cancelled'
  contacts_count INTEGER DEFAULT 0, -- Total contacts to send to
  emails_sent INTEGER DEFAULT 0,
  emails_failed INTEGER DEFAULT 0,

  -- Execution Metadata
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error_message TEXT,

  -- Audit Fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================================
-- Indexes
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_schedules_template
  ON email_automation_schedules(template_id);

CREATE INDEX IF NOT EXISTS idx_schedules_status
  ON email_automation_schedules(status);

CREATE INDEX IF NOT EXISTS idx_schedules_send_date
  ON email_automation_schedules(send_date);

CREATE INDEX IF NOT EXISTS idx_schedules_year
  ON email_automation_schedules(schedule_year);

CREATE INDEX IF NOT EXISTS idx_schedules_year_status
  ON email_automation_schedules(schedule_year, status);

-- ============================================================================
-- Row-Level Security (RLS)
-- ============================================================================

-- Enable RLS
ALTER TABLE email_automation_schedules ENABLE ROW LEVEL SECURITY;

-- Policy: Admin full access (all operations)
CREATE POLICY "Admin full access to schedules"
  ON email_automation_schedules
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Policy: Authenticated users can view schedules (read-only)
CREATE POLICY "Authenticated users can view schedules"
  ON email_automation_schedules
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- ============================================================================
-- Trigger for updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_schedules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER schedules_updated_at
  BEFORE UPDATE ON email_automation_schedules
  FOR EACH ROW
  EXECUTE FUNCTION update_schedules_updated_at();

-- ============================================================================
-- Helper Function: Calculate Send Date for Variable Holidays
-- ============================================================================

CREATE OR REPLACE FUNCTION calculate_holiday_date(
  p_year INTEGER,
  p_month INTEGER,
  p_day INTEGER,
  p_date_type VARCHAR,
  p_holiday_slug VARCHAR
) RETURNS DATE AS $$
DECLARE
  v_send_date DATE;
  v_first_day_of_month DATE;
  v_day_of_week INTEGER;
  v_target_weekday INTEGER; -- 1=Monday, 7=Sunday
BEGIN
  -- For fixed dates, it's simple
  IF p_date_type = 'fixed' THEN
    RETURN make_date(p_year, p_month, p_day);
  END IF;

  -- For variable dates, calculate based on holiday rules
  v_first_day_of_month := make_date(p_year, p_month, 1);

  CASE p_holiday_slug
    -- MLK Day: 3rd Monday in January
    WHEN 'mlk-day' THEN
      v_target_weekday := 1; -- Monday
      v_send_date := v_first_day_of_month + ((v_target_weekday - EXTRACT(DOW FROM v_first_day_of_month)::INTEGER + 7) % 7) + 14;

    -- Presidents' Day: 3rd Monday in February
    WHEN 'presidents-day' THEN
      v_target_weekday := 1; -- Monday
      v_send_date := v_first_day_of_month + ((v_target_weekday - EXTRACT(DOW FROM v_first_day_of_month)::INTEGER + 7) % 7) + 14;

    -- Memorial Day: Last Monday in May
    WHEN 'memorial-day' THEN
      v_target_weekday := 1; -- Monday
      -- Find last Monday of May
      v_send_date := make_date(p_year, p_month + 1, 1) - 1; -- Last day of May
      v_send_date := v_send_date - ((EXTRACT(DOW FROM v_send_date)::INTEGER - v_target_weekday + 7) % 7);

    -- Labor Day: 1st Monday in September
    WHEN 'labor-day' THEN
      v_target_weekday := 1; -- Monday
      v_send_date := v_first_day_of_month + ((v_target_weekday - EXTRACT(DOW FROM v_first_day_of_month)::INTEGER + 7) % 7);

    -- Indigenous Peoples' Day: 2nd Monday in October
    WHEN 'indigenous-peoples-day' THEN
      v_target_weekday := 1; -- Monday
      v_send_date := v_first_day_of_month + ((v_target_weekday - EXTRACT(DOW FROM v_first_day_of_month)::INTEGER + 7) % 7) + 7;

    -- Thanksgiving: 4th Thursday in November
    WHEN 'thanksgiving' THEN
      v_target_weekday := 4; -- Thursday
      v_send_date := v_first_day_of_month + ((v_target_weekday - EXTRACT(DOW FROM v_first_day_of_month)::INTEGER + 7) % 7) + 21;

    ELSE
      -- Default: 1st day of month (shouldn't happen)
      v_send_date := v_first_day_of_month;
  END CASE;

  RETURN v_send_date;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- Verification Query
-- ============================================================================

-- Run this to verify the table was created successfully:
-- SELECT * FROM email_automation_schedules;

-- Test the helper function:
-- SELECT calculate_holiday_date(2025, 1, NULL, 'variable', 'mlk-day') AS mlk_day_2025;
-- SELECT calculate_holiday_date(2025, 11, NULL, 'variable', 'thanksgiving') AS thanksgiving_2025;
