'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';

export async function updateInventoryStock(
  productSizeId: string,
  stockQuantity: number,
) {
  if (!Number.isInteger(stockQuantity) || stockQuantity < 0) {
    throw new Error('Invalid stock quantity.');
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('product_sizes')
    .update({
      stock_quantity: stockQuantity,
    })
    .eq('id', productSizeId);

  if (error) {
    throw new Error('Failed to update inventory.');
  }

  revalidatePath('/admin/inventory');
  revalidatePath('/ar/admin/inventory');
}
