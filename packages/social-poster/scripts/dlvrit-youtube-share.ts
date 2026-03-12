/**
 * dlvr.it YouTube Video Resharer
 *
 * Checks the SAA YouTube channel RSS feed for new videos and queues them
 * to social platforms via dlvr.it. Coordinates with the blog post scheduler
 * to avoid spam - uses DIFFERENT time slots than blog posts.
 *
 * Blog post times (avoid these):
 *   LinkedIn SAA:   7:30 AM    Facebook:  11:00 AM    Threads:   3:00 PM
 *   LinkedIn Doug: 12:00 PM    Pinterest:  1:00 PM    Reddit:    9:00 AM (Tue/Thu)
 *   LinkedIn Karrie: 4:00 PM (Tue/Thu/Sat)
 *
 * YouTube video times (fill the gaps):
 *   LinkedIn SAA:  10:00 AM    Facebook:   2:00 PM    Threads:   5:00 PM
 *   LinkedIn Doug:  8:30 AM    Pinterest:  4:30 PM    Reddit:    9:00 AM (Mon/Wed only)
 *   LinkedIn Karrie: 1:30 PM (Mon/Wed/Fri - opposite days from blog)
 *
 * Stagger: videos post across 2 days after upload, not all at once.
 *   Day 1: LinkedIn SAA, Facebook, Threads, Pinterest
 *   Day 2: LinkedIn Doug, LinkedIn Karrie, Reddit
 *
 * Usage:
 *   npx tsx scripts/dlvrit-youtube-share.ts              # Dry run
 *   npx tsx scripts/dlvrit-youtube-share.ts --execute     # Check and queue new videos
 *   npx tsx scripts/dlvrit-youtube-share.ts --force       # Re-share last video even if already shared
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

// ── Config ──────────────────────────────────────────────────────────────────

const DLVRIT_API_KEY = '2b5ed6a1c23242d0bc8efcc560cb238a';
const API_BASE = 'https://api.dlvrit.com/1';
const YOUTUBE_CHANNEL_ID = 'UCyrfSfQjQliXo_dWM89jvaA';
const YOUTUBE_FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;

const ET_OFFSET_HOURS = -4;
const API_DELAY_MS = 1000;

const SCRIPT_DIR = dirname(new URL(import.meta.url).pathname);
const DATA_DIR = join(SCRIPT_DIR, '..', 'data');
const STATE_FILE = join(DATA_DIR, 'dlvrit-youtube-state.json');

// ── Platform schedules for YouTube videos ───────────────────────────────────
// Times chosen to NOT overlap with blog post times

interface VideoPlatform {
  id: string;
  accountId: number;
  name: string;
  /** Hour and minute in ET */
  time: { hour: number; minute: number };
  /** Which day after video detection to post (0 = same day/next morning, 1 = day after) */
  dayOffset: number;
  /** Only post on these days of week? null = any day. */
  allowedDays: number[] | null;
  hashtags: boolean;
}

const VIDEO_PLATFORMS: VideoPlatform[] = [
  // Day 1: Primary platforms (biggest reach first)
  {
    id: 'linkedin-saa',
    accountId: 2851832,
    name: 'LinkedIn (SAA Company)',
    time: { hour: 10, minute: 0 },  // Blog is at 7:30 AM
    dayOffset: 0,
    allowedDays: null,
    hashtags: true,
  },
  {
    id: 'facebook',
    accountId: 2851854,
    name: 'Facebook',
    time: { hour: 14, minute: 0 },  // Blog is at 11:00 AM
    dayOffset: 0,
    allowedDays: null,
    hashtags: true,
  },
  {
    id: 'threads',
    accountId: 2851856,
    name: 'Threads',
    time: { hour: 17, minute: 0 },  // Blog is at 3:00 PM
    dayOffset: 0,
    allowedDays: null,
    hashtags: true,
  },
  {
    id: 'pinterest',
    accountId: 2902650,
    name: 'Pinterest',
    time: { hour: 16, minute: 30 },  // Blog is at 1:00 PM
    dayOffset: 0,
    allowedDays: null,
    hashtags: true,
  },

  // Day 2: Secondary platforms (staggered for sustained visibility)
  {
    id: 'linkedin-doug',
    accountId: 2851831,
    name: 'LinkedIn (Doug)',
    time: { hour: 8, minute: 30 },  // Blog is at 12:00 PM
    dayOffset: 1,
    allowedDays: null,
    hashtags: true,
  },
  {
    id: 'linkedin-karrie',
    accountId: 2851833,
    name: 'LinkedIn (Karrie)',
    time: { hour: 13, minute: 30 },  // Blog is at 4:00 PM on Tue/Thu/Sat
    dayOffset: 1,
    allowedDays: [1, 3, 5], // Mon/Wed/Fri (opposite of blog's Tue/Thu/Sat)
    hashtags: true,
  },
  {
    id: 'reddit',
    accountId: 2851828,
    name: 'Reddit (r/eXp_Education)',
    time: { hour: 9, minute: 0 },  // Blog is Tue/Thu; videos Mon/Wed
    dayOffset: 1,
    allowedDays: [1, 3], // Mon/Wed only (blog uses Tue/Thu)
    hashtags: false,
  },
];

