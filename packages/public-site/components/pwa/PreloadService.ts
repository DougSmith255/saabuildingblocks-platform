/**
 * PWA Preload Service
 *
 * Preloads ALL critical assets and data during the loading screen.
 * The loading screen will NOT disappear until everything is loaded.
 * No loading spinners should appear in the UI after the loading screen.
 */

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
  '/icons/icon-192x192.png',
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
 * Main preload function
 * Call this during the loading screen to preload all critical data
 * Loading screen will NOT disappear until this completes
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
    // Load user data from localStorage cache (no API calls needed)
    const response = getCachedUserDataInternal();
    if (response?.success && response.data) {
      userData = response.data;

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
