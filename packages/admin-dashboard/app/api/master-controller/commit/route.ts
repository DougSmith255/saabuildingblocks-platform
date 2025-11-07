import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const execAsync = promisify(exec);

// Working directory for git operations
const WORKING_DIR = '/home/claude-flow';

// File patterns to stage - Comprehensive whitelist for component system workflow
const STAGE_PATTERNS = [
  // ===== COMPONENTS =====
  'packages/shared/components/saa/**',              // SAA component library (all files)

  // ===== PUBLIC SITE CODE =====
  'packages/public-site/app/**/*.tsx',              // App router pages & layouts
  'packages/public-site/app/**/*.ts',               // App router utilities/configs
  'packages/public-site/components/**/*.tsx',       // Shared components
  'packages/public-site/components/**/*.ts',        // Component utilities

  // ===== STYLES =====
  'packages/public-site/public/*.css',              // Global CSS
  'packages/public-site/app/**/*.css',              // CSS modules in app
  'packages/public-site/components/**/*.css',       // Component-specific CSS

  // ===== ASSETS =====
  'packages/public-site/public/**/*.svg',           // SVG icons/graphics
  'packages/public-site/public/**/*.png',           // PNG images
  'packages/public-site/public/**/*.jpg',           // JPG images
  'packages/public-site/public/**/*.jpeg',          // JPEG images
  'packages/public-site/public/**/*.webp',          // WebP images
  'packages/public-site/public/**/*.woff2',         // Custom fonts (woff2)
  'packages/public-site/public/**/*.woff',          // Custom fonts (woff)

  // ===== DATA & CONFIG =====
  'packages/admin-dashboard/data/saa-component-registry.ts', // Component registry
  'packages/public-site/data/**/*.ts',              // Public site data files
  'packages/public-site/data/**/*.json',            // JSON data files

  // ===== ADMIN DASHBOARD (Master Controller) =====
  'packages/admin-dashboard/app/api/master-controller/**', // Master Controller APIs
  'packages/admin-dashboard/app/master-controller/**',     // Master Controller UI

  // ===== ROOT CONFIG =====
  'ecosystem.config.js',                            // PM2 process config
];

// Patterns to NEVER stage (security)
const BLOCKED_PATTERNS = [
  '.npm/',
  '.pm2/',
  '.claude/',
  '.agent-memory/',
  '.env',
];

