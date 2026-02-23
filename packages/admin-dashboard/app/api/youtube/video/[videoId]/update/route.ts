import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthenticatedClients } from '@/lib/youtube/client';
import { invalidateCache } from '@/lib/youtube/cache';

export const dynamic = 'force-dynamic';

export async function PATCH(
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

    const body = await request.json();
    const { title, description, tags, categoryId } = body;

    if (!title || typeof title !== 'string') {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (title.length > 100) {
      return NextResponse.json({ error: 'Title must be 100 characters or fewer' }, { status: 400 });
    }

    if (description && description.length > 5000) {
      return NextResponse.json({ error: 'Description must be 5000 characters or fewer' }, { status: 400 });
    }

    const clients = await getAuthenticatedClients(user.id);
    if (!clients) {
      return NextResponse.json({ error: 'Not connected' }, { status: 401 });
    }

    // First, get the current video to preserve fields we're not updating
    const currentVideo = await clients.youtube.videos.list({
      part: ['snippet'],
      id: [videoId],
    });

    const snippet = currentVideo.data.items?.[0]?.snippet;
    if (!snippet) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    // Update the video
    await clients.youtube.videos.update({
      part: ['snippet'],
      requestBody: {
        id: videoId,
        snippet: {
          title: title.trim(),
          description: description !== undefined ? description.trim() : snippet.description,
          tags: tags !== undefined ? (Array.isArray(tags) ? tags : tags.split(',').map((t: string) => t.trim()).filter(Boolean)) : snippet.tags,
          categoryId: categoryId || snippet.categoryId,
        },
      },
    });

    // Invalidate caches
    invalidateCache(`videos:${user.id}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[YouTube Update Video] Error:', error);
    return NextResponse.json({ error: 'Failed to update video' }, { status: 500 });
  }
}
