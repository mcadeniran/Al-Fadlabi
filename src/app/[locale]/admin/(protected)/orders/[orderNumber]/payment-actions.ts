'use server';

import { markAdminOrderAsPaid } from '@/lib/admin/orders';
import { revalidatePath } from 'next/cache';

type MarkOrderAsPaidResult =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

export async function markOrderAsPaidAction(
  orderId: string,
  orderNumber: string,
): Promise<MarkOrderAsPaidResult> {
  try {
    await markAdminOrderAsPaid(orderId);

    revalidatePath(`/admin/orders/${orderNumber}`);
    revalidatePath('/admin/orders');

    return {
      success: true,
    };
  } catch (error) {
    console.error('Failed to mark order as paid:', error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to mark order as paid.',
    };
  }
}
