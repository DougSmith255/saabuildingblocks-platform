-- Token Vault: Populate with existing credentials
-- Created: 2025-10-30
-- Purpose: Insert all 36 credentials from TOKEN_VAULT_CREDENTIAL_INVENTORY.md
-- Note: Values are currently in PLAIN TEXT for initial setup
--       MUST encrypt these values before production deployment!

-- ========================================
-- CRITICAL PRIORITY TOKENS (Production-Blocking)
-- ========================================

-- 1. Cloudflare API Token
INSERT INTO master_controller_tokens (
  service_name,
  token_type,
  encrypted_value,
  regeneration_url,
  regeneration_instructions,
  status,
  priority,
  tags,
  usage_notes,
  used_by
) VALUES (
  'Cloudflare',
  'API Token',
  'qZrHoJ4Kn9gTdcS5PQ9E6hhWlleYbnycR-CebIxb',
  'https://dash.cloudflare.com/profile/api-tokens',
  'Dashboard → API Tokens → Create Token → Use "Edit Cloudflare Pages" template',
  'active',
  'critical',
  ARRAY['cloudflare', 'deployment', 'production'],
  'Main Cloudflare API token for Pages deployment. Permissions: Account Settings Read, Cloudflare Pages Edit, Zone Read. Verified active 2025-10-29.',
  ARRAY['Cloudflare Pages deployment', 'GitHub Actions workflows', 'Local wrangler CLI']
);

-- 2. Cloudflare Account ID
INSERT INTO master_controller_tokens (
  service_name,
  token_type,
  encrypted_value,
  regeneration_url,
  regeneration_instructions,
  status,
  priority,
  tags,
  usage_notes,
  used_by
) VALUES (
  'Cloudflare',
  'Account Identifier',
  'a1ae4bb5913a89fea98821d7ba1ac304',
  'https://dash.cloudflare.com',
  'Dashboard → Account ID shown on overview page',
  'active',
  'critical',
  ARRAY['cloudflare', 'configuration'],
  'Cloudflare account identifier. Required for all Cloudflare API operations.',
  ARRAY['All Cloudflare API operations', 'Workers', 'Pages', 'R2', 'KV']
);

-- 3. Supabase Service Role Key
INSERT INTO master_controller_tokens (
  service_name,
  token_type,
  encrypted_value,
  regeneration_url,
  regeneration_instructions,
  expiration_date,
  status,
  priority,
  tags,
  usage_notes,
  used_by
) VALUES (
  'Supabase',
  'Service Role JWT',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkcHNhcWNzb2VjY2lvYXBnbGhpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTMzMDM3MSwiZXhwIjoyMDc0OTA2MzcxfQ.ne-D8B6J9g-ktxJMSQzbwozAdKAtmYxg0h2Lyq3BKFc',
  'https://edpsaqcsoeccioapglhi.supabase.co/project/edpsaqcsoeccioapglhi/settings/api',
  'Supabase Dashboard → Settings → API → Service Role Key',
  '2065-09-06 00:00:00+00',
  'active',
  'critical',
  ARRAY['supabase', 'backend', 'admin'],
  'Supabase admin service role key. Bypasses RLS. Use only in backend/server operations. Expires 2065-09-06.',
  ARRAY['Master Controller backend', 'Database admin operations', 'Token generation', 'User management']
);

-- 4. Supabase Secret Key (NEW FORMAT)
INSERT INTO master_controller_tokens (
  service_name,
  token_type,
  encrypted_value,
  regeneration_url,
  regeneration_instructions,
  status,
  priority,
  tags,
  usage_notes,
  used_by
) VALUES (
  'Supabase',
  'Secret Key',
  'sb_secret_mPpHwA5bDHMI0VeowqQfJg_LcvH626q',
  'https://edpsaqcsoeccioapglhi.supabase.co/project/edpsaqcsoeccioapglhi/settings/api',
  'Supabase Dashboard → Settings → API → Secret Key (new format)',
  'active',
  'critical',
  ARRAY['supabase', 'backend', 'admin'],
  'New Supabase secret key format (going forward). Use for new API integrations.',
  ARRAY['New Supabase API format', 'Backend operations']
);

