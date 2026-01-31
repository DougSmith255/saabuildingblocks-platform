/**
 * Agent Page Color Profile Picture Upload API
 * POST /api/agent-pages/upload-color-image
 *
 * Uploads the COLOR version of profile picture to Cloudflare R2
 * (background removed but NO B&W filter - for Linktree color option)
 * Updates agent_pages table with the color image URL
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';
import { uploadColorProfilePicture } from '@/lib/cloudflare-r2';
import { requirePageOwner } from '@/app/api/middleware/agentPageAuth';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

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
  const supabase = getSupabaseServiceClient();

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
    const pageId = formData.get('pageId') as string;

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

    if (!pageId) {
      return corsResponse(
        {
          success: false,
          error: 'MISSING_PAGE_ID',
          message: 'Page ID is required',
        },
        400
      );
    }

    // Verify authentication and page ownership
    const { error: authError } = await requirePageOwner(request, pageId, CORS_HEADERS);
    if (authError) return authError;

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return corsResponse(
        {
          success: false,
          error: 'INVALID_FILE_TYPE',
          message: 'Only JPG, PNG, and WebP images are allowed',
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

    // Get the agent page to verify it exists
    const { data: page, error: pageError } = await supabase
      .from('agent_pages')
      .select('*')
      .eq('id', pageId)
      .single();

    if (pageError || !page) {
      return corsResponse(
        {
          success: false,
          error: 'PAGE_NOT_FOUND',
          message: 'Agent page not found',
        },
        404
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload color version to R2 using the page ID as identifier
    const uploadResult = await uploadColorProfilePicture(`agent-page-${pageId}`, buffer, file.type);

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

    // Update agent_pages table with the color image URL
    const { data: updatedPage, error: updateError } = await supabase
      .from('agent_pages')
      .update({
        profile_image_color_url: uploadResult.url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', pageId)
      .select()
      .single();

    if (updateError || !updatedPage) {
      console.error('[Agent Page Color Image Upload] Error updating page:', updateError);
      return corsResponse(
        {
          success: false,
          error: 'UPDATE_FAILED',
          message: 'Failed to update agent page',
        },
        500
      );
    }

    return corsResponse({
      success: true,
      message: 'Color profile picture uploaded successfully',
      data: {
        url: uploadResult.url,
        page: updatedPage,
      },
    });
  } catch (error) {
    console.error('[Agent Page Color Image Upload API] Error:', error);

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
