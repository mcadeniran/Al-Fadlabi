'use server';

import { revalidatePath } from 'next/cache';

import type { OrderStatus } from '@/types/order';

import {
  confirmAdminOrderDeliveryFee,
  updateAdminOrderStatus,
} from '@/lib/admin/orders';
import { requireAdminAction } from '@/lib/admin/auth/require-admin';

type UpdateOrderStatusResult =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

type ConfirmDeliveryFeeResult =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
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

export async function confirmOrderDeliveryFeeAction(
  orderId: string,
  orderNumber: string,
  deliveryFee: number,
): Promise<ConfirmDeliveryFeeResult> {
  try {
    await requireAdminAction();

    if (!Number.isFinite(deliveryFee)) {
      return {
        success: false,
        error: 'Invalid delivery fee.',
      };
    }

    if (deliveryFee < 0) {
      return {
        success: false,
        error: 'Delivery fee cannot be negative.',
      };
    }

    await confirmAdminOrderDeliveryFee(orderId, deliveryFee);

    revalidatePath(`/admin/orders/${orderNumber}`);
    revalidatePath('/admin/orders');

    return {
      success: true,
    };
  } catch (error) {
    console.error('Failed to confirm admin order delivery fee:', error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to confirm delivery fee.',
    };
  }
}