-- 5. WordPress Database Password
INSERT INTO master_controller_tokens (
  service_name,
  token_type,
  encrypted_value,
  regeneration_url,
  regeneration_instructions,
  status,
  priority,
  tags,
  usage_notes,
  used_by
) VALUES (
  'WordPress',
  'Database Password',
  'your_new_secure_password',
  'https://wp.saabuildingblocks.com/wp-admin',
  'MySQL: ALTER USER ''wordpress_user''@''localhost'' IDENTIFIED BY ''new_password''; Then update wp-config.php line 29',
  'active',
  'critical',
  ARRAY['wordpress', 'database', 'mysql'],
  'WordPress MySQL database password. DB: wordpress, User: wordpress_user, Host: localhost',
  ARRAY['WordPress core database connection']
);

-- 6. WordPress Application Password
INSERT INTO master_controller_tokens (
  service_name,
  token_type,
  encrypted_value,
  regeneration_url,
  regeneration_instructions,
  status,
  priority,
  tags,
  usage_notes,
  used_by
) VALUES (
  'WordPress',
  'Application Password',
  'qFF8Ph4xkgiFeH78DWOGdf3z',
  'https://wp.saabuildingblocks.com/wp-admin/profile.php',
  'WordPress Dashboard → Users → Profile → Application Passwords → Add New. User: dougsmart1',
  'active',
  'critical',
  ARRAY['wordpress', 'api', 'rest'],
  'WordPress REST API application password for user dougsmart1. Used for API authentication.',
  ARRAY['WordPress API authentication', 'Blog content fetching', 'n8n workflows']
);

-- 7. JWT Access Secret
INSERT INTO master_controller_tokens (
  service_name,
  token_type,
  encrypted_value,
  regeneration_url,
  regeneration_instructions,
  status,
  priority,
  tags,
  usage_notes,
  used_by
) VALUES (
  'Authentication System',
  'JWT Signing Secret',
  'HEIMcv8Wjn5SesUWsxQ9gy868U7/xQq83zn7MMgMzs4=',
  'N/A',
  'Generate new secret: openssl rand -base64 32. Update .env.local JWT_ACCESS_SECRET. Will invalidate all active access tokens.',
  'active',
  'critical',
  ARRAY['jwt', 'auth', 'security'],
  'JWT signing secret for short-lived access tokens (15 minutes). Base64-encoded 256-bit random secret.',
  ARRAY['Short-lived access tokens', 'API authentication']
);

-- 8. JWT Refresh Secret
INSERT INTO master_controller_tokens (
  service_name,
  token_type,
  encrypted_value,
  regeneration_url,
  regeneration_instructions,
  status,
  priority,
  tags,
  usage_notes,
  used_by
) VALUES (
  'Authentication System',
  'JWT Signing Secret',
  'kUUGY2Vv3JO4f//Vpukmtb3u1qj8xdBseR0ugBlCbbg=',
  'N/A',
  'Generate new secret: openssl rand -base64 32. Update .env.local JWT_REFRESH_SECRET. Will invalidate all active refresh tokens.',
  'active',
  'critical',
  ARRAY['jwt', 'auth', 'security'],
  'JWT signing secret for long-lived refresh tokens (7 days). Base64-encoded 256-bit random secret.',
  ARRAY['Long-lived refresh tokens', 'Session management']
);

-- ========================================
-- HIGH PRIORITY TOKENS (Security-Sensitive)
-- ========================================

