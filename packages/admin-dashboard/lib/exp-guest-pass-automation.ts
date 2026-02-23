/**
 * eXp World Guest Pass — Direct API Submission
 *
 * Calls the eXp guest-pass API directly with an Okta Bearer token,
 * eliminating the need for browser automation entirely.
 *
 * Flow:
 *  1. Load stored tokens from disk
 *  2. If expired, refresh via Okta refresh_token grant
 *  3. If refresh fails, do a full PKCE auth flow via Okta APIs (no browser)
 *  4. POST to eXp create-guest-pass API with Bearer token
 *
 * Token storage: /tmp/exp-okta-session/tokens.json
 * Credentials:   /tmp/exp-okta-session/credentials.json
 */

import * as crypto from 'crypto';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as https from 'https';

const SESSION_DIR = '/tmp/exp-okta-session';
const TOKENS_PATH = path.join(SESSION_DIR, 'tokens.json');
const CREDENTIALS_PATH = path.join(SESSION_DIR, 'credentials.json');

const OKTA_DOMAIN = 'exprealty.okta.com';
const CLIENT_ID = '0oaraytyasR3JzC712p7';
const REDIRECT_URI = 'https://my.exprealty.com/auth.html';
const SCOPES = 'offline_access openid profile groups';

const EXP_GUEST_PASS_URL = 'https://f7tq6sij1f.execute-api.us-east-1.amazonaws.com/Prod/gms/create-guest-pass';

interface GuestPassInput {
  firstName: string;
  lastName: string;
  email: string;
}

interface GuestPassResult {
  success: boolean;
  error?: string;
}

interface StoredTokens {
  access_token: string;
  id_token: string;
  refresh_token: string;
  expires_in: number;
  obtained_at: number;
}

// ---------------------------------------------------------------------------
// HTTPS helpers
// ---------------------------------------------------------------------------

function httpsRequest(
  url: string,
  options: { method?: string; headers?: Record<string, string>; body?: string }
): Promise<{ status: number; headers: Record<string, string>; body: string }> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const req = https.request(
      {
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        method: options.method || 'GET',
        headers: options.headers || {},
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () =>
          resolve({
            status: res.statusCode || 0,
            headers: (res.headers || {}) as Record<string, string>,
            body: data,
          })
        );
      }
    );
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

// ---------------------------------------------------------------------------
// PKCE helpers
// ---------------------------------------------------------------------------

function generateCodeVerifier(): string {
  return crypto.randomBytes(32).toString('base64url');
}

function generateCodeChallenge(verifier: string): string {
  return crypto.createHash('sha256').update(verifier).digest('base64url');
}

// ---------------------------------------------------------------------------
// Credentials
// ---------------------------------------------------------------------------

async function getCredentials(): Promise<{ email: string; password: string }> {
  const email = process.env.EXP_OKTA_EMAIL;
  const password = process.env.EXP_OKTA_PASSWORD;

  try {
    const creds = JSON.parse(await fs.readFile(CREDENTIALS_PATH, 'utf-8'));
    return { email: creds.email || email || '', password: creds.password || password || '' };
  } catch {
    if (!email || !password) {
      throw new Error('Okta credentials not found — set EXP_OKTA_EMAIL/EXP_OKTA_PASSWORD or create credentials.json');
    }
    return { email, password };
  }
}

// ---------------------------------------------------------------------------
// Token management
// ---------------------------------------------------------------------------

async function loadTokens(): Promise<StoredTokens | null> {
  try {
    const raw = await fs.readFile(TOKENS_PATH, 'utf-8');
    return JSON.parse(raw) as StoredTokens;
  } catch {
    return null;
  }
}

async function saveTokens(tokens: StoredTokens): Promise<void> {
  await fs.mkdir(SESSION_DIR, { recursive: true });
  await fs.writeFile(TOKENS_PATH, JSON.stringify(tokens, null, 2));
}

function isTokenExpired(tokens: StoredTokens): boolean {
  const expiresAt = tokens.obtained_at + tokens.expires_in;
  const now = Math.floor(Date.now() / 1000);
  return now >= expiresAt - 120; // 2-minute safety margin
}

/**
 * Refresh an existing token using the refresh_token grant.
 */
