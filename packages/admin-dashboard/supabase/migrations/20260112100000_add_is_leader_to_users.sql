-- Add is_leader field to users table
-- This controls whether the user sees leaders-only team calls

ALTER TABLE users ADD COLUMN IF NOT EXISTS is_leader BOOLEAN DEFAULT false;

-- Add a comment to explain the field
COMMENT ON COLUMN users.is_leader IS 'Whether the user is a leader and should see leaders-only calls';
