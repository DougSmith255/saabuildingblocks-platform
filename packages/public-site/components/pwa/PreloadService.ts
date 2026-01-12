/**
 * PWA Preload Service
 *
 * Preloads critical assets and data during the loading screen
 * to make the app feel snappy once the user enters.
 */

export interface PreloadResult {
  success: boolean;
  userData?: any;
  dashboardData?: any;
  agentPageData?: any;
  errors: string[];
}

/**
 * Critical images to preload
 */
const CRITICAL_IMAGES = [
  '/images/saa-logo-gold.png',
  '/icons/icon-192x192.png',
];

/**
 * Preload a single image
 */
function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

/**
 * Preload all critical images
 */
async function preloadImages(): Promise<void> {
  const promises = CRITICAL_IMAGES.map(src =>
    preloadImage(src).catch(err => {
      console.warn('Image preload failed:', err);
      // Don't fail the whole preload for one image
    })
  );
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
 * Preload user's profile picture if available
 */
async function preloadProfilePicture(profilePictureUrl?: string): Promise<void> {
  if (profilePictureUrl) {
    await preloadImage(profilePictureUrl).catch(() => {
      // Profile picture might not be accessible, ignore
    });
  }
}

/**
 * Main preload function
 * Call this during the loading screen to preload all critical data
 */
export async function preloadAppData(): Promise<PreloadResult> {
  const errors: string[] = [];
  let userData: any = null;
  let agentPageData: any = null;

  // Start image preloading immediately
  const imagePromise = preloadImages();

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

        // Preload profile picture
        if (userData.profilePictureUrl) {
          preloadProfilePicture(userData.profilePictureUrl);
        }

        // Fetch agent page data
        try {
          const pageResponse = await fetchAgentPageData(token, userData.id);
          if (pageResponse) {
            agentPageData = pageResponse;
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

  // Wait for images to finish
  await imagePromise;

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
