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
import { verifyAgentAuth } from '@/app/api/middleware/agentPageAuth';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

// CORS headers for cross-origin requests
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

// Helper to add CORS headers to responses
function corsResponse(body: object, status: number = 200) {
  return NextResponse.json(body, { status, headers: CORS_HEADERS });
}

export async function POST(request: NextRequest) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return corsResponse(
      {
        success: false,
        error: 'SERVICE_UNAVAILABLE',
        message: 'Service is not available',
      },
      503
    );
  }

  try {
    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file) {
      return corsResponse(
        {
          success: false,
          error: 'MISSING_FILE',
          message: 'No file provided',
        },
        400
      );
    }

    if (!userId) {
      return corsResponse(
        {
          success: false,
          error: 'MISSING_USER_ID',
          message: 'User ID is required',
        },
        400
      );
    }

    // Verify authentication and ownership (user can only upload their own picture)
    const auth = await verifyAgentAuth(request);
    if (!auth.authorized) {
      return corsResponse(
        { success: false, error: 'AUTHENTICATION_REQUIRED', message: auth.error || 'Authentication required' },
        auth.status || 401
      );
    }
    if (auth.userId !== userId && auth.role !== 'admin') {
      return corsResponse(
        { success: false, error: 'FORBIDDEN', message: 'Cannot upload picture for another user' },
        403
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return corsResponse(
        {
          success: false,
          error: 'INVALID_FILE_TYPE',
          message: 'Only JPG and PNG images are allowed',
        },
        400
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return corsResponse(
        {
          success: false,
          error: 'FILE_TOO_LARGE',
          message: 'File size must not exceed 5MB',
        },
        400
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to R2
    const uploadResult = await uploadProfilePicture(userId, buffer, file.type);

    if (!uploadResult.success) {
      return corsResponse(
        {
          success: false,
          error: 'UPLOAD_FAILED',
          message: uploadResult.error || 'Failed to upload file',
        },
        500
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
      return corsResponse(
        {
          success: false,
          error: 'UPDATE_FAILED',
          message: 'Failed to update user profile',
        },
        500
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

    return corsResponse({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: {
        url: uploadResult.url,
      },
    });
  } catch (error) {
    console.error('[Profile Upload API] Error:', error);

    return corsResponse(
      {
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
      },
      500
    );
  }
}
