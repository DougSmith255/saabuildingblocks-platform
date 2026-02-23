import { NextRequest, NextResponse } from 'next/server';
import { verifySessionAdminAuth } from '@/app/api/middleware/adminAuth';

// Force dynamic rendering - exclude from static export
export const dynamic = 'force-dynamic';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Auth: admin only — this endpoint reads arbitrary files
    const auth = await verifySessionAdminAuth();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const filePath = searchParams.get('path');

    if (!filePath) {
      return NextResponse.json(
        { error: 'File path is required' },
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

    // Security: Ensure path is within monorepo
    const projectRoot = process.cwd();
    const absolutePath = path.resolve(projectRoot, filePath);

    // Allow access to files within the monorepo (parent directory of packages)
    const monorepoRoot = path.resolve(projectRoot, '..');

    if (!absolutePath.startsWith(monorepoRoot)) {
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 403 }
      );
    }

    // Resolve symlinks and verify real path is still within monorepo
    const realPath = await fs.realpath(absolutePath);
    const realMonorepoRoot = await fs.realpath(monorepoRoot);
    if (!realPath.startsWith(realMonorepoRoot)) {
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 403 }
      );
    }

    // Block sensitive files
    const basename = path.basename(realPath);
    if (basename.startsWith('.env') || basename === 'ecosystem.config.js') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Read file content
    const content = await fs.readFile(realPath, 'utf-8');

    return NextResponse.json({
      success: true,
      content,
      path: filePath,
    });
  } catch (error) {
    console.error('Failed to read component file:', error);
    return NextResponse.json(
      {
        error: 'Failed to read file',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
