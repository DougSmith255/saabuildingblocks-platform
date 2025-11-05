#!/usr/bin/env node
/**
 * Token Vault Population Script
 * Inserts all 38 credentials into master_controller_tokens table
 * Schema-correct version using encrypted_value, usage_notes, used_by[]
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load env vars
const envPath = path.join(__dirname, '../packages/admin-dashboard/.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length) {
    env[key.trim()] = valueParts.join('=').trim();
  }
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

const credentials = [
  // CRITICAL PRIORITY (8)
  {
    service_name: 'Cloudflare',
    token_type: 'API Token',
    encrypted_value: 'qZrHoJ4Kn9gTdcS5PQ9E6hhWlleYbnycR-CebIxb',
    priority: 'critical',
    status: 'active',
    usage_notes: 'Main Cloudflare API token for Pages deployment',
    used_by: ['Cloudflare Pages deployment', 'GitHub Actions workflows'],
    regeneration_url: 'https://dash.cloudflare.com/profile/api-tokens',
    regeneration_instructions: 'Create new API token with Pages:Edit permissions',
    expiration_date: null
  },
  {
    service_name: 'Cloudflare',
    token_type: 'Account ID',
    encrypted_value: 'a1ae4bb5913a89fea98821d7ba1ac304',
    priority: 'critical',
    status: 'active',
    usage_notes: 'Cloudflare account identifier',
    used_by: ['All Cloudflare API operations'],
    regeneration_url: 'https://dash.cloudflare.com/',
    regeneration_instructions: 'Account ID is permanent, found in dashboard URL',
    expiration_date: null
  },
  {
    service_name: 'Supabase',
    token_type: 'Service Role JWT',
    encrypted_value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkcHNhcWNzb2VjY2lvYXBnbGhpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTMzMDM3MSwiZXhwIjoyMDc0OTA2MzcxfQ.ne-D8B6J9g-ktxJMSQzbwozAdKAtmYxg0h2Lyq3BKFc',
    priority: 'critical',
    status: 'active',
    usage_notes: 'Supabase admin service role key. Bypasses RLS',
    used_by: ['Master Controller backend', 'Database admin'],
    regeneration_url: 'https://supabase.com/dashboard/project/edpsaqcsoeccioapglhi/settings/api',
    regeneration_instructions: 'Generate new service_role JWT in API settings',
    expiration_date: '2065-09-06'
  },
  {
    service_name: 'Supabase',
    token_type: 'Secret Key',
    encrypted_value: 'sb_secret_mPpHwA5bDHMI0VeowqQfJg_LcvH626q',
    priority: 'critical',
    status: 'active',
    usage_notes: 'New Supabase secret key format',
    used_by: ['New Supabase API format', 'Backend operations'],
    regeneration_url: 'https://supabase.com/dashboard/project/edpsaqcsoeccioapglhi/settings/api',
    regeneration_instructions: 'Regenerate in API settings under new format',
    expiration_date: null
  },
  {
    service_name: 'WordPress',
    token_type: 'Database Password',
    encrypted_value: 'your_new_secure_password',
    priority: 'critical',
    status: 'active',
    usage_notes: 'WordPress MySQL database password',
    used_by: ['WordPress core database connection'],
    regeneration_url: null,
    regeneration_instructions: 'Update via MySQL CLI or hosting provider panel',
    expiration_date: null
  },
  {
    service_name: 'WordPress',
    token_type: 'Application Password',
    encrypted_value: 'qFF8Ph4xkgiFeH78DWOGdf3z',
    priority: 'critical',
    status: 'active',
    usage_notes: 'WordPress REST API application password for dougsmart1',
    used_by: ['WordPress API authentication', 'Blog content fetching'],
    regeneration_url: 'https://wp.saabuildingblocks.com/wp-admin/profile.php',
    regeneration_instructions: 'Generate new application password in user profile',
    expiration_date: null
  },
  {
    service_name: 'Authentication System',
    token_type: 'JWT Access Secret',
    encrypted_value: 'HEIMcv8Wjn5SesUWsxQ9gy868U7/xQq83zn7MMgMzs4=',
    priority: 'critical',
    status: 'active',
    usage_notes: 'JWT signing secret for short-lived access tokens (15 minutes)',
    used_by: ['Short-lived access tokens', 'API authentication'],
    regeneration_url: null,
    regeneration_instructions: 'Generate new 32-byte base64 secret: openssl rand -base64 32',
    expiration_date: null
  },
  {
    service_name: 'Authentication System',
    token_type: 'JWT Refresh Secret',
    encrypted_value: 'kUUGY2Vv3JO4f//Vpukmtb3u1qj8xdBseR0ugBlCbbg=',
    priority: 'critical',
    status: 'active',
    usage_notes: 'JWT signing secret for long-lived refresh tokens (7 days)',
    used_by: ['Long-lived refresh tokens', 'Session management'],
    regeneration_url: null,
    regeneration_instructions: 'Generate new 32-byte base64 secret: openssl rand -base64 32',
    expiration_date: null
  },

  // HIGH PRIORITY (15)
  {
    service_name: 'Supabase',
    token_type: 'Project URL',
    encrypted_value: 'https://edpsaqcsoeccioapglhi.supabase.co',
    priority: 'high',
    status: 'active',
    usage_notes: 'Supabase project API endpoint',
    used_by: ['All Supabase connections'],
    regeneration_url: null,
    regeneration_instructions: 'Project URL is permanent, found in project settings',
    expiration_date: null
  },
  {
    service_name: 'Supabase',
    token_type: 'Anon Key',
    encrypted_value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkcHNhcWNzb2VjY2lvYXBnbGhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MDI1NjEsImV4cCI6MjA1OTI3ODU2MX0.5pQRhWRNNqLMaL8aq55c-eMbWTL9QoVBUHb0dxz2NZ0',
    priority: 'high',
    status: 'active',
    usage_notes: 'Supabase anonymous/public key. Safe for frontend. RLS protects data',
    used_by: ['Client-side Supabase connections', 'Frontend applications'],
    regeneration_url: 'https://supabase.com/dashboard/project/edpsaqcsoeccioapglhi/settings/api',
    regeneration_instructions: 'Generate new anon JWT in API settings',
    expiration_date: '2035-01-28'
  },
  {
    service_name: 'Supabase',
    token_type: 'Publishable Key',
    encrypted_value: 'sb_publishable_btsmK10ssraAhjDbmbL11Q_U1UajvVn',
    priority: 'high',
    status: 'active',
    usage_notes: 'New Supabase publishable key format',
    used_by: ['New Supabase API format', 'Frontend applications'],
    regeneration_url: 'https://supabase.com/dashboard/project/edpsaqcsoeccioapglhi/settings/api',
    regeneration_instructions: 'Regenerate in API settings under new format',
    expiration_date: null
  },
  {
    service_name: 'Cloudflare R2',
    token_type: 'Access Key ID',
    encrypted_value: '2a24f06295454bd462ed4548c7218c15',
    priority: 'high',
    status: 'active',
    usage_notes: 'R2 S3-compatible access key ID. Bucket: saabuildingblocks-assets',
    used_by: ['R2 bucket operations', 'Profile pictures', 'Blog media'],
    regeneration_url: 'https://dash.cloudflare.com/a1ae4bb5913a89fea98821d7ba1ac304/r2/overview/api-tokens',
    regeneration_instructions: 'Create new R2 API token with read/write permissions',
    expiration_date: null
  },
  {
    service_name: 'Cloudflare R2',
    token_type: 'Secret Access Key',
    encrypted_value: 'f333f1b4909b77ae1f3d1aee98510635e5c90527f3dc7b9ab48859349d13b424',
    priority: 'high',
    status: 'active',
    usage_notes: 'R2 S3-compatible secret access key',
    used_by: ['R2 bucket authentication', 'S3 API operations'],
    regeneration_url: 'https://dash.cloudflare.com/a1ae4bb5913a89fea98821d7ba1ac304/r2/overview/api-tokens',
    regeneration_instructions: 'Create new R2 API token with read/write permissions',
    expiration_date: null
  },
  {
    service_name: 'Cloudflare R2',
    token_type: 'API Token',
    encrypted_value: 'un5AIXkbAz809RZamMpZxFDPMUq52wOzoe-zbELr',
    priority: 'high',
    status: 'active',
    usage_notes: 'R2 API token for direct R2 API operations',
    used_by: ['R2 API operations'],
    regeneration_url: 'https://dash.cloudflare.com/a1ae4bb5913a89fea98821d7ba1ac304/r2/overview/api-tokens',
    regeneration_instructions: 'Create new R2 API token',
    expiration_date: null
  },
  {
    service_name: 'GoHighLevel',
    token_type: 'API Key',
    encrypted_value: 'pit-492db3c0-cdeb-4004-8de2-56e4491cd2e0',
    priority: 'high',
    status: 'active',
    usage_notes: 'GoHighLevel CRM API key',
    used_by: ['Agent Portal activation emails', 'CRM integration'],
    regeneration_url: 'https://app.gohighlevel.com/settings/integrations',
    regeneration_instructions: 'Generate new API key in integrations settings',
    expiration_date: null
  },
  {
    service_name: 'GoHighLevel',
    token_type: 'Location ID',
    encrypted_value: 'wfdo2pKXw0XoQ7zxjIX2',
    priority: 'high',
    status: 'active',
    usage_notes: 'GoHighLevel location identifier',
    used_by: ['GoHighLevel location-specific operations'],
    regeneration_url: null,
    regeneration_instructions: 'Location ID is permanent, found in location settings',
    expiration_date: null
  },
  {
    service_name: 'Next.js ISR',
    token_type: 'Revalidation Secret',
    encrypted_value: 'ra+Eo4M/nKg32mf4Lvb7QS1GwXTKAQPBztzVW7Pe+0A=',
    priority: 'high',
    status: 'active',
    usage_notes: 'Next.js ISR revalidation webhook secret',
    used_by: ['WordPress webhook for ISR revalidation'],
    regeneration_url: null,
    regeneration_instructions: 'Generate new 32-byte base64 secret: openssl rand -base64 32',
    expiration_date: null
  },
  {
    service_name: 'Internal API',
    token_type: 'Basic Auth Username',
    encrypted_value: 'builder_user',
    priority: 'high',
    status: 'active',
    usage_notes: 'Basic authentication username for internal API',
    used_by: ['/api/users endpoint', 'Internal API operations'],
    regeneration_url: null,
    regeneration_instructions: 'Update in .env.local and restart service',
    expiration_date: null
  },
  {
    service_name: 'Internal API',
    token_type: 'Basic Auth Password',
    encrypted_value: 'K8mN#Build7$Q2',
    priority: 'high',
    status: 'active',
    usage_notes: 'Basic authentication password for internal API',
    used_by: ['/api/users endpoint', 'Internal API operations'],
    regeneration_url: null,
    regeneration_instructions: 'Update in .env.local and restart service',
    expiration_date: null
  },
  {
    service_name: 'Cloudflare Workers',
    token_type: 'Cache Purge Token',
    encrypted_value: 'ywcAiMXEf1OdwNjWo1QB0Vxuv8UbvMu9sJmjl1WCGQo=',
    priority: 'high',
    status: 'active',
    usage_notes: 'Cloudflare Workers cache purge authentication token',
    used_by: ['Cache purge authentication'],
    regeneration_url: null,
    regeneration_instructions: 'Generate new 32-byte base64 secret: openssl rand -base64 32',
    expiration_date: null
  },
  {
    service_name: 'Cloudflare Workers',
    token_type: 'API Purge Token',
    encrypted_value: 'AXXXuTuOqPGiofZI/JLmwX8GCitQcCgzwLL8H97devY=',
    priority: 'high',
    status: 'active',
    usage_notes: 'Cloudflare API-based cache purge token',
    used_by: ['API-based cache purging'],
    regeneration_url: null,
    regeneration_instructions: 'Generate new 32-byte base64 secret: openssl rand -base64 32',
    expiration_date: null
  },
  {
    service_name: 'WordPress',
    token_type: 'AUTH_KEY',
    encrypted_value: 'JNH7lL<_GWzWh*PGoQFo;e(8AP(h6kWHV|<#p=Ux7#({?3G8R=~%e+:,Eyb,a?nA',
    priority: 'high',
    status: 'active',
    usage_notes: 'WordPress authentication salt key',
    used_by: ['WordPress cookie authentication'],
    regeneration_url: 'https://api.wordpress.org/secret-key/1.1/salt/',
    regeneration_instructions: 'Generate new salt keys and update wp-config.php',
    expiration_date: null
  },
  {
    service_name: 'GitHub',
    token_type: 'Personal Access Token',
    encrypted_value: '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',
    priority: 'high',
    status: 'active',
    usage_notes: 'GitHub Actions deployment token',
    used_by: ['GitHub Actions automation', 'Deployment'],
    regeneration_url: 'https://github.com/settings/tokens',
    regeneration_instructions: 'Generate new classic PAT with repo, workflow permissions',
    expiration_date: null
  },

  // MEDIUM PRIORITY (11)
  {
    service_name: 'Cloudflare KV',
    token_type: 'Namespace ID (Production)',
    encrypted_value: '740d034ae4f44206a3e7ca678d3a0c62',
    priority: 'medium',
    status: 'active',
    usage_notes: 'Cloudflare KV namespace ID for blog cache storage',
    used_by: ['Blog cache storage', 'Workers KV operations'],
    regeneration_url: null,
    regeneration_instructions: 'Namespace ID is permanent, created with KV namespace',
    expiration_date: null
  },
  {
    service_name: 'Cloudflare KV',
    token_type: 'Namespace ID (Preview)',
    encrypted_value: 'e4f168585bb141e9b5fd0465d86dde13',
    priority: 'medium',
    status: 'active',
    usage_notes: 'Cloudflare KV namespace ID for preview environment',
    used_by: ['Blog cache preview environment'],
    regeneration_url: null,
    regeneration_instructions: 'Namespace ID is permanent, created with KV namespace',
    expiration_date: null
  },
  {
    service_name: 'Cloudflare R2',
    token_type: 'S3 Endpoint',
    encrypted_value: 'https://a1ae4bb5913a89fea98821d7ba1ac304.r2.cloudflarestorage.com',
    priority: 'medium',
    status: 'active',
    usage_notes: 'R2 S3-compatible API endpoint',
    used_by: ['R2 S3 API operations'],
    regeneration_url: null,
    regeneration_instructions: 'Endpoint is permanent, based on account ID',
    expiration_date: null
  },
  {
    service_name: 'Cloudflare R2',
    token_type: 'Public URL',
    encrypted_value: 'https://assets.saabuildingblocks.com',
    priority: 'medium',
    status: 'active',
    usage_notes: 'R2 public CDN URL for asset serving',
    used_by: ['Public asset serving', 'Blog images'],
    regeneration_url: null,
    regeneration_instructions: 'Custom domain configured in R2 bucket settings',
    expiration_date: null
  },
  {
    service_name: 'Cloudflare R2',
    token_type: 'Bucket Name',
    encrypted_value: 'saabuildingblocks-assets',
    priority: 'medium',
    status: 'active',
    usage_notes: 'R2 bucket name for assets',
    used_by: ['R2 asset storage'],
    regeneration_url: null,
    regeneration_instructions: 'Bucket name is permanent',
    expiration_date: null
  },
  {
    service_name: 'Webhooks',
    token_type: 'Deployment Webhook Secret',
    encrypted_value: 'b4c35d1a56459e5770bc0b6b7fd9f76d5dffe6e8549f4e33fcc57fcddc87baae',
    priority: 'medium',
    status: 'active',
    usage_notes: 'GitHub Actions webhook callback secret',
    used_by: ['Deployment automation webhooks'],
    regeneration_url: null,
    regeneration_instructions: 'Generate new SHA-256 hex: openssl rand -hex 32',
    expiration_date: null
  },
  {
    service_name: 'WordPress',
    token_type: 'SECURE_AUTH_KEY',
    encrypted_value: 'L(NKk0g$`S[zK<+XBGe6@`F|kv|=z9jx=4Aj5i(M8K5bFQ-F}Z|nLZr1{Y|tl52W',
    priority: 'medium',
    status: 'active',
    usage_notes: 'WordPress secure authentication salt key',
    used_by: ['WordPress secure cookie authentication'],
    regeneration_url: 'https://api.wordpress.org/secret-key/1.1/salt/',
    regeneration_instructions: 'Generate new salt keys and update wp-config.php',
    expiration_date: null
  },
  {
    service_name: 'WordPress',
    token_type: 'LOGGED_IN_KEY',
    encrypted_value: 'Bt&|rj*PxG+S9~MNPBS,JGd_tIb1*uH!~y{d~HQ*-C@pM<#.@W|H,h|/cY#a,HF5',
    priority: 'medium',
    status: 'active',
    usage_notes: 'WordPress logged-in cookie salt key',
    used_by: ['WordPress logged-in cookie authentication'],
    regeneration_url: 'https://api.wordpress.org/secret-key/1.1/salt/',
    regeneration_instructions: 'Generate new salt keys and update wp-config.php',
    expiration_date: null
  },
  {
    service_name: 'WordPress',
    token_type: 'NONCE_KEY',
    encrypted_value: '9A|_G#(JC*O$9Z4HFI^0h=!YH2&[E!P:_G!Bs4}UJ4o^Ar7DdB9s!9s0f_$TqwUy',
    priority: 'medium',
    status: 'active',
    usage_notes: 'WordPress nonce salt key',
    used_by: ['WordPress CSRF protection'],
    regeneration_url: 'https://api.wordpress.org/secret-key/1.1/salt/',
    regeneration_instructions: 'Generate new salt keys and update wp-config.php',
    expiration_date: null
  },
  {
    service_name: 'WordPress',
    token_type: 'AUTH_SALT',
    encrypted_value: 'pDy5-X<8J:zGhD)~M%&@P1qN+Ws3?{aOH`&}qF2m:b_<XkU5$k4WMR+Rv:Gr7E<E',
    priority: 'medium',
    status: 'active',
    usage_notes: 'WordPress authentication salt',
    used_by: ['WordPress cookie authentication'],
    regeneration_url: 'https://api.wordpress.org/secret-key/1.1/salt/',
    regeneration_instructions: 'Generate new salt keys and update wp-config.php',
    expiration_date: null
  },
  {
    service_name: 'WordPress',
    token_type: 'SECURE_AUTH_SALT',
    encrypted_value: '+-[t}?*@CY2Ky7jNJGd{i%5Sk3P8e0Hb;U&F9mV>Xq<L|aO1W~Zc$Rn6D,wQ4pT#',
    priority: 'medium',
    status: 'active',
    usage_notes: 'WordPress secure authentication salt',
    used_by: ['WordPress secure cookie authentication'],
    regeneration_url: 'https://api.wordpress.org/secret-key/1.1/salt/',
    regeneration_instructions: 'Generate new salt keys and update wp-config.php',
    expiration_date: null
  },

  // LOW PRIORITY (3)
  {
    service_name: 'GitHub',
    token_type: 'Repository Owner',
    encrypted_value: 'DougSmith255',
    priority: 'low',
    status: 'active',
    usage_notes: 'GitHub repository owner username',
    used_by: ['GitHub Actions automation'],
    regeneration_url: null,
    regeneration_instructions: 'Repository owner is permanent',
    expiration_date: null
  },
  {
    service_name: 'GitHub',
    token_type: 'Repository Name',
    encrypted_value: 'saabuildingblocks-platform',
    priority: 'low',
    status: 'active',
    usage_notes: 'GitHub repository name',
    used_by: ['GitHub Actions automation'],
    regeneration_url: null,
    regeneration_instructions: 'Repository name is permanent',
    expiration_date: null
  },
  {
    service_name: 'WordPress',
    token_type: 'Table Prefix',
    encrypted_value: 'wp_',
    priority: 'low',
    status: 'active',
    usage_notes: 'WordPress database table prefix',
    used_by: ['WordPress database table naming'],
    regeneration_url: null,
    regeneration_instructions: 'Table prefix is permanent',
    expiration_date: null
  },

  // CLAUDE AI (ADDITIONAL - 2)
  {
    service_name: 'Claude AI',
    token_type: 'OAuth Access Token',
    encrypted_value: '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',
    priority: 'high',
    status: 'active',
    usage_notes: 'Claude AI OAuth access token',
    used_by: ['Claude Code development environment'],
    regeneration_url: 'https://console.anthropic.com/settings/oauth',
    regeneration_instructions: 'Refresh token via OAuth flow',
    expiration_date: '2026-05-04'
  },
  {
    service_name: 'Claude AI',
    token_type: 'OAuth Refresh Token',
    encrypted_value: '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',
    priority: 'high',
    status: 'active',
    usage_notes: 'Claude AI OAuth refresh token',
    used_by: ['Claude Code session refresh'],
    regeneration_url: 'https://console.anthropic.com/settings/oauth',
    regeneration_instructions: 'Refresh token via OAuth flow',
    expiration_date: '2026-05-04'
  }
];

async function populateTokenVault() {
  console.log('\n🔐 Populating Token Vault...\n');
  console.log(`Total credentials to insert: ${credentials.length}\n`);

  let inserted = 0;
  let errors = 0;

  for (const cred of credentials) {
    try {
      const { data, error } = await supabase
        .from('master_controller_tokens')
        .insert([cred])
        .select();

      if (error) {
        console.error(`❌ ${cred.service_name} - ${cred.token_type}: ${error.message}`);
        errors++;
      } else {
        console.log(`✓ ${cred.service_name} - ${cred.token_type}`);
        inserted++;
      }
    } catch (err) {
      console.error(`❌ ${cred.service_name} - ${cred.token_type}: ${err.message}`);
      errors++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Token Vault Population Complete!`);
  console.log('='.repeat(60));
  console.log(`Inserted: ${inserted}`);
  console.log(`Errors: ${errors}`);
  console.log(`Total: ${credentials.length}\n`);
  console.log('⚠️  Credentials are in PLAIN TEXT - Encrypt via Master Controller UI\n');
}

populateTokenVault().catch(console.error);
