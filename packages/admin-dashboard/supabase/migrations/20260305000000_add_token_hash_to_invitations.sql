-- Add token_hash column for Supabase native auth tokens (generateLink/verifyOtp)
-- Coexists with the old `token` column during transition

ALTER TABLE user_invitations
  ADD COLUMN IF NOT EXISTS token_hash text;

-- Index for token_hash lookups during activation
CREATE INDEX IF NOT EXISTS idx_user_invitations_token_hash
  ON user_invitations(token_hash);
