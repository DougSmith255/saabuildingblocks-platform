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
const R2_PUBLIC_URL = 'https://assets.saabuildingblocks.com';

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
 * Also creates a 150x150 Linktree variant
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

    // Generate file path
    const extension = mimeType.split('/')[1];
    const key = `profiles/${userId}.${extension}`;

    // Upload original to R2
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType,
      CacheControl: 'public, max-age=31536000', // 1 year cache
    });

    await r2Client.send(command);

    // Create and upload 150x150 Linktree variant
    try {
      const linktreeBuffer = await sharp(fileBuffer)
        .resize(150, 150, {
          fit: 'cover',
          position: 'center',
        })
        .toBuffer();

      const linktreeKey = `profiles/${userId}-linktree.${extension}`;
      const linktreeCommand = new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: linktreeKey,
        Body: linktreeBuffer,
        ContentType: mimeType,
        CacheControl: 'public, max-age=31536000',
      });

      await r2Client.send(linktreeCommand);
      console.log(`[R2] Created Linktree variant: ${linktreeKey}`);
    } catch (resizeError) {
      // Log but don't fail the upload if Linktree variant fails
      console.error('[R2] Failed to create Linktree variant:', resizeError);
    }

    // Return public URL
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
 * Also deletes the Linktree variant
 */
export async function deleteProfilePicture(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Try both jpg and png extensions for both original and linktree variants
    for (const ext of ['jpg', 'png']) {
      // Delete original
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
 * Upload color profile picture to R2 (for Linktree)
 * Stores as {userId}-color.{ext}
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

    // Generate file path for color variant
    const extension = mimeType.split('/')[1];
    const key = `profiles/${userId}-color.${extension}`;

    // Upload to R2
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType,
      CacheControl: 'public, max-age=31536000', // 1 year cache
    });

    await r2Client.send(command);
    console.log(`[R2] Uploaded color profile: ${key}`);

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
