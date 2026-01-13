-- Add state field to users table for state broker support
-- This allows us to show the correct state broker contact link

ALTER TABLE users ADD COLUMN IF NOT EXISTS state TEXT;

-- Add comment explaining the field
COMMENT ON COLUMN users.state IS 'US state abbreviation (e.g., CA, TX, FL) for showing correct state broker support link';

-- Create index for faster lookups if needed
CREATE INDEX IF NOT EXISTS idx_users_state ON users(state);
