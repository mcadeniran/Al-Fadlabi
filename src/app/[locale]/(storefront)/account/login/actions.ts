'use server';

import { getCurrentAdmin } from '@/lib/auth/admin';

export type LoginDestination = 'admin' | 'customer';

export async function getLoginDestination(): Promise<LoginDestination> {
  const admin = await getCurrentAdmin();

  if (admin) {
    return 'admin';
  }

  return 'customer';
}
