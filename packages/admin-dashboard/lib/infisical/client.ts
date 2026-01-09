/**
 * Infisical Client for Secret Management
 *
 * This module provides a centralized way to fetch secrets from Infisical.
 * It caches secrets in memory to avoid excessive API calls.
 */

import { InfisicalSDK } from '@infisical/sdk';

// Configuration from environment (these are the only secrets we need in .env)
const INFISICAL_CLIENT_ID = process.env.INFISICAL_CLIENT_ID || '137e53a3-d42f-4bdc-bada-bb9eb3493d56';
const INFISICAL_CLIENT_SECRET = process.env.INFISICAL_CLIENT_SECRET || '5b74b781cab12c399cc0360ec40cb65cebeb2b59bed0274892d2dabd5826949f';
const INFISICAL_PROJECT_ID = process.env.INFISICAL_PROJECT_ID || '2bd4f8b7-7448-4518-b884-e2d28d71c58f';
const INFISICAL_ENVIRONMENT = process.env.INFISICAL_ENVIRONMENT || 'prod';
const INFISICAL_SITE_URL = process.env.INFISICAL_SITE_URL || 'http://127.0.0.1:8200';

// Secret cache with TTL
interface CachedSecret {
  value: string;
  expiresAt: number;
}

const secretCache = new Map<string, CachedSecret>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

let infisicalClient: InfisicalSDK | null = null;

/**
 * Get or create the Infisical client instance
 */
async function getClient(): Promise<InfisicalSDK> {
  if (!infisicalClient) {
    infisicalClient = new InfisicalSDK({
      siteUrl: INFISICAL_SITE_URL,
    });

    await infisicalClient.auth().universalAuth.login({
      clientId: INFISICAL_CLIENT_ID,
      clientSecret: INFISICAL_CLIENT_SECRET,
    });
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