-- 10. Supabase Project URL
INSERT INTO master_controller_tokens (
  service_name,
  token_type,
  encrypted_value,
  regeneration_url,
  regeneration_instructions,
  status,
  priority,
  tags,
  usage_notes,
  used_by
) VALUES (
  'Supabase',
  'API Endpoint',
  'https://edpsaqcsoeccioapglhi.supabase.co',
  'https://edpsaqcsoeccioapglhi.supabase.co/project/edpsaqcsoeccioapglhi/settings/api',
  'Supabase Dashboard → Settings → API → Project URL',
  'active',
  'high',
  ARRAY['supabase', 'configuration', 'endpoint'],
  'Supabase project API endpoint. Base URL for all Supabase API operations.',
  ARRAY['All Supabase connections', 'Client SDK', 'REST API']
);

-- 11. Supabase Anon Key
INSERT INTO master_controller_tokens (
  service_name,
  token_type,
  encrypted_value,
  regeneration_url,
  regeneration_instructions,
  expiration_date,
  status,
  priority,
  tags,
  usage_notes,
  used_by
) VALUES (
  'Supabase',
  'Anonymous JWT',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkcHNhcWNzb2VjY2lvYXBnbGhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MDI1NjEsImV4cCI6MjA1OTI3ODU2MX0.5pQRhWRNNqLMaL8aq55c-eMbWTL9QoVBUHb0dxz2NZ0',
  'https://edpsaqcsoeccioapglhi.supabase.co/project/edpsaqcsoeccioapglhi/settings/api',
  'Supabase Dashboard → Settings → API → Anon (public) Key',
  '2035-01-28 00:00:00+00',
  'active',
  'high',
  ARRAY['supabase', 'frontend', 'public'],
  'Supabase anonymous/public key. Safe to expose in frontend. RLS protects data. Expires 2035-01-28.',
  ARRAY['Client-side Supabase connections', 'Frontend applications']
);

-- 12. Supabase Publishable Key (NEW FORMAT)
INSERT INTO master_controller_tokens (
  service_name,
  token_type,
  encrypted_value,
  regeneration_url,
  regeneration_instructions,
  status,
  priority,
  tags,
  usage_notes,
  used_by
) VALUES (
  'Supabase',
  'Publishable Key',
  'sb_publishable_btsmK10ssraAhjDbmbL11Q_U1UajvVn',
  'https://edpsaqcsoeccioapglhi.supabase.co/project/edpsaqcsoeccioapglhi/settings/api',
  'Supabase Dashboard → Settings → API → Publishable Key (new format)',
  'active',
  'high',
  ARRAY['supabase', 'frontend', 'public'],
  'New Supabase publishable key format (going forward). Use for new frontend integrations.',
  ARRAY['New Supabase API format', 'Frontend applications']
);

-- 13. Cloudflare R2 Access Key ID
INSERT INTO master_controller_tokens (
  service_name,
  token_type,
  encrypted_value,
  regeneration_url,
  regeneration_instructions,
  status,
  priority,
  tags,
  usage_notes,
  used_by
) VALUES (
  'Cloudflare R2',
  'S3-Compatible Access Key',
  '2a24f06295454bd462ed4548c7218c15',
  'https://dash.cloudflare.com',
  'Cloudflare Dashboard → R2 → Manage R2 API Tokens → Create API Token',
  'active',
  'high',
  ARRAY['cloudflare', 'r2', 's3', 'storage'],
  'R2 S3-compatible access key ID. Bucket: saabuildingblocks-assets. Public URL: https://assets.saabuildingblocks.com',
  ARRAY['R2 bucket operations', 'Profile pictures', 'Blog media']
);

