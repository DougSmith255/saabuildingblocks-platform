/**
 * dlvr.it YouTube Video Rotation Scheduler
 *
 * Reshares YouTube videos (last 30 days, no Shorts) on a rotating schedule
 * across social platforms. Works alongside the blog poster and new-video
 * detector without overlapping times.
 *
 * Each platform gets a video reshare every few days at a unique time slot
 * that doesn't conflict with blog posts or new video announcements:
 *
 *   Blog times (occupied):
 *     LinkedIn SAA: 7:30 AM    Facebook: 11:00 AM   Threads:  3:00 PM
 *     LinkedIn Doug: 12:00 PM  Pinterest: 1:00 PM   Reddit:   9:00 AM (Tue/Thu)
 *     LinkedIn Karrie: 4:00 PM (Tue/Thu/Sat)
 *
 *   New video times (occupied):
 *     LinkedIn SAA: 10:00 AM   Facebook:  2:00 PM   Threads:  5:00 PM
 *     LinkedIn Doug: 8:30 AM   Pinterest: 4:30 PM   Reddit:   9:00 AM (Mon/Wed)
 *     LinkedIn Karrie: 1:30 PM (Mon/Wed/Fri)
 *
 *   Reshare times (this script):
 *     LinkedIn SAA:  5:30 PM   Facebook:  6:00 PM   Threads:  8:30 AM
 *     LinkedIn Doug: 3:30 PM   Pinterest: 10:00 AM  Reddit:   2:00 PM (Fri only)
 *     LinkedIn Karrie: 11:00 AM (Sun only - untouched by blog or new video)
 *
 *   Frequency:
 *     LinkedIn SAA, Facebook, Threads, Pinterest: every 3 days
 *     LinkedIn Doug: every 4 days
 *     LinkedIn Karrie: every Sunday
 *     Reddit: every Friday
 *
 * Usage:
 *   npx tsx scripts/dlvrit-youtube-rotation.ts                  # Dry run
 *   npx tsx scripts/dlvrit-youtube-rotation.ts --execute         # Queue reshares
 *   npx tsx scripts/dlvrit-youtube-rotation.ts --days 30         # 30 days (default: 45)
 *   npx tsx scripts/dlvrit-youtube-rotation.ts --reset           # Reset state
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

// ── Config ──────────────────────────────────────────────────────────────────

const DLVRIT_API_KEY = '2b5ed6a1c23242d0bc8efcc560cb238a';
const API_BASE = 'https://api.dlvrit.com/1';
const YOUTUBE_CHANNEL_ID = 'UCyrfSfQjQliXo_dWM89jvaA';
const YOUTUBE_FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;

const ET_OFFSET_HOURS = -4;
const DEFAULT_DAYS = 45;
const API_DELAY_MS = 1000;
const VIDEO_MAX_AGE_DAYS = 45;

const SCRIPT_DIR = dirname(new URL(import.meta.url).pathname);
const DATA_DIR = join(SCRIPT_DIR, '..', 'data');
const STATE_FILE = join(DATA_DIR, 'dlvrit-youtube-rotation-state.json');

// ── Platform Definitions ────────────────────────────────────────────────────

interface PlatformConfig {
  id: string;
  accountId: number;
  name: string;
  time: { hour: number; minute: number };
  /** Frequency in days (e.g., 3 = every 3rd day) */
  everyNDays: number | null;
  /** Specific days of week (overrides everyNDays). null = use everyNDays. */
  daysOfWeek: number[] | null;
  hashtags: boolean;
  seed: number;
}

