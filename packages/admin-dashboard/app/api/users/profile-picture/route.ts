/**
 * Profile Picture Upload API
 * POST /api/users/profile-picture
 *
 * Uploads a profile picture to Cloudflare R2 using REST API and updates the user record
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';
import { verifyAccessToken } from '@/lib/auth/jwt';

export const dynamic = 'force-dynamic';

// CORS headers
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

// R2 Configuration using Cloudflare REST API
const getR2Config = () => ({
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID || '',
  apiToken: process.env.CLOUDFLARE_API_TOKEN || '',
  bucketName: process.env.R2_BUCKET_NAME || 'saabuildingblocks-assets',
  publicUrl: process.env.R2_PUBLIC_URL || '',
});

// Upload file to R2 using Cloudflare REST API
async function uploadToR2(
  config: ReturnType<typeof getR2Config>,
  key: string,
  buffer: Buffer,
  contentType: string
): Promise<{ success: boolean; error?: string }> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/r2/buckets/${config.bucketName}/objects/${encodeURIComponent(key)}`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${config.apiToken}`,
        'Content-Type': contentType,
      },
      body: new Uint8Array(buffer),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('R2 upload failed:', response.status, errorText);
      return { success: false, error: `Upload failed: ${response.status} ${errorText}` };
    }

    const result = await response.json();
    if (!result.success) {
      return { success: false, error: result.errors?.[0]?.message || 'Unknown error' };
    }

    return { success: true };
  } catch (error) {
    console.error('R2 upload error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}

// Delete file from R2 using Cloudflare REST API
async function deleteFromR2(
  config: ReturnType<typeof getR2Config>,
  key: string
): Promise<{ success: boolean; error?: string }> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/r2/buckets/${config.bucketName}/objects/${encodeURIComponent(key)}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${config.apiToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('R2 delete failed:', response.status, errorText);
      return { success: false, error: `Delete failed: ${response.status}` };
    }

    return { success: true };
  } catch (error) {
    console.error('R2 delete error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Missing authorization header' },
        { status: 401, headers: CORS_HEADERS }
      );
    }

    const token = authHeader.split(' ')[1];
    const tokenResult = await verifyAccessToken(token);

    if (!tokenResult.valid || !tokenResult.payload) {
      return NextResponse.json(
        { error: 'Unauthorized', message: tokenResult.error || 'Invalid or expired token' },
        { status: 401, headers: CORS_HEADERS }
      );
    }

    const { payload } = tokenResult;

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const userId = formData.get('userId') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'No file provided' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'No userId provided' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Verify user can only update their own profile picture (unless admin)
    // payload.sub is the user ID
    if (payload.sub !== userId && payload.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Cannot update another user\'s profile picture' },
        { status: 403, headers: CORS_HEADERS }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'File too large. Maximum size: 5MB' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Get database connection first to check for existing profile picture
    const supabase = getSupabaseServiceClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Service Unavailable', message: 'Database connection unavailable' },
        { status: 503, headers: CORS_HEADERS }
      );
    }

    // Fetch the user's current profile picture URL to delete the old one
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('profile_picture_url')
      .eq('id', userId)
      .single();

    if (fetchError) {
      console.error('Failed to fetch user data:', fetchError);
      // Continue anyway - we'll just upload the new picture
    }

    const oldProfilePictureUrl = userData?.profile_picture_url;

    // Generate unique filename - use consistent naming so we can track/replace
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const timestamp = Date.now();
    const filename = `profile-pictures/${userId}/${timestamp}.${fileExtension}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Get R2 config
    const r2Config = getR2Config();

    // Log config (without secrets) for debugging
    console.log('R2 Config:', {
      accountId: r2Config.accountId ? `${r2Config.accountId.substring(0, 8)}...` : 'MISSING',
      apiToken: r2Config.apiToken ? 'SET' : 'MISSING',
      bucketName: r2Config.bucketName,
      publicUrl: r2Config.publicUrl,
    });

    // Upload new image to R2 using REST API
    const uploadResult = await uploadToR2(r2Config, filename, buffer, file.type);

    if (!uploadResult.success) {
      console.error('R2 upload failed:', uploadResult.error);
      return NextResponse.json(
        { error: 'Upload Failed', message: uploadResult.error || 'Failed to upload image to storage' },
        { status: 500, headers: CORS_HEADERS }
      );
    }

    // Construct public URL
    const publicUrl = `${r2Config.publicUrl}/${filename}`;

    // Delete old profile picture from R2 if it exists
    if (oldProfilePictureUrl && r2Config.publicUrl && oldProfilePictureUrl.startsWith(r2Config.publicUrl)) {
      try {
        // Extract the key from the old URL
        const oldKey = oldProfilePictureUrl.replace(`${r2Config.publicUrl}/`, '');
        if (oldKey && oldKey.startsWith('profile-pictures/')) {
          await deleteFromR2(r2Config, oldKey);
          console.log('Deleted old profile picture:', oldKey);
        }
      } catch (deleteError) {
        // Log but don't fail the request - old file cleanup is not critical
        console.error('Failed to delete old profile picture:', deleteError);
      }
    }

    // Update user record in database
    const { error: updateError } = await supabase
      .from('users')
      .update({
        profile_picture_url: publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Failed to update user profile picture URL:', updateError);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to update user record' },
        { status: 500, headers: CORS_HEADERS }
      );
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      message: 'Profile picture uploaded successfully',
    }, { headers: CORS_HEADERS });
  } catch (error) {
    console.error('Profile picture upload error:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
