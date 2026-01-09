/**
 * Secret Access Helpers
 *
 * Provides typed access to secrets organized by service.
 * Uses Infisical with fallback to environment variables for backwards compatibility.
 */

import { getSecret, getSecrets, getSecretWithFallback } from './client';

// ============================================================================
// SUPABASE SECRETS
// ============================================================================

export async function getSupabaseUrl(): Promise<string> {
  return (await getSecretWithFallback('NEXT_PUBLIC_SUPABASE_URL', '/supabase')) || '';
}

export async function getSupabaseAnonKey(): Promise<string> {
  return (await getSecretWithFallback('NEXT_PUBLIC_SUPABASE_ANON_KEY', '/supabase')) || '';
}

export async function getSupabaseServiceRoleKey(): Promise<string> {
  return (await getSecretWithFallback('SUPABASE_SERVICE_ROLE_KEY', '/supabase')) || '';
}

export async function getSupabaseSecrets() {
  return getSecrets('/supabase');
}

// ============================================================================
// JWT AUTH SECRETS
// ============================================================================

export async function getJwtAccessSecret(): Promise<string> {
  return (await getSecretWithFallback('JWT_ACCESS_SECRET', '/auth')) || '';
}

export async function getJwtRefreshSecret(): Promise<string> {
  return (await getSecretWithFallback('JWT_REFRESH_SECRET', '/auth')) || '';
}

export async function getAuthSecrets() {
  return getSecrets('/auth');
}

// ============================================================================
// EMAIL (RESEND) SECRETS
// ============================================================================

export async function getResendApiKey(): Promise<string> {
  return (await getSecretWithFallback('RESEND_API_KEY', '/email')) || '';
}

export async function getEmailFrom(): Promise<string> {
  return (await getSecretWithFallback('EMAIL_FROM', '/email')) || 'Agent Portal <noreply@smartagentalliance.com>';
}

export async function getEmailReplyTo(): Promise<string> {
  return (await getSecretWithFallback('EMAIL_REPLY_TO', '/email')) || 'team@smartagentalliance.com';
}

export async function getEmailSecrets() {
  return getSecrets('/email');
}

// ============================================================================
// GOHIGHLEVEL (CRM) SECRETS
// ============================================================================

export async function getGoHighLevelApiKey(): Promise<string> {
  return (await getSecretWithFallback('GOHIGHLEVEL_API_KEY', '/crm')) || '';
}

export async function getGoHighLevelLocationId(): Promise<string> {
  return (await getSecretWithFallback('GOHIGHLEVEL_LOCATION_ID', '/crm')) || '';
}

export async function getCrmSecrets() {
  return getSecrets('/crm');
}

// ============================================================================
// CLOUDFLARE SECRETS
// ============================================================================

export async function getCloudflareAccountId(): Promise<string> {
  return (await getSecretWithFallback('CLOUDFLARE_ACCOUNT_ID', '/cloudflare')) || '';
}

export async function getR2AccessKeyId(): Promise<string> {
  return (await getSecretWithFallback('R2_ACCESS_KEY_ID', '/cloudflare')) || '';
}

export async function getR2SecretAccessKey(): Promise<string> {
  return (await getSecretWithFallback('R2_SECRET_ACCESS_KEY', '/cloudflare')) || '';
}

export async function getR2Endpoint(): Promise<string> {
  return (await getSecretWithFallback('R2_ENDPOINT', '/cloudflare')) || '';
}

export async function getR2BucketName(): Promise<string> {
  return (await getSecretWithFallback('R2_BUCKET_NAME', '/cloudflare')) || 'saabuildingblocks-assets';
}

export async function getR2PublicUrl(): Promise<string> {
  return (await getSecretWithFallback('R2_PUBLIC_URL', '/cloudflare')) || '';
}

export async function getCloudflareSecrets() {
  return getSecrets('/cloudflare');
}

// ============================================================================
// WORDPRESS SECRETS
// ============================================================================

export async function getWordpressUrl(): Promise<string> {
  return (await getSecretWithFallback('WORDPRESS_URL', '/wordpress')) || '';
}

export async function getWordpressUser(): Promise<string> {
  return (await getSecretWithFallback('WORDPRESS_USER', '/wordpress')) || '';
}

export async function getWordpressAppPassword(): Promise<string> {
  return (await getSecretWithFallback('WORDPRESS_APP_PASSWORD', '/wordpress')) || '';
}

export async function getWordpressSecrets() {
  return getSecrets('/wordpress');
}

// ============================================================================
// GITHUB SECRETS
// ============================================================================

export async function getGithubToken(): Promise<string> {
  return (await getSecretWithFallback('GITHUB_TOKEN', '/github')) || '';
}

export async function getGithubOwner(): Promise<string> {
  return (await getSecretWithFallback('GITHUB_OWNER', '/github')) || '';
}

export async function getGithubRepo(): Promise<string> {
  return (await getSecretWithFallback('GITHUB_REPO', '/github')) || '';
}

export async function getDeploymentWebhookSecret(): Promise<string> {
  return (await getSecretWithFallback('DEPLOYMENT_WEBHOOK_SECRET', '/github')) || '';
}

export async function getGithubSecrets() {
  return getSecrets('/github');
}

// ============================================================================
// API AUTH SECRETS
// ============================================================================

export async function getApiBasicAuthUser(): Promise<string> {
  return (await getSecretWithFallback('API_BASIC_AUTH_USER', '/api')) || '';
}

export async function getApiBasicAuthPassword(): Promise<string> {
  return (await getSecretWithFallback('API_BASIC_AUTH_PASSWORD', '/api')) || '';
}

export async function getApiSecrets() {
  return getSecrets('/api');
}

// ============================================================================
// SEARCH SECRETS
// ============================================================================

export async function getBraveApiKey(): Promise<string> {
  return (await getSecretWithFallback('BRAVE_API_KEY', '/search')) || '';
}

export async function getSearchSecrets() {
  return getSecrets('/search');
}
