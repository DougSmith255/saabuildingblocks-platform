/**
 * Portal Magic Link API
 *
 * GET /api/auth/portal-link?token={token}
 *
 * One-time magic link that auto-signs the agent into their portal.
 * Token is generated when a booking referral is created and included in the notification email.
 * On success, redirects to the agent portal login page with #auth= for auto-login.
 */

import { NextRequest } from 'next/server';
import { createHash } from 'crypto';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';
import { generateAccessToken } from '@/lib/auth/jwt';

export const dynamic = 'force-dynamic';

function errorPage(title: string, message: string): Response {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} - Smart Agent Alliance</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0a0a0a; color: #e5e4dd; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 2rem; }
    .card { max-width: 420px; width: 100%; background: #1a1a1a; border: 1px solid rgba(255,68,68,0.2); border-radius: 16px; padding: 2.5rem 2rem; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
    h1 { font-size: 1.3rem; color: #ff4444; margin-bottom: 1rem; }
    p { color: #bfbdb0; line-height: 1.6; margin-bottom: 1.5rem; font-size: 14px; }
    a { color: #ffd700; text-decoration: none; padding: 0.6rem 1.5rem; border: 1px solid #ffd70033; border-radius: 8px; display: inline-block; transition: all 0.2s; }
    a:hover { background: #ffd70015; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${title}</h1>
    <p>${message}</p>
    <a href="https://smartagentalliance.com/agent-portal">Go to Agent Portal</a>
  </div>
</body>
</html>`;
  return new Response(html, {
    status: 400,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const redirect = searchParams.get('redirect') || '/agent-portal?section=agent-page';

  if (!token) {
    return errorPage('Invalid Link', 'This link is missing required parameters.');
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return errorPage('Service Unavailable', 'Please try again later.');
  }

  // Hash the token and look up the referral
  const hashedToken = createHash('sha256').update(token).digest('hex');

  const { data: referral, error } = await supabase
    .from('booking_referrals')
    .select('id, agent_user_id, agent_email, rsvp_token')
    .eq('rsvp_token', hashedToken)
    .single();

  if (error || !referral) {
    return errorPage(
      'Link Expired',
      'This link is no longer valid. You can still log in to your Agent Portal manually.'
    );
  }

  // Mark token as used (one-time) by clearing it
  await supabase
    .from('booking_referrals')
    .update({ rsvp_token: 'used' })
    .eq('id', referral.id);

  // Look up the user to generate a proper JWT
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, email, username, full_name, role, profile_picture_url, gender, is_leader, state, status')
    .eq('id', referral.agent_user_id)
    .single();

  if (userError || !user) {
    return errorPage('Account Not Found', 'Your account could not be found. Please log in manually.');
  }

  if (user.status !== 'active') {
    return errorPage('Account Inactive', 'Your account is not active. Please contact support.');
  }

  // Generate a JWT access token for this user
  const accessToken = await generateAccessToken({
    userId: user.id,
    username: user.username || user.email,
    email: user.email,
    role: user.role || 'agent',
    permissions: [],
  });

  // Build the auth payload (same format the login page #auth= handler expects)
  const authPayload = Buffer.from(JSON.stringify({
    access_token: accessToken,
    user: {
      id: user.id,
      email: user.email,
      username: user.username || user.email,
      first_name: user.full_name?.split(' ')[0] || '',
      last_name: user.full_name?.split(' ').slice(1).join(' ') || '',
      fullName: user.full_name || '',
      full_name: user.full_name || '',
      role: user.role || 'agent',
      profile_picture_url: user.profile_picture_url || null,
      gender: user.gender || 'male',
      is_leader: user.is_leader || false,
      state: user.state || null,
    },
  })).toString('base64');

  // Redirect to login page with #auth= payload and redirect param
  // The login page will auto-login and then redirect to the agent portal
  const loginUrl = `https://smartagentalliance.com/agent-portal/login?redirect=${encodeURIComponent(redirect)}#auth=${authPayload}`;

  return new Response(null, {
    status: 302,
    headers: { 'Location': loginUrl },
  });
}
