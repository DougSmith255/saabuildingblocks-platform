-- Add missing columns to agent_pages table
-- Created: 2025-12-17
-- Purpose: Add profile_image_url, custom_links, and links_settings columns

-- Add profile image URL column
ALTER TABLE agent_pages
ADD COLUMN IF NOT EXISTS profile_image_url TEXT;

-- Add custom links column (JSONB array of link objects)
-- Each link: { id: string, label: string, url: string, icon?: string, order: number }
ALTER TABLE agent_pages
ADD COLUMN IF NOT EXISTS custom_links JSONB DEFAULT '[]'::jsonb;

-- Add links settings column (JSONB object for linktree customization)
-- Settings: { accentColor: string, iconStyle: 'light'|'dark', font: 'synonym'|'taskor', bio: string, showColorPhoto: boolean }
ALTER TABLE agent_pages
ADD COLUMN IF NOT EXISTS links_settings JSONB DEFAULT '{
  "accentColor": "#ffd700",
  "iconStyle": "light",
  "font": "synonym",
  "bio": "",
  "showColorPhoto": false
}'::jsonb;

-- Add comments for documentation
COMMENT ON COLUMN agent_pages.profile_image_url IS 'URL to profile image stored in Cloudflare R2';
COMMENT ON COLUMN agent_pages.custom_links IS 'JSONB array of custom link buttons for linktree page';
COMMENT ON COLUMN agent_pages.links_settings IS 'JSONB object with linktree customization settings (accent color, icon style, font, bio, color photo toggle)';
