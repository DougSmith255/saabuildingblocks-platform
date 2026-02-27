// Force dynamic rendering - exclude from static export
export const dynamic = 'force-dynamic';

/**
 * One-Time Activation Email Blast
 * POST /api/notifications/blast
 *
 * Sends AgentActivationEmail to all invited users who haven't activated yet.
 * Generates fresh activation tokens for each user.
 *
 * Query params:
 *   ?dry_run=true  — preview who would receive emails without sending
 *   ?exclude=Name  — exclude a specific user by first name + last name
 *
 * Authentication: requires AUTOMATION_SECRET header
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'crypto';
import { sendAgentActivationEmail } from '@/lib/email/send';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function verifyAuth(request: NextRequest): boolean {
  const secret = request.headers.get('x-automation-secret');
  return !!(secret && secret === process.env.AUTOMATION_SECRET);
}

export async function POST(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const dryRun = request.nextUrl.searchParams.get('dry_run') === 'true';
  const excludeName = request.nextUrl.searchParams.get('exclude') || '';

  const supabase = getSupabase();

  // Get all invited (unactivated) users
  const { data: invitedUsers, error } = await supabase
    .from('users')
    .select('id, email, first_name, last_name, status, created_at, state')
    .eq('status', 'invited');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!invitedUsers?.length) {
    return NextResponse.json({ message: 'No invited users found', sent: 0 });
  }

  // Filter out excluded user
  const usersToEmail = invitedUsers.filter(u => {
    if (excludeName) {
      const fullName = `${u.first_name} ${u.last_name}`.toLowerCase();
      return !fullName.includes(excludeName.toLowerCase());
    }
    return true;
  });

  const results: Array<{
    name: string;
    email: string;
    status: string;
    messageId?: string;
    error?: string;
  }> = [];

  if (dryRun) {
    for (const user of usersToEmail) {
      results.push({
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        status: 'dry_run',
      });
    }

    return NextResponse.json({
      mode: 'dry_run',
      count: usersToEmail.length,
      excluded: invitedUsers.length - usersToEmail.length,
      results,
    });
  }

  // Live send
  for (const user of usersToEmail) {
    try {
      // Generate fresh activation token
      const newToken = randomBytes(32).toString('hex');
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 48);

      // Update existing invitation or create new one
      const { data: existingInvite } = await supabase
        .from('user_invitations')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .limit(1)
        .single();

      if (existingInvite) {
        await supabase.from('user_invitations')
          .update({ token: newToken, expires_at: expiresAt.toISOString() })
          .eq('id', existingInvite.id);
      } else {
        await supabase.from('user_invitations').insert({
          user_id: user.id,
          email: user.email,
          token: newToken,
          status: 'pending',
          expires_at: expiresAt.toISOString(),
        });
      }

      // Send the activation email
      const emailResult = await sendAgentActivationEmail(
        user.email,
        user.first_name || 'there',
        newToken,
        48
      );

      // Log to notification_log
      await supabase.from('notification_log').insert({
        user_id: user.id,
        user_email: user.email,
        notification_type: 'activation_blast',
        channel: 'email',
        status: emailResult.success ? 'sent' : 'failed',
        email_message_id: emailResult.messageId || null,
        email_error: emailResult.error || null,
        trigger_reason: 'One-time activation blast for existing agents',
        metadata: { token_expires_at: expiresAt.toISOString() },
      });

      results.push({
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        status: emailResult.success ? 'sent' : 'failed',
        messageId: emailResult.messageId,
        error: emailResult.error,
      });

      // Small delay between sends to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      results.push({
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        status: 'error',
        error: errorMsg,
      });
    }
  }

  const sent = results.filter(r => r.status === 'sent').length;
  const failed = results.filter(r => r.status !== 'sent').length;

  return NextResponse.json({
    mode: 'live',
    total: usersToEmail.length,
    sent,
    failed,
    excluded: invitedUsers.length - usersToEmail.length,
    timestamp: new Date().toISOString(),
    results,
  });
}
