-- Create logging table for eXp World Guest Pass automation
CREATE TABLE IF NOT EXISTS exp_guest_pass_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_email text NOT NULL,
  guest_first_name text,
  guest_last_name text,
  status text NOT NULL, -- 'success', 'failed', 'pending'
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- Index for quick lookups by email
CREATE INDEX IF NOT EXISTS idx_exp_guest_pass_logs_email ON exp_guest_pass_logs (guest_email);

-- Index for filtering by status
CREATE INDEX IF NOT EXISTS idx_exp_guest_pass_logs_status ON exp_guest_pass_logs (status);

-- RLS: Allow service role full access (this table is only written to by the API)
ALTER TABLE exp_guest_pass_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on exp_guest_pass_logs"
  ON exp_guest_pass_logs
  FOR ALL
  USING (true)
  WITH CHECK (true);
