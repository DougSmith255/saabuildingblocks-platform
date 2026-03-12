/**
 * dlvr.it Blog Post Queue Scheduler v2
 *
 * Per-platform scheduling with staggered times and appropriate frequency.
 * Uses postToAccount for per-platform control instead of postToRoute.
 *
 * Platform strategy:
 *   LinkedIn Company (SAA):  Daily 7:30 AM ET  - professional audience, peak morning engagement
 *   LinkedIn Doug:           Daily 12:00 PM ET - staggered from company, midday professionals
 *   LinkedIn Karrie:         Tue/Thu/Sat 4:00 PM ET - less frequent to avoid coordinated look
 *   Facebook:                Daily 11:00 AM ET - peak FB engagement for real estate
 *   Instagram:               Daily 12:30 PM ET - peak visual platform engagement
 *   Threads:                 Daily 3:00 PM ET  - afternoon social browsing
 *   TikTok:                  Mon/Wed/Fri 5:00 PM ET - link posts get less reach, moderate frequency
 *   Reddit:                  Tue/Thu 9:00 AM ET - minimal frequency, no hashtags (anti-spam)
 *
 * Each platform gets its OWN post rotation so different content appears on
 * different platforms at different times - avoids the "same post everywhere" look.
 *
 * Usage:
 *   npx tsx scripts/dlvrit-queue-posts.ts                    # Dry run
 *   npx tsx scripts/dlvrit-queue-posts.ts --execute           # Queue posts
 *   npx tsx scripts/dlvrit-queue-posts.ts --days 30           # 30 days (default: 45)
 *   npx tsx scripts/dlvrit-queue-posts.ts --reset             # Reset state, start fresh
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

// ── Config ──────────────────────────────────────────────────────────────────

const DLVRIT_API_KEY = '2b5ed6a1c23242d0bc8efcc560cb238a';
const API_BASE = 'https://api.dlvrit.com/1';

// ET offset: -4 (EDT Mar-Nov), -5 (EST Nov-Mar). Use -4 for most scheduling.
const ET_OFFSET_HOURS = -4;

const DEFAULT_DAYS = 45;
const API_DELAY_MS = 1000;

const SCRIPT_DIR = dirname(new URL(import.meta.url).pathname);
const DATA_DIR = join(SCRIPT_DIR, '..', 'data');
const STATE_FILE = join(DATA_DIR, 'dlvrit-state.json');
const MAPPING_FILE = join(DATA_DIR, 'dlvrit-posts.json');

// ── Platform Definitions ────────────────────────────────────────────────────

interface PlatformConfig {
  id: string;
  accountId: number;
  name: string;
  /** Post times in ET */
  times: Array<{ hour: number; minute: number }>;
  /** Which days of week to post (0=Sun, 1=Mon, ..., 6=Sat). null = every day. */
  daysOfWeek: number[] | null;
  /** Whether to include hashtags */
  hashtags: boolean;
  /** Seed for shuffling - different per platform so rotations differ */
  seed: number;
  /** Ratio of higher-priority posts (0.0-1.0). Higher = more sponsor content. */
  higherRatio: number;
}