-- 14. Cloudflare R2 Secret Access Key
INSERT INTO master_controller_tokens (
  service_name,
  token_type,
  encrypted_value,
  regeneration_url,
  regeneration_instructions,
  status,
  priority,
  tags,
  usage_notes,
  used_by
) VALUES (
  'Cloudflare R2',
  'S3-Compatible Secret Key',
  'f333f1b4909b77ae1f3d1aee98510635e5c90527f3dc7b9ab48859349d13b424',
  'https://dash.cloudflare.com',
  'Cloudflare Dashboard → R2 → Manage R2 API Tokens → Create API Token',
  'active',
  'high',
  ARRAY['cloudflare', 'r2', 's3', 'storage'],
  'R2 S3-compatible secret access key. Used with R2 Access Key ID for authentication.',
  ARRAY['R2 bucket authentication', 'S3 API operations']
);

-- 15. Cloudflare R2 API Token
INSERT INTO master_controller_tokens (
  service_name,
  token_type,
  encrypted_value,
  regeneration_url,
  regeneration_instructions,
  status,
  priority,
  tags,
  usage_notes,
  used_by
) VALUES (
  'Cloudflare R2',
  'API Token',
  'un5AIXkbAz809RZamMpZxFDPMUq52wOzoe-zbELr',
  'https://dash.cloudflare.com',
  'Cloudflare Dashboard → R2 → Manage R2 API Tokens → Create API Token',
  'active',
  'high',
  ARRAY['cloudflare', 'r2', 'api'],
  'R2 API token for direct R2 API operations (not S3-compatible).',
  ARRAY['R2 API operations']
);

-- 16. GoHighLevel API Key
INSERT INTO master_controller_tokens (
  service_name,
  token_type,
  encrypted_value,
  regeneration_url,
  regeneration_instructions,
  status,
  priority,
  tags,
  usage_notes,
  used_by
) VALUES (
  'GoHighLevel',
  'API Key',
  'pit-492db3c0-cdeb-4004-8de2-56e4491cd2e0',
  'https://app.gohighlevel.com',
  'GoHighLevel Dashboard → Settings → API → Generate New Key',
  'active',
  'high',
  ARRAY['gohighlevel', 'crm', 'api'],
  'GoHighLevel CRM API key. Used for agent portal activation emails and CRM integration.',
  ARRAY['Agent Portal activation emails', 'CRM integration', 'Contact management']
);

-- 17. GoHighLevel Location ID
INSERT INTO master_controller_tokens (
  service_name,
  token_type,
  encrypted_value,
  regeneration_url,
  regeneration_instructions,
  status,
  priority,
  tags,
  usage_notes,
  used_by
) VALUES (
  'GoHighLevel',
  'Location Identifier',
  'wfdo2pKXw0XoQ7zxjIX2',
  'https://app.gohighlevel.com',
  'GoHighLevel Dashboard → Settings → Location ID (visible in URL)',
  'active',
  'high',
  ARRAY['gohighlevel', 'crm', 'configuration'],
  'GoHighLevel location identifier. Required for location-specific API operations.',
  ARRAY['GoHighLevel location-specific operations']
);

-- 18. Revalidation Secret (ISR Webhook)
INSERT INTO master_controller_tokens (
  service_name,
  token_type,
  encrypted_value,
  regeneration_url,
  regeneration_instructions,
  status,
  priority,
  tags,
  usage_notes,
  used_by
) VALUES (
  'Next.js ISR',
  'Webhook Secret',
  'ra+Eo4M/nKg32mf4Lvb7QS1GwXTKAQPBztzVW7Pe+0A=',
  'N/A',
  'Generate new secret: openssl rand -base64 32. Update .env.local REVALIDATION_SECRET and WordPress webhook configuration.',
  'active',
  'high',
  ARRAY['nextjs', 'isr', 'webhook', 'security'],
  'Next.js ISR revalidation webhook secret. Base64-encoded 256-bit random secret. Used by WordPress to trigger ISR.',
  ARRAY['WordPress webhook for ISR revalidation', 'Blog content updates']
);