/**
 * POST /api/master-controller/commit
 * Performs git operations: stage specific patterns, commit, and push
 *
 * Security: Protected by middleware (HTTP Basic Auth)
 * Working directory: /home/claude-flow
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    console.log('[Git Commit] Starting...');
    console.log('[Git Commit] Working directory:', WORKING_DIR);

    // Step 1: Check for unpushed commits first
    const branch = await getCurrentBranch();
    console.log('[Git Commit] Checking for unpushed commits...');

    const { stdout: unpushedCommits } = await execAsync(`git log origin/${branch}..HEAD --oneline`, {
      cwd: WORKING_DIR,
    }).catch(() => ({ stdout: '' })); // Ignore error if branch doesn't exist on remote

    const hasUnpushedCommits = unpushedCommits.trim().length > 0;

    // Step 2: Check for uncommitted changes
    console.log('[Git Commit] Checking for uncommitted changes...');
    const { stdout: statusOutput } = await execAsync('git status --porcelain', {
      cwd: WORKING_DIR,
    });

    const hasUncommittedChanges = statusOutput.trim().length > 0;

    // If no uncommitted changes and no unpushed commits, nothing to do
    if (!hasUncommittedChanges && !hasUnpushedCommits) {
      console.log('[Git Commit] No changes to commit or push');
      return NextResponse.json({
        success: true,
        message: 'No changes to commit or push',
        data: {
          commitSha: '',
          filesChanged: [],
          timestamp: new Date().toISOString(),
          branch,
        },
      });
    }

    // If only unpushed commits (no new changes), skip to push
    if (!hasUncommittedChanges && hasUnpushedCommits) {
      console.log('[Git Commit] No new changes, but found unpushed commits. Pushing...');
      console.log('[Git Commit] Unpushed commits:', unpushedCommits.trim());

      // Get the latest commit SHA
      const { stdout: shaOutput } = await execAsync('git rev-parse HEAD', {
        cwd: WORKING_DIR,
      });
      const commitSha = shaOutput.trim();

      // Push to origin
      try {
        await execAsync(`git push origin ${branch}`, {
          cwd: WORKING_DIR,
          timeout: 30000,
        });
        console.log('[Git Commit] Successfully pushed existing commits');

        return NextResponse.json({
          success: true,
          message: 'Successfully pushed existing commits',
          data: {
            commitSha,
            filesChanged: [],
            timestamp: new Date().toISOString(),
            branch,
            unpushedCommits: unpushedCommits.trim().split('\n'),
          },
        });
      } catch (pushError) {
        console.error('[Git Commit] Push failed:', pushError);
        return NextResponse.json(
          {
            success: false,
            error: 'Push failed',
            message: 'Could not push existing commits to origin',
            details: pushError instanceof Error ? pushError.message : 'Unknown push error',
          },
          { status: 500 }
        );
      }
    }

    // Step 2: Stage specific patterns first
    // (Security check moved to after staging to only check files that would actually be committed)
    console.log('[Git Commit] Staging files...');
    const stagedFiles: string[] = [];

    for (const pattern of STAGE_PATTERNS) {
      try {
        const { stdout } = await execAsync(`git add ${pattern}`, {
          cwd: WORKING_DIR,
        });
        console.log(`[Git Commit] Staged pattern: ${pattern}`);
      } catch (error) {
        // Pattern might not match any files, that's okay
        console.log(`[Git Commit] No files matched pattern: ${pattern}`);
      }
    }

    // Step 4: Check what was actually staged
    const { stdout: diffOutput } = await execAsync('git diff --cached --name-only', {
      cwd: WORKING_DIR,
    });

    const actualStagedFiles = diffOutput
      .trim()
      .split('\n')
      .filter(f => f.length > 0);

    if (actualStagedFiles.length === 0) {
      console.log('[Git Commit] No files staged after filtering');
      return NextResponse.json({
        success: true,
        message: 'No changes to commit (no files matched patterns)',
        data: {
          commitSha: '',
          filesChanged: [],
          timestamp: new Date().toISOString(),
          branch: await getCurrentBranch(),
        },
      });
    }

    stagedFiles.push(...actualStagedFiles);
    console.log('[Git Commit] Staged files:', stagedFiles);

    // Step 3: Security check - verify no blocked files were staged
    const blockedStagedFiles = actualStagedFiles.filter(file =>
      BLOCKED_PATTERNS.some(pattern => file.includes(pattern))
    );

    if (blockedStagedFiles.length > 0) {
      console.error('[Git Commit] SECURITY VIOLATION: Blocked files were staged:', blockedStagedFiles);
      // Unstage everything
      await execAsync('git reset HEAD', { cwd: WORKING_DIR });
      return NextResponse.json(
        {
          success: false,
          error: 'Security violation',
          message: 'Blocked files detected in staged changes (e.g., .env, .npm/, .pm2/)',
          details: blockedStagedFiles,
        },
        { status: 403 }
      );
    }

    // Step 4: Create commit
    const timestamp = new Date().toISOString();
    const commitMessage = `Update Master Controller components and pages

Generated: ${timestamp}
Triggered by: Master Controller Deploy UI`;

    console.log('[Git Commit] Creating commit...');
    await execAsync(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`, {
      cwd: WORKING_DIR,
    });

    // Step 5: Get commit SHA
    const { stdout: shaOutput } = await execAsync('git rev-parse HEAD', {
      cwd: WORKING_DIR,
    });
    const commitSha = shaOutput.trim();
    console.log('[Git Commit] Commit SHA:', commitSha);
    console.log('[Git Commit] Current branch:', branch);

    // Step 6: Push to origin
    console.log('[Git Commit] Pushing to origin...');
    try {
      await execAsync(`git push origin ${branch}`, {
        cwd: WORKING_DIR,
        timeout: 30000, // 30 second timeout
      });
      console.log('[Git Commit] Push successful');
    } catch (pushError) {
      console.error('[Git Commit] Push failed:', pushError);
      // Return commit info but note push failure
      return NextResponse.json(
        {
          success: false,
          error: 'Commit created but push failed',
          message: 'Changes were committed locally but could not be pushed to origin',
          data: {
            commitSha,
            filesChanged: stagedFiles,
            timestamp,
            branch,
          },
          details: pushError instanceof Error ? pushError.message : 'Unknown push error',
        },
        { status: 500 }
      );
    }

    const duration = Date.now() - startTime;

    console.log('[Git Commit] Success:', {
      duration: `${duration}ms`,
      commitSha,
      filesChanged: stagedFiles.length,
      timestamp,
    });

    return NextResponse.json({
      success: true,
      message: `Successfully committed and pushed ${stagedFiles.length} file(s)`,
      data: {
        commitSha,
        filesChanged: stagedFiles,
        timestamp,
        branch,
      },
    });

  } catch (error: unknown) {
    const duration = Date.now() - startTime;

    console.error('[Git Commit] Error:', error);

    // Type guard for Error objects
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to commit changes',
        message: errorMessage,
        duration: `${duration}ms`,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/master-controller/commit
 * Check what would be committed without making changes
 */
