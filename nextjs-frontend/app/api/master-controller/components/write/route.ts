import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - exclude from static export
export const dynamic = 'error';
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

    // Security: Ensure path is within project directory
    const projectRoot = process.cwd();

    // Normalize path by removing leading slash if present
    const normalizedPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
    const absolutePath = path.join(projectRoot, normalizedPath);

    // Validate path is within project directory
    const resolvedPath = path.resolve(absolutePath);
    if (!resolvedPath.startsWith(projectRoot)) {
      console.error('Invalid file path attempted:', {
        filePath,
        normalizedPath,
        absolutePath,
        resolvedPath,
        projectRoot
      });
      return NextResponse.json(
        { error: 'Invalid file path - must be within project directory' },
        { status: 403 }
      );
    }

    // Ensure directory exists
    const directory = path.dirname(absolutePath);
    await fs.mkdir(directory, { recursive: true });

    // Write file content
    await fs.writeFile(absolutePath, content, 'utf-8');

    console.log('Successfully wrote file:', {
      originalPath: filePath,
      normalizedPath,
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
