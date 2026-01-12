-- Add gender field to users table
-- This controls which team calls the user sees (men's vs women's calls)

ALTER TABLE users ADD COLUMN IF NOT EXISTS gender TEXT DEFAULT 'male';

-- Add a comment to explain the field
COMMENT ON COLUMN users.gender IS 'User gender for filtering team calls (male/female)';
