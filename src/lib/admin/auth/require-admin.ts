import { redirect } from 'next/navigation';

import { getCurrentAdmin } from '@/lib/auth/admin';

export async function requireAdmin(locale: string) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect(`/${locale}/shop`);
  }

  return admin;
}

export async function requireAdminAction() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    throw new Error('Unauthorized.');
  }

  return admin;
}
