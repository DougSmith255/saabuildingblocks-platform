-- Add Location Mapping to Token Vault
-- Created: 2025-10-30
-- Purpose: Track WHERE each token is used (environment files, GitHub secrets, etc.)

-- Add locations column to master_controller_tokens
ALTER TABLE master_controller_tokens
ADD COLUMN IF NOT EXISTS locations JSONB DEFAULT '[]'::jsonb;

-- Add index for location queries
CREATE INDEX IF NOT EXISTS idx_tokens_locations
ON master_controller_tokens USING GIN(locations)
WHERE deleted_at IS NULL;

-- Update existing tokens with location metadata
-- These mappings are based on:
-- 1. /home/claude-flow/packages/admin-dashboard/.env.local
-- 2. /home/claude-flow/.github/workflows/deploy-cloudflare.yml
-- 3. Common usage patterns in the codebase

-- Cloudflare API Token
UPDATE master_controller_tokens
SET locations = '[
  {
    "type": "env",
    "file": ".env.local",
    "variable": "CLOUDFLARE_R2_API_TOKEN",
    "path": "/home/claude-flow/packages/admin-dashboard/.env.local",
    "description": "Used by R2 storage operations"
  },
  {
    "type": "github",
    "repo": "saabuildingblocks-platform",
    "owner": "DougSmith255",
    "secret": "CLOUDFLARE_API_TOKEN",
    "description": "Used by GitHub Actions deployment workflow"
  }
]'::jsonb
WHERE service_name = 'Cloudflare'
  AND token_type = 'API Token'
  AND deleted_at IS NULL;

-- Cloudflare Account ID
UPDATE master_controller_tokens
SET locations = '[
  {
    "type": "env",
    "file": ".env.local",
    "variable": "CLOUDFLARE_ACCOUNT_ID",
    "path": "/home/claude-flow/packages/admin-dashboard/.env.local",
    "description": "Used by R2 storage configuration"
  },
  {
    "type": "github",
    "repo": "saabuildingblocks-platform",
    "owner": "DougSmith255",
    "secret": "CLOUDFLARE_ACCOUNT_ID",
    "description": "Used by GitHub Actions deployment workflow"
  }
]'::jsonb
WHERE service_name = 'Cloudflare'
  AND token_type = 'Account ID'
  AND deleted_at IS NULL;

-- Cloudflare R2 Access Key ID
UPDATE master_controller_tokens
SET locations = '[
  {
    "type": "env",
    "file": ".env.local",
    "variable": "R2_ACCESS_KEY_ID",
    "path": "/home/claude-flow/packages/admin-dashboard/.env.local",
    "description": "Used by R2 S3-compatible API"
  }
]'::jsonb
WHERE service_name = 'Cloudflare R2'
  AND token_type = 'Access Key ID'
  AND deleted_at IS NULL;

-- Cloudflare R2 Secret Access Key
UPDATE master_controller_tokens
SET locations = '[
  {
    "type": "env",
    "file": ".env.local",
    "variable": "R2_SECRET_ACCESS_KEY",
    "path": "/home/claude-flow/packages/admin-dashboard/.env.local",
    "description": "Used by R2 S3-compatible API"
  }
]'::jsonb
WHERE service_name = 'Cloudflare R2'
  AND token_type = 'Secret Access Key'
  AND deleted_at IS NULL;

-- Supabase Anon Key
UPDATE master_controller_tokens
SET locations = '[
  {
    "type": "env",
    "file": ".env.local",
    "variable": "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "path": "/home/claude-flow/packages/admin-dashboard/.env.local",
    "description": "Public-facing Supabase client authentication (old naming)"
  },
  {
    "type": "env",
    "file": ".env.local",
    "variable": "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    "path": "/home/claude-flow/packages/admin-dashboard/.env.local",
    "description": "Public-facing Supabase client authentication (new naming)"
  }
]'::jsonb
WHERE service_name = 'Supabase'
  AND token_type = 'Anon Key'
  AND deleted_at IS NULL;

