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
 * Fetch user data from API
 */
async function fetchUserData(token: string): Promise<any> {
  const response = await fetch('https://saabuildingblocks.com/api/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }

  return response.json();
}

/**
 * Fetch agent page data
 */
async function fetchAgentPageData(token: string, userId: string): Promise<any> {
  const response = await fetch(`https://saabuildingblocks.com/api/agent-pages/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    // Agent page might not exist yet, that's okay
    return null;
  }

  return response.json();
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
    // Fetch user data
    try {
      const response = await fetchUserData(token);
      if (response.success && response.data) {
        userData = response.data;

        // Cache user data in localStorage for faster subsequent loads
        localStorage.setItem('agent_portal_user', JSON.stringify(userData));

        // Queue profile picture for preloading (WAIT for it)
        if (userData.profilePictureUrl || userData.profile_picture_url) {
          const profileUrl = userData.profilePictureUrl || userData.profile_picture_url;
          imagePreloadPromises.push(preloadImage(profileUrl));
        }

        // Fetch agent page data
        try {
          const pageResponse = await fetchAgentPageData(token, userData.id);
          if (pageResponse) {
            agentPageData = pageResponse;

            // Queue Linktree profile image for preloading if different from main profile
            if (pageResponse.page?.profile_image_url) {
              const linktreeProfileUrl = pageResponse.page.profile_image_url;
              // Only preload if it's different from the main profile picture
              const mainProfileUrl = userData.profilePictureUrl || userData.profile_picture_url;
              if (linktreeProfileUrl !== mainProfileUrl) {
                imagePreloadPromises.push(preloadImage(linktreeProfileUrl));
              }
            }
          }
        } catch (err) {
          // Agent page fetch failed, not critical
          errors.push('Agent page data unavailable');
        }
      }
    } catch (err) {
      errors.push('User data fetch failed');
      console.warn('User data preload failed:', err);
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
