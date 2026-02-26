// Force dynamic rendering - exclude from static export
export const dynamic = 'force-dynamic';

/**
 * Background Removal API Route
 * POST /api/images/remove-background
 *
 * Proxies image to local rembg Docker service (127.0.0.1:7000)
 * for server-side background removal. Returns transparent PNG.
 *
 * Accepts: multipart/form-data with 'file' field
 * Returns: image/png with transparent background
 */

import { NextRequest, NextResponse } from 'next/server';

const REMBG_URL = 'http://127.0.0.1:7000/api/remove';
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://saabuildingblocks.com',
  'https://www.saabuildingblocks.com',
  'https://smartagentalliance.com',
  'https://www.smartagentalliance.com',
  'https://saabuildingblocks.pages.dev',
];

function getCorsHeaders(origin?: string | null): Record<string, string> {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Vary': 'Origin',
  };
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(request.headers.get('origin')) });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400, headers: corsHeaders }
      );
    }

    // Forward to rembg service
    const rembgForm = new FormData();
    rembgForm.append('file', file);

    const rembgResponse = await fetch(REMBG_URL, {
      method: 'POST',
      body: rembgForm,
    });

    if (!rembgResponse.ok) {
      console.error('[BgRemoval] rembg service error:', rembgResponse.status);
      return NextResponse.json(
        { error: 'Background removal service error' },
        { status: 502, headers: corsHeaders }
      );
    }

    const resultBuffer = await rembgResponse.arrayBuffer();

    return new NextResponse(resultBuffer, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'image/png',
        'Content-Length': String(resultBuffer.byteLength),
      },
    });
  } catch (error) {
    console.error('[BgRemoval] Error:', error);
    return NextResponse.json(
      { error: 'Background removal failed' },
      { status: 500, headers: corsHeaders }
    );
  }
}
