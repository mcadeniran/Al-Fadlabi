import { createClient } from '@/lib/supabase/server';
import type {
  AdminOrder,
  AdminOrderItem,
  OrderStatus,
  AdminOrderAuditLog,
} from '@/types/order';
import type { Product } from '@/types/product';

/**
 * ============================================================
 * DATABASE ROW TYPES
 * ============================================================
 *
 * These types represent the raw shape returned by Supabase.
 *
 * They stay inside this service and are mapped into AdminOrder
 * before anything is returned to the application.
 */

/**
 * Raw order item returned by Supabase.
 */
type AdminOrderItemRow = {
  id: string;

  product_id: string | null;
  product_size_id: string | null;

  product_name: Record<string, string> | null;
  product_slug: string | null;
  product_gender: Product['gender'] | null;
  product_image_url: string | null;

  size_ml: number | string;

  quantity: number;
  unit_price: number | string;
  subtotal: number | string;
};

/**
 * Raw order returned by Supabase.
 */
type AdminOrderRow = {
  id: string;
  order_number: string;

  customer_id: string | null;

  customer_name: string;
  customer_phone: string;
  customer_email: string | null;

  delivery_address: string;
  delivery_city: string;
  notes: string | null;

  delivery_method: 'standard' | 'express';

  payment_method: 'pay_on_delivery';
  payment_status: 'pending' | 'paid';

  subtotal: number | string;
  delivery_fee: number | string;
  total: number | string;

  status: string;

  created_at: string;

  confirmed_at: string | null;
  processed_at: string | null;
  dispatched_at: string | null;
  delivered_at: string | null;
  rejected_at: string | null;
  cancelled_at: string | null;

  rejection_note: string | null;

  order_items: AdminOrderItemRow[] | null;
};

/**
 * ============================================================
 * STATUS UPDATE RESPONSE
 * ============================================================
 *
 * This is the smaller object returned by the status RPC.
 *
 * We don't pretend that this is a complete AdminOrder because
 * the RPC only returns lifecycle information.
 */

type UpdateAdminOrderStatusRow = {
  id: string;
  order_number: string;
  status: string;

  created_at: string;

  confirmed_at: string | null;
  processed_at: string | null;
  dispatched_at: string | null;
  delivered_at: string | null;
  rejected_at: string | null;
  cancelled_at: string | null;

  rejection_note: string | null;
};

/**
 * ============================================================
 * SELECT
 * ============================================================
 */

const adminOrderSelect = `
  id,
  order_number,

  customer_id,
  customer_name,

  customer_phone,
  customer_email,

  delivery_address,
  delivery_city,
  notes,

  delivery_method,

  payment_method,
  payment_status,

  subtotal,
  delivery_fee,
  total,

  status,

  created_at,

  confirmed_at,
  processed_at,
  dispatched_at,
  delivered_at,
  rejected_at,
  cancelled_at,

  rejection_note,

  order_items (
    id,

    product_id,
    product_size_id,

    product_name,
    product_slug,
    product_gender,
    product_image_url,

    size_ml,

    quantity,
    unit_price,
    subtotal
  )
`;

/**
 * ============================================================
 * HELPERS
 * ============================================================
 */

/**
 * Converts a PostgreSQL numeric value into a JavaScript number.
 */
function toNumber(value: number | string): number {
  return typeof value === 'number' ? value : Number(value);
}

/**
 * Maps a database order item into AdminOrderItem.
 */
function mapAdminOrderItem(row: AdminOrderItemRow): AdminOrderItem {
  return {
    id: row.id,

    productId: row.product_id,
    productSizeId: row.product_size_id,

    productName: row.product_name,
    productSlug: row.product_slug,
    productGender: row.product_gender,
    productImageUrl: row.product_image_url,

    sizeMl: toNumber(row.size_ml),

    quantity: row.quantity,

    unitPrice: toNumber(row.unit_price),
    subtotal: toNumber(row.subtotal),
  };
}

function splitCustomerName(fullName: string): {
  firstName: string;

  lastName: string;
} {
  const parts = fullName.trim().split(/\s+/);

  if (parts.length === 0) {
    return {
      firstName: '',

      lastName: '',
    };
  }

  if (parts.length === 1) {
    return {
      firstName: parts[0],

      lastName: '',
    };
  }

  return {
    firstName: parts[0],

    lastName: parts.slice(1).join(' '),
  };
}

/**
 * Maps a raw database order into AdminOrder.
 */
