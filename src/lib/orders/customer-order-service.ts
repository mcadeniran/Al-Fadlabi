import { createClient } from '@/lib/supabase/server';
import type {
  CustomerOrder,
  CustomerOrderItem,
  OrderStatus,
} from '@/types/order';
import type { Product } from '@/types/product';

/**
 * Raw order row returned by Supabase.
 *
 * This is an internal database shape.
 * It should not leak into the rest of the application.
 */
type CustomerOrderRow = {
  id: string;
  order_number: string;

  customer_id: string | null;

  customer_name: string;
  // customer_last_name: string;
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
  delivery_fee_confirmed: boolean;
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

  order_items: CustomerOrderItemRow[] | null;
};

/**
 * Raw order item row returned by Supabase.
 *
 * Again, this is deliberately kept internal to the service.
 */
type CustomerOrderItemRow = {
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
 * Fields selected from the orders table.
 *
 * The important part here is that we explicitly select the
 * historical product snapshot fields stored on order_items:
 *
 * - product_name
 * - product_slug
 * - product_gender
 * - product_image_url
 *
 * These are NOT reconstructed from the current products table.
 */
const orderSelect = `
  id,
  customer_id,
  status,
  order_number,

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
  delivery_fee_confirmed,
  total,

  

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
 * Safely converts a database numeric value into a number.
 *
 * PostgreSQL numeric fields may arrive as strings depending on
 * the Supabase/Postgres configuration.
 */
function toNumber(value: number | string): number {
  return typeof value === 'number' ? value : Number(value);
}

/**
 * Maps a raw database order item into the public CustomerOrderItem
 * read model.
 *
 * Notice that there is NO `Product` construction here.
 *
 * The product information belongs directly to the order item as
 * historical snapshot data.
 */
function mapCustomerOrderItem(row: CustomerOrderItemRow): CustomerOrderItem {
  return {
    id: row.id,

    productId: row.product_id ?? '',
    productSizeId: row.product_size_id ?? '',

    productName: row.product_name!,
    productSlug: row.product_slug,
    productGender: row.product_gender,
    productImageUrl: row.product_image_url ?? '',

    sizeMl: toNumber(row.size_ml),

    quantity: row.quantity,

    unitPrice: toNumber(row.unit_price),
    subtotal: toNumber(row.subtotal),
  };
}

/**
 * Maps a raw database order into the customer-facing
 * CustomerOrder read model.
 */
function mapCustomerOrder(row: CustomerOrderRow): CustomerOrder {
  const { firstName, lastName } = splitCustomerName(row.customer_name);
  return {
    id: row.id,
    orderNumber: row.order_number,

    customerId: row.customer_id,

    customer: {
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
    deliveryFeeConfirmed: row.delivery_fee_confirmed,
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

    items: (row.order_items ?? []).map(mapCustomerOrderItem),
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
 * Gets the currently authenticated customer's database ID.
 */
async function getAuthenticatedCustomerId(): Promise<string | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (customerError || !customer) {
    return null;
  }

  return customer.id;
}

export async function getCustomerOrders(): Promise<CustomerOrder[]> {
  const customerId = await getAuthenticatedCustomerId();

  if (!customerId) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('orders')
    .select(orderSelect)
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch customer orders:', error);
    return [];
  }

  return ((data ?? []) as CustomerOrderRow[]).map(mapCustomerOrder);
}

export async function getCustomerOrder(
  orderNumber: string,
): Promise<CustomerOrder | null> {
  const customerId = await getAuthenticatedCustomerId();

  if (!customerId) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('orders')
    .select(orderSelect)
    .eq('customer_id', customerId)
    .eq('order_number', orderNumber)
    .maybeSingle();

  if (error) {
    console.error('Failed to fetch customer order:', error);
    return null;
  }

  if (!data) {
    return null;
  }

  return mapCustomerOrder(data as CustomerOrderRow);
}
