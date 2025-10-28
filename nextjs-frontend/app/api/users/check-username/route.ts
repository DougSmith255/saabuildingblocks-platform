// Force dynamic rendering - exclude from static export
export const dynamic = 'error';

/**
 * Username Availability Check API Route
 * POST /api/users/check-username
 *
 * Checks if username is available
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/app/master-controller/lib/supabaseClient';
import { usernameCheckSchema, formatZodErrors } from '@/lib/auth/activation-schemas';

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
    // Parse request body
    const body = await request.json();

    // Validate request
    const validation = usernameCheckSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(formatZodErrors(validation.error), { status: 400 });
    }

    const { username } = validation.data;

    // Check if username exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single();

    const available = !existingUser;

    return NextResponse.json({
      success: true,
      available,
      message: available ? 'Username is available' : 'Username is already taken',
    });
  } catch (error) {
    console.error('[Username Check API] Error:', error);

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
