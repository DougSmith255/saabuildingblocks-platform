import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifySessionAdminAuth } from '@/app/api/middleware/adminAuth';

export const dynamic = 'force-dynamic';

const CLOUDFLARE_HASH = 'RZBQ4dWu2c_YEpklnDDxFg';
const WP_API = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://wp.saabuildingblocks.com/wp-json/wp/v2';
const WP_USER = process.env.WORDPRESS_USER || '';
const WP_PASS = process.env.WORDPRESS_APP_PASSWORD || '';

function wpAuthHeader(): string {
  return 'Basic ' + Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64');
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

// --- WordPress placement helpers ---

function buildImgHtml(cloudflareId: string, altText: string): string {
  return `<figure class="wp-block-image size-full infographic-image"><img src="https://imagedelivery.net/${CLOUDFLARE_HASH}/${cloudflareId}/desktop" srcset="https://imagedelivery.net/${CLOUDFLARE_HASH}/${cloudflareId}/mobile 640w, https://imagedelivery.net/${CLOUDFLARE_HASH}/${cloudflareId}/tablet 1024w, https://imagedelivery.net/${CLOUDFLARE_HASH}/${cloudflareId}/desktop 2000w" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px" alt="${altText}" loading="lazy" decoding="async" width="1600" height="auto" /></figure>`;
}

function findTopInsertionPoint(content: string): number {
  // After end of TOC block
  const tocEnd = content.indexOf('<!-- /wp:rank-math/toc-block -->');
  if (tocEnd !== -1) {
    const afterToc = tocEnd + '<!-- /wp:rank-math/toc-block -->'.length;
    const nextParaEnd = content.indexOf('<!-- /wp:paragraph -->', afterToc);
    if (nextParaEnd !== -1) return nextParaEnd + '<!-- /wp:paragraph -->'.length;
    return afterToc;
  }

  // Before first content H2
  const h2Regex = /<h2[^>]*>(.*?)<\/h2>/gi;
  let match;
  while ((match = h2Regex.exec(content)) !== null) {
    const text = match[1].replace(/<[^>]+>/g, '').toLowerCase().trim();
    if (!text.includes('key takeaway') && !text.includes('key point') &&
        !text.includes('index') && !text.includes('table of contents')) {
      const preceding = content.substring(0, match.index);
      const wpH = preceding.lastIndexOf('<!-- wp:heading');
      if (wpH !== -1 && match.index - wpH < 200) return wpH;
      return match.index;
    }
  }

  // After second paragraph
  let searchPos = 0;
  const paraEnds: number[] = [];
  while (true) {
    const pos = content.indexOf('</p>', searchPos);
    if (pos === -1) break;
    paraEnds.push(pos + 4);
    searchPos = pos + 4;
  }
  if (paraEnds.length >= 2) return paraEnds[1];
  return 0;
}

async function getPostContent(postId: string): Promise<{ content: string; ok: boolean }> {
  const res = await fetch(`${WP_API}/posts/${postId}?context=edit`, {
    headers: { Authorization: wpAuthHeader() },
  });
  if (!res.ok) return { content: '', ok: false };
  const post = await res.json();
  return { content: post.content?.raw || '', ok: true };
}

async function updatePostContent(postId: string, content: string): Promise<boolean> {
  const res = await fetch(`${WP_API}/posts/${postId}`, {
    method: 'POST',
    headers: {
      Authorization: wpAuthHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });
  return res.ok;
}

async function placeInfographic(postId: string, cloudflareId: string, title: string, blogTitle: string): Promise<{ success: boolean; error?: string }> {
  const { content, ok } = await getPostContent(postId);
  if (!ok) return { success: false, error: 'Failed to fetch post from WordPress' };

  // Check if already placed
  if (content.includes(cloudflareId) || content.includes('infographic-image')) {
    return { success: true }; // Already there
  }

  const altText = `Infographic: ${title} - ${blogTitle}`;
  const imgHtml = buildImgHtml(cloudflareId, altText);
  const insertPos = findTopInsertionPoint(content);
  const newContent = content.substring(0, insertPos) + '\n' + imgHtml + '\n' + content.substring(insertPos);

  const updated = await updatePostContent(postId, newContent);
  if (!updated) return { success: false, error: 'Failed to update post in WordPress' };
  return { success: true };
}

async function removeInfographic(postId: string): Promise<{ success: boolean; error?: string }> {
  const { content, ok } = await getPostContent(postId);
  if (!ok) return { success: false, error: 'Failed to fetch post from WordPress' };

  if (!content.includes('infographic-image')) {
    return { success: true }; // Nothing to remove
  }

  const cleaned = content.replace(
    /\s*<figure class="wp-block-image size-full infographic-image">.*?<\/figure>\s*/gs,
    '\n\n'
  );

  const updated = await updatePostContent(postId, cleaned);
  if (!updated) return { success: false, error: 'Failed to update post in WordPress' };
  return { success: true };
}

/**
 * GET /api/master-controller/infographics
 * Returns all approval records
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await verifySessionAdminAuth();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 401 });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('infographic_approvals')
      .select('*');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ approvals: data || [] });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/master-controller/infographics
 * Toggle approval for an infographic. Auto-places/removes from WordPress.
 * Body: { id, approved, blogPostId, cloudflareId, title, blogPostTitle }
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await verifySessionAdminAuth();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 401 });
    }

    const body = await request.json();
    const { id, approved, blogPostId, cloudflareId, title, blogPostTitle } = body;

    if (!id || typeof approved !== 'boolean') {
      return NextResponse.json({ error: 'Missing required fields: id, approved' }, { status: 400 });
    }

    // Update Supabase
    const supabase = getSupabase();
    const { error: dbError } = await supabase
      .from('infographic_approvals')
      .upsert({
        id,
        approved,
        approved_at: approved ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      });

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // Auto-place or remove from WordPress
    let wpResult: { success: boolean; error?: string } = { success: true };
    if (blogPostId && cloudflareId) {
      if (approved) {
        wpResult = await placeInfographic(blogPostId, cloudflareId, title || id, blogPostTitle || '');
      } else {
        wpResult = await removeInfographic(blogPostId);
      }
    }

    return NextResponse.json({
      id,
      approved,
      wpPlacement: wpResult.success ? 'ok' : 'failed',
      wpError: wpResult.error,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