const VIDEO_HASHTAGS = [
  '#eXpRealty #RealEstate #TeamTraining',
  '#RealEstateAgent #eXpRealty #AgentTraining',
  '#eXp #RealEstateCareer #SmartAgentAlliance',
  '#eXpRealty #RealtorLife #TeamCalls',
];

// ── Types ───────────────────────────────────────────────────────────────────

interface YouTubeVideo {
  videoId: string;
  title: string;
  url: string;
  published: string;
  isShort: boolean;
}

interface YouTubeState {
  lastVideoId: string;
  lastVideoTitle: string;
  lastChecked: string;
  videosShared: number;
}

interface QueuedVideoPost {
  platform: VideoPlatform;
  video: YouTubeVideo;
  scheduledTime: Date;
  unixTime: number;
  message: string;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function loadState(): YouTubeState | null {
  try {
    if (existsSync(STATE_FILE)) {
      return JSON.parse(readFileSync(STATE_FILE, 'utf-8'));
    }
  } catch { /* ignore */ }
  return null;
}

function saveState(state: YouTubeState): void {
  mkdirSync(dirname(STATE_FILE), { recursive: true });
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/New_York',
  });
}

// ── YouTube Feed Parser ─────────────────────────────────────────────────────

async function fetchLatestVideos(limit = 5): Promise<YouTubeVideo[]> {
  const res = await fetch(YOUTUBE_FEED_URL);
  if (!res.ok) throw new Error(`YouTube feed returned ${res.status}`);

  const xml = await res.text();
  const videos: YouTubeVideo[] = [];

  // Simple XML parsing for Atom feed entries
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;

  while ((match = entryRegex.exec(xml)) !== null && videos.length < limit) {
    const entry = match[1];

    const videoId = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1];
    const title = entry.match(/<title>(.*?)<\/title>/)?.[1];
    const published = entry.match(/<published>(.*?)<\/published>/)?.[1];
    const link = entry.match(/<link rel="alternate" href="(.*?)"/)?.[1];

    if (videoId && title && published && link) {
      const decodedTitle = decodeXmlEntities(title);
      const isShort = link.includes('/shorts/') || decodedTitle.toLowerCase().includes('#shorts');

      // Skip Shorts entirely - only share full videos
      if (isShort) continue;

      videos.push({
        videoId,
        title: decodedTitle,
        url: link,
        published,
        isShort: false,
      });
    }
  }

  return videos;
}

function decodeXmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

// ── Schedule Generation ─────────────────────────────────────────────────────

function generateVideoSchedule(video: YouTubeVideo): QueuedVideoPost[] {
  const posts: QueuedVideoPost[] = [];
  const now = new Date();

  // Start scheduling from tomorrow morning to give time for the cron to run
  const baseDate = new Date(now);
  baseDate.setDate(baseDate.getDate() + 1);
  baseDate.setHours(0, 0, 0, 0);

  for (const platform of VIDEO_PLATFORMS) {
    let postDate = new Date(baseDate);
    postDate.setDate(postDate.getDate() + platform.dayOffset);

    // If platform has day-of-week restrictions, find next allowed day
    if (platform.allowedDays) {
      let attempts = 0;
      while (!platform.allowedDays.includes(postDate.getDay()) && attempts < 7) {
        postDate.setDate(postDate.getDate() + 1);
        attempts++;
      }
      if (attempts >= 7) continue; // shouldn't happen
    }

    // Set time in UTC from ET
    const scheduledDate = new Date(postDate);
    scheduledDate.setUTCHours(
      platform.time.hour - ET_OFFSET_HOURS,
      platform.time.minute,
      0, 0
    );

    // Skip if in the past
    if (scheduledDate.getTime() <= now.getTime()) {
      scheduledDate.setDate(scheduledDate.getDate() + 1);
    }

    // Format message
    const hashtags = platform.hashtags
      ? VIDEO_HASHTAGS[posts.length % VIDEO_HASHTAGS.length]
      : '';

    const videoLabel = video.isShort ? '' : 'New video: ';
    const message = platform.hashtags
      ? `${videoLabel}${video.title}\n\n${video.url}\n\n${hashtags}`
      : `${videoLabel}${video.title}\n\n${video.url}`;

    posts.push({
      platform,
      video,
      scheduledTime: scheduledDate,
      unixTime: Math.floor(scheduledDate.getTime() / 1000),
      message,
    });
  }

  // Sort by time
  posts.sort((a, b) => a.unixTime - b.unixTime);
  return posts;
}

