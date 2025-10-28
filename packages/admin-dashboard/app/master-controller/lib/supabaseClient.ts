/**
 * Supabase Client Initialization
 * Master Controller - Phase 9: Supabase Integration
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL'] || '';
const supabaseAnonKey = process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || '';
const supabaseServiceKey = process.env['SUPABASE_SERVICE_ROLE_KEY'] || process.env['SUPABASE_SECRET_KEY'] || '';

// Singleton instances
let supabaseInstance: SupabaseClient | null = null;
let supabaseServiceInstance: SupabaseClient | null = null;

/**
 * Get Supabase client instance (singleton pattern)
 */
export function getSupabaseClient(): SupabaseClient | null {
  // Check if credentials are available
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not found. Cloud features will be disabled.');
    return null;
  }

  // Return existing instance if already created
  if (supabaseInstance) {
    return supabaseInstance;
  }

  try {
    // Create new instance
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });

    return supabaseInstance;
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    return null;
  }
}

/**
 * Check if Supabase is configured
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser() {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      // Silent when no auth session (master-controller doesn't require login)
      if (error.message !== 'Auth session missing!') {
        console.error('Error getting current user:', error);
      }
      return null;
    }
    return user;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return Boolean(user);
}

/**
 * Get Supabase service role client (for admin/backend operations)
 * This client bypasses Row Level Security and has full database access.
 * ONLY use this in server-side API routes, NEVER expose to client.
 */
export function getSupabaseServiceClient(): SupabaseClient | null {
  // Check if service credentials are available
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Supabase service role credentials not found. Admin operations will be disabled.');
    return null;
  }

  // Return existing instance if already created
  if (supabaseServiceInstance) {
    return supabaseServiceInstance;
  }

  try {
    // Create service role client (bypasses RLS)
    supabaseServiceInstance = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    return supabaseServiceInstance;
  } catch (error) {
    console.error('Failed to initialize Supabase service client:', error);
    return null;
  }
}

export default getSupabaseClient;