const PLATFORMS: PlatformConfig[] = [
  {
    id: 'linkedin-saa',
    accountId: 2851832,
    name: 'LinkedIn (SAA Company)',
    times: [{ hour: 7, minute: 30 }],
    daysOfWeek: null, // daily
    hashtags: true,
    seed: 42,
    higherRatio: 0.4, // company page favors sponsor content
  },
  {
    id: 'linkedin-doug',
    accountId: 2851831,
    name: 'LinkedIn (Doug)',
    times: [{ hour: 12, minute: 0 }],
    daysOfWeek: null,
    hashtags: true,
    seed: 137,
    higherRatio: 0.33,
  },
  {
    id: 'linkedin-karrie',
    accountId: 2851833,
    name: 'LinkedIn (Karrie)',
    times: [{ hour: 16, minute: 0 }],
    daysOfWeek: [2, 4, 6], // Tue, Thu, Sat
    hashtags: true,
    seed: 271,
    higherRatio: 0.33,
  },
  {
    id: 'facebook',
    accountId: 2851854,
    name: 'Facebook',
    times: [{ hour: 11, minute: 0 }],
    daysOfWeek: null,
    hashtags: true,
    seed: 389,
    higherRatio: 0.33,
  },
  // Instagram removed - no clickable links in post captions
  // {
  //   id: 'instagram',
  //   accountId: 2851853,
  //   name: 'Instagram',
  //   times: [{ hour: 12, minute: 30 }],
  //   daysOfWeek: null,
  //   hashtags: true,
  //   seed: 503,
  //   higherRatio: 0.33,
  // },
  {
    id: 'threads',
    accountId: 2851856,
    name: 'Threads',
    times: [{ hour: 15, minute: 0 }],
    daysOfWeek: null,
    hashtags: true,
    seed: 617,
    higherRatio: 0.33,
  },
  // TikTok removed - no clickable links in post captions
  {
    id: 'pinterest',
    accountId: 2902650,
    name: 'Pinterest',
    times: [{ hour: 13, minute: 0 }],  // 1:00 PM ET - peak Pinterest engagement
    daysOfWeek: null, // daily
    hashtags: true,
    seed: 947,
    higherRatio: 0.33,
  },
  {
    id: 'reddit',
    accountId: 2851828,
    name: 'Reddit (r/eXp_Education)',
    times: [{ hour: 9, minute: 0 }],
    daysOfWeek: [2, 4], // Tue, Thu only
    hashtags: false, // Reddit hates hashtags
    seed: 859,
    higherRatio: 0.5, // higher-value content for Reddit
  },
];

// Hashtag sets for platforms that use them
const HASHTAG_SETS = [
  '#eXpRealty #RealEstate',
  '#RealEstateAgent #eXp',
  '#eXpRealty #RealtorLife',
  '#RealEstateTips #eXpRealty',
  '#eXp #RealEstateCareer',
  '#JoineXp #RealEstate',
  '#RealtorTips #eXpRealty',
  '#eXpRealty #AgentLife',
  '#RealEstateAgents #eXp',
  '#eXpRealty #BrokerageLife',
  '#RealEstateLife #eXpRealty',
  '#eXpAgent #Realtor',
];

// ── Types ───────────────────────────────────────────────────────────────────

interface BlogPost {
  slug: string;
  title: string;
  url: string;
  id: number;
}

interface PostMapping {
  higher_priority: BlogPost[];
  lower_priority: BlogPost[];
}

interface ScheduledPost {
  post: BlogPost;
  priority: 'higher' | 'lower';
  platform: PlatformConfig;
  scheduledTime: Date;
  unixTime: number;
  message: string;
}

interface PlatformState {
  higherIdx: number;
  lowerIdx: number;
}

