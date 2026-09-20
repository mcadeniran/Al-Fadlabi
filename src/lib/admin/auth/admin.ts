import { createClient } from '@/lib/supabase/server';

export type AdminRole = 'owner' | 'manager' | 'admin';

export type AdminUser = {
  id: string;
  userId: string;
  role: AdminRole;
  createdAt: string;
  updatedAt: string;
};

/**
 * Returns the currently authenticated admin user.
 *
 * Returns null when:
 * - there is no authenticated user, or
 * - the authenticated user is not present in admin_users.
 */
export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data: adminUser, error: adminError } = await supabase
    .from('admin_users')
    .select(
      `
      id,
      user_id,
      role,
      created_at,
      updated_at
    `,
    )
    .eq('user_id', user.id)
    .maybeSingle();

  if (adminError) {
    console.error('Failed to load admin user:', adminError);
    return null;
  }

  if (!adminUser) {
    return null;
  }

  return {
    id: adminUser.id,
    userId: adminUser.user_id,
    role: adminUser.role as AdminRole,
    createdAt: adminUser.created_at,
    updatedAt: adminUser.updated_at,
  };
}

/**
 * Returns true when the currently authenticated user
 * is registered in admin_users.
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const admin = await getCurrentAdmin();

  return admin !== null;
}
