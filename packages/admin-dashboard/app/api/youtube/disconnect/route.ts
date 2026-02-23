import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getTokens, deleteTokens, revokeToken } from '@/lib/youtube/client';
import { decrypt } from '@/lib/youtube/encryption';
import { clearAllCache } from '@/lib/youtube/cache';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get stored tokens
    const tokens = await getTokens(user.id);
    if (tokens) {
      // Revoke the token with Google (best-effort)
      try {
        const accessToken = decrypt(tokens.encrypted_access_token);
        await revokeToken(accessToken);
      } catch {
        // Continue even if revocation fails
      }

      // Delete from Supabase
      await deleteTokens(user.id);
    }

    // Clear all YouTube cache
    clearAllCache();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[YouTube Disconnect] Error:', error);
    return NextResponse.json({ error: 'Failed to disconnect' }, { status: 500 });
  }
}
