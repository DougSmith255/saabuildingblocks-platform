/**
 * Infisical Client for Secret Management
 *
 * This module provides a centralized way to fetch secrets from Infisical.
 * It caches secrets in memory to avoid excessive API calls.
 *
 * NOTE: If INFISICAL_ENABLED is not set to 'true', this module will skip
 * Infisical and fall back to environment variables immediately.
 */

import { InfisicalSDK } from '@infisical/sdk';

// Configuration from environment (these are the only secrets we need in .env)
const INFISICAL_ENABLED = process.env.INFISICAL_ENABLED === 'true';
const INFISICAL_CLIENT_ID = process.env.INFISICAL_CLIENT_ID || '';
const INFISICAL_CLIENT_SECRET = process.env.INFISICAL_CLIENT_SECRET || '';
const INFISICAL_PROJECT_ID = process.env.INFISICAL_PROJECT_ID || '';
const INFISICAL_ENVIRONMENT = process.env.INFISICAL_ENVIRONMENT || 'prod';
const INFISICAL_SITE_URL = process.env.INFISICAL_SITE_URL || '';

// Secret cache with TTL
interface CachedSecret {
  value: string;
  expiresAt: number;
}

const secretCache = new Map<string, CachedSecret>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

let infisicalClient: InfisicalSDK | null = null;
let infisicalFailed = false; // Flag to prevent repeated connection attempts

/**
 * Check if Infisical is properly configured
 */
function isInfisicalConfigured(): boolean {
  return INFISICAL_ENABLED &&
         !!INFISICAL_CLIENT_ID &&
         !!INFISICAL_CLIENT_SECRET &&
         !!INFISICAL_PROJECT_ID &&
         !!INFISICAL_SITE_URL;
}

/**
 * Get or create the Infisical client instance
 * Returns null if Infisical is not configured or has previously failed
 */
async function getClient(): Promise<InfisicalSDK | null> {
  // Skip if not configured or previously failed
  if (!isInfisicalConfigured() || infisicalFailed) {
    return null;
  }

  if (!infisicalClient) {
    try {
      infisicalClient = new InfisicalSDK({
        siteUrl: INFISICAL_SITE_URL,
      });

      // Add timeout using Promise.race
      const loginPromise = infisicalClient.auth().universalAuth.login({
        clientId: INFISICAL_CLIENT_ID,
        clientSecret: INFISICAL_CLIENT_SECRET,
      });

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Infisical connection timeout')), 2000);
      });

      await Promise.race([loginPromise, timeoutPromise]);
    } catch (error) {
      console.warn('[Infisical] Connection failed, falling back to environment variables:',
        error instanceof Error ? error.message : 'Unknown error');
      infisicalClient = null;
      infisicalFailed = true; // Don't try again this process
      return null;
    }
  }
  return infisicalClient;
}

/**
 * Fetch a single secret from Infisical
 * @param secretName - Name of the secret (e.g., "RESEND_API_KEY")
 * @param secretPath - Path to the secret folder (e.g., "/email")
 * @returns The secret value or null if not found
 */
export async function getSecret(secretName: string, secretPath: string = '/'): Promise<string | null> {
  const cacheKey = `${secretPath}:${secretName}`;

  // Check cache first
  const cached = secretCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }

  try {
    const client = await getClient();

    // If client is null (not configured or failed), return null
    if (!client) {
      return null;
    }

    const secret = await client.secrets().getSecret({
      secretName,
      projectId: INFISICAL_PROJECT_ID,
      environment: INFISICAL_ENVIRONMENT,
      secretPath: secretPath,
    });

    const value = secret.secretValue;

    // Cache the secret
    secretCache.set(cacheKey, {
      value,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    return value;
  } catch (error) {
    console.error(`[Infisical] Error fetching secret ${secretName} from ${secretPath}:`, error);
    return null;
  }
}

/**
 * Fetch all secrets from a specific path
 * @param secretPath - Path to the secret folder (e.g., "/email")
 * @returns Object with secret names as keys and values
 */
export async function getSecrets(secretPath: string = '/'): Promise<Record<string, string>> {
  try {
    const client = await getClient();

    // If client is null (not configured or failed), return empty
    if (!client) {
      return {};
    }

    const response = await client.secrets().listSecrets({
      projectId: INFISICAL_PROJECT_ID,
      environment: INFISICAL_ENVIRONMENT,
      secretPath: secretPath,
    });
    const secrets = response.secrets;

    const result: Record<string, string> = {};
    for (const secret of secrets) {
      result[secret.secretKey] = secret.secretValue;

      // Cache each secret
      const cacheKey = `${secretPath}:${secret.secretKey}`;
      secretCache.set(cacheKey, {
        value: secret.secretValue,
        expiresAt: Date.now() + CACHE_TTL_MS,
      });
    }

    return result;
  } catch (error) {
    console.error(`[Infisical] Error fetching secrets from ${secretPath}:`, error);
    return {};
  }
}

/**
 * Get a secret with fallback to environment variable
 * This allows gradual migration from .env to Infisical
 */
export async function getSecretWithFallback(
  secretName: string,
  secretPath: string = '/',
  envVarName?: string
): Promise<string | null> {
  // First try Infisical
  const infisicalValue = await getSecret(secretName, secretPath);
  if (infisicalValue) {
    return infisicalValue;
  }

  // Fall back to environment variable
  const envName = envVarName || secretName;
  return process.env[envName] || null;
}

/**
 * Clear the secret cache
 * Useful when you know secrets have been updated
 */
export function clearSecretCache(): void {
  secretCache.clear();
}

/**
 * Preload secrets from multiple paths
 * Call this at app startup to warm the cache
 */
export async function preloadSecrets(paths: string[] = ['/supabase', '/auth', '/email', '/crm', '/cloudflare']): Promise<void> {
  console.log('[Infisical] Preloading secrets...');

  await Promise.all(paths.map(path => getSecrets(path)));

  console.log(`[Infisical] Preloaded secrets from ${paths.length} paths`);
}

// Export types
export type { InfisicalSDK };
