/**
 * Cloudflare R2 Storage Client
 * Handles profile picture uploads and asset management
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';

const R2_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || 'a1ae4bb5913a89fea98821d7ba1ac304';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '';
const R2_BUCKET_NAME = 'saabuildingblocks-assets';
// Use CDN URL which goes through the edge caching Worker for fast global delivery
const R2_PUBLIC_URL = 'https://cdn.saabuildingblocks.com';

// S3-compatible client for R2
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
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
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(mimeType)) {
      return { success: false, error: 'Invalid file type. Only JPG and PNG are allowed.' };
    }

    // Validate file size (max 5MB)
    if (fileBuffer.length > 5 * 1024 * 1024) {
      return { success: false, error: 'File size exceeds 5MB limit.' };
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
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: dashboardBuffer,
      ContentType: 'image/webp',
      CacheControl: 'public, max-age=31536000', // 1 year cache
    });

    await r2Client.send(command);
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
      const linktreeCommand = new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: linktreeKey,
        Body: linktreeBuffer,
        ContentType: 'image/webp',
        CacheControl: 'public, max-age=31536000',
      });

      await r2Client.send(linktreeCommand);
      console.log(`[R2] Created B&W Linktree variant: ${linktreeKey} (${Math.round(linktreeBuffer.length / 1024)}KB)`);
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
      const key = `profiles/${userId}.${ext}`;
      try {
        const command = new DeleteObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: key,
        });
        await r2Client.send(command);
      } catch (err) {
        // Ignore errors if file doesn't exist
        console.log(`[R2] File not found: ${key}`);
      }

      // Delete Linktree variant
      const linktreeKey = `profiles/${userId}-linktree.${ext}`;
      try {
        const linktreeCommand = new DeleteObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: linktreeKey,
        });
        await r2Client.send(linktreeCommand);
      } catch (err) {
        // Ignore errors if file doesn't exist
        console.log(`[R2] Linktree variant not found: ${linktreeKey}`);
      }

      // Delete color variant
      const colorKey = `profiles/${userId}-color.${ext}`;
      try {
        const colorCommand = new DeleteObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: colorKey,
        });
        await r2Client.send(colorCommand);
      } catch (err) {
        // Ignore errors if file doesn't exist
        console.log(`[R2] Color variant not found: ${colorKey}`);
      }
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
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(mimeType)) {
      return { success: false, error: 'Invalid file type. Only JPG and PNG are allowed.' };
    }

    // Validate file size (max 5MB)
    if (fileBuffer.length > 5 * 1024 * 1024) {
      return { success: false, error: 'File size exceeds 5MB limit.' };
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
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: colorBuffer,
      ContentType: 'image/webp',
      CacheControl: 'public, max-age=31536000', // 1 year cache
    });

    await r2Client.send(command);
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

export default r2Client;