-- Supabase Service Role Key
UPDATE master_controller_tokens
SET locations = '[
  {
    "type": "env",
    "file": ".env.local",
    "variable": "SUPABASE_SERVICE_ROLE_KEY",
    "path": "/home/claude-flow/packages/admin-dashboard/.env.local",
    "description": "Server-side Supabase admin operations (old naming)"
  },
  {
    "type": "env",
    "file": ".env.local",
    "variable": "SUPABASE_SECRET_KEY",
    "path": "/home/claude-flow/packages/admin-dashboard/.env.local",
    "description": "Server-side Supabase admin operations (new naming)"
  }
]'::jsonb
WHERE service_name = 'Supabase'
  AND token_type = 'Service Role Key'
  AND deleted_at IS NULL;

-- WordPress Application Password
UPDATE master_controller_tokens
SET locations = '[
  {
    "type": "env",
    "file": ".env.local",
    "variable": "WORDPRESS_APP_PASSWORD",
    "path": "/home/claude-flow/packages/admin-dashboard/.env.local",
    "description": "Used for authenticated WordPress API access"
  },
  {
    "type": "github",
    "repo": "saabuildingblocks-platform",
    "owner": "DougSmith255",
    "secret": "WORDPRESS_APP_PASSWORD",
    "description": "Used by GitHub Actions for blog content deployment"
  }
]'::jsonb
WHERE service_name = 'WordPress'
  AND token_type = 'Application Password'
  AND deleted_at IS NULL;

-- WordPress API URL
UPDATE master_controller_tokens
SET locations = '[
  {
    "type": "env",
    "file": ".env.local",
    "variable": "WORDPRESS_URL",
    "path": "/home/claude-flow/packages/admin-dashboard/.env.local",
    "description": "WordPress base URL for API access"
  },
  {
    "type": "env",
    "file": ".env.local",
    "variable": "NEXT_PUBLIC_WORDPRESS_API_URL",
    "path": "/home/claude-flow/packages/admin-dashboard/.env.local",
    "description": "Public WordPress API endpoint"
  },
  {
    "type": "github",
    "repo": "saabuildingblocks-platform",
    "owner": "DougSmith255",
    "secret": "WORDPRESS_API_URL",
    "description": "Used by GitHub Actions deployment workflow"
  },
  {
    "type": "github",
    "repo": "saabuildingblocks-platform",
    "owner": "DougSmith255",
    "secret": "NEXT_PUBLIC_WORDPRESS_API_URL",
    "description": "Public WordPress API in GitHub Actions"
  }
]'::jsonb
WHERE service_name = 'WordPress'
  AND token_type = 'API URL'
  AND deleted_at IS NULL;

-- WordPress Username
UPDATE master_controller_tokens
SET locations = '[
  {
    "type": "env",
    "file": ".env.local",
    "variable": "WORDPRESS_USER",
    "path": "/home/claude-flow/packages/admin-dashboard/.env.local",
    "description": "WordPress admin username for API authentication"
  },
  {
    "type": "github",
    "repo": "saabuildingblocks-platform",
    "owner": "DougSmith255",
    "secret": "WORDPRESS_USER",
    "description": "Used by GitHub Actions for blog content deployment"
  }
]'::jsonb
WHERE service_name = 'WordPress'
  AND token_type = 'Username'
  AND deleted_at IS NULL;

-- GoHighLevel API Key
UPDATE master_controller_tokens
SET locations = '[
  {
    "type": "env",
    "file": ".env.local",
    "variable": "GOHIGHLEVEL_API_KEY",
    "path": "/home/claude-flow/packages/admin-dashboard/.env.local",
    "description": "Used for GoHighLevel CRM integration"
  }
]'::jsonb
WHERE service_name = 'GoHighLevel'
  AND token_type = 'API Key'
  AND deleted_at IS NULL;

-- GoHighLevel Location ID
UPDATE master_controller_tokens
SET locations = '[
  {
    "type": "env",
    "file": ".env.local",
    "variable": "GOHIGHLEVEL_LOCATION_ID",
    "path": "/home/claude-flow/packages/admin-dashboard/.env.local",
    "description": "GoHighLevel location identifier"
  }
]'::jsonb
WHERE service_name = 'GoHighLevel'
  AND token_type = 'Location ID'
  AND deleted_at IS NULL;

