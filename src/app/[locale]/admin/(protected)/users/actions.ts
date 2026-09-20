'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';
import { requireAdminAction } from '@/lib/admin/auth/require-admin';

export type ManageAdminRoleResult =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

const allowedRoles = ['admin', 'manager'] as const;

type AssignableAdminRole = (typeof allowedRoles)[number];

export async function setAdminRoleAction(
  userId: string,
  role: AssignableAdminRole,
): Promise<ManageAdminRoleResult> {
  try {
    const admin = await requireAdminAction();

    if (admin.role !== 'owner') {
      throw new Error('Only owners can manage admin roles.');
    }

    if (!userId) {
      throw new Error('A user ID is required.');
    }

    if (!allowedRoles.includes(role)) {
      throw new Error('Invalid admin role.');
    }

    const supabase = await createClient();

    const { error } = await supabase.rpc('set_admin_role', {
      p_user_id: userId,
      p_role: role,
    });

    if (error) {
      console.error('Failed to set admin role:', error);

      throw new Error('Failed to update user role.');
    }

    revalidatePath('/admin/users');

    return {
      success: true,
    };
  } catch (error) {
    console.error('Failed to manage admin role:', error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to update user role.',
    };
  }
}

export async function revokeAdminRoleAction(
  userId: string,
): Promise<ManageAdminRoleResult> {
  try {
    const admin = await requireAdminAction();

    if (admin.role !== 'owner') {
      throw new Error('Only owners can revoke admin roles.');
    }

    if (!userId) {
      throw new Error('A user ID is required.');
    }

    const supabase = await createClient();

    const { error } = await supabase.rpc('revoke_admin_role', {
      p_user_id: userId,
    });

    if (error) {
      console.error('Failed to revoke admin role:', error);

      throw new Error('Failed to revoke user role.');
    }

    revalidatePath('/admin/users');

    return {
      success: true,
    };
  } catch (error) {
    console.error('Failed to revoke admin role:', error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to revoke user role.',
    };
  }
}
