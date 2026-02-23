import { google, youtube_v3, youtubeAnalytics_v2 } from 'googleapis';
import { createClient } from '@/lib/supabase/server';
import { encrypt, decrypt } from './encryption';
import type { YouTubeTokens } from './types';

const SCOPES = [
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/yt-analytics.readonly',
];

function getOAuth2Client() {
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  const redirectUri = 'https://saabuildingblocks.com/api/youtube/callback';

  if (!clientId || !clientSecret) {
    throw new Error('YouTube OAuth credentials not configured');
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

export function getAuthUrl(state: string): string {
  const oauth2Client = getOAuth2Client();
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    state,
    prompt: 'consent',
  });
}

export async function exchangeCode(code: string): Promise<{
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}> {
  const oauth2Client = getOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);

  if (!tokens.access_token || !tokens.refresh_token) {
    throw new Error('Failed to obtain tokens from Google');
  }

  const expiresAt = new Date(tokens.expiry_date || Date.now() + 3600 * 1000);

  return {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresAt,
  };
}

export async function storeTokens(
  userId: string,
  accessToken: string,
  refreshToken: string,
  expiresAt: Date,
  channelInfo?: { id: string; title: string; thumbnailUrl: string }
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('youtube_oauth_tokens')
    .upsert({
      user_id: userId,
      encrypted_access_token: encrypt(accessToken),
      encrypted_refresh_token: encrypt(refreshToken),
      token_expires_at: expiresAt.toISOString(),
      channel_id: channelInfo?.id || null,
      channel_title: channelInfo?.title || null,
      channel_thumbnail_url: channelInfo?.thumbnailUrl || null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

  if (error) {
    throw new Error(`Failed to store tokens: ${error.message}`);
  }
}

export async function getTokens(userId: string): Promise<YouTubeTokens | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('youtube_oauth_tokens')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;
  return data as YouTubeTokens;
}

export async function deleteTokens(userId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('youtube_oauth_tokens')
    .delete()
    .eq('user_id', userId);

  if (error) {
    throw new Error(`Failed to delete tokens: ${error.message}`);
  }
}

async function refreshAccessToken(userId: string, encryptedRefreshToken: string): Promise<string> {
  const oauth2Client = getOAuth2Client();
  const refreshToken = decrypt(encryptedRefreshToken);
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const { credentials } = await oauth2Client.refreshAccessToken();
  if (!credentials.access_token) {
    throw new Error('Failed to refresh access token');
  }

  const expiresAt = new Date(credentials.expiry_date || Date.now() + 3600 * 1000);

  // Update stored tokens
  const supabase = await createClient();
  await supabase
    .from('youtube_oauth_tokens')
    .update({
      encrypted_access_token: encrypt(credentials.access_token),
      token_expires_at: expiresAt.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  return credentials.access_token;
}

export async function getAuthenticatedClients(userId: string): Promise<{
  youtube: youtube_v3.Youtube;
  youtubeAnalytics: youtubeAnalytics_v2.Youtubeanalytics;
} | null> {
  const tokens = await getTokens(userId);
  if (!tokens) return null;

  let accessToken: string;
  const isExpired = new Date(tokens.token_expires_at) <= new Date();

  if (isExpired) {
    try {
      accessToken = await refreshAccessToken(userId, tokens.encrypted_refresh_token);
    } catch {
      // Refresh failed — tokens may be revoked
      return null;
    }
  } else {
    accessToken = decrypt(tokens.encrypted_access_token);
  }

  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({ access_token: accessToken });

  const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
  const youtubeAnalytics = google.youtubeAnalytics({ version: 'v2', auth: oauth2Client });

  return { youtube, youtubeAnalytics };
}

export async function revokeToken(accessToken: string): Promise<void> {
  try {
    const oauth2Client = getOAuth2Client();
    await oauth2Client.revokeToken(accessToken);
  } catch {
    // Best-effort revocation
  }
}