const PLATFORMS: PlatformConfig[] = [
  {
    id: 'linkedin-saa',
    accountId: 2851832,
    name: 'LinkedIn (SAA Company)',
    time: { hour: 17, minute: 30 },  // 5:30 PM ET
    everyNDays: 3,
    daysOfWeek: null,
    hashtags: true,
    seed: 1042,
  },
  {
    id: 'facebook',
    accountId: 2851854,
    name: 'Facebook',
    time: { hour: 18, minute: 0 },  // 6:00 PM ET
    everyNDays: 3,
    daysOfWeek: null,
    hashtags: true,
    seed: 1389,
  },
  {
    id: 'threads',
    accountId: 2851856,
    name: 'Threads',
    time: { hour: 8, minute: 30 },  // 8:30 AM ET
    everyNDays: 3,
    daysOfWeek: null,
    hashtags: true,
    seed: 1617,
  },
  {
    id: 'pinterest',
    accountId: 2902650,
    name: 'Pinterest',
    time: { hour: 10, minute: 0 },  // 10:00 AM ET
    everyNDays: 3,
    daysOfWeek: null,
    hashtags: true,
    seed: 1947,
  },
  {
    id: 'linkedin-doug',
    accountId: 2851831,
    name: 'LinkedIn (Doug)',
    time: { hour: 15, minute: 30 },  // 3:30 PM ET
    everyNDays: 4,
    daysOfWeek: null,
    hashtags: true,
    seed: 1137,
  },
  {
    id: 'linkedin-karrie',
    accountId: 2851833,
    name: 'LinkedIn (Karrie)',
    time: { hour: 11, minute: 0 },  // 11:00 AM ET
    everyNDays: null,
    daysOfWeek: [0],  // Sunday only
    hashtags: true,
    seed: 1271,
  },
  {
    id: 'reddit',
    accountId: 2851828,
    name: 'Reddit (r/eXp_Education)',
    time: { hour: 14, minute: 0 },  // 2:00 PM ET
    everyNDays: null,
    daysOfWeek: [5],  // Friday only
    hashtags: false,
    seed: 1859,
  },
];

const HASHTAG_SETS = [
  '#eXpRealty #RealEstate #TeamTraining',
  '#RealEstateAgent #eXpRealty #AgentTraining',
  '#eXp #RealEstateCareer #SmartAgentAlliance',
  '#eXpRealty #RealtorLife #TeamCalls',
  '#RealEstateTips #eXpRealty #YouTubeVideo',
  '#JoineXp #RealEstate #AgentLife',
];

// ── Types ───────────────────────────────────────────────────────────────────

interface YouTubeVideo {
  videoId: string;
  title: string;
  url: string;
  published: string;
}

interface ScheduledPost {
  video: YouTubeVideo;
  platform: PlatformConfig;
  scheduledTime: Date;
  unixTime: number;
  message: string;
}

