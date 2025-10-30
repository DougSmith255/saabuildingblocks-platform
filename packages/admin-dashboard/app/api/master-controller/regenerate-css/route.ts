import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { stat } from 'fs/promises';
import { join } from 'path';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const execAsync = promisify(exec);

/**
 * POST /api/master-controller/regenerate-css
 * Triggers CSS regeneration from Master Controller settings
 *
 * Security: Protected by middleware (HTTP Basic Auth)
 * Rate limiting: Handled by client (debouncing)
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    console.log('[CSS Regeneration] Starting...');

    // Path to public-site package
    const publicSitePath = join(process.cwd(), '..', 'public-site');
    const cssOutputPath = join(publicSitePath, 'public', 'static-master-controller.css');

    // Execute npm run generate:css in public-site package
    console.log('[CSS Regeneration] Running: npm run generate:css');
    console.log('[CSS Regeneration] Working directory:', publicSitePath);

    const { stdout, stderr } = await execAsync('npm run generate:css', {
      cwd: publicSitePath,
      env: {
        ...process.env,
        // Ensure Supabase credentials are available
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
      timeout: 30000, // 30 second timeout
    });

    if (stderr && !stderr.includes('deprecated')) {
      console.warn('[CSS Regeneration] stderr:', stderr);
    }

    console.log('[CSS Regeneration] stdout:', stdout);

    // Get file stats
    const stats = await stat(cssOutputPath);
    const fileSizeKB = Math.round(stats.size / 1024);
    const duration = Date.now() - startTime;

    // Parse output to determine source (database vs defaults)
    const usedDefaults = stdout.includes('Using default') || stdout.includes('No settings found');
    const source = usedDefaults ? 'defaults' : 'database';

    console.log('[CSS Regeneration] Success:', {
      duration: `${duration}ms`,
      fileSize: `${fileSizeKB}KB`,
      source,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'CSS regenerated successfully',
      data: {
        filePath: '/static-master-controller.css',
        fileSize: `${fileSizeKB}KB`,
        fileSizeBytes: stats.size,
        source,
        timestamp: stats.mtime.toISOString(),
        duration: `${duration}ms`,
        generatedAt: new Date().toISOString(),
      },
    });

  } catch (error: unknown) {
    const duration = Date.now() - startTime;

    console.error('[CSS Regeneration] Error:', error);

    // Type guard for Error objects
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to regenerate CSS',
        details: errorMessage,
        duration: `${duration}ms`,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/master-controller/regenerate-css
 * Get status of current CSS file
 */
export async function GET() {
  try {
    const publicSitePath = join(process.cwd(), '..', 'public-site');
    const cssOutputPath = join(publicSitePath, 'public', 'static-master-controller.css');

    try {
      const stats = await stat(cssOutputPath);
      const fileSizeKB = Math.round(stats.size / 1024);

      return NextResponse.json({
        success: true,
        data: {
          exists: true,
          filePath: '/static-master-controller.css',
          fileSize: `${fileSizeKB}KB`,
          fileSizeBytes: stats.size,
          lastModified: stats.mtime.toISOString(),
          age: Date.now() - stats.mtime.getTime(),
        },
      });
    } catch (statError) {
      // File doesn't exist
      return NextResponse.json({
        success: true,
        data: {
          exists: false,
          filePath: '/static-master-controller.css',
          message: 'CSS file not yet generated',
        },
      });
    }

  } catch (error) {
    console.error('[CSS Status] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get CSS status',
      },
      { status: 500 }
    );
  }
}
