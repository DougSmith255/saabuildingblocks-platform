import { NextRequest, NextResponse } from 'next/server';
import { verifySessionAdminAuth } from '@/app/api/middleware/adminAuth';

// Force dynamic rendering - exclude from static export
export const dynamic = 'force-dynamic';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    // Auth: admin only — this endpoint writes arbitrary files
    const auth = await verifySessionAdminAuth();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 401 });
    }

    const body = await request.json();
    const { path: filePath, content } = body;

    if (!filePath || content === undefined) {
      return NextResponse.json(
        { error: 'File path and content are required' },
        { status: 400 }
      );
    }

    // Block path traversal sequences before any resolution
    if (filePath.includes('..') || filePath.includes('\0')) {
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 403 }
      );
    }

    // Security: Ensure path is within monorepo (same logic as read route)
    const projectRoot = process.cwd();
    const absolutePath = path.resolve(projectRoot, filePath);

    // Allow access to files within the monorepo (parent directory of packages)
    const monorepoRoot = path.resolve(projectRoot, '..');

    if (!absolutePath.startsWith(monorepoRoot)) {
      return NextResponse.json(
        { error: 'Invalid file path - must be within monorepo' },
        { status: 403 }
      );
    }

    // Block sensitive files
    const basename = path.basename(absolutePath);
    if (basename.startsWith('.env') || basename === 'ecosystem.config.js') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Only allow writing within existing directories (no recursive mkdir)
    const directory = path.dirname(absolutePath);
    try {
      const dirStat = await fs.stat(directory);
      if (!dirStat.isDirectory()) {
        return NextResponse.json(
          { error: 'Parent directory does not exist' },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: 'Parent directory does not exist' },
        { status: 400 }
      );
    }

    // Resolve symlinks on the directory and verify real path is still within monorepo
    const realDir = await fs.realpath(directory);
    const realMonorepoRoot = await fs.realpath(monorepoRoot);
    if (!realDir.startsWith(realMonorepoRoot)) {
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 403 }
      );
    }

    // Write file content using the real resolved path
    const realFilePath = path.join(realDir, basename);
    await fs.writeFile(realFilePath, content, 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'File saved successfully',
      path: filePath,
    });
  } catch (error) {
    console.error('Failed to write component file:', error);
    return NextResponse.json(
      {
        error: 'Failed to write file',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
