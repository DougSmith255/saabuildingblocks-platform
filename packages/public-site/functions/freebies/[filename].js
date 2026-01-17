/**
 * Serve freebie files from R2 bucket
 *
 * GET /freebies/[filename]
 * Returns the file from R2 with appropriate headers for download
 */

// MIME types for different file extensions
const MIME_TYPES = {
  pdf: 'application/pdf',
  zip: 'application/zip',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
};

export async function onRequestGet(context) {
  const { params, env } = context;
  const filename = params.filename;

  // Security: Only allow specific filenames
  const allowedFiles = [
    'this-or-that-posts.zip',
    'brokerage-interview-questions.pdf',
    'buyer-checklist.pdf',
    'listing-checklist.pdf',
    'home-tour-notes.pdf',
    'all-freebies-bundle.zip',
  ];

  if (!allowedFiles.includes(filename)) {
    return new Response('File not found', { status: 404 });
  }

  try {
    // Get file from R2
    const object = await env.ASSETS_BUCKET.get(`freebies/${filename}`);

    if (!object) {
      return new Response('File not found', { status: 404 });
    }

    // Determine content type
    const extension = filename.split('.').pop()?.toLowerCase() || '';
    const contentType = MIME_TYPES[extension] || 'application/octet-stream';

    // Set headers for download
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    headers.set('Cache-Control', 'public, max-age=86400'); // Cache for 1 day

    // CORS headers
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');

    return new Response(object.body, { headers });
  } catch (error) {
    console.error('Error serving freebie file:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

/**
 * Handle OPTIONS request for CORS preflight
 */
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}