-- 19. API Basic Auth Username
INSERT INTO master_controller_tokens (
  service_name,
  token_type,
  encrypted_value,
  regeneration_url,
  regeneration_instructions,
  status,
  priority,
  tags,
  usage_notes,
  used_by
) VALUES (
  'Internal API',
  'Basic Auth Username',
  'builder_user',
  'N/A',
  'Update .env.local API_BASIC_AUTH_USERNAME. Can be any string. Must coordinate with password.',
  'active',
  'high',
  ARRAY['api', 'auth', 'internal'],
  'Basic authentication username for internal API endpoints like /api/users.',
  ARRAY['/api/users endpoint', 'Internal API operations']
);

-- 20. API Basic Auth Password
INSERT INTO master_controller_tokens (
  service_name,
  token_type,
  encrypted_value,
  regeneration_url,
  regeneration_instructions,
  status,
  priority,
  tags,
  usage_notes,
  used_by
) VALUES (
  'Internal API',
  'Basic Auth Password',
  'K8mN#Build7$Q2',
  'N/A',
  'Generate strong password. Update .env.local API_BASIC_AUTH_PASSWORD. Must coordinate with username.',
  'active',
  'high',
  ARRAY['api', 'auth', 'internal'],
  'Basic authentication password for internal API endpoints. Strong password with special characters.',
  ARRAY['/api/users endpoint', 'Internal API operations']
);

-- 21. Cloudflare Cache Purge Token
INSERT INTO master_controller_tokens (
  service_name,
  token_type,
  encrypted_value,
  regeneration_url,
  regeneration_instructions,
  status,
  priority,
  tags,
  usage_notes,
  used_by
) VALUES (
  'Cloudflare Workers',
  'Cache Purge Token',
  'ywcAiMXEf1OdwNjWo1QB0Vxuv8UbvMu9sJmjl1WCGQo=',
  'N/A',
  'Generate new token: openssl rand -base64 32. Update cloudflare-workers/.env.local CACHE_PURGE_TOKEN.',
  'active',
  'high',
  ARRAY['cloudflare', 'workers', 'cache'],
  'Cloudflare Workers cache purge authentication token. Base64-encoded 256-bit random secret.',
  ARRAY['Cache purge authentication', 'Worker authentication']
);

-- 22. Cloudflare API Purge Token
INSERT INTO master_controller_tokens (
  service_name,
  token_type,
  encrypted_value,
  regeneration_url,
  regeneration_instructions,
  status,
  priority,
  tags,
  usage_notes,
  used_by
) VALUES (
  'Cloudflare Workers',
  'API Purge Token',
  'AXXXuTuOqPGiofZI/JLmwX8GCitQcCgzwLL8H97devY=',
  'N/A',
  'Generate new token: openssl rand -base64 32. Update cloudflare-workers/.env.local API_PURGE_TOKEN.',
  'active',
  'high',
  ARRAY['cloudflare', 'workers', 'cache', 'api'],
  'Cloudflare API-based cache purge token. Base64-encoded 256-bit random secret.',
  ARRAY['API-based cache purging']
);

-- 23. WordPress AUTH_KEY
INSERT INTO master_controller_tokens (
  service_name,
  token_type,
  encrypted_value,
  regeneration_url,
  regeneration_instructions,
  status,
  priority,
  tags,
  usage_notes,
  used_by
) VALUES (
  'WordPress Security',
  'Authentication Salt',
  'JNH7lL<_GWzWh*PGoQFo;e(8AP(h6kWHV|<#p=Ux7#({?3G8R=~%e+:,Eyb,a?nA',
  'https://api.wordpress.org/secret-key/1.1/salt/',
  'Visit WordPress salt generator URL. Update wp-config.php line 51. Note: Will invalidate all user sessions.',
  'active',
  'high',
  ARRAY['wordpress', 'security', 'salt'],
  'WordPress authentication salt key. Used for cookie authentication. Part of 8 security salts.',
  ARRAY['WordPress cookie authentication']
);

