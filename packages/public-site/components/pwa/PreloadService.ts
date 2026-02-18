/**
 * PWA Preload Service
 *
 * Preloads ALL critical assets and data during the loading screen.
 * The loading screen will NOT disappear until everything is loaded.
 * No loading spinners should appear in the UI after the loading screen.
 */

import { API_URL } from '@/lib/api-config';

export interface PreloadResult {
  success: boolean;
  userData?: any;
  dashboardData?: any;
  agentPageData?: any;
  errors: string[];
}

/**
 * Critical static images to preload
 */
const CRITICAL_IMAGES = [
  '/images/saa-logo-gold.png',
  '/icons/s-logo-1000.png', // SAA Support (transparent S logo)
  // Cloudflare Images - preload to prevent slow loading in Support & Team Calls sections
  'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/exp-x-logo-icon/public', // eXp Support
  'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/wolf-pack-logo-icon/public', // Wolf Pack Support + Elite Courses
];

/**
 * Preload a single image with timeout
 * Returns true if loaded successfully, false otherwise
 */
function preloadImage(src: string, timeoutMs: number = 10000): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    const timeout = setTimeout(() => {
      console.warn(`Image preload timeout: ${src}`);
      resolve(false);
    }, timeoutMs);

    img.onload = () => {
      clearTimeout(timeout);
      resolve(true);
    };
    img.onerror = () => {
      clearTimeout(timeout);
      console.warn(`Image preload failed: ${src}`);
      resolve(false);
    };
    img.src = src;
  });
}

/**
 * Preload all critical static images
 */
async function preloadStaticImages(): Promise<void> {
  const promises = CRITICAL_IMAGES.map(src => preloadImage(src));
  await Promise.all(promises);
}

/**
 * Get user data from localStorage cache (internal use with response wrapper)
 * Auth is handled via JWT token in localStorage, no API needed
 */
function getCachedUserDataInternal(): { success: boolean; data: any } | null {
  if (typeof localStorage === 'undefined') return null;
  const cached = localStorage.getItem('agent_portal_user');
  if (cached) {
    try {
      const userData = JSON.parse(cached);
      return { success: true, data: userData };
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Get cached agent page data from localStorage
 */
function getCachedAgentPageData(): any {
  if (typeof localStorage === 'undefined') return null;
  const cached = localStorage.getItem('agent_portal_page_data');
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Fetch fresh user data from the API
 * Uses same-origin Cloudflare Function proxy at /api/auth/me to avoid cross-origin issues.
 * Falls back to cross-origin request to VPS API if same-origin fails.
 * Returns fresh user data or null if both requests fail.
 */
async function fetchFreshUserData(token: string): Promise<any | null> {
  // Cache-busting timestamp to prevent ANY caching layer from returning stale data
  const cacheBuster = `_t=${Date.now()}`;

  // Try same-origin Cloudflare Function proxy first (avoids CORS issues)
  try {
    const response = await fetch(`/api/auth/me?${cacheBuster}`, {
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store',
    });
    if (response.ok) {
      const json = await response.json();
      if (json?.success && json?.data) {
        return json.data;
      }
    }
  } catch {
    // Same-origin proxy failed, try cross-origin fallback
  }

  // Fallback: direct cross-origin request to VPS API
  try {
    const response = await fetch(`${API_URL}/api/auth/me?${cacheBuster}`, {
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const json = await response.json();
    if (json?.success && json?.data) {
      return json.data;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Main preload function
 * Call this during the loading screen to preload all critical data
 * Loading screen will NOT disappear until this completes
 *
 * Always fetches FRESH user data from the API to ensure admin changes
 * (gender, is_leader, state) are reflected immediately.
 * Falls back to localStorage cache only if the API call fails.
 */
export async function preloadAppData(): Promise<PreloadResult> {
  const errors: string[] = [];
  let userData: any = null;
  let agentPageData: any = null;
  const imagePreloadPromises: Promise<boolean>[] = [];

  // Start static image preloading immediately
  const staticImagesPromise = preloadStaticImages();

  // Get auth token
  const token = typeof localStorage !== 'undefined'
    ? localStorage.getItem('agent_portal_token')
    : null;

  if (token) {
    // Fetch fresh user data from API (catches admin changes to gender, leader, state)
    // Falls back to localStorage cache if the API call fails
    const freshData = await fetchFreshUserData(token);
    if (freshData) {
      userData = freshData;
      // Update localStorage cache with fresh data
      try { localStorage.setItem('agent_portal_user', JSON.stringify(freshData)); } catch {}
    } else {
      // API failed — fall back to cached data
      const response = getCachedUserDataInternal();
      if (response?.success && response.data) {
        userData = response.data;
      }
    }

    if (userData) {
      // Queue profile picture for preloading (WAIT for it)
      if (userData.profilePictureUrl || userData.profile_picture_url) {
        const profileUrl = userData.profilePictureUrl || userData.profile_picture_url;
        imagePreloadPromises.push(preloadImage(profileUrl));
      }

      // Load agent page data from cache
      const pageResponse = getCachedAgentPageData();
      if (pageResponse) {
        agentPageData = pageResponse;

        // Queue Linktree profile image for preloading if different from main profile
        if (pageResponse.page?.profile_image_url) {
          const linktreeProfileUrl = pageResponse.page.profile_image_url;
          const mainProfileUrl = userData.profilePictureUrl || userData.profile_picture_url;
          if (linktreeProfileUrl !== mainProfileUrl) {
            imagePreloadPromises.push(preloadImage(linktreeProfileUrl));
          }
        }
      }
    }
  }

  // Wait for ALL images to finish loading (static + profile + linktree)
  await staticImagesPromise;
  await Promise.all(imagePreloadPromises);

  return {
    success: errors.length === 0,
    userData,
    agentPageData,
    errors,
  };
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof localStorage === 'undefined') return false;
  return !!localStorage.getItem('agent_portal_token');
}

/**
 * Get cached user data (for instant display while fresh data loads)
 */
export function getCachedUserData(): any | null {
  if (typeof localStorage === 'undefined') return null;
  const cached = localStorage.getItem('agent_portal_user');
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      return null;
    }
  }
  return null;
}
