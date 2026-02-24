-- Create booking_referrals table for referral-tracked booking system
-- Tracks when visitors book calls from agent attraction pages

CREATE TABLE IF NOT EXISTS public.booking_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Referring agent
  agent_user_id UUID NOT NULL REFERENCES public.users(id),
  agent_slug TEXT NOT NULL,
  agent_name TEXT NOT NULL,
  agent_email TEXT NOT NULL,

  -- Visitor / booker
  visitor_name TEXT,
  visitor_email TEXT,
  visitor_phone TEXT,

  -- GHL data
  ghl_contact_id TEXT,
  ghl_appointment_id TEXT,
  ghl_calendar_id TEXT,

  -- RSVP
  rsvp_token TEXT NOT NULL UNIQUE,
  rsvp_status TEXT NOT NULL DEFAULT 'pending',
  rsvp_responded_at TIMESTAMPTZ,
  rsvp_expires_at TIMESTAMPTZ NOT NULL,

  -- Booking details
  booking_start_time TIMESTAMPTZ,
  booking_end_time TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_booking_referrals_agent
  ON public.booking_referrals(agent_user_id);

CREATE INDEX IF NOT EXISTS idx_booking_referrals_rsvp_token
  ON public.booking_referrals(rsvp_token);

CREATE INDEX IF NOT EXISTS idx_booking_referrals_status
  ON public.booking_referrals(rsvp_status);

CREATE INDEX IF NOT EXISTS idx_booking_referrals_slug
  ON public.booking_referrals(agent_slug);

-- Enable RLS (service role only — API routes use service client)
ALTER TABLE public.booking_referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON public.booking_referrals
  FOR ALL USING (auth.role() = 'service_role');

COMMENT ON TABLE public.booking_referrals IS
  'Tracks booking referrals from agent attraction pages with RSVP accept/decline workflow';
