import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - exclude from static export
export const dynamic = 'force-dynamic';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path: filePath, content } = body;

    if (!filePath || content === undefined) {
      return NextResponse.json(
        { error: 'File path and content are required' },
        { status: 400 }
      );
    }

    // Security: Ensure path is within monorepo (same logic as read route)
    const projectRoot = process.cwd();
    const absolutePath = path.resolve(projectRoot, filePath);

    // Allow access to files within the monorepo (parent directory of packages)
    const monorepoRoot = path.resolve(projectRoot, '..');

    if (!absolutePath.startsWith(monorepoRoot)) {
      console.error('Invalid file path attempted:', {
        filePath,
        absolutePath,
        projectRoot,
        monorepoRoot
      });
      return NextResponse.json(
        { error: 'Invalid file path - must be within monorepo' },
        { status: 403 }
      );
    }

    // Ensure directory exists
    const directory = path.dirname(absolutePath);
    await fs.mkdir(directory, { recursive: true });

    // Write file content
    await fs.writeFile(absolutePath, content, 'utf-8');

    console.log('Successfully wrote file:', {
      path: filePath,
      absolutePath,
      size: content.length
    });

    return NextResponse.json({
      success: true,
      message: 'File saved successfully',
      path: filePath,
      absolutePath: absolutePath,
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
