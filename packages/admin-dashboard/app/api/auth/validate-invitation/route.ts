import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - exclude from static export
export const dynamic = 'force-dynamic';
import { createClient } from '@saa/shared/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { valid: false, reason: 'not_found' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Query user_invitations table
    const { data: invitation, error } = await supabase
      .from('user_invitations')
      .select('id, created_at, status, first_name')
      .eq('invitation_token', token)
      .single();

    if (error || !invitation) {
      return NextResponse.json(
        { valid: false, reason: 'not_found' },
        { status: 404 }
      );
    }

    // Check if already used
    if (invitation.status !== 'pending') {
      return NextResponse.json(
        { valid: false, reason: 'already_used' },
        { status: 400 }
      );
    }

    // Check if expired (24 hours)
    const createdAt = new Date(invitation.created_at);
    const now = new Date();
    const hoursSinceCreated = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    if (hoursSinceCreated >= 24) {
      return NextResponse.json(
        { valid: false, reason: 'expired' },
        { status: 400 }
      );
    }

    // Calculate expiration time
    const expiresAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);

    // Return valid response with firstName for greeting
    return NextResponse.json({
      valid: true,
      firstName: invitation.first_name,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error('Error validating invitation token:', error);
    return NextResponse.json(
      { valid: false, reason: 'not_found' },
      { status: 500 }
    );
  }
}
