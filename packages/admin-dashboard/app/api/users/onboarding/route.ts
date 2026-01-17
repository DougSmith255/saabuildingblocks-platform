// Force dynamic rendering - exclude from static export
export const dynamic = 'force-dynamic';

/**
 * User Onboarding Progress API Route
 * GET /api/users/onboarding?userId={userId} - Get onboarding progress
 * PATCH /api/users/onboarding - Update onboarding progress
 *
 * Handles:
 * - Onboarding checklist step completion
 * - One-time notification dismissals (link page, elite courses)
 * - Onboarding completion tracking
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';

// CORS headers for cross-origin requests
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
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

// Default onboarding progress structure
const DEFAULT_ONBOARDING_PROGRESS = {
  step1_welcome_video: false,
  step2_okta_account: false,
  step3_broker_tasks: false,
  step4_choose_crm: false,
  step5_training: false,
  step6_community: false,
  step7_karrie_session: false,
  step8_link_page: false,
  step9_elite_courses: false,
  step10_download_app: false,
};

/**
 * GET /api/users/onboarding
 * Get user's onboarding progress
 */
export async function GET(request: NextRequest) {
  const supabase = getSupabaseServiceClient();

  if (!supabase) {
    console.error('[Onboarding GET] Supabase client not available');
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
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    console.log('[Onboarding GET] Request received for userId:', userId);

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

    // Get user's onboarding data
    console.log('[Onboarding GET] Querying Supabase for userId:', userId);
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('id, onboarding_progress, onboarding_completed_at, link_page_intro_dismissed, elite_courses_intro_dismissed')
      .eq('id', userId)
      .single();

    console.log('[Onboarding GET] Query result:', { user: user ? 'found' : 'null', fetchError: fetchError ? fetchError.message : 'none' });

    if (fetchError || !user) {
      console.error('[Onboarding GET] User not found or error:', fetchError);
      return corsResponse(
        {
          success: false,
          error: 'USER_NOT_FOUND',
          message: 'User not found',
          details: fetchError?.message || 'No user data returned',
        },
        404
      );
    }

    console.log('[Onboarding GET] Successfully retrieved user data');
    
    // Return onboarding data with defaults for missing fields
    return corsResponse({
      success: true,
      data: {
        onboarding_progress: user.onboarding_progress || DEFAULT_ONBOARDING_PROGRESS,
        onboarding_completed_at: user.onboarding_completed_at || null,
        link_page_intro_dismissed: user.link_page_intro_dismissed || false,
        elite_courses_intro_dismissed: user.elite_courses_intro_dismissed || false,
      },
    });
  } catch (error) {
    console.error('[Onboarding GET] Error:', error);
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

/**
 * PATCH /api/users/onboarding
 * Update user's onboarding progress
 */
export async function PATCH(request: NextRequest) {
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
    const body = await request.json();
    const {
      userId,
      onboarding_progress,
      link_page_intro_dismissed,
      elite_courses_intro_dismissed,
    } = body;

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

    // Get current user data
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('id, onboarding_progress, onboarding_completed_at')
      .eq('id', userId)
      .single();

    if (fetchError || !user) {
      return corsResponse(
        {
          success: false,
          error: 'USER_NOT_FOUND',
          message: 'User not found',
        },
        404
      );
    }

    // Build updates object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    // Handle onboarding progress update
    if (onboarding_progress !== undefined) {
      // Merge with existing progress (don't overwrite entire object)
      const currentProgress = user.onboarding_progress || DEFAULT_ONBOARDING_PROGRESS;
      const newProgress = { ...currentProgress, ...onboarding_progress };
      updates.onboarding_progress = newProgress;

      // Check if all steps are complete
      const allStepsComplete = Object.values(newProgress).every((value) => value === true);

      if (allStepsComplete && !user.onboarding_completed_at) {
        // Mark onboarding as complete
        updates.onboarding_completed_at = new Date().toISOString();
      } else if (!allStepsComplete && user.onboarding_completed_at) {
        // If a step was unchecked, clear the completion timestamp
        updates.onboarding_completed_at = null;
      }
    }

    // Handle notification dismissals (these are one-way - can only be set to true)
    if (link_page_intro_dismissed === true) {
      updates.link_page_intro_dismissed = true;
    }

    if (elite_courses_intro_dismissed === true) {
      updates.elite_courses_intro_dismissed = true;
    }

    // If no updates (besides updated_at), return success
    if (Object.keys(updates).length === 1) {
      return corsResponse({
        success: true,
        message: 'No changes to save',
      });
    }

    // Update user
    const { error: updateError } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId);

    if (updateError) {
      console.error('[Onboarding Update] Error updating user:', updateError);
      return corsResponse(
        {
          success: false,
          error: 'UPDATE_FAILED',
          message: 'Failed to update onboarding progress',
        },
        500
      );
    }

    return corsResponse({
      success: true,
      message: 'Onboarding progress updated successfully',
      data: {
        onboarding_progress: updates.onboarding_progress || user.onboarding_progress,
        onboarding_completed_at: updates.onboarding_completed_at !== undefined
          ? updates.onboarding_completed_at
          : user.onboarding_completed_at,
        link_page_intro_dismissed: updates.link_page_intro_dismissed || false,
        elite_courses_intro_dismissed: updates.elite_courses_intro_dismissed || false,
      },
    });
  } catch (error) {
    console.error('[Onboarding PATCH] Error:', error);
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
