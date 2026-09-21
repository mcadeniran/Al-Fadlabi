import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth/admin';
import type { AdminRole } from '@/lib/auth/admin';

export async function requireAdmin(locale: string) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect(`/${locale}/shop`);
  }

  return admin;
}

export async function requireAdminRole(
  locale: string,
  allowedRoles: readonly AdminRole[],
) {
  const admin = await requireAdmin(locale);

  if (!allowedRoles.includes(admin.role)) {
    redirect(`/${locale}/admin`);
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

export async function requireAdminActionRole(
  allowedRoles: readonly AdminRole[],
) {
  const admin = await requireAdminAction();

  if (!allowedRoles.includes(admin.role)) {
    throw new Error('Forbidden.');
  }

  return admin;
}
