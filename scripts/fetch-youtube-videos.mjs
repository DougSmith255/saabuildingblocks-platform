/**
 * Standalone script to fetch all YouTube video titles from the channel.
 * Uses the stored OAuth tokens from Supabase + YouTube Data API.
 *
 * Usage: node scripts/fetch-youtube-videos.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { google } from 'googleapis';
import { createDecipheriv } from 'crypto';
import { writeFileSync } from 'fs';

// Load env from admin-dashboard
import { config } from 'dotenv';
config({ path: './packages/admin-dashboard/.env.local' });

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

function decrypt(encryptedStr) {
  const key = Buffer.from(process.env.YOUTUBE_ENCRYPTION_KEY, 'hex');
  const parts = encryptedStr.split(':');
  const iv = Buffer.from(parts[0], 'base64');
  const tag = Buffer.from(parts[1], 'base64');
  const encrypted = Buffer.from(parts[2], 'base64');
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString('utf8');
}

function parseDuration(iso) {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  return parseInt(match[1] || '0') * 3600 + parseInt(match[2] || '0') * 60 + parseInt(match[3] || '0');
}

async function main() {
  // Connect to Supabase
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // Get stored YouTube tokens (grab the first one)
  const { data: tokenRows, error } = await supabase
    .from('youtube_oauth_tokens')
    .select('*')
    .limit(1);

  if (error || !tokenRows?.length) {
    console.error('No YouTube tokens found:', error?.message);
    process.exit(1);
  }

  const tokens = tokenRows[0];
  console.log(`Channel: ${tokens.channel_title} (${tokens.channel_id})`);

  // Decrypt tokens
  let accessToken;
  const isExpired = new Date(tokens.token_expires_at) <= new Date();

  if (isExpired) {
    console.log('Token expired, refreshing...');
    const refreshToken = decrypt(tokens.encrypted_refresh_token);
    const oauth2Client = new google.auth.OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    const { credentials } = await oauth2Client.refreshAccessToken();
    accessToken = credentials.access_token;
  } else {
    accessToken = decrypt(tokens.encrypted_access_token);
  }

  // Set up YouTube client
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

  // Get uploads playlist
  const uploadsPlaylistId = 'UU' + tokens.channel_id.substring(2);
  console.log(`Fetching from playlist: ${uploadsPlaylistId}`);

  // Fetch all video IDs
  const videoIds = [];
  let pageToken;
  do {
    const res = await youtube.playlistItems.list({
      part: ['contentDetails'],
      playlistId: uploadsPlaylistId,
      maxResults: 50,
      pageToken,
    });
    for (const item of res.data.items || []) {
      if (item.contentDetails?.videoId) {
        videoIds.push(item.contentDetails.videoId);
      }
    }
    pageToken = res.data.nextPageToken || undefined;
  } while (pageToken);

  console.log(`Found ${videoIds.length} videos`);

  // Fetch video details in batches
  const videos = [];
  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50);
    const res = await youtube.videos.list({
      part: ['snippet', 'contentDetails', 'statistics'],
      id: batch,
    });
    for (const item of res.data.items || []) {
      const duration = item.contentDetails?.duration || 'PT0S';
      const durationSeconds = parseDuration(duration);
      const isShort = durationSeconds <= 180 || (item.snippet?.title?.toLowerCase().includes('#shorts') ?? false);
      videos.push({
        id: item.id,
        title: item.snippet?.title || '',
        publishedAt: item.snippet?.publishedAt || '',
        thumbnailUrl: item.snippet?.thumbnails?.maxres?.url || item.snippet?.thumbnails?.high?.url || '',
        durationSeconds,
        viewCount: parseInt(item.statistics?.viewCount || '0'),
        isShort,
      });
    }
  }

  // Sort by publish date (newest first)
  videos.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  // Separate shorts from regular videos
  const regularVideos = videos.filter(v => !v.isShort);
  const shorts = videos.filter(v => v.isShort);

  console.log(`\n${regularVideos.length} regular videos, ${shorts.length} shorts\n`);
  console.log('=== REGULAR VIDEOS (need thumbnails) ===\n');

  regularVideos.forEach((v, i) => {
    const date = new Date(v.publishedAt).toISOString().split('T')[0];
    console.log(`${i + 1}. [${v.id}] ${v.title}`);
    console.log(`   Views: ${v.viewCount.toLocaleString()} | Published: ${date}`);
  });

  if (shorts.length) {
    console.log(`\n=== SHORTS (${shorts.length} total, skipping) ===\n`);
  }

  // Save to JSON for the thumbnail pipeline
  const output = regularVideos.map(v => ({
    id: v.id,
    title: v.title,
    views: v.viewCount,
    published: new Date(v.publishedAt).toISOString().split('T')[0],
    thumbnailText: '', // To be filled in
    imagePrompt: '',   // To be filled in
  }));

  writeFileSync('scripts/youtube-videos.json', JSON.stringify(output, null, 2));
  console.log(`\nSaved to scripts/youtube-videos.json`);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
