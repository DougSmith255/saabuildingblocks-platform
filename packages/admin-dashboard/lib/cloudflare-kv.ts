/**
 * Cloudflare KV Client for Agent Pages
 *
 * Syncs agent page data to Cloudflare KV for edge delivery.
 * KV data is read globally in < 10ms from any Cloudflare edge location.
 *
 * KV Namespace: AGENT_PAGES
 * Key format: {slug} (e.g., "doug-smart")
 * Value: JSON object with agent page data
 */

// KV Namespace configuration
const KV_NAMESPACE_ID = '9f886b7add144cc480d7fe0f4ef5eb5e';
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || 'a1ae4bb5913a89fea98821d7ba1ac304';
// Use KV-specific token first, fallback to general API token
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_KV_API_TOKEN || process.env.CLOUDFLARE_API_TOKEN;

/**
 * Agent page data structure stored in KV
 * Maps to agent_pages table in Supabase
 */
/**
 * Links page global settings
 */
export interface LinksSettings {
  accentColor: string;      // Hex color for buttons, frame, social icons, name glow
  backgroundColor?: string; // Background hue for star field (default: #ffd700)
  iconStyle: 'light' | 'dark';  // Light (white) or Dark (near-black) icons
  font: 'synonym' | 'taskor';   // Font for button text
  nameWeight?: 'bold' | 'normal'; // Font weight for display name
  nameGlow?: boolean;       // Show glow effect on name (default: true)
  buttonTextSize?: number;  // Button text size in pixels (default: 14)
  bio: string;              // Bio text (max 150 chars)
  showColorPhoto?: boolean; // false = B&W (default), true = full color photo
  linkOrder?: string[];     // Order of all links including default button
  showCallButton?: boolean; // Show phone call button
  showTextButton?: boolean; // Show text message button
}

/**
 * Custom link button for agent links page
 */
export interface CustomLink {
  id: string;
  label: string;
  url: string;
  icon?: string;  // Lucide icon name (e.g., "Home", "Phone")
  order: number;  // For drag-to-reorder
}

/**
 * Custom social link (for social icons section)
 */
export interface CustomSocialLink {
  id: string;
  url: string;
  icon: string;  // Icon name from LINK_ICONS
}

export interface AgentPageKVData {
  id: string;
  user_id: string;
  slug: string;
  display_first_name: string;
  display_last_name: string;
  email: string | null; // Agent's contact email for Email button
  profile_image_url: string | null;
  profile_image_color_url?: string | null; // Color version of profile image (for Linktree color option)
  phone: string | null;
  show_phone: boolean;
  phone_text_only: boolean;
  facebook_url: string | null;
  instagram_url: string | null;
  twitter_url: string | null;
  youtube_url: string | null;
  tiktok_url: string | null;
  linkedin_url: string | null;
  custom_links: CustomLink[]; // Custom link buttons for links page
  custom_social_links: CustomSocialLink[]; // Custom social icons (max 2)
  links_settings: LinksSettings; // Global settings for links page
  show_call_button: boolean; // Show phone call button
  show_text_button: boolean; // Show text message button
  activated: boolean; // Whether page is publicly visible
  is_active?: boolean; // Alias for compatibility
  updated_at: string;
  // eXp Realty fields for join team instructions
  exp_email: string | null;  // Agent's eXp Realty email (e.g., firstname.lastname@expreferral.com)
  legal_name: string | null; // Agent's official legal name as it appears in eXp system
}

/**
 * Write agent page data to Cloudflare KV
 *
 * @param slug - The URL slug (key)
 * @param data - The agent page data (value)
 * @returns Success boolean and optional error message
 */
