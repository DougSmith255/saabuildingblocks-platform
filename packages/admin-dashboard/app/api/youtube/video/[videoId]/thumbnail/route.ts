import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthenticatedClients } from '@/lib/youtube/client';
import { invalidateCache } from '@/lib/youtube/cache';
import { Readable } from 'stream';

export const dynamic = 'force-dynamic';

const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const { videoId } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('thumbnail');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No thumbnail file provided' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Use JPEG, PNG, or WebP' }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large. Maximum size is 2MB' }, { status: 400 });
    }

    const clients = await getAuthenticatedClients(user.id);
    if (!clients) {
      return NextResponse.json({ error: 'Not connected' }, { status: 401 });
    }

    // Convert File to Buffer then to Readable stream for googleapis
    const buffer = Buffer.from(await file.arrayBuffer());
    const stream = Readable.from(buffer);

    await clients.youtube.thumbnails.set({
      videoId,
      media: {
        mimeType: file.type,
        body: stream,
      },
    });

    // Invalidate caches
    invalidateCache(`videos:${user.id}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[YouTube Thumbnail Upload] Error:', error);
    return NextResponse.json({ error: 'Failed to upload thumbnail' }, { status: 500 });
  }
}