interface QueueState {
  lastScheduledDate: string;
  lastRunDate: string;
  totalQueued: number;
  platforms: Record<string, PlatformState>;
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

function loadState(): QueueState | null {
  try {
    if (existsSync(STATE_FILE)) {
      return JSON.parse(readFileSync(STATE_FILE, 'utf-8'));
    }
  } catch { /* ignore */ }
  return null;
}

function saveState(state: QueueState): void {
  mkdirSync(dirname(STATE_FILE), { recursive: true });
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
}

/**
 * Build a post sequence for a specific platform.
 * Each platform has its own shuffled order and higher/lower ratio.
 */
function buildPlatformSequence(
  mapping: PostMapping,
  platform: PlatformConfig,
  totalSlots: number,
  startState: PlatformState,
): { posts: Array<{ post: BlogPost; priority: 'higher' | 'lower' }>; endState: PlatformState } {
  const higherOrder = shuffleWithSeed(mapping.higher_priority, platform.seed);
  const lowerOrder = shuffleWithSeed(mapping.lower_priority, platform.seed + 1000);

  let higherIdx = startState.higherIdx;
  let lowerIdx = startState.lowerIdx;
  const posts: Array<{ post: BlogPost; priority: 'higher' | 'lower' }> = [];

  // Determine pattern: e.g., ratio 0.4 means ~2 out of 5 are higher
  const higherEveryN = Math.round(1 / platform.higherRatio);

  for (let i = 0; i < totalSlots; i++) {
    if (i % higherEveryN === 0) {
      posts.push({
        post: higherOrder[higherIdx % higherOrder.length],
        priority: 'higher',
      });
      higherIdx++;
    } else {
      posts.push({
        post: lowerOrder[lowerIdx % lowerOrder.length],
        priority: 'lower',
      });
      lowerIdx++;
    }
  }

  return { posts, endState: { higherIdx, lowerIdx } };
}

/**
 * Format the message for a specific platform.
 */
function formatMessage(post: BlogPost, platform: PlatformConfig, globalSlotIdx: number): string {
  if (!platform.hashtags) {
    // Reddit: clean, no hashtags
    return `${post.title}\n\n${post.url}`;
  }
  const hashtags = HASHTAG_SETS[globalSlotIdx % HASHTAG_SETS.length];
  return `${post.title}\n\n${post.url}\n\n${hashtags}`;
}

/**
 * Generate all scheduled posts across all platforms.
 */
function generateFullSchedule(
  mapping: PostMapping,
  startDate: Date,
  days: number,
  state: QueueState | null,
): { schedule: ScheduledPost[]; newPlatformStates: Record<string, PlatformState> } {
  const schedule: ScheduledPost[] = [];
  const newPlatformStates: Record<string, PlatformState> = {};
  let globalSlotIdx = state?.totalQueued ?? 0;

  for (const platform of PLATFORMS) {
    // Count how many posting days this platform has in the window
    let postingDays = 0;
    for (let day = 0; day < days; day++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + day);
      const dow = date.getDay();
      if (platform.daysOfWeek === null || platform.daysOfWeek.includes(dow)) {
        postingDays++;
      }
    }

    const totalSlots = postingDays * platform.times.length;
    if (totalSlots === 0) continue;

    const startState = state?.platforms?.[platform.id] ?? { higherIdx: 0, lowerIdx: 0 };
    const { posts, endState } = buildPlatformSequence(mapping, platform, totalSlots, startState);
    newPlatformStates[platform.id] = endState;

    let slotIdx = 0;
    for (let day = 0; day < days && slotIdx < posts.length; day++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + day);
      const dow = date.getDay();

      if (platform.daysOfWeek !== null && !platform.daysOfWeek.includes(dow)) {
        continue;
      }

      for (const time of platform.times) {
        if (slotIdx >= posts.length) break;

        const scheduledDate = new Date(date);
        scheduledDate.setUTCHours(time.hour - ET_OFFSET_HOURS, time.minute, 0, 0);

        if (scheduledDate.getTime() <= Date.now()) continue;

        const { post, priority } = posts[slotIdx];
        schedule.push({
          post,
          priority,
          platform,
          scheduledTime: scheduledDate,
          unixTime: Math.floor(scheduledDate.getTime() / 1000),
          message: formatMessage(post, platform, globalSlotIdx),
        });

        slotIdx++;
        globalSlotIdx++;
      }
    }
  }

  // Sort by scheduled time so we queue in chronological order
  schedule.sort((a, b) => a.unixTime - b.unixTime);

  return { schedule, newPlatformStates };
}

