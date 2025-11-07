import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * File patterns to include in git status results
 * Synced with commit API STAGE_PATTERNS for consistency
 */
const INCLUDE_PATTERNS = [
  // ===== COMPONENTS =====
  /^packages\/shared\/components\/saa\//,

  // ===== PUBLIC SITE CODE =====
  /^packages\/public-site\/app\/.*\.(tsx|ts)$/,
  /^packages\/public-site\/components\/.*\.(tsx|ts)$/,

  // ===== STYLES =====
  /^packages\/public-site\/public\/.*\.css$/,
  /^packages\/public-site\/app\/.*\.css$/,
  /^packages\/public-site\/components\/.*\.css$/,

  // ===== ASSETS =====
  /^packages\/public-site\/public\/.*\.(svg|png|jpg|jpeg|webp|woff2?)$/,

  // ===== DATA & CONFIG =====
  /^packages\/admin-dashboard\/data\/saa-component-registry\.ts$/,
  /^packages\/public-site\/data\/.*\.(ts|json)$/,

  // ===== ADMIN DASHBOARD (Master Controller) =====
  /^packages\/admin-dashboard\/app\/api\/master-controller\//,
  /^packages\/admin-dashboard\/app\/master-controller\//,

  // ===== ROOT CONFIG =====
  /^ecosystem\.config\.js$/,
];

/**
 * File patterns to exclude from git status results
 */
const EXCLUDE_PATTERNS = [
  /\.npm\//,
  /\.pm2\//,
  /\.claude\//,
  /\.agent-memory\//,
  /node_modules\//,
];

/**
 * Check if a file path should be included in results
 */
function shouldIncludeFile(filePath: string): boolean {
  // First check excludes
  if (EXCLUDE_PATTERNS.some(pattern => pattern.test(filePath))) {
    return false;
  }

  // Then check includes
  return INCLUDE_PATTERNS.some(pattern => pattern.test(filePath));
}

/**
 * Parse git status --porcelain output
 */
function parseGitStatus(output: string): {
  modifiedFiles: string[];
  untrackedFiles: string[];
  addedFiles: string[];
} {
  const modifiedFiles: string[] = [];
  const untrackedFiles: string[] = [];
  const addedFiles: string[] = [];

  const lines = output.trim().split('\n').filter(line => line);

  for (const line of lines) {
    if (line.length < 3) continue;

    const status = line.substring(0, 2);
    const filePath = line.substring(3).trim();

    // Skip files that don't match our patterns
    if (!shouldIncludeFile(filePath)) {
      continue;
    }

    // Parse status codes
    // First character is staged status, second is unstaged status
    if (status === '??') {
      untrackedFiles.push(filePath);
    } else if (status.startsWith('A')) {
      addedFiles.push(filePath);
    } else if (status.includes('M') || status.includes('D') || status.includes('R')) {
      modifiedFiles.push(filePath);
    }
  }

  return { modifiedFiles, untrackedFiles, addedFiles };
}

/**
 * Parse git log output
 */
function parseGitLog(output: string): {
  sha: string;
  message: string;
  timestamp: string;
} {
  const parts = output.trim().split('|');
  return {
    sha: parts[0] || '',
    message: parts[1] || '',
    timestamp: parts[2] || '',
  };
}

/**
 * Parse git rev-list output to check if branch is up to date
 */
function parseRevList(output: string): boolean {
  // Output format: "behind\tahead"
  // If both are 0, branch is up to date with origin
  const parts = output.trim().split('\t');
  const behind = parseInt(parts[0]) || 0;
  const ahead = parseInt(parts[1]) || 0;

  return behind === 0 && ahead === 0;
}

/**
 * GET /api/master-controller/git-status
 * Returns current git status with filtered file list
 */
export async function GET() {
  try {
    // Check if git is available
    try {
      await execAsync('git --version');
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Git not available',
          message: 'Git command not found on system',
        },
        { status: 500 }
      );
    }

    // Check if we're in a git repository
    try {
      await execAsync('git rev-parse --git-dir', {
        cwd: '/home/claude-flow',
      });
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not a git repository',
          message: 'Current directory is not a git repository',
        },
        { status: 500 }
      );
    }

    // Run git commands in parallel
    const [statusResult, branchResult, logResult, revListResult] = await Promise.allSettled([
      execAsync('git status --porcelain', { cwd: '/home/claude-flow' }),
      execAsync('git branch --show-current', { cwd: '/home/claude-flow' }),
      execAsync('git log -1 --format="%H|%s|%aI"', { cwd: '/home/claude-flow' }),
      execAsync('git rev-list --left-right --count origin/main...HEAD', { cwd: '/home/claude-flow' }),
    ]);

    // Parse git status
    let modifiedFiles: string[] = [];
    let untrackedFiles: string[] = [];
    let addedFiles: string[] = [];

    if (statusResult.status === 'fulfilled') {
      const parsed = parseGitStatus(statusResult.value.stdout);
      modifiedFiles = parsed.modifiedFiles;
      untrackedFiles = parsed.untrackedFiles;
      addedFiles = parsed.addedFiles;
    }

    // Parse branch name
    const branch = branchResult.status === 'fulfilled'
      ? branchResult.value.stdout.trim()
      : 'unknown';

    // Parse last commit
    let lastCommit = {
      sha: '',
      message: '',
      timestamp: '',
    };

    if (logResult.status === 'fulfilled') {
      lastCommit = parseGitLog(logResult.value.stdout);
    }

    // Parse rev-list to check if up to date
    let upToDate = false;
    if (revListResult.status === 'fulfilled') {
      upToDate = parseRevList(revListResult.value.stdout);
    } else {
      // If the command failed (e.g., no remote tracking), assume not up to date
      upToDate = false;
    }

    // Combine modified and added files (both are tracked changes)
    const allModifiedFiles = [...modifiedFiles, ...addedFiles];
    const hasChanges = allModifiedFiles.length > 0 || untrackedFiles.length > 0;

    return NextResponse.json({
      success: true,
      data: {
        hasChanges,
        modifiedFiles: allModifiedFiles,
        untrackedFiles,
        branch,
        lastCommit,
        upToDate,
      },
    });

  } catch (error: unknown) {
    console.error('[Git Status API] Error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get git status',
        details: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined,
      },
      { status: 500 }
    );
  }
}
