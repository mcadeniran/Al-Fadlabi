'use server';

import { getCustomerProfile } from '@/lib/customers/customer-profile';

export async function getCheckoutCustomerProfile() {
  return getCustomerProfile();
}
