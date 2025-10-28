/**
 * Environment Variable Validator
 *
 * Validates required environment variables on application startup
 * Prevents runtime errors due to missing configuration
 */

interface EnvValidationResult {
  valid: boolean;
  missing: string[];
  warnings: string[];
}

/**
 * Required environment variables
 */
const REQUIRED_ENV_VARS = {
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: 'Supabase URL',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'Supabase Anonymous Key',
  SUPABASE_SERVICE_ROLE_KEY: 'Supabase Service Role Key',

  // GoHighLevel
  GOHIGHLEVEL_API_KEY: 'GoHighLevel API Key',
  GOHIGHLEVEL_LOCATION_ID: 'GoHighLevel Location ID',

  // Cloudflare R2
  CLOUDFLARE_R2_ACCOUNT_ID: 'Cloudflare R2 Account ID',
  CLOUDFLARE_R2_ACCESS_KEY_ID: 'Cloudflare R2 Access Key',
  CLOUDFLARE_R2_SECRET_ACCESS_KEY: 'Cloudflare R2 Secret Key',
  CLOUDFLARE_R2_BUCKET_NAME: 'Cloudflare R2 Bucket Name',
} as const;

/**
 * Optional but recommended environment variables
 */
const RECOMMENDED_ENV_VARS = {
  GOHIGHLEVEL_PUBLIC_KEY: 'GoHighLevel Public Key (for webhook validation)',
  NEXT_PUBLIC_APP_URL: 'Application URL (for absolute URLs)',
} as const;

/**
 * Validate all required environment variables
 *
 * @param throwOnError - If true, throws error instead of returning result
 * @returns Validation result with missing variables
 */
export function validateEnvironment(throwOnError = false): EnvValidationResult {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  for (const [key, description] of Object.entries(REQUIRED_ENV_VARS)) {
    if (!process.env[key]) {
      missing.push(`${key} (${description})`);
    }
  }

  // Check recommended variables
  for (const [key, description] of Object.entries(RECOMMENDED_ENV_VARS)) {
    if (!process.env[key]) {
      warnings.push(`${key} (${description})`);
    }
  }

  const result = {
    valid: missing.length === 0,
    missing,
    warnings,
  };

  if (!result.valid && throwOnError) {
    throw new Error(
      `Missing required environment variables:\n${missing.map(m => `  - ${m}`).join('\n')}`
    );
  }

  return result;
}

/**
 * Validate environment and log results
 * Call this in your application's startup code (e.g., middleware.ts)
 */
export function validateEnvironmentWithLogging(): void {
  console.log('🔍 Validating environment variables...');

  const result = validateEnvironment(false);

  if (!result.valid) {
    console.error('❌ MISSING REQUIRED ENVIRONMENT VARIABLES:');
    result.missing.forEach((missing) => {
      console.error(`   - ${missing}`);
    });
    console.error('\n⚠️  Application may not function correctly!\n');
  } else {
    console.log('✅ All required environment variables are set');
  }

  if (result.warnings.length > 0) {
    console.warn('⚠️  RECOMMENDED ENVIRONMENT VARIABLES NOT SET:');
    result.warnings.forEach((warning) => {
      console.warn(`   - ${warning}`);
    });
    console.warn('\n');
  }
}

/**
 * Get masked environment variable (for safe logging)
 */
export function getMaskedEnv(key: string): string | undefined {
  const value = process.env[key];
  if (!value) return undefined;

  if (value.length <= 8) {
    return '***';
  }

  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

/**
 * Validate specific service configuration
 */
export function validateServiceConfig(service: 'supabase' | 'gohighlevel' | 'cloudflare'): boolean {
  switch (service) {
    case 'supabase':
      return !!(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );

    case 'gohighlevel':
      return !!(
        process.env.GOHIGHLEVEL_API_KEY &&
        process.env.GOHIGHLEVEL_LOCATION_ID
      );

    case 'cloudflare':
      return !!(
        process.env.CLOUDFLARE_R2_ACCOUNT_ID &&
        process.env.CLOUDFLARE_R2_ACCESS_KEY_ID &&
        process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY &&
        process.env.CLOUDFLARE_R2_BUCKET_NAME
      );

    default:
      return false;
  }
}

/**
 * Get environment summary (safe for logging)
 */
export function getEnvironmentSummary(): {
  nodeEnv: string;
  supabaseConfigured: boolean;
  gohighlevelConfigured: boolean;
  cloudflareConfigured: boolean;
  webhookValidationEnabled: boolean;
} {
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    supabaseConfigured: validateServiceConfig('supabase'),
    gohighlevelConfigured: validateServiceConfig('gohighlevel'),
    cloudflareConfigured: validateServiceConfig('cloudflare'),
    webhookValidationEnabled: !!process.env.GOHIGHLEVEL_PUBLIC_KEY,
  };
}