interface RotationState {
  lastScheduledDate: string;
  lastRunDate: string;
  totalQueued: number;
  platforms: Record<string, number>; // platform id -> rotation index
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function shuffleWithSeed<T>(arr: T[], seed: number): T[] {
  const shuffled = [...arr];
  let s = seed;
  for (let i = shuffled.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    const j = s % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
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

function loadState(): RotationState | null {
  try {
    if (existsSync(STATE_FILE)) {
      return JSON.parse(readFileSync(STATE_FILE, 'utf-8'));
    }
  } catch { /* ignore */ }
  return null;
}

function saveState(state: RotationState): void {
  mkdirSync(dirname(STATE_FILE), { recursive: true });
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
}

function decodeXmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

// ── YouTube Feed ────────────────────────────────────────────────────────────

async function fetchEligibleVideos(): Promise<YouTubeVideo[]> {
  const res = await fetch(YOUTUBE_FEED_URL);
  if (!res.ok) throw new Error(`YouTube feed returned ${res.status}`);

  const xml = await res.text();
  const videos: YouTubeVideo[] = [];
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - VIDEO_MAX_AGE_DAYS);

  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;

  while ((match = entryRegex.exec(xml)) !== null) {
    const entry = match[1];

    const videoId = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1];
    const title = entry.match(/<title>(.*?)<\/title>/)?.[1];
    const published = entry.match(/<published>(.*?)<\/published>/)?.[1];
    const link = entry.match(/<link rel="alternate" href="(.*?)"/)?.[1];

    if (!videoId || !title || !published || !link) continue;

    const decodedTitle = decodeXmlEntities(title);
    const isShort = link.includes('/shorts/') || decodedTitle.toLowerCase().includes('#shorts');
    if (isShort) continue;

    const pubDate = new Date(published);
    if (pubDate < cutoffDate) continue;

    videos.push({
      videoId,
      title: decodedTitle,
      url: link,
      published,
    });
  }

  return videos;
}

// ── Schedule Generation ─────────────────────────────────────────────────────

function shouldPostOnDay(platform: PlatformConfig, dayIndex: number, date: Date): boolean {
  if (platform.daysOfWeek) {
    return platform.daysOfWeek.includes(date.getDay());
  }
  if (platform.everyNDays) {
    return dayIndex % platform.everyNDays === 0;
  }
  return true;
}

function generateSchedule(
  videos: YouTubeVideo[],
  startDate: Date,
  days: number,
  state: RotationState | null,
): { schedule: ScheduledPost[]; newPlatformStates: Record<string, number> } {
  const schedule: ScheduledPost[] = [];
  const newPlatformStates: Record<string, number> = {};
  let globalIdx = state?.totalQueued ?? 0;

  for (const platform of PLATFORMS) {
    const shuffled = shuffleWithSeed(videos, platform.seed);
    if (shuffled.length === 0) continue;

    let rotationIdx = state?.platforms?.[platform.id] ?? 0;

    for (let day = 0; day < days; day++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + day);

      if (!shouldPostOnDay(platform, day, date)) continue;

      const scheduledDate = new Date(date);
      scheduledDate.setUTCHours(
        platform.time.hour - ET_OFFSET_HOURS,
        platform.time.minute,
        0, 0,
      );

      if (scheduledDate.getTime() <= Date.now()) continue;

      const video = shuffled[rotationIdx % shuffled.length];
      rotationIdx++;

      const hashtags = platform.hashtags
        ? HASHTAG_SETS[globalIdx % HASHTAG_SETS.length]
        : '';

      const message = platform.hashtags
        ? `${video.title}\n\n${video.url}\n\n${hashtags}`
        : `${video.title}\n\n${video.url}`;

      schedule.push({
        video,
        platform,
        scheduledTime: scheduledDate,
        unixTime: Math.floor(scheduledDate.getTime() / 1000),
        message,
      });

      globalIdx++;
    }

    newPlatformStates[platform.id] = rotationIdx;
  }

  schedule.sort((a, b) => a.unixTime - b.unixTime);
  return { schedule, newPlatformStates };
}

// ── dlvr.it API ─────────────────────────────────────────────────────────────

