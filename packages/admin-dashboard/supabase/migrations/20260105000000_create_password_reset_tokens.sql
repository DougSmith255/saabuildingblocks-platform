-- Create password_reset_tokens table for password reset functionality
-- This table stores hashed tokens for secure password reset flow

CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    token_hash text NOT NULL,
    expires_at timestamptz NOT NULL,
    ip_address text,
    used_at timestamptz,
    created_at timestamptz DEFAULT now()
);

-- Index for fast lookups by user_id
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON public.password_reset_tokens(user_id);

-- Index for fast lookups by token_hash
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token_hash ON public.password_reset_tokens(token_hash);

-- Index for finding unused tokens
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_unused ON public.password_reset_tokens(user_id, used_at) WHERE used_at IS NULL;

-- Enable RLS
ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Service role can do anything (needed for API routes)
CREATE POLICY "Service role has full access to password_reset_tokens"
    ON public.password_reset_tokens
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Add comment
COMMENT ON TABLE public.password_reset_tokens IS 'Stores hashed password reset tokens with expiration and usage tracking';