/**
 * Queue a single post to a specific account via dlvr.it API.
 */
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

    if (data.status === 'ok') {
      return { success: true };
    }
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

  // Load post mapping
  let mapping: PostMapping;
  try {
    mapping = JSON.parse(readFileSync(MAPPING_FILE, 'utf-8'));
  } catch {
    console.error(`Failed to read post mapping from ${MAPPING_FILE}`);
    process.exit(1);
  }

  // Load or initialize state
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

  console.log(`\n${'═'.repeat(80)}`);
  console.log(`  dlvr.it Social Poster v2 - Per-Platform Scheduling`);
  console.log(`${'═'.repeat(80)}\n`);

  console.log(`Post inventory:`);
  console.log(`  Higher priority: ${mapping.higher_priority.length} posts (sponsor clusters)`);
  console.log(`  Lower priority:  ${mapping.lower_priority.length} posts (about-exp clusters)`);
  console.log(`  Scheduling:      ${days} days`);
  if (state && !reset) {
    console.log(`  Continuing from: ${formatDate(startDate)} (last run: ${new Date(state.lastRunDate).toLocaleDateString()})`);
    console.log(`  Previously queued: ${state.totalQueued} posts`);
  } else {
    console.log(`  Starting fresh from: ${formatDate(startDate)}`);
  }

  console.log(`\nPlatform schedule:`);
  for (const p of PLATFORMS) {
    const daysLabel = p.daysOfWeek
      ? p.daysOfWeek.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join('/')
      : 'Daily';
    const timesLabel = p.times.map(t => {
      const h = t.hour > 12 ? t.hour - 12 : t.hour;
      const ampm = t.hour >= 12 ? 'PM' : 'AM';
      return `${h}:${String(t.minute).padStart(2, '0')} ${ampm}`;
    }).join(', ');
    const ratio = `${Math.round(p.higherRatio * 100)}% sponsor`;
    console.log(`  ${p.name.padEnd(28)} ${daysLabel.padEnd(16)} ${timesLabel.padEnd(12)} ${ratio}`);
  }

  const { schedule, newPlatformStates } = generateFullSchedule(mapping, startDate, days, state);

  if (schedule.length === 0) {
    console.log(`\nNo slots to schedule.`);
    return;
  }

  // Per-platform breakdown
  const platformCounts: Record<string, { total: number; higher: number; lower: number }> = {};
  for (const item of schedule) {
    const pid = item.platform.id;
    if (!platformCounts[pid]) platformCounts[pid] = { total: 0, higher: 0, lower: 0 };
    platformCounts[pid].total++;
    if (item.priority === 'higher') platformCounts[pid].higher++;
    else platformCounts[pid].lower++;
  }

  console.log(`\nPosts per platform (${days} days):`);
  for (const p of PLATFORMS) {
    const c = platformCounts[p.id];
    if (c) {
      console.log(`  ${p.name.padEnd(28)} ${String(c.total).padStart(3)} posts (${c.higher} sponsor, ${c.lower} about-exp)`);
    }
  }
  console.log(`  ${'─'.repeat(50)}`);
  console.log(`  ${'Total'.padEnd(28)} ${String(schedule.length).padStart(3)} API calls`);

  // Print daily schedule preview (first 7 days)
  const previewDays = Math.min(7, days);
  console.log(`\nSchedule preview (first ${previewDays} days):`);
  console.log('─'.repeat(100));

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
    const priorityTag = item.priority === 'higher' ? '[H]' : '[L]';
    const platformShort = item.platform.name.length > 20
      ? item.platform.name.slice(0, 18) + '..'
      : item.platform.name;
    const titleTrunc = item.post.title.length > 45 ? item.post.title.slice(0, 42) + '...' : item.post.title;
    console.log(`  ${dayStr} ${timeStr.padStart(9)}  ${platformShort.padEnd(20)} ${priorityTag}  ${titleTrunc}`);
  }
  console.log('\n' + '─'.repeat(100));

  console.log(`\nDate range: ${formatDate(schedule[0].scheduledTime)} - ${formatDate(schedule[schedule.length - 1].scheduledTime)}`);

  if (!execute) {
    console.log(`\nDRY RUN - no posts queued. Add --execute to queue posts.\n`);
    return;
  }

  // Execute
  console.log(`\nQueuing ${schedule.length} posts to dlvr.it...\n`);

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
      const msg = `${item.platform.name}: ${item.post.title.slice(0, 40)} - ${result.error}`;
      failures.push(msg);
      process.stdout.write(`\r  Queued: ${success}/${schedule.length} (${failed} failed)`);
    }

    if (i < schedule.length - 1) {
      await sleep(API_DELAY_MS);
    }
  }

  console.log(`\n\nDone! ${success} queued, ${failed} failed.`);

  if (failures.length > 0) {
    console.log(`\nFailures:`);
    for (const f of failures.slice(0, 20)) {
      console.log(`  - ${f}`);
    }
    if (failures.length > 20) {
      console.log(`  ... and ${failures.length - 20} more`);
    }
  }

  // Save state
  if (success > 0) {
    const lastPost = schedule[schedule.length - 1];
    const newState: QueueState = {
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
