import { createClient } from '@/lib/supabase/server';

export type AdminRole = 'owner' | 'manager' | 'admin';

export type ManagedUser = {
  customerId: string;
  userId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  email: string | null;
  role: AdminRole | null;
  adminUserId: string | null;
  createdAt: string;
};

export async function getManagedUsers(): Promise<ManagedUser[]> {
  const supabase = await createClient();

  const { data: customers, error: customerError } = await supabase
    .from('customers')
    .select(
      `
      id,
      user_id,
      first_name,
      last_name,
      full_name,
      phone,
      email,
      created_at
    `,
    )
    .order('created_at', { ascending: false });

  if (customerError) {
    console.error('Failed to load customers:', customerError);
    throw new Error('Unable to load customers.');
  }

  if (!customers?.length) {
    return [];
  }

  const userIds = customers.map((customer) => customer.user_id);

  const { data: adminUsers, error: adminError } = await supabase
    .from('admin_users')
    .select(
      `
      id,
      user_id,
      role
    `,
    )
    .in('user_id', userIds);

  if (adminError) {
    console.error('Failed to load admin roles:', adminError);
    throw new Error('Unable to load admin roles.');
  }

  const roleByUserId = new Map(
    (adminUsers ?? []).map((adminUser) => [
      adminUser.user_id,
      {
        id: adminUser.id,
        role: adminUser.role as AdminRole,
      },
    ]),
  );

  return customers.map((customer) => {
    const adminUser = roleByUserId.get(customer.user_id);

    return {
      customerId: customer.id,
      userId: customer.user_id,
      firstName: customer.first_name ?? '',
      lastName: customer.last_name ?? '',
      fullName: customer.full_name ?? '',
      phone: customer.phone ?? '',
      email: customer.email ?? null,
      role: adminUser?.role ?? null,
      adminUserId: adminUser?.id ?? null,
      createdAt: customer.created_at,
    };
  });
}
