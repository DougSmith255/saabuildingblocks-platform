/**
 * Profile Picture Upload API
 * POST /api/users/profile-picture
 *
 * Uploads a profile picture to Cloudflare R2 and updates the user record
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
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

// R2 Configuration
const R2_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '';
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'saabuildingblocks-assets';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || '';

// Initialize S3 client for R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

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

    // Generate unique filename
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const timestamp = Date.now();
    const filename = `profile-pictures/${userId}/${timestamp}.${fileExtension}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to R2
    const uploadCommand = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: filename,
      Body: buffer,
      ContentType: file.type,
      CacheControl: 'public, max-age=31536000', // Cache for 1 year
    });

    await s3Client.send(uploadCommand);

    // Construct public URL
    const publicUrl = `${R2_PUBLIC_URL}/${filename}`;

    // Update user record in database
    const supabase = getSupabaseServiceClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Service Unavailable', message: 'Database connection unavailable' },
        { status: 503, headers: CORS_HEADERS }
      );
    }

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