function mapAdminOrder(row: AdminOrderRow): AdminOrder {
  const { firstName, lastName } = splitCustomerName(row.customer_name);
  return {
    id: row.id,
    orderNumber: row.order_number,

    customer: {
      id: row.customer_id,

      firstName: firstName,
      lastName: lastName,
      phone: row.customer_phone,
      email: row.customer_email,
    },

    deliveryAddress: {
      address: row.delivery_address,
      city: row.delivery_city,
      notes: row.notes ?? '',
    },

    deliveryMethod: row.delivery_method,

    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,

    subtotal: toNumber(row.subtotal),
    deliveryCost: toNumber(row.delivery_fee),
    total: toNumber(row.total),

    status: row.status as OrderStatus,

    createdAt: row.created_at,

    confirmedAt: row.confirmed_at,
    processedAt: row.processed_at,
    dispatchedAt: row.dispatched_at,
    deliveredAt: row.delivered_at,
    rejectedAt: row.rejected_at,
    cancelledAt: row.cancelled_at,

    rejectionNote: row.rejection_note,

    items: (row.order_items ?? []).map(mapAdminOrderItem),
  };
}

/**
 * ============================================================
 * GET ADMIN ORDERS
 * ============================================================
 *
 * Gets all orders for the admin order-management area.
 *
 * For now we intentionally keep this simple.
 *
 * Filtering, searching and pagination will be added once the
 * basic service is working correctly.
 */

export async function getAdminOrders(): Promise<AdminOrder[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('orders')
    .select(adminOrderSelect)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch admin orders:', error);
    return [];
  }

  return ((data ?? []) as AdminOrderRow[]).map(mapAdminOrder);
}

/**
 * ============================================================
 * GET ONE ADMIN ORDER
 * ============================================================
 *
 * Gets a single order using the public order number.
 */

export async function getAdminOrder(
  orderNumber: string,
): Promise<AdminOrder | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('orders')
    .select(adminOrderSelect)
    .eq('order_number', orderNumber)
    .maybeSingle();

  if (error) {
    console.error('Failed to fetch admin order:', error);
    return null;
  }

  if (!data) {
    return null;
  }

  return mapAdminOrder(data as AdminOrderRow);
}

/**
 * ============================================================
 * UPDATE ADMIN ORDER STATUS
 * ============================================================
 *
 * All lifecycle rules are enforced by the database RPC:
 *
 * public.update_admin_order_status()
 *
 * The service does not duplicate those rules.
 */

export async function updateAdminOrderStatus(
  orderId: string,
  status: OrderStatus,
  rejectionNote?: string,
): Promise<UpdateAdminOrderStatusRow | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('update_admin_order_status', {
    p_order_id: orderId,
    p_status: status,
    p_rejection_note: rejectionNote ?? null,
  });

  if (error) {
    console.error('Failed to update admin order status:', error);

    throw new Error(error.message || 'Failed to update order status.');
  }

  const rows = (data ?? []) as UpdateAdminOrderStatusRow[];

  if (rows.length === 0) {
    return null;
  }

  return rows[0];
}

export async function markAdminOrderAsPaid(orderId: string): Promise<{
  id: string;
  orderNumber: string;
  paymentStatus: 'pending' | 'paid';
} | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('mark_order_as_paid', {
    p_order_id: orderId,
  });

  if (error) {
    console.error('Failed to mark admin order as paid:', error);

    throw new Error(error.message || 'Failed to mark order as paid.');
  }

  const rows = (data ?? []) as Array<{
    id: string;
    order_number: string;
    payment_status: string;
  }>;

  if (rows.length === 0) {
    return null;
  }

  return {
    id: rows[0].id,
    orderNumber: rows[0].order_number,
    paymentStatus: rows[0].payment_status as 'pending' | 'paid',
  };
}

export async function getAdminOrderAuditLog(
  orderId: string,
): Promise<AdminOrderAuditLog[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('order_audit_log')
    .select(
      `
        id,
        order_id,
        actor_user_id,
        action,
        previous_status,
        new_status,
        previous_payment_status,
        new_payment_status,
        note,
        created_at
      `,
    )
    .eq('order_id', orderId)
    .order('created_at', {
      ascending: false,
    });

  if (error) {
    console.error('Failed to fetch admin order audit log:', error);

    throw new Error(error.message || 'Failed to fetch order audit history.');
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    orderId: row.order_id,
    actorUserId: row.actor_user_id,
    action: row.action as AdminOrderAuditLog['action'],
    previousStatus: row.previous_status as OrderStatus | null,
    newStatus: row.new_status as OrderStatus | null,
    previousPaymentStatus: row.previous_payment_status as
      | 'pending'
      | 'paid'
      | null,
    newPaymentStatus: row.new_payment_status as 'pending' | 'paid' | null,
    note: row.note,
    createdAt: row.created_at,
  }));
}