export async function GET() {
  try {
    console.log('[Git Commit Status] Checking status...');

    // Get current branch
    const branch = await getCurrentBranch();

    // Check for changes
    const { stdout: statusOutput } = await execAsync('git status --porcelain', {
      cwd: WORKING_DIR,
    });

    if (!statusOutput.trim()) {
      return NextResponse.json({
        success: true,
        data: {
          hasChanges: false,
          branch,
          filesChanged: [],
          matchingFiles: [],
          message: 'No changes detected',
        },
      });
    }

    // Get all changed files
    const changedFiles = statusOutput
      .trim()
      .split('\n')
      .map(line => {
        const status = line.substring(0, 2);
        const file = line.substring(3).trim();
        return { status, file };
      });

    // Filter files that match our patterns
    const matchingFiles = changedFiles.filter(({ file }) =>
      STAGE_PATTERNS.some(pattern => {
        // Convert glob pattern to regex for matching
        const regexPattern = pattern
          .replace(/\*\*/g, '.*')
          .replace(/\*/g, '[^/]*')
          .replace(/\//g, '\\/');
        const regex = new RegExp(`^${regexPattern}$`);
        return regex.test(file);
      })
    );

    // Check for blocked files
    const blockedFiles = changedFiles.filter(({ file }) =>
      BLOCKED_PATTERNS.some(pattern => file.includes(pattern))
    );

    return NextResponse.json({
      success: true,
      data: {
        hasChanges: true,
        branch,
        filesChanged: changedFiles.map(f => f.file),
        matchingFiles: matchingFiles.map(f => f.file),
        blockedFiles: blockedFiles.map(f => f.file),
        totalChanges: changedFiles.length,
        willCommit: matchingFiles.length,
        patterns: STAGE_PATTERNS,
        message: `${matchingFiles.length} file(s) would be committed`,
      },
    });

  } catch (error) {
    console.error('[Git Commit Status] Error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get commit status',
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}

/**
 * Helper function to get current git branch
 */
async function getCurrentBranch(): Promise<string> {
  try {
    const { stdout } = await execAsync('git rev-parse --abbrev-ref HEAD', {
      cwd: WORKING_DIR,
    });
    return stdout.trim();
  } catch (error) {
    console.error('[Git] Failed to get current branch:', error);
    return 'unknown';
  }
}
