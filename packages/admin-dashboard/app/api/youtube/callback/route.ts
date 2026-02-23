import { NextRequest, NextResponse } from 'next/server';
import { exchangeCode, storeTokens } from '@/lib/youtube/client';
import { google } from 'googleapis';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const errorParam = searchParams.get('error');

    // User denied consent
    if (errorParam) {
      return NextResponse.redirect(
        new URL('/master-controller?tab=analytics&sub=youtube&error=consent_denied', request.url)
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/master-controller?tab=analytics&sub=youtube&error=missing_params', request.url)
      );
    }

    // Validate CSRF state
    const storedState = request.cookies.get('youtube_oauth_state')?.value;
    const userId = request.cookies.get('youtube_oauth_uid')?.value;

    if (!storedState || storedState !== state) {
      return NextResponse.redirect(
        new URL('/master-controller?tab=analytics&sub=youtube&error=invalid_state', request.url)
      );
    }

    if (!userId) {
      return NextResponse.redirect(
        new URL('/master-controller?tab=analytics&sub=youtube&error=no_session', request.url)
      );
    }

    // Exchange code for tokens
    const { accessToken, refreshToken, expiresAt } = await exchangeCode(code);

    // Fetch channel info
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });
    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

    const channelResponse = await youtube.channels.list({
      part: ['snippet', 'statistics'],
      mine: true,
    });

    const channel = channelResponse.data.items?.[0];
    const channelInfo = channel ? {
      id: channel.id!,
      title: channel.snippet?.title || 'Unknown Channel',
      thumbnailUrl: channel.snippet?.thumbnails?.default?.url || '',
    } : undefined;

    // Store encrypted tokens in Supabase
    await storeTokens(userId, accessToken, refreshToken, expiresAt, channelInfo);

    // Clear OAuth cookies and redirect
    const response = NextResponse.redirect(
      new URL('/master-controller?tab=analytics&sub=youtube', request.url)
    );
    response.cookies.delete('youtube_oauth_state');
    response.cookies.delete('youtube_oauth_uid');

    return response;
  } catch (error) {
    console.error('[YouTube Callback] Error:', error);
    return NextResponse.redirect(
      new URL('/master-controller?tab=analytics&sub=youtube&error=token_exchange_failed', request.url)
    );
  }
}