export async function writeAgentPageToKV(
  slug: string,
  data: AgentPageKVData
): Promise<{ success: boolean; error?: string }> {
  if (!CLOUDFLARE_API_TOKEN) {
    console.error('CLOUDFLARE_API_TOKEN not configured');
    return { success: false, error: 'KV not configured' };
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${KV_NAMESPACE_ID}/values/${encodeURIComponent(slug)}`;

  try {
    console.log(`[KV] Writing to: ${url}`);
    console.log(`[KV] Token present: ${!!CLOUDFLARE_API_TOKEN}, Token starts with: ${CLOUDFLARE_API_TOKEN?.substring(0, 5)}...`);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseText = await response.text();
    console.log(`[KV] Response status: ${response.status}, body: ${responseText}`);

    if (!response.ok) {
      console.error('KV write failed:', response.status, responseText);
      return { success: false, error: `KV write failed: ${response.status}` };
    }

    console.log(`Successfully synced agent page to KV: ${slug}`);
    return { success: true };
  } catch (error) {
    console.error('KV write error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Write a redirect entry to KV
 *
 * Used when an agent changes their slug to redirect old URLs to the new one.
 * Key format: redirect:{old-slug} → {new-slug}
 *
 * @param oldSlug - The old slug to redirect from
 * @param newSlug - The new slug to redirect to
 * @returns Success boolean and optional error message
 */
export async function writeRedirectToKV(
  oldSlug: string,
  newSlug: string
): Promise<{ success: boolean; error?: string }> {
  if (!CLOUDFLARE_API_TOKEN) {
    console.error('CLOUDFLARE_API_TOKEN not configured');
    return { success: false, error: 'KV not configured' };
  }

  const redirectKey = `redirect:${oldSlug}`;
  const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${KV_NAMESPACE_ID}/values/${encodeURIComponent(redirectKey)}`;

  try {
    console.log(`[KV] Writing redirect: ${oldSlug} → ${newSlug}`);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'text/plain',
      },
      body: newSlug, // Just store the target slug as plain text
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('KV redirect write failed:', response.status, errorText);
      return { success: false, error: `KV redirect write failed: ${response.status}` };
    }

    console.log(`Successfully created redirect: ${oldSlug} → ${newSlug}`);
    return { success: true };
  } catch (error) {
    console.error('KV redirect write error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Update all redirects for an agent to point to the new slug
 *
 * When an agent changes slug multiple times, we need to update all
 * existing redirects to point directly to the latest slug (no chains).
 *
 * @param agentId - The agent's ID
 * @param newSlug - The new current slug
 * @param previousSlugs - Array of all previous slugs for this agent
 */
export async function updateAllRedirectsForAgent(
  newSlug: string,
  previousSlugs: string[]
): Promise<{ success: boolean; error?: string }> {
  // Update each previous slug to point to the new slug
  for (const oldSlug of previousSlugs) {
    if (oldSlug !== newSlug) {
      const result = await writeRedirectToKV(oldSlug, newSlug);
      if (!result.success) {
        console.error(`Failed to update redirect for ${oldSlug}:`, result.error);
        // Continue with other redirects even if one fails
      }
    }
  }
  return { success: true };
}

/**
 * Delete a redirect from KV
 *
 * Used when an agent reclaims a previous slug
 *
 * @param oldSlug - The slug to remove redirect for
 */
export async function deleteRedirectFromKV(
  oldSlug: string
): Promise<{ success: boolean; error?: string }> {
  if (!CLOUDFLARE_API_TOKEN) {
    console.error('CLOUDFLARE_API_TOKEN not configured');
    return { success: false, error: 'KV not configured' };
  }

  const redirectKey = `redirect:${oldSlug}`;
  const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${KV_NAMESPACE_ID}/values/${encodeURIComponent(redirectKey)}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
      },
    });

    if (!response.ok && response.status !== 404) {
      const errorText = await response.text();
      console.error('KV redirect delete failed:', response.status, errorText);
      return { success: false, error: `KV redirect delete failed: ${response.status}` };
    }

    console.log(`Successfully deleted redirect for: ${oldSlug}`);
    return { success: true };
  } catch (error) {
    console.error('KV redirect delete error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Delete agent page from Cloudflare KV
 *
 * Used when an agent page is deactivated or slug changes
 *
 * @param slug - The URL slug to delete
 * @returns Success boolean and optional error message
 */
export async function deleteAgentPageFromKV(
  slug: string
): Promise<{ success: boolean; error?: string }> {
  if (!CLOUDFLARE_API_TOKEN) {
    console.error('CLOUDFLARE_API_TOKEN not configured');
    return { success: false, error: 'KV not configured' };
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${KV_NAMESPACE_ID}/values/${encodeURIComponent(slug)}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
      },
    });

    if (!response.ok && response.status !== 404) {
      const errorText = await response.text();
      console.error('KV delete failed:', response.status, errorText);
      return { success: false, error: `KV delete failed: ${response.status}` };
    }

    console.log(`Successfully deleted agent page from KV: ${slug}`);
    return { success: true };
  } catch (error) {
    console.error('KV delete error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Sync agent page to KV after database update
 *
 * Handles both updates (write new slug) and slug changes (delete old, write new)
 * When slug changes, creates a redirect from old slug to new slug
 *
 * @param page - The full agent page object from database
 * @param previousSlug - Optional previous slug if it changed
 * @param allPreviousSlugs - Optional array of all previous slugs for this agent (for multi-change scenarios)
 */
export async function syncAgentPageToKV(
  page: AgentPageKVData,
  previousSlug?: string,
  allPreviousSlugs?: string[]
): Promise<{ success: boolean; error?: string }> {
  // If page is not active, delete from KV
  // Check both 'activated' and 'is_active' for compatibility
  const isActive = page.activated ?? page.is_active ?? false;
  if (!isActive) {
    return deleteAgentPageFromKV(page.slug);
  }

  // If slug changed, handle redirect creation
  if (previousSlug && previousSlug !== page.slug) {
    // Delete old agent data key
    await deleteAgentPageFromKV(previousSlug);

    // Check if the new slug was a previous redirect target (agent reclaiming old slug)
    // If so, delete that redirect entry
    await deleteRedirectFromKV(page.slug);

    // Create redirect from old slug to new slug
    await writeRedirectToKV(previousSlug, page.slug);

    // If we have a list of all previous slugs, update them all to point to the new slug
    // This prevents redirect chains (old1 → old2 → current becomes old1 → current, old2 → current)
    if (allPreviousSlugs && allPreviousSlugs.length > 0) {
      await updateAllRedirectsForAgent(page.slug, allPreviousSlugs);
    }
  }

  // Write to KV
  return writeAgentPageToKV(page.slug, page);
}

/**
 * Bulk sync all active agent pages to KV
 *
 * Used for initial setup or data recovery
 */
export async function bulkSyncAgentPagesToKV(
  pages: AgentPageKVData[]
): Promise<{ success: number; failed: number; errors: string[] }> {
  const results = {
    success: 0,
    failed: 0,
    errors: [] as string[],
  };

  for (const page of pages) {
    if (page.is_active) {
      const result = await writeAgentPageToKV(page.slug, page);
      if (result.success) {
        results.success++;
      } else {
        results.failed++;
        results.errors.push(`${page.slug}: ${result.error}`);
      }
    }
  }

  console.log(`Bulk sync complete: ${results.success} success, ${results.failed} failed`);
  return results;
}
