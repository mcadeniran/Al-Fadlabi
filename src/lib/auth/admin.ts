import { createClient } from '@/lib/supabase/server';

export type AdminRole = 'owner' | 'manager' | 'admin';

type AdminUserRow = {
  role: AdminRole;
};

export async function getCurrentAdmin(): Promise<{
  id: string;
  role: AdminRole;
} | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from('admin_users')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const admin = data as AdminUserRow;

  return {
    id: user.id,
    role: admin.role,
  };
}

export async function isCurrentUserAdmin(): Promise<boolean> {
  const admin = await getCurrentAdmin();

  return admin !== null;
}