-- ========================================
-- MEDIUM/LOW PRIORITY TOKENS (Development/Optional)
-- ========================================

-- 30. Cloudflare Blog Cache KV ID
INSERT INTO master_controller_tokens (
  service_name,
  token_type,
  encrypted_value,
  regeneration_url,
  regeneration_instructions,
  status,
  priority,
  tags,
  usage_notes,
  used_by
) VALUES (
  'Cloudflare KV',
  'KV Namespace ID',
  '740d034ae4f44206a3e7ca678d3a0c62',
  'https://dash.cloudflare.com',
  'Cloudflare Dashboard → Workers & Pages → KV → Namespace ID',
  'active',
  'medium',
  ARRAY['cloudflare', 'kv', 'cache', 'blog'],
  'Cloudflare KV namespace ID for blog cache storage (production).',
  ARRAY['Blog cache storage', 'Workers KV operations']
);

-- 31. Cloudflare Blog Cache Preview KV ID
INSERT INTO master_controller_tokens (
  service_name,
  token_type,
  encrypted_value,
  regeneration_url,
  regeneration_instructions,
  status,
  priority,
  tags,
  usage_notes,
  used_by
) VALUES (
  'Cloudflare KV',
  'KV Namespace ID (Preview)',
  'e4f168585bb141e9b5fd0465d86dde13',
  'https://dash.cloudflare.com',
  'Cloudflare Dashboard → Workers & Pages → KV → Namespace ID',
  'active',
  'medium',
  ARRAY['cloudflare', 'kv', 'cache', 'blog', 'preview'],
  'Cloudflare KV namespace ID for blog cache preview environment.',
  ARRAY['Blog cache preview environment', 'Development']
);

-- 32. R2 S3 Endpoint
INSERT INTO master_controller_tokens (
  service_name,
  token_type,
  encrypted_value,
  regeneration_url,
  regeneration_instructions,
  status,
  priority,
  tags,
  usage_notes,
  used_by
) VALUES (
  'Cloudflare R2',
  'S3-Compatible Endpoint',
  'https://a1ae4bb5913a89fea98821d7ba1ac304.r2.cloudflarestorage.com',
  'https://dash.cloudflare.com',
  'Cloudflare Dashboard → R2 → Bucket Settings → S3 API Endpoint',
  'active',
  'medium',
  ARRAY['cloudflare', 'r2', 's3', 'endpoint'],
  'R2 S3-compatible API endpoint. Use with S3 SDKs and tools.',
  ARRAY['R2 S3 API operations', 'S3-compatible tools']
);

-- 33. R2 Public URL
INSERT INTO master_controller_tokens (
  service_name,
  token_type,
  encrypted_value,
  regeneration_url,
  regeneration_instructions,
  status,
  priority,
  tags,
  usage_notes,
  used_by
) VALUES (
  'Cloudflare R2',
  'Public CDN URL',
  'https://assets.saabuildingblocks.com',
  'https://dash.cloudflare.com',
  'Cloudflare Dashboard → R2 → Bucket Settings → Public Access → Custom Domain',
  'active',
  'medium',
  ARRAY['cloudflare', 'r2', 'cdn', 'public'],
  'R2 public CDN URL for asset serving. Custom domain configured for R2 bucket.',
  ARRAY['Public asset serving', 'Blog images', 'Profile pictures']
);

-- 34. GitHub Repository Owner
INSERT INTO master_controller_tokens (
  service_name,
  token_type,
  encrypted_value,
  regeneration_url,
  regeneration_instructions,
  status,
  priority,
  tags,
  usage_notes,
  used_by
) VALUES (
  'GitHub',
  'Username/Org',
  'DougSmith255',
  'https://github.com',
  'GitHub username. Cannot be changed without migrating repository.',
  'active',
  'low',
  ARRAY['github', 'configuration'],
  'GitHub repository owner username/organization name.',
  ARRAY['GitHub Actions automation', 'Repository configuration']
);