-- JWT Access Secret
UPDATE master_controller_tokens
SET locations = '[
  {
    "type": "env",
    "file": ".env.local",
    "variable": "JWT_ACCESS_SECRET",
    "path": "/home/claude-flow/packages/admin-dashboard/.env.local",
    "description": "Used for signing short-lived access tokens (15 minutes)"
  }
]'::jsonb
WHERE service_name = 'JWT Authentication'
  AND token_type = 'Access Secret'
  AND deleted_at IS NULL;

-- JWT Refresh Secret
UPDATE master_controller_tokens
SET locations = '[
  {
    "type": "env",
    "file": ".env.local",
    "variable": "JWT_REFRESH_SECRET",
    "path": "/home/claude-flow/packages/admin-dashboard/.env.local",
    "description": "Used for signing long-lived refresh tokens (7 days)"
  }
]'::jsonb
WHERE service_name = 'JWT Authentication'
  AND token_type = 'Refresh Secret'
  AND deleted_at IS NULL;

-- Revalidation Secret
UPDATE master_controller_tokens
SET locations = '[
  {
    "type": "env",
    "file": ".env.local",
    "variable": "REVALIDATION_SECRET",
    "path": "/home/claude-flow/packages/admin-dashboard/.env.local",
    "description": "Used for WordPress webhook authentication (ISR revalidation)"
  }
]'::jsonb
WHERE service_name = 'WordPress Webhook'
  AND token_type = 'Revalidation Secret'
  AND deleted_at IS NULL;

-- API Basic Auth Credentials
UPDATE master_controller_tokens
SET locations = '[
  {
    "type": "env",
    "file": ".env.local",
    "variable": "API_BASIC_AUTH_USER",
    "path": "/home/claude-flow/packages/admin-dashboard/.env.local",
    "description": "Username for internal API endpoint authentication"
  }
]'::jsonb
WHERE service_name = 'API Authentication'
  AND token_type = 'Basic Auth Username'
  AND deleted_at IS NULL;

UPDATE master_controller_tokens
SET locations = '[
  {
    "type": "env",
    "file": ".env.local",
    "variable": "API_BASIC_AUTH_PASSWORD",
    "path": "/home/claude-flow/packages/admin-dashboard/.env.local",
    "description": "Password for internal API endpoint authentication"
  }
]'::jsonb
WHERE service_name = 'API Authentication'
  AND token_type = 'Basic Auth Password'
  AND deleted_at IS NULL;

-- Add helper function to search tokens by location
CREATE OR REPLACE FUNCTION find_tokens_by_location(
  search_type TEXT DEFAULT NULL,
  search_variable TEXT DEFAULT NULL,
  search_repo TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  service_name TEXT,
  token_type TEXT,
  location JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.id,
    t.service_name,
    t.token_type,
    loc.location
  FROM master_controller_tokens t
  CROSS JOIN LATERAL jsonb_array_elements(t.locations) AS loc(location)
  WHERE t.deleted_at IS NULL
    AND (search_type IS NULL OR loc.location->>'type' = search_type)
    AND (search_variable IS NULL OR loc.location->>'variable' = search_variable)
    AND (search_repo IS NULL OR loc.location->>'repo' = search_repo);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment for documentation
COMMENT ON COLUMN master_controller_tokens.locations IS 'JSONB array of location objects tracking where this token is used (env files, GitHub secrets, etc.)';
COMMENT ON FUNCTION find_tokens_by_location IS 'Search tokens by their usage locations (type, variable, or repo)';

-- Verification query (commented out - uncomment to test)
-- SELECT
--   service_name,
--   token_type,
--   jsonb_array_length(locations) as location_count,
--   locations
-- FROM master_controller_tokens
-- WHERE deleted_at IS NULL
-- ORDER BY service_name, token_type;