// ── dlvr.it API ─────────────────────────────────────────────────────────────

async function queuePost(post: QueuedVideoPost): Promise<{ success: boolean; error?: string }> {
  const params = new URLSearchParams({
    key: DLVRIT_API_KEY,
    id: String(post.platform.accountId),
    msg: post.message,
    queue: '1',
    posttime: String(post.unixTime),
    order: 'last',
  });

  try {
    const res = await fetch(`${API_BASE}/postToAccount.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const data = await res.json();
    if (data.status === 'ok') return { success: true };
    return { success: false, error: data.error || JSON.stringify(data) };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const execute = args.includes('--execute');
  const force = args.includes('--force');

  console.log(`\n${'═'.repeat(70)}`);
  console.log(`  dlvr.it YouTube Video Resharer`);
  console.log(`${'═'.repeat(70)}\n`);

  // Fetch latest videos
  console.log('Fetching YouTube feed...');
  const videos = await fetchLatestVideos(5);

  if (videos.length === 0) {
    console.log('No videos found in feed.');
    return;
  }

  console.log(`Found ${videos.length} recent videos:`);
  for (const v of videos) {
    const date = new Date(v.published).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const type = v.isShort ? '[SHORT]' : '[VIDEO]';
    console.log(`  ${date}  ${type}  ${v.title}`);
  }

  // Load state
  const state = loadState();
  const latestVideo = videos[0];

  if (state && state.lastVideoId === latestVideo.videoId && !force) {
    console.log(`\nLatest video already shared: "${latestVideo.title}"`);
    console.log('No new videos to share. Use --force to re-share.');
    return;
  }

  if (state) {
    console.log(`\nLast shared: "${state.lastVideoTitle}" (${new Date(state.lastChecked).toLocaleDateString()})`);
  }
  console.log(`New video to share: "${latestVideo.title}"`);

  // Generate schedule
  const schedule = generateVideoSchedule(latestVideo);

  console.log(`\nSharing schedule (${schedule.length} posts across 2 days):`);
  console.log('─'.repeat(70));

  let currentDay = '';
  for (const post of schedule) {
    const dayStr = post.scheduledTime.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      timeZone: 'America/New_York',
    });
    if (dayStr !== currentDay) {
      if (currentDay) console.log('');
      currentDay = dayStr;
      const label = post.platform.dayOffset === 0 ? '(primary platforms)' : '(secondary platforms)';
      console.log(`  ${dayStr} ${label}`);
    }

    const timeStr = post.scheduledTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'America/New_York',
    });
    console.log(`    ${timeStr.padStart(9)}  ${post.platform.name}`);
  }
  console.log('─'.repeat(70));

  if (!execute) {
    console.log(`\nDRY RUN - no posts queued. Add --execute to queue.\n`);
    return;
  }

  // Execute
  console.log(`\nQueuing ${schedule.length} video shares...`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < schedule.length; i++) {
    const post = schedule[i];
    const result = await queuePost(post);

    if (result.success) {
      success++;
      console.log(`  ✓ ${post.platform.name} - ${formatDate(post.scheduledTime)}`);
    } else {
      failed++;
      console.log(`  ✗ ${post.platform.name} - ${result.error}`);
    }

    if (i < schedule.length - 1) await sleep(API_DELAY_MS);
  }

  console.log(`\nDone! ${success} queued, ${failed} failed.`);

  // Save state
  if (success > 0) {
    const newState: YouTubeState = {
      lastVideoId: latestVideo.videoId,
      lastVideoTitle: latestVideo.title,
      lastChecked: new Date().toISOString(),
      videosShared: (state?.videosShared ?? 0) + 1,
    };
    saveState(newState);
    console.log(`State saved. Video "${latestVideo.title}" marked as shared.`);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
