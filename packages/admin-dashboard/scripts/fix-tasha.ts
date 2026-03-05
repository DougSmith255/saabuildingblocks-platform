import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function fixTasha() {
  const email = 'tasha@tashalocks.com';
  const userId = '2ec2541a-fa07-4869-9f08-36cd9fa763de';
  const authUserId = 'ce35d80f-a34c-4e0a-98c9-1ebca78fbe25';

  // 1. Delete existing auth user
  console.log('Deleting Tasha auth user...');
  const { error: deleteErr } = await supabase.auth.admin.deleteUser(authUserId);
  if (deleteErr) { console.error('Delete failed:', deleteErr.message); return; }
  console.log('Auth user deleted');

  // Clear auth_user_id
  await supabase.from('users').update({ auth_user_id: null }).eq('id', userId);

  // 2. Generate fresh invite
  console.log('Generating fresh invite...');
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
  console.log('Token generated:', hashedToken.substring(0, 12) + '...');

  // Link new auth user
  if (linkData.user?.id) {
    await supabase.from('users').update({ auth_user_id: linkData.user.id }).eq('id', userId);
    console.log('Linked new auth user:', linkData.user.id);
  }

  // 3. Update invitation record
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const { error: invErr } = await supabase
    .from('user_invitations')
    .update({
      token_hash: hashedToken,
      status: 'pending',
      expires_at: expiresAt,
      sent_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  if (invErr) console.error('Invitation update failed:', invErr.message);
  else console.log('Invitation updated, expires:', expiresAt);

  console.log('Tasha reset complete. Token ready for when we send the apology email.');
}

fixTasha().catch(console.error);
