import type { AdminRole } from '@/lib/auth/admin';

export type AdminPermission = 'users' | 'products' | 'inventories';

const rolePermissions: Record<AdminRole, AdminPermission[]> = {
  owner: ['users', 'products', 'inventories'],
  admin: ['products', 'inventories'],
  manager: [],
};

export function hasAdminPermission(
  role: AdminRole,
  permission: AdminPermission,
): boolean {
  return rolePermissions[role].includes(permission);
}
