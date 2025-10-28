// Force dynamic rendering - exclude from static export
export const dynamic = 'force-dynamic';

/**
 * Profile Picture Upload API Route
 * POST /api/upload/profile-picture
 *
 * Uploads profile picture to Cloudflare R2
 * Updates Supabase user record
 * Updates GoHighLevel custom field
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/app/master-controller/lib/supabaseClient';
import { uploadProfilePicture } from '@/lib/cloudflare-r2';
import { updateGHLCustomField } from '@/lib/gohighlevel';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

export async function POST(request: NextRequest) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return NextResponse.json(
      {
        success: false,
        error: 'SERVICE_UNAVAILABLE',
        message: 'Service is not available',
      },
      { status: 503 }
    );
  }

  try {
    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: 'MISSING_FILE',
          message: 'No file provided',
        },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'MISSING_USER_ID',
          message: 'User ID is required',
        },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_FILE_TYPE',
          message: 'Only JPG and PNG images are allowed',
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: 'FILE_TOO_LARGE',
          message: 'File size must not exceed 5MB',
        },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to R2
    const uploadResult = await uploadProfilePicture(userId, buffer, file.type);

    if (!uploadResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'UPLOAD_FAILED',
          message: uploadResult.error || 'Failed to upload file',
        },
        { status: 500 }
      );
    }

    // Update Supabase user record
    const { error: updateError } = await supabase
      .from('users')
      .update({
        profile_picture_url: uploadResult.url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (updateError) {
      console.error('[Profile Upload] Error updating user:', updateError);
      return NextResponse.json(
        {
          success: false,
          error: 'UPDATE_FAILED',
          message: 'Failed to update user profile',
        },
        { status: 500 }
      );
    }

    // Get user's GHL contact ID
    const { data: user } = await supabase
      .from('users')
      .select('ghl_contact_id')
      .eq('id', userId)
      .single();

    // Update GoHighLevel custom field (non-blocking)
    if (user?.ghl_contact_id && uploadResult.url) {
      updateGHLCustomField(user.ghl_contact_id, 'profile_picture_url', uploadResult.url).catch(
        (err) => {
          console.error('[Profile Upload] Failed to update GHL:', err);
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: {
        url: uploadResult.url,
      },
    });
  } catch (error) {
    console.error('[Profile Upload API] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
