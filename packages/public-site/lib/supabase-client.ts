/**
 * Browser-side Supabase client for public-site
 *
 * Used for client-side Supabase Auth operations (e.g., verifyOtp during activation).
 * Uses public anon key - safe to expose, RLS protects data.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