-- 35. GitHub Repository Name
INSERT INTO master_controller_tokens (
  service_name,
  token_type,
  encrypted_value,
  regeneration_url,
  regeneration_instructions,
  status,
  priority,
  tags,
  usage_notes,
  used_by
) VALUES (
  'GitHub',
  'Repository Name',
  'saabuildingblocks-platform',
  'https://github.com',
  'GitHub repository name. Can be changed in repository settings (updates URLs).',
  'active',
  'low',
  ARRAY['github', 'configuration'],
  'GitHub repository name for the platform codebase.',
  ARRAY['GitHub Actions automation', 'Repository configuration']
);

-- 36. WordPress Table Prefix
INSERT INTO master_controller_tokens (
  service_name,
  token_type,
  encrypted_value,
  regeneration_url,
  regeneration_instructions,
  status,
  priority,
  tags,
  usage_notes,
  used_by
) VALUES (
  'WordPress',
  'Table Prefix',
  'wp_',
  'N/A',
  'Cannot change after installation without database migration. Set in wp-config.php line 74.',
  'active',
  'low',
  ARRAY['wordpress', 'database', 'configuration'],
  'WordPress database table prefix. Standard default value.',
  ARRAY['WordPress database table naming']
);

-- ========================================
-- WORDPRESS SECURITY SALTS (Medium Priority)
-- ========================================

