'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';

type UpdateCustomerProfileResult =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

export async function updateCustomerProfile(
  firstName: string,
  lastName: string,
  phone: string,
): Promise<UpdateCustomerProfileResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: 'UNAUTHENTICATED',
    };
  }

  const trimmedFirstName = firstName.trim();
  const trimmedLastName = lastName.trim();
  const trimmedPhone = phone.trim();

  if (!trimmedFirstName || !trimmedLastName || !trimmedPhone) {
    return {
      success: false,
      error: 'REQUIRED_FIELDS',
    };
  }

  const fullName = `${trimmedFirstName} ${trimmedLastName}`.trim();

  const { error } = await supabase
    .from('customers')
    .update({
      first_name: trimmedFirstName,
      last_name: trimmedLastName,
      full_name: fullName,
      phone: trimmedPhone,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', user.id);

  if (error) {
    console.error('Failed to update customer profile:', error);

    return {
      success: false,
      error: 'UPDATE_FAILED',
    };
  }

  revalidatePath('/account');
  revalidatePath('/en/account');
  revalidatePath('/ar/account');

  return {
    success: true,
  };
}