async function refreshTokens(refreshToken: string): Promise<StoredTokens> {
  console.log('[exp-guest-pass] Refreshing tokens via refresh_token grant...');

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: CLIENT_ID,
    scope: SCOPES,
  }).toString();

  const res = await httpsRequest(`https://${OKTA_DOMAIN}/oauth2/v1/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body,
  });

  const data = JSON.parse(res.body);
  if (data.error) {
    throw new Error(`Token refresh failed: ${data.error} — ${data.error_description}`);
  }

  const tokens: StoredTokens = {
    access_token: data.access_token,
    id_token: data.id_token,
    refresh_token: data.refresh_token || refreshToken,
    expires_in: data.expires_in,
    obtained_at: Math.floor(Date.now() / 1000),
  };

  await saveTokens(tokens);
  console.log('[exp-guest-pass] Tokens refreshed successfully');
  return tokens;
}

/**
 * Full PKCE authentication flow using Okta APIs (no browser required).
 *
 * Step 1: POST /api/v1/authn → sessionToken
 * Step 2: GET /oauth2/v1/authorize?sessionToken=... → auth code via 302 redirect
 * Step 3: POST /oauth2/v1/token with code_verifier → tokens
 */
async function authenticateFull(): Promise<StoredTokens> {
  const { email, password } = await getCredentials();
  console.log('[exp-guest-pass] Full PKCE auth flow starting...');

  // Step 1: Authenticate
  const authnRes = await httpsRequest(`https://${OKTA_DOMAIN}/api/v1/authn`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ username: email, password }),
  });

  const authnData = JSON.parse(authnRes.body);
  if (authnData.status !== 'SUCCESS') {
    throw new Error(`Okta authentication failed: ${authnData.status} — ${authnData.errorSummary || 'unknown'}`);
  }
  const sessionToken = authnData.sessionToken;
  console.log('[exp-guest-pass] Session token obtained');

  // Step 2: Authorization code
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  const state = 'saa' + Date.now();

  const authUrl =
    `https://${OKTA_DOMAIN}/oauth2/v1/authorize?` +
    `response_type=code&` +
    `scope=${encodeURIComponent(SCOPES)}&` +
    `client_id=${CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `state=${state}&` +
    `code_challenge=${codeChallenge}&` +
    `code_challenge_method=S256&` +
    `sessionToken=${sessionToken}`;

  const authRes = await httpsRequest(authUrl, {});
  const location = authRes.headers.location || '';
  const codeMatch = location.match(/code=([^&]+)/);
  if (!codeMatch) {
    throw new Error(`Failed to get auth code — redirect: ${location.substring(0, 200)}`);
  }
  const authCode = codeMatch[1];
  console.log('[exp-guest-pass] Authorization code obtained');

  // Step 3: Token exchange
  const tokenBody = new URLSearchParams({
    grant_type: 'authorization_code',
    code: authCode,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    code_verifier: codeVerifier,
  }).toString();

  const tokenRes = await httpsRequest(`https://${OKTA_DOMAIN}/oauth2/v1/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: tokenBody,
  });

  const tokenData = JSON.parse(tokenRes.body);
  if (tokenData.error) {
    throw new Error(`Token exchange failed: ${tokenData.error} — ${tokenData.error_description}`);
  }

  const tokens: StoredTokens = {
    access_token: tokenData.access_token,
    id_token: tokenData.id_token,
    refresh_token: tokenData.refresh_token,
    expires_in: tokenData.expires_in,
    obtained_at: Math.floor(Date.now() / 1000),
  };

  await saveTokens(tokens);
  console.log('[exp-guest-pass] Full auth completed — tokens saved');
  return tokens;
}

/**
 * Get a valid access token, refreshing or re-authenticating as needed.
 */
async function getValidAccessToken(): Promise<string> {
  let tokens = await loadTokens();

  // If we have tokens and they're not expired, use them
  if (tokens && !isTokenExpired(tokens)) {
    return tokens.id_token;
  }

  // If we have a refresh token, try refreshing
  if (tokens?.refresh_token) {
    try {
      tokens = await refreshTokens(tokens.refresh_token);
      return tokens.id_token;
    } catch (err) {
      console.warn('[exp-guest-pass] Refresh failed, falling back to full auth:', err instanceof Error ? err.message : err);
    }
  }

  // Full auth from scratch
  tokens = await authenticateFull();
  return tokens.id_token;
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export async function submitExpGuestPass(input: GuestPassInput): Promise<GuestPassResult> {
  try {
    // Get a valid Bearer token
    const idToken = await getValidAccessToken();

    // Call the eXp guest-pass API directly
    console.log(`[exp-guest-pass] Submitting guest pass for ${input.email}...`);

    const payload = JSON.stringify({
      firstName: input.firstName,
      lastName: input.lastName,
      emailAddress: input.email,
      phone: '',
      reason: '',
      accountType: 'Guest',
    });

    const res = await httpsRequest(EXP_GUEST_PASS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
        Referer: 'https://my.exprealty.com/',
      },
      body: payload,
    });

    console.log(`[exp-guest-pass] API response: ${res.status} — ${res.body.substring(0, 500)}`);

    if (res.status >= 200 && res.status < 300) {
      console.log(`[exp-guest-pass] Guest pass submitted successfully for ${input.email}`);
      return { success: true };
    }

    // If 401/403, token might be stale — clear and retry once
    if (res.status === 401 || res.status === 403) {
      console.log('[exp-guest-pass] Got 401/403 — clearing tokens and retrying...');
      try { await fs.unlink(TOKENS_PATH); } catch {}

      const freshToken = await getValidAccessToken();
      const retryRes = await httpsRequest(EXP_GUEST_PASS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${freshToken}`,
          Referer: 'https://my.exprealty.com/',
        },
        body: payload,
      });

      console.log(`[exp-guest-pass] Retry response: ${retryRes.status} — ${retryRes.body.substring(0, 500)}`);

      if (retryRes.status >= 200 && retryRes.status < 300) {
        return { success: true };
      }

      return {
        success: false,
        error: `eXp API returned ${retryRes.status} after retry: ${retryRes.body.substring(0, 300)}`,
      };
    }

    return {
      success: false,
      error: `eXp API returned ${res.status}: ${res.body.substring(0, 300)}`,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[exp-guest-pass] Error: ${message}`);
    return { success: false, error: message };
  }
}
