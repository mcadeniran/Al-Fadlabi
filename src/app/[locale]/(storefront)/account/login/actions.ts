'use server';

import { getCurrentAdmin } from '@/lib/auth/admin';
import { createClient } from '@/lib/supabase/server';

export type LoginDestination = 'admin' | 'customer';

export async function getLoginDestination(): Promise<LoginDestination> {
  const admin = await getCurrentAdmin();

  if (admin) {
    return 'admin';
  }

  return 'customer';
}

export async function signInWithUsername(
  username: string,
  password: string,
): Promise<{ error: string | null }> {
  const normalizedUsername = username.trim().toLowerCase();

  if (!normalizedUsername || !password) {
    return {
      error: 'INVALID_CREDENTIALS',
    };
  }

  const supabase = await createClient();

  /*
   * Username lookup happens server-side only.
   * The customer's email is never returned to the browser.
   */
  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .select('email')
    .eq('username', normalizedUsername)
    .maybeSingle();

  if (customerError || !customer?.email) {
    return {
      error: 'INVALID_CREDENTIALS',
    };
  }

  const { error: authError } = await supabase.auth.signInWithPassword({
    email: customer.email,
    password,
  });

  if (authError) {
    return {
      error: 'INVALID_CREDENTIALS',
    };
  }

  return {
    error: null,
  };
}
