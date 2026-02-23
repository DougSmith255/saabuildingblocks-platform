import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthUrl } from '@/lib/youtube/client';
import { randomBytes } from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate CSRF state token
    const state = randomBytes(32).toString('hex');

    const authUrl = getAuthUrl(state);

    // Set state as httpOnly cookie for CSRF validation in callback
    const response = NextResponse.redirect(authUrl);
    response.cookies.set('youtube_oauth_state', state, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/',
    });
    // Also store user ID for the callback
    response.cookies.set('youtube_oauth_uid', user.id, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 600,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[YouTube Auth] Error:', error);
    return NextResponse.json({ error: 'Failed to initiate OAuth' }, { status: 500 });
  }
}
