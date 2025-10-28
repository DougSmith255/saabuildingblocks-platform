import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - exclude from static export
export const dynamic = 'error';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filePath = searchParams.get('path');

    if (!filePath) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      );
    }

    // Security: Ensure path is within project directory
    const projectRoot = process.cwd();
    const absolutePath = path.join(projectRoot, filePath);

    if (!absolutePath.startsWith(projectRoot)) {
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 403 }
      );
    }

    // Read file content
    const content = await fs.readFile(absolutePath, 'utf-8');

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
