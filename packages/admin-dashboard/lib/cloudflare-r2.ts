/**
 * Cloudflare R2 Storage Client
 * Uses Cloudflare REST API for uploads (not S3-compatible API)
 * Handles profile picture uploads and asset management
 */

import sharp from 'sharp';

const R2_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '';
const R2_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || '';
const R2_BUCKET_NAME = 'saabuildingblocks-assets';
// Use CDN URL which goes through the edge caching Worker for fast global delivery
const R2_PUBLIC_URL = 'https://cdn.saabuildingblocks.com';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload file to R2 using Cloudflare REST API
 */
async function uploadToR2(
  key: string,
  buffer: Buffer,
  contentType: string
): Promise<{ success: boolean; error?: string }> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${R2_ACCOUNT_ID}/r2/buckets/${R2_BUCKET_NAME}/objects/${encodeURIComponent(key)}`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${R2_API_TOKEN}`,
        'Content-Type': contentType,
      },
      body: new Uint8Array(buffer),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[R2] Upload failed:', response.status, errorText);
      return { success: false, error: `Upload failed: ${response.status}` };
    }

    const result = await response.json();
    if (!result.success) {
      return { success: false, error: result.errors?.[0]?.message || 'Unknown error' };
    }

    return { success: true };
  } catch (error) {
    console.error('[R2] Upload error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}

/**
 * Delete file from R2 using Cloudflare REST API
 */
async function deleteFromR2(key: string): Promise<{ success: boolean; error?: string }> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${R2_ACCOUNT_ID}/r2/buckets/${R2_BUCKET_NAME}/objects/${encodeURIComponent(key)}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${R2_API_TOKEN}`,
      },
    });

    if (!response.ok && response.status !== 404) {
      const errorText = await response.text();
      console.error('[R2] Delete failed:', response.status, errorText);
      return { success: false, error: `Delete failed: ${response.status}` };
    }

    return { success: true };
  } catch (error) {
    console.error('[R2] Delete error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}

/**
 * Upload profile picture to R2
 * Creates multiple optimized variants:
 * - 400x400 B&W dashboard variant (for agent portal dashboard, ~30KB)
 * - 150x150 B&W Linktree variant (for linktree pages default, ~10KB)
 *
 * Dashboard always uses B&W. Linktree can optionally use color variant.
 */
export async function uploadProfilePicture(
  userId: string,
  fileBuffer: Buffer,
  mimeType: string
): Promise<UploadResult> {
  try {
    // Validate MIME type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(mimeType)) {
      return { success: false, error: 'Invalid file type. Only JPG, PNG, and WebP are allowed.' };
    }

    // Validate file size (max 5MB)
    if (fileBuffer.length > 5 * 1024 * 1024) {
      return { success: false, error: 'File size exceeds 5MB limit.' };
    }

    // Check if API token is configured
    if (!R2_API_TOKEN || !R2_ACCOUNT_ID) {
      console.error('[R2] Missing CLOUDFLARE_API_TOKEN or CLOUDFLARE_ACCOUNT_ID');
      return { success: false, error: 'Storage configuration error' };
    }

    // Generate file path - always save as webp for better compression
    const key = `profiles/${userId}.webp`;

    // Create optimized 400x400 B&W dashboard variant (main image used in portal)
    // Dashboard ALWAYS uses black & white
    const dashboardBuffer = await sharp(fileBuffer)
      .resize(400, 400, {
        fit: 'cover',
        position: 'center',
      })
      .grayscale() // Always B&W for dashboard
      .webp({ quality: 85 }) // Good quality, small size (~30KB)
      .toBuffer();

    // Upload dashboard variant as the main image
    const uploadResult = await uploadToR2(key, dashboardBuffer, 'image/webp');
    if (!uploadResult.success) {
      return { success: false, error: uploadResult.error || 'Failed to upload dashboard variant' };
    }
    console.log(`[R2] Uploaded B&W dashboard variant: ${key} (${Math.round(dashboardBuffer.length / 1024)}KB)`);

    // Create and upload 150x150 B&W Linktree variant (default for linktree)
    try {
      const linktreeBuffer = await sharp(fileBuffer)
        .resize(150, 150, {
          fit: 'cover',
          position: 'center',
        })
        .grayscale() // B&W by default
        .webp({ quality: 80 })
        .toBuffer();

      const linktreeKey = `profiles/${userId}-linktree.webp`;
      const linktreeResult = await uploadToR2(linktreeKey, linktreeBuffer, 'image/webp');
      if (linktreeResult.success) {
        console.log(`[R2] Created B&W Linktree variant: ${linktreeKey} (${Math.round(linktreeBuffer.length / 1024)}KB)`);
      } else {
        console.error('[R2] Failed to create Linktree variant:', linktreeResult.error);
      }
    } catch (resizeError) {
      // Log but don't fail the upload if Linktree variant fails
      console.error('[R2] Failed to create Linktree variant:', resizeError);
    }

    // Return public URL (dashboard variant)
    const publicUrl = `${R2_PUBLIC_URL}/${key}`;
    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('[R2] Error uploading profile picture:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Delete profile picture from R2
 * Also deletes the Linktree and color variants
 */
export async function deleteProfilePicture(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Try all extensions (webp is new, jpg/png are legacy)
    for (const ext of ['webp', 'jpg', 'png']) {
      // Delete original/dashboard variant
      await deleteFromR2(`profiles/${userId}.${ext}`);

      // Delete Linktree variant
      await deleteFromR2(`profiles/${userId}-linktree.${ext}`);

      // Delete color variant
      await deleteFromR2(`profiles/${userId}-color.${ext}`);
    }

    return { success: true };
  } catch (error) {
    console.error('[R2] Error deleting profile picture:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Deletion failed',
    };
  }
}

/**
 * Upload color profile picture to R2 (for Linktree only)
 * Creates optimized 400x400 color variant for linktree pages
 * Dashboard always uses B&W from the main upload
 */
export async function uploadColorProfilePicture(
  userId: string,
  fileBuffer: Buffer,
  mimeType: string
): Promise<UploadResult> {
  try {
    // Validate MIME type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(mimeType)) {
      return { success: false, error: 'Invalid file type. Only JPG, PNG, and WebP are allowed.' };
    }

    // Validate file size (max 5MB)
    if (fileBuffer.length > 5 * 1024 * 1024) {
      return { success: false, error: 'File size exceeds 5MB limit.' };
    }

    // Check if API token is configured
    if (!R2_API_TOKEN || !R2_ACCOUNT_ID) {
      console.error('[R2] Missing CLOUDFLARE_API_TOKEN or CLOUDFLARE_ACCOUNT_ID');
      return { success: false, error: 'Storage configuration error' };
    }

    // Generate file path for color variant - always webp
    const key = `profiles/${userId}-color.webp`;

    // Create optimized 400x400 color variant (for linktree pages)
    const colorBuffer = await sharp(fileBuffer)
      .resize(400, 400, {
        fit: 'cover',
        position: 'center',
      })
      .webp({ quality: 85 })
      .toBuffer();

    // Upload to R2
    const uploadResult = await uploadToR2(key, colorBuffer, 'image/webp');
    if (!uploadResult.success) {
      return { success: false, error: uploadResult.error || 'Failed to upload color variant' };
    }
    console.log(`[R2] Uploaded color profile: ${key} (${Math.round(colorBuffer.length / 1024)}KB)`);

    // Return public URL
    const publicUrl = `${R2_PUBLIC_URL}/${key}`;
    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('[R2] Error uploading color profile picture:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

// Export helper functions for direct use if needed
export { uploadToR2, deleteFromR2 };
