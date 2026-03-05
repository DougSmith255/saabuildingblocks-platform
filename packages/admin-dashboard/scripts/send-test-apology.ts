import { createClient } from '@supabase/supabase-js';
import { sendApologyActivationEmail } from '../lib/email/send';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

async function main() {
  const email = 'wilmeth.hudon@inboxorigin.com';
  const userId = 'eddcfc9c-0794-4a24-9931-41d1074c5d87';

  // Get user info
  const { data: user } = await supabase
    .from('users')
    .select('auth_user_id, full_name, first_name, status')
    .eq('id', userId)
    .single();

  if (!user) { console.error('User not found'); return; }
  console.log('User:', user.full_name, '- status:', user.status);

  // Delete old auth user if exists, then generate fresh token
  if (user.auth_user_id) {
    await supabase.auth.admin.deleteUser(user.auth_user_id);
    await supabase.from('users').update({ auth_user_id: null }).eq('id', userId);
    console.log('Old auth user cleaned up');
  }

  // Generate fresh invite
  const { data: linkData, error: linkErr } = await supabase.auth.admin.generateLink({
    type: 'invite',
    email,
    options: { redirectTo: 'https://smartagentalliance.com/agent-portal/activate' },
  });

  if (linkErr || !linkData?.properties?.hashed_token) {
    console.error('Link generation failed:', linkErr?.message);
    return;
  }

  const hashedToken = linkData.properties.hashed_token;
  console.log('Fresh token generated');

  // Link new auth user
  if (linkData.user?.id) {
    await supabase.from('users').update({ auth_user_id: linkData.user.id }).eq('id', userId);
  }

  // Update invitation
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  await supabase.from('user_invitations').update({
    token_hash: hashedToken,
    status: 'pending',
    expires_at: expiresAt,
    sent_at: new Date().toISOString(),
  }).eq('user_id', userId);

  // Send email
  const firstName = user.first_name || user.full_name?.split(' ')[0] || 'Agent';
  const result = await sendApologyActivationEmail(email, firstName, hashedToken, 168);
  console.log('Email:', result.success ? 'SENT' : 'FAILED: ' + result.error);
}

main().catch(console.error);
