/**
 * Infisical Secret Management
 *
 * Re-exports all secret management utilities.
 */

export {
  getSecret,
  getSecrets,
  getSecretWithFallback,
  clearSecretCache,
  preloadSecrets,
} from './client';

export {
  // Supabase
  getSupabaseUrl,
  getSupabaseAnonKey,
  getSupabaseServiceRoleKey,
  getSupabaseSecrets,

  // JWT Auth
  getJwtAccessSecret,
  getJwtRefreshSecret,
  getAuthSecrets,

  // Email (Resend)
  getResendApiKey,
  getEmailFrom,
  getEmailReplyTo,
  getEmailSecrets,

  // GoHighLevel (CRM)
  getGoHighLevelApiKey,
  getGoHighLevelLocationId,
  getCrmSecrets,

  // Cloudflare
  getCloudflareAccountId,
  getR2AccessKeyId,
  getR2SecretAccessKey,
  getR2Endpoint,
  getR2BucketName,
  getR2PublicUrl,
  getCloudflareSecrets,

  // WordPress
  getWordpressUrl,
  getWordpressUser,
  getWordpressAppPassword,
  getWordpressSecrets,

  // GitHub
  getGithubToken,
  getGithubOwner,
  getGithubRepo,
  getDeploymentWebhookSecret,
  getGithubSecrets,

  // API Auth
  getApiBasicAuthUser,
  getApiBasicAuthPassword,
  getApiSecrets,

  // Search
  getBraveApiKey,
  getSearchSecrets,
} from './secrets';
