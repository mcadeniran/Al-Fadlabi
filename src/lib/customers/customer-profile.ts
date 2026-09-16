import { createClient } from '@/lib/supabase/server';

export type CustomerProfile = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  email: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function getCustomerProfile(): Promise<CustomerProfile | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: customer, error } = await supabase
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
        created_at,
        updated_at
      `,
    )
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    console.error('Failed to load customer profile:', error);
    throw new Error('Unable to load customer profile.');
  }

  if (!customer) {
    return null;
  }

  return {
    id: customer.id,
    userId: customer.user_id,
    firstName: customer.first_name ?? '',
    lastName: customer.last_name ?? '',
    fullName: customer.full_name ?? '',
    phone: customer.phone ?? '',
    email: customer.email,
    createdAt: customer.created_at,
    updatedAt: customer.updated_at,
  };
}
