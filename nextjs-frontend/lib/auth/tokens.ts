/**
 * Token Management Utilities
 * Phase 1: Agent Portal Authentication
 *
 * Security: Access tokens stored ONLY in memory (React state)
 * Refresh tokens stored in HttpOnly cookies (server-managed)
 */

import type { TokenPayload } from '@/types/auth';

// In-memory storage for access token
let accessToken: string | null = null;

/**
 * Get access token from memory
 */
export function getAccessToken(): string | null {
  return accessToken;
}

/**
 * Store access token in memory
 * @param token - JWT access token
 */
export function setAccessToken(token: string | null): void {
  accessToken = token;
}

/**
 * Clear all tokens (logout)
 */
export function clearTokens(): void {
  accessToken = null;
  // Refresh token is cleared by calling /api/auth/logout (HttpOnly cookie)
}

/**
 * Decode JWT token without verification
 * @param token - JWT token to decode
 */
export function decodeToken(token: string): TokenPayload | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload) as TokenPayload;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
}

/**
 * Check if JWT token is expired
 * @param token - JWT token to check
 * @param bufferSeconds - Consider token expired N seconds before actual expiry (default: 60s)
 */
export function isTokenExpired(token: string, bufferSeconds: number = 60): boolean {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) return true;

  const expirationTime = payload.exp * 1000; // Convert to milliseconds
  const currentTime = Date.now();
  const bufferTime = bufferSeconds * 1000;

  return currentTime >= expirationTime - bufferTime;
}

/**
 * Get time until token expires (in milliseconds)
 * @param token - JWT token
 */
export function getTokenExpiryTime(token: string): number | null {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) return null;

  const expirationTime = payload.exp * 1000;
  const currentTime = Date.now();
  const timeRemaining = expirationTime - currentTime;

  return timeRemaining > 0 ? timeRemaining : 0;
}

/**
 * Call refresh token API endpoint
 * Refresh token is sent automatically via HttpOnly cookie
 */
export async function refreshAccessToken(): Promise<string | null> {
  try {
    // Add timeout to prevent infinite loading
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include', // Include HttpOnly refresh token cookie
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('Token refresh failed:', response.status);
      return null;
    }

    const data = await response.json();
    const newAccessToken = data.access_token;

    if (newAccessToken) {
      setAccessToken(newAccessToken);
      return newAccessToken;
    }

    return null;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Token refresh timed out after 5 seconds');
    } else {
      console.error('Error refreshing access token:', error);
    }
    return null;
  }
}

/**
 * Setup automatic token refresh
 * Refreshes token 1 minute before expiry
 * @param token - Current access token
 * @param onRefresh - Callback when token is refreshed
 */
export function setupTokenRefresh(
  token: string,
  onRefresh: (newToken: string) => void
): () => void {
  const expiryTime = getTokenExpiryTime(token);

  if (!expiryTime) {
    console.warn('Cannot setup token refresh: invalid token');
    return () => {};
  }

  // Refresh 1 minute before expiry
  const refreshTime = Math.max(expiryTime - 60000, 0);

  const timeoutId = setTimeout(async () => {
    console.log('Auto-refreshing access token...');
    const newToken = await refreshAccessToken();

    if (newToken) {
      onRefresh(newToken);
      // Setup next refresh
      setupTokenRefresh(newToken, onRefresh);
    } else {
      console.error('Failed to auto-refresh token. User may need to re-login.');
    }
  }, refreshTime);

  // Return cleanup function
  return () => clearTimeout(timeoutId);
}