async function queuePost(post: ScheduledPost): Promise<{ success: boolean; error?: string }> {
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
  const reset = args.includes('--reset');
  const daysIdx = args.indexOf('--days');
  const days = daysIdx >= 0 && args[daysIdx + 1] ? parseInt(args[daysIdx + 1], 10) : DEFAULT_DAYS;

  console.log(`\n${'═'.repeat(70)}`);
  console.log(`  dlvr.it YouTube Video Rotation Scheduler`);
  console.log(`${'═'.repeat(70)}\n`);

  // Fetch eligible videos
  console.log(`Fetching YouTube feed (last ${VIDEO_MAX_AGE_DAYS} days, no Shorts)...`);
  const videos = await fetchEligibleVideos();

  if (videos.length === 0) {
    console.log('No eligible videos found. Need at least one non-Short video from the last 30 days.');
    return;
  }

  console.log(`Found ${videos.length} eligible videos:`);
  for (const v of videos) {
    const date = new Date(v.published).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    console.log(`  ${date}  ${v.title}`);
  }

  // Load state
  let state = reset ? null : loadState();

  // Determine start date
  let startDate: Date;
  if (state?.lastScheduledDate && !reset) {
    startDate = new Date(state.lastScheduledDate);
    startDate.setDate(startDate.getDate() + 1);
    startDate.setHours(0, 0, 0, 0);
  } else {
    startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
    startDate.setHours(0, 0, 0, 0);
  }

  console.log(`\nScheduling ${days} days starting ${formatDate(startDate)}`);
  if (state && !reset) {
    console.log(`Continuing from previous run (${state.totalQueued} previously queued)`);
  }

  // Platform info
  console.log(`\nPlatform reshare schedule:`);
  for (const p of PLATFORMS) {
    const freq = p.daysOfWeek
      ? p.daysOfWeek.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join('/')
      : `Every ${p.everyNDays} days`;
    const h = p.time.hour > 12 ? p.time.hour - 12 : p.time.hour;
    const ampm = p.time.hour >= 12 ? 'PM' : 'AM';
    const timeStr = `${h}:${String(p.time.minute).padStart(2, '0')} ${ampm}`;
    console.log(`  ${p.name.padEnd(28)} ${freq.padEnd(16)} ${timeStr}`);
  }

  // Generate schedule
  const { schedule, newPlatformStates } = generateSchedule(videos, startDate, days, state);

  if (schedule.length === 0) {
    console.log('\nNo posts to schedule.');
    return;
  }

  // Per-platform breakdown
  const platformCounts: Record<string, number> = {};
  for (const item of schedule) {
    platformCounts[item.platform.id] = (platformCounts[item.platform.id] || 0) + 1;
  }

  console.log(`\nPosts per platform (${days} days):`);
  for (const p of PLATFORMS) {
    const count = platformCounts[p.id] || 0;
    console.log(`  ${p.name.padEnd(28)} ${String(count).padStart(3)} reshares`);
  }
  console.log(`  ${'─'.repeat(40)}`);
  console.log(`  ${'Total'.padEnd(28)} ${String(schedule.length).padStart(3)} API calls`);

  // Preview first 7 days
  const previewDays = Math.min(7, days);
  console.log(`\nSchedule preview (first ${previewDays} days):`);
  console.log('─'.repeat(90));

  let currentDay = '';
  let dayCount = 0;
  for (const item of schedule) {
    const dayStr = item.scheduledTime.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      timeZone: 'America/New_York',
    });
    if (dayStr !== currentDay) {
      dayCount++;
      if (dayCount > previewDays) break;
      if (currentDay) console.log('');
      currentDay = dayStr;
    }

    const timeStr = item.scheduledTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'America/New_York',
    });
    const titleTrunc = item.video.title.length > 45
      ? item.video.title.slice(0, 42) + '...'
      : item.video.title;
    console.log(`  ${dayStr} ${timeStr.padStart(9)}  ${item.platform.name.padEnd(24)} ${titleTrunc}`);
  }
  console.log('\n' + '─'.repeat(90));

  console.log(`\nDate range: ${formatDate(schedule[0].scheduledTime)} - ${formatDate(schedule[schedule.length - 1].scheduledTime)}`);

  if (!execute) {
    console.log(`\nDRY RUN - no posts queued. Add --execute to queue.\n`);
    return;
  }

  // Execute
  console.log(`\nQueuing ${schedule.length} video reshares...\n`);

  let success = 0;
  let failed = 0;
  const failures: string[] = [];

  for (let i = 0; i < schedule.length; i++) {
    const item = schedule[i];
    const result = await queuePost(item);

    if (result.success) {
      success++;
      process.stdout.write(`\r  Queued: ${success}/${schedule.length} (${failed} failed)`);
    } else {
      failed++;
      failures.push(`${item.platform.name}: ${item.video.title.slice(0, 40)} - ${result.error}`);
      process.stdout.write(`\r  Queued: ${success}/${schedule.length} (${failed} failed)`);
    }

    if (i < schedule.length - 1) await sleep(API_DELAY_MS);
  }

  console.log(`\n\nDone! ${success} queued, ${failed} failed.`);

  if (failures.length > 0) {
    console.log(`\nFailures:`);
    for (const f of failures.slice(0, 20)) {
      console.log(`  - ${f}`);
    }
  }

  // Save state
  if (success > 0) {
    const lastPost = schedule[schedule.length - 1];
    const newState: RotationState = {
      lastScheduledDate: lastPost.scheduledTime.toISOString(),
      lastRunDate: new Date().toISOString(),
      totalQueued: (state?.totalQueued ?? 0) + success,
      platforms: newPlatformStates,
    };
    saveState(newState);
    console.log(`\nState saved. Next run continues from ${formatDate(lastPost.scheduledTime)}.`);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
