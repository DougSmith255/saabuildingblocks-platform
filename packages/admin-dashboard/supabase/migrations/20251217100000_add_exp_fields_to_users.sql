-- Add eXp Realty fields to users table
-- Created: 2025-12-17
-- Purpose: Store agent's eXp email and legal name for join team instructions

-- Add exp_email column (agent's eXp Realty email address)
ALTER TABLE users
ADD COLUMN IF NOT EXISTS exp_email TEXT;

-- Add legal_name column (agent's official legal name for sponsor search)
ALTER TABLE users
ADD COLUMN IF NOT EXISTS legal_name TEXT;

-- Add comments for documentation
COMMENT ON COLUMN users.exp_email IS 'Agent eXp Realty email address (e.g., firstname.lastname@expreferral.com) - used in join team instructions';
COMMENT ON COLUMN users.legal_name IS 'Agent official legal name as it appears in eXp system - used for sponsor search in join team instructions';

-- Create index for exp_email lookups
CREATE INDEX IF NOT EXISTS idx_users_exp_email ON users(exp_email) WHERE exp_email IS NOT NULL;
