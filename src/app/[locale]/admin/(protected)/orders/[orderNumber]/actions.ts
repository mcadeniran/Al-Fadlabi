'use server';

import { revalidatePath } from 'next/cache';

import type { OrderStatus } from '@/types/order';
import { updateAdminOrderStatus } from '@/lib/admin/orders';
import { requireAdminAction } from '@/lib/admin/auth/require-admin';

type UpdateOrderStatusResult =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

export async function updateOrderStatusAction(
  orderId: string,
  orderNumber: string,
  status: OrderStatus,
  rejectionNote?: string,
): Promise<UpdateOrderStatusResult> {
  try {
    await requireAdminAction();

    await updateAdminOrderStatus(orderId, status, rejectionNote);

    revalidatePath(`/admin/orders/${orderNumber}`);
    revalidatePath('/admin/orders');

    return {
      success: true,
    };
  } catch (error) {
    console.error('Failed to update admin order status:', error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to update order status.',
    };
  }
}