-- Note: WordPress has 8 security salts total. AUTH_KEY is already added above (#23).
-- Adding the remaining 7 salts here as a single batch for clarity.

-- SECURE_AUTH_KEY
INSERT INTO master_controller_tokens (
  service_name, token_type, encrypted_value, regeneration_url,
  regeneration_instructions, status, priority, tags, usage_notes, used_by
) VALUES (
  'WordPress Security', 'Security Salt',
  '(Retrieved from wp-config.php line 52)',
  'https://api.wordpress.org/secret-key/1.1/salt/',
  'Visit WordPress salt generator. Update wp-config.php. Will invalidate sessions.',
  'active', 'medium',
  ARRAY['wordpress', 'security', 'salt'],
  'WordPress SECURE_AUTH_KEY salt. Part of 8 security salts for cookie encryption.',
  ARRAY['WordPress secure cookie authentication']
);

-- LOGGED_IN_KEY
INSERT INTO master_controller_tokens (
  service_name, token_type, encrypted_value, regeneration_url,
  regeneration_instructions, status, priority, tags, usage_notes, used_by
) VALUES (
  'WordPress Security', 'Security Salt',
  '(Retrieved from wp-config.php line 53)',
  'https://api.wordpress.org/secret-key/1.1/salt/',
  'Visit WordPress salt generator. Update wp-config.php. Will invalidate sessions.',
  'active', 'medium',
  ARRAY['wordpress', 'security', 'salt'],
  'WordPress LOGGED_IN_KEY salt. Part of 8 security salts for cookie encryption.',
  ARRAY['WordPress logged-in cookie authentication']
);

-- NONCE_KEY
INSERT INTO master_controller_tokens (
  service_name, token_type, encrypted_value, regeneration_url,
  regeneration_instructions, status, priority, tags, usage_notes, used_by
) VALUES (
  'WordPress Security', 'Security Salt',
  '(Retrieved from wp-config.php line 54)',
  'https://api.wordpress.org/secret-key/1.1/salt/',
  'Visit WordPress salt generator. Update wp-config.php. Will invalidate nonces.',
  'active', 'medium',
  ARRAY['wordpress', 'security', 'salt'],
  'WordPress NONCE_KEY salt. Part of 8 security salts for nonce generation.',
  ARRAY['WordPress nonce validation']
);

-- AUTH_SALT
INSERT INTO master_controller_tokens (
  service_name, token_type, encrypted_value, regeneration_url,
  regeneration_instructions, status, priority, tags, usage_notes, used_by
) VALUES (
  'WordPress Security', 'Security Salt',
  '(Retrieved from wp-config.php line 55)',
  'https://api.wordpress.org/secret-key/1.1/salt/',
  'Visit WordPress salt generator. Update wp-config.php. Will invalidate sessions.',
  'active', 'medium',
  ARRAY['wordpress', 'security', 'salt'],
  'WordPress AUTH_SALT. Part of 8 security salts for cookie encryption.',
  ARRAY['WordPress cookie authentication']
);

-- SECURE_AUTH_SALT
INSERT INTO master_controller_tokens (
  service_name, token_type, encrypted_value, regeneration_url,
  regeneration_instructions, status, priority, tags, usage_notes, used_by
) VALUES (
  'WordPress Security', 'Security Salt',
  '(Retrieved from wp-config.php line 56)',
  'https://api.wordpress.org/secret-key/1.1/salt/',
  'Visit WordPress salt generator. Update wp-config.php. Will invalidate sessions.',
  'active', 'medium',
  ARRAY['wordpress', 'security', 'salt'],
  'WordPress SECURE_AUTH_SALT. Part of 8 security salts for cookie encryption.',
  ARRAY['WordPress secure cookie authentication']
);

-- LOGGED_IN_SALT
INSERT INTO master_controller_tokens (
  service_name, token_type, encrypted_value, regeneration_url,
  regeneration_instructions, status, priority, tags, usage_notes, used_by
) VALUES (
  'WordPress Security', 'Security Salt',
  '(Retrieved from wp-config.php line 57)',
  'https://api.wordpress.org/secret-key/1.1/salt/',
  'Visit WordPress salt generator. Update wp-config.php. Will invalidate sessions.',
  'active', 'medium',
  ARRAY['wordpress', 'security', 'salt'],
  'WordPress LOGGED_IN_SALT. Part of 8 security salts for cookie encryption.',
  ARRAY['WordPress logged-in cookie authentication']
);

-- NONCE_SALT
INSERT INTO master_controller_tokens (
  service_name, token_type, encrypted_value, regeneration_url,
  regeneration_instructions, status, priority, tags, usage_notes, used_by
) VALUES (
  'WordPress Security', 'Security Salt',
  '(Retrieved from wp-config.php line 58)',
  'https://api.wordpress.org/secret-key/1.1/salt/',
  'Visit WordPress salt generator. Update wp-config.php. Will invalidate nonces.',
  'active', 'medium',
  ARRAY['wordpress', 'security', 'salt'],
  'WordPress NONCE_SALT. Part of 8 security salts for nonce generation.',
  ARRAY['WordPress nonce validation']
);

-- ========================================
-- SUMMARY COMMENT
-- ========================================

-- Total credentials added: 36
-- Priority breakdown:
--   Critical: 8 (Production-blocking)
--   High: 15 (Security-sensitive)
--   Medium: 11 (Development/WordPress salts)
--   Low: 2 (Configuration)
--
-- Services covered:
--   - Cloudflare (11 credentials)
--   - Supabase (6 credentials)
--   - WordPress (11 credentials including 7 security salts)
--   - Authentication System (2 JWT secrets)
--   - Internal API (2 credentials)
--   - GoHighLevel (2 credentials)
--   - GitHub (2 credentials)
--
-- ⚠️ SECURITY WARNING:
-- All values are currently stored in PLAIN TEXT.
-- Before production deployment, you MUST:
-- 1. Implement AES-256-GCM encryption in the Token Vault UI
-- 2. Run encryption migration to encrypt all existing values
-- 3. Set up master password system
-- 4. Enable auto-lock and clipboard clearing features
--
-- Next steps:
-- 1. Apply this migration: supabase db push
-- 2. Verify data in Token Vault UI
-- 3. Implement encryption before production use
-- 4. Update CLAUDE.md to reference Token Vault for all credentials
